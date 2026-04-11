// src/pages/dashboard/Overview.tsx
import React from 'react';
import { Card } from "@/components/ui/card";
import { 
  TrendingUp, Users, Package, DollarSign, 
  Leaf, Truck, ShoppingCart, Activity, ArrowUpRight 
} from "lucide-react";
import { useAuthSession } from '@/features/auth/hooks/use-auth-session';

export default function DashboardOverview() {
  const { profile } = useAuthSession();

  // 1. Configuration des stats selon le rôle - Unifié sur l'Émeraude
  const getStatsByRole = () => {
    const common = { label: "Performance", val: "98%", icon: Activity, color: "text-emerald-500" };
    
    switch (profile?.role) {
      case 'vendeur':
        return [
          { label: "Ventes Totales", val: "1,240 $", icon: DollarSign, color: "text-emerald-500" },
          { label: "Stocks Récoltés", val: "450 Kg", icon: Leaf, color: "text-emerald-500" },
          { label: "Commandes Reçues", val: "24", icon: Package, color: "text-emerald-500" },
          common
        ];
      case 'acheteur':
        return [
          { label: "Dépenses", val: "850 $", icon: DollarSign, color: "text-emerald-500" },
          { label: "Produits Suivis", val: "12", icon: ShoppingCart, color: "text-emerald-500" },
          { label: "Livraisons", val: "5", icon: Truck, color: "text-emerald-500" },
          common
        ];
      case 'transporteur':
        return [
          { label: "Revenus Course", val: "320 $", icon: DollarSign, color: "text-emerald-500" },
          { label: "Kilométrage", val: "1,200 Km", icon: TrendingUp, color: "text-emerald-500" },
          { label: "Missions", val: "14", icon: Truck, color: "text-emerald-500" },
          common
        ];
      default:
        return [];
    }
  };

  const stats = getStatsByRole();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      
      {/* HEADER DYNAMIQUE */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1">
        <div>
          <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter leading-none text-white">
            Console de <span className="text-emerald-500">Contrôle</span>
          </h1>
          <p className="text-white/20 font-black uppercase tracking-[0.4em] text-[9px] md:text-[10px] mt-3 italic">
            Analyse des flux <span className="text-emerald-500/60">{profile?.role}</span> en temps réel
          </p>
        </div>
        
        {/* Badge de statut système */}
        <div className="px-5 py-2.5 bg-[#050505] border border-white/5 rounded-2xl flex items-center gap-3 shadow-xl">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></div>
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Système Actif</span>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="bg-[#050505] border-white/5 p-6 group hover:border-emerald-500/30 hover:bg-white/[0.02] transition-all duration-500 cursor-default rounded-[2rem] overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="flex justify-between items-start relative z-10">
              <div className="space-y-3">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 group-hover:text-emerald-500/50 transition-colors">
                  {stat.label}
                </p>
                <div className="flex items-baseline gap-1">
                  <p className="text-3xl font-black italic tracking-tighter text-white group-hover:scale-105 transition-transform origin-left duration-500">
                    {stat.val}
                  </p>
                  <ArrowUpRight className="w-3 h-3 text-emerald-500 opacity-0 group-hover:opacity-100 transition-all translate-y-1 group-hover:translate-y-0" />
                </div>
              </div>
              <div className={`p-4 rounded-[1.25rem] bg-white/[0.03] border border-white/5 ${stat.color} group-hover:bg-emerald-500 group-hover:text-black transition-all duration-500`}>
                <stat.icon className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* SECTION CENTRALE : Graphiques & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* GRAPHIQUE (Interface de Visualisation) */}
        <Card className="lg:col-span-2 bg-[#050505] border-white/5 p-8 relative overflow-hidden h-[480px] group rounded-[2.5rem]">
           <div className="flex justify-between items-center mb-8 relative z-10">
              <h3 className="font-black uppercase text-[9px] tracking-[0.4em] text-white/30">Activité_Réseau_Hebdo</h3>
              <div className="flex gap-3">
                <div className="w-10 h-1 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                <div className="w-10 h-1 bg-white/5 rounded-full"></div>
              </div>
           </div>
           
           {/* Grille de fond style Terminal */}
           <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
                style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
           </div>

           <div className="h-full flex flex-col items-center justify-center relative z-10">
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] select-none">
                 <Activity className="w-64 h-64 text-emerald-500" />
              </div>
              <p className="text-white/[0.05] font-black uppercase tracking-tighter text-5xl md:text-6xl italic select-none group-hover:text-emerald-500/[0.08] transition-all duration-1000">
                AgriConnect visualisation
              </p>
              <div className="mt-4 px-4 py-1.5 border border-emerald-500/20 rounded-full">
                <span className="text-[8px] font-black text-emerald-500/40 uppercase tracking-[0.5em]">Mode Simulation Actif</span>
              </div>
           </div>
        </Card>

        {/* ACTIONS RAPIDES */}
        <div className="space-y-6">
          <Card className="bg-[#050505] border-white/5 p-8 rounded-[2rem] border-t-2 border-t-emerald-500/40 shadow-2xl">
            <h3 className="font-black uppercase text-[10px] tracking-[0.3em] mb-8 text-emerald-500/60 italic text-center">Actions_Prioritaires</h3>
            <div className="space-y-4">
               <button className="w-full py-5 bg-emerald-500 text-black font-black uppercase italic text-[10px] tracking-[0.2em] rounded-2xl hover:bg-emerald-400 hover:shadow-[0_15px_30px_rgba(16,185,129,0.25)] transition-all duration-300 active:scale-[0.98]">
                 {profile?.role === 'vendeur' ? 'Enregistrer Récolte' : 'Passer Commande'}
               </button>
               <button className="w-full py-5 bg-white/[0.03] border border-white/5 text-white/60 font-black uppercase italic text-[10px] tracking-[0.2em] rounded-2xl hover:bg-white/[0.06] hover:text-white transition-all duration-300">
                 Générer Rapport PDF
               </button>
            </div>
          </Card>

          {/* CONSEIL IA - Style Cyber */}
          <Card className="bg-emerald-500/[0.03] border border-emerald-500/10 p-8 rounded-[2rem] relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-emerald-500/10 blur-3xl rounded-full" />
            <div className="flex items-center gap-3 text-emerald-500 mb-4 relative z-10">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <Package className="w-4 h-4 animate-bounce" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">IA_Intelligence</span>
            </div>
            <p className="text-[12px] font-bold text-white/50 leading-relaxed italic relative z-10 group-hover:text-white/80 transition-colors">
              "Le prix du Maïs est en hausse de 12% à Bunia. Analyse prédictive suggère de liquider vos stocks avant mardi."
            </p>
          </Card>
        </div>
      </div>

    </div>
  );
}