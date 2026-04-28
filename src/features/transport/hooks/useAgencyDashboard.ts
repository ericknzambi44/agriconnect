import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/supabase';
import { toast } from 'sonner';

export function useAgencyDashboard(agencyId: string | undefined) {
  const [myStats, setMyStats] = useState({ toDeliver: 0, completed: 0 });
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // 1. Récupération des données du Dashboard
  const fetchDashboardData = useCallback(async () => {
    if (!agencyId) return;
    setLoading(true);
    try {
      const { data: myExps } = await supabase
        .from('expedition')
        .select('statut_expedition')
        .or(`id_agence_retrait.eq.${agencyId},id_agence_depot.eq.${agencyId}`);

      if (myExps) {
        setMyStats({
          toDeliver: myExps.filter(e => e.statut_expedition === 'EN_TRANSIT').length,
          completed: myExps.filter(e => e.statut_expedition === 'LIVRE').length,
        });
      }

      const { data: globalOpps } = await supabase
        .from('expedition')
        .select(`
          id, 
          statut_expedition, 
          created_at,
          commande:commande_id (
            prix_total_commande, 
            destination_ville,
            destination_details,
            annonce:annonce_id (produit:prod_id (nom_prod))
          ),
          vendeur:utilisateurs!vendeur_id (nom, prenom, numero_tel)
        `)
        .eq('statut_expedition', 'A_DEPOSER')
        .order('created_at', { ascending: false });

      setOpportunities(globalOpps || []);
    } catch (err) {
      console.error("Erreur Dashboard:", err);
      toast.error("Impossible de charger les statistiques");
    } finally {
      setLoading(false);
    }
  }, [agencyId]);

  useEffect(() => { fetchDashboardData(); }, [fetchDashboardData]);

  // 2. Traitement des codes (Dépôt ou Retrait)
  const processCode = async (code: string) => {
    const cleanCode = code?.trim().toUpperCase();
    if (!cleanCode || !agencyId) return null;
    
    setProcessing(true);
    try {
      const { data, error } = await supabase
        .from('expedition')
        .select(`
          *,
          commande:commande_id (
            id, 
            prix_total_commande, 
            destination_ville, 
            destination_details,
            annonce:annonce_id (
              produit:prod_id (nom_prod)
            )
          ),
          vendeur:utilisateurs!vendeur_id (nom, prenom, numero_tel),
          acheteur:utilisateurs!acheteur_id (nom, prenom, numero_tel)
        `)
        .or(`code_depot.eq.${cleanCode},code_retrait.eq.${cleanCode}`)
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        toast.error("Code introuvable dans le système");
        return null;
      }

      const isDepot = data.code_depot === cleanCode;
      const isRetrait = data.code_retrait === cleanCode;

      if ((isDepot && data.code_depot_used_at) || (isRetrait && data.code_retrait_used_at)) {
        toast.error("Ce code a déjà été validé");
        return null;
      }

      if (isRetrait) {
        if (data.id_agence_retrait && data.id_agence_retrait !== agencyId) {
          toast.error(`Ce colis est réservé pour l'agence : ${data.id_agence_retrait}`);
          return null;
        }
      }

      // On extrait le nom du produit pour simplifier l'usage côté UI
      const productName = data.commande?.annonce?.produit?.nom_prod || "Produit inconnu";

      return { 
        ...data, 
        actionType: isDepot ? 'DEPOT' : 'RETRAIT',
        productName: productName,
        destination: data.commande?.destination_ville || "Non précisée"
      };
    } catch (err) {
      toast.error("Erreur lors de la lecture du code");
      return null;
    } finally {
      setProcessing(false);
    }
  };

  // 3. Confirmation de l'action
  const confirmAction = async (expId: string, type: 'DEPOT' | 'RETRAIT') => {
    if (!agencyId) return false;
    setProcessing(true);

    try {
      const now = new Date().toISOString();
      const updatePayload: any = { 
        statut_expedition: type === 'DEPOT' ? 'EN_TRANSIT' : 'LIVRE',
        [type === 'DEPOT' ? 'code_depot_used_at' : 'code_retrait_used_at']: now
      };

      if (type === 'DEPOT') {
        updatePayload.id_agence_depot = agencyId;
      } 
      else if (type === 'RETRAIT') {
        updatePayload.id_agence_retrait = agencyId; 
      }

      const { error } = await supabase
        .from('expedition')
        .update(updatePayload)
        .eq('id', expId);

      if (error) throw error;

      toast.success(type === 'DEPOT' ? "Colis reçu et en transit !" : "Colis livré avec succès !");
      await fetchDashboardData();
      return true;
    } catch (err) {
      console.error("Sync Error:", err);
      toast.error("Erreur de synchronisation");
      return false;
    } finally {
      setProcessing(false);
    }
  };

  return { 
    myStats, 
    opportunities, 
    loading, 
    processing, 
    processCode, 
    confirmAction, 
    refresh: fetchDashboardData 
  };
}