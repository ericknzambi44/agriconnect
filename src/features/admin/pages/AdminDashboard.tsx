// src/features/admin/pages/AdminDashboard.tsx
import React from 'react';
import { 
  Activity, 
  Users, 
  Store, 
  Zap, 
  TrendingUp, 
  ShieldCheck, 
  Globe,
  ArrowUpRight,
  Layers
} from 'lucide-react';
import { cn } from "@/lib/utils";

export default function AdminDashboard() {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* --- HEADER DE SESSION --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
            <span className="font-mono text-[9px] text-primary uppercase tracking-[0.3em] font-bold">Système en ligne</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black italic text-white uppercase tracking-tighter leading-none">
            Main_<span className="text-primary">Console</span>
          </h1>
          <p className="font-mono text-[10px] text-white/30 uppercase tracking-[0.2em] mt-3">
            Infrastructure <span className="text-white/60">AgriConnect</span> • Monitoring Global v2.4
          </p>
        </div>

        <div className="flex gap-4">
          <div className="bg-white/5 border border-white/10 px-5 py-3 rounded-2xl backdrop-blur-md">
            <p className="text-[8px] font-mono text-white/20 uppercase mb-1">Uptime_Global</p>
            <p className="text-xs font-black text-white font-mono">99.98%</p>
          </div>
          <div className="bg-primary text-black px-5 py-3 rounded-2xl shadow-lg shadow-primary/10">
            <p className="text-[8px] font-black uppercase mb-1 opacity-60">Security_Level</p>
            <p className="text-xs font-black uppercase italic">Protocole_Alpha</p>
          </div>
        </div>
      </div>

      {/* --- GRILLE DE STATISTIQUES ÉTENDUE --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<Users size={20} />} 
          label="Staff_Total" 
          value="14" 
          detail="+2 cette semaine"
          trend="+12%" 
        />
        <StatCard 
          icon={<Store size={20} />} 
          label="Nodes_Actifs" 
          value="04" 
          detail="Agences connectées"
          trend="Stable" 
        />
        <StatCard 
          icon={<Activity size={20} />} 
          label="Latency_DB" 
          value="24ms" 
          detail="Supabase Edge"
          trend="-4ms" 
          isPositive
        />
        <StatCard 
          icon={<Layers size={20} />} 
          label="Transactions" 
          value="1.2k" 
          detail="Volume mensuel"
          trend="+5%" 
          isPositive
        />
      </div>

      {/* --- VISUALISEUR DE FLUX & ACTIVITÉ --- */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Monitoring Graph Area */}
        <div className="xl:col-span-2 bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          
          <div className="flex items-center justify-between mb-12">
            <div>
              <h3 className="text-white font-black text-xs uppercase tracking-widest flex items-center gap-2">
                <TrendingUp size={14} className="text-primary" />
                Analyse_Flux_AgriConnect
              </h3>
              <p className="text-[9px] font-mono text-white/20 uppercase mt-1">Données synchronisées en temps réel</p>
            </div>
            <select className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-[9px] font-black text-white/60 uppercase outline-none">
                <option>Dernières 24h</option>
                <option>7 derniers jours</option>
            </select>
          </div>

          {/* Placeholder Graphique stylisé */}
          <div className="h-64 flex items-end gap-2 md:gap-4 px-2">
            {[40, 70, 45, 90, 65, 80, 50, 95, 75, 60, 85, 45].map((height, i) => (
              <div key={i} className="flex-1 group/bar relative">
                <div 
                  className="w-full bg-white/5 rounded-t-lg group-hover/bar:bg-primary/20 transition-all duration-500 relative overflow-hidden"
                  style={{ height: `${height}%` }}
                >
                    <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover/bar:opacity-100 transition-opacity" />
                </div>
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] font-mono text-white/10 group-hover/bar:text-white/40 transition-colors">
                    {12 + i}h
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Side Panel: Security & Nodes */}
        <div className="space-y-6">
          <div className="bg-primary/5 border border-primary/10 rounded-[2.5rem] p-8">
            <h3 className="text-primary font-black text-xs uppercase tracking-widest mb-6 flex items-center gap-2">
                <ShieldCheck size={16} />
                Health_Check
            </h3>
            <div className="space-y-6">
                <HealthItem label="Database_Cluster" status="Optimal" />
                <HealthItem label="Storage_S3" status="Active" />
                <HealthItem label="Auth_Service" status="Optimal" />
                <HealthItem label="Api_Gateway" status="Active" />
            </div>
          </div>

          <div className="bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] p-8">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-white/40 font-black text-[10px] uppercase tracking-widest">Nodes_Status</h3>
                <Globe size={14} className="text-white/20" />
            </div>
            <div className="space-y-4">
                {['Bunia_Central', 'Goma_Nord', 'Butembo_Main'].map((city) => (
                    <div key={city} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                        <span className="text-[10px] font-bold text-white/60 uppercase italic">{city}</span>
                        <span className="text-[9px] font-mono text-emerald-500 font-black">ONLINE</span>
                    </div>
                ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function StatCard({ icon, label, value, detail, trend, isPositive }: any) {
  return (
    <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-[2rem] group hover:border-primary/30 transition-all duration-500 relative overflow-hidden">
     <div className="absolute -right-4 -bottom-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
  {React.cloneElement(icon as React.ReactElement<{ size: number }>, { 
    size: 120 
  })}
</div>
      
      <div className="flex justify-between items-start mb-6">
        <div className="p-4 bg-white/5 rounded-2xl group-hover:bg-primary group-hover:text-black transition-all duration-500">
          {icon}
        </div>
        <div className={cn(
            "flex items-center gap-1 px-3 py-1 rounded-full text-[9px] font-black font-mono",
            isPositive ? "bg-emerald-500/10 text-emerald-500" : "bg-white/5 text-white/40"
        )}>
            {trend}
            <ArrowUpRight size={10} />
        </div>
      </div>

      <div className="space-y-1 relative z-10">
        <p className="font-mono text-[9px] text-white/30 uppercase tracking-[0.2em]">{label}</p>
        <div className="flex items-baseline gap-3">
            <span className="text-4xl font-black text-white italic tracking-tighter">{value}</span>
            <span className="text-[9px] font-mono text-white/20 uppercase font-bold">{detail}</span>
        </div>
      </div>
    </div>
  );
}

function HealthItem({ label, status }: { label: string, status: string }) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-tight">{label}</span>
            <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono text-primary font-black uppercase italic">{status}</span>
                <div className="w-1 h-1 rounded-full bg-primary" />
            </div>
        </div>
    )
}