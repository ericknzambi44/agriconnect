// src/features/admin/pages/AdminUsers.tsx
import React from 'react';
import UserControlList from '../components/UserControlList';
import { Users, ShieldCheck, UserPlus, Fingerprint, Activity } from 'lucide-react';

export default function AdminUsers() {
  return (
    <div className="min-h-screen pb-20 space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      
      {/* --- HEADER DE GESTION DES IDENTITÉS --- */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-[#0A0A0A] border-2 border-white/5 p-8 md:p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full pointer-events-none" />
        
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-[1.5rem] flex items-center justify-center group">
            <Users className="text-primary group-hover:scale-110 transition-transform" size={32} />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-black italic uppercase text-white tracking-tighter leading-none">
              Identity<span className="text-primary">Manager</span>
            </h1>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                <ShieldCheck size={12} className="text-emerald-500" />
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Accès_Root</span>
              </div>
              <div className="flex items-center gap-2 text-white/20">
                <Activity size={12} />
                <span className="text-[10px] font-mono uppercase tracking-[0.2em]">Live_Auth_Stream</span>
              </div>
            </div>
          </div>
        </div>

        {/* --- ACTIONS RAPIDES --- */}
        <div className="flex items-center gap-4 relative z-10">
          <button className="flex-1 sm:flex-none bg-white hover:bg-primary text-black h-16 px-8 rounded-2xl font-black text-xs uppercase italic flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-white/10">
            <UserPlus size={20} strokeWidth={3} /> 
            Nouvel_Utilisateur
          </button>
        </div>
      </div>

      {/* --- ZONE DE CONTRÔLE PRINCIPALE --- */}
      <div className="relative group min-h-[600px]">
        {/* Filigrane technique */}
        <div className="absolute -left-20 top-1/2 -translate-y-1/2 opacity-[0.02] pointer-events-none group-hover:opacity-[0.04] transition-opacity duration-1000">
            <Fingerprint size={500} />
        </div>

        <div className="relative z-10">
          <UserControlList />
        </div>
      </div>

      {/* --- AUDIT TRAIL FOOTER --- */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-6 opacity-30 hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-black bg-[#111] flex items-center justify-center text-[8px] font-black text-primary">
                        0{i}
                    </div>
                ))}
            </div>
            <p className="text-[9px] font-mono text-white uppercase tracking-[0.3em]">
              Security_Log: <span className="text-primary/60">Audit_Active</span>
            </p>
        </div>
        <p className="text-[8px] font-mono text-white/40 uppercase tracking-widest">
            Protocol_Version: 2.4.0_AgriConnect
        </p>
      </div>

    </div>
  );
}