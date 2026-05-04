// src/features/admin/components/UserControlList.tsx
import React, { useEffect, useState } from 'react';
import { useAdminUserMaster } from '../hooks/use-admin-user-master';

import { 
  Shield, 
  Link2, 
  Unlink, 
  UserPlus, 
  Mail, 
  User as UserIcon, 
  RefreshCcw,
  Search,
  Trash2,
  Edit3,
  X,
  Globe,
  Fingerprint,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from "@/lib/utils";
import { useAgencyManager } from '../hooks/use-agency-manager';

export default function UserControlList() {
  const { users, loading, fetchUsers, assignToAgency, createUser, deleteUser } = useAdminUserMaster();
  const { agencies } = useAgencyManager();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({ nom: '', prenom: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const loadingToast = toast.loading("Initialisation du profil ROOT...");
    try {
      await createUser(newUser);
      toast.success("Opérateur enregistré dans le système", { id: loadingToast });
      setNewUser({ nom: '', prenom: '', email: '' });
      setShowAddForm(false);
    } catch (error) {
      toast.error("Échec de l'encodage", { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Révoquer définitivement l'accès pour ${name} ?`)) return;
    const t = toast.loading("Purge des accès en cours...");
    try {
      await deleteUser(id);
      toast.success("Opérateur révoqué", { id: t });
    } catch (e) {
      toast.error("Violation d'intégrité système", { id: t });
    }
  };

  const handleAssignmentChange = async (userId: string, agenceId: string) => {
    const isUnassigning = agenceId === "";
    const updateToast = toast.loading(isUnassigning ? "Révocation du Node..." : "Liaison au Node...");
    try {
      await assignToAgency(userId, isUnassigning ? null : agenceId);
      toast.success(isUnassigning ? "Liaison rompue" : "Agent synchronisé au Node", { id: updateToast });
    } catch (e) {
      toast.error("Échec de la synchronisation", { id: updateToast });
    }
  };

  const filteredUsers = users.filter(u => 
    u.nom?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* --- BARRE DE COMMANDE HAUTE --- */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative group flex-1 max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="FILTRER_OPERATEURS_PAR_NOM_OU_MAIL..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0A0A0A] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-[10px] font-mono text-white focus:border-primary/40 focus:ring-1 focus:ring-primary/20 outline-none transition-all placeholder:text-white/10"
          />
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => fetchUsers()}
            className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl text-white/20 hover:text-primary hover:border-primary/20 transition-all active:scale-90"
            title="Rafraîchir la base"
          >
            <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
          
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className={cn(
              "flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95",
              showAddForm 
              ? 'bg-red-500/10 text-red-500 border border-red-500/20' 
              : 'bg-white text-black hover:bg-primary shadow-lg shadow-primary/5'
            )}
          >
            {showAddForm ? <X size={16}/> : <UserPlus size={16} />}
            {showAddForm ? 'ANNULER_ACTION' : 'NOUVEL_OPERATEUR'}
          </button>
        </div>
      </div>

      {/* --- FORMULAIRE D'ENCODAGE --- */}
      {showAddForm && (
        <div className="bg-[#0A0A0A] border border-primary/20 p-6 md:p-8 rounded-[2.5rem] shadow-[0_0_50px_rgba(var(--primary),0.05)] animate-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-3 mb-8">
            <Zap size={14} className="text-primary" />
            <h3 className="font-tech text-[10px] text-white/40 uppercase tracking-[0.4em]">Initialisation_Nouveau_Node_Humain</h3>
          </div>
          <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-[8px] font-mono font-black text-white/20 uppercase tracking-widest ml-1">Nom_Famille</label>
              <input required value={newUser.nom} onChange={e => setNewUser({...newUser, nom: e.target.value})}
                className="w-full bg-white/[0.02] border border-white/5 rounded-xl py-4 px-5 text-xs text-white focus:border-primary/40 outline-none transition-all" placeholder="Nom" />
            </div>
            <div className="space-y-2">
              <label className="text-[8px] font-mono font-black text-white/20 uppercase tracking-widest ml-1">Prénom_Usuel</label>
              <input required value={newUser.prenom} onChange={e => setNewUser({...newUser, prenom: e.target.value})}
                className="w-full bg-white/[0.02] border border-white/5 rounded-xl py-4 px-5 text-xs text-white focus:border-primary/40 outline-none transition-all" placeholder="Prénom" />
            </div>
            <div className="space-y-2 lg:col-span-1">
              <label className="text-[8px] font-mono font-black text-white/20 uppercase tracking-widest ml-1">Email_Securisé</label>
              <input required type="email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})}
                className="w-full bg-white/[0.02] border border-white/5 rounded-xl py-4 px-5 text-xs text-white focus:border-primary/40 outline-none transition-all" placeholder="email@agriconnect.com" />
            </div>
            <button disabled={isSubmitting} className="md:col-span-3 lg:col-span-1 h-[52px] self-end bg-primary text-black rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-[1.02] transition-all disabled:opacity-50">
              {isSubmitting ? 'ENCODAGE_EN_COURS...' : 'VALIDER_PROFIL_ROOT'}
            </button>
          </form>
        </div>
      )}

      {/* --- LISTE DES OPERATEURS --- */}
      <div className="grid grid-cols-1 gap-4 lg:block bg-transparent lg:bg-[#080808] lg:border lg:border-white/5 lg:rounded-[2.5rem] overflow-hidden">
        
        {/* Table Header (Desktop Only) */}
        <div className="hidden lg:grid grid-cols-12 bg-white/[0.02] p-6 border-b border-white/5">
          <div className="col-span-4 text-[9px] font-mono font-black text-white/20 uppercase tracking-[0.3em]">Operator_Identity</div>
          <div className="col-span-2 text-[9px] font-mono font-black text-white/20 uppercase tracking-[0.3em]">Access_Level</div>
          <div className="col-span-4 text-[9px] font-mono font-black text-white/20 uppercase tracking-[0.3em]">Node_Assignment</div>
          <div className="col-span-2 text-right text-[9px] font-mono font-black text-white/20 uppercase tracking-[0.3em]">Action_Control</div>
        </div>

        <div className="space-y-4 lg:space-y-0 lg:divide-y lg:divide-white/5">
          {filteredUsers.length === 0 ? (
            <div className="p-20 text-center text-white/10 font-mono text-[10px] uppercase tracking-widest">Aucune donnée trouvée sur ce segment</div>
          ) : filteredUsers.map((user) => {
            const currentAgency = user.agents_agence?.[0]?.agence;
            const currentAgencyId = currentAgency?.id || "";
            const roleData = user.role as any;
            const isAdmin = roleData?.admin_role === 'admin';

            return (
              <div key={user.id} className="group relative bg-[#0A0A0A] lg:bg-transparent border border-white/5 lg:border-none rounded-[2rem] lg:rounded-none p-6 lg:p-7 grid grid-cols-1 lg:grid-cols-12 items-center gap-6 hover:bg-white/[0.02] transition-all duration-300">
                
                {/* Identité */}
                <div className="col-span-4 flex items-center gap-5">
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center text-xs font-black border transition-all duration-500 group-hover:scale-110 group-hover:rotate-3",
                    isAdmin ? "bg-primary/10 border-primary/20 text-primary shadow-[0_0_20px_rgba(var(--primary),0.1)]" : "bg-white/5 border-white/10 text-white/20"
                  )}>
                    {user.prenom?.[0]}{user.nom?.[0]}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm md:text-base font-bold text-white uppercase italic tracking-tighter truncate group-hover:text-primary transition-colors">
                      {user.prenom} {user.nom}
                    </h4>
                    <div className="flex items-center gap-2 text-[9px] font-mono text-white/30 tracking-tight mt-1">
                      <Fingerprint size={10} />
                      <span className="truncate uppercase opacity-60">ID:{user.id?.substring(0,8)}</span>
                    </div>
                  </div>
                </div>

                {/* Badge de Rôle */}
                <div className="col-span-2">
                  <div className={cn(
                    "inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all",
                    isAdmin ? "bg-primary/5 border-primary/20 text-primary" : "bg-white/5 border-white/10 text-white/40"
                  )}>
                    {isAdmin ? <Shield size={12} className="animate-pulse" /> : <UserIcon size={12} />}
                    {isAdmin ? 'ROOT_ADMIN' : 'UserStandard'}
                  </div>
                </div>

                {/* Sélecteur d'Agence (Node) */}
                <div className="col-span-4">
                  <div className="relative group/select">
                    <div className={cn(
                        "absolute left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full z-10 transition-all",
                        currentAgencyId ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" : "bg-white/10"
                    )} />
                    
                    <select
                      value={currentAgencyId}
                      onChange={(e) => handleAssignmentChange(user.id, e.target.value)}
                      className={cn(
                        "w-full bg-white/[0.02] border rounded-2xl pl-10 pr-10 py-3.5 text-[10px] font-black uppercase tracking-widest outline-none appearance-none cursor-pointer transition-all",
                        currentAgencyId ? "border-emerald-500/20 text-emerald-500" : "border-white/5 text-white/20 hover:border-white/20"
                      )}
                    >
                      <option value="" className="bg-[#080808] text-white/20 italic">_AUCUNE_AFFECTATION_</option>
                      {agencies.map((a) => (
                        <option key={a.id} value={a.id} className="bg-[#080808] text-white font-bold">
                          {a.nom.toUpperCase()} :: Agence_{a.id.substring(0,4)}
                        </option>
                      ))}
                    </select>
                    
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-20">
                      {currentAgencyId ? <Link2 size={14} /> : <Unlink size={14} />}
                    </div>
                  </div>
                </div>

                {/* Actions de Contrôle */}
                <div className="col-span-2 flex items-center justify-end gap-3 pt-6 lg:pt-0 border-t lg:border-none border-white/5">
                  <button className="flex-1 lg:flex-none p-3 rounded-xl bg-white/5 text-white/20 hover:text-white hover:bg-white/10 transition-all active:scale-90">
                    <Edit3 size={16} className="mx-auto" />
                  </button>
                  <button 
                    onClick={() => handleDelete(user.id, `${user.prenom} ${user.nom}`)}
                    className="flex-1 lg:flex-none p-3 rounded-xl bg-red-500/5 text-red-500/30 hover:text-red-500 hover:bg-red-500/10 transition-all active:scale-90"
                  >
                    <Trash2 size={16} className="mx-auto" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* --- STATUS BAR BASSE --- */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-6 bg-white/[0.01] border border-white/5 rounded-[2rem]">
        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar w-full md:w-auto">
          <div className="flex items-center gap-2 shrink-0">
            <Globe size={12} className="text-emerald-500" />
            <span className="text-[8px] font-mono text-white/20 uppercase tracking-[0.2em]">Live_Sync: Active</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Shield size={12} className="text-primary" />

          </div>
        </div>
        <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full shrink-0">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[9px] font-black text-white/60 uppercase italic tracking-tighter">
            {filteredUsers.length} Opérateurs_Détéctés
          </span>
        </div>
      </div>

    </div>
  );
}