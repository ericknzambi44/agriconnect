// src/features/transport/hooks/useAgencyDashboard.ts
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/supabase';
import { toast } from 'sonner';

export function useAgencyDashboard(agencyId: string | undefined) {
  const [myStats, setMyStats] = useState({ toDeliver: 0, completed: 0 });
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    if (!agencyId) return;
    setLoading(true);
    try {
      // 1. Stats de l'agence
      const { data: myExps } = await supabase
        .from('expedition')
        .select('statut_expedition')
        .eq('id_agence_retrait', agencyId);

      if (myExps) {
        setMyStats({
          toDeliver: myExps.filter(e => e.statut_expedition === 'EN_TRANSIT').length,
          completed: myExps.filter(e => e.statut_expedition === 'LIVRE').length,
        });
      }

      // 2. Opportunités globales (A_DEPOSER)
      const { data: globalOpps } = await supabase
        .from('expedition')
        .select(`
          id, destination_ville, statut_expedition, created_at,
          commande:commande_id (prix_total_commande, quantite_commandee, annonce:annonce_id (produit:prod_id (nom_prod))),
          vendeur:utilisateurs!vendeur_id (nom, prenom, numero_tel)
        `)
        .eq('statut_expedition', 'A_DEPOSER')
        .order('created_at', { ascending: false });

      setOpportunities(globalOpps || []);
    } catch (err) {
      console.error("Dashboard Fetch Error");
    } finally {
      setLoading(false);
    }
  }, [agencyId]);

  useEffect(() => { fetchDashboardData(); }, [fetchDashboardData]);

  const processCode = async (code: string) => {
    const cleanCode = code?.trim().toUpperCase();
    if (!cleanCode || !agencyId) return null;
    setProcessing(true);
    try {
      const { data } = await supabase
        .from('expedition')
        .select('*, commande:commande_id(*), vendeur:utilisateurs!vendeur_id(*), acheteur:utilisateurs!acheteur_id(*)')
        .or(`code_depot.eq.${cleanCode},code_retrait.eq.${cleanCode}`)
        .maybeSingle();

      if (!data) {
        toast.error("Code inconnu");
        return null;
      }

      const isDepot = data.code_depot === cleanCode;
      const isRetrait = data.code_retrait === cleanCode;

      if ((isDepot && data.code_depot_used_at) || (isRetrait && data.code_retrait_used_at)) {
        toast.error("Code déjà utilisé");
        return null;
      }

      if (isRetrait && data.id_agence_retrait !== agencyId) {
        toast.error("Mauvaise agence de retrait");
        return null;
      }

      return { ...data, actionType: isDepot ? 'DEPOT' : 'RETRAIT' };
    } finally {
      setProcessing(false);
    }
  };

  const confirmAction = async (expId: string, type: 'DEPOT' | 'RETRAIT') => {
    if (!agencyId) return false;
    setProcessing(true);
    try {
      const updatePayload: any = { 
        statut_expedition: type === 'DEPOT' ? 'EN_TRANSIT' : 'LIVRE',
        [type === 'DEPOT' ? 'code_depot_used_at' : 'code_retrait_used_at']: new Date().toISOString()
      };
      if (type === 'DEPOT') updatePayload.id_agence_depot = agencyId;

      const { error } = await supabase.from('expedition').update(updatePayload).eq('id', expId);
      if (error) throw error;

      toast.success("Action validée !");
      await fetchDashboardData();
      return true;
    } catch {
      toast.error("Erreur de synchro");
      return false;
    } finally {
      setProcessing(false);
    }
  };

  return { myStats, opportunities, loading, processing, processCode, confirmAction, refresh: fetchDashboardData };
}