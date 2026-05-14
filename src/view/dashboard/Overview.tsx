// features/dashboard/views/DashboardOverview.tsx
import React from 'react';
import { Card } from "@/components/ui/card";
import { 
  TrendingUp, Users, Package, DollarSign, 
  Leaf, Truck, ShoppingCart, Activity, ArrowUpRight, Cpu 
} from "lucide-react";
import { useAuthSession } from '@/features/auth/hooks/use-auth-session';
import { cn } from "@/lib/utils";

export default function DashboardOverview() {
  const { profile } = useAuthSession();

  const getStatsByRole = () => {
    const common = { label: "SANTE SYSTEME", val: "98.2%", icon: Activity, color: "text-primary" };
    
    switch (profile?.role) {
      case 'vendeur':
        return [
          { label: "REVENU TOTAL", val: "1 240,00 $", icon: DollarSign, color: "text-primary" },
          { label: "VOLUME STOCK", val: "450 KG", icon: Leaf, color: "text-primary" },
          { label: "COMMANDES ATTENTE", val: "24", icon: Package, color: "text-primary" },
          common
        ];
      case 'acheteur':
        return [
          { label: "TOTAL DEPENSES", val: "850,50 $", icon: DollarSign, color: "text-primary" },
          { label: "LISTE SUIVI", val: "12 PRODUITS", icon: ShoppingCart, color: "text-primary" },
          { label: "EN TRANSIT", val: "05", icon: Truck, color: "text-primary" },
          common
        ];
      case 'transporteur':
        return [
          { label: "GAINS FLOTTE", val: "320,00 $", icon: DollarSign, color: "text-primary" },
          { label: "LOG DISTANCE", val: "1 200 KM", icon: TrendingUp, color: "text-primary" },
          { label: "MISSIONS ACTIVES", val: "14", icon: Truck, color: "text-primary" },
          common
        ];
      default: return [];
    }
  };

  const stats = getStatsByRole();

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3 mb-1">
            <div className="h-[2px] w-10 bg-gradient-to-r from-primary to-orange-400" />
            <span className="font-tech text-[10px] tracking-[0.5em] text-primary uppercase font-bold">Terminal Principal</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-display italic tracking-tighter leading-none text-white uppercase">
            Vue <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">d'ensemble</span>
          </h1>
          
          <p className="font-tech text-white/40 text-[10px] md:text-[11px] uppercase tracking-[0.2em] flex items-center gap-2">
            Sector_Bunia <span className="text-primary">/</span> zone: <span className="text-white font-bold">{profile?.role?.toUpperCase() || 'GUEST'}</span>
          </p>
        </div>
        
        {/* STATUT SYSTÈME */}
        <div className="px-6 py-4 bg-black/40 border-2 border-primary/30 rounded-xl flex items-center gap-5 shadow-lg shadow-primary/10 backdrop-blur-sm">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary border border-white/20"></span>
          </div>
          <div className="flex flex-col">
            <span className="font-tech text-[9px] text-white/50 uppercase tracking-widest font-bold">Statut Serveur</span>
            <span className="font-tech text-[11px] text-white font-black uppercase tracking-widest">Opérationnel Stable</span>
          </div>
        </div>
      </div>

      {/* GRILLE STATISTIQUES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, i) => (
          <Card key={i} className="group relative overflow-hidden border border-white/10 bg-gradient-to-b from-white/[0.03] to-black/40 p-6 transition-all duration-500 hover:border-primary/60 hover:shadow-2xl hover:shadow-primary/10 rounded-2xl backdrop-blur-sm">
            {/* Fond animé au survol */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="flex flex-col justify-between h-full relative z-10 gap-6">
              <div className="flex justify-between items-start">
                <div className={cn("p-3 rounded-xl bg-black/50 border border-white/10 group-hover:border-primary/30 transition-all duration-300", stat.color)}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-white/30 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
              </div>

              <div className="space-y-1">
                <p className="font-tech text-[9px] font-bold uppercase tracking-[0.2em] text-white/50">
                  {stat.label}
                </p>
                <p className="font-tech text-3xl font-black italic tracking-tighter text-white">
                  {stat.val}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* ZONE DE VISUALISATION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* MONITEUR DE DONNÉES */}
        <Card className="lg:col-span-2 relative overflow-hidden h-[500px] border border-white/10 bg-gradient-to-b from-white/[0.02] to-black/40 rounded-3xl group backdrop-blur-sm">
          {/* Grille technique */}
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[linear-gradient(var(--color-border)_1px,transparent_1px),linear-gradient(90deg,var(--color-border)_1px,transparent_1px)] bg-[size:40px_40px]" />
          
          <div className="flex justify-between items-center p-6 relative z-10">
            <div className="flex flex-col gap-1">
              <h3 className="font-tech font-black uppercase text-[6px] tracking-[0.4em] text-primary">Monitoring Direct</h3>
              <span className="font-tech text-[6px] text-white/40 font-bold uppercase">Source: AgriConnect Core</span>
            </div>
            <div className="px-4 py-1 border border-primary/40 rounded-md bg-primary/10 backdrop-blur-sm">
              <span className="font-tech text-[9px] text-primary animate-pulse">SYNC LIVE</span>
            </div>
          </div>

          <div className="h-full flex flex-col items-center justify-center relative z-10 pb-20">
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] transition-all duration-700 group-hover:scale-110 group-hover:opacity-[0.05]">
              <Cpu className="w-[400px] h-[400px] text-primary" />
            </div>
            
            <h2 className="font-display text-white text-2xl md:text-6xl italic uppercase tracking-tighter text-center leading-[0.9]">
              Agri Connect<br/><span className="text-primary/90">Visualiseur</span>
            </h2>

            <div className="mt-8 px-6 py-2 border border-primary bg-primary/10 text-primary font-tech text-[10px] font-black uppercase tracking-[0.5em] rounded-full backdrop-blur-sm">
              Analyse Faisceau OK
            </div>
          </div>
        </Card>

        {/* ACTIONS & IA */}
        <div className="flex flex-col gap-6">
          <Card className="border border-white/10 bg-gradient-to-b from-white/[0.02] to-black/40 p-6 rounded-3xl flex flex-col justify-center relative overflow-hidden backdrop-blur-sm">
            <h3 className="font-tech font-black uppercase text-[11px] tracking-[0.3em] mb-6 text-primary border-l-4 border-primary pl-3">
              Commandes Rapides
            </h3>
            
            <div className="space-y-4 relative z-10">
              <button className="w-full py-4 bg-gradient-to-r from-primary to-orange-400 text-black font-tech font-black uppercase text-[11px] tracking-[0.2em] rounded-xl shadow-lg shadow-primary/30 hover:scale-[1.02] transition-all active:scale-95">
                {profile?.role === 'vendeur' ? 'PUBLIER STOCK' : 'PASSER COMMANDE'}
              </button>
              
              <button className="w-full py-4 bg-black/40 border border-white/10 text-white font-tech font-bold uppercase text-[9px] tracking-[0.3em] rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-all">
                EXPORT DATA CSV
              </button>
            </div>
          </Card>

          {/* CONSEILLER IA */}
          <Card className="border border-white/10 bg-gradient-to-b from-white/[0.02] to-black/40 p-6 rounded-3xl flex-1 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-primary mb-4">
              <Activity className="w-4 h-4" />
              <span className="font-tech text-[10px] font-black uppercase tracking-[0.4em]">Assistant Predictif</span>
            </div>
            
            <div className="p-4 bg-black/30 border border-white/10 rounded-xl">
              <p className="font-sans text-[13px] font-semibold text-white/90 leading-relaxed italic">
                "Volatilité du marché <span className="text-primary font-tech text-[11px]">BUNIA EST</span> détectée à <span className="text-primary font-bold">12.5%</span>. Ajustez vos prix de réserve."
              </p>
            </div>

            <div className="mt-4 space-y-2">
              <div className="h-[2px] w-full bg-white/10 overflow-hidden rounded-full">
                <div className="h-full bg-gradient-to-r from-primary to-orange-400 w-2/3 rounded-full" />
              </div>
              <p className="font-tech text-[7px] text-white/40 uppercase tracking-widest text-right">Fiabilité Analyse: 94%</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}