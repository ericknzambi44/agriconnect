// src/features/admin/components/AdminStatGrid.tsx
import React from 'react';
import { useAdminStats } from '../hooks/use-admin-stats';
import { Users, MapPin, Package, Wallet, RefreshCcw } from 'lucide-react';

export const AdminStatGrid = () => {
  const { stats, loading, refresh } = useAdminStats();

  const cards = [
    { label: "Utilisateurs", value: stats.usersCount, icon: <Users size={20}/>, color: "text-blue-500" },
    { label: "Agences", value: stats.agenciesCount, icon: <MapPin size={20}/>, color: "text-primary" },
    { label: "En Transit", value: stats.activeExpeditions, icon: <Package size={20}/>, color: "text-orange-500" },
    { label: "Liquidité Totale", value: `${stats.totalVolume.toLocaleString()} $`, icon: <Wallet size={20}/>, color: "text-green-500" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-tech text-[10px] uppercase tracking-[0.3em] text-white/40">Network_Metrics</h3>
        <button onClick={refresh} className="p-2 hover:bg-white/5 rounded-full transition-colors">
          <RefreshCcw size={14} className={`text-white/20 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <div key={i} className="bg-[#0A0A0A] border border-white/5 p-6 rounded-2xl hover:border-primary/20 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 bg-white/5 rounded-xl ${card.color}`}>{card.icon}</div>
              <div className="h-1 w-8 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-primary/20 w-1/2 group-hover:w-full transition-all duration-700"></div>
              </div>
            </div>
            <p className="text-[9px] font-tech text-white/30 uppercase tracking-widest">{card.label}</p>
            <p className="text-2xl font-display font-black text-white italic">{loading ? "---" : card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};