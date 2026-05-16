// features/admin/views/AdminUsers.tsx
import React, { useState, useEffect } from 'react';
import { useAdminUserMaster } from '../hooks/use-admin-user-master';
import { useAgencyManager } from '../hooks/use-agency-manager';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Edit, Trash2, Link, Unlink, Search } from "lucide-react";
import { toast } from "sonner";

export default function AdminUsers() {
  const { users, roles, loading, fetchUsers, createUser, updateUser, deleteUser, linkUserToAgency, unlinkUserFromAgency } = useAdminUserMaster();
  const { agencies, refresh: fetchAgencies } = useAgencyManager();
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'link'>('create');
  const [formData, setFormData] = useState({ 
    nom: '', prenom: '', email: '', numero_tel: '', role_id: '',
    password: ''  // ✅ mot de passe pour la création
  });

  useEffect(() => {
    fetchUsers();
    fetchAgencies();
  }, []);

  const filteredUsers = users.filter(u => 
    u.nom?.toLowerCase().includes(search.toLowerCase()) ||
    u.prenom?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async () => {
    if (!formData.nom || !formData.prenom || !formData.email || !formData.password) {
      toast.error("Remplissez tous les champs obligatoires (dont mot de passe)");
      return;
    }
    await createUser(formData, formData.password);
    setOpenDialog(false);
    resetForm();
  };

  const handleUpdate = async () => {
    if (!selectedUser) return;
    await updateUser(selectedUser.id, formData);
    setOpenDialog(false);
    resetForm();
  };

  const handleLinkAgency = async (agenceId: string) => {
    if (!selectedUser) return;
    await linkUserToAgency(selectedUser.id, agenceId);
    setOpenDialog(false);
  };

  const handleUnlink = async (userId: string) => {
    await unlinkUserFromAgency(userId);
  };

  const resetForm = () => {
    setFormData({ nom: '', prenom: '', email: '', numero_tel: '', role_id: '', password: '' });
    setSelectedUser(null);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-display font-black italic uppercase tracking-tighter bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
          Utilisateurs
        </h1>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-primary to-orange-400 text-black shadow-lg shadow-primary/30">
              <UserPlus className="w-4 h-4 mr-2" /> Nouvel utilisateur
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gradient-to-b from-black/90 to-[#0a0a0a] border border-white/10 text-white rounded-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-white font-display">
                {dialogMode === 'create' && 'Créer un utilisateur'}
                {dialogMode === 'edit' && 'Modifier l\'utilisateur'}
                {dialogMode === 'link' && 'Lier à une agence'}
              </DialogTitle>
            </DialogHeader>
            {dialogMode === 'create' && (
              <div className="space-y-4">
                <Input placeholder="Nom" value={formData.nom} onChange={e => setFormData({...formData, nom: e.target.value})} className="bg-white/5 border-white/10" />
                <Input placeholder="Prénom" value={formData.prenom} onChange={e => setFormData({...formData, prenom: e.target.value})} className="bg-white/5 border-white/10" />
                <Input placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="bg-white/5 border-white/10" />
                <Input placeholder="Téléphone" value={formData.numero_tel} onChange={e => setFormData({...formData, numero_tel: e.target.value})} className="bg-white/5 border-white/10" />
                <Input type="password" placeholder="Mot de passe" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="bg-white/5 border-white/10" />
                <Select value={formData.role_id} onValueChange={v => setFormData({...formData, role_id: v})}>
                  <SelectTrigger className="bg-white/5 border-white/10"><SelectValue placeholder="Choisir un rôle" /></SelectTrigger>
                  <SelectContent className="bg-black border-white/10">
                    {roles.filter(r => r.id && r.id.trim() !== '').map(r => (
                      <SelectItem key={r.id} value={r.id}>{r.titre_role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleCreate} className="w-full bg-gradient-to-r from-primary to-orange-400 text-black">Créer</Button>
              </div>
            )}
            {dialogMode === 'edit' && (
              <div className="space-y-4">
                <Input placeholder="Nom" value={formData.nom} onChange={e => setFormData({...formData, nom: e.target.value})} className="bg-white/5 border-white/10" />
                <Input placeholder="Prénom" value={formData.prenom} onChange={e => setFormData({...formData, prenom: e.target.value})} className="bg-white/5 border-white/10" />
                <Input placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="bg-white/5 border-white/10" />
                <Input placeholder="Téléphone" value={formData.numero_tel} onChange={e => setFormData({...formData, numero_tel: e.target.value})} className="bg-white/5 border-white/10" />
                <Select value={formData.role_id} onValueChange={v => setFormData({...formData, role_id: v})}>
                  <SelectTrigger className="bg-white/5 border-white/10"><SelectValue placeholder="Choisir un rôle" /></SelectTrigger>
                  <SelectContent className="bg-black border-white/10">
                    {roles.filter(r => r.id && r.id.trim() !== '').map(r => (
                      <SelectItem key={r.id} value={r.id}>{r.titre_role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleUpdate} className="w-full bg-gradient-to-r from-primary to-orange-400 text-black">Mettre à jour</Button>
              </div>
            )}
            {dialogMode === 'link' && (
              <div className="space-y-4">
                <Select onValueChange={handleLinkAgency}>
                  <SelectTrigger className="bg-white/5 border-white/10"><SelectValue placeholder="Choisir une agence" /></SelectTrigger>
                  <SelectContent className="bg-black border-white/10">
                    {agencies.map(a => (
                      <SelectItem key={a.id} value={a.id}>{a.nom}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={() => setOpenDialog(false)}>Annuler</Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
        <Input placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 bg-white/5 border-white/10" />
      </div>

      <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10">
                  <TableHead className="text-white font-tech">Nom</TableHead>
                  <TableHead className="text-white font-tech">Prénom</TableHead>
                  <TableHead className="text-white font-tech">Email</TableHead>
                  <TableHead className="text-white font-tech">Téléphone</TableHead>
                  <TableHead className="text-white font-tech">Rôle</TableHead>
                  <TableHead className="text-white font-tech">Agence</TableHead>
                  <TableHead className="text-white font-tech">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map(user => (
                  <TableRow key={user.id} className="border-white/10 hover:bg-white/5">
                    <TableCell className="text-white/80">{user.nom}</TableCell>
                    <TableCell className="text-white/80">{user.prenom}</TableCell>
                    <TableCell className="text-white/80">{user.email}</TableCell>
                    <TableCell className="text-white/80">{user.numero_tel || '-'}</TableCell>
                    <TableCell><Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">{user.role?.admin_role || 'utilisateur'}</Badge></TableCell>
                    <TableCell className="text-white/80">
                      {user.agents_agence?.[0]?.agence?.nom || 'Aucune'}
                      {user.agents_agence?.[0]?.agence && (
                        <button onClick={() => handleUnlink(user.id)} className="ml-2 text-red-400 hover:text-red-300 transition"><Unlink size={14} /></button>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <button onClick={() => { 
                          setSelectedUser(user); 
                          const roleId = roles.find(r => r.titre_role === user.role?.admin_role)?.id || '';
                          setFormData({ 
                            nom: user.nom, 
                            prenom: user.prenom, 
                            email: user.email, 
                            numero_tel: user.numero_tel || '', 
                            role_id: roleId,
                            password: ''
                          }); 
                          setDialogMode('edit'); 
                          setOpenDialog(true); 
                        }} className="text-primary hover:scale-110 transition"><Edit size={18} /></button>
                        <button onClick={() => { if(confirm('Supprimer définitivement ?')) deleteUser(user.id); }} className="text-red-400 hover:scale-110 transition"><Trash2 size={18} /></button>
                        <button onClick={() => { setSelectedUser(user); setDialogMode('link'); setOpenDialog(true); }} className="text-emerald-400 hover:scale-110 transition"><Link size={18} /></button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}