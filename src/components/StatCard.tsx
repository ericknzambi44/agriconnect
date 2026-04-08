/**
 * @file src/components/dashboard/StatCard.tsx
 * @description Carte KPI "Zinc Edition" - Visibilité accrue et hover furtif.
 * * SOLUTIONS :
 * - Opacité des textes augmentée (white/40 et white/50) pour une lecture claire.
 * - Hover 'zinc-900/60' identique à RecentReceptions.
 * - Alignement vertical optimisé pour ne pas "étouffer" la valeur centrale.
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
    <Card className="bg-[#0d0d0d] border border-white/5 rounded-2xl transition-all duration-500 hover:bg-zinc-900/60 hover:border-primary/20 group cursor-default shadow-2xl overflow-hidden relative">
      {/* Lueur subtile en background au hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <CardContent className="p-7 flex flex-col justify-between h-44 relative z-10">
        
        {/* LIGNE DU HAUT : TITRE + TREND */}
        <div className="flex justify-between items-start">
          <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.25em] group-hover:text-white/60 transition-colors">
            {title}
          </p>
          
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-black border transition-all duration-500 ${
            isPositive 
              ? "bg-green-500/5 border-green-500/10 text-green-500 group-hover:border-green-500/30" 
              : "bg-red-500/5 border-red-500/10 text-red-500 group-hover:border-red-500/30"
          }`}>
            {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            <span className="font-mono">{isPositive ? `+${trend}%` : `${trend}%`}</span>
          </div>
        </div>

        {/* VALEUR CENTRALE (Cœur de la carte) */}
        <div className="flex flex-col gap-1">
          <h3 className="text-5xl font-black text-white tracking-tighter group-hover:text-primary transition-all duration-500 group-hover:drop-shadow-[0_0_15px_rgba(234,88,12,0.4)]">
            {value}
          </h3>
          
          {/* LABEL DU BAS (Visible et propre) */}
          <div className="flex items-center gap-3 mt-2">
            <span className="h-[2px] w-6 bg-primary/20 group-hover:w-10 group-hover:bg-primary transition-all duration-500"></span> 
            <p className="text-[10px] font-bold italic text-white/50 uppercase tracking-[0.2em] group-hover:text-white/80 transition-colors">
              {label}
            </p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};