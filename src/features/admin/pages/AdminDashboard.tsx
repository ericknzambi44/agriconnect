// src/features/admin/pages/AdminDashboard.tsx
import React from 'react';
import { Activity, Users, Store, Zap } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-display font-black italic text-white uppercase tracking-tighter">
          System_<span className="text-primary">Status</span>
        </h1>
        <p className="font-tech text-[10px] text-white/30 uppercase tracking-[0.2em]">Données temps réel de l'infrastructure Pyshopy</p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon={<Users className="text-primary" />} label="Staff_Active" value="12" detail="Sur 4 Agences" />
        <StatCard icon={<Store className="text-primary" />} label="Terminal_Nodes" value="04" detail="Connectés" />
        <StatCard icon={<Activity className="text-primary" />} label="System_Load" value="0.4ms" detail="Stable" />
      </div>

      {/* Zone de contrôle rapide ou Graphiques */}
      <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8 h-64 flex items-center justify-center">
        <span className="font-tech text-[10px] text-white/10 uppercase tracking-[1em]">Monitoring_Visualizer_Standby</span>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, detail }: any) {
  return (
    <div className="bg-[#0A0A0A] border border-white/5 p-6 rounded-2xl group hover:border-primary/20 transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-white/5 rounded-xl">{icon}</div>
        <Zap size={12} className="text-white/5 group-hover:text-primary transition-colors" />
      </div>
      <p className="font-tech text-[9px] text-white/30 uppercase tracking-widest">{label}</p>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-display font-black text-white">{value}</span>
        <span className="text-[10px] font-tech text-primary/60">{detail}</span>
      </div>
    </div>
  );
}