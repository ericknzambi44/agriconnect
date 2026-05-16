// features/admin/views/AdminDashboard.tsx
import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import AdminOverview from './AdminOverview';
import AdminUsers from './AdminUsers';
import AdminAgencies from './AdminAgencies';
import AdminPlans from './AdminPlans';
import AdminExpeditions from './AdminExpeditions';
import AdminWallets from './AdminWallets';

const tabs = [
  { id: 'overview', label: 'Tableau de bord', icon: '📊' },
  { id: 'users', label: 'Utilisateurs', icon: '👥' },
  { id: 'agencies', label: 'Agences', icon: '🏢' },
  { id: 'plans', label: 'Plans', icon: '💰' },
  { id: 'expeditions', label: 'Expéditions', icon: '📦' },
  { id: 'wallets', label: 'Portefeuilles', icon: '💳' },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#050505] to-black">
      {/* Bandeau dégradé */}
      <div className="w-full h-2 bg-gradient-to-r from-primary via-orange-400 to-primary" />

      <div className="flex flex-col">
        {/* Onglets */}
        <div className="flex flex-wrap gap-2 p-4 border-b border-white/10 bg-black/30">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-2 rounded-full font-tech text-xs font-black uppercase tracking-wider transition-all",
                activeTab === tab.id
                  ? "bg-gradient-to-r from-primary to-orange-400 text-black shadow-lg"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              )}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Contenu */}
        <div className="p-4">
          {activeTab === 'overview' && <AdminOverview />}
          {activeTab === 'users' && <AdminUsers />}
          {activeTab === 'agencies' && <AdminAgencies />}
          {activeTab === 'plans' && <AdminPlans />}
          {activeTab === 'expeditions' && <AdminExpeditions />}
          {activeTab === 'wallets' && <AdminWallets />}
        </div>
      </div>
    </div>
  );
}