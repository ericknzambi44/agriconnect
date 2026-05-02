// src/features/admin/pages/AdminAgencies.tsx
import { useState } from 'react';
import { useAgencyManager } from '../hooks/use-agency-manager';
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
  Radio
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminAgencies() {
  const { agencies, loading, deleteAgency, createAgency } = useAgencyManager();
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newAgency, setNewAgency] = useState({
    nom: '',
    ville_territoire: '',
    telephone_responsable: ''
  });

  const handleCreateAgency = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const t = toast.loading("Initialisation du Node...");

    try {
      await createAgency(newAgency);
      toast.success("Node Pyshopy déployé", { id: t });
      setShowAddModal(false);
      setNewAgency({ nom: '', ville_territoire: '', telephone_responsable: '' });
    } catch (error: any) {
      toast.error("Erreur de déploiement", { id: t });
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = (id: string, name: string) => {
    toast.warning(`ALERTE_SÉCURITÉ`, {
      description: `Déconnexion critique de "${name}".`,
      duration: 8000,
      action: {
        label: "Confirmer",
        onClick: async () => {
          const deletePromise = deleteAgency(id);
          toast.promise(deletePromise, {
            loading: 'Suppression...',
            success: 'Node supprimé.',
            error: 'Erreur système.',
          });
        }
      },
      cancel: { 
        label: "Avorter",
        onClick: () => {} 
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <Loader2 className="animate-spin text-primary mb-4" size={32} />
        <span className="text-[9px] font-mono text-white/20 uppercase tracking-[0.3em]">Synchronisation_Reseau...</span>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      
      {/* HEADER INTELLIGENT & FLUIDE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/[0.02] border border-white/5 p-4 md:p-6 rounded-2xl md:rounded-3xl backdrop-blur-sm">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="p-1.5 md:p-2 bg-primary/10 rounded-lg flex-shrink-0">
            <Building2 className="text-primary w-4 h-4 md:w-5 md:h-5" />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg xs:text-xl md:text-2xl font-black italic uppercase text-white tracking-tighter truncate leading-none">
              Agences
            </h1>
            <p className="text-[9px] text-white/40 font-mono flex items-center gap-2 uppercase mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {agencies.length} Nodes Actives
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex-1 sm:w-48 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={12} />
            <input 
              type="text" 
              placeholder="Rechercher..."
              className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 pl-8 pr-4 text-[10px] font-mono text-white focus:border-primary/50 outline-none transition-all"
            />
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-primary text-black p-2.5 md:px-5 md:py-3 rounded-xl font-black text-[10px] uppercase flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/10 flex-shrink-0"
          >
            <Plus size={16} /> <span className="hidden xs:inline">Créer</span>
          </button>
        </div>
      </div>

      {/* GRID : BENTO RESPONSIVE */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {agencies.length > 0 ? (
          agencies.map((agency) => (
            <div 
              key={agency.id} 
              className="group relative bg-white/[0.03] border border-white/10 p-5 md:p-6 rounded-2xl md:rounded-3xl hover:border-primary/40 transition-all duration-300 overflow-hidden"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-black/40 border border-white/10 rounded-xl flex items-center justify-center text-primary group-hover:border-primary/40 transition-colors">
                  <MapPin size={20} />
                </div>
                <button 
                  onClick={() => confirmDelete(agency.id, agency.nom)}
                  className="p-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg transition-all md:opacity-0 md:group-hover:opacity-100"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="space-y-1">
                <h3 className="text-base md:text-lg font-bold text-white uppercase italic truncate">
                  {agency.nom}
                </h3>
                <p className="text-[9px] font-mono text-white/30 uppercase truncate">
                  {agency.ville_territoire} • Node_Master
                </p>
              </div>

              <div className="mt-6 pt-5 border-t border-white/5 flex items-center justify-between gap-2">
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">Effectif</span>
                  <div className="flex items-center gap-1.5 text-white/60">
                    <Users size={12} className="text-primary/60 flex-shrink-0" />
                    <span className="text-[10px] font-black truncate">{agency.agents_count?.[0]?.count || 0}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-0.5 items-end min-w-0">
                  <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">Contact</span>
                  <div className="flex items-center gap-1.5 text-white/60">
                    <span className="text-[10px] font-mono truncate">{agency.telephone_responsable || 'N/A'}</span>
                    <Phone size={12} className="text-primary/60 flex-shrink-0" />
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center border border-dashed border-white/5 rounded-3xl">
            <p className="text-[10px] font-mono text-white/10 uppercase tracking-[0.5em]">Aucune_Donnée_Détectée</p>
          </div>
        )}
      </div>

      {/* MODAL : MOBILE FIRST ET SCROLLABLE */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-[#0A0A0A] border border-white/10 rounded-t-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl max-h-[95vh] flex flex-col animate-in slide-in-from-bottom-10 sm:zoom-in-95">
            
            <div className="p-6 border-b border-white/5 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <Radio className="text-emerald-500 animate-pulse" size={18} />
                <div>
                  <h3 className="text-white font-black text-xs uppercase tracking-widest">Nouvelle agence</h3>
                  <p className="text-[8px] text-white/30 font-mono italic uppercase">Agencies</p>
                </div>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-white/5 rounded-full text-white/20">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateAgency} className="p-6 overflow-y-auto space-y-5 custom-scrollbar">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-white uppercase ml-1">Identification</label>
                <input required value={newAgency.nom} onChange={e => setNewAgency({...newAgency, nom: e.target.value})}
                  className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-3.5 px-4 text-xs text-white focus:border-primary/40 outline-none transition-all placeholder:text-white/10"
                  placeholder="EX: PYSHOPY_BUNIA_CENTRE" />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-white uppercase ml-1">Zone_Géographique</label>
                <input required value={newAgency.ville_territoire} onChange={e => setNewAgency({...newAgency, ville_territoire: e.target.value})}
                  className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-3.5 px-4 text-xs text-white focus:border-primary/40 outline-none transition-all placeholder:text-white/10"
                  placeholder="EX: ITURI, BUNIA" />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-white uppercase ml-1">Phone_Directe</label>
                <input value={newAgency.telephone_responsable} onChange={e => setNewAgency({...newAgency, telephone_responsable: e.target.value})}
                  className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-3.5 px-4 text-xs text-white focus:border-primary/40 outline-none transition-all placeholder:text-white/10"
                  placeholder="+243 XXX XXX XXX" />
              </div>

              <button disabled={isSubmitting} type="submit"
                className="w-full bg-white text-black py-4 rounded-xl font-black text-[10px] uppercase hover:bg-primary transition-all disabled:opacity-50 mt-4 shadow-xl active:scale-95"
              >
                {isSubmitting ? 'Synchronisation...' : 'Déployer'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}