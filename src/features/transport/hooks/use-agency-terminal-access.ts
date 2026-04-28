import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/supabase';
import { useAuthSession } from '@/features/auth/hooks/use-auth-session';

export const PLAN_AGENCE_PRO = 'PLAN_AGENCE_PRO';

export function useAgencyTerminalAccess() {
  const { profile, isLoading: authLoading } = useAuthSession();
  const [subscription, setSubscription] = useState<any>(null);
  const [agencyDetails, setAgencyDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAgencyAndSub() {
      if (!profile?.id) {
        setIsLoading(false);
        return;
      }

      try {
        // 1. RÉCUPÉRER LA LIAISON AGENT (On trie par date pour éviter l'erreur multi-lignes)
        const { data: agentLink, error: linkErr } = await supabase
          .from('agents_agence')
          .select('agence_id')
          .eq('user_id', profile.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (linkErr || !agentLink) {
          setIsLoading(false);
          return;
        }

        // 2. RÉCUPÉRER L'AGENCE ET L'ABONNEMENT
        // Note: On simplifie la jointure pour éviter les erreurs de mapping PostgREST
        const [agencyRes, subRes] = await Promise.all([
          supabase
            .from('agence')
            .select('*')
            .eq('id', agentLink.agence_id)
            .maybeSingle(),
          
          supabase
            .from('abonnement')
            .select(`
              *,
              plans:id_plan (
                id_plans,
                code_plan,
                nom
              )
            `)
            .eq('id_utilisateur', profile.id)
            .eq('statut', 'ACTIF') // On filtre ici pour être plus performant
            .order('date_fin', { ascending: false })
            .limit(1)
            .maybeSingle()
        ]);

        if (agencyRes.data) setAgencyDetails(agencyRes.data);

        // 3. VÉRIFICATION ET CALCUL DE L'ABONNEMENT
        if (subRes.data && subRes.data.plans) {
          const planData = subRes.data.plans;
          
          // Sécurité: Si plans est un tableau (parfois le cas selon la config FK)
          const actualPlan = Array.isArray(planData) ? planData[0] : planData;

          if (actualPlan?.code_plan === PLAN_AGENCE_PRO) {
            const now = new Date();
            const endDate = new Date(subRes.data.date_fin);
            const diffTime = endDate.getTime() - now.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            setSubscription({ 
              ...subRes.data,
              plans: actualPlan, // On s'assure que c'est l'objet plat
              daysRemaining: diffDays > 0 ? diffDays : 0 
            });
          }
        } else {
          setSubscription(null);
        }

      } catch (err) {
        console.error("❌ Erreur Hook Access:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAgencyAndSub();
  }, [profile?.id]);

  const isAuthorized = useMemo(() => {
    if (!subscription || !subscription.plans) return false;

    // Vérification propre
    const isStatutValide = subscription.statut?.toUpperCase() === 'ACTIF';
    const hasTimeLeft = subscription.daysRemaining > 0;
    const isCorrectPlan = subscription.plans.code_plan === PLAN_AGENCE_PRO;

    return isStatutValide && hasTimeLeft && isCorrectPlan;
  }, [subscription]);

  return { 
    isAuthorized, 
    subscription, 
    agency: agencyDetails, 
    isLoading: authLoading || isLoading, 
    profile 
  };
}