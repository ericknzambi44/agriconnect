// features/admin/views/AdminAgencies.tsx
import React, { useState } from 'react';
import { useAgencyManager } from '../hooks/use-agency-manager';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Building2, Edit, Trash2, Plus, Search, Users } from "lucide-react";
import { toast } from "sonner";

export default function AdminAgencies() {
  const { agencies, loading, createAgency, updateAgency, deleteAgency, refresh } = useAgencyManager();
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ nom: '', ville_territoire: '', telephone_responsable: '' });

  const filtered = agencies.filter(a => a.nom?.toLowerCase().includes(search.toLowerCase()) || a.ville_territoire?.toLowerCase().includes(search.toLowerCase()));

  const handleSubmit = async () => {
    if (editing) {
      await updateAgency(editing.id, form);
    } else {
      await createAgency(form);
    }
    setOpen(false);
    setEditing(null);
    setForm({ nom: '', ville_territoire: '', telephone_responsable: '' });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-display font-black italic uppercase tracking-tighter bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
          Agences
        </h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-primary to-orange-400 text-black"><Plus className="w-4 h-4 mr-2" /> Nouvelle agence</Button>
          </DialogTrigger>
          <DialogContent className="bg-black/90 border-white/10 text-white">
            <DialogHeader><DialogTitle>{editing ? 'Modifier' : 'Créer'} une agence</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <Input placeholder="Nom" value={form.nom} onChange={e => setForm({...form, nom: e.target.value})} className="bg-white/5 border-white/10" />
              <Input placeholder="Ville / Territoire" value={form.ville_territoire} onChange={e => setForm({...form, ville_territoire: e.target.value})} className="bg-white/5 border-white/10" />
              <Input placeholder="Téléphone responsable" value={form.telephone_responsable} onChange={e => setForm({...form, telephone_responsable: e.target.value})} className="bg-white/5 border-white/10" />
              <Button onClick={handleSubmit} className="w-full bg-primary text-black">Enregistrer</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
        <Input placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 bg-white/5 border-white/10" />
      </div>

      <Card className="bg-black/40 border-white/10">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead className="text-white">Nom</TableHead>
                <TableHead className="text-white">Ville</TableHead>
                <TableHead className="text-white">Téléphone</TableHead>
                <TableHead className="text-white">Agents</TableHead>
                <TableHead className="text-white">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(agency => (
                <TableRow key={agency.id} className="border-white/10">
                  <TableCell className="text-white/80">{agency.nom}</TableCell>
                  <TableCell className="text-white/80">{agency.ville_territoire}</TableCell>
                  <TableCell className="text-white/80">{agency.telephone_responsable || '-'}</TableCell>
                  <TableCell className="text-white/80">{agency.agents_count?.[0]?.count || 0}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <button onClick={() => { setEditing(agency); setForm({ nom: agency.nom, ville_territoire: agency.ville_territoire, telephone_responsable: agency.telephone_responsable || '' }); setOpen(true); }} className="text-primary hover:scale-110"><Edit size={18} /></button>
                      <button onClick={() => { if(confirm('Supprimer ?')) deleteAgency(agency.id); }} className="text-red-400 hover:scale-110"><Trash2 size={18} /></button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}