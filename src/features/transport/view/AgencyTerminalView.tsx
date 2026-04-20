import React, { useState } from 'react';
import { useAgencyDashboard } from '../hooks/useAgencyDashboard';
import { 
  Building2, PackageSearch, Truck, ArrowRight, Loader2,
  MapPin, Phone, User, ShoppingBag, History, Radar, Globe, 
  ShieldCheck, LayoutDashboard, Zap, Hash, CheckCircle2
} from 'lucide-react';
import { cn } from "@/lib/utils";

// Utilisation des variables de ton index.css (bg-secondary, primary, etc.)
const cardStyle = "bg-secondary border-2 border-border rounded-[32px] overflow-hidden transition-all duration-500 hover:border-primary/20 shadow-2xl";

export function AgencyTerminalView() {
  const { agency, myStats, opportunities, loading, processing, processCode, confirmAction } = useAgencyDashboard();
  const [activeTab, setActiveTab] = useState<'terminal' | 'market'>('terminal');
  const [inputCode, setInputCode] = useState("");
  const [scannedExp, setScannedExp] = useState<any>(null);

  const handleScan = async () => {
    if (inputCode.length < 6) return;
    const result = await processCode(inputCode);
    if (result) {
      setScannedExp(result);
      setInputCode(""); 
    }
  };

  const handleConfirm = async () => {
    if (!scannedExp) return;
    const success = await confirmAction(scannedExp.id, scannedExp.actionType);
    if (success) {
      setScannedExp(null); 
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 min-h-[60vh] bg-background">
      <Loader2 className="w-14 h-14 text-primary animate-spin mb-6" />
      <p className="text-primary/40 text-[10px] font-black uppercase tracking-[0.5em] animate-pulse font-tech">
        SYNCHRONISATION_TERMINAL...
      </p>
    </div>
  );

  const isDepot = scannedExp?.actionType === 'DEPOT';
  // Utilisation de l'orange (primary) pour le dépôt et du vert (success) pour le retrait
  const actionColor = isDepot ? 'text-primary' : 'text-success';
  const actionBg = isDepot ? 'bg-primary' : 'bg-success';
  
  const clientData = isDepot ? scannedExp?.vendeur : scannedExp?.acheteur;
  const clientRole = isDepot ? "Vendeur (Dépôt)" : "Acheteur (Retrait)";

  return (
    <div className="w-full min-h-full flex flex-col selection:bg-primary/30 font-sans pb-24 pt-6 md:pt-4 relative z-10 bg-background text-foreground">
      
      {/* HEADER : TERMINAL LOGISTIQUE */}
      <header className="w-full mb-12 flex flex-col lg:flex-row justify-between items-start lg:items-end border-b-2 border-border pb-10 gap-8">
        <div className="flex items-center gap-6">
          <div className="relative group flex-shrink-0">
            {/* Glow orange typique Pied Zyne */}
            <div className="absolute -inset-2 bg-primary/20 rounded-2xl blur-xl group-hover:opacity-100 transition duration-1000 opacity-50"></div>
            <div className="relative w-20 h-20 bg-secondary border-2 border-primary/30 rounded-2xl flex items-center justify-center shadow-2xl">
              <Truck className="text-primary" size={40} strokeWidth={2.5} />
            </div>
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-4">
               <h1 className="text-3xl md:text-5xl font-display font-black italic uppercase tracking-tighter leading-none text-foreground">
                {agency?.nom_agence || 'PYSHOPY'}<span className="text-primary">.</span> LOG
              </h1>
              <span className="bg-primary text-primary-foreground text-[10px] font-black px-4 py-1.5 rounded-xl uppercase tracking-tighter shadow-lg shadow-primary/20">
                NODE_ACTIVE
              </span>
            </div>
            <p className="font-tech text-muted-foreground text-[11px] font-bold uppercase tracking-[0.3em] mt-3 flex items-center gap-2">
              <MapPin size={14} className="text-primary" /> {agency?.ville_agence || 'BUNIA_HUB'} // RDC_TRANSIT
            </p>
          </div>
        </div>

        <nav className="flex bg-secondary p-2 rounded-[1.5rem] border-2 border-border backdrop-blur-xl w-full lg:w-auto shadow-xl">
          <TabButton 
            active={activeTab === 'terminal'} 
            onClick={() => setActiveTab('terminal')} 
            icon={<LayoutDashboard size={18}/>} 
            label="TERMINAL" 
          />
          <TabButton 
            active={activeTab === 'market'} 
            onClick={() => setActiveTab('market')} 
            icon={<Radar size={18}/>} 
            label="FLUX_RESEAU" 
            count={opportunities.length}
          />
        </nav>
      </header>

      {/* CONTENU PRINCIPAL */}
      <main className="w-full flex-1">
        {activeTab === 'terminal' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            
            <div className="lg:col-span-7 space-y-8 flex flex-col">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <MiniStat label="EN_TRANSIT_ARRIVÉE" value={myStats.toDeliver} icon={<Truck size={24}/>} variant="primary" />
                <MiniStat label="LIVRAISONS_TOTALES" value={myStats.completed} icon={<History size={24}/>} variant="success" />
              </div>

              <section className={cn(cardStyle, "p-8 md:p-14 relative group flex-1 flex flex-col justify-center min-h-[450px] border-primary/10")}>
                <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none group-hover:opacity-[0.07] transition-opacity">
                   <ShieldCheck size={180} className="text-primary" />
                </div>
                
                <div className="relative z-10 w-full max-w-2xl mx-auto text-center md:text-left">
                  <h2 className="font-tech text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground mb-10 flex items-center gap-4 justify-center md:justify-start">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_10px_rgba(var(--primary),0.8)]" />
                    SCAN_SYSTEM_ENCRYPTION_ACTIVE
                  </h2>
                  
                  <div className="space-y-8">
                    <div className="relative group/input">
                      <Hash className="absolute left-8 top-1/2 -translate-y-1/2 text-primary/20 group-focus-within/input:text-primary transition-colors" size={40} />
                      <input 
                        type="text"
                        value={inputCode}
                        onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                        onKeyDown={(e) => e.key === 'Enter' && handleScan()}
                        className="w-full bg-background border-2 border-border rounded-[2.5rem] py-12 md:py-16 pl-24 pr-8 text-center text-5xl md:text-7xl font-tech font-black tracking-[0.5em] text-primary focus:border-primary outline-none transition-all shadow-inner placeholder:text-muted-foreground/10"
                        placeholder="000000"
                      />
                    </div>
                    
                    <button 
                      onClick={handleScan}
                      disabled={processing || inputCode.length < 6}
                      className="w-full bg-primary text-primary-foreground font-display font-black italic py-8 md:py-10 rounded-[2rem] flex items-center justify-center gap-6 text-lg md:text-xl transition-all hover:shadow-[0_20px_40px_rgba(var(--primary),0.3)] active:scale-[0.98] disabled:opacity-50"
                    >
                      {processing ? <Loader2 className="animate-spin" /> : <ArrowRight className="group-hover:translate-x-2 transition-transform" size={30} />}
                      IDENTIFIER_FLUX_LOGISTIQUE
                    </button>
                  </div>
                </div>
              </section>
            </div>

            <div className="lg:col-span-5 h-full min-h-[500px]">
              {scannedExp ? (
                <div className={cn("p-1.5 h-full rounded-[45px] shadow-2xl animate-in zoom-in-95 duration-500", actionBg)}>
                  <div className="bg-secondary rounded-[40px] p-8 text-foreground h-full border-2 border-white/10 flex flex-col justify-between gap-10">
                    
                    <div className="flex justify-between items-start">
                       <div className={cn("flex items-center gap-3 px-5 py-2.5 rounded-xl border-2", isDepot ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-success/10 border-success/30 text-success')}>
                         {isDepot ? <PackageSearch size={18} /> : <CheckCircle2 size={18} />}
                         <span className="font-tech text-[11px] font-black uppercase tracking-widest">
                           {isDepot ? 'DÉPÔT_VENDEUR' : 'RETRAIT_CLIENT'}
                         </span>
                       </div>
                       <button onClick={() => setScannedExp(null)} className="p-3 flex items-center justify-center bg-background border-2 border-border rounded-xl text-muted-foreground hover:text-error hover:border-error/30 transition-all">✕</button>
                    </div>

                    <div className="space-y-8 flex-1 flex flex-col justify-center">
                      <div className="p-8 bg-background rounded-3xl border-2 border-border relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-[0.05]">
                           <Hash size={60} />
                        </div>
                        <p className="font-tech text-muted-foreground text-[10px] font-black uppercase tracking-widest mb-3">ID_COLIS: #{scannedExp.id.substring(0,8)}</p>
                        <h3 className="text-3xl font-display font-black italic tracking-tighter leading-tight mb-6 truncate text-foreground uppercase">
                          {scannedExp.commande?.annonce?.produit?.nom_prod || `FRET_AGRICOLE`}
                        </h3>
                        <div className="flex items-center justify-between border-t-2 border-border pt-6">
                            <span className="font-tech text-xs font-bold text-muted-foreground uppercase">{scannedExp.commande?.quantite_commandee || 1} UNITÉ(S)</span>
                            <span className={cn("text-3xl font-tech font-black tracking-tighter", actionColor)}>
                              {scannedExp.commande?.prix_total_commande || 0} USD
                            </span>
                        </div>
                      </div>

                      <div className="p-8 bg-background border-2 border-border rounded-3xl space-y-6">
                          <div className="flex justify-between items-center border-b border-border pb-4">
                            <span className="font-tech text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">{clientRole}</span>
                            <User size={20} className="text-primary/40" />
                          </div>
                          <p className="font-display font-black italic text-2xl uppercase text-foreground">{clientData?.nom || "AGENT_EXTERNE"}</p>
                          
                          <div className="flex items-center justify-between bg-secondary p-6 rounded-2xl border-2 border-border">
                            <span className="font-tech text-xl font-black text-foreground tracking-[0.1em]">
                              {clientData?.numero_tel || "NON_RENSEIGNÉ"}
                            </span>
                            {clientData?.numero_tel && (
                              <a href={`tel:${clientData?.numero_tel}`} className={cn("p-4 rounded-xl shadow-lg transition-all active:scale-90", actionBg, "text-white")}>
                                <Phone size={24} />
                              </a>
                            )}
                          </div>
                      </div>
                    </div>

                    <button 
                      onClick={handleConfirm}
                      disabled={processing}
                      className={cn("w-full h-24 text-white font-display font-black italic py-8 rounded-[2rem] shadow-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-4 text-xl tracking-[0.2em]", actionBg)}
                    >
                      {processing ? <Loader2 className="animate-spin" /> : <ShieldCheck size={32} />}
                      {isDepot ? "CONFIRMER_RÉCEPTION_DÉPÔT" : "SCELLER_LIVRAISON_FINALE"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="h-full min-h-[500px] border-4 border-dashed border-border rounded-[45px] flex flex-col items-center justify-center text-center p-14 relative overflow-hidden bg-secondary/30 group">
                   <div className="w-24 h-24 bg-background border-2 border-border rounded-3xl flex items-center justify-center mb-8 relative z-10 shadow-inner group-hover:border-primary/30 transition-all duration-700">
                      <Zap size={40} className="text-primary/20 group-hover:text-primary transition-all group-hover:scale-110" />
                   </div>
                   <p className="text-muted-foreground/30 font-tech font-black uppercase text-[11px] tracking-[0.5em] leading-loose relative z-10">
                     TERMINAL_STANDBY <br/> 
                     <span className="text-primary/20">EN_ATTENTE_DE_FLUX_LOGISTIQUE</span>
                   </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
             {/* SECTION MARCHÉ / FLUX */}
             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 mb-12">
                <div className="flex items-center gap-6">
                  <div className="p-4 bg-primary/10 rounded-2xl border-2 border-primary/20 shadow-xl">
                    <Radar className="text-primary animate-spin-slow" size={28} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-display font-black uppercase italic tracking-tighter text-foreground leading-none">FLUX_DU_RÉSEAU</h2>
                    <p className="font-tech text-[10px] text-muted-foreground font-black uppercase tracking-[0.4em] mt-2">OPPORTUNITÉS_LOGISTIQUES_ACTIVES</p>
                  </div>
                </div>
                <div className="bg-secondary border-2 border-border px-8 py-4 rounded-2xl flex items-center gap-4 shadow-xl">
                   <Globe size={20} className="text-primary" />
                   <span className="font-tech font-black text-sm text-foreground uppercase tracking-widest">{opportunities.length} NŒUDS_EN_ATTENTE</span>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {opportunities.map((opp) => (
                  <div key={opp.id} className={cn(cardStyle, "group relative flex flex-col h-full border-t-primary/20 hover:border-primary/40")}>
                    <div className="p-8 flex-1">
                      <div className="flex justify-between items-start mb-8">
                        <div className="w-14 h-14 bg-background rounded-2xl flex items-center justify-center border-2 border-border shadow-inner">
                          <ShoppingBag className="text-primary/60 group-hover:text-primary transition-colors" size={28} />
                        </div>
                        <p className="text-3xl font-tech font-black text-success tracking-tighter shadow-glow-success">
                          {opp.commande?.prix_total_commande || 0}$
                        </p>
                      </div>
                      <h4 className="text-xl font-display font-black italic text-foreground leading-tight mb-6 group-hover:text-primary transition-colors line-clamp-2 uppercase">
                        {opp.commande?.annonce?.produit?.nom_prod || `FRET_AGRICOLE`}
                      </h4>
                      <div className="space-y-4 pt-6 border-t-2 border-border font-tech text-[10px] font-black text-muted-foreground uppercase tracking-widest italic">
                        <div className="flex items-center gap-4">
                          <MapPin size={14} className="text-primary/60" />
                          <span className="truncate">DESTINATION : {opp.destination_ville}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <User size={14} className="text-primary/60" />
                          <span className="truncate">ORIGINE : {opp.vendeur?.nom}</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 border-t-2 border-border bg-background/50 backdrop-blur-sm">
                      <a href={`tel:${opp.vendeur?.numero_tel}`} className="w-full bg-secondary hover:bg-primary hover:text-primary-foreground py-5 rounded-2xl flex items-center justify-center gap-4 font-tech text-[11px] font-black uppercase tracking-[0.2em] transition-all active:scale-95 shadow-md">
                        <Phone size={18} /> CONTACTER_VENDEUR
                      </a>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        )}
      </main>
      
      <style>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 15s linear infinite; }
        .shadow-glow-success { text-shadow: 0 0 10px rgba(var(--success), 0.3); }
      `}</style>
    </div>
  );
}

// --- SOUS-COMPOSANTS ---

function TabButton({ active, onClick, icon, label, count }: any) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex-1 lg:flex-none px-8 py-4 rounded-xl flex items-center justify-center gap-4 font-tech text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500",
        active 
          ? "bg-primary text-primary-foreground shadow-2xl scale-105" 
          : "text-muted-foreground/60 hover:text-primary hover:bg-primary/5"
      )}
    >
      {icon} {label}
      {count !== undefined && (
        <span className={cn(
          "ml-2 px-2.5 py-1 rounded-lg text-[9px] font-black",
          active ? "bg-primary-foreground text-primary" : "bg-border text-muted-foreground"
        )}>
          {count}
        </span>
      )}
    </button>
  );
}

function MiniStat({ label, value, icon, variant }: { label: string, value: any, icon: any, variant: 'primary' | 'success' }) {
  const themes = {
    primary: "text-primary border-primary/20 bg-primary/5",
    success: "text-success border-success/20 bg-success/5"
  };
  
  return (
    <div className={cn("p-8 rounded-[2rem] border-2 flex items-center justify-between shadow-xl transition-all hover:scale-[1.02]", themes[variant])}>
      <div className="min-w-0">
        <p className="font-tech text-[9px] font-black uppercase tracking-[0.3em] opacity-60 mb-2 truncate italic">{label}</p>
        <p className="text-4xl md:text-5xl font-tech font-black tracking-tighter leading-none">{value}</p>
      </div>
      <div className="opacity-20 scale-150 flex-shrink-0 ml-4 group-hover:rotate-12 transition-transform">{icon}</div>
    </div>
  );
}