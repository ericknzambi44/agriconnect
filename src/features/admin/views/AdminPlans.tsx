// features/admin/views/AdminPlans.tsx
import React, { useState } from 'react';
import { useAdminPlans } from '../hooks/use-admin-plans';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AdminPlans() {
  const { plans, loading, createPlan, updatePlan, deletePlan } = useAdminPlans();
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ 
    code_plan: '', 
    nom: '', 
    prix: 0, 
    duree_jour: 30, 
    avantages: [] as string[] 
  });
  const [newAvantage, setNewAvantage] = useState('');

  const addAvantage = () => {
    if (newAvantage.trim() && !form.avantages.includes(newAvantage.trim())) {
      setForm({ ...form, avantages: [...form.avantages, newAvantage.trim()] });
      setNewAvantage('');
    }
  };

  const removeAvantage = (index: number) => {
    setForm({ ...form, avantages: form.avantages.filter((_, i) => i !== index) });
  };

  const filtered = plans.filter(p => 
    p.nom?.toLowerCase().includes(search.toLowerCase()) || 
    p.code_plan?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async () => {
    if (editing) {
      await updatePlan(editing.id_plans, form);
    } else {
      await createPlan(form);
    }
    setOpen(false);
    setEditing(null);
    setForm({ code_plan: '', nom: '', prix: 0, duree_jour: 30, avantages: [] });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-display font-black italic uppercase tracking-tighter bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
          Plans d'abonnement
        </h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-primary to-orange-400 text-black shadow-lg shadow-primary/30">
              <Plus className="w-4 h-4 mr-2" /> Nouveau plan
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gradient-to-b from-black/90 to-[#0a0a0a] border border-white/10 text-white rounded-2xl max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-white font-display">
                {editing ? 'Modifier' : 'Créer'} un plan
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-tech text-white/50 uppercase tracking-wider">Code plan</label>
                  <Input 
                    placeholder="Ex: PLAN_AGENCE_PRO" 
                    value={form.code_plan} 
                    onChange={e => setForm({...form, code_plan: e.target.value})} 
                    className="bg-white/5 border-white/10 mt-1" 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-tech text-white/50 uppercase tracking-wider">Nom</label>
                  <Input 
                    placeholder="Nom du plan" 
                    value={form.nom} 
                    onChange={e => setForm({...form, nom: e.target.value})} 
                    className="bg-white/5 border-white/10 mt-1" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-tech text-white/50 uppercase tracking-wider">Prix (USD)</label>
                  <Input 
                    type="number" 
                    placeholder="0.00" 
                    value={form.prix} 
                    onChange={e => setForm({...form, prix: parseFloat(e.target.value) || 0})} 
                    className="bg-white/5 border-white/10 mt-1" 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-tech text-white/50 uppercase tracking-wider">Durée (jours)</label>
                  <Input 
                    type="number" 
                    placeholder="30" 
                    value={form.duree_jour} 
                    onChange={e => setForm({...form, duree_jour: parseInt(e.target.value) || 30})} 
                    className="bg-white/5 border-white/10 mt-1" 
                  />
                </div>
              </div>

              {/* Avantages */}
              <div>
                <label className="text-[10px] font-tech text-white/50 uppercase tracking-wider mb-2 block">Avantages</label>
                <div className="flex gap-2 mb-3">
                  <Input 
                    placeholder="Ajouter un avantage (ex: Livraison rapide)" 
                    value={newAvantage} 
                    onChange={e => setNewAvantage(e.target.value)} 
                    className="bg-white/5 border-white/10 flex-1"
                    onKeyDown={(e) => e.key === 'Enter' && addAvantage()}
                  />
                  <Button type="button" onClick={addAvantage} size="sm" className="bg-primary/20 text-primary hover:bg-primary hover:text-black">
                    <Plus size={16} />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.avantages.map((av, idx) => (
                    <Badge key={idx} variant="secondary" className="bg-primary/10 text-primary border border-primary/30 px-3 py-1.5 gap-2">
                      {av}
                      <button onClick={() => removeAvantage(idx)} className="hover:text-red-400 transition">
                        <X size={12} />
                      </button>
                    </Badge>
                  ))}
                  {form.avantages.length === 0 && (
                    <span className="text-white/30 text-[10px] italic">Aucun avantage</span>
                  )}
                </div>
              </div>

              <Button onClick={handleSubmit} className="w-full bg-gradient-to-r from-primary to-orange-400 text-black mt-4">
                {editing ? 'Mettre à jour' : 'Créer'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
        <Input 
          placeholder="Rechercher par nom ou code..." 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
          className="pl-9 bg-white/5 border-white/10" 
        />
      </div>

      <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="text-white font-tech">Code</TableHead>
                  <TableHead className="text-white font-tech">Nom</TableHead>
                  <TableHead className="text-white font-tech">Prix (USD)</TableHead>
                  <TableHead className="text-white font-tech">Durée (jours)</TableHead>
                  <TableHead className="text-white font-tech">Avantages</TableHead>
                  <TableHead className="text-white font-tech">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(plan => {
                  const avantages = plan.avantages ?? [];
                  return (
                    <TableRow key={plan.id_plans} className="border-white/10 hover:bg-white/5">
                      <TableCell className="text-white/80 font-mono text-xs">{plan.code_plan}</TableCell>
                      <TableCell className="text-white/80 font-bold">{plan.nom}</TableCell>
                      <TableCell className="text-white/80">{plan.prix} $</TableCell>
                      <TableCell className="text-white/80">{plan.duree_jour}</TableCell>
                      <TableCell className="text-white/80">
                        <div className="flex flex-wrap gap-1">
                          {avantages.slice(0, 2).map((av: string, i: number) => (
                            <Badge key={i} variant="outline" className="bg-primary/5 text-primary border-primary/20 text-[8px] px-1.5">
                              {av.length > 20 ? av.slice(0, 20) + '…' : av}
                            </Badge>
                          ))}
                          {avantages.length > 2 && (
                            <span className="text-[8px] text-white/40">+{avantages.length - 2}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => { 
                              setEditing(plan); 
                              setForm({ 
                                code_plan: plan.code_plan, 
                                nom: plan.nom, 
                                prix: plan.prix, 
                                duree_jour: plan.duree_jour, 
                                avantages: plan.avantages || [] 
                              }); 
                              setOpen(true); 
                            }} 
                            className="text-primary hover:scale-110 transition"
                          >
                            <Edit size={18} />
                          </button>
                          <button 
                            onClick={() => { 
                              if(confirm('Supprimer définitivement ce plan ?')) deletePlan(plan.id_plans); 
                            }} 
                            className="text-red-400 hover:scale-110 transition"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-white/40 py-8">
                      Aucun plan trouvé
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
