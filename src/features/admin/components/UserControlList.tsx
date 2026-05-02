// src/features/admin/components/UserControlList.tsx
import React, { useEffect, useState } from 'react';
import { useAdminUserMaster } from '../hooks/use-admin-user-master';
import { useAgencyManager } from '../hooks/use-agency-manager';
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
  Globe
} from 'lucide-react';
import { toast } from 'sonner';

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
    const loadingToast = toast.loading("Initialisation du profil...");
    try {
      await createUser(newUser);
      toast.success("Opérateur enregistré", { id: loadingToast });
      setNewUser({ nom: '', prenom: '', email: '' });
      setShowAddForm(false);
    } catch (error) {
      toast.error("Erreur de création", { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Révoquer définitivement l'accès pour ${name} ?`)) return;
    const t = toast.loading("Destruction des données...");
    try {
      await deleteUser(id);
      toast.success("Profil purgé", { id: t });
    } catch (e) {
      toast.error("Erreur système", { id: t });
    }
  };

  const handleAssignmentChange = async (userId: string, agenceId: string) => {
    const isUnassigning = agenceId === "";
    const updateToast = toast.loading(isUnassigning ? "Révocation du Node..." : "Synchronisation Node...");
    try {
      await assignToAgency(userId, isUnassigning ? null : agenceId);
      toast.success(isUnassigning ? "Agent déconnecté" : "Node assigné avec succès", { id: updateToast });
    } catch (e) {
      toast.error("Échec de la liaison", { id: updateToast });
    }
  };

  const filteredUsers = users.filter(u => 
    u.nom?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* --- TOP BAR ACTIONS --- */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-xs group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="RECHERCHER_OPERATEUR..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/[0.02] border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-[10px] font-mono text-white focus:border-primary/40 focus:bg-white/[0.05] outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button 
            onClick={() => fetchUsers()}
            className="p-3.5 bg-white/[0.02] border border-white/10 rounded-2xl text-white/40 hover:text-primary hover:border-primary/30 transition-all active:scale-90"
          >
            <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
          
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-tighter transition-all active:scale-95 ${
              showAddForm 
              ? 'bg-red-500/10 text-red-500 border border-red-500/20' 
              : 'bg-primary text-black hover:shadow-[0_0_20px_rgba(var(--primary),0.3)]'
            }`}
          >
            {showAddForm ? <X size={16}/> : <UserPlus size={16} />}
            {showAddForm ? 'Annuler' : 'Ajouter Opérateur'}
          </button>
        </div>
      </div>

      {/* --- DYNAMIC ADD FORM --- */}
      {showAddForm && (
        <div className="bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 p-5 rounded-[2rem] backdrop-blur-2xl animate-in zoom-in-95 duration-300">
          <form onSubmit={handleCreateUser} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1.5 text-left">
              <label className="text-[9px] font-black text-white/30 uppercase ml-1">Nom de famille</label>
              <input required value={newUser.nom} onChange={e => setNewUser({...newUser, nom: e.target.value})}
                className="w-full bg-black/40 border border-white/5 rounded-xl py-3 px-4 text-xs text-white outline-none focus:border-primary/50" placeholder="Ex: NZAMBI" />
            </div>
            <div className="space-y-1.5 text-left">
              <label className="text-[9px] font-black text-white/30 uppercase ml-1">Prénom</label>
              <input required value={newUser.prenom} onChange={e => setNewUser({...newUser, prenom: e.target.value})}
                className="w-full bg-black/40 border border-white/5 rounded-xl py-3 px-4 text-xs text-white outline-none focus:border-primary/50" placeholder="Ex: Erick" />
            </div>
            <div className="space-y-1.5 text-left">
              <label className="text-[9px] font-black text-white/30 uppercase ml-1">Email Professionnel</label>
              <input required type="email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})}
                className="w-full bg-black/40 border border-white/5 rounded-xl py-3 px-4 text-xs text-white outline-none focus:border-primary/50" placeholder="agent@pyshopy.com" />
            </div>
            <button disabled={isSubmitting} className="h-[45px] self-end bg-white text-black rounded-xl font-black text-[10px] uppercase hover:bg-primary transition-all disabled:opacity-50 shadow-xl shadow-white/5">
              {isSubmitting ? 'Encodage...' : 'LIER & AFFECTER'}
            </button>
          </form>
        </div>
      )}

      {/* --- LISTING RESPONSIVE --- */}
      <div className="grid grid-cols-1 gap-4 lg:block lg:bg-white/[0.01] lg:border lg:border-white/5 lg:rounded-[2.5rem] lg:overflow-hidden">
        
        <div className="hidden lg:grid grid-cols-12 bg-white/[0.03] p-6 border-b border-white/5">
          <div className="col-span-4 text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Profil_Opérateur</div>
          <div className="col-span-2 text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Privilèges</div>
          <div className="col-span-4 text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Affectation_Agence</div>
          <div className="col-span-2 text-right text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Gestion</div>
        </div>

        <div className="lg:divide-y lg:divide-white/5">
          {filteredUsers.map((user) => {
            const currentAgency = user.agents_agence?.[0]?.agence;
            const currentAgencyId = currentAgency?.id || "";
            
            // TypeScript bypass via any
            const roleData = user.role as any;
            const isAdmin = roleData?.admin_role === 'admin';
            const roleTitle = roleData?.titre_role || (isAdmin ? 'ADMIN_ROOT' : 'UTILISATEUR STANDARD');

            return (
              <div key={user.id} className="group bg-white/[0.02] lg:bg-transparent border border-white/5 lg:border-none rounded-3xl p-5 lg:p-6 grid grid-cols-1 lg:grid-cols-12 items-center gap-4 hover:bg-white/[0.04] transition-all duration-300">
                
                <div className="col-span-4 flex items-center gap-4 text-left">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-black border transition-transform group-hover:rotate-3 duration-500 ${
                    isAdmin ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-white/5 border-white/10 text-white/40'
                  }`}>
                    {user.nom?.[0]}{user.prenom?.[0]}
                  </div>
                  <div className="space-y-0.5 overflow-hidden">
                    <h4 className="text-sm font-bold text-white uppercase truncate tracking-tight">{user.nom} {user.prenom}</h4>
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-white/20 italic">
                      <Mail size={10} /> <span className="truncate">{user.email}</span>
                    </div>
                  </div>
                </div>

                <div className="col-span-2 flex lg:block">
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-colors ${
                    isAdmin 
                    ? 'bg-primary/5 border-primary/20 text-primary shadow-[0_0_15px_rgba(var(--primary),0.1)]' 
                    : 'bg-blue-500/5 border-blue-500/20 text-blue-400'
                  }`}>
                    {isAdmin ? <Shield size={12} className="animate-pulse" /> : <UserIcon size={12} />}
                    <span className="text-[9px] font-black uppercase tracking-tighter">
                      {roleTitle}
                    </span>
                  </div>
                </div>

                <div className="col-span-4 text-left">
                  <div className="relative group/select">
                    <div className={`absolute left-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full z-10 ${currentAgencyId ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-white/20'}`} />
                    
                    <select
                      value={currentAgencyId}
                      onChange={(e) => handleAssignmentChange(user.id, e.target.value)}
                      className={`w-full bg-black/60 border rounded-xl pl-8 pr-10 py-3 text-[10px] font-black uppercase outline-none appearance-none cursor-pointer transition-all duration-300
                        ${currentAgencyId 
                          ? 'border-emerald-500/30 text-emerald-400 hover:border-emerald-400' 
                          : 'border-white/10 text-white/40 hover:border-primary/40'
                        }`}
                    >
                      <option value="">⚪ Assigrer a agence</option>
                      {agencies.map((a) => (
                        <option key={a.id} value={a.id} className="text-emerald-400">
                          📡 NODE: {a.nom.toUpperCase()}
                        </option>
                      ))}
                    </select>
                    
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transition-transform group-hover/select:translate-x-1">
                      {currentAgencyId ? <Link2 size={14} className="text-emerald-500" /> : <Unlink size={14} className="text-white/20" />}
                    </div>
                  </div>
                  <p className="text-[8px] font-mono text-white/10 mt-1.5 uppercase tracking-widest pl-1">
                    {currentAgencyId ? `Synchronisé avec ${currentAgency?.nom}` : 'En attente d\'affectation'}
                  </p>
                </div>

                <div className="col-span-2 flex items-center justify-end gap-2 pt-4 lg:pt-0 border-t border-white/5 lg:border-none">
                  <button className="flex-1 lg:flex-none p-2.5 rounded-xl bg-white/5 text-white/30 hover:text-white hover:bg-white/10 transition-all border border-transparent hover:border-white/10">
                    <Edit3 size={16} className="mx-auto" />
                  </button>
                  <button 
                    onClick={() => handleDelete(user.id, user.nom)}
                    className="flex-1 lg:flex-none p-2.5 rounded-xl bg-red-500/5 text-red-500/40 hover:text-white hover:bg-red-500 transition-all border border-transparent hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]"
                  >
                    <Trash2 size={16} className="mx-auto" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* --- FOOTER STATUS BAR --- */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 bg-white/[0.02] border border-white/5 rounded-3xl text-[9px] font-mono text-white/20 uppercase tracking-[0.2em]">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-2"><Globe size={12} className="text-emerald-500" /> DB_STATUS: ONLINE</span>
          <span className="hidden sm:inline">PROTECTION_LAYER: ACTIVE</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span>{filteredUsers.length} OPÉRATEURS RÉPERTORIÉS</span>
        </div>
      </div>
    </div>
  );
}