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
    <header className="fixed top-0 right-0 z-40 flex h-20 items-center justify-between border-b-2 border-border bg-secondary px-6 sm:px-10 left-0 lg:left-72 shadow-xl">
      
      {/* 1. RECHERCHE & COMMANDES : Look Terminal Pur */}
      <div className="flex items-center gap-6 flex-1">
        {/* BOUTON MOBILE - Visible uniquement sur petit écran */}
        <button 
          onClick={onMenuClick}
          className="p-3 bg-background border-2 border-primary/20 rounded-xl text-primary lg:hidden active:scale-90 transition-all hover:bg-primary/5"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* BARRE DE RECHERCHE - Nette et Contrastée */}
        <div className="relative w-full max-w-[220px] group sm:max-w-md hidden sm:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="RECHERCHER_DANS_LE_SYSTEME..." 
            className="h-11 bg-background border-2 border-border pl-12 font-tech text-[10px] tracking-[0.1em] text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-0 focus-visible:border-primary rounded-xl transition-all"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1 px-2 py-1 bg-secondary border border-border rounded-md opacity-60">
            <Command className="w-3 h-3 text-primary" />
            <span className="font-tech text-[8px] font-bold">K</span>
          </div>
        </div>
      </div>

      {/* 2. ACTIONS ET PROFIL : Haute Distinction */}
      <div className="flex items-center gap-4 sm:gap-6">
        
        {/* NOTIFICATIONS - Sans Blur, Plus Net */}
        <button className="relative p-3 bg-background border-2 border-border rounded-xl hover:border-primary/40 text-muted-foreground hover:text-primary transition-all group">
          <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-success rounded-full border-2 border-secondary shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
        </button>

        {/* USER PROFILE SECTION */}
        <div className="flex items-center gap-4 pl-6 border-l-2 border-border h-10">
          <div className="text-right hidden sm:block">
            <h4 className="text-[13px] font-display uppercase italic tracking-tight text-foreground leading-none">
              {user.prenom} <span className="text-primary font-bold">{user.nom}</span>
            </h4>
            <div className="flex items-center justify-end gap-1.5 mt-1.5">
              <span className="font-tech text-[8px] font-black text-muted-foreground uppercase tracking-widest">
                {user.role}_NODE
              </span>
              <ShieldCheck className="w-3 h-3 text-primary/60" />
            </div>
          </div>
          
          {/* AVATAR AVEC CADRE NET */}
          <div className="relative group cursor-pointer active:scale-95 transition-transform">
            <Avatar className="h-11 w-11 sm:h-12 sm:w-12 border-2 border-primary rounded-xl relative bg-background p-0.5 overflow-hidden">
              <AvatarImage 
                src={user.avatar_url || ""} 
                alt={user.nom} 
                className="object-cover rounded-lg" 
              />
              <AvatarFallback className="bg-primary/10 text-primary font-display italic text-sm font-black">
                {initials}
              </AvatarFallback>
            </Avatar>
            
            {/* Indicateur de Statut Online - NULLE PART AILLEURS */}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-secondary rounded-lg flex items-center justify-center border-2 border-border shadow-lg">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}