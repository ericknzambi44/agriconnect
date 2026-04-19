// src/features/transport/pages/AgencyTerminalView.tsx
import React, { useState } from 'react';
import { useAgencyDashboard } from '../hooks/useAgencyDashboard';
import { 
  Building2, PackageSearch, Truck, ArrowRight, Loader2,
  MapPin, Phone, User, ShoppingBag, History, Radar, Globe, 
  ShieldCheck, LayoutDashboard, Zap, Hash, CheckCircle2
} from 'lucide-react';

const cardStyle = "bg-[#0A0A0A] border border-white/5 rounded-[32px] overflow-hidden transition-all duration-300 hover:border-white/10";

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
    <div className="flex flex-col items-center justify-center py-20 min-h-[60vh]">
      <Loader2 className="w-12 h-12 text-[#FACC15] animate-spin mb-4" />
      <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.5em] animate-pulse font-mono">
        Synchronisation ...
      </p>
    </div>
  );

  const isDepot = scannedExp?.actionType === 'DEPOT';
  const actionColor = isDepot ? 'text-[#FACC15]' : 'text-[#10B981]';
  const actionBg = isDepot ? 'bg-[#FACC15]' : 'bg-[#10B981]';
  
  const clientData = isDepot ? scannedExp?.vendeur : scannedExp?.acheteur;
  const clientRole = isDepot ? "Vendeur (Dépôt)" : "Acheteur (Retrait)";

  return (
    // AJUSTEMENT : Ajout de pt-4 md:pt-2 pour éviter que le haut soit collé/caché
    <div className="w-full min-h-full flex flex-col selection:bg-[#FACC15]/30 font-sans pb-24 pt-4 md:pt-2 relative z-10">
      
      {/* HEADER : Structure robuste pour ne pas être cachée */}
      <header className="w-full mb-10 flex flex-col lg:flex-row justify-between items-start lg:items-end border-b border-white/5 pb-10 gap-8">
        <div className="flex items-center gap-6">
          <div className="relative group flex-shrink-0">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#FACC15] to-amber-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative w-16 h-16 bg-black border border-white/10 rounded-2xl flex items-center justify-center shadow-xl">
              <Building2 className="text-[#FACC15]" size={32} />
            </div>
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
               <h1 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter leading-none text-white truncate">
                {agency?.nom_agence || 'PISHOPY'}<span className="text-[#FACC15]">.</span> RDC
              </h1>
              <span className="bg-[#FACC15] text-black text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg shadow-[#FACC15]/10">Terminal</span>
            </div>
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.3em] mt-2 flex items-center gap-2">
              <MapPin size={12} className="text-[#FACC15]/50" /> {agency?.ville_agence || 'Localisation...'}
            </p>
          </div>
        </div>

        <nav className="flex bg-white/5 p-1.5 rounded-2xl border border-white/5 backdrop-blur-xl w-full lg:w-auto">
          <TabButton 
            active={activeTab === 'terminal'} 
            onClick={() => setActiveTab('terminal')} 
            icon={<LayoutDashboard size={16}/>} 
            label="Terminal" 
          />
          <TabButton 
            active={activeTab === 'market'} 
            onClick={() => setActiveTab('market')} 
            icon={<Radar size={16}/>} 
            label="Flux" 
            count={opportunities.length}
          />
        </nav>
      </header>

      {/* CONTENU PRINCIPAL */}
      <main className="w-full flex-1">
        {activeTab === 'terminal' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            
            <div className="lg:col-span-7 space-y-8 flex flex-col">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <MiniStat label="En Transit vers ici" value={myStats.toDeliver} icon={<Truck size={18}/>} color="blue" />
                <MiniStat label="Livraisons Effectuées" value={myStats.completed} icon={<History size={18}/>} color="emerald" />
              </div>

              <section className={`${cardStyle} p-8 md:p-12 relative group shadow-2xl shadow-black flex-1 flex flex-col justify-center min-h-[400px]`}>
                <div className="absolute top-0 right-0 p-8 opacity-5">
                   <ShieldCheck size={120} />
                </div>
                
                <div className="relative z-10 w-full max-w-2xl mx-auto">
                  <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-8 flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-[#FACC15] rounded-full animate-ping" />
                    Scan de Code Sécurisé
                  </h2>
                  
                  <div className="space-y-6">
                    <div className="relative">
                      <Hash className="absolute left-6 top-1/2 -translate-y-1/2 text-white/10" size={32} />
                      <input 
                        type="text"
                        value={inputCode}
                        onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                        onKeyDown={(e) => e.key === 'Enter' && handleScan()}
                        className="w-full bg-[#050505] border-2 border-white/5 rounded-3xl py-10 md:py-12 pl-20 pr-8 text-center text-4xl md:text-6xl font-mono font-black tracking-[0.4em] text-[#FACC15] focus:border-[#FACC15]/50 outline-none transition-all placeholder:text-white/5 shadow-inner"
                        placeholder="000000"
                        autoComplete="off"
                      />
                    </div>
                    
                    <button 
                      onClick={handleScan}
                      disabled={processing || inputCode.length < 6}
                      className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 font-black py-6 md:py-8 rounded-3xl flex items-center justify-center gap-4 text-sm md:text-lg transition-transform active:scale-95 disabled:opacity-50"
                    >
                      {processing ? <Loader2 className="animate-spin text-[#FACC15]" /> : <ArrowRight className="text-[#FACC15]" size={24} />}
                      IDENTIFIER LE COLIS
                    </button>
                  </div>
                </div>
              </section>
            </div>

            <div className="lg:col-span-5 h-full min-h-[500px]">
              {scannedExp ? (
                <div className={`p-1 h-full rounded-[40px] shadow-2xl animate-in zoom-in-95 duration-300 ${actionBg}`}>
                  <div className="bg-[#0A0A0A] rounded-[38px] p-8 text-white h-full border border-white/10 flex flex-col justify-between gap-8">
                    
                    <div className="flex justify-between items-start">
                       <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full ${isDepot ? 'bg-[#FACC15]/10 text-[#FACC15]' : 'bg-[#10B981]/10 text-[#10B981]'}`}>
                         {isDepot ? <PackageSearch size={14} /> : <CheckCircle2 size={14} />}
                         <span className="text-[10px] font-black uppercase tracking-widest leading-none">
                           {isDepot ? 'Dépôt Vendeur' : 'Retrait Acheteur'}
                         </span>
                       </div>
                       <button onClick={() => setScannedExp(null)} className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-colors">✕</button>
                    </div>

                    <div className="space-y-6 flex-1 flex flex-col justify-center">
                      <div className="p-8 bg-[#050505] rounded-3xl border border-white/5">
                        <p className="text-white/30 text-[9px] font-black uppercase tracking-widest mb-2">Colis: #{scannedExp.id.substring(0,8)}</p>
                        <h3 className="text-2xl md:text-3xl font-black tracking-tighter leading-tight mb-4 truncate">
                          {scannedExp.commande?.annonce?.produit?.nom_prod || `Produit Pishopy`}
                        </h3>
                        <div className="flex items-center gap-6 border-t border-white/5 pt-6">
                            <span className="text-xs font-bold text-white/50">{scannedExp.commande?.quantite_commandee || 1} Unité(s)</span>
                            <span className={`text-xl font-black font-mono ${actionColor}`}>
                              {scannedExp.commande?.prix_total_commande || 0} USD
                            </span>
                        </div>
                      </div>

                      <div className="p-8 bg-white/5 rounded-3xl border border-white/5 flex flex-col gap-6">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">{clientRole}</span>
                            <User size={18} className="text-white/20" />
                          </div>
                          <p className="font-bold text-xl md:text-2xl">{clientData?.nom || "Utilisateur"}</p>
                          
                          <div className="flex items-center justify-between bg-[#050505] p-5 rounded-2xl border border-white/5">
                            <span className="font-mono text-white text-lg font-bold tracking-wider">
                              {clientData?.numero_tel || "N/A"}
                            </span>
                            {clientData?.numero_tel && (
                              <a href={`tel:${clientData?.numero_tel}`} className={`p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors ${actionColor}`}>
                                <Phone size={20} />
                              </a>
                            )}
                          </div>
                      </div>
                    </div>

                    <button 
                      onClick={handleConfirm}
                      disabled={processing}
                      className={`w-full ${isDepot ? 'bg-[#FACC15]' : 'bg-[#10B981]'} hover:opacity-90 text-black font-black py-6 md:py-8 rounded-3xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 text-lg`}
                    >
                      {processing ? <Loader2 className="animate-spin" /> : <ShieldCheck size={28} />}
                      {isDepot ? "CONFIRMER DÉPÔT" : "CONFIRMER LIVRAISON"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="h-full min-h-[500px] border-2 border-dashed border-white/10 rounded-[40px] flex flex-col items-center justify-center text-center p-12 relative overflow-hidden bg-white/[0.01]">
                   <div className="w-20 h-20 bg-white/[0.02] border border-white/5 rounded-full flex items-center justify-center mb-6 relative z-10 shadow-inner">
                      <Zap size={32} className="text-white/10" />
                   </div>
                   <p className="text-white/20 font-black uppercase text-[10px] tracking-[0.4em] leading-relaxed relative z-10">
                     Système Pishopy Actif <br/> En attente de scan
                   </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-[#FACC15]/10 rounded-2xl border border-[#FACC15]/20 shadow-lg shadow-[#FACC15]/5">
                    <Radar className="text-[#FACC15] animate-spin-slow" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black uppercase tracking-tighter text-white">Flux du Réseau</h2>
                    <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">Colis en attente</p>
                  </div>
                </div>
                <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl flex items-center gap-3 w-fit">
                   <Globe size={16} className="text-[#FACC15]" />
                   <span className="font-mono font-black text-xs text-white uppercase tracking-tighter">{opportunities.length} OPPORTUNITÉS</span>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {opportunities.map((opp) => (
                  <div key={opp.id} className={`${cardStyle} group relative flex flex-col h-full shadow-xl shadow-black`}>
                    <div className="p-8 flex-1">
                      <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5">
                          <ShoppingBag className="text-[#FACC15]/50" size={24} />
                        </div>
                        <p className="text-2xl font-black text-[#10B981] font-mono">
                          {opp.commande?.prix_total_commande || 0}$
                        </p>
                      </div>
                      <h4 className="text-lg font-black text-white/90 leading-tight mb-4 group-hover:text-[#FACC15] transition-colors line-clamp-2">
                        {opp.commande?.annonce?.produit?.nom_prod || `Produit`}
                      </h4>
                      <div className="space-y-3 pt-4 border-t border-white/5 text-[10px] font-bold text-white/40 uppercase">
                        <div className="flex items-center gap-3">
                          <MapPin size={12} className="text-[#FACC15]/50" />
                          <span className="truncate">Vers : {opp.destination_ville}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <User size={12} className="text-[#FACC15]/50" />
                          <span className="truncate">De : {opp.vendeur?.nom}</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-2 border-t border-white/5 bg-[#050505]">
                      <a href={`tel:${opp.vendeur?.numero_tel}`} className="w-full bg-white/5 hover:bg-white hover:text-black py-4 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase transition-all">
                        <Phone size={14} /> Contacter Vendeur
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
        .animate-spin-slow { animation: spin-slow 12s linear infinite; }
      `}</style>
    </div>
  );
}

// --- SOUS-COMPOSANTS ---

function TabButton({ active, onClick, icon, label, count }: any) {
  return (
    <button 
      onClick={onClick}
      className={`flex-1 lg:flex-none px-6 py-4 rounded-xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest transition-all ${
        active ? 'bg-white text-black shadow-2xl scale-105' : 'text-white/40 hover:text-white hover:bg-white/5'
      }`}
    >
      {icon} {label}
      {count !== undefined && (
        <span className={`ml-1 px-2 py-0.5 rounded-full text-[8px] ${active ? 'bg-black text-white' : 'bg-white/10 text-white/40'}`}>
          {count}
        </span>
      )}
    </button>
  );
}

function MiniStat({ label, value, icon, color }: any) {
  const colors: any = {
    blue: "text-blue-400 bg-blue-400/5 border-blue-400/10",
    emerald: "text-[#10B981] bg-[#10B981]/5 border-[#10B981]/10"
  };
  return (
    <div className={`p-8 rounded-3xl border ${colors[color]} flex items-center justify-between shadow-xl`}>
      <div className="min-w-0">
        <p className="text-[8px] font-black uppercase tracking-[0.2em] opacity-50 mb-1 truncate">{label}</p>
        <p className="text-3xl md:text-4xl font-black tracking-tighter leading-none">{value}</p>
      </div>
      <div className="opacity-20 scale-125 flex-shrink-0 ml-4">{icon}</div>
    </div>
  );
}