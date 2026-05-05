// src/features/admin/pages/AdminOverview.tsx
import React from 'react';
import { AdminStatGrid } from '../components/AdminStatGrid';
import { AdminActivityTable } from '../components/AdminActivityTable';
import { Activity, Zap, ShieldCheck, ArrowUpRight, Terminal } from 'lucide-react';

export default function AdminOverview() {
  return (
    <div className="min-h-screen space-y-10 md:space-y-16 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20">
      
      {/* --- HEADER STRATÉGIQUE : HAUTE VISIBILITÉ --- */}
      <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 border-b border-white/5 pb-12">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-3 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Système_En_Ligne</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-black italic uppercase text-white tracking-tighter leading-[0.8] drop-shadow-2xl">
            Dash<span className="text-primary">board</span>
          </h2>
          
          <div className="flex items-center gap-4 text-white/30">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] flex items-center gap-2">
              <ShieldCheck size={14} className="text-emerald-500" />
              Infrastructure_Sécurisée
            </p>
            <span className="w-1 h-1 bg-white/10 rounded-full" />
            <p className="text-[10px] font-mono uppercase tracking-widest text-white/10">v1.0.0_Stable</p>
          </div>
        </div>

        {/* METRICS RAPIDES (Caché sur petit mobile, visible dès Tablette) */}
        <div className="flex items-center gap-4 md:gap-8 bg-[#0A0A0A] border-2 border-white/5 p-6 md:p-8 rounded-[2.5rem] shadow-2xl">
            <div className="space-y-2">
                <p className="text-[9px] font-black text-white/20 uppercase tracking-widest flex items-center gap-2">
                   <Activity size={10} /> Charge_Réseau
                </p>
                <div className="flex items-center gap-4">
                    <div className="w-32 h-2 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-[38%] shadow-[0_0_15px_rgba(var(--primary),0.5)]" />
                    </div>
                    <span className="text-sm font-black italic text-white">38%</span>
                </div>
            </div>
            
            <div className="w-px h-10 bg-white/10" />
            
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20">
                    <Zap size={20} className="text-emerald-500 animate-pulse" />
                </div>
                <div>
                    <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Latence</p>
                    <p className="text-lg font-black text-white italic tracking-tighter">09ms</p>
                </div>
            </div>
        </div>
      </header>

      {/* --- SECTION STATS : BENTO GRID --- */}
      <section className="relative px-2">
        {/* Glow décoratif en arrière-plan */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        <AdminStatGrid />
      </section>

      {/* --- SECTION FLUX D'ACTIVITÉ --- */}
      <section className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-4">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                   <Terminal size={18} className="text-primary" />
                </div>
                <div>
                   <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white italic">Registre_Transactions</h3>
                   <p className="text-[9px] text-white/20 uppercase tracking-widest font-bold">Flux_Temps_Réel</p>
                </div>
            </div>
            
            <button className="group flex items-center gap-3 text-[10px] font-black text-white/40 hover:text-primary uppercase tracking-widest transition-all">
                Journal_Complet 
                <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
        </div>
        
        {/* TABLEAU / LISTE HAUTE PERFORMANCE */}
        <div className="bg-[#080808] border-2 border-white/5 rounded-[3rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] group">
          <div className="p-1"> {/* Petit padding interne pour l'effet de bordure */}
            <AdminActivityTable />
          </div>
        </div>
      </section>

      {/* --- FOOTER TECHNIQUE : STYLE TERMINAL --- */}
      <footer className="pt-12 border-t border-white/5 flex flex-col lg:flex-row justify-between items-center gap-6 opacity-40 hover:opacity-100 transition-opacity duration-500">
        <div className="flex flex-wrap justify-center items-center gap-6 text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">
            <div className="flex items-center gap-2">
               <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
               SERVER_ID: NODE_RDC_MAIN_01
            </div>
            <div className="hidden sm:block w-1 h-1 bg-white/20 rounded-full" />
            <span>Encodage: AES-256-GCM</span>
            <div className="hidden sm:block w-1 h-1 bg-white/20 rounded-full" />
            <span>Uptime: 99.98%</span>
        </div>
        
        <div className="flex flex-col items-center lg:items-end">
            <p className="text-[10px] font-black text-white uppercase italic tracking-tighter">
                AgriConnect<span className="text-primary">_Core</span>
            </p>
            <p className="text-[7px] font-mono text-white/10 uppercase tracking-[0.5em] mt-1">
                Proprietary_Infrastructure © 2026
            </p>
        </div>
      </footer>

    </div>
  );
}