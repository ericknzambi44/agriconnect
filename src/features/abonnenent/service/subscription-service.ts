// src/features/abonnement/services/subscription-service.ts
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

  /**
   * Récupère TOUS les abonnements actifs ou futurs de l'utilisateur
   */
  getUserSubscriptions: async (userId: string): Promise<Abonnement[]> => {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('abonnement')
      .select('*, plans(*)')
      .eq('id_utilisateur', userId)
      .eq('statut', 'ACTIF')
      .gt('date_fin', now) // Seulement ceux qui ne sont pas encore finis
      .order('date_fin', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  processPaymentFlow: async (userId: string, plan: Plan, phone: string) => {
    // 1. Trouver la date de fin la plus lointaine (tous plans confondus)
    const { data: lastSub } = await supabase
      .from('abonnement')
      .select('date_fin')
      .eq('id_utilisateur', userId)
      .eq('statut', 'ACTIF')
      .order('date_fin', { ascending: false })
      .limit(1)
      .maybeSingle();

    let dateDebut = new Date();
    if (lastSub && new Date(lastSub.date_fin) > dateDebut) {
      dateDebut = new Date(lastSub.date_fin);
    }

    const dateFin = new Date(dateDebut);
    dateFin.setDate(dateDebut.getDate() + plan.duree_jour);

    // 2. Simulation Paiement
    await new Promise(res => setTimeout(res, 2000));

    // 3. Insertions
    await supabase.from('payement').insert([{
      id_utilisateur: userId,
      montant: plan.prix,
      reference: `AGRI-${Math.random().toString(36).toUpperCase().slice(0, 8)}`,
      statut: 'SUCCESS'
    }]);

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