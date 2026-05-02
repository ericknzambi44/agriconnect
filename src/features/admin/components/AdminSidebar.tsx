// src/features/admin/components/AdminSidebar.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, MapPin, Package, LogOut, ShieldCheck } from 'lucide-react';
import { useAdminCore } from '../hooks/use-admin-core';

export const AdminSidebar = () => {
  const { admin, logout } = useAdminCore();

  const links = [
    { to: "/admin/overview", label: "Vue d'ensemble", icon: <LayoutDashboard size={18} /> },
    { to: "/admin/agencies", label: "Réseau Agences", icon: <MapPin size={18} /> },
    { to: "/admin/users", label: "Contrôle Users", icon: <Users size={18} /> },
  ];

  return (
    <aside className="w-72 border-r border-white/5 bg-[#080808] flex flex-col h-full">
      <div className="p-8 border-b border-white/5">
        <div className="flex items-center gap-2 text-primary mb-2">
          <ShieldCheck size={16} />
          <span className="font-tech text-[10px] font-black uppercase tracking-[0.3em]">ADMINISTRATION</span>
        </div>
        <h1 className="font-display font-black text-2xl uppercase italic text-white tracking-tighter">Agri<span className="text-primary">Admin</span></h1>
      </div>

      <nav className="flex-1 p-6 space-y-2">
        <div className="text-[9px] font-tech text-white/20 uppercase tracking-[0.2em] mb-4 px-2">Navigation_System</div>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `
              flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300
              ${isActive 
                ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_20px_-5px_rgba(var(--primary),0.3)]' 
                : 'text-white/40 hover:bg-white/5 hover:text-white'}
            `}
          >
            {link.icon}
            <span className="text-[11px] font-black uppercase italic tracking-wider">{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-6 mt-auto border-t border-white/5 bg-white/[0.01]">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center font-black text-primary">
            {admin?.prenom?.[0]}
          </div>
          <div>
            <p className="text-[10px] font-bold text-white uppercase italic">{admin?.prenom} {admin?.nom}</p>
            <p className="text-[8px] font-tech text-primary uppercase">Root_Privileges</p>
          </div>
        </div>
        <button 
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-white/5 text-white/40 hover:text-red-500 hover:border-red-500/30 hover:bg-red-500/5 transition-all text-[10px] font-black uppercase italic"
        >
          <LogOut size={14} /> Déconnexion_Système
        </button>
      </div>
    </aside>
  );
};