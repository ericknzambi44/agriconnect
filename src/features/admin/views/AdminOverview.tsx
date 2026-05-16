// features/admin/views/AdminOverview.tsx
import React from 'react';
import { useAdminStats } from '../hooks/use-admin-stats';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Building2, Package, Truck, DollarSign, ShieldCheck, TrendingUp, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

const StatCard = ({ title, value, icon, color }: any) => (
  <Card className="bg-gradient-to-b from-white/[0.02] to-black/40 border border-white/10 backdrop-blur-sm hover:border-primary/50 transition-all">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-tech font-black uppercase tracking-wider text-white/60">{title}</CardTitle>
      <div className={cn("p-2 rounded-full bg-gradient-to-br", color)}>{icon}</div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl md:text-3xl font-display font-black italic text-white">{value}</div>
    </CardContent>
  </Card>
);

export default function AdminOverview() {
  const { stats, loading } = useAdminStats();

  if (loading) return <div className="flex justify-center py-20"><Activity className="animate-spin text-primary" /></div>;

  const cards = [
    { title: "Utilisateurs", value: stats.usersCount, icon: <Users size={20} className="text-white" />, color: "from-primary to-orange-400" },
    { title: "Agences", value: stats.agenciesCount, icon: <Building2 size={20} className="text-white" />, color: "from-emerald-500 to-emerald-700" },
    { title: "Expéditions actives", value: stats.activeExpeditions, icon: <Truck size={20} className="text-white" />, color: "from-blue-500 to-blue-700" },
    { title: "Commandes", value: stats.commandesCount, icon: <Package size={20} className="text-white" />, color: "from-purple-500 to-purple-700" },
    { title: "Produits", value: stats.produitsCount, icon: <TrendingUp size={20} className="text-white" />, color: "from-yellow-500 to-yellow-700" },
    { title: "Volume total (USD)", value: `${stats.totalVolume.toFixed(2)} $`, icon: <DollarSign size={20} className="text-white" />, color: "from-green-500 to-green-700" },
    { title: "Sous séquestre (USD)", value: `${stats.totalSequestre.toFixed(2)} $`, icon: <ShieldCheck size={20} className="text-white" />, color: "from-red-500 to-red-700" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-display font-black italic uppercase tracking-tighter bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
          Tableau de bord
        </h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((card, i) => <StatCard key={i} {...card} />)}
      </div>
    </div>
  );
}