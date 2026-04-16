import { useState } from 'react';
import { MockMobileMoneyService, PaymentRequest } from '../services/paymentService';
import { supabase } from '@/supabase';
import { toast } from "sonner";

export const usePayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeOrderAndPayment = async (orderData: any, paymentRequest: PaymentRequest) => {
    if (!window.navigator.onLine) {
      toast.error("ERREUR RÉSEAU", {
        description: "Vérifiez votre connexion internet avant de payer.",
        className: "bg-red-950 border-red-500 text-white font-black uppercase italic text-[10px]"
      });
      return { success: false };
    }

    setLoading(true);
    setError(null);

    try {
      // --- ÉTAPE 1 : PAIEMENT MOBILE ---
      toast.info("INITIALISATION", { description: "Lancement du protocole de paiement..." });
      const paymentResult = await MockMobileMoneyService.processPayment(paymentRequest);

      if (paymentResult.success) {
        
        // --- ÉTAPE 2 : INSERTION COMMANDE (AVEC DESTINATION) ---
        // Le Trigger SQL s'activera dès cette insertion car statut_paiement est 'PAYEE'
        const { data: commande, error: orderError } = await supabase
          .from('commande')
          .insert([{
            annonce_id: orderData.annonce_id,
            acheteur_id: orderData.acheteur_id,
            quantite_commandee: Number(orderData.quantite),
            prix_total_commande: Number(orderData.total),
            statut: 'en_attente',
            statut_paiement: 'PAYEE', // Déclenche le Super-Trigger
            numero_suivi: paymentResult.transactionId,
            // NOUVEAUX CHAMPS POUR L'EXPÉDITION :
            destination_ville: orderData.destination_ville, 
            destination_details: orderData.destination_details,
            id_agence_retrait: orderData.id_agence_retrait || null 
          }])
          .select()
          .single();

        if (orderError) {
          console.error("ERREUR CRITIQUE COMMANDE:", orderError);
          toast.warning("ALERTE SYSTÈME", {
            description: "Paiement validé, mais synchronisation base de données échouée. Ref: " + paymentResult.transactionId,
            duration: 10000,
          });
          throw new Error("Erreur de synchronisation base de données.");
        }

        // --- ÉTAPE 3 : LOG PAIEMENT ---
        const { error: payError } = await supabase
          .from('payement') 
          .insert([{
            id_utilisateur: orderData.acheteur_id,
            commande_id: commande.id,
            montant: Number(orderData.total),
            reference: paymentResult.transactionId,
            statut: 'SUCCES'
          }]);

        if (payError) {
          console.error("Log paiement ignoré (Erreur de liaison):", payError);
        }

        // --- OK COOL : TOUT EST BON ---
        toast.success("ORDRE VALIDÉ", {
          description: "Le paiement séquestre est actif. Votre colis est en attente d'expédition.",
          className: "bg-emerald-950 border-emerald-500 text-emerald-500 font-black uppercase italic text-[10px]"
        });

        return { success: true, commande };

      } else {
        throw new Error("Paiement refusé par l'opérateur.");
      }
    } catch (err: any) {
      const msg = err.message || "Erreur de flux inconnue";
      setError(msg);
      
      toast.error("ÉCHEC DE L'OPÉRATION", {
        description: msg,
        className: "bg-red-950 border-red-500 text-white font-black uppercase italic text-[10px]"
      });

      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  return { executeOrderAndPayment, loading, error };
};