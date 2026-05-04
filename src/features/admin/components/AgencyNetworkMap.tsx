// src/features/admin/components/AgencyNetworkMap.tsx
import React from 'react';
 // Ajusté selon ta structure
import { MapPin, Users, Settings2, Trash2, Plus, Globe, Activity } from 'lucide-react';
import { cn } from "@/lib/utils";
import { useAgencyManager } from '../hooks/use-agency-manager';

export const AgencyNetworkMap = () => {
  const { agencies, loading, deleteAgency } = useAgencyManager();

  return (
    <div className="space-y-8">
      {/* HEADER DE SECTION : Intelligent & Adaptatif */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 px-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary/60">
            <Globe size={14} className="animate-spin-slow" />
            <span className="text-[9px] font-mono font-black uppercase tracking-[0.4em]">Infrastructure_Map</span>
          </div>
          <h3 className="font-display font-black italic text-2xl md:text-3xl text-white uppercase tracking-tighter">
            Réseau_<span className="text-primary text-glow">Agences</span>
          </h3>
        </div>

        <button className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white hover:bg-primary text-black px-6 py-3.5 rounded-2xl font-black text-[11px] uppercase italic transition-all active:scale-95 shadow-[0_10px_20px_-10px_rgba(255,255,255,0.2)]">
          <Plus size={16} strokeWidth={3} /> Déployer_Nouveau_Node
        </button>
      </div>

      {/* GRILLE D'AGENCES : Responsive Breakpoints */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-5 md:gap-6">
        {loading ? (
           <div className="col-span-full py-24 flex flex-col items-center justify-center border border-white/5 bg-white/[0.01] rounded-[2.5rem]">
              <div className="relative mb-4">
                <Activity size={32} className="text-primary animate-pulse" />
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
              </div>
              <span className="font-tech text-[10px] text-white/20 uppercase tracking-[0.5em] animate-pulse text-center px-6">
                Scanning_Global_Network_Topology...
              </span>
           </div>
        ) : agencies.length === 0 ? (
           <div className="col-span-full py-20 text-center border border-dashed border-white/10 rounded-[2.5rem]">
              <p className="font-tech text-[10px] text-white/10 uppercase">Aucun Node détecté sur le réseau</p>
           </div>
        ) : agencies.map((agency) => (
          <div 
            key={agency.id} 
            className="group relative bg-[#0A0A0A] border border-white/5 p-5 md:p-7 rounded-[2rem] hover:border-primary/40 hover:bg-white/[0.02] transition-all duration-500 overflow-hidden"
          >
            {/* Décoration Terminal en arrière-plan */}
            <div className="absolute top-0 right-0 p-4 opacity-[0.02] font-mono text-[40px] font-black pointer-events-none select-none uppercase italic">
              Node_{agency.id?.substring(0, 2)}
            </div>

            <div className="flex justify-between items-start mb-8 relative z-10">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-white/5 rounded-[1.2rem] group-hover:bg-primary/10 group-hover:text-primary transition-all duration-500 border border-white/5 group-hover:border-primary/20">
                    <MapPin size={22} />
                </div>
                <div>
                    <h4 className="text-lg md:text-xl font-black text-white uppercase italic tracking-tighter group-hover:text-primary transition-colors">
                        {agency.nom}
                    </h4>
                    <div className="flex items-center gap-2 mt-1 text-[9px] font-mono text-white/30 uppercase tracking-widest">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        Status: Operational
                    </div>
                </div>
              </div>

              {/* Actions : Tactile-friendly sur mobile */}
              <div className="flex gap-2">
                <button className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-white/20 hover:text-white transition-all active:scale-90">
                  <Settings2 size={16} />
                </button>
                <button 
                  onClick={() => deleteAgency(agency.id)}
                  className="p-2.5 bg-red-500/5 hover:bg-red-500/20 rounded-xl text-red-500/20 hover:text-red-500 transition-all active:scale-90"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {/* Localisation Info */}
            <div className="mb-6 relative z-10">
                <p className="text-[10px] md:text-[11px] text-white/40 font-medium leading-relaxed flex items-start gap-2 bg-white/[0.03] p-3 rounded-xl border border-white/5">
                   <span className="text-primary mt-0.5 opacity-50 shrink-0">ADDRESS_INFO ::</span>
                   <span className="italic">{agency.adresse}</span>
                </p>
            </div>

            {/* Statistiques du Node */}
            <div className="flex flex-col sm:flex-row items-center justify-between pt-5 border-t border-white/5 gap-4 relative z-10">
              <div className="flex items-center gap-6 w-full sm:w-auto">
                <div className="flex items-center gap-2">
                    <Users size={14} className="text-white/20" />
                    <div className="flex flex-col">
                        <span className="text-[7px] font-mono text-white/20 uppercase tracking-widest">Personnel</span>
                        <span className="text-[10px] font-black text-white font-mono">
                          {agency.staff_count?.[0]?.count || 0} UNITÉS
                        </span>
                    </div>
                </div>
                
                {/* Métrique additionnelle (Factice mais renforce le look Pro) */}
                <div className="flex items-center gap-2 border-l border-white/10 pl-6">
                    <Activity size={14} className="text-white/20" />
                    <div className="flex flex-col">
                        <span className="text-[7px] font-mono text-white/20 uppercase tracking-widest">Load</span>
                        <span className="text-[10px] font-black text-emerald-500 font-mono">OPTIMAL</span>
                    </div>
                </div>
              </div>

              <button className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-white/5 bg-white/[0.02] text-[9px] font-black uppercase italic text-primary hover:bg-primary/10 hover:border-primary/20 transition-all text-center">
                Gérer_Protocoles_Staff →
              </button>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .animate-spin-slow { animation: spin 8s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .text-glow { text-shadow: 0 0 15px rgba(var(--primary), 0.4); }
      `}</style>
    </div>
  );
};