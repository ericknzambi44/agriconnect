// src/features/transport/hooks/useAgencyDashboard.ts
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/supabase';
import { toast } from 'sonner';

export function useAgencyDashboard() {
  const [agency, setAgency] = useState<any>(null);
  const [stats, setStats] = useState({ toReceive: 0, toDeliver: 0, completed: 0 });
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const fetchAgencyContext = useCallback(async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const { data: linkData, error: linkError } = await supabase
        .from('agents_agence')
        .select('agence_id')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (linkError || !linkData) throw new Error("Lien agence introuvable");

      const { data: agenceDetails, error: agenceError } = await supabase
        .from('agence')
        .select('*')
        .eq('id', linkData.agence_id)
        .single();

      if (agenceError) throw agenceError;
      
      const adaptedAgency = {
        ...agenceDetails,
        nom_agence: agenceDetails.nom,
        ville_agence: agenceDetails.ville_territoire
      };
      
      setAgency(adaptedAgency);

      const { data: exps } = await supabase
        .from('expedition')
        .select('statut_expedition, id_agence_retrait');

      if (exps) {
        setStats({
          toReceive: exps.filter(e => e.statut_expedition === 'A_DEPOSER').length,
          toDeliver: exps.filter(e => e.statut_expedition === 'EN_TRANSIT' && e.id_agence_retrait === adaptedAgency.id).length,
          completed: exps.filter(e => e.statut_expedition === 'LIVRE' && e.id_agence_retrait === adaptedAgency.id).length,
        });
      }
    } catch (err: any) {
      console.error("Fetch Agency Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAgencyContext(); }, [fetchAgencyContext]);

  const processCode = async (code: string) => {
    const cleanCode = code?.trim().toUpperCase();
    if (!cleanCode || cleanCode.length < 6) return null;
    setProcessing(true);
    try {
      const { data, error } = await supabase
        .from('expedition')
        .select(`
          *,
          commande:commande_id (
            prix_total_commande,
            quantite_commandee,
            destination_ville,
            destination_details,
            annonce:annonce_id (produit:prod_id (nom_prod))
          ),
          vendeur:utilisateurs!vendeur_id (nom, prenom, numero_tel),
          acheteur:utilisateurs!acheteur_id (nom, prenom, numero_tel)
        `)
        .or(`code_depot.eq.${cleanCode},code_retrait.eq.${cleanCode}`)
        .maybeSingle();

      if (error || !data) {
        toast.error("Code invalide");
        return null;
      }
      return { ...data, actionType: data.code_depot === cleanCode ? 'DEPOT' : 'RETRAIT' };
    } finally {
      setProcessing(false);
    }
  };

  const confirmAction = async (expId: string, type: 'DEPOT' | 'RETRAIT') => {
    if (!agency?.id) {
      toast.error("Erreur: Agence non identifiée");
      return false;
    }

    setProcessing(true);
    try {
      const newStatus = type === 'DEPOT' ? 'EN_TRANSIT' : 'LIVRE';
      
      // LOG POUR DEBUG
      console.log(`Tentative d'update expédition ${expId} vers ${newStatus} pour l'agence ${agency.id}`);

      const { data, error } = await supabase
        .from('expedition')
        .update({ 
          statut_expedition: newStatus,
          id_agence_retrait: agency.id 
        })
        .eq('id', expId)
        .select(); // On demande le retour des données pour vérifier l'update

      if (error) {
        console.error("Erreur Supabase Update:", error);
        throw error;
      }

      if (data && data.length > 0) {
        console.log("Update réussi, nouvelles données:", data[0]);
        toast.success(`Opération ${type} validée !`);
        await fetchAgencyContext();
        return true;
      } else {
        console.warn("L'update n'a modifié aucune ligne. Vérifiez l'ID ou les RLS.");
        toast.error("L'opération n'a pas pu être enregistrée.");
        return false;
      }
    } catch (err: any) {
      console.error("Confirm Action Catch:", err);
      toast.error(`Erreur: ${err.message}`);
      return false;
    } finally {
      setProcessing(false);
    }
  };

  return { agency, stats, loading, processing, processCode, confirmAction };
}