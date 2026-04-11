// src/features/abonnement/hooks/use-subscription.ts
import { useState, useEffect, useCallback } from 'react';
import { Abonnement } from '../types';
import { subscriptionService } from '../service/subscription-service';

export function useSubscription(userId: string | undefined) {
  const [allSubs, setAllSubs] = useState<Abonnement[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!userId || userId.length < 10) return;
    setLoading(true);
    try {
      const subs = await subscriptionService.getUserSubscriptions(userId);
      setAllSubs(subs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { refresh(); }, [refresh]);

  // Retourne l'abonnement spécifique à un plan s'il existe
  const getPlanSubscription = (planId: string) => {
    return allSubs.find(s => s.id_plan === planId) || null;
  };

  // Calcule les jours restants pour un abonnement précis
  const getDaysForSub = (sub: Abonnement | null): number => {
    if (!sub) return 0;
    const diff = new Date(sub.date_fin).getTime() - new Date().getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  return {
    activeSubscription: allSubs.find(s => new Date(s.date_debut) <= new Date()),
    getPlanStatus: (planId: string) => {
      const sub = getPlanSubscription(planId);
      if (!sub) return 'AVAILABLE';
      return new Date(sub.date_debut) <= new Date() ? 'ACTIVE' : 'QUEUED';
    },
    getPlanDays: (planId: string) => getDaysForSub(getPlanSubscription(planId)),
    loading,
    refresh
  };
}