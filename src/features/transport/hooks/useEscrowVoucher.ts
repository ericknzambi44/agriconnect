// src/features/transport/hooks/useEscrowVoucher.ts
import { useState } from 'react';
import { supabase } from '@/supabase';
import { toast } from "sonner";

export function useEscrowVoucher() {
  const [processing, setProcessing] = useState(false);

  // ÉTAPE A : LE VENDEUR DÉPOSE (Active la soustraction de stock via Trigger)
  const validerDepotVendeur = async (expeditionId: string, codeDepot: string) => {
    setProcessing(true);
    try {
      // 1. Vérification du code
      const { data: exp } = await supabase
        .from('expeditions')
        .select('code_depot')
        .eq('id', expeditionId)
        .single();

      if (exp?.code_depot !== codeDepot.trim().toUpperCase()) {
        throw new Error("Code de dépôt invalide. Vérification échouée.");
      }

      // 2. Update Statut -> Déclenche le Trigger SQL 'protocole_sequestre_stock'
      const { error } = await supabase
        .from('expeditions')
        .update({ 
          statut: 'RECU_AGENCE',
          poids_verifie: 0 // À remplir via un input plus tard
        })
        .eq('id', expeditionId);

      if (error) throw error;
      toast.success("DEPOT_VALIDE : Les stocks ont été synchronisés.");
      return true;
    } catch (err: any) {
      toast.error(err.message);
      return false;
    } finally {
      setProcessing(false);
    }
  };

  // ÉTAPE B : LIVRAISON FINALE À L'ACHETEUR
  const validerLivraisonFinale = async (expeditionId: string, codeRetrait: string) => {
    setProcessing(true);
    try {
      const { data: exp } = await supabase
        .from('expeditions')
        .select('code_retrait')
        .eq('id', expeditionId)
        .single();

      if (exp?.code_retrait !== codeRetrait.trim().toUpperCase()) {
        throw new Error("Code de retrait incorrect.");
      }

      const { error } = await supabase
        .from('expeditions')
        .update({ statut: 'LIVRE' }) // Libère le paiement dans le trigger
        .eq('id', expeditionId);

      if (error) throw error;
      toast.success("LIVRAISON_TERMINEE : Paiement libéré pour le vendeur.");
      return true;
    } catch (err: any) {
      toast.error(err.message);
      return false;
    } finally {
      setProcessing(false);
    }
  };

  return { validerDepotVendeur, validerLivraisonFinale, processing };
}