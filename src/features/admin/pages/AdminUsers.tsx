// src/features/admin/pages/AdminUsers.tsx
import React from 'react';
import UserControlList from '../components/UserControlList';
import { Users, ShieldCheck, UserPlus, Fingerprint } from 'lucide-react';

export default function AdminUsers() {
  return (
    <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-700">
      
      {/* --- HEADER DE GESTION DES IDENTITÉS --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#0A0A0A] border border-white/5 p-8 rounded-[2.5rem]">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <Users className="text-primary relative z-10" size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black italic uppercase text-white tracking-tighter">
              Identity<span className="text-primary">Manager</span>
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="flex items-center gap-1.5 text-[9px] font-mono text-emerald-500 uppercase font-bold">
                <ShieldCheck size={10} />
                Accès_Sécurisé
              </span>
              <span className="w-px h-2 bg-white/10" />
              <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest">
                Permissions_Level: Root
              </span>
            </div>
          </div>
        </div>

        {/* --- ACTIONS RAPIDES --- */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end mr-4">
             <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">Système_Registry</span>
             <span className="text-[10px] font-black text-white/60 font-mono">v1.0.0-stable</span>
          </div>
          <button className="bg-white hover:bg-primary text-black px-6 py-3.5 rounded-2xl font-black text-[10px] uppercase italic flex items-center gap-3 transition-all active:scale-95 shadow-xl shadow-white/5">
            <UserPlus size={16} strokeWidth={3} /> 
            Nouvel_Utilisateur
          </button>
        </div>
      </div>

      {/* --- ZONE DE CONTRÔLE PRINCIPALE --- */}
      <div className="relative group">
        {/* Décoration technique en arrière-plan */}
        <div className="absolute -right-10 top-1/2 -translate-y-1/2 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity duration-1000">
            <Fingerprint size={400} />
        </div>

        <div className="relative z-10">
          <UserControlList />
        </div>
      </div>

      {/* --- INFOBAR DE SÉCURITÉ --- */}
      <div className="flex items-center gap-4 px-4">
        <div className="flex -space-x-2">
            {[1,2,3].map(i => (
                <div key={i} className="w-6 h-6 rounded-full border-2 border-[#020202] bg-white/5 flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-primary/40" />
                </div>
            ))}
        </div>
        <p className="text-[8px] font-mono text-white/20 uppercase tracking-[0.2em]">
          Toutes les modifications sont enregistrées dans le journal d'audit AgriConnect.
        </p>
      </div>

    </div>
  );
}