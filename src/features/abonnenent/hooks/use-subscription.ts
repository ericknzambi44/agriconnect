import { useState, useEffect, useCallback, useMemo } from 'react';
import { Abonnement } from '../types';
import { subscriptionService } from '../service/subscription-service';

export function useSubscription(userId: string | undefined) {
  const [allSubs, setAllSubs] = useState<Abonnement[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const subs = await subscriptionService.getUserSubscriptions(userId);
      setAllSubs(subs);
    } catch (err) {
      console.error("[SUBSCRIPTION_HOOK_ERROR]:", err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { refresh(); }, [refresh]);

  /**
   * 1. ISOLATION STRICTE PAR PLAN
   * On crée un dictionnaire où chaque ID de plan est une clé unique.
   */
  const planDataMap = useMemo(() => {
    const map: Record<string, Abonnement> = {};
    
    allSubs.forEach(sub => {
      // On ne garde que l'abonnement le plus récent pour chaque plan
      const existing = map[sub.id_plan];
      if (!existing || new Date(sub.date_fin) > new Date(existing.date_fin)) {
        map[sub.id_plan] = sub;
      }
    });
    
    return map;
  }, [allSubs]);

  /**
   * 2. CALCUL DES DONNÉES PAR PLAN
   */
  const getPlanInfo = useCallback((planId: string) => {
    const sub = planDataMap[planId];
    
    if (!sub) {
      return { status: 'AVAILABLE' as const, days: 0, isActive: false };
    }

    const now = new Date();
    const endDate = new Date(sub.date_fin);

    // Calcul précis de la différence en millisecondes transformée en jours
    const diffTime = endDate.getTime() - now.getTime();
    const days = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    // Un plan est considéré actif seulement s'il reste des jours
    const isActive = days > 0;

    return {
      status: isActive ? 'ACTIVE' as const : 'AVAILABLE' as const,
      days: days,
      isActive,
      subDetails: sub
    };
  }, [planDataMap]);

  return {
    loading,
    refresh,
    
    // Liste des abonnements réellement actifs en ce moment (pour résumé global)
    activeSubscriptions: allSubs.filter(s => {
      const now = new Date();
      return new Date(s.date_fin) > now;
    }),

    /**
     * MÉTHODES POUR LA VUE (SUBSCRIPTION CARD)
     */
    getPlanStatus: (planId: string) => getPlanInfo(planId).status,
    getPlanDays: (planId: string) => getPlanInfo(planId).days,
    
    /**
     * SÉCURITÉ D'ACHAT : La règle d'or d'AgriConnect
     * Empêche l'achat si un abonnement du même plan est encore valide.
     */
    checkPurchaseSafety: (planId: string) => {
      const info = getPlanInfo(planId);
      
      if (info.isActive) {
        return {
          canBuy: false,
          message: `ACTIF : Il vous reste ${info.days} jour(s).`,
          variant: 'warning'
        };
      }

      return {
        canBuy: true,
        message: "Disponible à l'achat immédiat.",
        variant: 'success'
      };
    }
  };
}