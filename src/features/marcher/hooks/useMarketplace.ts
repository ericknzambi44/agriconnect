import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/supabase';
import { useAuthSession } from '@/features/auth/hooks/use-auth-session';
import { toast } from 'sonner';

// --- TYPES ET INTERFACES ---

export interface MarketAnnonce {
  id: string;
  prix_total: number;
  date_pub: string;
  statut: string;
  prod_id: string;
  user_id: string;
  quantite_vendre: number;
  quantite_restante: number;
  produit: {
    id: string;
    nom_prod: string;
    prix_prod: number;
    quantite_prod: number;
    unite: string;
    image: string; // Ajouté pour l'esthétique du marché
    categorie: {
      id: string;
      libelle_categorie: string;
    };
  };
}

export interface Commande {
  id: string;
  annonce_id: string;
  acheteur_id: string;
  quantite_commandee: number;
  prix_total_commande: number;
  statut: 'en_attente' | 'validee' | 'annulee';
  created_at: string;
  annonce?: MarketAnnonce;
}

export function useMarketplace() {
  const { profile } = useAuthSession();
  const [loading, setLoading] = useState(false);
  const [annonces, setAnnonces] = useState<MarketAnnonce[]>([]);
  const [mesCommandes, setMesCommandes] = useState<Commande[]>([]);

  // --- 1. RÉCUPÉRER LES ANNONCES (Filtrées sur le stock disponible) ---
  const fetchMarket = useCallback(async (categorieId?: string) => {
    setLoading(true);
    try {
      let query = supabase
        .from('annonce')
        .select(`
          *,
          produit:prod_id (
            id,
            nom_prod,
            prix_prod,
            quantite_prod,
            unite,
            image,
            categorie_id,
            categorie:categorie_id (id, libelle_categorie)
          )
        `)
        .eq('statut', 'en_attente')
        .gt('quantite_restante', 0);

      // Filtre optionnel par catégorie
      if (categorieId && categorieId !== 'all') {
        query = query.filter('produit.categorie_id', 'eq', categorieId);
      }

      const { data, error } = await query.order('date_pub', { ascending: false });

      if (error) throw error;
      setAnnonces((data as any) || []);
    } catch (error: any) {
      console.error("Erreur Marché:", error);
      toast.error("Échec de connexion au marché");
    } finally {
      setLoading(false);
    }
  }, []);

  // --- 2. RÉCUPÉRER L'HISTORIQUE DES COMMANDES ---
  const fetchMesCommandes = useCallback(async () => {
    if (!profile?.id) return;
    try {
      const { data, error } = await supabase
        .from('commande')
        .select(`
          *,
          annonce:annonce_id (
            *,
            produit:prod_id (
              id,
              nom_prod,
              prix_prod,
              unite,
              image,
              categorie:categorie_id (id, libelle_categorie)
            )
          )
        `)
        .eq('acheteur_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMesCommandes((data as any) || []);
    } catch (error) {
      console.error("Erreur historique:", error);
    }
  }, [profile?.id]);

  // --- 3. PASSER UNE COMMANDE ---
  const passerCommande = async (annonce: MarketAnnonce, quantiteSouhaitee: number) => {
    if (!profile?.id) {
      toast.error("Veuillez vous connecter");
      return null;
    }

    if (quantiteSouhaitee > annonce.quantite_restante) {
      toast.error(`Volume insuffisant. Disponible: ${annonce.quantite_restante} ${annonce.produit.unite}`);
      return null;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('commande')
        .insert([{
          annonce_id: annonce.id,
          acheteur_id: profile.id,
          quantite_commandee: quantiteSouhaitee,
          prix_total_commande: quantiteSouhaitee * annonce.produit.prix_prod,
          statut: 'en_attente'
        }])
        .select()
        .single();

      if (error) throw error;
      
      toast.success("DEMANDE ENVOYÉE", {
        description: `Réservation pour ${quantiteSouhaitee} ${annonce.produit.unite} effectuée.`
      });
      
      fetchMesCommandes(); 
      return data;
    } catch (error: any) {
      toast.error("Erreur lors de la commande");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // --- 4. MODIFIER UNE COMMANDE ---
  const modifierCommande = async (commandeId: string, nouvelleQuantite: number, annonce: MarketAnnonce) => {
    if (nouvelleQuantite > annonce.quantite_restante) {
      toast.error("Quantité indisponible sur cette annonce");
      return;
    }

    try {
      const { error } = await supabase
        .from('commande')
        .update({ 
          quantite_commandee: nouvelleQuantite,
          prix_total_commande: nouvelleQuantite * annonce.produit.prix_prod 
        })
        .eq('id', commandeId)
        .eq('statut', 'en_attente');

      if (error) throw error;
      toast.success("COMMANDE MISE À JOUR");
      fetchMesCommandes();
    } catch (error: any) {
      toast.error("Échec de la modification");
    }
  };

  // --- 5. ANNULER UNE COMMANDE ---
  const annulerCommande = async (commandeId: string) => {
    try {
      const { error } = await supabase
        .from('commande')
        .delete()
        .eq('id', commandeId)
        .eq('statut', 'en_attente');

      if (error) throw error;
      setMesCommandes(prev => prev.filter(c => c.id !== commandeId));
      toast.success("COMMANDE ANNULÉE");
    } catch (error: any) {
      toast.error("Action impossible");
    }
  };

  useEffect(() => {
    fetchMarket();
    fetchMesCommandes();
  }, [profile?.id, fetchMarket, fetchMesCommandes]);

  return {
    annonces,
    mesCommandes,
    loading,
    fetchMarket,
    fetchMesCommandes,
    passerCommande,
    modifierCommande,
    annulerCommande,
    refresh: () => { fetchMarket(); fetchMesCommandes(); }
  };
}