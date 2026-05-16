// src/features/admin/components/AdminSidebar.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  LogOut, 
  ShieldCheck, 
  X, 
  Terminal,
  Cpu,
  Fingerprint,
  CreditCard
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
    { to: "/admin/overview", label: "Tableau de bord", icon: <LayoutDashboard size={18} />, code: "" },
    { to: "/admin/agencies", label: "Agences", icon: <Building2 size={18} />, code: "" },
    { to: "/admin/users", label: "Utilisateurs", icon: <Users size={18} />, code: "" },
    { to: "/admin/plans", label: "Plans", icon: <CreditCard size={18} />, code: "" },
  ];

  return (
    <>
      {/* OVERLAY MOBILE */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-[140] lg:hidden animate-in fade-in duration-500"
          onClick={onClose}
        />
      )}

      <aside className={cn(
        "fixed inset-y-0 left-0 z-[150] w-[280px] bg-gradient-to-b from-[#0a0a0a] via-[#050505] to-black border-r border-white/10 flex flex-col transition-all duration-500 ease-in-out lg:translate-x-0 lg:static lg:h-screen lg:shrink-0 shadow-2xl",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        
        {/* BOUTON FERMER (MOBILE) */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-white/5 rounded-xl text-white hover:text-white hover:bg-primary/20 lg:hidden active:scale-90 transition-all border border-white/10 z-20"
        >
          <X size={18} />
        </button>

        {/* HEADER */}
        <div className="relative p-6 pb-4 border-b border-white/10 shrink-0 overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          <div className="flex items-center gap-2 text-primary mb-4">
            <Cpu size={12} className="animate-pulse" />
            <span className="font-tech text-[8px] font-black uppercase tracking-[0.4em] text-white/50">
              Terminal Admin
            </span>
          </div>
          
          <h1 className="font-display font-black text-2xl uppercase italic text-white tracking-tighter leading-none">
            AGRI<span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">ADMIN</span>
          </h1>
          
          <div className="flex items-center gap-2 mt-4">
            <div className="px-3 py-1 flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full backdrop-blur-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
              <span className="text-[8px] font-black text-emerald-400 uppercase tracking-wider">Système actif</span>
            </div>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto no-scrollbar">
          <div className="text-[9px] font-tech text-white uppercase tracking-[0.4em] mb-4 px-3 flex items-center justify-between">
            <span>Menu principal</span>
            <Terminal size={10} className="text-primary/50" />
          </div>
          
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden",
                isActive 
                  ? "bg-gradient-to-r from-primary/20 to-transparent text-primary shadow-[inset_0_0_15px_rgba(var(--primary),0.1)]" 
                  : "text-white/50 hover:text-white hover:bg-white/[0.02]"
              )}
            >
              {/* Barre latérale active */}
              <div className={cn(
                "absolute left-0 top-1/4 bottom-1/4 w-[3px] bg-gradient-to-b from-primary to-orange-400 rounded-r-full transition-all duration-300",
                "group-[.active]:opacity-100 group-[.active]:shadow-[0_0_8px_rgba(var(--primary),0.8)]",
                "opacity-0 group-hover:opacity-60"
              )} />

              <div className="relative z-10 shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:text-primary">
                {link.icon}
              </div>
              
              <div className="relative z-10 flex-1">
                <span className="text-[11px] font-display font-black uppercase italic tracking-tight">
                  {link.label}
                </span>
                <div className="text-[7px] font-mono text-white/40 uppercase mt-0.5 group-hover:text-primary/70 transition-colors">
                  {link.code}
                </div>
              </div>
            </NavLink>
          ))}
        </nav>

        {/* FOOTER */}
        <div className="p-4 mt-auto border-t border-white/10">
          <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-4 mb-3 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10 flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/20 flex items-center justify-center">
                  <Fingerprint className="text-primary/60 group-hover:text-primary transition-colors" size={20} />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-black rounded-full" />
              </div>
              
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-display font-black uppercase italic text-white truncate">
                  {admin?.prenom || 'Root'} {admin?.nom || 'Admin'}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <ShieldCheck size={10} className="text-primary" />
                  <span className="text-[7px] font-mono text-white/40 uppercase tracking-wider">
                    
                  </span>
                </div>
              </div>
            </div>
          </div>

          <button 
            onClick={logout}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:text-white hover:bg-red-500 hover:border-red-500 transition-all duration-300 group active:scale-95"
          >
            <span className="text-[10px] font-black uppercase italic tracking-[0.2em]">
              Déconnexion
            </span>
            <LogOut size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <style>{`
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
      </aside>
    </>
  );
};