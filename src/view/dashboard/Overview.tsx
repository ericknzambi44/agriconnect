// src/pages/dashboard/Overview.tsx
import React from 'react';
import { Card } from "@/components/ui/card";
import { 
  TrendingUp, Users, Package, DollarSign, 
  Leaf, Truck, ShoppingCart, Activity 
} from "lucide-react";
import { useAuthSession } from '@/features/auth/hooks/use-auth-session';

export default function DashboardOverview() {
  const { profile } = useAuthSession();

  // 1. Configuration des stats selon le rôle
  const getStatsByRole = () => {
    const common = { label: "Performance", val: "98%", icon: Activity, color: "text-blue-400" };
    
    switch (profile?.role) {
      case 'vendeur':
        return [
          { label: "Ventes Totales", val: "1,240 $", icon: DollarSign, color: "text-primary" },
          { label: "Stocks Récoltés", val: "450 Kg", icon: Leaf, color: "text-active-green" },
          { label: "Commandes Reçues", val: "24", icon: Package, color: "text-accent" },
          common
        ];
      case 'acheteur':
        return [
          { label: "Dépenses", val: "850 $", icon: DollarSign, color: "text-red-400" },
          { label: "Produits Suivis", val: "12", icon: ShoppingCart, color: "text-primary" },
          { label: "Livraisons", val: "5", icon: Truck, color: "text-accent" },
          common
        ];
      case 'transporteur':
        return [
          { label: "Revenus Course", val: "320 $", icon: DollarSign, color: "text-primary" },
          { label: "Kilométrage", val: "1,200 Km", icon: TrendingUp, color: "text-blue-500" },
          { label: "Missions", val: "14", icon: Truck, color: "text-accent" },
          common
        ];
      default:
        return [];
    }
  };

  const stats = getStatsByRole();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      
      {/* HEADER DYNAMIQUE */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black uppercase italic text-glow-green tracking-tighter leading-none">
            Console de <span className="text-primary">Contrôle</span>
          </h1>
          <p className="text-foreground/40 font-bold uppercase tracking-[0.3em] text-[10px] mt-2">
            Analyse des flux <span className="text-accent/60">{profile?.role}</span> en temps réel
          </p>
        </div>
        
        {/* Badge de statut système */}
        <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-full flex items-center gap-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_8px_var(--color-primary)]"></div>
          <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Système Actif</span>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="bg-glass-agri border-white/5 p-6 group hover:border-primary/30 hover:bg-white/[0.03] transition-all duration-500 cursor-default">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30 group-hover:text-foreground/50 transition-colors">
                  {stat.label}
                </p>
                <p className="text-3xl font-black italic tracking-tighter group-hover:scale-105 transition-transform origin-left">
                  {stat.val}
                </p>
              </div>
              <div className={`p-3 rounded-2xl bg-white/5 border border-white/5 ${stat.color} group-hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] transition-all`}>
                <stat.icon className="w-6 h-6 group-hover:rotate-12 transition-transform" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* SECTION CENTRALE : Graphiques & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* GRAPHIQUE (Placeholder stylisé) */}
        <Card className="lg:col-span-2 bg-glass-agri border-white/5 p-8 relative overflow-hidden h-[450px] group">
           <div className="flex justify-between items-center mb-8">
              <h3 className="font-black uppercase text-[10px] tracking-[0.3em] text-foreground/40">Activité Hebdomadaire</h3>
              <div className="flex gap-2">
                <div className="w-8 h-1 bg-primary rounded-full"></div>
                <div className="w-8 h-1 bg-white/10 rounded-full"></div>
              </div>
           </div>
           
           {/* Effet visuel de grille en fond */}
           <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
           </div>

           <div className="h-full flex items-center justify-center">
              <p className="text-foreground/10 font-black uppercase tracking-tighter text-5xl italic select-none group-hover:scale-110 transition-transform duration-1000">
                Data_Visualizer_v1
              </p>
           </div>
        </Card>

        {/* ACTIONS RAPIDES */}
        <div className="space-y-6">
          <Card className="bg-glass-agri border-white/5 p-6 border-l-2 border-l-primary/50">
            <h3 className="font-black uppercase text-[10px] tracking-[0.2em] mb-6 text-primary">Actions Prioritaires</h3>
            <div className="space-y-3">
               <button className="btn-elite w-full py-4 text-[10px] shadow-[0_10px_20px_rgba(34,197,94,0.15)]">
                 {profile?.role === 'vendeur' ? 'Enregistrer Récolte' : 'Passer Commande'}
               </button>
               <button className="w-full py-4 bg-white/5 border border-white/5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 hover:border-white/20 transition-all active:scale-95">
                 Générer Rapport PDF
               </button>
            </div>
          </Card>

          {/* PETIT WIDGET INFO */}
          <Card className="bg-accent/5 border-accent/20 p-6">
            <div className="flex items-center gap-3 text-accent mb-2">
              <Package className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Conseil IA</span>
            </div>
            <p className="text-[11px] font-bold text-foreground/60 leading-relaxed italic">
              "Le prix du Maïs est en hausse de 12% à Bunia. C'est peut-être le moment de vendre vos stocks."
            </p>
          </Card>
        </div>
      </div>

    </div>
  );
}