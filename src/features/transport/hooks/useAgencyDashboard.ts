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

      // 1. Récupérer le lien Agent -> Agence
      const { data: linkData } = await supabase
        .from('agents_agence')
        .select('agence_id')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (linkData) {
        // 2. Récupérer les détails de l'agence
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

          // 3. Stats basées sur les expéditions liées à cette agence de retrait
          const { data: myExps } = await supabase
            .from('expedition')
            .select('statut_expedition')
            .eq('id_agence_retrait', agenceDetails.id);

          if (myExps) {
            setMyStats({
              // EN_TRANSIT = Colis en route vers cette agence ou déjà déposés
              toDeliver: myExps.filter(e => e.statut_expedition === 'EN_TRANSIT').length,
              completed: myExps.filter(e => e.statut_expedition === 'LIVRE').length,
            });
          }
        }
      }

      // 4. OPPORTUNITÉS (Colis en attente de dépôt partout dans le réseau)
      const { data: globalOpps, error: oppError } = await supabase
        .from('expedition')
        .select(`
          id,
          destination_ville,
          statut_expedition,
          created_at,
          commande:commande_id (
            prix_total_commande,
            quantite_commandee,
            annonce:annonce_id (
              produit:prod_id (nom_prod)
            )
          ),
          vendeur:utilisateurs!vendeur_id (nom, prenom, numero_tel)
        `)
        .eq('statut_expedition', 'A_DEPOSER')
        .order('created_at', { ascending: false });

      if (oppError) {
        console.error("[FETCH OPPS] Erreur SQL:", oppError.message);
        setOpportunities([]);
      } else {
        setOpportunities(globalOpps || []);
      }

    } catch (err: any) {
      console.error("[FETCH CONTEXT] Global Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAgencyContext(); }, [fetchAgencyContext]);

  // --- SCAN DE CODE ---
  const processCode = async (code: string) => {
    const cleanCode = code?.trim().toUpperCase();
    if (!cleanCode || cleanCode.length < 6) return null;
    setProcessing(true);
    
    try {
      const { data, error } = await supabase
        .from('expedition')
        .select(`
          id,
          code_depot,
          code_retrait,
          statut_expedition,
          vendeur_id,
          acheteur_id,
          commande_id,
          id_agence_retrait,
          commande:commande_id (
            prix_total_commande,
            quantite_commandee,
            destination_ville,
            annonce:annonce_id (produit:prod_id (nom_prod))
          ),
          vendeur:utilisateurs!vendeur_id (nom, prenom, numero_tel),
          acheteur:utilisateurs!acheteur_id (nom, prenom, numero_tel)
        `)
        .or(`code_depot.eq.${cleanCode},code_retrait.eq.${cleanCode}`)
        .maybeSingle();

      if (error || !data) {
        toast.error("Code invalide ou introuvable");
        return null;
      }

      const isDepot = data.code_depot === cleanCode;
      const isRetrait = data.code_retrait === cleanCode;

      return { 
        ...data, 
        actionType: isDepot ? 'DEPOT' : (isRetrait ? 'RETRAIT' : null) 
      };

    } catch (err) {
      console.error("[PROCESS CODE] Exception:", err);
      return null;
    } finally {
      setProcessing(false);
    }
  };

  // --- CONFIRMATION DE L'ACTION ---
  const confirmAction = async (expId: string, type: 'DEPOT' | 'RETRAIT') => {
    if (!agency?.id) {
      toast.error("Contexte agence manquant");
      return false;
    }
    setProcessing(true);
    
    try {
      // Pour le DEPOT, on passe en EN_TRANSIT (le trigger SQL créera le code_retrait)
      // Pour le RETRAIT, on passe en LIVRE
      const updatePayload: any = { 
        statut_expedition: type === 'DEPOT' ? 'EN_TRANSIT' : 'LIVRE' 
      };

      const { data, error } = await supabase
        .from('expedition')
        .update(updatePayload)
        .eq('id', expId)
        .select(); 

      if (error) throw error;

      if (!data || data.length === 0) {
        toast.error("Mise à jour échouée");
        return false;
      }

      toast.success(type === 'DEPOT' ? "Colis en transit ! 🚀" : "Colis livré ! ✅");
      
      // Rafraîchissement global des stats et opportunités
      await fetchAgencyContext();
      return true;

    } catch (err: any) {
      console.error("[CONFIRM_ACTION] Erreur:", err);
      toast.error("Échec de la validation");
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