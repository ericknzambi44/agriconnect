// src/components/dashboard/Topbar.tsx
import React from 'react';
import { Search, Bell, Command, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TopbarProps {
  user: {
    nom: string;
    prenom: string;
    role: string;
    avatar_url?: string | null;
  };
  onMenuClick: () => void;
}

export function Topbar({ user, onMenuClick }: TopbarProps) {
  const initials = `${user.prenom[0]}${user.nom[0]}`.toUpperCase();

  return (
    <header className="fixed top-0 right-0 z-40 flex h-20 items-center justify-between border-b border-white/5 bg-[#050505]/80 px-4 backdrop-blur-xl transition-all sm:px-8 
      left-0 lg:left-72">
      
      {/* 1. SECTION GAUCHE : MENU MOBILE + RECHERCHE */}
      <div className="flex items-center gap-4 flex-1">
        {/* BOUTON BURGER (Mobile) */}
        <button 
          onClick={onMenuClick}
          className="p-2.5 bg-white/5 rounded-xl border border-white/10 text-emerald-500 hover:bg-emerald-500/10 transition-all lg:hidden active:scale-95"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* BARRE DE RECHERCHE - Visibilité Améliorée */}
        <div className="relative w-full max-w-[180px] group sm:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-emerald-500 transition-colors" />
          <Input 
            placeholder="RECHERCHER DANS LE RÉSEAU..." 
            className="h-10 bg-white/[0.05] border border-white/10 pl-11 font-black text-[9px] tracking-[0.2em] text-white placeholder:text-white/30 focus-visible:ring-2 focus-visible:ring-emerald-500/30 focus-visible:border-emerald-500/50 rounded-xl transition-all hover:bg-white/[0.08] shadow-sm"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden items-center gap-1.5 opacity-40 group-focus-within:opacity-100 sm:flex transition-opacity">
            <Command className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-[10px] font-black italic text-emerald-500 uppercase tracking-tighter">K</span>
          </div>
        </div>
      </div>

      {/* 2. SECTION DROITE : ACTIONS & PROFIL */}
      <div className="flex items-center gap-3 sm:gap-6">
        
        {/* NOTIFICATIONS */}
        <button className="relative p-2 sm:p-2.5 bg-white/[0.03] rounded-xl hover:bg-white/[0.06] transition-all border border-white/5 group hover:border-white/10">
          <Bell className="w-4 h-4 sm:w-5 h-5 group-hover:rotate-12 transition-transform text-white/40 group-hover:text-emerald-500" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full border-2 border-[#050505] animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.6)]"></span>
        </button>

        {/* PROFILE INFO */}
        <div className="flex items-center gap-3 pl-3 border-l border-white/10 sm:gap-4 sm:pl-6">
          <div className="text-right hidden md:block">
            <p className="text-[11px] font-black uppercase tracking-tighter leading-none text-white italic">
              {user.prenom} {user.nom}
            </p>
            <p className="text-[8px] font-black text-emerald-500 uppercase tracking-[0.2em] mt-1 opacity-80 flex items-center justify-end gap-1">
              {user.role} <span className="w-1 h-1 bg-emerald-500 rounded-full"></span> VÉRIFIÉ
            </p>
          </div>
          
          {/* AVATAR */}
          <Avatar className="h-9 w-9 sm:h-11 sm:w-11 border-2 border-white/10 hover:border-emerald-500/50 transition-all cursor-pointer ring-offset-[#050505] hover:ring-2 ring-emerald-500/20 ring-offset-2">
            <AvatarImage src={user.avatar_url || ""} alt={user.nom} className="object-cover" />
            <AvatarFallback className="bg-emerald-500/10 text-emerald-500 font-black text-[10px] sm:text-xs tracking-tighter italic border border-emerald-500/20">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}