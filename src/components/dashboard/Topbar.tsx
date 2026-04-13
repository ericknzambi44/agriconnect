import React from 'react';
import { Search, Bell, Command, Menu, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

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
    <header className="fixed top-0 right-0 z-40 flex h-20 items-center justify-between border-b border-white/5 bg-[#050505]/60 px-6 backdrop-blur-2xl transition-all sm:px-10 left-0 lg:left-72">
      
      {/* 1. RECHERCHE & COMMANDES */}
      <div className="flex items-center gap-6 flex-1">
        {/* BOUTON MOBILE (Mobile Only) */}
        <button 
          onClick={onMenuClick}
          className="p-3 bg-white/5 rounded-2xl border border-white/10 text-emerald-500 hover:bg-emerald-500/10 transition-all lg:hidden active:scale-90"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* BARRE DE RECHERCHE - Look "Terminal" */}
        <div className="relative w-full max-w-[200px] group sm:max-w-md hidden sm:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-emerald-500 transition-colors duration-500" />
          <Input 
            placeholder="Rechercher dans le systeme" 
            className="h-11 bg-white/[0.03] border-white/5 pl-12 font-tech text-[10px] tracking-[0.1em] text-white placeholder:text-white/20 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500/30 rounded-2xl transition-all hover:bg-white/[0.06] shadow-inner"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2 py-1 bg-black/40 border border-white/5 rounded-lg opacity-40 group-focus-within:opacity-100 transition-all">
            <Command className="w-3 h-3 text-emerald-500" />
         
          </div>
        </div>
      </div>

      {/* 2. ACTIONS ET PROFIL */}
      <div className="flex items-center gap-4 sm:gap-8">
        
        {/* NOTIFICATIONS - Glow subtil */}
        <button className="relative p-3 bg-white/[0.02] rounded-2xl hover:bg-white/[0.05] transition-all border border-white/5 group active:scale-95">
          <Bell className="w-4 h-4 text-white/30 group-hover:text-emerald-500 group-hover:rotate-[15deg] transition-all duration-300" />
          <span className="absolute top-3 right-3 w-2 h-2 bg-emerald-500 rounded-full border-2 border-[#050505] shadow-[0_0_15px_rgba(16,185,129,0.4)] animate-pulse" />
        </button>

        {/* USER PROFILE SECTION */}
        <div className="flex items-center gap-4 pl-6 border-l border-white/5 h-10">
          <div className="text-right hidden md:block">
            <h4 className="text-[12px] font-display uppercase italic tracking-tight text-white leading-none">
              {user.prenom} <span className="text-white/50">{user.nom}</span>
            </h4>
            <div className="flex items-center justify-end gap-1.5 mt-1.5">
              <span className="font-tech text-[8px] font-black text-emerald-500/60 uppercase tracking-widest">
                {user.role}
              </span>
              <ShieldCheck className="w-3 h-3 text-emerald-500/40" />
            </div>
          </div>
          
          {/* AVATAR D'ÉLITE */}
          <div className="relative group cursor-pointer">
            <div className="absolute -inset-1 bg-emerald-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
            <Avatar className="h-10 w-10 sm:h-12 sm:w-12 border border-white/10 rounded-2xl relative bg-[#080808]">
              <AvatarImage 
                src={user.avatar_url || ""} 
                alt={user.nom} 
                className="object-cover" 
              />
              <AvatarFallback className="bg-emerald-500/5 text-emerald-500 font-display italic text-xs border border-emerald-500/10">
                {initials}
              </AvatarFallback>
            </Avatar>
            {/* Indicateur de Statut Online */}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#050505] rounded-lg flex items-center justify-center border border-white/5">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}