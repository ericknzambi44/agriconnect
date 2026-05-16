// features/admin/views/AdminExpeditions.tsx
import React, { useState } from 'react';
import { useAdminExpeditions } from '../hooks/use-admin-expeditions';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Package, Truck, CheckCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const statusConfig = {
  A_DEPOSER: { label: 'À déposer', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  EN_TRANSIT: { label: 'En transit', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  LIVREE: { label: 'Livrée', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
};

export default function AdminExpeditions() {
  const { expeditions, loading, filter, setFilter } = useAdminExpeditions();
  const [search, setSearch] = useState('');

  const filtered = expeditions.filter(exp => 
    exp.code_depot?.includes(search) || 
    exp.code_retrait?.includes(search) ||
    exp.commande?.annonce?.produit?.nom_prod?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-display font-black italic uppercase tracking-tighter bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
        Expéditions
      </h1>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <Input placeholder="Rechercher par code ou produit..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 bg-white/5 border-white/10" />
        </div>
        <Select value={filter.statut} onValueChange={(v) => setFilter({ ...filter, statut: v })}>
          <SelectTrigger className="w-[180px] bg-white/5 border-white/10"><SelectValue placeholder="Statut" /></SelectTrigger>
          <SelectContent className="bg-black border-white/10">
            <SelectItem value="tous">Tous</SelectItem>
            <SelectItem value="A_DEPOSER">À déposer</SelectItem>
            <SelectItem value="EN_TRANSIT">En transit</SelectItem>
            <SelectItem value="LIVREE">Livrée</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filtered.map(exp => (
          <Card key={exp.id} className="bg-black/40 border-white/10 hover:border-primary/50 transition-all">
            <CardContent className="p-5 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] text-white/50 font-tech">Expédition #{exp.id.slice(0,8)}</p>
                  <p className="text-white font-bold italic">{exp.commande?.annonce?.produit?.nom_prod || 'Produit inconnu'}</p>
                </div>
                <Badge className={cn(statusConfig[exp.statut_expedition as keyof typeof statusConfig]?.color || 'bg-white/10')}>
                  {statusConfig[exp.statut_expedition as keyof typeof statusConfig]?.label || exp.statut_expedition}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div><span className="text-white/40">Code dépôt:</span> <span className="text-primary">{exp.code_depot}</span></div>
                <div><span className="text-white/40">Code retrait:</span> <span className="text-emerald-400">{exp.code_retrait}</span></div>
                <div><span className="text-white/40">Quantité:</span> {exp.commande?.quantite_commandee}</div>
                <div><span className="text-white/40">Montant:</span> {exp.commande?.prix_total_commande} USD</div>
              </div>
              <div className="pt-2 border-t border-white/10 flex justify-between text-[9px] text-white/40">
                <span>Vendeur: {exp.commande?.annonce?.vendeur?.nom} {exp.commande?.annonce?.vendeur?.prenom}</span>
                <span>Acheteur: {exp.commande?.acheteur?.nom} {exp.commande?.acheteur?.prenom}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}