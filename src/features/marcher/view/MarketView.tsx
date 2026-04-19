import React, { useState, useEffect } from 'react';
import { useMarketplace, MarketAnnonce } from '../hooks/useMarketplace';
import { useMarketSearch } from '../hooks/useMarketSearch';
import { usePayment } from '../hooks/usePayment'; 
import { supabase } from '@/supabase';
import { MarketFilterBar } from '../components/MarketFilterBar';
import { OrderAnnonceModal } from '../components/OrderAnnonceModal';
import { OrderActionButtons } from '../components/OrderActionButtons';
import { PaymentSelector } from '../components/PaymentSelector'; 
import { ShippingForm } from '../components/ShippingForm'; // NOUVEAU COMPOSANT
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { 
  Loader2, ShoppingBag, Globe, Package, MapPin, Zap, ArrowLeft, CheckCircle2 
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function MarketView() {
  const { 
    annonces, mesCommandes, loading, fetchMarket, 
    fetchMesCommandes, annulerCommande, modifierCommande 
  } = useMarketplace();

  const { executeOrderAndPayment, loading: paymentLoading } = usePayment();

  const [categories, setCategories] = useState<any[]>([]);
  const [agences, setAgences] = useState<any[]>([]); // ÉTAT POUR LES AGENCES
  const [activeTab, setActiveTab] = useState<'market' | 'orders'>('market');
  const [searchTerm, setSearchTerm] = useState("");
  
  const [pendingPayment, setPendingPayment] = useState<{annonce: MarketAnnonce, quantite: number} | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<'mpesa' | 'airtel' | 'orange' | null>(null);
  
  // ÉTAT DE LIVRAISON ET DE SUCCÈS
  const [shippingData, setShippingData] = useState({ ville: '', details: '', agenceId: '' });
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const filteredResult = useMarketSearch(annonces, searchTerm);

  useEffect(() => {
    const init = async () => {
      // Charger les catégories
      const { data: catData } = await supabase.from('categorie').select('*').order('libelle_categorie');
      if (catData) setCategories(catData);
      
      // Charger les agences
      const { data: agenceData } = await supabase.from('agence').select('*');
      if (agenceData) setAgences(agenceData);

      fetchMarket();
      fetchMesCommandes();
    };
    init();
  }, [fetchMarket, fetchMesCommandes]);

  const handleInitiateOrder = async (annonce: MarketAnnonce, quantite: number): Promise<any> => {
    setPendingPayment({ annonce, quantite });
    setPaymentSuccess(false); // Reset au cas où
    return true; 
  };

  const handleConfirmPayment = async () => {
    if (!pendingPayment || !selectedProvider) return;

    // VALIDATION STRICTE DE L'ADRESSE
    if (!shippingData.ville.trim() || !shippingData.details.trim()) {
      toast.error("ADRESSE INCOMPLÈTE", {
        description: "Êtes-vous sûr de votre adresse ? Une mauvaise adresse peut entraîner la perte de votre colis. Veuillez remplir la ville et les précisions.",
        className: "bg-red-950 border-red-500 text-white font-black italic",
        duration: 5000,
      });
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // INJECTION DES DONNÉES DE LIVRAISON POUR LE TRIGGER
    const orderData = {
      annonce_id: pendingPayment.annonce.id,
      acheteur_id: user.id,
      quantite: pendingPayment.quantite,
      total: (pendingPayment.annonce.produit?.prix_prod || 0) * pendingPayment.quantite,
      destination_ville: shippingData.ville,
      destination_details: shippingData.details,
      id_agence_retrait: shippingData.agenceId || null
    };

    const result = await executeOrderAndPayment(orderData, {
      phone: "000000000", // À dynamiser si besoin
      amount: orderData.total,
      provider: selectedProvider.toUpperCase() as any
    });

    if (result?.success) {
      setPaymentSuccess(true); // Déclenche l'animation de succès
      await fetchMesCommandes();
      await fetchMarket();
    }
  };

  const resetAndGoToOrders = () => {
    setPendingPayment(null);
    setPaymentSuccess(false);
    setShippingData({ ville: '', details: '', agenceId: '' });
    setSelectedProvider(null);
    setActiveTab('orders');
  };

  return (
    <div className="h-screen bg-[#020202] text-white flex flex-col overflow-hidden selection:bg-emerald-500 font-sans">
      
      {/* HEADER COMPACT */}
      <header className="flex items-center justify-between px-4 py-3 bg-[#080808] border-b border-white/5 shrink-0 z-10">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]">
             <Zap className="text-black fill-black w-4 h-4" />
          </div>
          <h1 className="text-xl font-black uppercase italic tracking-tighter">
            AGRI<span className="text-emerald-500">Market</span>
          </h1>
        </div>

        <nav className="flex items-center bg-black/40 p-1 rounded-xl border border-white/5">
          <button onClick={() => {setActiveTab('market'); setPendingPayment(null); setPaymentSuccess(false);}} className={cn("px-4 py-2 rounded-lg font-black uppercase italic text-[9px] tracking-widest transition-all flex items-center gap-2", activeTab === 'market' && !pendingPayment ? 'bg-emerald-500 text-black' : 'text-white/30')}>
            <Globe className="w-3 h-3" /> MARCHÉ
          </button>
          <button onClick={() => {setActiveTab('orders'); setPendingPayment(null); setPaymentSuccess(false);}} className={cn("px-4 py-2 rounded-lg font-black uppercase italic text-[9px] tracking-widest transition-all flex items-center gap-2", activeTab === 'orders' ? 'bg-emerald-500 text-black' : 'text-white/30')}>
            <ShoppingBag className="w-3 h-3" /> ORDRES ({mesCommandes.length})
          </button>
        </nav>
      </header>

      {/* FILTRES */}
      {!pendingPayment && !paymentSuccess && (
        <div className="px-4 py-2 bg-[#050505] border-b border-white/5 shrink-0">
          <MarketFilterBar categories={categories} onSearch={setSearchTerm} onFilter={(id) => fetchMarket(id)} />
        </div>
      )}

      <main className="flex-1 overflow-y-auto p-4 no-scrollbar relative">
        
        {/* ÉCRAN DE SUCCÈS MAGNIFIQUE */}
        {paymentSuccess ? (
          <div className="absolute inset-0 flex items-center justify-center p-4 bg-[#020202]/80 backdrop-blur-sm z-50">
            <div className="bg-[#050505] border border-emerald-500/30 rounded-3xl p-8 max-w-sm w-full text-center flex flex-col items-center animate-in zoom-in-95 fade-in duration-700 shadow-[0_0_50px_rgba(16,185,129,0.1)]">
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6 animate-[pulse_2s_ease-in-out_infinite]">
                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
              </div>
              <h2 className="text-2xl font-black uppercase italic text-white mb-2 tracking-tighter">
                Félicitations !
              </h2>
              <p className="text-sm text-emerald-500/80 font-mono mb-6 uppercase tracking-widest">
                Opération Séquestre Réussie
              </p>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 w-full mb-6 text-left">
                <p className="text-[10px] text-white/50 uppercase font-black mb-1">Destination du colis :</p>
                <p className="text-xs font-mono text-white truncate">{shippingData.ville}</p>
                <p className="text-xs text-white/70 truncate">{shippingData.details}</p>
              </div>
              <button
                onClick={resetAndGoToOrders}
                className="w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase italic tracking-widest text-xs transition-all active:scale-95 shadow-lg shadow-emerald-900/20"
              >
                Suivre mon colis
              </button>
            </div>
          </div>
        ) : pendingPayment ? (
          
          /* --- TUNNEL DE PAIEMENT SÉQUESTRE --- */
          <div className="max-w-2xl mx-auto space-y-6 py-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            <button onClick={() => setPendingPayment(null)} className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-4 group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest italic">Annuler_Et_Retourner</span>
            </button>

            {/* SHIPPING FORM */}
            <ShippingForm 
              data={shippingData} 
              agences={agences}
              onChange={(field, val) => setShippingData(prev => ({ ...prev, [field]: val }))}
            />

            <div className="h-px w-full bg-white/5 my-6"></div>

            <PaymentSelector 
              selectedId={selectedProvider} 
              onSelect={setSelectedProvider} 
              amount={(pendingPayment.annonce.produit?.prix_prod || 0) * pendingPayment.quantite} 
            />

            <button
              disabled={!selectedProvider || paymentLoading}
              onClick={handleConfirmPayment}
              className={cn(
                "w-full py-5 rounded-2xl flex items-center justify-center gap-3 transition-all duration-500 mt-6",
                selectedProvider ? "bg-emerald-500 text-black shadow-[0_10px_30px_rgba(16,185,129,0.2)] hover:bg-emerald-400" : "bg-white/5 text-white/20 grayscale pointer-events-none border border-white/5"
              )}
            >
              {paymentLoading ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-[10px] font-black uppercase italic tracking-[0.2em]">Sécurisation_Des_Fonds...</span>
                </div>
              ) : (
                <span className="text-xs font-black uppercase italic tracking-widest">Confirmer_Le_Paiement</span>
              )}
            </button>
          </div>
        ) : (
          <div className="max-w-[1600px] mx-auto">
            {/* L'affichage du Market et des Orders reste identique... */}
            {activeTab === 'market' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {filteredResult.map((annonce) => (
                  <Card key={annonce.id} className="bg-[#0A0A0A] border border-white/5 rounded-2xl overflow-hidden group hover:border-emerald-500/40 transition-all flex flex-col">
                    <div className="relative aspect-square overflow-hidden bg-white/5">
                      {annonce.produit?.image ? (
                        <img src={annonce.produit.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="p" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center opacity-10"><Package className="w-6 h-6" /></div>
                      )}
                      <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-md rounded-lg px-2 py-1 border border-white/10">
                        <span className="text-emerald-500 font-black italic text-xs">{annonce.produit?.prix_prod}$</span>
                      </div>
                    </div>

                    <div className="p-3 space-y-3 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-[11px] font-black uppercase italic text-white truncate leading-tight">{annonce.produit?.nom_prod}</h3>
                        <div className="flex items-center gap-1 mt-1 opacity-40">
                          <MapPin className="w-2.5 h-2.5" />
                          <span className="text-[7px] font-mono uppercase tracking-tighter">LOC_SYNC_OK</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-[8px] font-mono text-emerald-500/60 uppercase">
                          <span>Stock</span>
                          <span>{annonce.quantite_restante} {annonce.produit?.unite}</span>
                        </div>
                        <OrderAnnonceModal 
                          annonce={annonce} 
                          onOrder={handleInitiateOrder} 
                          loading={loading} 
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mesCommandes.map((cmd: any) => (
                  <Card key={cmd.id} className="bg-[#0A0A0A] border border-white/5 rounded-xl p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-500 shadow-inner">
                        <Package className="w-5 h-5" />
                      </div>
                      <div className="leading-none">
                        <h4 className="text-xs font-black uppercase italic text-white">{cmd.annonce?.produit?.nom_prod}</h4>
                        <div className="flex gap-2 mt-1 items-center">
                           <span className={cn(
                             "text-[6px] px-1.5 py-0.5 rounded font-black uppercase tracking-widest",
                             cmd.statut_paiement === 'PAYEE' ? 'bg-emerald-500 text-black' : 'bg-white/5 text-white/40 border border-white/5'
                           )}>
                             {cmd.statut_paiement || 'EN_ATTENTE'}
                           </span>
                           <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">{cmd.prix_total_commande}$ — {cmd.quantite_commandee}qty</span>
                        </div>
                      </div>
                    </div>
                    <OrderActionButtons 
                       status={cmd.statut} 
                       onCancel={() => annulerCommande(cmd.id)} 
                       onEdit={() => modifierCommande(cmd.id, cmd.quantite_commandee, cmd.annonce as any)}
                    />
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}