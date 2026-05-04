// src/features/admin/pages/AdminAgencies.tsx
import { useState, useMemo } from 'react';

import { 
  Plus, 
  Trash2, 
  MapPin, 
  Phone, 
  Users, 
  Building2, 
  Loader2, 
  Search,
  X,
  Radio,
  Navigation,
  Activity
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from "@/lib/utils";
import { useAgencyManager } from '../hooks/use-agency-manager';

export default function AdminAgencies() {
  const { agencies, loading, deleteAgency, createAgency } = useAgencyManager();
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newAgency, setNewAgency] = useState({
    nom: '',
    ville_territoire: '',
    telephone_responsable: ''
  });

  // Filtrage intelligent
  const filteredAgencies = useMemo(() => {
    return agencies.filter(a => 
      a.nom?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      a.ville_territoire?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [agencies, searchTerm]);

  const handleCreateAgency = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const t = toast.loading("Déploiement du Node sur le réseau...");

    try {
      await createAgency(newAgency);
      toast.success("Node opérationnel", { id: t });
      setShowAddModal(false);
      setNewAgency({ nom: '', ville_territoire: '', telephone_responsable: '' });
    } catch (error: any) {
      toast.error("Échec de l'initialisation", { id: t });
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = (id: string, name: string) => {
    toast.warning(`RÉVOCATION_CRITIQUE`, {
      description: `Voulez-vous déconnecter "${name}" de l'infrastructure ?`,
      duration: 8000,
      action: {
        label: "DÉPLOYER_PURGE",
        onClick: async () => {
          const deletePromise = deleteAgency(id);
          toast.promise(deletePromise, {
            loading: 'Déconnexion du Node...',
            success: 'Node purgé avec succès.',
            error: 'Erreur de protocole.',
          });
        }
      },
    });
  };

  if (loading && agencies.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="relative">
            <Loader2 className="animate-spin text-primary" size={40} strokeWidth={1} />
            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
        </div>
        <span className="text-[10px] font-mono text-white/40 uppercase tracking-[0.4em] animate-pulse">
            Sychronizing_Global...
        </span>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-10 max-w-[1600px] mx-auto animate-in fade-in duration-700">
      
      {/* HEADER DE COMMANDE CENTRALISÉ */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Building2 className="text-primary relative z-10" size={24} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black italic uppercase text-white tracking-tighter">
              Nodes_<span className="text-primary">Agences</span>
            </h1>
            <div className="flex items-center gap-3 mt-1">
                <span className="flex items-center gap-1.5 text-[9px] font-mono text-emerald-500 uppercase font-bold">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {agencies.length} Actifs
                </span>
                <span className="w-px h-2 bg-white/10" />
                <span className="text-[9px] font-mono text-white/20 uppercase">Network_v1.0.0</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-72 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={14} />
            <input 
              type="text" 
              placeholder="RECHERCHER_NODE..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0A0A0A] border border-white/5 rounded-2xl py-3.5 pl-11 pr-4 text-[10px] font-mono text-white focus:border-primary/40 outline-none transition-all"
            />
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="w-full sm:w-auto bg-white text-black px-8 py-3.5 rounded-2xl font-black text-[10px] uppercase italic flex items-center justify-center gap-3 hover:bg-primary hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-white/5"
          >
            <Plus size={16} strokeWidth={3} /> Initialiser
          </button>
        </div>
      </div>

      {/* GRID : BENTO ARCHITECTURE */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5 md:gap-6">
        {filteredAgencies.map((agency) => (
          <div 
            key={agency.id} 
            className="group relative bg-[#0A0A0A] border border-white/5 p-6 md:p-8 rounded-[2.5rem] hover:border-primary/30 transition-all duration-500 hover:shadow-[0_20px_40px_-20px_rgba(0,0,0,0.5)] overflow-hidden"
          >
            {/* Background Accent */}
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="flex justify-between items-start mb-8">
              <div className="flex flex-col gap-1">
                <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all duration-500">
                  <Navigation size={22} />
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => confirmDelete(agency.id, agency.nom)}
                  className="p-3 bg-red-500/5 hover:bg-red-500 text-red-500/40 hover:text-white rounded-xl transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-white uppercase italic tracking-tighter leading-tight group-hover:text-primary transition-colors">
                {agency.nom}
              </h3>
              <div className="flex items-center gap-2">
                <MapPin size={12} className="text-white/20" />
                <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest truncate">
                  {agency.ville_territoire || "ZONE_NON_DÉFINIE"}
                </p>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-white/5 grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-[8px] font-mono text-white/20 uppercase tracking-[0.2em]">Personnel_Actif</span>
                <div className="flex items-center gap-2 text-white">
                  <Users size={14} className="text-primary/40" />
                  <span className="text-xs font-black font-mono">{agency.agents_count?.[0]?.count || 0}</span>
                </div>
              </div>

              <div className="space-y-1 text-right">
                <span className="text-[8px] font-mono text-white/20 uppercase tracking-[0.2em]">Ligne_Directe</span>
                <div className="flex items-center gap-2 justify-end text-white/60">
                  <span className="text-[10px] font-mono font-bold">{agency.telephone_responsable || '---'}</span>
                  <Phone size={12} className="text-primary/40" />
                </div>
              </div>
            </div>

            {/* Hover Footer Action */}
            <div className="mt-6 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <button className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] text-white/60 border border-white/5">
                    Ouvrir
                </button>
            </div>
          </div>
        ))}

        {filteredAgencies.length === 0 && (
          <div className="col-span-full py-32 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-[3rem] bg-white/[0.01]">
            <Activity size={40} className="text-white/5 mb-4" />
            <p className="text-[10px] font-mono text-white/20 uppercase tracking-[0.5em]">Aucune_Correspondance</p>
          </div>
        )}
      </div>

      {/* MODAL / DRAWER MOBILE-FRIENDLY */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-xl bg-[#080808] border border-white/10 rounded-t-[3rem] sm:rounded-[3rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-20 duration-500">
            
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-2xl">
                    <Radio className="text-primary animate-pulse" size={20} />
                </div>
                <div>
                  <h3 className="text-white font-black text-sm uppercase tracking-widest italic">Déploiement_Node</h3>
                  <p className="text-[8px] text-white/20 font-mono uppercase mt-0.5 tracking-widest font-bold">Infrastucture_Expansion</p>
                </div>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-3 hover:bg-white/5 rounded-2xl text-white/20 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleCreateAgency} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-[9px] font-black text-white/30 uppercase tracking-widest ml-1">Désignation</label>
                    <input required value={newAgency.nom} onChange={e => setNewAgency({...newAgency, nom: e.target.value})}
                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 px-5 text-xs text-white focus:border-primary outline-none transition-all placeholder:text-white/5"
                    placeholder="ex: NODE_GOMA_OFFICE" />
                </div>

                <div className="space-y-2">
                    <label className="text-[9px] font-black text-white/30 uppercase tracking-widest ml-1">Zone_Urbaine</label>
                    <input required value={newAgency.ville_territoire} onChange={e => setNewAgency({...newAgency, ville_territoire: e.target.value})}
                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 px-5 text-xs text-white focus:border-primary outline-none transition-all placeholder:text-white/5"
                    placeholder="ex: GOMA, KIVU" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-white/30 uppercase tracking-widest ml-1">Communication_ID (WhatsApp/Tel)</label>
                <input value={newAgency.telephone_responsable} onChange={e => setNewAgency({...newAgency, telephone_responsable: e.target.value})}
                  className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 px-5 text-xs text-white focus:border-primary outline-none transition-all placeholder:text-white/5"
                  placeholder="+243 ..." />
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-4 rounded-2xl font-black text-[10px] uppercase text-white/40 border border-white/5 hover:bg-white/5 transition-all"
                >
                    Abandonner
                </button>
                <button disabled={isSubmitting} type="submit"
                    className="flex-[2] bg-primary text-black py-4 rounded-2xl font-black text-[10px] uppercase italic hover:scale-[1.02] shadow-lg shadow-primary/20 transition-all disabled:opacity-50"
                >
                    {isSubmitting ? 'SYCHRONISATION_EN_COURS...' : 'DÉPLOYER_SUR_AGRICONNECT'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}