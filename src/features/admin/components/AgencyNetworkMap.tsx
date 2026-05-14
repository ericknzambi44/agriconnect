// src/features/admin/components/AgencyNetworkMap.tsx
import React from 'react';
import { MapPin, Users, Settings2, Trash2, Plus, Globe, Activity, Terminal, ShieldAlert } from 'lucide-react';
import { cn } from "@/lib/utils";
import { useAgencyManager } from '../hooks/use-agency-manager';
import { toast } from 'sonner';

export const AgencyNetworkMap = () => {
  const { agencies, loading, deleteAgency } = useAgencyManager();

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`DÉMANTELER LE NODE : ${name.toUpperCase()} ?`)) return;
    const t = toast.loading("DÉCONNEXION_INFRASTRUCTURE...");
    try {
      await deleteAgency(id);
      toast.success("Node déconnecté du réseau", { id: t });
    } catch (e) {
      toast.error("Erreur de protocole : Node protégé", { id: t });
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* --- HEADER DE SECTION : COMMAND & CONTROL --- */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-8 px-4">
        <div className="relative">
          <div className="flex items-center gap-3 text-primary/50 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
                <Globe size={16} className="animate-spin-slow" />
            </div>
            <span className="text-[10px] font-mono font-black uppercase tracking-[0.5em]">Global_Node_Topology_v2.4</span>
          </div>
          <h3 className="font-black italic text-3xl md:text-5xl text-white uppercase tracking-tighter leading-none">
            Infrastructure_<span className="text-primary text-glow">Réseau</span>
          </h3>
          <div className="absolute -left-4 top-0 bottom-0 w-1 bg-primary/20 rounded-full" />
        </div>

        <button className="group w-full xl:w-auto flex items-center justify-center gap-4 bg-white hover:bg-primary text-black h-16 px-10 rounded-[1.5rem] font-black text-xs uppercase italic transition-all active:scale-95 shadow-[0_20px_40px_-15px_rgba(255,255,255,0.1)]">
          <Plus size={20} strokeWidth={4} className="group-hover:rotate-90 transition-transform" /> 
          Déployer_agence
        </button>
      </div>

      {/* --- GRILLE D'AGENCES : THE MATRIX --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-2">
        {loading ? (
           <div className="col-span-full py-32 flex flex-col items-center justify-center border-2 border-white/5 bg-[#050505] rounded-[3.5rem] relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-50" />
              <Activity size={48} className="text-primary animate-pulse mb-6 relative z-10" />
              <span className="font-mono text-[11px] text-white/30 uppercase tracking-[0.6em] animate-pulse relative z-10">
                Synchronisation_Topologique_En_Cours...
              </span>
           </div>
        ) : agencies.length === 0 ? (
           <div className="col-span-full py-24 text-center border-2 border-dashed border-white/5 rounded-[3.5rem] bg-white/[0.01]">
              <ShieldAlert size={40} className="mx-auto text-white/10 mb-4" />
              <p className="font-mono text-[11px] text-white/20 uppercase tracking-widest">Aucun Node actif détecté dans le périmètre AgriConnect</p>
           </div>
        ) : agencies.map((agency) => (
          <div 
            key={agency.id} 
            className="group relative bg-[#080808] border-2 border-white/5 p-8 rounded-[3rem] hover:border-primary/30 transition-all duration-700 hover:shadow-[0_30px_60px_-20px_rgba(0,0,0,0.5)]"
          >
            {/* Overlay d'ID Terminal */}
            <div className="absolute top-8 right-8 font-mono text-[60px] font-black text-white/[0.02] group-hover:text-primary/[0.05] transition-colors pointer-events-none italic">
              #{agency.id?.substring(0, 2)}
            </div>

            <div className="flex justify-between items-start mb-10 relative z-10">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center border-2 border-white/5 group-hover:border-primary/20 group-hover:bg-primary/5 transition-all duration-500 shadow-xl">
                    <MapPin size={32} className="text-white/20 group-hover:text-primary group-hover:scale-110 transition-all" />
                </div>
                <div>
                    <h4 className="text-2xl md:text-3xl font-black text-white uppercase italic tracking-tighter group-hover:text-primary transition-colors leading-none mb-2">
                        {agency.nom}
                    </h4>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Online</span>
                        </div>
                        <span className="text-[9px] font-mono text-white/10 uppercase tracking-widest">Latence: 14ms</span>
                    </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="h-12 w-12 bg-white/5 hover:bg-white/10 rounded-2xl text-white/20 hover:text-white transition-all flex items-center justify-center active:scale-90 border border-white/5">
                  <Settings2 size={18} />
                </button>
                <button 
                  onClick={() => handleDelete(agency.id, agency.nom)}
                  className="h-12 w-12 bg-red-500/5 hover:bg-red-500 text-white/20 hover:text-white rounded-2xl transition-all flex items-center justify-center active:scale-90 border border-red-500/10"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            {/* ADRESSE : Look Data-Stream */}
            <div className="mb-10 relative z-10">
                <div className="flex items-center gap-3 mb-3 text-white/20">
                    <Terminal size={14} />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Geographic_Coordinates</span>
                </div>
                <div className="bg-[#050505] p-5 rounded-2xl border-2 border-white/5 group-hover:border-white/10 transition-colors">
                    <p className="text-xs md:text-sm text-white/60 font-bold italic leading-relaxed">
                       {agency.adresse}
                    </p>
                </div>
            </div>

            {/* STATS DU NODE : Super High-Vis */}
            <div className="grid grid-cols-2 gap-4 pt-8 border-t-2 border-white/5 relative z-10">
              <div className="bg-white/[0.02] p-4 rounded-[1.5rem] border border-white/5">
                <div className="flex items-center gap-3 mb-1">
                    <Users size={16} className="text-primary/60" />
                    <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">Staff_Payload</span>
                </div>
                <div className="text-xl font-black text-white font-mono">
                  {agency.staff_count?.[0]?.count || 0} <span className="text-[10px] text-white/20 uppercase italic">Agents</span>
                </div>
              </div>
              
              <button className="group/btn relative bg-white/[0.02] hover:bg-primary transition-all rounded-[1.5rem] border border-white/5 hover:border-primary flex flex-col justify-center px-6">
                <span className="text-[8px] font-mono text-white/20 group-hover/btn:text-black/60 uppercase tracking-widest mb-1">Actions</span>
                <span className="text-[10px] font-black uppercase italic text-primary group-hover/btn:text-black flex items-center gap-2">
                  Gérer_Staff <Plus size={12} strokeWidth={4} />
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* --- STATUS FOOTER --- */}
      <div className="mx-4 p-8 bg-[#080808] border-2 border-white/5 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-white/20">
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center">
                <Activity size={20} className="text-emerald-500" />
            </div>
            <div>
                <p className="text-[10px] font-black uppercase tracking-widest">Network_Health</p>
                <p className="text-[12px] font-mono text-emerald-500/80">99.8% OPERATIONAL_UPTIME</p>
            </div>
        </div>
        <div className="flex -space-x-4">
            {[1,2,3,4,5].map(i => (
                <div key={i} className="w-10 h-10 rounded-xl border-2 border-[#080808] bg-white/5 flex items-center justify-center font-black text-[10px] text-white/20 group-hover:text-primary transition-colors">
                    {i}
                </div>
            ))}
        </div>
      </div>

      <style>{`
        .animate-spin-slow { animation: spin 12s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .text-glow { text-shadow: 0 0 20px rgba(var(--primary), 0.5); }
      `}</style>
    </div>
  );
};