// src/features/abonnement/service/subscription-service.ts
import { supabase } from "@/supabase";
import { Plan, Abonnement } from "../types";

export const subscriptionService = {
  /**
   * RÉCUPÉRATION DES PLANS DISPONIBLES
   */
  getPlans: async (): Promise<Plan[]> => {
    const { data, error } = await supabase
      .from('plans')
      .select('*')
      .order('prix', { ascending: true });
    if (error) throw error;
    return data as Plan[];
  },

  /**
   * RÉCUPÈRE LES ABONNEMENTS DIRECTS D'UN UTILISATEUR
   */
  getUserSubscriptions: async (userId: string): Promise<Abonnement[]> => {
    const { data, error } = await supabase
      .from('abonnement')
      .select('*, plans(*)')
      .eq('id_utilisateur', userId)
      .eq('statut', 'ACTIF'); 
    
    if (error) throw error;
    return data || [];
  },

  /**
   * LOGIQUE DE PAIEMENT SÉCURISÉE
   */
  processPaymentFlow: async (userId: string, plan: Plan, phone: string) => {
    // 1. VÉRIFICATION DE SÉCURITÉ
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
  },

  /**
   * NOUVEAU : RÉCUPÉRATION DE L'ABONNEMENT EFFECTIF (Agent ou Propriétaire)
   * Cette fonction permet à un transporteur de "voir" l'abonnement de son agence
   */
  getEffectiveSubscription: async (userId: string): Promise<Abonnement | null> => {
    const now = new Date().toISOString();

    // 1. Vérifier d'abord si l'utilisateur a un abonnement direct (Propriétaire d'agence)
    const { data: directSub } = await supabase
      .from('abonnement')
      .select('*, plans(*)')
      .eq('id_utilisateur', userId)
      .eq('statut', 'ACTIF')
      .gt('date_fin', now)
      .maybeSingle();

    if (directSub) return directSub as Abonnement;

    // 2. Si rien en direct, vérifier s'il est lié à une agence via agents_agence (Agent/Transporteur)
    const { data: agentLink } = await supabase
      .from('agents_agence')
      .select('agence_id')
      .eq('user_id', userId)
      .maybeSingle();

    if (agentLink) {
      // 3. Trouver le patron de l'agence (celui qui a créé l'agence et qui paie)
      const { data: agence } = await supabase
        .from('agence')
        .select('id_utilisateur')
        .eq('id', agentLink.agence_id)
        .single();

      if (agence) {
        // 4. Récupérer l'abonnement actif du patron
        const { data: agencySub } = await supabase
          .from('abonnement')
          .select('*, plans(*)')
          .eq('id_utilisateur', agence.id_utilisateur)
          .eq('statut', 'ACTIF')
          .gt('date_fin', now)
          .maybeSingle();

        return agencySub as Abonnement;
      }
    }

    return null;
  }
};