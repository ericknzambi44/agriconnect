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

  // Configuration des stats en Français avec style "System Label"
  const getStatsByRole = () => {
    const common = { label: "SANTÉ_SYSTÈME", val: "98.2%", icon: Activity, color: "text-emerald-500" };
    
    switch (profile?.role) {
      case 'vendeur':
        return [
          { label: "REVENU_TOTAL", val: "1.240,00 $", icon: DollarSign, color: "text-emerald-500" },
          { label: "VOLUME_STOCK", val: "450 KG", icon: Leaf, color: "text-emerald-500" },
          { label: "COMMANDES_ATTENTE", val: "24", icon: Package, color: "text-emerald-500" },
          common
        ];
      case 'acheteur':
        return [
          { label: "TOTAL_DÉPENSES", val: "850,50 $", icon: DollarSign, color: "text-emerald-500" },
          { label: "LISTE_SUIVI", val: "12 PRODUITS", icon: ShoppingCart, color: "text-emerald-500" },
          { label: "EN_TRANSIT", val: "05", icon: Truck, color: "text-emerald-500" },
          common
        ];
      case 'transporteur':
        return [
          { label: "GAINS_FLOTTE", val: "320,00 $", icon: DollarSign, color: "text-emerald-500" },
          { label: "LOG_DISTANCE", val: "1.200 KM", icon: TrendingUp, color: "text-emerald-500" },
          { label: "MISSIONS_ACTIVES", val: "14", icon: Truck, color: "text-emerald-500" },
          common
        ];
      default: return [];
    }
  };

  const stats = getStatsByRole();

  return (
    <div className="space-y-10">
      
      {/* HEADER : STYLE ÉLITE FRANÇAIS */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 px-1">
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-[1px] w-8 bg-emerald-500/50"></span>
          
          </div>
          <h1 className="text-5xl md:text-6xl font-display italic tracking-tighter leading-none text-white uppercase">
            Vue <span className="text-emerald-500">d'ensemble</span>
          </h1>
          <p className="font-tech text-white/20 text-[9px] md:text-[10px] uppercase tracking-[0.3em] italic">
            Surveillance des flux <span className="text-emerald-500/40">@{profile?.role}</span>
          </p>
        </div>
        
        {/* STATUT SYSTÈME */}
        <div className="px-6 py-3 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center gap-4 shadow-2xl backdrop-blur-md">
          <div className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-20"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_10px_#10b981]"></span>
          </div>
          <div className="flex flex-col">
            <span className="font-tech text-[8px] text-white/30 uppercase tracking-widest">Statut_Serveur</span>
            <span className="font-tech text-[10px] text-white font-bold uppercase tracking-widest">En_Ligne_Stable</span>
          </div>
        </div>
      </div>

      {/* GRILLE DE STATISTIQUES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="bg-[#080808] border-white/5 p-7 group hover:border-emerald-500/20 hover:bg-white/[0.03] transition-all duration-700 cursor-default rounded-[2rem] overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            
            <div className="flex flex-col justify-between h-full relative z-10 gap-6">
              <div className="flex justify-between items-start">
                <div className={cn("p-3 rounded-xl bg-white/[0.03] border border-white/5 transition-all duration-500 group-hover:bg-emerald-500 group-hover:text-black", stat.color)}>
                  <stat.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-white/10 group-hover:text-emerald-500 transition-all group-hover:translate-x-1 group-hover:-translate-y-1" />
              </div>

              <div className="space-y-1">
                <p className="font-tech text-[9px] font-bold uppercase tracking-[0.2em] text-white/20 group-hover:text-emerald-500/60 transition-colors">
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

      {/* ZONE DE VISUALISATION PRINCIPALE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* MONITEUR DE DONNÉES */}
        <Card className="lg:col-span-2 bg-[#080808] border-white/5 p-10 relative overflow-hidden h-[520px] group rounded-[3rem]">
           <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(rgba(16,185,129,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.3)_1px,transparent_1px)] bg-[size:50px_50px]" />
           
           <div className="flex justify-between items-center mb-12 relative z-10">
              <div className="flex flex-col gap-1">
                <h3 className="font-tech font-black uppercase text-[10px] tracking-[0.5em] text-emerald-500/60">Activité_Réseau_Live</h3>
                <span className="font-tech text-[8px] text-white/10 uppercase">Sync_Tampon: OK</span>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 4].map(b => <div key={b} className="w-1.5 h-1.5 bg-emerald-500/20 rounded-full" />)}
              </div>
           </div>

           <div className="h-full flex flex-col items-center justify-center relative z-10">
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] select-none group-hover:opacity-[0.05] transition-opacity duration-1000">
                 <Cpu className="w-80 h-80 text-emerald-500 rotate-45" />
              </div>
              <h2 className="font-display text-white/[0.03] text-6xl md:text-8xl italic uppercase tracking-tighter select-none transition-all duration-1000 group-hover:text-emerald-500/[0.07] group-hover:scale-105 text-center">
                AGRI_CONNECT<br/>VISUALISEUR
              </h2>
              <div className="mt-8 px-6 py-2 border border-emerald-500/20 rounded-full bg-emerald-500/5 backdrop-blur-sm">
                <span className="font-tech text-[9px] font-black text-emerald-500 uppercase tracking-[0.6em] animate-pulse">Flux_Données_Sync...</span>
              </div>
           </div>
        </Card>

        {/* ACTIONS DE NAVIGATION */}
        <div className="flex flex-col gap-6">
          <Card className="bg-[#080808] border-white/5 p-10 rounded-[2.5rem] border-b-4 border-b-emerald-500 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Package className="w-20 h-20 text-white" />
            </div>
            <h3 className="font-tech font-black uppercase text-[11px] tracking-[0.3em] mb-10 text-white italic">Opérations_Rapides</h3>
            <div className="space-y-5 relative z-10">
                <button className="w-full py-5 bg-emerald-500 text-black font-display italic text-[12px] tracking-widest rounded-2xl hover:bg-emerald-400 hover:shadow-[0_20px_40px_rgba(16,185,129,0.3)] transition-all duration-300 active:scale-95 uppercase">
                  {profile?.role === 'vendeur' ? 'Publier_Stock' : 'Passer_Commande'}
                </button>
                <button className="w-full py-5 bg-white/[0.03] border border-white/10 text-white/50 font-tech font-bold uppercase italic text-[10px] tracking-[0.3em] rounded-2xl hover:bg-white/[0.08] hover:text-white transition-all duration-300">
                  Exporter_Logs.PDF
                </button>
            </div>
          </Card>

          {/* CONSEILLER IA */}
          <Card className="bg-emerald-500/[0.02] border border-emerald-500/10 p-8 rounded-[2.5rem] relative overflow-hidden group flex-1">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
            <div className="flex items-center gap-4 text-emerald-500 mb-6">
              <div className="p-2.5 bg-emerald-500/10 rounded-xl">
                <Activity className="w-4 h-4" />
              </div>
              <span className="font-tech text-[10px] font-black uppercase tracking-[0.4em]">Predictif_IA_Noeud</span>
            </div>
            <p className="font-sans text-[13px] font-medium text-white/40 leading-relaxed italic group-hover:text-white/70 transition-colors duration-500">
              "L'analyse des marchés à <span className="text-emerald-500/60 font-tech">BUNIA_EST</span> montre une volatilité de 12.5%. Il est recommandé d'optimiser les routes logistiques avant la fin du cycle actuel."
            </p>
          </Card>
        </div>
      </div>

    </div>
  );
}