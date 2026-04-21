import React, { useState } from 'react';
import { Search, Bell, Command, Menu, ShieldCheck, X } from "lucide-react";
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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const initials = `${user.prenom[0]}${user.nom[0]}`.toUpperCase();

  return (
    <div className="w-full h-full flex items-center justify-between px-[clamp(0.75rem,3vw,2rem)] gap-2 sm:gap-4 relative">
      
      {/* 1. SECTION GAUCHE : MENU & RECHERCHE INTELLIGENTE */}
      <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
        <button 
          onClick={onMenuClick}
          className="p-2.5 bg-background border-2 border-primary/20 rounded-xl text-primary lg:hidden active:scale-95 transition-all flex-shrink-0"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* RECHERCHE MOBILE : Bouton d'activation si écran < sm */}
        <button 
          onClick={() => setIsSearchOpen(true)}
          className="p-2.5 bg-background border-2 border-border rounded-xl text-muted-foreground sm:hidden active:scale-95"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* BARRE DE RECHERCHE DESKTOP / OVERLAY MOBILE */}
        <div className={cn(
          "absolute inset-x-0 top-0 h-20 bg-secondary z-[60] flex items-center px-4 transition-all duration-300 sm:relative sm:inset-auto sm:h-auto sm:bg-transparent sm:flex sm:p-0 sm:max-w-[400px] sm:w-full",
          isSearchOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 sm:translate-y-0 sm:opacity-100"
        )}>
          <div className="relative w-full group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary" />
            <Input 
              autoFocus={isSearchOpen}
              placeholder="RECHERCHER..." 
              className="h-12 sm:h-11 bg-background border-2 border-border pl-11 pr-12 sm:pr-4 font-tech text-[10px] tracking-[0.1em] text-foreground focus-visible:ring-0 focus-visible:border-primary rounded-xl w-full"
            />
            {/* Bouton pour fermer la recherche sur mobile uniquement */}
            <button 
              onClick={() => setIsSearchOpen(false)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 sm:hidden text-muted-foreground"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1 px-2 py-1 bg-secondary border border-border rounded-md opacity-60">
              <Command className="w-3 h-3 text-primary" />
              <span className="font-tech text-[8px] font-bold">K</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SECTION DROITE : ACTIONS ET PROFIL */}
      <div className="flex items-center gap-2 sm:gap-6 flex-shrink-0">
        
        <button className="relative p-2.5 bg-background border-2 border-border rounded-xl text-muted-foreground hover:text-primary transition-all group">
          <Bell className="w-5 h-5 group-hover:rotate-12" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-success rounded-full border-2 border-secondary animate-pulse" />
        </button>

        <div className="flex items-center gap-2 sm:gap-4 pl-2 sm:pl-6 border-l-2 border-border h-10">
          
          <div className="text-right hidden md:block">
            <h4 className="text-[13px] font-display uppercase italic tracking-tight text-foreground leading-none truncate max-w-[100px]">
              {user.prenom} <span className="text-primary font-bold">{user.nom}</span>
            </h4>
            <div className="flex items-center justify-end gap-1.5 mt-1.5">
              <span className="font-tech text-[8px] font-black text-muted-foreground uppercase tracking-widest">
                {user.role}
              </span>
              <ShieldCheck className="w-3 h-3 text-primary/60" />
            </div>
          </div>
          
          <div className="relative group flex-shrink-0">
            <Avatar className="h-10 w-10 sm:h-12 sm:w-12 border-2 border-primary rounded-xl bg-background p-0.5 transition-transform active:scale-90">
              <AvatarImage src={user.avatar_url || ""} className="object-cover rounded-lg" />
              <AvatarFallback className="bg-primary/10 text-primary font-display italic text-xs font-black">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-secondary rounded-lg flex items-center justify-center border-2 border-border">
                <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}