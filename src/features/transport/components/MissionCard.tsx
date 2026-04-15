import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, User, ArrowRight, MapPin, ShieldCheck, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export function MissionCard({ mission, onAction }: any) {
  const isDepot = mission.statut === 'EN_ATTENTE_DEPOT';
  const isTransit = mission.statut === 'EN_TRANSIT' || mission.statut === 'RECU_AGENCE';
  const isLivre = mission.statut === 'LIVRE';

  return (
    <Card className="bg-[#080808] border-white/5 p-4 sm:p-6 rounded-[2rem] group hover:border-emerald-500/30 transition-all duration-500 relative overflow-hidden flex flex-col justify-between min-h-[380px]">
      {/* BACKGROUND DECOR */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[50px] -mr-16 -mt-16 pointer-events-none" />
      
      <div className="relative z-10 space-y-6">
        {/* HEADER : ID & STEPS */}
        <div className="flex justify-between items-start gap-4">
          <div className="flex gap-1 flex-1">
            {[ 
              { label: 'DEP', active: isDepot || isTransit || isLivre },
              { label: 'TRA', active: isTransit || isLivre },
              { label: 'FIN', active: isLivre }
            ].map((s, i) => (
              <div key={i} className="flex-1 space-y-1.5">
                <div className={cn("h-[3px] rounded-full transition-all", s.active ? "bg-emerald-500 shadow-[0_0_8px_#10b981]" : "bg-white/5")} />
                <span className={cn("font-tech text-[6px] tracking-tighter", s.active ? "text-emerald-500" : "text-white/10")}>{s.label}</span>
              </div>
            ))}
          </div>
          <Badge className="bg-white/[0.03] border-white/5 text-[8px] font-tech text-white/40 px-2 py-0">
            #{mission.id?.split('-')[0]}
          </Badge>
        </div>

        {/* PRODUIT & QUANTITÉ */}
        <div className="flex items-center gap-3 border-b border-white/5 pb-4">
          <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
            <Package className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="min-w-0">
            <h3 className="font-display text-xl sm:text-2xl font-black italic text-white uppercase leading-none truncate">
              {mission.annonce?.titre || "UNSET_PRODUCT"}
            </h3>
            <div className="flex items-center gap-2 mt-1">
               <span className="font-tech text-[9px] text-emerald-500/60 font-bold uppercase tracking-widest">{mission.quantite_transportee} KG</span>
               <span className="h-1 w-1 rounded-full bg-white/10" />
               <span className="font-tech text-[8px] text-white/20 uppercase">Stock_Sync</span>
            </div>
          </div>
        </div>

        {/* ACTEURS (VENDEUR & ACHETEUR) - MICRO GRID */}
        <div className="grid grid-cols-1 gap-2">
          <div className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/5 rounded-xl">
             <div className="flex items-center gap-2 overflow-hidden">
                <User className="w-3 h-3 text-white/20 shrink-0" />
                <span className="font-tech text-[8px] text-white/40 uppercase truncate">Vendeur:</span>
                <span className="font-tech text-[9px] text-white font-bold truncate">
                  {mission.annonce?.vendeur?.nom || "ANONYME"}
                </span>
             </div>
             <ArrowRight className="w-2 h-2 text-white/10" />
          </div>
          
          <div className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/5 rounded-xl">
             <div className="flex items-center gap-2 overflow-hidden">
                <MapPin className="w-3 h-3 text-emerald-500 shrink-0" />
                <span className="font-tech text-[8px] text-white/40 uppercase truncate">Acheteur:</span>
                <span className="font-tech text-[9px] text-white font-bold truncate">
                   {mission.acheteur?.nom || "CLIENT"}
                </span>
             </div>
          </div>
        </div>
      </div>

      {/* ACTION FOOTER */}
      <button 
        onClick={() => onAction(mission)}
        disabled={isLivre}
        className={cn(
          "w-full mt-6 py-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 font-display italic text-xs tracking-widest uppercase",
          isLivre 
            ? "bg-white/5 text-white/20 cursor-not-allowed" 
            : "bg-emerald-500 text-black hover:bg-emerald-400 hover:shadow-[0_10px_30px_rgba(16,185,129,0.3)] active:scale-95"
        )}
      >
        {isLivre ? <Clock className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
        {isLivre ? "Mission_Clôturée" : isDepot ? "Valider_Dépôt" : "Valider_Livraison"}
      </button>
    </Card>
  );
}