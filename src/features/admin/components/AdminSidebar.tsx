// src/features/admin/components/AdminSidebar.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  MapPin, 
  LogOut, 
  ShieldCheck, 
  X, 
  Terminal 
} from 'lucide-react';
import { useAdminCore } from '../hooks/use-admin-core';
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const AdminSidebar = ({ isOpen, onClose }: AdminSidebarProps) => {
  const { admin, logout } = useAdminCore();

  const links = [
    { to: "/admin/overview", label: "Vue d'ensemble", icon: <LayoutDashboard size={18} /> },
    { to: "/admin/agencies", label: "Réseau Agences", icon: <MapPin size={18} /> },
    { to: "/admin/users", label: "Contrôle Users", icon: <Users size={18} /> },
  ];

  return (
    <>
      {/* OVERLAY MOBILE : Empêche toute interaction avec le contenu quand le menu est ouvert */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[140] lg:hidden animate-in fade-in duration-300"
          onClick={onClose}
        />
      )}

      <aside className={cn(
        "fixed inset-y-0 left-0 z-[150] w-[280px] bg-[#080808] border-r border-white/5 flex flex-col transition-transform duration-500 ease-in-out lg:translate-x-0 lg:static lg:h-screen lg:shrink-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        
        {/* BOUTON FERMER INTERNE (MOBILE UNIQUEMENT) */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-4 p-2 text-white/20 hover:text-white lg:hidden active:scale-95 transition-all"
        >
          <X size={20} />
        </button>

        {/* HEADER : Identité ROOT AgriConnect */}
        <div className="p-8 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-2 text-primary mb-3">
            <Terminal size={14} className="animate-pulse" />
            <span className="font-mono text-[9px] font-black uppercase tracking-[0.4em] opacity-70">
              Admin_Secure_V1
            </span>
          </div>
          
          <h1 className="font-display font-black text-2xl uppercase italic text-white tracking-tighter leading-none">
            Agri<span className="text-primary text-glow">Admin</span>
          </h1>
          
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-primary/5 border border-primary/20 rounded-full">
            <ShieldCheck size={10} className="text-primary" />
            <span className="text-[8px] font-black text-primary uppercase tracking-widest">Privilèges_Root</span>
          </div>
        </div>

        {/* NAVIGATION : Système Dynamique */}
        <nav className="flex-1 p-5 space-y-1.5 overflow-y-auto no-scrollbar">
          <div className="text-[9px] font-mono text-white/20 uppercase tracking-[0.3em] mb-4 px-3 flex items-center gap-2">
            <span className="w-4 h-[1px] bg-white/10"></span>
            Navigation_Core
          </div>
          
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={({ isActive }) => cn(
                "flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden",
                isActive 
                  ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_20px_-5px_rgba(var(--primary),0.2)]" 
                  : "text-white/40 hover:bg-white/[0.03] hover:text-white"
              )}
            >
              <div className="shrink-0 group-hover:scale-110 transition-transform duration-300">
                {link.icon}
              </div>
              <span className="text-[11px] font-black uppercase italic tracking-wider truncate">
                {link.label}
              </span>
              
              {/* Indicateur de focus terminal */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-0 bg-primary group-[.active]:h-1/2 transition-all duration-500" />
            </NavLink>
          ))}
        </nav>

        {/* FOOTER : Session & Disconnect */}
        <div className="p-5 mt-auto border-t border-white/5 bg-black/40">
          <div className="flex items-center gap-3 p-3 mb-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center font-black text-primary uppercase italic">
                {admin?.prenom?.[0] || 'R'}
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-[#080808] rounded-full shadow-lg" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-white uppercase italic truncate">
                {admin?.prenom} {admin?.nom}
              </p>
              <p className="text-[8px] font-mono text-white/30 uppercase tracking-tighter truncate">
                ID_{admin?.id?.substring(0, 8).toUpperCase()}
              </p>
            </div>
          </div>

          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl border border-red-500/10 text-white/20 hover:text-red-500 hover:border-red-500/30 hover:bg-red-500/5 transition-all group active:scale-95"
          >
            <LogOut size={14} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase italic tracking-widest">
              Terminer_Session
            </span>
          </button>
        </div>

        <style>{`
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          .text-glow { text-shadow: 0 0 10px rgba(var(--primary), 0.4); }
        `}</style>
      </aside>
    </>
  );
};