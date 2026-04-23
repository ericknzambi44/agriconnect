// src/features/transport/hooks/useAgencyDashboard.ts
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/supabase';
import { toast } from 'sonner';

export function useAgencyDashboard() {
  const [agency, setAgency] = useState<any>(null);
  const [myStats, setMyStats] = useState({ toDeliver: 0, completed: 0 });
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const fetchAgencyContext = useCallback(async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const { data: linkData } = await supabase
        .from('agents_agence')
        .select('agence_id')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (linkData) {
        const { data: agenceDetails } = await supabase
          .from('agence')
          .select('*')
          .eq('id', linkData.agence_id)
          .single();

        if (agenceDetails) {
          setAgency({ 
            ...agenceDetails, 
            nom_agence: agenceDetails.nom, 
            ville_agence: agenceDetails.ville_territoire 
          });

          const { data: myExps } = await supabase
            .from('expedition')
            .select('statut_expedition')
            .eq('id_agence_retrait', agenceDetails.id);

          if (myExps) {
            setMyStats({
              toDeliver: myExps.filter(e => e.statut_expedition === 'EN_TRANSIT').length,
              completed: myExps.filter(e => e.statut_expedition === 'LIVRE').length,
            });
          }
        }
      }

      const { data: globalOpps } = await supabase
        .from('expedition')
        .select(`
          id,
          destination_ville,
          statut_expedition,
          created_at,
          commande:commande_id (
            prix_total_commande,
            quantite_commandee,
            annonce:annonce_id (produit:prod_id (nom_prod))
          ),
          vendeur:utilisateurs!vendeur_id (nom, prenom, numero_tel)
        `)
        .eq('statut_expedition', 'A_DEPOSER')
        .order('created_at', { ascending: false });

      setOpportunities(globalOpps || []);

    } catch (err: any) {
      console.error("[FETCH CONTEXT] Erreur silencieuse");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAgencyContext(); }, [fetchAgencyContext]);

  // --- SCAN DE CODE (AVEC VÉRIFICATION D'USAGE) ---
  const processCode = async (code: string) => {
    const cleanCode = code?.trim().toUpperCase();
    if (!cleanCode || cleanCode.length < 6) return null;
    setProcessing(true);
    
    try {
      const { data, error } = await supabase
        .from('expedition')
        .select(`
          id, code_depot, code_retrait, statut_expedition,
          code_depot_used_at, code_retrait_used_at,
          vendeur_id, acheteur_id, commande_id, id_agence_retrait,
          commande:commande_id (
            prix_total_commande,
            quantite_commandee,
            annonce:annonce_id (produit:prod_id (nom_prod))
          ),
          vendeur:utilisateurs!vendeur_id (nom, prenom, numero_tel),
          acheteur:utilisateurs!acheteur_id (nom, prenom, numero_tel)
        `)
        .or(`code_depot.eq.${cleanCode},code_retrait.eq.${cleanCode}`)
        .maybeSingle();

      if (error || !data) {
        toast.error("Code inconnu ou expédition introuvable");
        return null;
      }

      const isDepot = data.code_depot === cleanCode;
      const isRetrait = data.code_retrait === cleanCode;

      // LOGIQUE ANTI-DOUBLE : Vérification des timestamps
      if (isDepot && data.code_depot_used_at) {
        toast.error(`Code de dépôt déjà utilisé le ${new Date(data.code_depot_used_at).toLocaleString()}`);
        return null;
      }

      if (isRetrait && data.code_retrait_used_at) {
        toast.error(`Code de retrait déjà utilisé le ${new Date(data.code_retrait_used_at).toLocaleString()}`);
        return null;
      }

      // Protection Agence de retrait
      if (isRetrait && data.id_agence_retrait !== agency?.id) {
        toast.error("Attention : ce colis est destiné à une autre agence.");
        return null;
      }

      return { 
        ...data, 
        actionType: isDepot ? 'DEPOT' : (isRetrait ? 'RETRAIT' : null) 
      };

    } catch (err) {
      return null;
    } finally {
      setProcessing(false);
    }
  };

  // --- CONFIRMATION (MISE À JOUR DES TIMESTAMPS) ---
  const confirmAction = async (expId: string, type: 'DEPOT' | 'RETRAIT') => {
    if (!agency?.id) {
      toast.error("Erreur de session agence");
      return false;
    }
    setProcessing(true);
    
    try {
      const now = new Date().toISOString();
      const updatePayload: any = { 
        statut_expedition: type === 'DEPOT' ? 'EN_TRANSIT' : 'LIVRE',
        // On marque l'usage immédiat du code concerné
        [type === 'DEPOT' ? 'code_depot_used_at' : 'code_retrait_used_at']: now
      };

      if (type === 'DEPOT') {
        updatePayload.id_agence_depot = agency.id; 
      }

      const { error } = await supabase
        .from('expedition')
        .update(updatePayload)
        .eq('id', expId);

      if (error) {
        if (error.code === 'P0001') {
          toast.error("Action refusée : le flux est déjà verrouillé.");
        } else {
          toast.error("Erreur de synchronisation.");
        }
        throw error;
      }

      toast.success(type === 'DEPOT' ? "Réception validée ! 🚀" : "Livraison terminée ! ✅");
      
      await fetchAgencyContext();
      return true;

    } catch (err: any) {
      console.error("[CONFIRM_ACTION] Erreur technique");
      return false;
    } finally {
      setProcessing(false);
    }
  };

  return { 
    agency, 
    myStats, 
    opportunities, 
    loading, 
    processing, 
    processCode, 
    confirmAction 
  };
}