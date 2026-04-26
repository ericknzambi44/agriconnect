// src/features/transport/hooks/use-agency-terminal-access.ts
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
      // On utilise l'ID de la session auth
      if (!profile?.id) {
        setIsLoading(false);
        return;
      }

      try {
        // 1. TROUVER L'AGENCE (via la table agents_agence avec user_id)
        const { data: agentLink, error: linkErr } = await supabase
          .from('agents_agence')
          .select('agence_id')
          .eq('user_id', profile.id) // C'est user_id ici
          .maybeSingle();

        if (linkErr || !agentLink) {
          console.log("Aucune liaison agence trouvée pour cet utilisateur.");
          setIsLoading(false);
          return;
        }

        const targetAgencyId = agentLink.agence_id;

        // 2. RÉCUPÉRER L'AGENCE ET L'ABONNEMENT EN PARALLÈLE
        const [agencyRes, subRes] = await Promise.all([
          // Infos de l'agence
          supabase
            .from('agence')
            .select('*')
            .eq('id', targetAgencyId)
            .single(),
          
          // Abonnement lié à l'utilisateur + Jointure sur Plans
          supabase
            .from('abonnement')
            .select('*, plans:id_plan!inner(*)') // On force l'inner join sur id_plan
            .eq('id_utilisateur', profile.id)
            .eq('plans.code_plan', PLAN_AGENCE_PRO)
            .order('date_fin', { ascending: false })
            .limit(1)
            .maybeSingle()
        ]);

        if (agencyRes.data) {
          setAgencyDetails(agencyRes.data);
        }

        if (subRes.data) {
          // Calcul des jours restants
          const now = new Date();
          const endDate = new Date(subRes.data.date_fin);
          const diffTime = endDate.getTime() - now.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          setSubscription({ 
            ...subRes.data, 
            daysRemaining: diffDays > 0 ? diffDays : 0 
          });
        } else {
          setSubscription(null);
        }

      } catch (err) {
        console.error("Erreur critique Access Hook:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAgencyAndSub();
  }, [profile?.id]);

  const isAuthorized = useMemo(() => {
    if (!subscription) return false;

    // Vérification stricte du statut et de la date
    const isStatutValide = subscription.statut?.trim().toUpperCase() === 'ACTIF';
    const hasTimeLeft = subscription.daysRemaining > 0;
    
    // On vérifie aussi que le plan récupéré est bien le PRO (sécurité supplémentaire)
    const isCorrectPlan = subscription.plans?.code_plan === PLAN_AGENCE_PRO;

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