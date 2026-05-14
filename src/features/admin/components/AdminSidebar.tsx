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
  Terminal,
  Cpu,
  Fingerprint
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
    { to: "/admin/overview", label: "Vue d'ensemble", icon: <LayoutDashboard size={18} />, code: "0x01" },
    { to: "/admin/agencies", label: "Réseau Agences", icon: <MapPin size={18} />, code: "0x02" },
    { to: "/admin/users", label: "Contrôle Users", icon: <Users size={18} />, code: "0x03" },
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
        "fixed inset-y-0 left-0 z-[150] w-[300px] bg-[#050505] border-r-2 border-white/5 flex flex-col transition-all duration-500 ease-in-out lg:translate-x-0 lg:static lg:h-screen lg:shrink-0 shadow-[20px_0_50px_rgba(0,0,0,0.5)]",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        
        {/* BOUTON FERMER (MOBILE) */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-white/5 rounded-xl text-white/20 hover:text-white lg:hidden active:scale-90 transition-all border border-white/5"
        >
          <X size={18} />
        </button>

        {/* HEADER : ROOT IDENTITY */}
        <div className="relative p-10 border-b-2 border-white/5 shrink-0 overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="flex items-center gap-2 text-primary mb-5">
            <Cpu size={14} className="animate-pulse" />
            <span className="font-mono text-[9px] font-black uppercase tracking-[0.5em] opacity-50">
              Kernel_Agri_v1.0
            </span>
          </div>
          
          <h1 className="font-display font-black text-3xl uppercase italic text-white tracking-tighter leading-none mb-4">
            AGRI<span className="text-primary text-glow">ADMIN</span>
          </h1>
          
          <div className="flex items-center gap-2">
            <div className="h-6 px-3 flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-md">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">System_Active</span>
            </div>
          </div>
        </div>

        {/* NAVIGATION : SYSTEM LINKS */}
        <nav className="flex-1 p-6 space-y-2 overflow-y-auto no-scrollbar">
          <div className="text-[9px] font-mono text-white/20 uppercase tracking-[0.4em] mb-6 px-4 flex items-center justify-between">
            <span>Main_Protocols</span>
            <Terminal size={10} />
          </div>
          
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={({ isActive }) => cn(
                "flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-500 group relative overflow-hidden border",
                isActive 
                  ? "bg-primary/5 text-primary border-primary/30 shadow-[0_0_30px_-10px_rgba(var(--primary),0.3)]" 
                  : "text-white/30 border-transparent hover:bg-white/[0.02] hover:text-white/80 hover:border-white/5"
              )}
            >
              {/* Actif Layer */}
              <div className={cn(
                "absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent opacity-0 transition-opacity duration-500",
                "group-[.active]:opacity-100"
              )} />

              <div className="relative z-10 shrink-0 group-hover:rotate-[10deg] transition-transform duration-500">
                {link.icon}
              </div>
              
              <div className="relative z-10 flex flex-col">
                <span className="text-[11px] font-black uppercase italic tracking-wider leading-none">
                  {link.label}
                </span>
                <span className="text-[7px] font-mono opacity-40 uppercase mt-1 group-hover:text-primary transition-colors">
                  Protocol_{link.code}
                </span>
              </div>
              
              {/* Ligne d'accentuation */}
              <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-primary scale-y-0 group-[.active]:scale-y-100 transition-transform duration-700 origin-bottom" />
            </NavLink>
          ))}
        </nav>

        {/* FOOTER : SECURE USER LOGOUT */}
        <div className="p-6 mt-auto">
          <div className="bg-[#0A0A0A] border-2 border-white/5 rounded-[2rem] p-5 mb-4 relative overflow-hidden group/card">
            <div className="absolute inset-0 bg-primary/5 translate-y-full group-hover/card:translate-y-0 transition-transform duration-700" />
            
            <div className="relative z-10 flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                  <Fingerprint className="text-primary/40 group-hover/card:text-primary transition-colors" size={24} />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary border-4 border-[#0A0A0A] rounded-full" />
              </div>
              
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-black text-white uppercase italic truncate">
                  {admin?.prenom || 'Root'}_{admin?.nom || 'Admin'}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <ShieldCheck size={10} className="text-primary" />
                  <span className="text-[8px] font-mono text-white/30 uppercase tracking-tighter">
                    Auth_Level: 04
                  </span>
                </div>
              </div>
            </div>
          </div>

          <button 
            onClick={logout}
            className="w-full flex items-center justify-between px-6 py-5 rounded-[1.5rem] bg-red-500/5 border-2 border-red-500/10 text-red-500/50 hover:text-white hover:bg-red-500 hover:border-red-500 transition-all duration-500 group active:scale-95"
          >
            <span className="text-[10px] font-black uppercase italic tracking-[0.2em]">
              Log_Out
            </span>
            <LogOut size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <style>{`
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          .text-glow { text-shadow: 0 0 15px rgba(var(--primary), 0.6); }
        `}</style>
      </aside>
    </>
  );
};