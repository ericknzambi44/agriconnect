/**
 * @file src/components/dashboard/StatCard.tsx
 * @description Carte KPI "Intelligence Adaptative" - Redimensionnement fluide.
 */
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  trend: number;
  label: string; 
}

export const StatCard = ({ title, value, trend, label }: StatCardProps) => {
  const isPositive = trend > 0;
  
  return (
    <Card className="bg-[#0d0d0d] border border-white/5 rounded-2xl transition-all duration-500 hover:bg-zinc-900/60 hover:border-primary/20 group cursor-default shadow-2xl overflow-hidden relative w-full">
      {/* Lueur subtile en background au hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <CardContent className="p-[clamp(1rem,4vw,1.75rem)] flex flex-col justify-between min-h-[140px] md:h-44 relative z-10 gap-4">
        
        {/* LIGNE DU HAUT : TITRE + TREND */}
        <div className="flex justify-between items-start gap-2">
          <p className="text-[clamp(8px,1.5vw,10px)] font-black text-white/40 uppercase tracking-[0.2em] md:tracking-[0.25em] group-hover:text-white/60 transition-colors leading-tight">
            {title}
          </p>
          
          <div className={`flex items-center gap-1 px-2 py-0.5 md:px-2.5 md:py-1 rounded-lg text-[clamp(7px,1.2vw,9px)] font-black border transition-all duration-500 shrink-0 ${
            isPositive 
              ? "bg-green-500/5 border-green-500/10 text-green-500 group-hover:border-green-500/30" 
              : "bg-red-500/5 border-red-500/10 text-red-500 group-hover:border-red-500/30"
          }`}>
            {isPositive ? <TrendingUp size={10} className="md:w-3 md:h-3" /> : <TrendingDown size={10} className="md:w-3 md:h-3" />}
            <span className="font-mono">{isPositive ? `+${trend}%` : `${trend}%`}</span>
          </div>
        </div>

        {/* VALEUR CENTRALE & LABEL */}
        <div className="flex flex-col gap-1 sm:gap-2">
          <h3 className="text-[clamp(2rem,8vw,3rem)] md:text-5xl font-black text-white tracking-tighter group-hover:text-primary transition-all duration-500 group-hover:drop-shadow-[0_0_15px_rgba(234,88,12,0.4)] leading-none">
            {value}
          </h3>
          
          {/* LABEL DU BAS */}
          <div className="flex items-center gap-2 md:gap-3 mt-1 md:mt-2">
            <span className="h-[2px] w-4 md:w-6 bg-primary/20 group-hover:w-8 md:group-hover:w-10 group-hover:bg-primary transition-all duration-500"></span> 
            <p className="text-[clamp(7px,1.2vw,9px)] md:text-[10px] font-bold italic text-white/50 uppercase tracking-[0.15em] md:tracking-[0.2em] group-hover:text-white/80 transition-colors truncate">
              {label}
            </p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};