import React, { useState, useEffect } from 'react';
import { useMarketplace, MarketAnnonce } from '../hooks/useMarketplace';
import { useMarketSearch } from '../hooks/useMarketSearch';
import { usePayment } from '../hooks/usePayment'; 
import { supabase } from '@/supabase';
import { MarketFilterBar } from '../components/MarketFilterBar';
import { OrderAnnonceModal } from '../components/OrderAnnonceModal';
import { OrderActionButtons } from '../components/OrderActionButtons';
import { PaymentSelector } from '../components/PaymentSelector'; 
import { ShippingForm } from '../components/ShippingForm';
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { 
  Loader2, ShoppingBag, Globe, Package, MapPin, Zap, ArrowLeft, CheckCircle2, Target, Radio
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function MarketView() {
  const { 
    annonces, mesCommandes, loading, fetchMarket, 
    fetchMesCommandes, annulerCommande, modifierCommande 
  } = useMarketplace();

  const { executeOrderAndPayment, loading: paymentLoading } = usePayment();

  const [categories, setCategories] = useState<any[]>([]);
  const [agences, setAgences] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'market' | 'orders'>('market');
  const [searchTerm, setSearchTerm] = useState("");
  
  const [pendingPayment, setPendingPayment] = useState<{annonce: MarketAnnonce, quantite: number} | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<'mpesa' | 'airtel' | 'orange' | null>(null);
  const [phone, setPhone] = useState("");
  
  const [shippingData, setShippingData] = useState({ ville: '', details: '', agenceId: '' });
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const filteredResult = useMarketSearch(annonces, searchTerm);

  useEffect(() => {
    const init = async () => {
      const { data: catData } = await supabase.from('categorie').select('*').order('libelle_categorie');
      if (catData) setCategories(catData);
      
      const { data: agenceData } = await supabase.from('agence').select('*');
      if (agenceData) setAgences(agenceData);

      fetchMarket();
      fetchMesCommandes();
    };
    init();
  }, [fetchMarket, fetchMesCommandes]);

  const handleInitiateOrder = async (annonce: MarketAnnonce, quantite: number): Promise<boolean> => {
    setPendingPayment({ annonce, quantite });
    setPaymentSuccess(false);
    return true; 
  };

  const handleConfirmPayment = async () => {
    if (!pendingPayment || !selectedProvider) return;
    if (!shippingData.ville.trim() || !shippingData.details.trim()) {
      toast.error("ERREUR_ADRESSE", {
        description: "Protocole de livraison incomplet. Spécifiez la ville et les précisions.",
        className: "bg-red-950 border-2 border-red-500 text-white font-tech italic font-black uppercase tracking-widest",
      });
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

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
      phone: phone,
      amount: orderData.total,
      provider: selectedProvider.toUpperCase() as any
    });

    if (result?.success) {
      setPaymentSuccess(true);
      await fetchMesCommandes();
      await fetchMarket();
    }
  };

  const resetAndGoToOrders = () => {
    setPendingPayment(null);
    setPaymentSuccess(false);
    setShippingData({ ville: '', details: '', agenceId: '' });
    setSelectedProvider(null);
    setPhone("");
    setActiveTab('orders');
  };

  return (
    // ON RETIRE h-screen ET overflow-hidden POUR QUE ÇA S'ADAPTE AU LAYOUT PARENT
    <div className="w-full min-h-full bg-background text-foreground flex flex-col selection:bg-primary/30">
      
      {/* 🚀 HEADER : STICKY POUR RESTER ACCESSIBLE AU SCROLL */}
      <header className="sticky top-0 flex items-center justify-between px-6 py-4 bg-secondary/80 backdrop-blur-xl border-b-2 border-border shrink-0 z-30">
        <div className="flex items-center gap-5">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary shadow-glow-primary rotate-3">
             <Zap className="text-primary-foreground fill-primary-foreground w-5 h-5" />
          </div>
          <div className="leading-none">
            <h1 className="text-2xl font-display font-black uppercase italic tracking-tighter leading-none">
              AGRI<span className="text-primary">_CONNECT</span>
            </h1>
            <p className="font-tech text-[8px] text-muted-foreground uppercase tracking-[0.4em] mt-1 font-black italic">Terminal_V4.0_Flux</p>
          </div>
        </div>

        <nav className="flex items-center bg-background p-1.5 rounded-2xl border-2 border-border shadow-inner">
          {[
            { id: 'market', icon: Globe, label: 'MARCHÉ' },
            { id: 'orders', icon: ShoppingBag, label: `ORDRES (${mesCommandes.length})` }
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => {setActiveTab(tab.id as any); setPendingPayment(null); setPaymentSuccess(false);}} 
              className={cn(
                "px-6 py-2.5 rounded-[0.8rem] font-display font-black uppercase italic text-[10px] tracking-widest transition-all flex items-center gap-3",
                activeTab === tab.id && !pendingPayment ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground/40 hover:text-foreground'
              )}
            >
              <tab.icon size={14} strokeWidth={3} /> {tab.label}
            </button>
          ))}
        </nav>
      </header>

      {/* 🔍 FILTRES */}
      {!pendingPayment && !paymentSuccess && (
        <div className="w-full px-6 py-6 bg-background/50 border-b-2 border-border/40">
          <MarketFilterBar categories={categories} onSearch={setSearchTerm} onFilter={(id) => fetchMarket(id)} />
        </div>
      )}

      {/* CONTENU SANS h-full POUR REMPLIR L'ESPACE DU PARENT */}
      <main className="w-full flex-1 p-6 relative">
        
        {/* 🎉 ÉCRAN SUCCÈS FULL OVERLAY */}
        {paymentSuccess && (
          <div className="fixed inset-0 flex items-center justify-center p-6 bg-background/95 backdrop-blur-md z-[100]">
            <div className="bg-secondary border-2 border-primary/30 rounded-[2.5rem] p-10 max-w-md w-full text-center flex flex-col items-center animate-in zoom-in-95 shadow-glow-primary/10">
              <div className="w-24 h-24 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center mb-8 animate-pulse shadow-glow-primary/20">
                <CheckCircle2 className="w-12 h-12 text-primary" strokeWidth={3} />
              </div>
              <h2 className="text-3xl font-display font-black uppercase italic text-foreground mb-2 italic">FLUX_VALIDE !</h2>
              <p className="font-tech text-[10px] text-primary font-black mb-8 uppercase tracking-[0.3em] italic">_SÉQUESTRE_ACTIF_SYNCHRONISÉ</p>
              <div className="bg-background border-2 border-border rounded-2xl p-5 w-full mb-8 text-left space-y-2 font-tech uppercase">
                <p className="text-[8px] text-muted-foreground font-black tracking-widest leading-none">DESTINATION_FINALE_NODE :</p>
                <p className="text-xs font-black text-primary truncate italic pt-1 tracking-tighter">{shippingData.ville}</p>
                <p className="text-[10px] text-muted-foreground truncate italic">{shippingData.details}</p>
              </div>
              <button onClick={resetAndGoToOrders} className="w-full py-5 rounded-2xl bg-primary text-primary-foreground font-display font-black uppercase italic tracking-widest text-xs shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all">
                TRACKING_LOGISTIQUE
              </button>
            </div>
          </div>
        )}

        {pendingPayment ? (
          /* 💸 TUNNEL PAIEMENT */
          <div className="max-w-3xl mx-auto space-y-6 py-4 animate-in fade-in slide-in-from-bottom-6 duration-500 pb-24">
            <button onClick={() => setPendingPayment(null)} className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-all mb-4 font-tech text-[9px] font-black uppercase tracking-widest italic group">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              RÉVOQUER_ET_RETOURNER
            </button>
            <ShippingForm data={shippingData} agences={agences} onChange={(field, val) => setShippingData(prev => ({ ...prev, [field]: val }))} />
            <PaymentSelector selectedId={selectedProvider} onSelect={setSelectedProvider} phone={phone} onPhoneChange={setPhone} amount={(pendingPayment.annonce.produit?.prix_prod || 0) * pendingPayment.quantite} />
            <button
              disabled={!selectedProvider || paymentLoading || phone.length < 10}
              onClick={handleConfirmPayment}
              className={cn(
                "w-full h-16 rounded-[1.5rem] flex items-center justify-center gap-4 transition-all duration-500 mt-8 font-display font-black uppercase italic tracking-[0.2em] text-[11px]",
                selectedProvider && phone.length >= 10 ? "bg-primary text-primary-foreground shadow-glow-primary hover:scale-[1.01]" : "bg-secondary text-muted-foreground/30 border-2 border-border grayscale pointer-events-none"
              )}
            >
              {paymentLoading ? <Loader2 size={20} className="animate-spin" /> : <><Target size={18} /><span>INITIER_ORDRE_PAIEMENT</span></>}
            </button>
          </div>
        ) : (
          /* 🛒 MARCHÉ / ORDRES (FULL WIDTH GRID) */
          <div className="w-full space-y-8 pb-10">
            {activeTab === 'market' && (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-6">
                {filteredResult.map((annonce) => (
                  <Card key={annonce.id} className="bg-secondary border-2 border-border rounded-[1.8rem] overflow-hidden group hover:border-primary/50 transition-all flex flex-col shadow-lg">
                    <div className="relative aspect-square bg-background">
                      {annonce.produit?.image ? (
                        <img src={annonce.produit.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="p" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center opacity-10"><Package size={40} /></div>
                      )}
                      <div className="absolute bottom-3 right-3 bg-secondary border-2 border-primary rounded-xl px-3 py-1.5 shadow-xl backdrop-blur-md">
                        <span className="text-primary font-display font-black italic text-sm">{annonce.produit?.prix_prod}$</span>
                      </div>
                    </div>
                    <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                      <div className="space-y-1">
                        <h3 className="font-display text-[12px] font-black uppercase italic text-foreground truncate">{annonce.produit?.nom_prod}</h3>
                        <div className="flex items-center gap-2 pt-1 font-tech text-[8px] text-muted-foreground uppercase font-black tracking-widest">
                          <MapPin size={10} className="text-primary" /> ITURI_SECTOR_SYNC
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center bg-background/50 rounded-lg px-2 py-1.5 border border-border font-tech">
                          <span className="text-[8px] text-muted-foreground font-bold uppercase tracking-widest italic">STOCK</span>
                          <span className="text-[9px] text-primary font-black italic">{annonce.quantite_restante} {annonce.produit?.unite}</span>
                        </div>
                        <OrderAnnonceModal annonce={annonce} onOrder={handleInitiateOrder} loading={loading} />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                {mesCommandes.map((cmd: any) => (
                  <Card key={cmd.id} className="bg-secondary border-2 border-border rounded-2xl p-5 flex items-center justify-between gap-5">
                    <div className="flex items-center gap-4 min-w-0 font-display">
                      <div className="w-12 h-12 bg-background border-2 border-border rounded-xl flex items-center justify-center text-primary shadow-inner">
                        <Package size={20} />
                      </div>
                      <div className="leading-none min-w-0">
                        <h4 className="text-[13px] font-black uppercase italic truncate">{cmd.annonce?.produit?.nom_prod}</h4>
                        <div className="flex gap-2 mt-2 items-center font-tech italic">
                           <span className={cn("text-[7px] px-2 py-1 rounded-md font-black uppercase tracking-widest", cmd.statut_paiement === 'PAYEE' ? 'bg-primary text-primary-foreground' : 'bg-background border-2 border-border text-muted-foreground/50')}>
                             {cmd.statut_paiement || 'WAITING_SIG'}
                           </span>
                           <span className="text-[9px] text-primary/40 font-bold">{cmd.prix_total_commande}$</span>
                        </div>
                      </div>
                    </div>
                    <OrderActionButtons status={cmd.statut} onCancel={() => annulerCommande(cmd.id)} onEdit={() => modifierCommande(cmd.id, cmd.quantite_commandee, cmd.annonce as any)} />
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* 🔮 BACKGROUND EFFECTS FIXES */}
      <div className="fixed bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />
    </div>
  );
}