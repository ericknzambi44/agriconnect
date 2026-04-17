import { Plan } from "../types";
import { Check, Clock, ArrowRight, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export function PlanCard({ plan, status, days, onSelect, canBuy, safetyMessage }: any) {
  const isActive = status === 'ACTIVE';

  return (
    <div className={cn(
      "relative p-4 rounded-[1.5rem] border transition-all flex flex-col h-full overflow-hidden",
      isActive ? "bg-emerald-500/[0.01] border-emerald-500" : "bg-[#050505] border-white/5"
    )}>
      
      {/* HEADER : STATUT & JOURS */}
      <div className="flex justify-between items-center mb-3">
        <span className={cn(
          "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest",
          isActive ? "bg-emerald-500 text-black" : "bg-white/5 text-white/30"
        )}>
          {isActive ? 'Actif' : 'Libre'}
        </span>
        
        {isActive && (
          <div className="text-right leading-none">
            <span className="text-xl font-black text-emerald-500 italic">{days}J</span>
          </div>
        )}
      </div>

      {/* INFOS : NOM & PRIX */}
      <div className="mb-3">
        <h3 className="text-[8px] font-bold uppercase text-yellow-600 tracking-tighter">{plan.nom}</h3>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-black italic text-white">{plan.prix}$</span>
          <span className="text-[10px] font-bold text-white/10 uppercase">/ {plan.duree_jour}J</span>
        </div>
      </div>

      {/* FEATURES : MINIMALISTE */}
      <div className="space-y-1 mb-4 flex-grow">
        {plan.avantages?.slice(0, 3).map((av: string, i: number) => (
          <div key={i} className="flex items-center gap-2">
            <Check className={cn("w-2.5 h-2.5", isActive ? "text-emerald-500" : "text-white/20")} />
            <span className="text-[8px] font-bold text-white/40 uppercase truncate">{av}</span>
          </div>
        ))}
      </div>

      {/* BOUTON : ACTION DIRECTE */}
      <button 
        onClick={onSelect}
        disabled={!canBuy}
        className={cn(
          "w-full h-10 rounded-lg font-black uppercase text-[9px] italic flex items-center justify-center gap-2",
          !canBuy ? "bg-white/5 text-white/10" : isActive ? "bg-emerald-500 text-black" : "bg-white text-black"
        )}>
        {!canBuy ? <Lock className="w-3 h-3"/> : isActive ? <Clock className="w-3 h-3"/> : <ArrowRight className="w-3 h-3"/>}
        {!canBuy ? "Bloqué" : isActive ? "Prolonger" : "Activer"}
      </button>

      {!canBuy && <p className="mt-1.5 text-[12px] text-center  font-black/5 text-emerald-600/100 uppercase">{safetyMessage}</p>}
    </div>
  );
}