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
  ChevronRight,
  Globe,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
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

  // Filtrage
  const filteredAgencies = useMemo(() => {
    return agencies.filter(a => 
      a.nom?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      a.ville_territoire?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [agencies, searchTerm]);

  const handleCreateAgency = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const t = toast.loading("Enregistrement de l'agence...");

    try {
      await createAgency(newAgency);
      toast.success("Agence ajoutée au réseau", { id: t });
      setShowAddModal(false);
      setNewAgency({ nom: '', ville_territoire: '', telephone_responsable: '' });
    } catch (error: any) {
      toast.error("Erreur d'enregistrement", { id: t });
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = (id: string, name: string) => {
    toast("SUPPRESSION CRITIQUE", {
      description: `Voulez-vous vraiment supprimer l'agence "${name}" ?`,
      action: {
        label: "SUPPRIMER",
        onClick: async () => {
          const deletePromise = deleteAgency(id);
          toast.promise(deletePromise, {
            loading: 'Suppression en cours...',
            success: 'Agence supprimée.',
            error: 'Erreur : l\'agence a encore des agents liés.',
          });
        }
      },
    });
  };

  if (loading && agencies.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black">
        <Loader2 className="animate-spin text-primary mb-4" size={40} />
        <span className="text-[10px] font-black text-white uppercase tracking-[0.5em]">Chargement Système...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 font-sans">
      
      {/* HEADER : STYLE ÉLITE */}
      <div className="max-w-7xl mx-auto mb-10 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-none">
              Réseau <span className="text-primary">Agences</span>
            </h1>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em] mt-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              AgriConnect Administration • {agencies.length} entités actives
            </p>
          </div>
          
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-white text-black h-14 md:h-16 px-8 rounded-2xl font-black text-xs uppercase italic flex items-center justify-center gap-3 hover:bg-primary transition-all active:scale-95 shadow-lg shadow-white/5"
          >
            <Plus size={20} strokeWidth={3} /> Ajouter une Agence
          </button>
        </div>

        {/* BARRE DE RECHERCHE HAUTE VISIBILITÉ */}
        <div className="relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="RECHERCHER PAR NOM OU LOCALISATION..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0F0F0F] border-2 border-white/5 rounded-2xl py-5 pl-14 pr-6 text-xs font-black uppercase tracking-widest focus:border-primary/50 outline-none transition-all placeholder:text-white/10"
          />
        </div>
      </div>

      {/* GRID : STYLE BENTO / ADMIN PRO */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {filteredAgencies.map((agency) => (
          <div 
            key={agency.id} 
            className="group relative bg-[#0F0F0F] border border-white/10 rounded-[2rem] p-6 md:p-8 hover:border-primary/40 transition-all duration-300 flex flex-col justify-between overflow-hidden"
          >
            {/* Décoration en fond */}
            <div className="absolute -right-6 -top-6 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
               <Building2 size={120} />
            </div>

            <div>
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-primary border border-white/5 group-hover:bg-primary group-hover:text-black transition-colors">
                  <Globe size={24} />
                </div>
                <button 
                  onClick={() => confirmDelete(agency.id, agency.nom)}
                  className="p-3 bg-red-500/5 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="space-y-1">
                <h3 className="text-xl md:text-2xl font-black text-white uppercase italic tracking-tighter leading-tight">
                  {agency.nom}
                </h3>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin size={14} className="text-primary" />
                  <p className="text-[10px] font-bold uppercase tracking-widest truncate">
                    {agency.ville_territoire || "NON DÉFINI"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex flex-col">
                  <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">Effectif</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Users size={14} className="text-primary" />
                    <span className="text-sm font-black italic">{agency.agents_count?.[0]?.count || 0}</span>
                  </div>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div className="flex flex-col">
                  <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">Contact</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Phone size={14} className="text-white/40" />
                    <span className="text-[10px] font-bold">{agency.telephone_responsable || '---'}</span>
                  </div>
                </div>
              </div>
              
              <button className="h-10 w-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-primary hover:text-black transition-all">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        ))}

        {filteredAgencies.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[3rem] opacity-30">
            <AlertCircle size={48} className="mb-4" />
            <p className="text-xs font-black uppercase tracking-[0.4em]">Aucun résultat système</p>
          </div>
        )}
      </div>

      {/* MODAL : STYLE DRAWER MOBILE */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="w-full max-w-xl bg-[#0A0A0A] border border-white/10 rounded-t-[2.5rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl">
            
            <div className="p-6 md:p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
              <div>
                <h3 className="text-white font-black text-lg uppercase tracking-tighter italic">Nouvelle Agence</h3>
                <p className="text-[9px] text-primary font-bold uppercase tracking-widest">Extension du réseau AgriConnect</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-3 hover:bg-white/5 rounded-2xl transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleCreateAgency} className="p-6 md:p-8 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Nom de l'entité</label>
                    <input required value={newAgency.nom} onChange={e => setNewAgency({...newAgency, nom: e.target.value})}
                    className="w-full bg-white/[0.03] border-2 border-white/5 rounded-2xl py-4 px-5 text-sm font-bold text-white focus:border-primary outline-none transition-all"
                    placeholder="Ex: AGENCE_BUNIA_CENTRE" />
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Ville / Territoire</label>
                    <input required value={newAgency.ville_territoire} onChange={e => setNewAgency({...newAgency, ville_territoire: e.target.value})}
                    className="w-full bg-white/[0.03] border-2 border-white/5 rounded-2xl py-4 px-5 text-sm font-bold text-white focus:border-primary outline-none transition-all"
                    placeholder="Ex: Bunia, Ituri" />
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Téléphone Responsable</label>
                    <input value={newAgency.telephone_responsable} onChange={e => setNewAgency({...newAgency, telephone_responsable: e.target.value})}
                    className="w-full bg-white/[0.03] border-2 border-white/5 rounded-2xl py-4 px-5 text-sm font-bold text-white focus:border-primary outline-none transition-all"
                    placeholder="+243 ..." />
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <button 
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-4 rounded-2xl font-black text-[10px] uppercase text-white/40 border border-white/10 hover:bg-white/5 transition-all"
                >
                    Annuler
                </button>
                <button disabled={isSubmitting} type="submit"
                    className="flex-[2] bg-primary text-black py-4 rounded-2xl font-black text-[10px] uppercase italic hover:bg-primary/90 transition-all disabled:opacity-50"
                >
                    {isSubmitting ? 'CRÉATION EN COURS...' : 'CONFIRMER LE DÉPLOIEMENT'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}