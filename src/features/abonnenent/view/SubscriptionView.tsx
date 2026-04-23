// src/features/abonnement/views/SubscriptionView.tsx
import { useState, useEffect } from "react";
import { useSubscription } from "../hooks/use-subscription";
import { PlanCard } from "../components/PlanCard";
import { PaymentDialog } from "../components/PaymentDialog";
import { Plan } from "../types";
import { toast } from "sonner";
import { subscriptionService } from "../service/subscription-service";
import { ShieldCheck, CheckCircle2, ArrowRight, RefreshCw, Smartphone, Zap, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SubscriptionView({ userId }: { userId: string }) {
  const { 
    currentActiveSub, 
    getPlanStatus, 
    getPlanDays, 
    checkPurchaseSafety,
    refresh 
  } = useSubscription(userId);

  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<'IDLE' | 'SUCCESS'>('IDLE');

  // On transforme l'abonnement unique en tableau pour retrouver tes jolies cartes indépendantes
  const activeSubs = currentActiveSub ? [currentActiveSub] : [];

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
    <div className="min-h-screen md:h-screen w-full bg-background text-foreground flex flex-col overflow-x-hidden relative selection:bg-primary/30 font-sans">
      
      {/* GRID BACKGROUND DYNAMIQUE */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none fixed" 
           style={{ backgroundImage: 'radial-gradient(var(--primary) 1px, transparent 0)', backgroundSize: '40px 40px' }} />

      {/* 1. HEADER ELITE */}
      <header className="w-full px-6 pt-8 md:pt-10 shrink-0 z-20">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
          
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 md:w-2 md:h-8 bg-primary shadow-[0_0_15px_rgba(var(--primary),0.5)] animate-pulse" />
              <h1 className="text-3xl md:text-6xl font-display font-black italic tracking-tighter uppercase leading-none">
                Plans<span className="text-primary text-glow"> d'abonnement </span>
              </h1>
            </div>
            <p className="font-tech text-[8px] md:text-[9px] tracking-[0.4em] text-muted-foreground uppercase italic opacity-60 ml-4 md:ml-5">
              Activer des plans pour une meilleure expérience avec Agriconnect
            </p>
          </div>

          {/* RÉSUMÉ DES PLANS ACTIFS (Tes jolies cartes rectangulaires restaurées) */}
          <div className="flex flex-wrap gap-3 w-full lg:w-auto">
            {activeSubs.length > 0 ? (
              activeSubs.map((s, index) => (
                <div 
                  key={s.id} 
                  style={{ animationDelay: `${index * 150}ms` }}
                  className={cn(
                    "group relative bg-primary/5 backdrop-blur-md border border-primary/30 px-4 py-3 rounded-2xl flex items-center gap-4",
                    "shadow-[0_0_20px_-10px_rgba(var(--primary),0.3)] hover:border-primary transition-all duration-500",
                    "animate-in slide-in-from-top-4 fill-mode-both"
                  )}
                >
                  <div className="relative">
                    <ShieldCheck size={18} className="text-primary animate-pulse" />
                    <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full" />
                  </div>
                  
                  <div className="space-y-0.5">
                    <p className="font-tech text-[8px] font-black text-primary uppercase tracking-widest">
                      {s.plans?.nom || "LICENCE_ACTIVE"}
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="font-tech text-[11px] font-black text-foreground italic uppercase">
                        {getPlanDays(s.id_plan)}j_restants
                      </p>
                      <div className="w-1 h-1 bg-primary rounded-full animate-ping" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-secondary/20 border border-dashed border-border/50 px-4 py-2.5 rounded-xl flex items-center gap-3 text-muted-foreground/30 animate-pulse">
                <Smartphone size={16} />
                <span className="font-tech text-[8px] font-black uppercase tracking-widest italic">SEARCHING_LICENSE...</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 2. MAIN AREA : RESPONSIVE GRID/SCROLL */}
      <main className="flex-grow relative z-10 overflow-y-auto md:overflow-hidden flex items-center py-10 md:py-0">
        <div className="relative w-full group/scroll">
          <div className={cn(
            "w-full px-6 md:px-[8%] flex gap-6 md:gap-8 no-scrollbar",
            "flex-col items-center md:flex-row md:overflow-x-auto md:snap-x md:snap-mandatory"
          )}>
            {plans.map((p) => {
              const safety = checkPurchaseSafety(p.id_plans);
              return (
                <div 
                  key={p.id_plans} 
                  className="snap-center shrink-0 w-full max-w-[340px] md:w-[320px] lg:w-[360px] transition-all duration-300 hover:scale-[1.02] md:hover:scale-105"
                >
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

            {/* INDICATEUR DE SCROLL ">>>>" visible sur Desktop si défilement possible */}
            <div className="hidden md:flex shrink-0 w-32 items-center justify-center animate-pulse">
               <div className="flex flex-col items-center gap-2 text-primary/40 group-hover/scroll:text-primary transition-colors">
                  <div className="flex">
                    <ChevronRight size={20} className="-mr-2" />
                    <ChevronRight size={20} className="-mr-2" />
                    <ChevronRight size={20} />
                  </div>
                  <span className="font-tech text-[8px] font-bold tracking-[0.3em] uppercase italic">Voir_plus</span>
               </div>
            </div>
            
            <div className="hidden md:block shrink-0 w-[5%]" />
          </div>
        </div>
      </main>

      {/* 3. MODAL SUCCÈS TERMINAL */}
      {status === 'SUCCESS' && (
        <div className="fixed inset-0 bg-background/95 backdrop-blur-xl z-[100] flex items-center justify-center p-6">
          <div className="max-w-sm w-full text-center space-y-8 bg-secondary/50 border-2 border-primary/40 p-8 md:p-12 rounded-[2.5rem] shadow-2xl animate-in zoom-in">
            <div className="w-20 h-20 bg-primary/10 border border-primary/40 rounded-full flex items-center justify-center mx-auto shadow-glow-primary">
              <CheckCircle2 size={40} className="text-primary" />
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl font-display font-black italic tracking-tighter uppercase text-foreground">FLUX_ÉTABLI</h2>
              <p className="font-tech text-[10px] text-muted-foreground uppercase tracking-[0.2em] leading-relaxed">
                Injection de la licence terminée.<br/>Système prêt pour exploitation.
              </p>
            </div>
            <button 
              onClick={() => setStatus('IDLE')}
              className="w-full h-14 bg-primary text-primary-foreground font-display font-black uppercase italic text-[11px] rounded-2xl flex items-center justify-center gap-3 hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/20"
            >
              RETOURNER_AU_SYSTÈME <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* 4. LOADING OVERLAY PRO */}
      {isProcessing && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-2xl z-[200] flex flex-col items-center justify-center gap-6">
          <div className="relative">
            <RefreshCw className="w-16 h-16 text-primary animate-spin" strokeWidth={1} />
            <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary w-5 h-5 animate-pulse" />
          </div>
          <p className="font-tech text-[10px] font-black uppercase tracking-[0.6em] text-primary animate-pulse">COMMITTING_DATA...</p>
        </div>
      )}

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
        .text-glow { text-shadow: 0 0 25px rgba(var(--primary), 0.5); }
        .shadow-glow-primary { shadow: 0 0 40px rgba(var(--primary), 0.3); }
      `}</style>
    </div>
  );
}