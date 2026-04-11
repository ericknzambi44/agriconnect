// src/features/abonnement/view/SubscriptionView.tsx
import { useState, useEffect } from "react";
import { useSubscription } from "../hooks/use-subscription";
import { PlanCard } from "../components/PlanCard";
import { PaymentDialog } from "../components/PaymentDialog";
import { Plan } from "../types";
import { toast } from "sonner";
import { subscriptionService } from "../service/subscription-service";
import { ShieldCheck, RefreshCw, CheckCircle2, XCircle, Clock } from "lucide-react";

export default function SubscriptionView({ userId }: { userId: string }) {
  const { 
    activeSubscription, 
    getPlanStatus, 
    getPlanDays, 
    refresh 
  } = useSubscription(userId);

  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<'IDLE' | 'SUCCESS' | 'ERROR'>('IDLE');

  useEffect(() => {
    subscriptionService.getPlans().then(setPlans);
  }, []);

  const handlePlanSelection = (plan: Plan) => {
    setSelectedPlan(plan);
  };

  const handleFinalPayment = async (phone: string, operator: string) => {
    if (!selectedPlan || !userId) return;
    setIsProcessing(true);
    setStatus('IDLE');
    try {
      await subscriptionService.processPaymentFlow(userId, selectedPlan, phone);
      setStatus('SUCCESS');
      toast.success("SYSTÈME MIS À JOUR");
      setSelectedPlan(null);
      refresh(); 
      setTimeout(() => setStatus('IDLE'), 6000);
    } catch (e: any) {
      setStatus('ERROR');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500 selection:text-black flex flex-col">
      
      {/* HEADER COMPACT & STATIQUE */}
      <header className="w-full max-w-7xl mx-auto px-6 pt-10 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-[9px] font-black uppercase tracking-[0.5em] text-emerald-500/50 italic">Terminal_Sync</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase leading-none">
              FLUX <span className="text-emerald-500 text-glow-green">ABONNEMENT</span>
            </h1>
          </div>

          {activeSubscription && (
            <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl flex items-center gap-4 hover:border-emerald-500/30 transition-all">
              <div className="p-2 bg-emerald-500/10 rounded-xl">
                <ShieldCheck className="w-6 h-6 text-emerald-500" />
              </div>
              <div className="pr-4">
                <p className="text-[8px] font-black uppercase tracking-widest text-white/20 leading-none mb-1">Status_Actif</p>
                <p className="font-black text-sm uppercase italic tracking-tight">{activeSubscription.plans?.nom}</p>
                <p className="text-[10px] font-bold text-emerald-500 uppercase">{getPlanDays(activeSubscription.id_plan)}j restants</p>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* FEEDBACK STATUS (Positionné pour ne pas casser le layout) */}
      <div className="w-full max-w-7xl mx-auto px-6 h-14 mb-4">
        {status === 'SUCCESS' && (
          <div className="h-full bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center px-4 gap-3 animate-in slide-in-from-left-4">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span className="text-[10px] font-black uppercase italic tracking-widest text-emerald-500">Protocole de cumul validé avec succès</span>
          </div>
        )}
        {status === 'ERROR' && (
          <div className="h-full bg-red-500/10 border border-red-500/20 rounded-xl flex items-center px-4 gap-3 animate-in slide-in-from-left-4">
            <XCircle className="w-4 h-4 text-red-500" />
            <span className="text-[10px] font-black uppercase italic tracking-widest text-red-500">Échec de la liaison bancaire</span>
          </div>
        )}
      </div>

      {/* ZONE DE SCROLL HORIZONTAL (SNAPPING) */}
      <main className="flex-grow overflow-hidden relative group">
        {/* Indicateur de scroll visuel (optionnel) */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-500/10 transition-all"></div>
        
        <div className="flex overflow-x-auto overflow-y-hidden snap-x snap-mandatory gap-8 px-6 md:px-12 pb-20 no-scrollbar items-stretch h-full">
          {plans.map((p) => (
            <div key={p.id_plans} className="snap-center shrink-0 w-[85vw] md:w-[400px] first:pl-0 last:pr-6">
              <PlanCard 
                plan={p} 
                status={getPlanStatus(p.id_plans)}
                days={getPlanDays(p.id_plans)}
                onSelect={() => handlePlanSelection(p)}
              />
            </div>
          ))}
          
          {/* Spacer de fin pour le scroll */}
          <div className="shrink-0 w-12 h-full"></div>
        </div>
      </main>

      {/* OVERLAY CHARGEMENT */}
      {isProcessing && (
        <div className="fixed inset-0 bg-[#050505]/95 backdrop-blur-xl z-[100] flex flex-col items-center justify-center">
          <RefreshCw className="w-16 h-16 text-emerald-500 animate-spin mb-6" />
          <p className="font-black italic uppercase tracking-[0.4em] text-xs text-white/40">Synchronisation_Bancaire...</p>
        </div>
      )}

      {/* DIALOGUE */}
      <PaymentDialog 
        plan={selectedPlan}
        open={!!selectedPlan}
        onOpenChange={(isOpen) => !isProcessing && setSelectedPlan(isOpen ? selectedPlan : null)}
        onConfirm={handleFinalPayment}
        loading={isProcessing}
      />

      {/* CSS INTERNE POUR CACHER LA SCROLLBAR MAIS GARDER LE SCROLL */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}