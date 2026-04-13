import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from '@/supabase';
import { getNavigationForRole } from "@/config/navigation";

interface SidebarProps {
  role: 'vendeur' | 'acheteur' | 'transporteur';
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ role, isOpen, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const navItems = getNavigationForRole(role);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) navigate('/login');
  };

  return (
    <aside className={cn(
      "fixed left-0 top-0 h-screen w-72 flex flex-col z-50 transition-all duration-500 ease-in-out",
      "bg-[#050505] border-r border-white/5 shadow-[20px_0_80px_rgba(0,0,0,0.8)]",
      "lg:translate-x-0", 
      isOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      
      {/* GLOW DE FOND SUBTIL */}
      <div className="absolute top-0 left-0 w-full h-64 bg-emerald-500/5 blur-[100px] pointer-events-none" />

      {/* BOUTON FERMER (Mobile) */}
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 p-2 lg:hidden text-white/20 hover:text-emerald-500 transition-all active:scale-90 z-50"
      >
        <X className="w-5 h-5" />
      </button>

      {/* LOGO SECTION - Ajusté pour éviter le débordement */}
      <div className="p-8 pb-10 relative shrink-0">
        <h2 className="text-3xl font-display italic tracking-tight leading-none select-none group">
          <span className="text-white">AGRI</span>
          <span className="text-emerald-500 transition-all duration-500 group-hover:text-glow-green">CONNECT</span>
        </h2>
        
        {/* BADGE DE RÔLE */}
        <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-white/[0.03] border border-white/5 rounded-lg">
          <div className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
          </div>
          <span className="font-tech text-[8px] font-bold uppercase tracking-[0.2em] text-white/40 italic">
            {role}_zone
          </span>
        </div>
      </div>

      {/* NAVIGATION - Sécurisée avec min-w-0 */}
      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto no-scrollbar relative">
       
        
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            onClick={onClose}
            end={item.href === "/dashboard"} 
            className={({ isActive }) => cn(
              "flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-300 group relative border",
              isActive 
                ? "bg-emerald-500/5 border-emerald-500/20 text-white shadow-[0_0_20px_rgba(16,185,129,0.05)]" 
                : "border-transparent text-white/30 hover:text-white hover:bg-white/[0.02]"
            )}
          >
            {/* Barre d'état active */}
            <div className={cn(
              "absolute left-0 w-1 bg-emerald-500 rounded-full transition-all duration-300",
              "group-[.active]:h-5 group-[.active]:opacity-100 opacity-0 h-0"
            )} />

            <div className="flex items-center gap-3 min-w-0">
              <item.icon className={cn(
                "w-4 h-4 shrink-0 transition-all duration-500",
                "group-hover:scale-110 group-hover:text-emerald-400"
              )} />
              <span className="font-tech text-[9px] font-bold uppercase tracking-[0.15em] leading-none truncate">
                {item.name}
              </span>
            </div>

            <ChevronRight className={cn(
              "w-3 h-3 shrink-0 transition-all opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0",
              "text-emerald-500"
            )} />
          </NavLink>
        ))}
      </nav>

      {/* FOOTER - Compact et Pro */}
      <div className="p-6 border-t border-white/5 bg-[#080808]/40 backdrop-blur-xl shrink-0">
        <button 
          onClick={handleSignOut}
          className="w-full flex items-center justify-between px-4 py-4 text-white/20 hover:text-red-500 font-tech text-[8px] font-black uppercase tracking-[0.2em] border border-white/5 hover:border-red-500/20 hover:bg-red-500/5 rounded-xl transition-all active:scale-95 group"
        >
          <div className="flex items-center gap-2 min-w-0">
            <LogOut className="w-3.5 h-3.5 shrink-0 group-hover:-translate-x-1 transition-all" />
            <span className="truncate text-white">Deconnecter</span>
          </div>
          <span className="text-[7px] opacity-0 group-hover:opacity-100 transition-opacity shrink-0">?</span>
        </button>
      </div>
    </aside>
  );
}