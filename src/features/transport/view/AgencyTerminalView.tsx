// src/features/transport/components/AgencyTerminalView.tsx
import React, { useState } from 'react';
import { useAgencyDashboard } from '../hooks/useAgencyDashboard';
import { 
  Building2, PackageSearch, Truck, ArrowRight, Loader2,
  MapPin, Phone, User, ShoppingBag, History, Radar, Globe, 
  ShieldCheck, LayoutDashboard, Zap, Hash, CheckCircle2, Search
} from 'lucide-react';
import { cn } from "@/lib/utils";

const cardStyle = "bg-secondary border-2 border-border rounded-[24px] md:rounded-[32px] overflow-hidden transition-all duration-500 hover:border-primary/20 shadow-xl";

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
    if (success) setScannedExp(null);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 min-h-[60vh] bg-background">
      <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
      <p className="text-primary/40 text-[9px] font-black uppercase tracking-[0.4em] animate-pulse">CHARGE_TERMINAL...</p>
    </div>
  );

  const isDepot = scannedExp?.actionType === 'DEPOT';
  const actionColor = isDepot ? 'text-primary' : 'text-success';
  const actionBg = isDepot ? 'bg-primary' : 'bg-success';
  const clientData = isDepot ? scannedExp?.vendeur : scannedExp?.acheteur;

  return (
    <div className="w-full min-h-screen flex flex-col selection:bg-primary/30 font-sans pb-20 pt-4 px-4 md:px-6 bg-background text-foreground">
      
      {/* HEADER COMPACT & RESPONSIVE */}
      <header className="w-full mb-8 flex flex-col lg:flex-row justify-between items-center border-b-2 border-border pb-6 gap-6">
        <div className="flex items-center gap-4 w-full lg:w-auto">
          <div className="relative flex-shrink-0">
            <div className="absolute -inset-1 bg-primary/20 rounded-xl blur-lg opacity-50"></div>
            <div className="relative w-14 h-14 bg-secondary border-2 border-primary/30 rounded-xl flex items-center justify-center shadow-lg">
              <Truck className="text-primary" size={28} />
            </div>
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl md:text-4xl font-display font-black italic uppercase tracking-tighter leading-none">
              {agency?.nom_agence || 'PIEDZYNE'}<span className="text-primary">.</span>LOG
            </h1>
            <p className="font-tech text-muted-foreground text-[10px] font-bold uppercase tracking-widest mt-1 flex items-center gap-2">
              <MapPin size={12} className="text-primary" /> {agency?.ville_agence || 'HUB_CENTRAL'}
            </p>
          </div>
        </div>

        <nav className="flex bg-secondary p-1.5 rounded-2xl border-2 border-border w-full lg:w-auto overflow-x-auto no-scrollbar">
          <TabButton active={activeTab === 'terminal'} onClick={() => setActiveTab('terminal')} icon={<LayoutDashboard size={16}/>} label="TERMINAL" />
          <TabButton active={activeTab === 'market'} onClick={() => setActiveTab('market')} icon={<Radar size={16}/>} label="RÉSEAU" count={opportunities.length} />
        </nav>
      </header>

      <main className="w-full flex-1">
        {activeTab === 'terminal' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* COLONNE GAUCHE : SCANNER */}
            <div className="lg:col-span-7 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <MiniStat label="À RECEVOIR" value={myStats.toDeliver} variant="primary" />
                <MiniStat label="TRAITÉS" value={myStats.completed} variant="success" />
              </div>

              <section className={cn(cardStyle, "p-6 md:p-10 flex flex-col justify-center min-h-[350px] md:min-h-[450px] relative")}>
                <div className="relative z-10 w-full max-w-xl mx-auto space-y-8">
                  <div className="text-center space-y-2">
                    <h2 className="font-tech text-[10px] font-black uppercase tracking-[0.3em] text-primary flex justify-center items-center gap-2">
                      <Zap size={14} className="animate-pulse" /> SCANNER_CODE_FLUX
                    </h2>
                    <p className="text-muted-foreground text-[11px] uppercase font-bold">Entrez le code de dépôt ou retrait</p>
                  </div>
                  
                  <div className="relative group">
                    <input 
                      type="text"
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                      onKeyDown={(e) => e.key === 'Enter' && handleScan()}
                      className="w-full bg-background border-2 border-border rounded-2xl py-8 md:py-12 text-center text-4xl md:text-6xl font-tech font-black tracking-[0.2em] text-primary focus:border-primary outline-none transition-all shadow-inner placeholder:text-muted-foreground/5"
                      placeholder="000000"
                    />
                    <Hash className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/10 hidden md:block" size={40} />
                  </div>
                  
                  <button 
                    onClick={handleScan}
                    disabled={processing || inputCode.length < 6}
                    className="w-full bg-primary text-primary-foreground font-display font-black italic py-6 md:py-8 rounded-2xl flex items-center justify-center gap-4 text-lg md:text-xl transition-all active:scale-[0.98] shadow-lg shadow-primary/20 disabled:opacity-30"
                  >
                    {processing ? <Loader2 className="animate-spin" /> : <Search size={24} />}
                    ANALYSER LE CODE
                  </button>
                </div>
              </section>
            </div>

            {/* COLONNE DROITE : RÉSULTAT SCAN */}
            <div className="lg:col-span-5">
              {scannedExp ? (
                <div className={cn("p-1 h-full rounded-[28px] md:rounded-[36px] shadow-2xl animate-in zoom-in-95 duration-300", actionBg)}>
                  <div className="bg-secondary rounded-[26px] md:rounded-[34px] p-5 md:p-8 h-full flex flex-col gap-6">
                    
                    <div className="flex justify-between items-center bg-background/40 p-3 rounded-xl border border-white/5">
                       <div className={cn("flex items-center gap-2 px-3 py-1 rounded-lg font-tech text-[10px] font-black uppercase", isDepot ? 'bg-primary/20 text-primary' : 'bg-success/20 text-success')}>
                         {isDepot ? <PackageSearch size={14} /> : <CheckCircle2 size={14} />}
                         {isDepot ? 'DÉPÔT' : 'RETRAIT'}
                       </div>
                       <button onClick={() => setScannedExp(null)} className="text-muted-foreground hover:text-foreground font-bold p-2">ANNULER</button>
                    </div>

                    <div className="space-y-4 flex-1">
                      {/* BOX PRODUIT */}
                      <div className="p-5 bg-background/50 rounded-2xl border-2 border-border">
                        <p className="font-tech text-[9px] text-muted-foreground font-black uppercase mb-1">DÉTAILS_FRET</p>
                        <h3 className="text-xl md:text-2xl font-display font-black italic uppercase leading-tight truncate">
                          {scannedExp.commande?.annonce?.produit?.nom_prod || 'PRODUIT_AGRI'}
                        </h3>
                        <div className="flex justify-between mt-4 pt-3 border-t border-border/50 items-end">
                            <span className="font-tech text-[10px] font-bold text-muted-foreground">{scannedExp.commande?.quantite_commandee || 1} UNITÉ(S)</span>
                            <span className={cn("text-2xl font-tech font-black", actionColor)}>{scannedExp.commande?.prix_total_commande || 0} USD</span>
                        </div>
                      </div>

                      {/* BOX CLIENT */}
                      <div className="p-5 bg-background/50 rounded-2xl border-2 border-border space-y-4">
                          <p className="font-tech text-[9px] text-muted-foreground font-black uppercase tracking-widest">{isDepot ? 'VENDEUR_EXPÉDITEUR' : 'ACHETEUR_DESTINATAIRE'}</p>
                          <p className="font-display font-black italic text-lg uppercase truncate">{clientData?.nom || "AGENT_EXTERNE"}</p>
                          <div className="flex items-center justify-between bg-background p-3 rounded-xl border border-border">
                            <span className="font-tech font-bold text-sm tracking-widest">{clientData?.numero_tel || "INCONNU"}</span>
                            {clientData?.numero_tel && (
                              <a href={`tel:${clientData?.numero_tel}`} className={cn("p-2 rounded-lg text-white", actionBg)}>
                                <Phone size={18} />
                              </a>
                            )}
                          </div>
                      </div>
                    </div>

                    <button 
                      onClick={handleConfirm}
                      disabled={processing}
                      className={cn("w-full py-6 md:py-8 rounded-2xl text-white font-display font-black italic flex items-center justify-center gap-3 text-lg md:text-xl shadow-xl transition-all active:scale-[0.98]", actionBg)}
                    >
                      {processing ? <Loader2 className="animate-spin" /> : <ShieldCheck size={24} />}
                      {isDepot ? "VALIDER LE DÉPÔT" : "VALIDER LE RETRAIT"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="h-full min-h-[300px] border-4 border-dashed border-border rounded-[32px] flex flex-col items-center justify-center text-center p-8 bg-secondary/20">
                   <Radar className="text-primary/10 mb-4 animate-pulse" size={48} />
                   <p className="text-muted-foreground/30 font-tech font-black uppercase text-[10px] tracking-[0.3em]">
                     EN ATTENTE DE SCAN...
                   </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {opportunities.map((opp) => (
                  <div key={opp.id} className={cn(cardStyle, "flex flex-col border-t-primary/20")}>
                    <div className="p-6 flex-1 space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="w-12 h-12 bg-background rounded-xl flex items-center justify-center border border-border">
                          <ShoppingBag className="text-primary/60" size={20} />
                        </div>
                        <span className="text-2xl font-tech font-black text-success tracking-tighter">
                          {opp.commande?.prix_total_commande}$
                        </span>
                      </div>
                      <h4 className="text-lg font-display font-black italic leading-tight uppercase line-clamp-2">
                        {opp.commande?.annonce?.produit?.nom_prod || 'PRODUIT_RÉSEAU'}
                      </h4>
                      <div className="space-y-2 pt-4 border-t border-border font-tech text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                        <div className="flex items-center gap-3">
                          <MapPin size={12} className="text-primary" />
                          <span className="truncate">{opp.destination_ville}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <User size={12} className="text-primary" />
                          <span className="truncate">{opp.vendeur?.nom}</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-2 border-t border-border">
                      <a href={`tel:${opp.vendeur?.numero_tel}`} className="w-full bg-secondary hover:bg-primary hover:text-white py-4 rounded-xl flex items-center justify-center gap-3 font-tech text-[10px] font-black uppercase tracking-widest transition-all">
                        <Phone size={14} /> CONTACTER
                      </a>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        )}
      </main>
    </div>
  );
}

// --- SOUS-COMPOSANTS OPTIMISÉS ---

function TabButton({ active, onClick, icon, label, count }: any) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex-1 px-5 py-3 rounded-xl flex items-center justify-center gap-3 font-tech text-[10px] font-black uppercase tracking-widest transition-all",
        active 
          ? "bg-primary text-primary-foreground shadow-lg" 
          : "text-muted-foreground/60 hover:text-primary"
      )}
    >
      {icon} <span className="hidden sm:inline">{label}</span>
      {count !== undefined && (
        <span className={cn("ml-1 px-1.5 py-0.5 rounded-md text-[8px]", active ? "bg-white/20" : "bg-border")}>
          {count}
        </span>
      )}
    </button>
  );
}

function MiniStat({ label, value, variant }: { label: string, value: any, variant: 'primary' | 'success' }) {
  const themes = {
    primary: "text-primary border-primary/10 bg-primary/5",
    success: "text-success border-success/10 bg-success/5"
  };
  
  return (
    <div className={cn("p-5 rounded-2xl border-2 flex flex-col shadow-sm", themes[variant])}>
      <p className="font-tech text-[8px] font-black uppercase tracking-widest opacity-60 mb-1">{label}</p>
      <p className="text-3xl font-tech font-black tracking-tighter">{value}</p>
    </div>
  );
}