// src/features/admin/pages/AdminOverview.tsx
import React from 'react';
import { AdminStatGrid } from '../components/AdminStatGrid';
import { AdminActivityTable } from '../components/AdminActivityTable';
import { Activity, Zap, ShieldCheck } from 'lucide-react';

export default function AdminOverview() {
  return (
    <div className="space-y-10 md:space-y-14 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* --- HEADER STRATÉGIQUE --- */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-10">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[9px] font-mono text-primary uppercase tracking-[0.3em] font-bold">Système_Synchrone</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black italic uppercase text-white tracking-tighter leading-none">
            Dash<span className="text-primary">board</span>
          </h2>
          <p className="text-white/20 font-mono text-[10px] uppercase tracking-[0.5em] mt-4 flex items-center gap-2">
            <ShieldCheck size={12} className="text-white/10" />
            Status_Check: <span className="text-emerald-500/60">Normal_Operation</span>
          </p>
        </div>

        <div className="hidden lg:flex items-center gap-8 bg-white/[0.02] border border-white/10 p-6 rounded-[2rem]">
            <div className="space-y-1">
                <p className="text-[8px] font-mono text-white/20 uppercase tracking-widest">Network_Load</p>
                <div className="flex items-center gap-3">
                    <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-[35%] animate-pulse" />
                    </div>
                    <span className="text-[10px] font-black text-white/60">35%</span>
                </div>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                    <Zap size={14} className="text-emerald-500" />
                </div>
                <div>
                    <p className="text-[8px] font-mono text-white/20 uppercase">Latence</p>
                    <p className="text-xs font-black text-white">12ms</p>
                </div>
            </div>
        </div>
      </header>

      {/* --- GRILLE DE STATISTIQUES --- */}
      <section className="relative">
        <div className="absolute -left-20 top-0 w-40 h-40 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
        <AdminStatGrid />
      </section>

      {/* --- SECTION D'ACTIVITÉ --- */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
                <Activity size={18} className="text-primary/50" />
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/80 italic">Flux_Transactions_Récentes</h3>
            </div>
            <button className="text-[9px] font-mono text-white/20 hover:text-primary uppercase tracking-widest transition-colors">
                Voir_Tout_Le_Registre →
            </button>
        </div>
        
        <div className="bg-[#080808] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
          <AdminActivityTable />
        </div>
      </section>

      {/* --- FOOTER DE CONSOLE --- */}
      <footer className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4 text-[8px] font-mono text-white/10 uppercase tracking-widest">
            <span>Server_ID: Node_01_RDC</span>
            <span className="w-1 h-1 bg-white/10 rounded-full" />
            <span>Encodage: UTF-8</span>
            <span className="w-1 h-1 bg-white/10 rounded-full" />
           
        </div>
        <p className="text-[9px] font-black text-white/5 uppercase italic tracking-tighter">
            AgriConnect_Internal_Systems_v1.0
        </p>
      </footer>

    </div>
  );
}