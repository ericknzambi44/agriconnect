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
      "bg-[#070707]/95 backdrop-blur-2xl border-r border-white/5 shadow-[20px_0_50px_rgba(0,0,0,0.8)]",
      "lg:translate-x-0", 
      isOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      
      {/* BOUTON FERMER (MOBILE) */}
      <button 
        onClick={onClose}
        className="absolute top-6 right-[-50px] p-3 lg:hidden text-white bg-[#070707] border border-white/10 rounded-r-xl transition-all active:scale-90"
      >
        <X className="w-5 h-5" />
      </button>

      {/* SECTION LOGO : Look "Flux_MSG" */}
      <div className="p-8 pb-10 shrink-0">
        <div className="flex items-center gap-2 mb-2">
            <Zap size={10} className="text-primary animate-pulse" />
            <span className="font-tech text-[8px] text-primary/60 font-black uppercase tracking-[0.4em]">Secure_Terminal</span>
        </div>
        
        <h2 className="text-3xl font-display font-black italic tracking-tighter leading-none flex flex-col">
          <span className="text-white">AGRI_</span>
          <span className="text-primary text-glow-primary">CONNECT</span>
        </h2>
        
        <div className="mt-6 flex items-center gap-3 px-4 py-2 bg-white/[0.02] border border-white/5 rounded-xl">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-40"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </div>
          <span className="font-tech text-[9px] font-black uppercase tracking-[0.2em] text-white/70 italic">
            {role}_ACCESS
          </span>
        </div>
      </div>

      {/* NAVIGATION : Items pro avec effet néon */}
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
                  ? "bg-primary/10 text-white" 
                  : "text-muted-foreground hover:text-white hover:bg-white/[0.02]",
              )}
            >
              {/* Indicateur actif vertical (Style Flux) */}
              <div className={cn(
                "absolute left-0 top-1/4 bottom-1/4 w-1 bg-primary transition-all duration-500",
                "group-[.active]:opacity-100 opacity-0 group-[.active]:shadow-[4px_0_15px_rgba(var(--primary),0.6)]"
              )} />

              <div className="flex items-center gap-4 min-w-0">
                <item.icon className={cn(
                  "w-5 h-5 shrink-0 transition-all duration-500",
                  "group-hover:text-primary group-[.active]:text-primary group-hover:scale-110"
                )} />
                <span className="font-tech text-[10px] font-black uppercase tracking-[0.2em] leading-none">
                  {item.name}
                </span>
              </div>

              <ChevronRight className={cn(
                "w-3 h-3 shrink-0 transition-all opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-[.active]:opacity-100 group-[.active]:translate-x-0 text-primary"
              )} />
            </NavLink>
          );
        })}
      </nav>

      {/* FOOTER : Ultra Clean & Pro */}
      <div className="p-6 border-t border-white/5 bg-black/40 shrink-0">
        <div className="mb-6 flex items-center gap-3 px-4">
            <Fingerprint size={14} className="text-white/20" />
            <div className="flex flex-col">
                <span className="font-tech text-[7px] text-white/20 font-black uppercase tracking-widest leading-none">User_ID</span>
                <span className="font-tech text-[8px] text-white/40 truncate w-32">
                  {profile?.id?.substring(0, 12).toUpperCase() || 'ANONYMOUS'}
                </span>
            </div>
        </div>

        <button 
          onClick={handleSignOut}
          className="w-full flex items-center justify-between px-5 py-4 text-white/40 hover:text-red-500 bg-white/[0.02] hover:bg-red-500/10 border border-white/5 hover:border-red-500/20 rounded-2xl transition-all group active:scale-95"
        >
          <div className="flex items-center gap-3">
            <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="font-tech text-[9px] font-black uppercase tracking-[0.2em]">Disconnect</span>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-white/10 group-hover:bg-red-500 shadow-none group-hover:shadow-[0_0_10px_rgba(239,68,68,0.5)] transition-all" />
        </button>
        
        <div className="mt-6 flex justify-between items-center opacity-20 group">
          <span className="font-tech text-[7px] tracking-[0.5em] uppercase font-black">v.1.0.0</span>
          <ShieldCheck size={12} />
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .text-glow-primary { text-shadow: 0 0 15px rgba(var(--primary), 0.5); }
      `}</style>
    </aside>
  );
}