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
            .eq('statut', 'ACTIF')
            .order('date_fin', { ascending: false })
            .limit(1)
            .maybeSingle()
        ]);

        if (agencyRes.data) setAgencyDetails(agencyRes.data);

        if (subRes.data && subRes.data.plans) {
          const planData = subRes.data.plans;
          const actualPlan = Array.isArray(planData) ? planData[0] : planData;

          if (actualPlan?.code_plan === PLAN_AGENCE_PRO) {
            const now = new Date();
            const endDate = new Date(subRes.data.date_fin);
            const diffTime = endDate.getTime() - now.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            setSubscription({ 
              ...subRes.data,
              plans: actualPlan,
              daysRemaining: diffDays > 0 ? diffDays : 0 
            });
          }
        } else {
          setSubscription(null);
        }

      } catch (err) {
        console.error("Erreur Hook Access:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAgencyAndSub();
  }, [profile?.id]);

  const isAuthorized = useMemo(() => {
    if (!subscription || !subscription.plans) return false;
    const isStatutValide = subscription.statut?.toUpperCase() === 'ACTIF';
    const hasTimeLeft = subscription.daysRemaining > 0;
    const isCorrectPlan = subscription.plans.code_plan === PLAN_AGENCE_PRO;
    return isStatutValide && hasTimeLeft && isCorrectPlan;
  }, [subscription]);

  const fetchExpeditionContacts = async (expeditionId: string) => {
    try {
      const { data: expedition, error: expError } = await supabase
        .from('expedition')
        .select('commande_id, agence_id')
        .eq('id', expeditionId)
        .single();

      if (expError || !expedition) return null;

      const { data: commande, error: cmdError } = await supabase
        .from('commande')
        .select('acheteur_id, annonce_id')
        .eq('id', expedition.commande_id)
        .single();

      if (cmdError || !commande) return null;

      const { data: annonce, error: annError } = await supabase
        .from('annonce')
        .select('user_id')
        .eq('id', commande.annonce_id)
        .single();

      if (annError || !annonce) return null;

      const acheteurId = commande.acheteur_id;
      const vendeurId = annonce.user_id;
      if (!acheteurId || !vendeurId) return null;

      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('id, numero_tel, nom, prenom')
        .in('id', [acheteurId, vendeurId]);

      if (usersError) return null;

      const acheteur = users?.find(u => u.id === acheteurId);
      const vendeur = users?.find(u => u.id === vendeurId);

      return {
        acheteur: {
          id: acheteurId,
          nom: acheteur?.nom,
          prenom: acheteur?.prenom,
          numero_tel: acheteur?.numero_tel || null,
        },
        vendeur: {
          id: vendeurId,
          nom: vendeur?.nom,
          prenom: vendeur?.prenom,
          numero_tel: vendeur?.numero_tel || null,
        },
        agence_id: expedition.agence_id,
      };
    } catch (err) {
      console.error("Erreur récupération contacts expédition:", err);
      return null;
    }
  };

  return { 
    isAuthorized, 
    subscription, 
    agency: agencyDetails, 
    isLoading: authLoading || isLoading, 
    profile,
    fetchExpeditionContacts,
  };
}