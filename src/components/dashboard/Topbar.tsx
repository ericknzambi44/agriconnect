// src/components/layout/Topbar.tsx
import React, { useState } from 'react';
import { Search, Bell, Command, Menu, ShieldCheck, X, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useNotifications } from '@/features/notifications/hooks/useNotifications';

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
  const { unreadCount } = useNotifications(); // Intégration du hook réel
  const initials = `${user.prenom[0]}${user.nom[0]}`.toUpperCase();

  return (
    <div className="w-full h-full flex items-center justify-between px-4 md:px-8 lg:px-10 gap-4 bg-background/50 backdrop-blur-xl border-b border-white/5 relative z-50">
      
      {/* 1. SECTION GAUCHE : MENU & SEARCH ADAPTATIF */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <button 
          onClick={onMenuClick}
          className="p-3 bg-white/[0.02] border border-white/10 rounded-xl text-primary lg:hidden active:scale-95 transition-all shrink-0"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* RECHERCHE MOBILE TOGGLE */}
        <button 
          onClick={() => setIsSearchOpen(true)}
          className="p-3 bg-white/[0.02] border border-white/10 rounded-xl text-muted-foreground sm:hidden active:scale-95"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* BARRE DE RECHERCHE PRINCIPALE */}
        <div className={cn(
          "absolute inset-x-0 top-0 h-full bg-background z-[60] flex items-center px-4 transition-all duration-300 sm:relative sm:inset-auto sm:h-auto sm:bg-transparent sm:flex sm:p-0 sm:max-w-[450px] sm:w-full",
          isSearchOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 sm:translate-y-0 sm:opacity-100"
        )}>
          <div className="relative w-full group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
            <Input 
              autoFocus={isSearchOpen}
              placeholder="RECHERCHER DANS LE FLUX..." 
              className="h-12 sm:h-11 bg-white/[0.02] border border-white/10 pl-11 pr-12 sm:pr-4 font-tech text-[9px] tracking-[0.2em] text-white focus-visible:ring-1 focus-visible:ring-primary/50 focus-visible:border-primary/50 rounded-xl w-full transition-all"
            />
            {/* Close mobile search */}
            <button 
              onClick={() => setIsSearchOpen(false)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 sm:hidden text-muted-foreground"
            >
              <X className="w-5 h-5" />
            </button>
            
            {/* Shortcut Desktop */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1.5 px-2 py-1 bg-black border border-white/10 rounded-md opacity-40 group-focus-within:opacity-100 transition-opacity">
              <Command size={10} className="text-primary" />
              <span className="font-tech text-[8px] font-black text-white">K</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SECTION DROITE : NOTIFICATIONS & PROFIL */}
      <div className="flex items-center gap-3 sm:gap-6 shrink-0">
        
        {/* BOUTON NOTIFICATION SYNCHRONISÉ */}
        <button className="relative p-3 bg-white/[0.02] border border-white/10 rounded-xl text-white/60 hover:text-primary transition-all group overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <Bell className="w-5 h-5 relative z-10 group-hover:animate-bounce" />
          
          {unreadCount > 0 && (
            <div className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-40"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-primary text-[8px] font-black text-primary-foreground items-center justify-center">
                {unreadCount > 9 ? '+9' : unreadCount}
              </span>
            </div>
          )}
        </button>

        {/* PROFIL UTILISATEUR */}
        <div className="flex items-center gap-3 sm:gap-4 pl-3 sm:pl-6 border-l border-white/10 h-10">
          
          <div className="text-right hidden sm:block">
            <div className="flex items-center justify-end gap-2 mb-0.5">
               <span className="font-tech text-[7px] font-black text-primary uppercase tracking-[0.3em]">Online</span>
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            </div>
            <h4 className="text-[13px] font-display font-black uppercase italic tracking-tighter text-white leading-none truncate max-w-[120px]">
              {user.prenom} <span className="text-primary">{user.nom}</span>
            </h4>
          </div>
          
          <div className="relative group shrink-0">
            {/* Lueur d'avatar */}
            <div className="absolute -inset-1 bg-primary/20 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <Avatar className="h-10 w-10 md:h-12 md:w-12 border border-primary/40 rounded-xl bg-black p-0.5 transition-transform active:scale-95 cursor-pointer relative z-10">
              <AvatarImage src={user.avatar_url || ""} className="object-cover rounded-lg" />
              <AvatarFallback className="bg-primary/5 text-primary font-display italic text-xs font-black">
                {initials}
              </AvatarFallback>
            </Avatar>
            
            <div className="absolute -bottom-1 -right-1 z-20">
               <div className="bg-black border border-white/10 p-0.5 rounded-md">
                  <ShieldCheck size={10} className="text-primary" />
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}