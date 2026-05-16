// features/achat/hooks/useAchatSuivi.ts
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/supabase';
import { useAuthSession } from '@/features/auth/hooks/use-auth-session';
import { toast } from 'sonner';
import { AchatSuivi } from '../types';


export function useAchatSuivi() {
  const { profile } = useAuthSession();
  const [achats, setAchats] = useState<AchatSuivi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAchats = useCallback(async () => {
    if (!profile?.id) {
      setAchats([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Récupérer les commandes avec les relations
      const { data: commandes, error: cmdError } = await supabase
        .from('commande')
        .select(`
          id,
          created_at,
          quantite_commandee,
          prix_total_commande,
          annonce:annonce_id (
            produit:prod_id (
              id,
              nom_prod,
              unite,
              image
            )
          )
        `)
        .eq('acheteur_id', profile.id)
        .order('created_at', { ascending: false });

      if (cmdError) throw cmdError;

      // Extraire les IDs des commandes
      const commandeIds = commandes.map(c => c.id);
      let expeditionsMap = new Map();

      if (commandeIds.length > 0) {
        const { data: expeditions, error: expError } = await supabase
          .from('expedition')
          .select(`
            id,
            commande_id,
            statut_expedition,
            code_depot,
            code_retrait,
            code_depot_used_at,
            code_retrait_used_at,
            id_agence_depot,
            id_agence_retrait,
            agence_depot:agence!id_agence_depot (nom),
            agence_retrait:agence!id_agence_retrait (nom)
          `)
          .in('commande_id', commandeIds);

        if (expError) throw expError;

        expeditions.forEach(exp => {
          expeditionsMap.set(exp.commande_id, exp);
        });
      }

      // Construire les résultats en gérant le cas où les relations sont des tableaux
      const result: AchatSuivi[] = commandes.map(cmd => {
        // PostgREST peut retourner un tableau pour une relation 1-1
        const annonce = Array.isArray(cmd.annonce) ? cmd.annonce[0] : cmd.annonce;
        const produitData = annonce?.produit;
        const produit = Array.isArray(produitData) ? produitData[0] : produitData;

        const exp = expeditionsMap.get(cmd.id);
        
        let statut = 'EN_ATTENTE';
        let message = 'Votre commande a été enregistrée. En attente de création de l\'expédition.';
        let action = undefined;

        if (exp) {
          if (exp.code_retrait_used_at) {
            statut = 'LIVREE';
            message = 'Colis livré avec succès. Merci pour votre confiance !';
          } else if (exp.code_depot_used_at) {
            statut = 'EN_TRANSIT';
            message = 'Votre colis a été déposé en agence et est en cours d\'acheminement.';
            action = 'Vous serez notifié dès l\'arrivée.';
          } else if (exp.code_depot && !exp.code_depot_used_at) {
            statut = 'A_DEPOSER';
            message = 'Le vendeur n\'a pas encore déposé le colis. Une notification lui a été envoyée.';
            action = 'Le suivi s\'actualisera automatiquement.';
          } else {
            statut = exp.statut_expedition || 'EN_ATTENTE';
            message = `Statut : ${statut}. Suivez l'évolution dans votre espace.`;
          }
        } else {
          message = 'Votre paiement est sécurisé. Le vendeur prépare l\'expédition.';
          action = 'Vous recevrez un code de suivi sous 24h.';
        }

        return {
          id: cmd.id,
          date_commande: cmd.created_at,
          quantite: cmd.quantite_commandee,
          prix_total: cmd.prix_total_commande,
          produit: produit ? {
            id: produit.id,
            nom: produit.nom_prod,
            unite: produit.unite,
            image: produit.image,
          } : { id: '', nom: 'Produit inconnu', unite: '' },
          expedition: exp ? {
            id: exp.id,
            statut: statut,
            code_depot: exp.code_depot,
            code_retrait: exp.code_retrait,
            code_depot_used_at: exp.code_depot_used_at,
            code_retrait_used_at: exp.code_retrait_used_at,
            agence_depot_nom: exp.agence_depot?.nom,
            agence_retrait_nom: exp.agence_retrait?.nom,
          } : undefined,
          message_statut: message,
          action_requise: action,
        };
      });

      setAchats(result);
    } catch (err: any) {
      console.error("Erreur chargement suivi achats:", err);
      setError(err.message);
      toast.error("Impossible de charger vos achats");
    } finally {
      setLoading(false);
    }
  }, [profile?.id]);

  useEffect(() => {
    fetchAchats();
  }, [fetchAchats]);

  const refresh = useCallback(() => {
    fetchAchats();
  }, [fetchAchats]);

  return { achats, loading, error, refresh };
}