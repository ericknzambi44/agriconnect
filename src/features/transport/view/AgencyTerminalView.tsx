import React, { useState } from 'react';
import { useAgencyDashboard } from '../hooks/useAgencyDashboard';
import { useAgencyTerminalAccess } from '../hooks/use-agency-terminal-access';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, PackageSearch, Truck, Loader2,
  MapPin, Phone, User, Radar, 
  ShieldCheck, LayoutDashboard, Zap, Hash, CheckCircle2, Search,
  Lock, Globe, ChevronRight
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { toast } from 'sonner';

/**
 * STYLE : Cartes plus fines et cohérentes avec le dashboard
 */
const cardStyle = "bg-secondary/30 border border-border/40 rounded-[20px] overflow-hidden transition-all duration-300 hover:border-primary/30 shadow-lg backdrop-blur-md";

export function AgencyTerminalView() {
  const { isAuthorized, agency, isLoading: accessLoading } = useAgencyTerminalAccess();
  const { 
    myStats, 
    opportunities, 
    loading: dataLoading, 
    processing, 
    processCode, 
    confirmAction 
  } = useAgencyDashboard(agency?.id);
  
  const [activeTab, setActiveTab] = useState<'terminal' | 'market'>('terminal');
  const [inputCode, setInputCode] = useState("");
  const [scannedExp, setScannedExp] = useState<any>(null);
  const navigate = useNavigate(); 

  const handleScan = async () => {
    if (inputCode.length < 6) return;
    const result = await processCode(inputCode);
    if (result) {
      setScannedExp(result);
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
      <Loader2 className="w-8 h-8 text-primary animate-spin" />
    </div>
  );

  const isDepot = scannedExp?.actionType === 'DEPOT';
  const actor = isDepot ? scannedExp?.vendeur : scannedExp?.acheteur;
  const actionColor = isDepot ? 'text-primary' : 'text-emerald-500';
  const actionBg = isDepot ? 'bg-primary' : 'bg-emerald-500';

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500 font-sans">
      
      {/* 1. TOOLBAR : Resserrée pour éviter l'effet "éparpillé" */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-secondary/10 p-4 rounded-2xl border border-border/40">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 rounded-xl border border-primary/20">
            <Building2 className="text-primary" size={20} />
          </div>
          <div className="flex flex-col">
            <h2 className="text-lg font-display font-black italic uppercase tracking-tight text-foreground leading-none">
              Terminal <span className="text-primary">Logistique</span>
            </h2>
            <p className="font-tech text-[8px] text-muted-foreground uppercase tracking-[0.2em] mt-1 flex items-center gap-1.5">
              <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse", isAuthorized ? "bg-emerald-500" : "bg-red-500")} />
              {agency?.nom || "HUB_LOC"} — {agency?.ville_territoire}
            </p>
          </div>
        </div>

        <div className="flex bg-background/40 p-1 rounded-lg border border-border w-full md:w-72">
          <TabButton active={activeTab === 'terminal'} onClick={() => setActiveTab('terminal')} icon={<LayoutDashboard size={12}/>} label="SCANNER" />
          <TabButton active={activeTab === 'market'} onClick={() => setActiveTab('market')} icon={<Radar size={12}/>} label="FLUX" count={opportunities.length} />
        </div>
      </div>

      {activeTab === 'terminal' ? (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          
          {/* SCANNER (7 COL) */}
          <div className="xl:col-span-7 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <StatCard label="EN TRANSIT" value={myStats.toDeliver} icon={<Truck size={12}/>} color="primary" />
              <StatCard label="SUCCÈS" value={myStats.completed} icon={<CheckCircle2 size={12}/>} color="success" />
            </div>

            <div className={cn(cardStyle, "relative p-8 md:p-12 min-h-[420px] flex flex-col items-center justify-center")}>
              {!isAuthorized && <LockOverlay onSubscribe={() => navigate('/dashboard/subscription')} />}
              
              <div className="w-full max-w-sm space-y-8 text-center relative z-10">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-tech text-[8px] font-black uppercase tracking-widest">
                    <Zap size={10} className="animate-pulse" /> Saisie sécurisée
                  </div>
                  <h3 className="text-2xl font-display font-black italic uppercase text-foreground">Code_Expédition</h3>
                </div>

                <div className="relative">
                  <input 
                    type="text"
                    maxLength={6}
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === 'Enter' && handleScan()}
                    className="w-full bg-background/20 border-2 border-border rounded-2xl py-8 text-center text-5xl font-tech font-black tracking-[0.3em] text-primary focus:border-primary transition-all outline-none"
                    placeholder="------"
                  />
                  <Hash className="absolute left-6 top-1/2 -translate-y-1/2 text-border/20" size={32} />
                </div>

                <button 
                  onClick={handleScan}
                  disabled={processing || inputCode.length < 6}
                  className="w-full bg-primary text-primary-foreground py-5 rounded-xl font-display font-black italic text-xl flex items-center justify-center gap-3 hover:brightness-105 active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
                >
                  {processing ? <Loader2 className="animate-spin" /> : <Search size={22} />}
                  VÉRIFIER
                </button>
              </div>
            </div>
          </div>

          {/* RÉSULTAT SCAN (5 COL) */}
          <div className="xl:col-span-5">
            {scannedExp ? (
              <div className={cn("rounded-[28px] p-[1.5px] animate-in zoom-in-95 duration-300 shadow-xl", actionBg)}>
                <div className="bg-background rounded-[26px] p-6 space-y-6">
                  <div className="flex justify-between items-center">
                    <span className={cn("px-3 py-1 rounded-lg font-tech text-[9px] font-black uppercase tracking-widest", isDepot ? 'bg-primary/10 text-primary' : 'bg-emerald-500/10 text-emerald-400')}>
                       {isDepot ? 'FLUX : DÉPÔT' : 'FLUX : RETRAIT'}
                    </span>
                    <button onClick={() => setScannedExp(null)} className="text-muted-foreground hover:text-foreground font-tech text-[9px] uppercase font-black transition-colors italic">Fermer</button>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-secondary/20 rounded-2xl p-5 border border-border">
                      <p className="font-tech text-[8px] text-muted-foreground font-black uppercase mb-1">Désignation</p>
                      <h4 className="text-xl font-display font-black italic uppercase text-foreground leading-tight truncate">
                        {scannedExp.productName}
                      </h4>
                      
                      <div className="flex justify-between items-end mt-6">
                        <div>
                          <p className="font-tech text-[7px] text-muted-foreground uppercase font-black">Destination</p>
                          <p className="text-xs font-bold flex items-center gap-1"><MapPin size={12} className="text-primary"/> {scannedExp.destination}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-tech text-[7px] text-muted-foreground uppercase font-black">Valeur</p>
                          <p className={cn("text-2xl font-tech font-black tracking-tighter", actionColor)}>{scannedExp.commande?.prix_total_commande}$</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 bg-secondary/10 p-4 rounded-2xl border border-border/50">
                      <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <User size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-tech text-[7px] text-muted-foreground uppercase">{isDepot ? 'Expéditeur' : 'Client'}</p>
                        <p className="font-display font-black text-sm text-foreground uppercase truncate">{actor?.nom}</p>
                      </div>
                      <a href={`tel:${actor?.numero_tel}`} className="p-3 bg-primary text-primary-foreground rounded-xl hover:scale-105 transition-transform">
                        <Phone size={16} />
                      </a>
                    </div>
                  </div>

                  <button 
                    onClick={handleConfirm}
                    disabled={processing}
                    className={cn("w-full py-6 rounded-2xl text-white font-display font-black italic text-xl flex items-center justify-center gap-3 transition-all", actionBg)}
                  >
                    {processing ? <Loader2 className="animate-spin" /> : <ShieldCheck size={24} />}
                    {isDepot ? "VALIDER RÉCEPTION" : "VALIDER REMISE"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[350px] border-2 border-dashed border-border rounded-[28px] flex flex-col items-center justify-center text-center p-8 bg-secondary/5">
                 <Radar className="text-muted-foreground/20 animate-spin-slow mb-4" size={56} />
                 <p className="text-muted-foreground/30 font-tech font-black uppercase text-[8px] tracking-[0.4em]">En attente de flux terminal...</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* SECTION RÉSEAU : Cartes plus petites (Grid x3 ou x4) */
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          <div className="bg-primary/90 p-8 rounded-[24px] overflow-hidden relative group shadow-xl">
            <div className="relative z-10 space-y-1">
              <h3 className="text-3xl font-display font-black italic uppercase text-primary-foreground tracking-tight">Opportunités</h3>
              <p className="font-tech text-[9px] text-primary-foreground/80 font-black uppercase tracking-[0.4em]">
                {opportunities.length} Colis détectés dans votre secteur
              </p>
            </div>
            <Globe className="absolute right-[-20px] top-[-10px] text-primary-foreground/10 group-hover:rotate-12 transition-transform duration-[4s]" size={180} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {opportunities.map((opp) => (
              <div key={opp.id} className={cardStyle}>
                <div className="p-5 space-y-5">
                  <div className="flex justify-between items-start">
                    <div className="px-2.5 py-1 bg-primary/10 rounded-lg text-primary font-tech text-[8px] font-black uppercase">
                      A_RECEPTIONNER
                    </div>
                    <span className="text-xl font-tech font-black text-foreground tracking-tighter">
                      {opp.commande?.prix_total_commande}$
                    </span>
                  </div>
                  
                  <div className="space-y-1">
                    <h4 className="text-base font-display font-black italic uppercase text-foreground line-clamp-1">
                      {opp.commande?.annonce?.produit?.nom_prod || 'PRODUIT_AGRI'}
                    </h4>
                    <p className="text-[9px] font-tech font-bold text-muted-foreground uppercase flex items-center gap-1">
                      <MapPin size={10} className="text-primary"/> {opp.commande?.destination_ville}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-border/50 flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-secondary border border-border flex flex-shrink-0 items-center justify-center font-display font-black text-[10px] text-primary">
                        {opp.vendeur?.nom?.substring(0,1)}
                      </div>
                      <span className="text-[8px] font-tech font-black text-muted-foreground uppercase truncate">{opp.vendeur?.nom}</span>
                    </div>
                    <button 
                      onClick={() => isAuthorized ? (window.location.href = `tel:${opp.vendeur?.numero_tel}`) : toast.error("Licence requise")}
                      className={cn(
                        "p-2.5 rounded-lg transition-all",
                        isAuthorized ? "bg-primary text-primary-foreground hover:scale-110" : "bg-muted text-muted-foreground cursor-not-allowed"
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
    </div>
  );
}

// COMPOSANTS INTERNES
function TabButton({ active, onClick, icon, label, count }: any) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex-1 py-2 px-3 rounded-md flex items-center justify-center gap-2 font-tech text-[9px] font-black uppercase tracking-widest transition-all",
        active ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground"
      )}
    >
      {icon} <span className="hidden sm:inline">{label}</span>
      {count !== undefined && <span className={cn("ml-1 px-1.5 py-0.5 rounded text-[8px]", active ? "bg-white/20" : "bg-primary/10")}>{count}</span>}
    </button>
  );
}

function StatCard({ label, value, icon, color }: any) {
  const styles = color === 'primary' ? "text-primary border-primary/20 bg-primary/5" : "text-emerald-500 border-emerald-500/20 bg-emerald-500/5";
  return (
    <div className={cn("p-4 rounded-2xl border flex flex-col justify-between h-28 relative overflow-hidden", styles)}>
      <span className="font-tech text-[8px] font-black uppercase tracking-[0.2em] opacity-70">{label}</span>
      <p className="text-3xl font-tech font-black tracking-tighter">{value}</p>
      <div className="absolute right-2 bottom-2 opacity-10">{icon}</div>
    </div>
  );
}

function LockOverlay({ onSubscribe }: { onSubscribe: () => void }) {
  return (
    <div className="absolute inset-0 bg-background/90 backdrop-blur-xl z-40 flex flex-col items-center justify-center p-8 text-center rounded-[20px]">
      <Lock className="text-primary mb-4" size={32} />
      <h3 className="text-xl font-display font-black italic uppercase text-foreground">Accès bloqué</h3>
      <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest mt-2 mb-6">Licence Agence requise</p>
      <button onClick={onSubscribe} className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-display font-black italic text-sm flex items-center gap-2 hover:scale-105 transition-transform">
        ACTIVER <ChevronRight size={16} />
      </button>
    </div>
  );
}