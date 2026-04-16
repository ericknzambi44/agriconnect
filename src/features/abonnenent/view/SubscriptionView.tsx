import { useState, useEffect } from "react";
import { useSubscription } from "../hooks/use-subscription";
import { PlanCard } from "../components/PlanCard";
import { PaymentDialog } from "../components/PaymentDialog";
import { Plan } from "../types";
import { toast } from "sonner";
import { subscriptionService } from "../service/subscription-service";
import { 
  ShieldCheck, RefreshCw, CheckCircle2, XCircle, 
  ArrowRight, Globe, AlertTriangle 
} from "lucide-react";

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

    // --- VÉRIFICATION RÉSEAU ---
    if (!window.navigator.onLine) {
      toast.error("ERREUR RÉSEAU", {
        description: "Vérifiez votre connexion internet avant d'initier le paiement.",
        className: "bg-red-950 border-red-500 text-white font-black uppercase italic text-[10px]"
      });
      return;
    }

    setIsProcessing(true);
    setStatus('IDLE');

    try {
      await subscriptionService.processPaymentFlow(userId, selectedPlan, phone);
      
      // SUCCÈS
      setStatus('SUCCESS');
      toast.success("SYSTÈME MIS À JOUR");
      setSelectedPlan(null);
      refresh(); 
    } catch (e: any) {
      // ÉCHEC
      setStatus('ERROR');
      toast.error("ÉCHEC DE L'OPÉRATION");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500 selection:text-black flex flex-col relative overflow-hidden">
      
      {/* --- ÉCRAN DE SUCCÈS (OVERLAY) --- */}
      {status === 'SUCCESS' && (
        <div className="fixed inset-0 flex items-center justify-center p-4 bg-[#020202]/90 backdrop-blur-md z-[110] animate-in fade-in duration-500">
          <div className="bg-[#080808] border border-emerald-500/30 rounded-[2.5rem] p-10 max-w-sm w-full text-center flex flex-col items-center shadow-[0_0_60px_rgba(16,185,129,0.15)] animate-in zoom-in-95 duration-500">
            <div className="w-24 h-24 rounded-full bg-emerald-500/10 flex items-center justify-center mb-8 animate-[pulse_2s_ease-in-out_infinite]">
              <CheckCircle2 className="w-12 h-12 text-emerald-500" />
            </div>
            <h2 className="text-3xl font-black uppercase italic text-white mb-3 tracking-tighter">
              Félicitations !
            </h2>
            <p className="text-[10px] text-emerald-500 font-black uppercase tracking-[0.3em] mb-8 italic">
              Terminal_Activé_Avec_Succès
            </p>
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 w-full mb-8">
              <p className="text-[9px] text-white/40 uppercase font-black mb-2 tracking-widest">Niveau de privilège :</p>
              <p className="text-lg font-black italic text-white uppercase">{activeSubscription?.plans?.nom || "Plan Actif"}</p>
            </div>
            <button
              onClick={() => setStatus('IDLE')}
              className="group w-full py-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase italic tracking-widest text-[11px] transition-all active:scale-95 flex items-center justify-center gap-3"
            >
              Accéder au Dashboard <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      )}

      {/* --- ÉCRAN D'ERREUR (OVERLAY) --- */}
      {status === 'ERROR' && (
        <div className="fixed inset-0 flex items-center justify-center p-4 bg-[#020202]/90 backdrop-blur-md z-[110] animate-in fade-in duration-500">
          <div className="bg-[#080808] border border-red-500/30 rounded-[2.5rem] p-10 max-w-sm w-full text-center flex flex-col items-center shadow-[0_0_60px_rgba(239,68,68,0.1)]">
            <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-8">
              <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-black uppercase italic text-white mb-2 tracking-tighter">
              ÉCHEC FLUX
            </h2>
            <p className="text-[10px] text-red-500/60 font-black uppercase tracking-[0.2em] mb-8 leading-tight">
              La transaction a été interrompue ou refusée par l'opérateur.
            </p>
            <button
              onClick={() => setStatus('IDLE')}
              className="w-full py-4 rounded-xl border border-white/10 hover:bg-white/5 text-white/40 hover:text-white font-black uppercase italic tracking-widest text-[10px] transition-all"
            >
              Réessayer le protocole
            </button>
          </div>
        </div>
      )}

      {/* HEADER COMPACT */}
      <header className="w-full max-w-7xl mx-auto px-6 pt-10 mb-6 shrink-0">
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

      {/* ZONE DE PLANS */}
      <main className="flex-grow overflow-hidden relative group">
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
          <div className="shrink-0 w-12 h-full"></div>
        </div>
      </main>

      {/* OVERLAY CHARGEMENT (SYNC) */}
      {isProcessing && (
        <div className="fixed inset-0 bg-[#050505]/95 backdrop-blur-xl z-[150] flex flex-col items-center justify-center animate-in fade-in duration-300">
          <div className="relative mb-8">
             <RefreshCw className="w-20 h-20 text-emerald-500 animate-spin" />
             <div className="absolute inset-0 flex items-center justify-center">
                <Globe className="w-6 h-6 text-emerald-500/30" />
             </div>
          </div>
          <p className="font-black italic uppercase tracking-[0.5em] text-[10px] text-emerald-500/60 animate-pulse">Synchronisation_Bancaire_En_Cours...</p>
        </div>
      )}

      {/* DIALOGUE DE PAIEMENT */}
      <PaymentDialog 
        plan={selectedPlan}
        open={!!selectedPlan}
        onOpenChange={(isOpen) => !isProcessing && setSelectedPlan(isOpen ? selectedPlan : null)}
        onConfirm={handleFinalPayment}
        loading={isProcessing}
      />

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .text-glow-green { text-shadow: 0 0 20px rgba(16,185,129,0.3); }
      `}</style>
    </div>
  );
}