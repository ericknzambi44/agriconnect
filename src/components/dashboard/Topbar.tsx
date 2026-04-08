// src/components/dashboard/Topbar.tsx
import React from 'react';
import { Search, Bell, Command, Menu } from "lucide-react"; // Ajout de Menu
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TopbarProps {
  user: {
    nom: string;
    prenom: string;
    role: string;
    avatar_url?: string | null;
  };
  onMenuClick: () => void; // <--- DÉCLARATION DU TYPE (Résout l'erreur TS)
}

export function Topbar({ user, onMenuClick }: TopbarProps) {
  const initials = `${user.prenom[0]}${user.nom[0]}`.toUpperCase();

  return (
    <header className="fixed top-0 right-0 z-40 flex h-20 items-center justify-between border-b border-white/5 bg-background/60 px-4 backdrop-blur-xl transition-all sm:px-8 
      left-0 lg:left-72">
      
      {/* 1. SECTION GAUCHE : MENU MOBILE + RECHERCHE */}
      <div className="flex items-center gap-4 flex-1">
        {/* BOUTON BURGER (Visible uniquement sur mobile < 1024px) */}
        <button 
          onClick={onMenuClick}
          className="p-2.5 bg-white/5 rounded-xl border border-white/10 text-primary hover:bg-primary/10 transition-all lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full max-w-[180px] group sm:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-foreground/20 group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="RECHERCHER..." 
            className="h-10 bg-input/30 border-none pl-11 font-bold text-[9px] tracking-[0.2em] placeholder:text-foreground/10 focus-visible:ring-1 focus-visible:ring-primary/30"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden items-center gap-1 opacity-20 group-focus-within:opacity-50 sm:flex">
            <Command className="w-3 h-3" />
            <span className="text-[10px] font-black italic"></span>
          </div>
        </div>
      </div>

      {/* 2. SECTION DROITE : ACTIONS & PROFIL */}
      <div className="flex items-center gap-3 sm:gap-6">
        
        <button className="relative p-2 sm:p-2.5 bg-input/40 rounded-full hover:text-primary transition-all border border-white/5 group">
          <Bell className="w-4 h-4 sm:w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full border-2 border-background animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.5)]"></span>
        </button>

        <div className="flex items-center gap-3 pl-3 border-l border-white/10 sm:gap-4 sm:pl-6">
          <div className="text-right hidden md:block">
            <p className="text-[11px] font-black uppercase tracking-tighter leading-none">
              {user.prenom} {user.nom}
            </p>
            <p className="text-[8px] font-bold text-primary uppercase tracking-[0.2em] mt-1 opacity-70">
              {user.role} <span className="text-accent ml-0.5">•</span> VÉRIFIÉ
            </p>
          </div>
          
          <Avatar className="h-9 w-9 sm:h-11 sm:w-11 border-2 border-primary/10 hover:border-active-green transition-all cursor-pointer ring-offset-background hover:ring-2 ring-primary/20 ring-offset-2">
            <AvatarImage src={user.avatar_url || ""} alt={user.nom} className="object-cover" />
            <AvatarFallback className="bg-primary/5 text-primary font-black text-[10px] sm:text-xs tracking-tighter italic">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}