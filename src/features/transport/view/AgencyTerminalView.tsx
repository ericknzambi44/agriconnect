// src/features/transport/pages/AgencyTerminalView.tsx
import React, { useState } from 'react';
import { useAgencyDashboard } from '../hooks/useAgencyDashboard';
import { 
  Building2, 
  PackageSearch, 
  Truck, 
  CheckCircle2, 
  ArrowRight, 
  Loader2,
  ShieldAlert,
  MapPin,
  Phone,
  User,
  ShoppingBag,
  History
} from 'lucide-react';

export function AgencyTerminalView() {
  const { agency, stats, loading, processing, processCode, confirmAction } = useAgencyDashboard();
  const [inputCode, setInputCode] = useState("");
  const [scannedExp, setScannedExp] = useState<any>(null);

  const handleScan = async () => {
    if (inputCode.length < 6) return;
    const result = await processCode(inputCode);
    if (result) setScannedExp(result);
  };

  const handleConfirm = async () => {
    if (!scannedExp) return;
    const success = await confirmAction(scannedExp.id, scannedExp.actionType);
    if (success) {
      setScannedExp(null);
      setInputCode("");
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#050505]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
        <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">Initialisation Terminal...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-8 font-sans selection:bg-emerald-500/30">
      
      {/* --- HEADER : IDENTITÉ DE L'AGENCE --- */}
      <header className="max-w-7xl mx-auto mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/5">
            <Building2 className="text-emerald-500" size={32} />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-black tracking-tighter uppercase italic">
                PISHOPY<span className="text-emerald-500">.</span>AGENCY
              </h1>
              <span className="px-2 py-0.5 bg-emerald-500 text-[8px] text-black font-black rounded uppercase">Live</span>
            </div>
            <div className="flex items-center gap-2 text-white/50 text-sm font-medium">
              <MapPin size={14} className="text-emerald-500/50" />
              <span className="text-white/80">{agency?.nom_agence || "Agence non reconnue"}</span>
              <span className="text-white/20 px-2">|</span>
              <span className="uppercase text-[10px] tracking-widest">{agency?.ville_agence || "Localisation..."}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-8">
           <div className="text-right hidden md:block">
              <p className="text-[10px] text-white/30 font-black uppercase tracking-widest mb-1">ID Terminal</p>
              <p className="font-mono text-xs text-white/60">{agency?.id?.split('-')[0]}...{agency?.id?.slice(-4)}</p>
           </div>
           <div className="h-10 w-[1px] bg-white/10 hidden md:block" />
           <div className="flex -space-x-2">
              {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-[#050505] bg-white/5" />)}
           </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* --- COLONNE GAUCHE : STATS & INPUT --- */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* GRILLE DE STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard label="Colis à recevoir" value={stats.toReceive} icon={<PackageSearch />} color="emerald" />
            <StatCard label="En attente retrait" value={stats.toDeliver} icon={<Truck />} color="blue" />
            <StatCard label="Opérations terminées" value={stats.completed} icon={<History />} color="white" />
          </div>

          {/* ZONE DE SCAN / TERMINAL */}
          <section className="bg-[#0A0A0A] border border-white/5 rounded-[40px] p-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
               <PackageSearch size={120} />
            </div>

            <div className="relative z-10">
              <h2 className="text-xl font-black mb-8 flex items-center gap-3 uppercase tracking-tight">
                <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
                Saisie de Sécurité
              </h2>
              
              <div className="flex flex-col gap-5">
                <div className="relative">
                  <input 
                    type="text"
                    placeholder="ENTRER CODE (6 CARACTÈRES)"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === 'Enter' && handleScan()}
                    maxLength={6}
                    className="w-full bg-black border-2 border-white/5 rounded-[24px] px-8 py-6 text-center text-4xl font-mono tracking-[0.6em] text-emerald-400 focus:border-emerald-500/50 outline-none transition-all placeholder:text-white/5 placeholder:tracking-normal"
                  />
                </div>
                
                <button 
                  onClick={handleScan}
                  disabled={processing || inputCode.length < 6}
                  className="w-full bg-white text-black hover:bg-emerald-500 transition-all disabled:opacity-20 font-black py-6 rounded-[24px] flex items-center justify-center gap-4 text-lg"
                >
                  {processing ? <Loader2 className="animate-spin" /> : <ArrowRight size={24} />}
                  VÉRIFIER DANS LE SYSTÈME
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* --- COLONNE DROITE : INSPECTION DU COLIS --- */}
        <div className="lg:col-span-4">
          {scannedExp ? (
            <div className="bg-white/5 border border-white/10 rounded-[40px] p-8 sticky top-8 animate-in fade-in zoom-in duration-300">
              {/* Badge Action */}
              <div className={`mb-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                scannedExp.actionType === 'DEPOT' ? 'bg-amber-500/20 text-amber-500 border border-amber-500/20' : 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/20'
              }`}>
                {scannedExp.actionType === 'DEPOT' ? 'Action : Réception Colis' : 'Action : Remise au Client'}
              </div>

              {/* Produit Info */}
              <div className="mb-10">
                <p className="text-white/30 text-[10px] font-black uppercase tracking-widest mb-2">Détails de l'article</p>
                <h3 className="text-2xl font-black leading-tight mb-2 tracking-tighter">
                  {scannedExp.commande?.annonce?.produit?.nom_prod || "Produit Inconnu"}
                </h3>
                <div className="flex items-center gap-4 text-white/60">
                  <span className="flex items-center gap-1.5 text-xs font-bold"><ShoppingBag size={14}/> {scannedExp.commande?.quantite_commandee || 1} Unité(s)</span>
                  <span className="h-4 w-[1px] bg-white/10" />
                  <span className="text-xs font-black text-emerald-500">{scannedExp.commande?.prix_total_commande} USD</span>
                </div>
              </div>

              {/* Client Info */}
              <div className="space-y-6 mb-10">
                 <ContactBlock 
                    title={scannedExp.actionType === 'DEPOT' ? "Expéditeur (Vendeur)" : "Destinataire (Acheteur)"}
                    name={scannedExp.actionType === 'DEPOT' ? `${scannedExp.vendeur?.nom} ${scannedExp.vendeur?.prenom}` : `${scannedExp.acheteur?.nom} ${scannedExp.acheteur?.prenom}`}
                    phone={scannedExp.actionType === 'DEPOT' ? scannedExp.vendeur?.numero_tel : scannedExp.acheteur?.numero_tel}
                 />
                 
                 <div className="pt-6 border-t border-white/5">
                   <p className="text-white/30 text-[10px] font-black uppercase tracking-widest mb-2">Lieu de destination</p>
                   <div className="flex items-start gap-3">
                      <MapPin size={16} className="text-white/40 mt-1" />
                      <p className="text-sm font-medium text-white/80">{scannedExp.destination_ville}, {scannedExp.destination_details}</p>
                   </div>
                 </div>
              </div>

              {/* Confirm Button */}
              <div className="space-y-3">
                <button 
                  onClick={handleConfirm}
                  disabled={processing}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black py-6 rounded-[24px] flex flex-col items-center justify-center shadow-2xl shadow-emerald-500/20 transition-all active:scale-95"
                >
                  <span className="text-sm uppercase">Valider l'opération</span>
                  <span className="text-[9px] opacity-60 font-bold uppercase tracking-widest mt-1">Mise à jour immédiate du stock</span>
                </button>
                
                <button 
                  onClick={() => { setScannedExp(null); setInputCode(""); }}
                  className="w-full text-white/20 hover:text-white/60 text-[10px] font-black uppercase tracking-widest py-3 transition-colors"
                >
                  Annuler et fermer
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[500px] border-2 border-dashed border-white/5 rounded-[40px] flex flex-col items-center justify-center p-12 text-center">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                <ShieldAlert className="text-white/10" size={40} />
              </div>
              <h4 className="text-white/40 font-black uppercase tracking-widest mb-2">Moniteur d'Inspection</h4>
              <p className="text-white/10 text-xs leading-relaxed max-w-[200px]">
                Veuillez saisir un code à 6 chiffres pour accéder aux informations confidentielles du colis.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// --- SOUS-COMPOSANTS ---

function StatCard({ label, value, icon, color }: any) {
  const themes: any = {
    emerald: "text-emerald-500 bg-emerald-500/5 border-emerald-500/10",
    blue: "text-blue-500 bg-blue-500/5 border-blue-500/10",
    white: "text-white bg-white/5 border-white/10"
  };

  return (
    <div className={`p-6 rounded-[32px] border ${themes[color]} transition-all hover:bg-opacity-10`}>
      <div className="mb-4 opacity-80">{React.cloneElement(icon, { size: 24 })}</div>
      <div className="text-3xl font-black tracking-tighter mb-1">{value}</div>
      <div className="text-[10px] font-black uppercase tracking-widest opacity-40">{label}</div>
    </div>
  );
}

function ContactBlock({ title, name, phone }: { title: string, name: string, phone: string }) {
  return (
    <div>
      <p className="text-white/30 text-[10px] font-black uppercase tracking-widest mb-3">{title}</p>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center">
            <User size={14} className="text-white/40" />
          </div>
          <span className="text-sm font-bold text-white/90">{name}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center">
            <Phone size={14} className="text-emerald-500" />
          </div>
          <span className="text-sm font-mono text-emerald-500/80">{phone || "Non renseigné"}</span>
        </div>
      </div>
    </div>
  );
}