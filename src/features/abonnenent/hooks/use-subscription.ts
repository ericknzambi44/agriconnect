// src/features/abonnement/hooks/useSubscription.ts
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Abonnement } from '../types';
import { subscriptionService } from '../service/subscription-service';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";

export function useSubscription(userId: string | undefined) {
  const [allSubs, setAllSubs] = useState<Abonnement[]>([]);
  const [effectiveSub, setEffectiveSub] = useState<Abonnement | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const refresh = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      // 1. Récupère l'historique complet (pour les cartes d'abonnement)
      const subs = await subscriptionService.getUserSubscriptions(userId);
      setAllSubs(subs);

      // 2. Récupère l'abonnement "Effectif" (Direct ou hérité de l'agence)
      const effective = await subscriptionService.getEffectiveSubscription(userId);
      setEffectiveSub(effective);
      
    } catch (err) {
      console.error("[SUBSCRIPTION_HOOK_ERROR]:", err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { refresh(); }, [refresh]);

  /**
   * 1. ISOLATION STRICTE PAR PLAN (Cartes UI)
   */
  const planDataMap = useMemo(() => {
    const map: Record<string, Abonnement> = {};
    
    allSubs.forEach(sub => {
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
    const diffTime = endDate.getTime() - now.getTime();
    const days = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    const isActive = days > 0 && sub.statut === 'ACTIF';

    return {
      status: isActive ? 'ACTIVE' as const : 'AVAILABLE' as const,
      days: days,
      isActive,
      subDetails: sub
    };
  }, [planDataMap]);

  /**
   * 3. LE GATEKEEPER (Protection des actions Agence/Transporteur)
   * À utiliser dans tes fonctions de validation de codes
   */
  const gatekeeper = useCallback((actionName: string) => {
    const isActuallyActive = effectiveSub && new Date(effectiveSub.date_fin) > new Date();

    if (!isActuallyActive) {
      toast.error("ACCÈS_REFUSÉ", {
        description: `L'action [${actionName}] nécessite une licence Agence active.`,
        className: "bg-red-950 border-red-500 text-white font-bold",
      });
      navigate('/abonnements'); // Redirection vers les plans
      return false;
    }
    return true;
  }, [effectiveSub, navigate]);

  return {
    loading,
    refresh,
    
    // L'abonnement actuellement en vigueur (direct ou agence)
    currentActiveSub: effectiveSub,
    isSubscribed: !!effectiveSub && new Date(effectiveSub.date_fin) > new Date(),

    /**
     * MÉTHODES POUR LA VUE (SUBSCRIPTION CARD)
     */
    getPlanStatus: (planId: string) => getPlanInfo(planId).status,
    getPlanDays: (planId: string) => getPlanInfo(planId).days,
    
    /**
     * SÉCURITÉ D'ACHAT
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
    },

    /**
     * PROTECTION FONCTIONNELLE
     */
    gatekeeper
  };
}