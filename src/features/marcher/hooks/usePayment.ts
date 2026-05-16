import { useState } from 'react';
import { MockMobileMoneyService, PaymentRequest } from '../services/paymentService';
import { supabase } from '@/supabase';
import { toast } from "sonner";

export const usePayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeOrderAndPayment = async (orderData: any, paymentRequest: PaymentRequest) => {
    // --- GESTION DE LA CONNEXION ---
    if (!window.navigator.onLine) {
      toast.error("PROBLÈME DE CONNEXION", {
        description: "Votre appareil semble hors ligne. Veuillez vérifier votre signal internet pour finaliser l'achat.",
        duration: 5000,
      });
      return { success: false };
    }

    setLoading(true);
    setError(null);

    try {
      // --- ÉTAPE 1 : TRANSACTION MOBILE ---
      toast.loading("DEMANDE DE PAIEMENT EN COURS...", { 
        id: "pay-step",
        description: "Veuillez valider l'opération sur votre téléphone." 
      });
      
      const paymentResult = await MockMobileMoneyService.processPayment(paymentRequest);

      if (paymentResult.success) {
        
        // --- ÉTAPE 2 : SÉCURISATION DE LA COMMANDE ---
        // Le statut 'PAYEE' déclenche la mise sous séquestre automatique côté serveur
        const { data: commande, error: orderError } = await supabase
          .from('commande')
          .insert([{
            annonce_id: orderData.annonce_id,
            acheteur_id: orderData.acheteur_id,
            quantite_commandee: Number(orderData.quantite),
            prix_total_commande: Number(orderData.total),
            statut: 'en_attente',
            statut_paiement: 'PAYEE', 
            numero_suivi: paymentResult.transactionId,
            // Informations de livraison
            destination_ville: orderData.destination_ville, 
            destination_details: orderData.destination_details,
            id_agence_retrait: orderData.id_agence_retrait || null 
          }])
          .select()
          .single();

        if (orderError) {
          console.error("ERREUR ENREGISTREMENT:", orderError);
          toast.warning("ALERTE DE SYNCHRONISATION", {
            id: "pay-step",
            description: "Votre paiement a été prélevé mais la commande a eu un souci. Pas d'inquiétude : votre argent est en sécurité. Réf: " + paymentResult.transactionId,
            duration: 10000,
          });
          throw new Error("Erreur lors de l'enregistrement de la commande.");
        }

        // --- ÉTAPE 3 : ARCHIVAGE DU PAIEMENT ---
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
          console.error("Note: Log paiement non critique:", payError);
        }

        // --- MESSAGE FINAL DE CONFIANCE ---
        toast.success("PAIEMENT RÉUSSI !", {
          id: "pay-step",
          description: "Argent sécurisé sous séquestre. Le vendeur préparera votre colis et ne sera payé qu'à la réception de votre marchandise.",
          duration: 10000,
        });

        return { success: true, commande };

      } else {
        throw new Error("La transaction a été refusée par votre opérateur mobile.");
      }
    } catch (err: any) {
      const msg = err.message || "Une erreur est survenue lors du processus";
      setError(msg);
      
      toast.error("OPÉRATION ANNULÉE", {
        id: "pay-step",
        description: msg,
      });

      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  return { executeOrderAndPayment, loading, error };
};