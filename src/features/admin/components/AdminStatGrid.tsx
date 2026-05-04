// src/features/admin/components/AdminStatGrid.tsx
import React from 'react';
import { useAdminStats } from '../hooks/use-admin-stats';
import { Users, MapPin, Package, Wallet, RefreshCcw, TrendingUp } from 'lucide-react';
import { cn } from "@/lib/utils";

export const AdminStatGrid = () => {
  const { stats, loading, refresh } = useAdminStats();

  const cards = [
    { 
      label: "Utilisateurs", 
      value: stats.usersCount, 
      icon: <Users size={18}/>, 
      color: "text-blue-400",
      bg: "group-hover:bg-blue-500/10",
      border: "group-hover:border-blue-500/30"
    },
    { 
      label: "Réseau Agences", 
      value: stats.agenciesCount, 
      icon: <MapPin size={18}/>, 
      color: "text-primary",
      bg: "group-hover:bg-primary/10",
      border: "group-hover:border-primary/30"
    },
    { 
      label: "Fret en Transit", 
      value: stats.activeExpeditions, 
      icon: <Package size={18}/>, 
      color: "text-orange-400",
      bg: "group-hover:bg-orange-500/10",
      border: "group-hover:border-orange-500/30"
    },
    { 
      label: "Flux Trésorerie", 
      value: `${stats.totalVolume.toLocaleString()} $`, 
      icon: <Wallet size={18}/>, 
      color: "text-emerald-400",
      bg: "group-hover:bg-emerald-500/10",
      border: "group-hover:border-emerald-500/30"
    },
  ];

  return (
    <div className="space-y-6">
      {/* Barre d'état supérieure */}
      <div className="flex justify-between items-end px-2">
        <div>
          <h3 className="font-tech text-[10px] uppercase tracking-[0.4em] text-white/20 mb-1">System_Performance</h3>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[9px] font-mono text-primary uppercase font-bold tracking-widest">Live_Nodes_Active</span>
          </div>
        </div>
        
        <button 
          onClick={refresh} 
          disabled={loading}
          className="group flex items-center gap-3 px-4 py-2 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.05] transition-all active:scale-95 disabled:opacity-50"
        >
          <span className="text-[9px] font-black text-white/40 uppercase italic group-hover:text-white transition-colors">
            {loading ? 'Re-Sync...' : 'Refresh_Data'}
          </span>
          <RefreshCcw size={12} className={cn("text-white/20 group-hover:text-primary transition-colors", loading && "animate-spin")} />
        </button>
      </div>
      
      {/* Grille de Cartes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {cards.map((card, i) => (
          <div 
            key={i} 
            className={cn(
                "relative bg-[#0A0A0A] border border-white/5 p-6 rounded-[2rem] transition-all duration-500 group overflow-hidden",
                card.border
            )}
          >
            {/* Effet de Gradient au Hover */}
            <div className={cn(
                "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-transparent via-transparent to-white/[0.02]",
                card.bg
            )} />

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <div className={cn(
                        "p-3 rounded-2xl bg-white/[0.03] border border-white/5 transition-all duration-500 group-hover:scale-110",
                        card.color
                    )}>
                        {card.icon}
                    </div>
                    
                    {/* Badge de tendance (Décoratif/Statique ici, mais prêt pour la logique) */}
                    <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/[0.02] border border-white/5">
                        <TrendingUp size={10} className="text-emerald-500" />
                        <span className="text-[8px] font-mono text-emerald-500">+2.4%</span>
                    </div>
                </div>

                <div className="space-y-1">
                    <p className="text-[9px] font-tech text-white/30 uppercase tracking-[0.2em]">
                        {card.label}
                    </p>
                    
                    {loading ? (
                        <div className="h-8 w-24 bg-white/5 animate-pulse rounded-lg mt-2" />
                    ) : (
                        <p className="text-3xl font-display font-black text-white italic tracking-tighter group-hover:text-primary transition-colors duration-500">
                            {card.value}
                        </p>
                    )}
                </div>

                {/* Barre de progression technique (Décorative) */}
                <div className="mt-6 h-[2px] w-full bg-white/5 rounded-full overflow-hidden">
                    <div 
                        className={cn(
                            "h-full transition-all duration-1000 ease-out",
                            i === 0 ? "w-[70%] bg-blue-500" : 
                            i === 1 ? "w-[45%] bg-primary" : 
                            i === 2 ? "w-[85%] bg-orange-500" : "w-[60%] bg-emerald-500"
                        )} 
                    />
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};