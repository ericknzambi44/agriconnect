// src/features/admin/components/UserControlList.tsx
import React, { useEffect, useState } from 'react';
import { useAdminUserMaster } from '../hooks/use-admin-user-master';
import { 
  Shield, Link2, Unlink, UserPlus, User as UserIcon, RefreshCcw,
  Search, Trash2, Edit3, X, Globe, Fingerprint, Zap, ChevronRight, Activity
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from "@/lib/utils";
import { useAgencyManager } from '../hooks/use-agency-manager';

export default function UserControlList() {
  // On récupère ce qui existe sur le hook (updateUser est la clé ici)
  const { users, loading, fetchUsers, createUser, deleteUser, updateUser } = useAdminUserMaster();
  const { agencies } = useAgencyManager();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({ nom: '', prenom: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  // --- LOGIQUE DE LIAISON (CORRIGÉE) ---
  // Si assignToAgency n'existe pas en tant que fonction nommée, 
  // on utilise updateUser qui est présent dans le type pour mettre à jour l'agence.
  const handleAssignmentChange = async (userId: string, agenceId: string) => {
    const isUnassigning = agenceId === "";
    const t = toast.loading(isUnassigning ? "DÉCONNEXION_NODE..." : "LIAISON_NODE...");
    
    try {
      // On utilise updateUser pour injecter ou retirer l'agence
      // Note: Adapte la clé 'agence_id' selon ton schéma Supabase/DB
      await updateUser(userId, { agence_id: isUnassigning ? null : agenceId });
      toast.success(isUnassigning ? "Liaison rompue" : "Synchronisation Node ok", { id: t });
      fetchUsers(); // Refresh pour voir le changement
    } catch (e) {
      console.error(e);
      toast.error("Erreur de protocole : vérifiez les permissions", { id: t });
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const loadingToast = toast.loading("CRYPTAGE_DU_PROFIL...");
    try {
      await createUser(newUser);
      toast.success("Opérateur intégré avec succès", { id: loadingToast });
      setNewUser({ nom: '', prenom: '', email: '' });
      setShowAddForm(false);
    } catch (error) {
      toast.error("Échec d'encodage système", { id: loadingToast });
    } finally { setIsSubmitting(false); }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`RÉVOQUER TOUS LES ACCÈS POUR : ${name.toUpperCase()} ?`)) return;
    const t = toast.loading("PURGE_DATA_EN_COURS...");
    try {
      await deleteUser(id);
      toast.success("Accès révoqué définitivement", { id: t });
    } catch (e) {
      toast.error("Violation d'intégrité", { id: t });
    }
  };

  const filteredUsers = users.filter(u => 
    `${u.nom} ${u.prenom} ${u.email}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-1000">
      
      {/* --- COMMAND_CENTER_BAR --- */}
      <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-6 bg-[#080808] p-6 rounded-[2.5rem] border border-white/5 shadow-2xl">
        <div className="relative group flex-1 max-w-2xl">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-primary transition-all group-focus-within:scale-110" size={20} />
          <input 
            type="text" 
            placeholder="SCANNER_ANNUAIRE_ROOT..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/[0.02] border-2 border-white/5 rounded-2xl py-5 pl-16 pr-6 text-[11px] font-black uppercase tracking-[0.2em] text-white focus:border-primary/40 focus:bg-white/[0.04] outline-none transition-all placeholder:text-white/5"
          />
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => fetchUsers()}
            className="w-16 h-16 bg-white/[0.02] border-2 border-white/5 rounded-2xl text-white/20 hover:text-primary hover:border-primary/20 transition-all flex items-center justify-center group active:scale-90"
          >
            <RefreshCcw size={22} className={cn("transition-transform duration-700", loading ? 'animate-spin text-primary' : 'group-hover:rotate-180')} />
          </button>
          
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className={cn(
              "h-16 flex-1 xl:flex-none flex items-center justify-center gap-4 px-10 rounded-2xl font-black text-xs uppercase italic tracking-tighter transition-all active:scale-95 shadow-2xl",
              showAddForm 
              ? 'bg-red-500/10 text-red-500 border-2 border-red-500/20' 
              : 'bg-white text-black hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]'
            )}
          >
            {showAddForm ? <X size={20} strokeWidth={3}/> : <UserPlus size={20} strokeWidth={3} />}
            {showAddForm ? 'ANNULER' : 'AJOUTER_OPERATEUR'}
          </button>
        </div>
      </div>

      {/* --- FORMULAIRE D'ENCODAGE --- */}
      {showAddForm && (
        <div className="bg-primary/5 border-2 border-primary/20 p-8 md:p-12 rounded-[3.5rem] shadow-[0_40px_80px_-20px_rgba(var(--primary),0.1)] animate-in zoom-in-95 duration-500">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-black">
                <Zap size={20} fill="black" />
            </div>
            <h3 className="text-sm font-black text-white uppercase italic tracking-widest">Initialisation_Protocole_Création</h3>
          </div>
          <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-white/30 uppercase tracking-widest flex items-center gap-2">Nom_Famille</label>
              <input required value={newUser.nom} onChange={e => setNewUser({...newUser, nom: e.target.value})}
                className="w-full bg-[#050505] border-2 border-white/5 rounded-2xl py-5 px-6 text-sm font-bold text-white focus:border-primary outline-none transition-all" />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-white/30 uppercase tracking-widest flex items-center gap-2">Prénom_Usuel</label>
              <input required value={newUser.prenom} onChange={e => setNewUser({...newUser, prenom: e.target.value})}
                className="w-full bg-[#050505] border-2 border-white/5 rounded-2xl py-5 px-6 text-sm font-bold text-white focus:border-primary outline-none transition-all" />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-white/30 uppercase tracking-widest flex items-center gap-2">Email_Pro</label>
              <input required type="email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})}
                className="w-full bg-[#050505] border-2 border-white/5 rounded-2xl py-5 px-6 text-sm font-bold text-white focus:border-primary outline-none transition-all" />
            </div>
            <button disabled={isSubmitting} className="md:col-span-3 h-20 bg-primary text-black rounded-[2rem] font-black text-sm uppercase italic tracking-widest hover:scale-[1.01] transition-all shadow-2xl">
              {isSubmitting ? 'ENCODAGE...' : 'VALIDER_INSCRIPTION'}
            </button>
          </form>
        </div>
      )}

      {/* --- LISTE DES OPERATEURS --- */}
      <div className="bg-[#050505] border-2 border-white/5 rounded-[3.5rem] overflow-hidden shadow-2xl">
        <div className="hidden lg:grid grid-cols-12 bg-white/[0.02] p-8 border-b-2 border-white/5">
          <div className="col-span-4 text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Identité_Opérateur</div>
          <div className="col-span-3 text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Niveau_Accès</div>
          <div className="col-span-3 text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Assignation_Node</div>
          <div className="col-span-2 text-right text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Contrôle</div>
        </div>

        <div className="divide-y-2 divide-white/5">
          {filteredUsers.length === 0 ? (
            <div className="p-32 text-center">
                <Activity size={48} className="mx-auto text-white/5 mb-6 animate-pulse" />
                <p className="font-mono text-[11px] text-white/10 uppercase tracking-[0.5em]">Aucune_Donnée_Détectée</p>
            </div>
          ) : filteredUsers.map((user) => {
            // Logique de détection de l'agence liée
            const currentAgency = user.agents_agence?.[0]?.agence;
            const currentAgencyId = currentAgency?.id || "";
            const isAdmin = (user.role as any)?.admin_role === 'admin';

            return (
              <div key={user.id} className="group lg:grid lg:grid-cols-12 items-center gap-8 p-8 lg:p-10 hover:bg-white/[0.03] transition-all duration-500">
                
                {/* ID & NOM */}
                <div className="col-span-4 flex items-center gap-6 mb-6 lg:mb-0">
                  <div className={cn(
                    "w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-sm font-black border-2 transition-all duration-700",
                    isAdmin ? "bg-primary/10 border-primary/30 text-primary" : "bg-white/5 border-white/10 text-white/40"
                  )}>
                    {user.prenom?.[0]}{user.nom?.[0]}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-lg font-black text-white uppercase italic tracking-tighter truncate group-hover:text-primary transition-colors">
                      {user.prenom} {user.nom}
                    </h4>
                    <span className="text-[10px] font-mono text-white/20 uppercase">{user.email}</span>
                  </div>
                </div>

                {/* ACCÈS */}
                <div className="col-span-3 mb-6 lg:mb-0">
                  <div className={cn(
                    "inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl border-2 text-[10px] font-black uppercase tracking-widest",
                    isAdmin ? "bg-primary/5 border-primary/20 text-primary" : "bg-white/5 border-white/10 text-white/30"
                  )}>
                    {isAdmin ? <Shield size={14} className="animate-pulse" /> : <UserIcon size={14} />}
                    {isAdmin ? 'ROOT_ACCESS' : 'User_standard'}
                  </div>
                </div>

                {/* NODE SELECTOR */}
                <div className="col-span-3 mb-8 lg:mb-0">
                  <div className="relative group/select bg-white/10">
                    <select
                      value={currentAgencyId}
                      onChange={(e) => handleAssignmentChange(user.id, e.target.value)}
                      className={cn(
                        "w-full bg-[#0A0A0A] border-2 rounded-2xl pl-12 pr-10 py-4 text-[12px] font-black uppercase tracking-widest outline-none appearance-none cursor-pointer transition-all",
                        currentAgencyId ? "border-emerald-500 text-emerald-500" : "border-white/5 text-yellow"
                      )}
                    >
                      <option value="">Assigner_A_Agence</option>
                      {agencies.map((a) => (
                        <option key={a.id} value={a.id} className="bg-[#080808] text-white">
                          NODE :: {a.nom.toUpperCase()}
                        </option>
                      ))}
                    </select>
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      {currentAgencyId ? <Link2 size={16} className="text-emerald-500 animate-pulse" /> : <Unlink size={16} className="text-white/10" />}
                    </div>
                  </div>
                </div>

                {/* CONTROL PANEL */}
                <div className="col-span-2 flex items-center justify-end gap-3 pt-6 lg:pt-0 border-t-2 lg:border-none border-white/5">
                  <button className="h-14 w-14 bg-white/5 hover:bg-primary hover:text-black rounded-2xl transition-all flex items-center justify-center group/btn active:scale-90 shadow-xl">
                    <Edit3 size={20} className="group-hover/btn:scale-110 transition-transform" />
                  </button>
                  <button 
                    onClick={() => handleDelete(user.id, `${user.prenom} ${user.nom}`)}
                    className="h-14 w-14 bg-red-500/5 hover:bg-red-500 text-red-500 hover:text-white rounded-2xl transition-all flex items-center justify-center group/btn active:scale-90 shadow-xl"
                  >
                    <Trash2 size={20} className="group-hover/btn:rotate-12 transition-transform" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* --- FOOTER STATUS --- */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-10 py-8 bg-[#080808] border-2 border-white/5 rounded-[3rem]">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <Globe size={16} className="text-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Network: AgriConnect</span>
          </div>
        </div>
        <div className="px-6 py-2 bg-primary/10 border border-primary/20 rounded-full">
            <span className="text-[10px] font-black text-primary uppercase italic tracking-widest">
                {filteredUsers.length} users_Actifs
            </span>
        </div>
      </div>
    </div>
  );
}