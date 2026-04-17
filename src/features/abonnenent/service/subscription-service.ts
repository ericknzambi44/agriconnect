// src/features/abonnement/service/subscription-service.ts
import { supabase } from "@/supabase";
import { Plan, Abonnement } from "../types";

export const subscriptionService = {
  getPlans: async (): Promise<Plan[]> => {
    const { data, error } = await supabase
      .from('plans')
      .select('*')
      .order('prix', { ascending: true });
    if (error) throw error;
    return data as Plan[];
  },

  // Récupère les abonnements d'un utilisateur (dispatché par ID plus tard)
  getUserSubscriptions: async (userId: string): Promise<Abonnement[]> => {
    const { data, error } = await supabase
      .from('abonnement')
      .select('*, plans(*)')
      .eq('id_utilisateur', userId)
      .eq('statut', 'ACTIF'); // On récupère tout l'historique actif
    
    if (error) throw error;
    return data || [];
  },

  /**
   * LOGIQUE DE PAIEMENT SÉCURISÉE
   */
  processPaymentFlow: async (userId: string, plan: Plan, phone: string) => {
    // 1. VÉRIFICATION DE SÉCURITÉ (Côté Serveur/Service)
    // On vérifie si ce plan précis est déjà actif pour cet utilisateur
    const now = new Date().toISOString();
    const { data: existingActive } = await supabase
      .from('abonnement')
      .select('id, date_fin')
      .eq('id_utilisateur', userId)
      .eq('id_plan', plan.id_plans)
      .eq('statut', 'ACTIF')
      .gt('date_fin', now)
      .maybeSingle();

    if (existingActive) {
      throw new Error("SÉCURITÉ : Un abonnement pour ce plan est déjà en cours.");
    }

    // 2. INITIALISATION DES DATES
    const dateDebut = new Date();
    const dateFin = new Date();
    dateFin.setDate(dateDebut.getDate() + plan.duree_jour);

    // 3. TRANSACTION DE PAIEMENT
    // Note : Dans un vrai système, ceci serait géré par un Webhook (Stripe/OrangeMoney)
    const { error: pErr } = await supabase.from('payement').insert([{
      id_utilisateur: userId,
      montant: plan.prix,
      statut: 'SUCCESS',
      reference: `AGRI-${Math.random().toString(36).toUpperCase().slice(0, 8)}`
    }]);

    if (pErr) throw pErr;

    // 4. INSERTION DE L'ABONNEMENT
    const { error: sErr } = await supabase.from('abonnement').insert([{
      id_plan: plan.id_plans,
      id_utilisateur: userId,
      date_debut: dateDebut.toISOString(),
      date_fin: dateFin.toISOString(),
      statut: 'ACTIF'
    }]);

    if (sErr) throw sErr;
    return { success: true };
  }
};