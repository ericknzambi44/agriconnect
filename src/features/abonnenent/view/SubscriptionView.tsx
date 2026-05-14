// features/subscription/views/SubscriptionView.tsx
import { useState, useEffect } from "react";
import { useSubscription } from "../hooks/use-subscription";
import { PlanCard } from "../components/PlanCard";
import { PaymentDialog } from "../components/PaymentDialog";
import { Plan } from "../types";
import { toast } from "sonner";
import { subscriptionService } from "../service/subscription-service";
import { ShieldCheck, CheckCircle2, ArrowRight, RefreshCw, Smartphone, Zap } from "lucide-react";

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
      toast.error("Échec système", {
        description: e.message || "Vérifiez votre solde.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="h-screen w-full bg-gradient-to-br from-[#0a0a0a] via-[#050505] to-black text-white flex flex-col overflow-hidden relative selection:bg-primary/30">
      
      {/* GRILLE DE FOND */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(var(--primary) 1px, transparent 0)', backgroundSize: '30px 30px' }} />

      {/* HEADER AVEC DÉGRADÉ */}
      <header className="w-full px-6 pt-6 sm:pt-8 shrink-0 z-20">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-5xl font-display font-black italic tracking-tighter uppercase leading-none">
              PLANS <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent text-glow">ABONNEMENT</span>
            </h1>
            <p className="font-tech text-[8px] tracking-[0.3em] text-white/40 uppercase italic">Sélectionnez votre cycle AgriConnect</p>
          </div>

          {/* RÉSUMÉ DES ABONNEMENTS ACTIFS */}
          <div className="flex gap-2">
            {activeSubscriptions.length > 0 ? (
              activeSubscriptions.map(s => (
                <div key={s.id} className="bg-gradient-to-r from-primary/10 to-transparent border border-primary/30 px-3 py-2 rounded-xl flex items-center gap-3 shadow-lg shadow-primary/10">
                  <ShieldCheck size={16} className="text-primary drop-shadow-[0_0_4px_rgba(var(--primary),0.8)]" />
                  <div className="leading-none">
                    <p className="font-tech text-[7px] font-black text-white/60 uppercase">{s.plans?.nom}</p>
                    <p className="font-tech text-[10px] font-black text-primary italic">{getPlanDays(s.id_plan)}J RESTANTS</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white/[0.02] border border-white/10 px-3 py-2 rounded-xl flex items-center gap-3 text-white/30 italic">
                <Smartphone size={16} />
                <span className="font-tech text-[8px] font-black uppercase tracking-widest">AUCUN SERVICE</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ZONE PRINCIPALE : SCROLL HORIZONTAL */}
      <main className="flex-grow flex items-center relative z-10 overflow-hidden">
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 px-6 sm:px-[10%] no-scrollbar items-center w-full h-full max-h-[500px]">
          {plans.map((p) => {
            const safety = checkPurchaseSafety(p.id_plans);
            return (
              <div key={p.id_plans} className="snap-center shrink-0 w-[280px] sm:w-[320px] transition-transform duration-300 hover:translate-y-[-5px]">
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
          <div className="shrink-0 w-12" />
        </div>
      </main>

      {/* MODAL DE SUCCÈS */}
      {status === 'SUCCESS' && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-[100] flex items-center justify-center p-6">
          <div className="max-w-xs w-full text-center space-y-6 bg-gradient-to-b from-white/[0.02] to-black/60 border-2 border-primary/30 p-8 rounded-[2rem] shadow-2xl shadow-primary/20 animate-in zoom-in duration-300">
            <div className="w-16 h-16 bg-primary/20 border border-primary/50 rounded-full flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(var(--primary),0.4)]">
              <CheckCircle2 size={32} className="text-primary drop-shadow-md" />
            </div>
            <h2 className="text-2xl font-display font-black italic tracking-tighter uppercase text-white"> VALIDÉE</h2>
            <button 
              onClick={() => setStatus('IDLE')}
              className="w-full h-12 bg-gradient-to-r from-primary to-orange-400 text-black font-display font-black uppercase italic text-[10px] rounded-xl flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/30 transition-all active:scale-95"
            >
              RETOUR AU TERMINAL <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* OVERLAY DE CHARGEMENT */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[200] flex flex-col items-center justify-center gap-4">
          <RefreshCw className="w-12 h-12 text-primary animate-spin" strokeWidth={3} />
          <p className="font-tech text-[9px] font-black uppercase tracking-[0.5em] text-primary animate-pulse">TRAITEMENT EN COURS...</p>
        </div>
      )}

      {/* DIALOGUE DE PAIEMENT */}
      <PaymentDialog 
        plan={selectedPlan}
        open={!!selectedPlan}
        onOpenChange={(open: boolean) => !isProcessing && setSelectedPlan(open ? selectedPlan : null)}
        onConfirm={handleFinalPayment}
        loading={isProcessing}
      />

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .text-glow { text-shadow: 0 0 25px rgba(var(--primary), 0.4); }
      `}</style>
    </div>
  );
}