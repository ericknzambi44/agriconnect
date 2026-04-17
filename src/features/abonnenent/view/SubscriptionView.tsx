import { useState, useEffect } from "react";
import { useSubscription } from "../hooks/use-subscription";
import { PlanCard } from "../components/PlanCard";
import { PaymentDialog } from "../components/PaymentDialog";
import { Plan } from "../types";
import { toast } from "sonner";
import { subscriptionService } from "../service/subscription-service";
import { ShieldCheck, CheckCircle2, ArrowRight, RefreshCw, Smartphone } from "lucide-react";

export default function SubscriptionView({ userId }: { userId: string }) {
  const { 
    activeSubscriptions, 
    getPlanStatus, 
    getPlanDays, 
    checkPurchaseSafety,
    refresh 
  } = useSubscription(userId);

  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<'IDLE' | 'SUCCESS'>('IDLE');

  useEffect(() => {
    subscriptionService.getPlans().then(setPlans);
  }, []);

  const handleFinalPayment = async (phone: string, operator: string) => {
    if (!selectedPlan || !userId) return;
    setIsProcessing(true);

    try {
      await subscriptionService.processPaymentFlow(userId, selectedPlan, phone);
      setStatus('SUCCESS');
      setSelectedPlan(null);
      refresh();
    } catch (e: any) {
      toast.error("ÉCHEC_SYSTÈME", {
        description: e.message || "Vérifiez votre solde.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="h-screen w-full bg-[#050505] text-white flex flex-col overflow-hidden relative selection:bg-emerald-500">
      
      {/* 1. ÉTAT DU SYSTÈME (HEADER COMPACT) */}
      <header className="w-full px-6 pt-6 sm:pt-10 shrink-0 z-20">
        <div className="max-w-6xl  mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[8px] font-black uppercase tracking-[0.4em] text-emerald-500/60">S'abonner c'est profiter  des opportunités d'agriConnect </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black italic tracking-tighter uppercase leading-none">
              Plans <span className="text-emerald-500 text-glow">d'abonnement</span>
            </h1>
          </div>

          {/* RÉSUMÉ DES ABONNEMENTS ACTIFS (VISIBILITÉ DIRECTE) */}
          <div className="flex gap-2">
            {activeSubscriptions.length > 0 ? (
              activeSubscriptions.map(s => (
                <div key={s.id} className="bg-white/[0.02] border border-emerald-500/20 p-3 rounded-2xl flex items-center gap-3 backdrop-blur-md">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  <div className="leading-none">
                    <p className="text-[7px] font-black text-white/20 uppercase mb-1">{s.plans?.nom}</p>
                    <p className="text-[10px] font-black text-white italic">{getPlanDays(s.id_plan)} JOURS</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white/[0.02] border border-white/5 p-3 rounded-2xl flex items-center gap-3 text-white/20">
                <Smartphone className="w-5 h-5" />
                <p className="text-[8px] font-black uppercase tracking-widest">Aucun_Service_Actif</p>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 2. ZONE DES PLANS (HORIZONTAL SNAP - SANS SCROLL VERTICAL) */}
      <main className="flex-grow flex items-center relative z-10 py-4 sm:py-0">
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-5 px-6 sm:px-[10%] no-scrollbar items-center w-full h-full max-h-[550px]">
          {plans.map((p) => {
            const safety = checkPurchaseSafety(p.id_plans);
            return (
              <div key={p.id_plans} className="snap-center shrink-0 w-[85vw] sm:w-[320px] lg:w-[350px] h-full max-h-[500px]">
                <PlanCard 
                  plan={p} 
                  status={getPlanStatus(p.id_plans)}
                  days={getPlanDays(p.id_plans)}
                  canBuy={safety.canBuy}
                  safetyMessage={safety.message}
                  onSelect={() => setSelectedPlan(p)}
                />
              </div>
            );
          })}
          {/* Padding de fin pour le scroll horizontal */}
          <div className="shrink-0 w-10 h-full" />
        </div>
      </main>

      {/* 3. MODAL DE SUCCÈS (OVERLAY) */}
      {status === 'SUCCESS' && (
        <div className="fixed inset-0 bg-[#050505]/98 z-[100] flex items-center justify-center p-6 animate-in fade-in">
          <div className="max-w-xs w-full text-center space-y-6">
            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </div>
            <h2 className="text-3xl font-black italic uppercase tracking-tighter">Sync_Terminée</h2>
            <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest leading-relaxed">
              Le service a été injecté dans votre compte avec succès.
            </p>
            <button 
              onClick={() => setStatus('IDLE')}
              className="w-full h-14 bg-emerald-500 text-black font-black uppercase text-[10px] rounded-xl flex items-center justify-center gap-2"
            >
              ACCÉDER AU TERMINAL <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 4. MODAL DE CHARGEMENT PAIEMENT */}
      {isProcessing && (
        <div className="fixed inset-0 bg-[#050505]/80 backdrop-blur-xl z-[200] flex flex-col items-center justify-center">
          <RefreshCw className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
          <p className="text-[9px] font-black uppercase tracking-[0.5em] text-emerald-500">Processing_Node...</p>
        </div>
      )}

      <PaymentDialog 
        plan={selectedPlan}
        open={!!selectedPlan}
        onOpenChange={(open) => !isProcessing && setSelectedPlan(open ? selectedPlan : null)}
        onConfirm={handleFinalPayment}
        loading={isProcessing}
      />

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .text-glow { text-shadow: 0 0 30px rgba(16,185,129,0.4); }
      `}</style>
    </div>
  );
}