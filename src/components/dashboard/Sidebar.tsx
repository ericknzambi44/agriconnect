import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut, ChevronRight, X, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from '@/supabase';
import { getNavigationForRole } from "@/config/navigation";
import { useAuthSession } from '@/features/auth/hooks/use-auth-session';

interface SidebarProps {
  role: 'vendeur' | 'acheteur' | 'transporteur';
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
      "fixed left-0 top-0 h-screen w-72 flex flex-col z-[100] transition-transform duration-500 ease-in-out",
      "bg-secondary border-r-2 border-border shadow-[10px_0_30px_rgba(0,0,0,0.5)]",
      "lg:translate-x-0", 
      isOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      
      {/* BOUTON FERMER (MOBILE) */}
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 p-2 lg:hidden text-muted-foreground hover:text-primary transition-all active:scale-90 z-[110]"
      >
        <X className="w-6 h-6" />
      </button>

      {/* LOGO SECTION : AJUSTÉ POUR LA LARGEUR */}
      <div className="p-8 pb-10 relative shrink-0">
        <h2 className="text-3xl md:text-[2.6rem] font-display italic tracking-[ -0.08em] leading-none select-none group flex flex-wrap items-baseline">
          <span className="text-foreground">Agri</span>
          <span className="text-primary text-glow-primary">Connect</span>
        </h2>
        
        <div className="mt-5 inline-flex items-center gap-3 px-3 py-1.5 bg-background border-2 border-primary/20 rounded-lg">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-40"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
          </div>
          <span className="font-tech text-[9px] font-black uppercase tracking-[0.2em] text-primary italic">
            {role}_zone
          </span>
        </div>
      </div>

      {/* NAVIGATION : ESPACEMENT ÉQUILIBRÉ */}
      <nav className="flex-1 px-5 space-y-2 overflow-y-auto no-scrollbar relative">
        {navItems.map((item: any) => {
          if (item.isAgencyOnly && !profile?.id_agence) return null;

          return (
            <NavLink
              key={item.href}
              to={item.href}
              onClick={onClose}
              end={item.href === "/dashboard"} 
              className={({ isActive }) => cn(
                "flex items-center justify-between px-5 py-4 rounded-xl transition-all duration-300 group relative border-2",
                isActive 
                  ? "bg-primary/10 border-primary text-foreground shadow-[0_0_15px_rgba(16,185,129,0.1)]" 
                  : "border-transparent text-muted-foreground hover:text-foreground hover:bg-white/[0.03] hover:border-border",
              )}
            >
              <div className="flex items-center gap-4 min-w-0">
                <item.icon className={cn(
                  "w-5 h-5 shrink-0 transition-all duration-300",
                  "group-hover:scale-110 group-[.active]:text-primary"
                )} />
                <span className="font-tech text-[10px] font-black uppercase tracking-[0.2em] leading-none truncate">
                  {item.name}
                </span>
                {item.isAgencyOnly && (
                   <ShieldCheck className="w-3 h-3 text-primary animate-pulse" />
                )}
              </div>

              <ChevronRight className={cn(
                "w-4 h-4 shrink-0 transition-all opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 group-[.active]:opacity-100 group-[.active]:translate-x-0",
                "text-primary"
              )} />
            </NavLink>
          );
        })}
      </nav>

      {/* FOOTER : NET ET PROPRE */}
      <div className="p-6 border-t-2 border-border bg-background/50 shrink-0">
        <button 
          onClick={handleSignOut}
          className="w-full flex items-center justify-between px-4 py-5 text-muted-foreground hover:text-destructive font-tech text-[9px] font-black uppercase tracking-[0.2em] border-2 border-border hover:border-destructive/40 hover:bg-destructive/5 rounded-2xl transition-all active:scale-95 group"
        >
          <div className="flex items-center gap-3 min-w-0">
            <LogOut className="w-4 h-4 shrink-0 group-hover:-translate-x-1 transition-all" />
            <span className="truncate group-hover:text-destructive text-[9px]">Deconnecter</span>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-destructive/20 group-hover:bg-destructive shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
        </button>
        
        <p className="mt-5 text-center font-tech text-[7px] text-muted-foreground/40 tracking-[0.4em] uppercase">
          AgriConnect v.1.0
        </p>
      </div>
    </aside>
  );
}