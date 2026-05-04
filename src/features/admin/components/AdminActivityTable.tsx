// src/features/admin/components/AdminActivityTable.tsx
import React from 'react';
import { useAdminActivity } from '../hooks/use-admin-activity';
import { Activity, Clock, Box, User, ArrowRight } from 'lucide-react';
import { cn } from "@/lib/utils";

export const AdminActivityTable = () => {
  const { activities, loading } = useAdminActivity();

  // Helper pour les couleurs de statut "Neon"
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'EN_TRANSIT':
        return 'bg-primary/10 text-primary border-primary/20 shadow-[0_0_10px_rgba(var(--primary),0.2)]';
      case 'LIVRE':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'ANNULE':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      default:
        return 'bg-white/5 text-white/40 border-white/10';
    }
  };

  return (
    <div className="bg-[#0A0A0A] border border-white/5 rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden">
      {/* Header du Flux */}
      <div className="p-6 md:p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
                <Activity size={18} className="text-primary animate-pulse" />
            </div>
            <h3 className="font-display font-black italic text-lg md:text-xl text-white uppercase tracking-tighter">
                Flux_<span className="text-primary">Opérations</span>
            </h3>
        </div>
        <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-[8px] text-white/20 uppercase tracking-widest hidden sm:inline">Live_Stream</span>
        </div>
      </div>
      
      <div className="p-2 md:p-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
             <div className="w-12 h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="w-1/2 h-full bg-primary animate-[loading_1.5s_infinite]" />
             </div>
             <span className="font-tech text-[9px] text-white/20 uppercase tracking-[0.4em]">Intercepting_Data_Packets...</span>
          </div>
        ) : (
          <div className="space-y-2">
            {activities.length === 0 ? (
                <div className="text-center py-10 text-white/10 font-mono text-[10px] uppercase">Aucun log détecté</div>
            ) : activities.map((act) => (
              <div 
                key={act.id} 
                className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl border border-transparent hover:border-white/5 hover:bg-white/[0.02] transition-all duration-300 gap-4"
              >
                {/* Info Principale : Tracking & User */}
                <div className="flex items-start gap-4 w-full sm:w-auto">
                    <div className="mt-1 p-2 bg-white/5 rounded-lg text-white/20 group-hover:text-primary transition-colors">
                        <Box size={16} />
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <p className="text-[11px] font-black text-white uppercase tracking-wider group-hover:text-primary transition-colors">
                                {act.tracking_number}
                            </p>
                            <span className="text-[8px] font-mono text-white/10 hidden md:inline">|</span>
                            <span className="text-[9px] font-mono text-white/20 uppercase hidden md:inline">Type: Freight</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <User size={10} className="text-white/20" />
                            <p className="text-[9px] font-tech text-white/40 tracking-widest uppercase truncate max-w-[150px]">
                                {act.utilisateurs?.prenom} {act.utilisateurs?.nom}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Métriques & Status (Mobile Optimized) */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-none border-white/5">
                    <div className="flex flex-col items-start sm:items-end">
                        <div className="flex items-center gap-1.5 text-white/20 mb-1">
                            <Clock size={10} />
                            <span className="text-[8px] font-mono uppercase">Timestamp</span>
                        </div>
                        <span className="text-[10px] font-bold text-white/60 font-mono italic">
                            {new Date(act.created_at || Date.now()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className={cn(
                            "text-[8px] font-black px-3 py-1.5 rounded-lg border uppercase italic transition-all",
                            getStatusStyles(act.statut)
                        )}>
                            {act.statut.replace('_', ' ')}
                        </span>
                        
                        <button className="p-2 text-white/10 hover:text-white hover:bg-white/5 rounded-lg transition-all hidden md:block">
                            <ArrowRight size={14} />
                        </button>
                    </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer du Tableau */}
      <div className="p-4 bg-white/[0.01] border-t border-white/5 text-center">
         <button className="text-[9px] font-mono text-white/10 hover:text-primary uppercase tracking-[0.3em] transition-colors">
            Afficher_Archive_Complete [+]
         </button>
      </div>

      <style>{`
        @keyframes loading {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
};