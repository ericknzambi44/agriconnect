// src/features/abonnement/components/PlanCard.tsx
import { Plan } from "../types";
import { Check, Clock, ArrowRight, Lock, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlanCardProps {
  plan: Plan;
  status: 'ACTIVE' | 'AVAILABLE';
  days: number;
  onSelect: () => void;
  canBuy: boolean;
  safetyMessage?: string;
}

export function PlanCard({ plan, status, days, onSelect, canBuy, safetyMessage }: PlanCardProps) {
  const isActive = status === 'ACTIVE';

  return (
    <div className={cn(
      "relative p-5 rounded-[1.8rem] border-2 transition-all duration-500 flex flex-col h-full max-h-[440px] overflow-hidden group",
      isActive 
        ? "border-primary bg-primary/5 shadow-[0_0_40px_-10px_rgba(var(--primary),0.3)] scale-[1.02]" 
        : "bg-secondary border-border hover:border-primary/20"
    )}>
      
      {/* ANIMATED BACKGROUND GRADIENTS (Real-time glow) */}
      {isActive && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 blur-[60px] rounded-full animate-pulse" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-primary/10 blur-[50px] rounded-full animate-pulse delay-700" />
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(var(--primary),0.05)_50%,transparent_75%)] bg-[length:250%_250%] animate-[shimmer_4s_infinite_linear]" />
        </div>
      )}

      {/* CONTENT WRAPPER */}
      <div className="relative z-10 flex flex-col h-full">
        
        {/* HEADER */}
        <div className="flex justify-between items-start mb-4">
          <div className={cn(
            "p-2.5 rounded-xl border-2 transition-all duration-500",
            isActive ? "bg-primary text-primary-foreground border-primary shadow-[0_0_15px_rgba(var(--primary),0.5)]" : "bg-background border-border text-muted-foreground"
          )}>
            <Zap size={18} className={isActive ? "animate-pulse" : ""} />
          </div>
          <div className={cn(
            "px-3 py-1 rounded-full font-tech text-[8px] font-black uppercase tracking-tighter border-2 transition-all",
            isActive ? "bg-primary/20 border-primary/40 text-primary animate-pulse" : "bg-border/20 border-border text-muted-foreground/30"
          )}>
            {isActive ? 'NODE_SYNC_ACTIVE' : 'STANDBY_MODE'}
          </div>
        </div>

        {/* PRICE SECTION */}
        <div className="mb-5">
          <h3 className="font-display font-black italic uppercase text-lg tracking-tighter text-foreground/90 leading-none mb-2 group-hover:text-primary transition-colors">
            {plan.nom}
          </h3>
          <div className="flex items-baseline gap-1.5">
            <span className={cn("text-4xl font-display font-black italic tracking-tighter transition-all", isActive ? "text-primary text-glow" : "text-white")}>
              {plan.prix}$
            </span>
            <span className="font-tech text-[9px] font-bold text-muted-foreground/40 uppercase">/ {plan.duree_jour}J</span>
          </div>
          
          {isActive && (
            <div className="mt-2 flex items-center gap-1.5 text-primary/80 animate-bounce-subtle">
              <Clock size={12} />
              <span className="font-tech text-[10px] font-black italic uppercase tracking-tighter">SESSION: {days}J RESTANTS</span>
            </div>
          )}
        </div>

        {/* FEATURES */}
        <div className="space-y-2 mb-6 flex-grow overflow-hidden">
          {plan.avantages?.slice(0, 4).map((av: string, i: number) => (
            <div key={i} className="flex items-center gap-2.5 opacity-80 group-hover:opacity-100 transition-opacity">
              <Check size={12} className={cn("shrink-0", isActive ? "text-primary" : "text-muted-foreground/20")} strokeWidth={4} />
              <span className="font-tech text-[9px] font-bold text-foreground/80 uppercase truncate tracking-wide">{av}</span>
            </div>
          ))}
        </div>

        {/* ACTION BUTTON (Locked if Active) */}
        <div className="mt-auto">
          <button 
            onClick={onSelect}
            disabled={isActive || !canBuy}
            className={cn(
              "w-full h-12 rounded-xl font-display font-black uppercase italic text-[11px] tracking-widest flex items-center justify-center gap-3 transition-all",
              isActive 
                ? "bg-primary/10 border-2 border-primary/30 text-primary cursor-not-allowed opacity-80" 
                : !canBuy
                  ? "bg-secondary border-2 border-border text-muted-foreground/20 cursor-not-allowed"
                  : "bg-white text-black hover:bg-primary hover:text-white hover:shadow-[0_0_20px_rgba(var(--primary),0.4)] active:scale-95"
            )}>
            {isActive || !canBuy ? <Lock size={14}/> : <ArrowRight size={14}/>}
            {isActive ? "SÉCURISÉ / ACTIF" : !canBuy ? "VERROUILLÉ" : "ACTIVER"}
          </button>

          {!canBuy && !isActive && (
            <p className="mt-2 text-[8px] text-center font-tech text-red-500 font-black uppercase tracking-tighter animate-pulse">
              {safetyMessage}
            </p>
          )}
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: 0% 0%; }
          100% { background-position: 200% 200%; }
        }
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        .text-glow { text-shadow: 0 0 10px rgba(var(--primary), 0.5); }
        .animate-bounce-subtle { animation: bounce-subtle 2s infinite ease-in-out; }
      `}</style>
    </div>
  );
}