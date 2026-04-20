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
      toast.error("ÉCHEC_SYSTÈME", {
        description: e.message || "Vérifiez votre solde.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="h-screen w-full bg-background text-foreground flex flex-col overflow-hidden relative selection:bg-primary/30">
      
      {/* GRID BACKGROUND */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(var(--primary) 1px, transparent 0)', backgroundSize: '30px 30px' }} />

      {/* 1. HEADER COMPACT (Moins de padding pour éviter de pousser le reste) */}
      <header className="w-full px-6 pt-6 sm:pt-8 shrink-0 z-20">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-5xl font-display font-black italic tracking-tighter uppercase leading-none">
              PLANS_<span className="text-primary text-glow">ABONNEMENT</span>
            </h1>
            <p className="font-tech text-[8px] tracking-[0.3em] text-muted-foreground uppercase italic opacity-50">Sélectionnez_votre_cycle_AgriConnect</p>
          </div>

          {/* RÉSUMÉ ACTIF */}
          <div className="flex gap-2">
            {activeSubscriptions.length > 0 ? (
              activeSubscriptions.map(s => (
                <div key={s.id} className="bg-secondary border border-primary/20 px-3 py-2 rounded-xl flex items-center gap-3 shadow-lg">
                  <ShieldCheck size={16} className="text-primary" />
                  <div className="leading-none">
                    <p className="font-tech text-[7px] font-black text-muted-foreground uppercase">{s.plans?.nom}</p>
                    <p className="font-tech text-[10px] font-black text-foreground italic">{getPlanDays(s.id_plan)}J RESTANTS</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-secondary/30 border border-border px-3 py-2 rounded-xl flex items-center gap-3 text-muted-foreground/30 italic">
                <Smartphone size={16} />
                <span className="font-tech text-[8px] font-black uppercase tracking-widest">AUCUN_SERVICE</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 2. MAIN AREA : SCROLL HORIZONTAL (Hauteur optimisée pour PC/Mobile) */}
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

      {/* 3. MODAL SUCCÈS (Type Terminal) */}
      {status === 'SUCCESS' && (
        <div className="fixed inset-0 bg-background/95 backdrop-blur-md z-[100] flex items-center justify-center p-6">
          <div className="max-w-xs w-full text-center space-y-6 bg-secondary border-2 border-primary/20 p-8 rounded-[2rem] shadow-2xl animate-in zoom-in">
            <div className="w-16 h-16 bg-primary/10 border border-primary/30 rounded-full flex items-center justify-center mx-auto shadow-glow-primary">
              <CheckCircle2 size={32} className="text-primary" />
            </div>
            <h2 className="text-2xl font-display font-black italic tracking-tighter uppercase leading-none text-foreground">SYNC_VALIDÉE</h2>
            <button 
              onClick={() => setStatus('IDLE')}
              className="w-full h-12 bg-primary text-primary-foreground font-display font-black uppercase italic text-[10px] rounded-xl flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all"
            >
              RETOUR_AU_TERMINAL <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* 4. LOADING OVERLAY */}
      {isProcessing && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-xl z-[200] flex flex-col items-center justify-center gap-4">
          <RefreshCw className="w-12 h-12 text-primary animate-spin" strokeWidth={3} />
          <p className="font-tech text-[9px] font-black uppercase tracking-[0.5em] text-primary animate-pulse">PROCESSING_DATA...</p>
        </div>
      )}

      {/* CORRECTION ERREUR TYPE-SAFE : open est typé boolean ici */}
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