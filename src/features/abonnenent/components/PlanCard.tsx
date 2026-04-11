// src/features/abonnement/components/PlanCard.tsx
import { Plan } from "../types";
import { Check, RefreshCw, Clock, ArrowRight, Zap } from "lucide-react";

interface PlanCardProps {
  plan: Plan;
  status: 'ACTIVE' | 'QUEUED' | 'AVAILABLE'; 
  days: number;                             
  onSelect: () => void;
}

export function PlanCard({ plan, status, days, onSelect }: PlanCardProps) {
  const isActive = status === 'ACTIVE';
  const isQueued = status === 'QUEUED';

  return (
    <div className={`relative p-8 rounded-[2.5rem] border transition-all duration-700 flex flex-col h-full group overflow-hidden
      ${isActive 
        ? 'bg-emerald-500/[0.03] border-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.1)]' 
        : isQueued 
        ? 'bg-zinc-400/[0.02] border-zinc-500/50 shadow-[0_0_30px_rgba(161,161,170,0.05)]' 
        : 'bg-[#050505] border-white/5 hover:border-emerald-500/40 hover:bg-white/[0.01]'}`}>
      
      {/* 1. ÉTAT DE L'ABONNEMENT */}
      <div className="flex justify-between items-start mb-6 relative z-10 h-8">
        {isActive && (
          <div className="bg-emerald-500 text-black px-4 py-1.5 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 shadow-lg shadow-emerald-500/20">
            <Zap className="w-3 h-3 fill-black" /> 
            Abonnement Actif
          </div>
        )}

        {isQueued && (
          <div className="bg-zinc-200 text-black px-4 py-1.5 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 shadow-lg shadow-white/5">
            <Clock className="w-3.5 h-3.5" /> 
            Prochainement
          </div>
        )}
        
        {(isActive || isQueued) && (
          <div className="flex flex-col items-end">
            <span className="text-[12px] font-black text-white italic">{days} JOURS</span>
            <span className="text-[8px] font-bold text-white/30 uppercase tracking-tighter leading-none">Restants</span>
          </div>
        )}
      </div>

      {/* 2. INFOS PRINCIPALES */}
      <div className="mb-8 relative z-10">
        <h3 className={`text-[11px] font-black uppercase tracking-[0.3em] mb-4 transition-colors ${isActive ? 'text-emerald-500' : isQueued ? 'text-zinc-400' : 'text-white/20'}`}>
          {plan.nom}
        </h3>
        <div className="flex items-baseline gap-2">
          <span className="text-6xl font-black italic tracking-tighter text-white">
            {plan.prix}<span className="text-2xl not-italic ml-1 text-white/20 font-light">$</span>
          </span>
          <div className="flex flex-col border-l border-white/10 pl-3 ml-1">
             <span className={`${isActive ? 'text-emerald-500' : isQueued ? 'text-zinc-500' : 'text-white/10'} font-black uppercase text-[8px] tracking-[0.2em] leading-none mb-1`}>Durée</span>
             <span className="text-white font-black uppercase text-[12px] italic tracking-tighter leading-none">{plan.duree_jour}J</span>
          </div>
        </div>
      </div>

      {/* 3. AVANTAGES */}
      <div className="space-y-3 mb-10 flex-grow relative z-10">
        {plan.avantages?.map((avantage, idx) => (
          <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 group-hover:bg-white/[0.03] transition-all">
            <div className={`p-1 rounded-md ${isActive ? 'bg-emerald-500/10' : isQueued ? 'bg-zinc-500/10' : 'bg-white/5'}`}>
              <Check className={`w-3.5 h-3.5 stroke-[4px] ${isActive ? 'text-emerald-500' : isQueued ? 'text-zinc-400' : 'text-white/20'}`} />
            </div>
            <span className="text-[10px] font-black text-white/40 uppercase tracking-wide group-hover:text-white/80 transition-colors italic leading-none">
              {avantage}
            </span>
          </div>
        ))}
      </div>

      {/* 4. BOUTON D'ACTION */}
      <button 
        onClick={onSelect}
        className={`w-full h-16 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[10px] italic flex items-center justify-center gap-3 transition-all relative overflow-hidden group/btn
          ${isActive 
            ? 'bg-emerald-500 text-black shadow-xl shadow-emerald-500/10' 
            : isQueued 
            ? 'bg-zinc-100 text-black shadow-xl shadow-white/5' 
            : 'bg-white/[0.03] text-white/40 border border-white/5 hover:border-emerald-500/50 hover:text-white hover:bg-emerald-500/5'}`}>
        
        <span className="relative z-10 flex items-center gap-2">
            {isActive ? (
              <>Renouveler mon pack <RefreshCw className="w-4 h-4" /></>
            ) : isQueued ? (
              <>Ajouter du temps <Clock className="w-4 h-4" /></>
            ) : (
              <>Prendre ce pack <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" /></>
            )}
        </span>
      </button>
      
      {/* GRADIENT DE FOND (Argenté vs Émeraude) */}
      <div className={`absolute -bottom-20 -right-20 w-64 h-64 blur-[100px] rounded-full pointer-events-none opacity-[0.05] transition-all duration-1000
        ${isActive ? 'bg-emerald-500' : isQueued ? 'bg-zinc-400' : 'bg-transparent'}`} />
    </div>
  );
}