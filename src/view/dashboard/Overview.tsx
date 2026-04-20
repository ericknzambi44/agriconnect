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
    const common = { label: "SANTÉ_SYSTÈME", val: "98.2%", icon: Activity, color: "text-primary" };
    
    switch (profile?.role) {
      case 'vendeur':
        return [
          { label: "REVENU_TOTAL", val: "1.240,00 $", icon: DollarSign, color: "text-primary" },
          { label: "VOLUME_STOCK", val: "450 KG", icon: Leaf, color: "text-primary" },
          { label: "COMMANDES_ATTENTE", val: "24", icon: Package, color: "text-primary" },
          common
        ];
      case 'acheteur':
        return [
          { label: "TOTAL_DÉPENSES", val: "850,50 $", icon: DollarSign, color: "text-primary" },
          { label: "LISTE_SUIVI", val: "12 PRODUITS", icon: ShoppingCart, color: "text-primary" },
          { label: "EN_TRANSIT", val: "05", icon: Truck, color: "text-primary" },
          common
        ];
      case 'transporteur':
        return [
          { label: "GAINS_FLOTTE", val: "320,00 $", icon: DollarSign, color: "text-primary" },
          { label: "LOG_DISTANCE", val: "1.200 KM", icon: TrendingUp, color: "text-primary" },
          { label: "MISSIONS_ACTIVES", val: "14", icon: Truck, color: "text-primary" },
          common
        ];
      default: return [];
    }
  };

  const stats = getStatsByRole();

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
      
      {/* HEADER : NET ET PRÉCIS */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3 mb-1">
            <div className="h-[2px] w-10 bg-primary" />
            <span className="font-tech text-[10px] tracking-[0.5em] text-primary uppercase font-bold">Terminal_Principal</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-display italic tracking-tighter leading-none text-foreground uppercase">
            Vue <span className="text-primary">d'ensemble</span>
          </h1>
          
          <p className="font-tech text-muted-foreground/80 text-[10px] md:text-[11px] uppercase tracking-[0.2em] flex items-center gap-2">
            Sector_Bunia <span className="text-primary">/</span> Node_ID: <span className="text-foreground">@{profile?.role}</span>
          </p>
        </div>
        
        {/* STATUT SYSTÈME : SANS FLOU, HAUTE VISIBILITÉ */}
        <div className="px-6 py-4 bg-secondary border-2 border-primary/20 rounded-xl flex items-center gap-5 shadow-lg">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-40"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-success border border-white/20"></span>
          </div>
          <div className="flex flex-col">
            <span className="font-tech text-[9px] text-muted-foreground uppercase tracking-widest font-bold">Statut_Serveur</span>
            <span className="font-tech text-[11px] text-foreground font-black uppercase tracking-widest">Opérationnel_Stable</span>
          </div>
        </div>
      </div>

      {/* GRILLE DE STATISTIQUES : CARTES NETTES AVEC BORDURES FORTES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, i) => (
          <Card key={i} className="group relative overflow-hidden border-2 border-border bg-secondary p-8 transition-all duration-300 hover:border-primary/50 hover:bg-secondary/80 rounded-2xl">
            <div className="flex flex-col justify-between h-full relative z-10 gap-8">
              <div className="flex justify-between items-start">
                <div className={cn("p-4 rounded-lg bg-background border border-border group-hover:border-primary/30 transition-colors", stat.color)}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-all" />
              </div>

              <div className="space-y-1">
                <p className="font-tech text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
                  {stat.label}
                </p>
                <p className="font-tech text-4xl font-black italic tracking-tighter text-foreground">
                  {stat.val}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* ZONE DE VISUALISATION : FINI LE "FUMÉ", PLACE À LA STRUCTURE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* MONITEUR DE DONNÉES : GRILLE TECHNIQUE CLAIRE */}
        <Card className="lg:col-span-2 relative overflow-hidden h-[500px] border-2 border-border bg-secondary rounded-[2rem] group">
           {/* Grille plus visible et nette */}
           <div className="absolute inset-0 opacity-[0.08] pointer-events-none bg-[linear-gradient(var(--color-border)_1px,transparent_1px),linear-gradient(90deg,var(--color-border)_1px,transparent_1px)] bg-[size:40px_40px]" />
           
           <div className="flex justify-between items-center p-10 relative z-10">
              <div className="flex flex-col gap-1">
                <h3 className="font-tech font-black uppercase text-[12px] tracking-[0.4em] text-primary">Monitoring_Direct</h3>
                <span className="font-tech text-[9px] text-muted-foreground font-bold uppercase">Source: AgriConnect_Core</span>
              </div>
              <div className="px-4 py-1 border border-primary/30 rounded-md bg-primary/5">
                <span className="font-tech text-[10px] text-primary animate-pulse">SYNC_LIVE</span>
              </div>
           </div>

           <div className="h-full flex flex-col items-center justify-center relative z-10 pb-20">
              {/* Icône nette sans blur excessif */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] transition-all duration-700 group-hover:scale-110">
                 <Cpu className="w-[400px] h-[400px] text-primary" />
              </div>
              
              <h2 className="font-display text-foreground text-5xl md:text-7xl italic uppercase tracking-tighter text-center leading-[0.85]">
                Agri_Connect<br/><span className="text-primary/80">Visualiseur</span>
              </h2>

              <div className="mt-10 px-8 py-3 border-2 border-primary bg-primary text-primary-foreground font-tech text-[11px] font-black uppercase tracking-[0.5em]">
                Analyse_Faisceau_OK
              </div>
           </div>
        </Card>

        {/* ACTIONS & IA : CONTRASTE MAXIMUM */}
        <div className="flex flex-col gap-6">
          <Card className="border-2 border-border bg-secondary p-10 rounded-[2rem] flex flex-col justify-center relative overflow-hidden">
            <h3 className="font-tech font-black uppercase text-[12px] tracking-[0.3em] mb-8 text-primary border-l-4 border-primary pl-4">
              Commandes_Rapides
            </h3>
            
            <div className="space-y-4 relative z-10">
                <button className="btn-elite w-full text-[12px] py-6 shadow-none border-2 border-transparent hover:border-white/20">
                  {profile?.role === 'vendeur' ? 'PUBLIER_STOCK' : 'PASSER_COMMANDE'}
                </button>
                
                <button className="w-full py-5 bg-background border-2 border-border text-foreground font-tech font-bold uppercase text-[10px] tracking-[0.3em] rounded-2xl hover:border-primary/50 transition-all">
                  EXPORT_DATA_CSV
                </button>
            </div>
          </Card>

          {/* CONSEILLER IA : TEXTE LISIBLE ET CADRE NET */}
          <Card className="bg-background border-2 border-primary/20 p-8 rounded-[2rem] flex-1">
            <div className="flex items-center gap-3 text-primary mb-6">
              <Activity className="w-5 h-5" />
              <span className="font-tech text-[11px] font-black uppercase tracking-[0.4em]">Assistant_Predictif</span>
            </div>
            
            <div className="p-5 bg-secondary/50 border border-border rounded-xl">
              <p className="font-sans text-[14px] font-semibold text-foreground leading-relaxed italic">
                "Volatilité du marché <span className="text-primary font-tech text-[12px]">BUNIA_EST</span> détectée à <span className="text-primary font-bold">12.5%</span>. Ajustez vos prix de réserve."
              </p>
            </div>

            <div className="mt-6 space-y-2">
               <div className="h-[2px] w-full bg-border overflow-hidden">
                  <div className="h-full bg-primary w-2/3" />
               </div>
               <p className="font-tech text-[8px] text-muted-foreground uppercase tracking-widest text-right">Fiabilité_Analyse: 94%</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}