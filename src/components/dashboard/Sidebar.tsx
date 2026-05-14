// src/components/layout/Sidebar.tsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut, ChevronRight, X, ShieldCheck, Fingerprint, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from '@/supabase';
import { getNavigationForRole } from "@/config/navigation";
import { useAuthSession } from '@/features/auth/hooks/use-auth-session';

interface SidebarProps {
  role: 'vendeur' | 'acheteur' | 'transporteur' | 'admin';
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ role, isOpen, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const { profile } = useAuthSession();
  const navItems = getNavigationForRole(role);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) navigate('/login');
  };

  return (
    <aside className={cn(
      "fixed left-0 top-0 h-screen w-[280px] flex flex-col z-[100] transition-all duration-500 ease-in-out",
      "bg-gradient-to-b from-[#0a0a0a] via-[#050505] to-black backdrop-blur-2xl border-r border-white/10 shadow-[20px_0_50px_rgba(0,0,0,0.8)]",
      "lg:translate-x-0", 
      isOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      
      {/* Bouton fermer */}
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 p-2 lg:hidden text-white/40 hover:text-white bg-white/5 hover:bg-gradient-to-r hover:from-primary/20 hover:to-transparent rounded-xl transition-all duration-300 active:scale-90 z-[110]"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Logo */}
      <div className="p-8 pb-10 shrink-0 relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-pink-500 to-primary opacity-70" />
        
        <div className="flex items-center gap-2 mb-2">
          <Zap size={10} className="text-primary animate-pulse" />
          <span className="font-tech text-[8px] bg-gradient-to-r from-primary/80 to-primary bg-clip-text text-transparent font-black uppercase tracking-[0.4em]">
            SECURE TERMINAL
          </span>
        </div>
        
        <h2 className="text-3xl font-display font-black italic tracking-tighter leading-none flex flex-col">
          <span className="text-white">AGRI</span>
          <span className="bg-gradient-to-r from-primary via-orange-400 to-primary bg-clip-text text-transparent text-glow-primary">
            CONNECT
          </span>
        </h2>
        
        <div className="mt-6 flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-primary/10 to-transparent border-l-4 border-primary rounded-r-xl max-w-[180px]">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary shadow-[0_0_8px_rgba(var(--primary),0.8)]"></span>
          </div>
          <span className="font-tech text-[9px] font-black uppercase tracking-[0.2em] text-white/80 italic truncate">
            {role.toUpperCase()}_ACCESS
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto no-scrollbar py-2">
        {navItems.map((item: any) => {
          if (item.isAgencyOnly && !profile?.id_agence) return null;

          return (
            <NavLink
              key={item.href}
              to={item.href}
              onClick={onClose}
              end={item.href === "/dashboard"}
              className={({ isActive }) => cn(
                "flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300 group relative overflow-hidden",
                isActive 
                  ? "bg-gradient-to-r from-primary/20 via-primary/5 to-transparent text-white shadow-[inset_0_0_15px_rgba(var(--primary),0.15)]" 
                  : "text-muted-foreground hover:text-white hover:bg-white/[0.03] hover:shadow-md"
              )}
            >
              {({ isActive }) => (
                <>
                  {/* Barre latérale active */}
                  <div className={cn(
                    "absolute left-0 top-1/4 bottom-1/4 w-[3px] bg-gradient-to-b from-primary to-orange-400 transition-all duration-500 rounded-r-full",
                    isActive ? "opacity-100 shadow-[0_0_12px_rgba(var(--primary),0.8)]" : "opacity-0 group-hover:opacity-60"
                  )} />

                  <div className="flex items-center gap-4 min-w-0">
                    <item.icon className={cn(
                      "w-5 h-5 shrink-0 transition-all duration-500",
                      "group-hover:text-primary group-[.active-nav-item]:text-primary group-hover:scale-110 group-[.active-nav-item]:scale-105"
                    )} />
                    <span className="font-tech text-[10px] font-black uppercase tracking-[0.2em] leading-none">
                      {item.name}
                    </span>
                  </div>

                  <ChevronRight className={cn(
                    "w-3 h-3 shrink-0 transition-all duration-300",
                    "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0",
                    isActive && "opacity-100 translate-x-0 text-primary"
                  )} />
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-white/10 bg-gradient-to-t from-black/80 to-transparent shrink-0">
        <div className="mb-6 flex items-center gap-3 px-4">
          <Fingerprint size={14} className="text-primary/50" />
          <div className="flex flex-col">
            <span className="font-tech text-[7px] text-white/30 font-black uppercase tracking-widest leading-none">USER ID</span>
            <span className="font-tech text-[8px] bg-gradient-to-r from-white/60 to-white/30 bg-clip-text text-transparent truncate w-32">
              {profile?.id?.substring(0, 12).toUpperCase() || 'ANONYMOUS'}
            </span>
          </div>
        </div>

        <button 
          onClick={handleSignOut}
          className="w-full flex items-center justify-between px-5 py-4 text-white/40 hover:text-red-500 bg-white/[0.02] hover:bg-gradient-to-r hover:from-red-500/10 hover:to-transparent border border-white/10 hover:border-red-500/30 rounded-2xl transition-all duration-300 group active:scale-95"
        >
          <div className="flex items-center gap-3">
            <LogOut className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1 group-hover:scale-110" />
            <span className="font-tech text-[9px] font-black uppercase tracking-[0.2em]">Déconnexion</span>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-red-500 shadow-none group-hover:shadow-[0_0_10px_rgba(239,68,68,0.6)] transition-all duration-300" />
        </button>
        
        <div className="mt-6 flex justify-between items-center opacity-30 group">
          <span className="font-tech text-[7px] tracking-[0.5em] uppercase font-black text-white/50">v.2.0.0</span>
          <ShieldCheck size={12} className="text-primary/50 group-hover:text-primary transition-colors" />
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .text-glow-primary { text-shadow: 0 0 12px rgba(var(--primary), 0.6); }
      `}</style>
    </aside>
  );
}