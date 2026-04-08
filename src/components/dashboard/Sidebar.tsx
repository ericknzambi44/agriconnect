// src/components/dashboard/Sidebar.tsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from '@/supabase';
import { getNavigationForRole } from "@/config/navigation";

interface SidebarProps {
  role: 'vendeur' | 'acheteur' | 'transporteur';
  isOpen: boolean;    // <--- AJOUTÉ
  onClose: () => void; // <--- AJOUTÉ
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
      // 1. STRUCTURE & Z-INDEX
      "fixed left-0 top-0 h-screen w-72 flex-col z-50 transition-transform duration-300 ease-in-out",
      "bg-glass-agri border-r border-white/5 shadow-2xl lg:shadow-none",
      
      // 2. LOGIQUE RESPONSIVE (L'erreur était ici)
      // Sur Desktop (lg) : Toujours visible (translate-x-0)
      // Sur Mobile : Dépend de isOpen (ouvert = 0, fermé = -100%)
      "lg:translate-x-0 lg:flex", 
      isOpen ? "translate-x-0 flex" : "-translate-x-full hidden lg:flex"
    )}>
      
      {/* BOUTON FERMER (Uniquement visible sur Mobile) */}
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 p-2 lg:hidden text-foreground/40 hover:text-white transition-colors"
      >
        <X className="w-6 h-6" />
      </button>

      {/* LOGO ÉLITE */}
      <div className="p-8 pb-12">
        <h2 className="text-3xl font-black tracking-tighter uppercase italic leading-none select-none">
          <span className="text-primary text-glow-green">Agri</span>
          <span className="text-accent text-glow-yellow">Connect</span>
        </h2>
        <div className="mt-3 inline-flex items-center gap-2 px-2.5 py-1 bg-primary/10 border border-primary/20 rounded text-[9px] font-black uppercase tracking-[0.2em] text-primary">
          <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></span>
          Terminal {role}
        </div>
      </div>

      {/* NAVIGATION DYNAMIQUE */}
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            onClick={onClose} // Ferme le menu mobile quand on clique sur un lien
            end={item.href === "/dashboard"} 
            className={({ isActive }) => cn(
              "flex items-center justify-between px-4 py-4 rounded-xl transition-all group border border-transparent",
              isActive 
                ? "bg-primary/20 border-primary/30 text-white shadow-[0_0_25px_rgba(34,197,94,0.1)]" 
                : "text-foreground/40 hover:text-primary hover:bg-white/5"
            )}
          >
            <div className="flex items-center gap-3">
              <item.icon className={cn(
                "w-5 h-5 transition-transform duration-300",
                "group-hover:scale-110 group-hover:rotate-3"
              )} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] leading-none">
                {item.name}
              </span>
            </div>
            <ChevronRight className={cn(
              "w-4 h-4 transition-all opacity-0 -translate-x-2",
              "group-hover:opacity-100 group-hover:translate-x-0"
            )} />
          </NavLink>
        ))}
      </nav>

      {/* FOOTER */}
      <div className="p-6 border-t bg-zinc-950 border-white/5 bg-background/40 backdrop-blur-md">
        <button 
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-3 px-4 py-4 text-destructive font-white text-[10px] uppercase tracking-[0.2em] border border-transparent hover:border-destructive/20 hover:bg-destructive/10 rounded-xl transition-all active:scale-95 group"
        >
          <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Deconnexion
        </button>
      </div>
    </aside>
  );
}