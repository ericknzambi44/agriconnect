// AgencyTerminalView.tsx
import React, { useState, useEffect } from 'react';
import { useAgencyDashboard } from '../hooks/useAgencyDashboard';
import { useAgencyTerminalAccess } from '../hooks/use-agency-terminal-access';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/supabase';
import { 
  Building2, PackageSearch, Truck, Loader2,
  MapPin, Phone, User, Radar, 
  ShieldCheck, LayoutDashboard, Zap, Hash, CheckCircle2, Search,
  Lock, Globe, Sparkles, ArrowRight
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { toast } from 'sonner';
import { ExpeditionCard } from '../components/ExpeditionCard';
import { ExpeditionDetailDrawer } from '../components/ExpeditionDetailsDrawer';

// Types
interface Expedition {
  id: string;
  commande?: {
    quantite_commandee: number;
    prix_total_commande: number;
    id?: string;
  };
  statut_expedition: string;
  code_depot: string;
  code_retrait: string;
  vendeur?: {
    nom: string;
    prenom: string;
    numero_tel?: string;
  };
  acheteur?: {
    nom: string;
    prenom: string;
    numero_tel?: string;
  };
}

interface Opportunity {
  id: string;
  commande?: {
    prix_total_commande: number;
    destination_ville?: string;
    annonce?: {
      produit?: {
        nom_prod: string;
      };
    };
  };
  vendeur?: {
    nom: string;
    prenom: string;
    numero_tel?: string;
  };
}

interface ScannedExpedition {
  id: string;
  actionType: 'DEPOT' | 'RETRAIT';
  productName: string;
  destination: string;
  commande?: {
    prix_total_commande: number;
  };
  vendeur?: {
    nom: string;
    prenom: string;
    numero_tel?: string;
  };
  acheteur?: {
    nom: string;
    prenom: string;
    numero_tel?: string;
  };
}

const cardStyle = "bg-gradient-to-b from-white/[0.02] to-black/40 border border-white/10 rounded-2xl md:rounded-3xl overflow-hidden transition-all duration-500 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 backdrop-blur-sm";

export function AgencyTerminalView() {
  const { isAuthorized, agency, isLoading: accessLoading, fetchExpeditionContacts } = useAgencyTerminalAccess();
  const { 
    myStats, 
    opportunities, 
    loading: dataLoading, 
    processing, 
    processCode, 
    confirmAction 
  } = useAgencyDashboard(agency?.id);
  
  const [activeTab, setActiveTab] = useState<'terminal' | 'expeditions' | 'market'>('terminal');
  const [inputCode, setInputCode] = useState("");
  const [scannedExp, setScannedExp] = useState<ScannedExpedition | null>(null);
  const [selectedExpedition, setSelectedExpedition] = useState<Expedition | null>(null);
  const [expeditions, setExpeditions] = useState<Expedition[]>([]);
  const [expeditionContacts, setExpeditionContacts] = useState<Record<string, any>>({});
  const navigate = useNavigate();

  // Récupérer les expéditions liées à l'agence
  useEffect(() => {
    async function fetchExpeditions() {
      if (!agency?.id) return;
      const { data, error } = await supabase
        .from('expedition')
        .select('*, commande:commande_id(*)')
        .eq('agence_id', agency.id)
        .order('created_at', { ascending: false });
      if (!error && data) setExpeditions(data as Expedition[]);
    }
    fetchExpeditions();
  }, [agency?.id]);

  // Récupérer les contacts pour chaque expédition
  useEffect(() => {
    async function loadContacts() {
      if (!expeditions.length) return;
      const contactsMap: Record<string, any> = {};
      for (const exp of expeditions) {
        const contacts = await fetchExpeditionContacts(exp.id);
        if (contacts) contactsMap[exp.id] = contacts;
      }
      setExpeditionContacts(contactsMap);
    }
    loadContacts();
  }, [expeditions, fetchExpeditionContacts]);

  const handleScan = async () => {
    if (inputCode.length < 6) return;
    const result = await processCode(inputCode);
    if (result) {
      setScannedExp(result as ScannedExpedition);
      setInputCode(""); 
      toast.success("Code identifié");
    }
  };

  const handleConfirm = async () => {
    if (!scannedExp || !isAuthorized) return; 
    const success = await confirmAction(scannedExp.id, scannedExp.actionType);
    if (success) setScannedExp(null);
  };

  if (accessLoading || dataLoading) return (
    <div className="flex h-[50vh] w-full items-center justify-center">
      <div className="relative">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-primary animate-pulse" />
      </div>
    </div>
  );

  const isDepot = scannedExp?.actionType === 'DEPOT';
  const actor = isDepot ? scannedExp?.vendeur : scannedExp?.acheteur;
  const actionColor = isDepot ? 'text-primary' : 'text-emerald-400';
  const actionBg = isDepot ? 'from-primary to-orange-400' : 'from-emerald-500 to-emerald-600';

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500 bg-gradient-to-br from-[#0a0a0a] via-[#050505] to-black p-4 md:p-6 rounded-3xl">
      
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-primary/20 to-transparent rounded-xl border border-primary/30">
            <Building2 className="text-primary drop-shadow-[0_0_6px_rgba(var(--primary),0.6)]" size={22} />
          </div>
          <div className="flex flex-col">
            <h2 className="text-xl md:text-2xl font-display font-black italic uppercase tracking-tighter text-white leading-none">
              Terminal <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">Logistique</span>
            </h2>
            <p className="font-tech text-[8px] text-white/50 uppercase tracking-[0.2em] mt-1 flex items-center gap-1.5">
              <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse", isAuthorized ? "bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.8)]" : "bg-red-500")} />
              {agency?.nom || "Hub local"} — {agency?.ville_territoire || "Bunia"}
            </p>
          </div>
        </div>

        <div className="flex bg-black/40 p-1 rounded-xl border border-white/10 w-full md:w-auto">
          <TabButton active={activeTab === 'terminal'} onClick={() => setActiveTab('terminal')} icon={<LayoutDashboard size={12}/>} label="Scanner" />
          <TabButton active={activeTab === 'expeditions'} onClick={() => setActiveTab('expeditions')} icon={<PackageSearch size={12}/>} label="Expéditions" count={expeditions.length} />
          <TabButton active={activeTab === 'market'} onClick={() => setActiveTab('market')} icon={<Radar size={12}/>} label="Flux" count={opportunities.length} />
        </div>
      </div>

      {/* Onglet Scanner */}
      {activeTab === 'terminal' && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          <div className="xl:col-span-7 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <StatCard label="En transit" value={myStats.toDeliver} icon={<Truck size={14}/>} color="primary" />
              <StatCard label="Succès" value={myStats.completed} icon={<CheckCircle2 size={14}/>} color="success" />
            </div>

            <div className={cn(cardStyle, "relative p-8 md:p-12 min-h-[420px] flex flex-col items-center justify-center")}>
              {!isAuthorized && <LockOverlay onSubscribe={() => navigate('/dashboard/subscription')} />}
              <div className="w-full max-w-sm space-y-8 text-center relative z-10">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary font-tech text-[8px] font-black uppercase tracking-wider">
                    <Zap size={10} className="animate-pulse" /> Saisie sécurisée
                  </div>
                  <h3 className="text-2xl md:text-3xl font-display font-black italic uppercase text-white drop-shadow-md">Code Expédition</h3>
                </div>
                <div className="relative">
                  <input 
                    type="text"
                    maxLength={6}
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === 'Enter' && handleScan()}
                    className="w-full bg-white/[0.02] border-2 border-white/10 rounded-2xl py-8 text-center text-5xl font-tech font-black tracking-[0.3em] text-primary focus:border-primary/60 focus:outline-none transition-all placeholder:text-white/10"
                    placeholder="------"
                  />
                  <Hash className="absolute left-6 top-1/2 -translate-y-1/2 text-white/10" size={32} />
                </div>
                <button 
                  onClick={handleScan}
                  disabled={processing || inputCode.length < 6}
                  className="w-full bg-gradient-to-r from-primary to-orange-400 text-black py-5 rounded-xl font-display font-black italic text-xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? <Loader2 className="animate-spin" /> : <Search size={22} />}
                  Vérifier
                </button>
              </div>
            </div>
          </div>

          <div className="xl:col-span-5">
            {scannedExp ? (
              <div className={cn("rounded-[2rem] p-[2px] animate-in zoom-in-95 duration-300 shadow-2xl", `bg-gradient-to-r ${actionBg}`)}>
                <div className="bg-black/60 backdrop-blur-md rounded-[calc(2rem-2px)] p-6 space-y-5 border border-white/10">
                  <div className="flex justify-between items-center">
                    <span className={cn("px-3 py-1.5 rounded-xl font-tech text-[9px] font-black uppercase tracking-wider", isDepot ? 'bg-primary/20 text-primary' : 'bg-emerald-500/20 text-emerald-400')}>
                      {isDepot ? 'Flux : Dépôt' : 'Flux : Retrait'}
                    </span>
                    <button onClick={() => setScannedExp(null)} className="text-white/40 hover:text-white font-tech text-[9px] uppercase font-black transition-colors">
                      Fermer
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-black/40 rounded-2xl p-5 border border-white/10">
                      <p className="font-tech text-[8px] text-white/50 font-black uppercase mb-1">Désignation</p>
                      <h4 className="text-xl font-display font-black italic uppercase text-white leading-tight truncate">
                        {scannedExp.productName}
                      </h4>
                      <div className="flex justify-between items-end mt-6">
                        <div>
                          <p className="font-tech text-[7px] text-white/50 uppercase font-black">Destination</p>
                          <p className="text-xs font-bold flex items-center gap-1"><MapPin size={12} className="text-primary"/> {scannedExp.destination}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-tech text-[7px] text-white/50 uppercase font-black">Valeur</p>
                          <p className={cn("text-2xl font-tech font-black tracking-tighter", actionColor)}>{scannedExp.commande?.prix_total_commande} USD</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 bg-black/40 p-4 rounded-xl border border-white/10">
                      <div className="w-11 h-11 rounded-full bg-primary/20 flex items-center justify-center">
                        <User size={20} className="text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-tech text-[7px] text-white/50 uppercase">{isDepot ? 'Expéditeur' : 'Client'}</p>
                        <p className="font-display font-black text-sm text-white uppercase truncate">{actor?.nom} {actor?.prenom}</p>
                      </div>
                      <a href={`tel:${actor?.numero_tel}`} className="p-3 bg-primary/20 rounded-xl hover:bg-primary hover:text-black transition-all">
                        <Phone size={16} className="text-primary" />
                      </a>
                    </div>
                  </div>
                  <button 
                    onClick={handleConfirm}
                    disabled={processing}
                    className={cn("w-full py-5 rounded-xl text-black font-display font-black italic text-lg flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg", `bg-gradient-to-r ${actionBg}`)}
                  >
                    {processing ? <Loader2 className="animate-spin" /> : <ShieldCheck size={22} />}
                    {isDepot ? "Valider réception" : "Valider remise"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[350px] border-2 border-dashed border-white/10 rounded-[2rem] flex flex-col items-center justify-center text-center p-8 bg-black/20">
                <Radar className="text-white/10 animate-spin-slow mb-4" size={56} />
                <p className="text-white/30 font-tech font-black uppercase text-[8px] tracking-[0.4em]">En attente de flux terminal...</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Onglet Expéditions */}
      {activeTab === 'expeditions' && (
        <div className="space-y-6">
          <div className="relative overflow-hidden bg-gradient-to-r from-primary/90 via-primary to-orange-500 p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-2xl shadow-primary/30">
            <div className="relative z-10 space-y-1">
              <h3 className="text-2xl md:text-3xl font-display font-black italic uppercase text-white tracking-tight">Expéditions</h3>
              <p className="font-tech text-[9px] text-white/80 font-black uppercase tracking-[0.4em]">
                {expeditions.length} expédition(s) en cours
              </p>
            </div>
            <Globe className="absolute right-[-20px] top-[-20px] text-white/10 transition-transform duration-[4s]" size={180} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {expeditions.map((exp) => (
              <ExpeditionCard
                key={exp.id}
                exp={exp}
                onSelect={() => setSelectedExpedition(exp)}
                vendeur={expeditionContacts[exp.id]?.vendeur}
                acheteur={expeditionContacts[exp.id]?.acheteur}
              />
            ))}
          </div>
        </div>
      )}

      {/* Onglet Opportunités */}
      {activeTab === 'market' && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          <div className="relative overflow-hidden bg-gradient-to-r from-primary/90 via-primary to-orange-500 p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-2xl shadow-primary/30">
            <div className="relative z-10 space-y-1">
              <h3 className="text-2xl md:text-3xl font-display font-black italic uppercase text-white tracking-tight">Opportunités</h3>
              <p className="font-tech text-[9px] text-white/80 font-black uppercase tracking-[0.4em]">
                {opportunities.length} colis détectés dans votre secteur
              </p>
            </div>
            <Globe className="absolute right-[-20px] top-[-20px] text-white/10 transition-transform duration-[4s]" size={180} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {opportunities.map((opp) => (
              <div key={opp.id} className={cn(cardStyle, "group")}>
                <div className="p-5 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="px-2.5 py-1 bg-primary/20 rounded-lg text-primary font-tech text-[8px] font-black uppercase tracking-wider">
                      À réceptionner
                    </div>
                    <span className="text-xl font-tech font-black text-white tracking-tighter">
                      {opp.commande?.prix_total_commande} USD
                    </span>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-base font-display font-black italic uppercase text-white line-clamp-1">
                      {opp.commande?.annonce?.produit?.nom_prod || 'Produit agricole'}
                    </h4>
                    <p className="text-[9px] font-tech font-bold text-white/60 uppercase flex items-center gap-1">
                      <MapPin size={10} className="text-primary"/> {opp.commande?.destination_ville || "Bunia"}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center font-display font-black text-[10px] text-primary">
                        {opp.vendeur?.nom?.substring(0,1) || "V"}
                      </div>
                      <span className="text-[8px] font-tech font-black text-white/60 uppercase truncate">{opp.vendeur?.nom} {opp.vendeur?.prenom}</span>
                    </div>
                    <button 
                      onClick={() => isAuthorized ? (window.location.href = `tel:${opp.vendeur?.numero_tel}`) : toast.error("Licence requise")}
                      className={cn(
                        "p-2.5 rounded-lg transition-all",
                        isAuthorized ? "bg-primary/20 text-primary hover:bg-primary hover:text-black" : "bg-white/5 text-white/30 cursor-not-allowed"
                      )}
                    >
                      {isAuthorized ? <Phone size={14} /> : <Lock size={14} />}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Drawer des détails d'expédition */}
      {selectedExpedition && (
        <ExpeditionDetailDrawer
          exp={selectedExpedition}
          agence={agency}
        />
      )}
    </div>
  );
}

// Composants internes
interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  count?: number;
}

function TabButton({ active, onClick, icon, label, count }: TabButtonProps) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-2 font-tech text-[9px] font-black uppercase tracking-wider transition-all",
        active ? "bg-gradient-to-r from-primary to-orange-400 text-black shadow-md" : "text-white/50 hover:text-white"
      )}
    >
      {icon} <span className="hidden sm:inline">{label}</span>
      {count !== undefined && <span className={cn("ml-1 px-1.5 py-0.5 rounded text-[8px]", active ? "bg-black/20" : "bg-white/10")}>{count}</span>}
    </button>
  );
}

interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  color: 'primary' | 'success';
}

function StatCard({ label, value, icon, color }: StatCardProps) {
  const isPrimary = color === 'primary';
  const bgGradient = isPrimary ? 'from-primary/20 to-transparent' : 'from-emerald-500/20 to-transparent';
  const borderColor = isPrimary ? 'border-primary/30' : 'border-emerald-500/30';
  const textColor = isPrimary ? 'text-primary' : 'text-emerald-400';
  
  return (
    <div className={cn("relative overflow-hidden p-5 rounded-2xl border bg-gradient-to-br", bgGradient, borderColor)}>
      <span className="font-tech text-[8px] font-black uppercase tracking-[0.2em] text-white/50">{label}</span>
      <p className={cn("text-3xl md:text-4xl font-tech font-black tracking-tighter mt-1", textColor)}>{value}</p>
      <div className="absolute right-3 bottom-2 opacity-20">{icon}</div>
    </div>
  );
}

interface LockOverlayProps {
  onSubscribe: () => void;
}

function LockOverlay({ onSubscribe }: LockOverlayProps) {
  return (
    <div className="absolute inset-0 bg-black/80 backdrop-blur-xl z-40 flex flex-col items-center justify-center p-8 text-center rounded-[2rem]">
      <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mb-4">
        <Lock className="text-primary" size={28} />
      </div>
      <h3 className="text-xl font-display font-black italic uppercase text-white">Accès bloqué</h3>
      <p className="text-[9px] text-white/50 font-black uppercase tracking-widest mt-2 mb-6">Abonnement agence requis</p>
      <button onClick={onSubscribe} className="px-6 py-3 bg-gradient-to-r from-primary to-orange-400 text-black rounded-xl font-display font-black italic text-sm flex items-center gap-2 hover:scale-105 transition-transform">
        Activer <ArrowRight size={16} />
      </button>
    </div>
  );
}