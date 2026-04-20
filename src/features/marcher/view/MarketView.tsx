import React, { useState, useEffect, useRef } from 'react';
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
  Loader2, ShoppingBag, Globe, Package, MapPin, Zap, ArrowLeft, CheckCircle2, Target, Megaphone, Sparkles, MoveRight
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
  
  const [forcePromo, setForcePromo] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const filteredResult = useMarketSearch(annonces, searchTerm);

  // --- 🔄 LOGIQUE CARROUSEL AUTO-TOURNANT ---
  useEffect(() => {
    if (activeTab !== 'market' || pendingPayment) return;

    const autoScroll = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        const maxScroll = scrollWidth - clientWidth;
        
        // Si on est à la fin, on revient au début, sinon on avance d'une carte
        const nextScroll = scrollLeft >= maxScroll - 10 ? 0 : scrollLeft + (clientWidth * 0.8);
        
        scrollRef.current.scrollTo({
          left: nextScroll,
          behavior: 'smooth'
        });
      }
    }, 5000); // Tourne toutes les 5 secondes

    return () => clearInterval(autoScroll);
  }, [activeTab, pendingPayment, filteredResult]);

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

    const timer = setTimeout(() => setForcePromo(true), 90000);
    return () => clearTimeout(timer);
  }, [fetchMarket, fetchMesCommandes]);

  const handleConfirmPayment = async () => {
    if (!pendingPayment || !selectedProvider) return;
    if (!shippingData.ville.trim() || !shippingData.details.trim()) {
      toast.error("ERREUR_PROTOCOLE", {
        description: "Coordonnées de livraison manquantes.",
        className: "bg-red-950 border-2 border-red-500 text-white font-tech italic uppercase font-black",
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

  const PromoCard = () => (
    <div className="snap-center shrink-0 w-[85vw] md:w-[450px] h-full py-2">
      <Card className="h-full bg-gradient-to-br from-primary/30 via-secondary to-background border-2 border-primary/40 p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group rounded-[2.5rem] shadow-[0_0_50px_rgba(var(--primary),0.1)]">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse" />
        <Megaphone size={60} className="text-primary mb-6 animate-bounce" />
        <h2 className="text-3xl md:text-5xl font-display font-black uppercase italic leading-none mb-4">
          Toi-même <br />
          <span className="text-primary shadow-glow-primary">tu le crées</span>
        </h2>
        <p className="font-tech text-xs text-muted-foreground uppercase tracking-widest mb-8 max-w-[80%]">
          AgriConnect : La force du réseau pour acheter en gros.
        </p>
        <div className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-display font-black italic text-xs uppercase animate-pulse">
          <Sparkles size={16} /> REJOINDRE LE FLUX
        </div>
      </Card>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/30 overflow-x-hidden font-tech">
      
      <header className="sticky top-0 z-50 w-full bg-secondary/80 backdrop-blur-2xl border-b border-border/50 px-4 py-4 md:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 max-w-[1800px] mx-auto">
          <div className="flex items-center gap-4 self-start">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary shadow-glow-primary -rotate-6">
               <Zap className="text-primary-foreground fill-primary-foreground w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl md:text-3xl font-display font-black uppercase italic tracking-tighter leading-none">AGRI<span className="text-primary">_CONNECT</span></h1>
              <span className="text-[7px] md:text-[9px] text-primary/60 uppercase tracking-[0.5em] font-black italic">nexus_marketplace_v3</span>
            </div>
          </div>

          <nav className="flex items-center bg-black/20 p-1.5 rounded-2xl border border-border/40 w-full sm:w-auto">
            {[{ id: 'market', icon: Globe, label: 'MARCHÉ' }, { id: 'orders', icon: ShoppingBag, label: `ORDRES [${mesCommandes.length}]` }].map((tab) => (
              <button 
                key={tab.id}
                onClick={() => {setActiveTab(tab.id as any); setPendingPayment(null); setPaymentSuccess(false);}} 
                className={cn(
                  "flex-1 sm:flex-none px-6 py-3 rounded-xl font-display font-black uppercase italic text-[10px] tracking-[0.2em] transition-all flex items-center justify-center gap-3",
                  activeTab === tab.id && !pendingPayment ? 'bg-primary text-primary-foreground shadow-glow-primary scale-105' : 'text-muted-foreground/30 hover:text-foreground'
                )}
              >
                <tab.icon size={14} strokeWidth={3} /> {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="w-full flex-1 relative max-w-[1800px] mx-auto">
        {paymentSuccess && (
          <div className="fixed inset-0 flex items-center justify-center p-6 bg-background/98 backdrop-blur-xl z-[100] animate-in fade-in">
            <div className="bg-secondary border-2 border-primary/40 rounded-[3rem] p-12 max-w-lg w-full text-center flex flex-col items-center">
              <CheckCircle2 className="w-20 h-20 text-primary mb-8 animate-pulse" strokeWidth={3} />
              <h2 className="text-3xl font-display font-black uppercase italic mb-2">ORDRE_SYNCHRONISÉ</h2>
              <div className="bg-background/50 border border-border rounded-2xl p-5 w-full mb-8 text-left space-y-2">
                <p className="text-[8px] text-muted-foreground uppercase font-black">_HUB_DESTINATION</p>
                <p className="text-[13px] font-black text-primary truncate italic uppercase">{shippingData.ville}</p>
              </div>
              <button onClick={() => {setPaymentSuccess(false); setActiveTab('orders');}} className="w-full py-5 rounded-2xl bg-primary text-primary-foreground font-display font-black uppercase italic tracking-widest text-xs">VOIR_LE_TRACKING</button>
            </div>
          </div>
        )}

        {pendingPayment ? (
          <div className="max-w-2xl mx-auto space-y-6 py-10 px-4 animate-in slide-in-from-bottom-10 pb-32">
            <button onClick={() => setPendingPayment(null)} className="flex items-center gap-2 text-muted-foreground hover:text-primary font-tech text-[10px] font-black uppercase italic tracking-widest group">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> ANNULER_L_ORDRE
            </button>
            <div className="bg-secondary rounded-[2rem] p-8 space-y-8 border border-primary/20">
              <ShippingForm data={shippingData} agences={agences} onChange={(field, val) => setShippingData(prev => ({ ...prev, [field]: val }))} />
              <PaymentSelector selectedId={selectedProvider} onSelect={setSelectedProvider} phone={phone} onPhoneChange={setPhone} amount={(pendingPayment.annonce.produit?.prix_prod || 0) * pendingPayment.quantite} />
              <button disabled={!selectedProvider || paymentLoading || phone.length < 10} onClick={handleConfirmPayment} className={cn("w-full h-16 rounded-2xl flex items-center justify-center gap-4 font-display font-black uppercase italic tracking-widest text-sm", selectedProvider && phone.length >= 10 ? "bg-primary text-primary-foreground shadow-glow-primary" : "bg-muted/10 text-muted-foreground/20 pointer-events-none")}>
                {paymentLoading ? <Loader2 className="animate-spin" /> : <><Target size={20} /><span>CONFIRMER_LA_TRANSACTION</span></>}
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full pb-20">
            <div className="px-4 py-6 md:px-8 max-w-[1800px] mx-auto">
              <MarketFilterBar categories={categories} onSearch={setSearchTerm} onFilter={(id) => fetchMarket(id)} />
            </div>

            {activeTab === 'market' && (
              /* 🔄 DÉFILEMENT HORIZONTAL FORCÉ & FLUIDE */
              <div 
                ref={scrollRef}
                className="flex flex-nowrap overflow-x-auto snap-x snap-mandatory gap-6 px-4 py-8 md:px-8 no-scrollbar h-[550px] md:h-[650px] items-stretch scroll-smooth"
              >
                {filteredResult.map((annonce) => (
                  <div key={annonce.id} className="snap-center shrink-0 w-[85vw] md:w-[400px] h-full py-2">
                    <Card className="bg-secondary/40 border-2 border-border/50 rounded-[2.5rem] overflow-hidden group hover:border-primary/40 transition-all duration-500 flex flex-col shadow-2xl h-full relative">
                      <div className="relative aspect-[4/3] bg-black overflow-hidden">
                        {annonce.produit?.image ? (
                          <img src={annonce.produit.image} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-110" alt="p" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center opacity-10"><Package size={40} /></div>
                        )}
                        <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 bg-black/60 border border-white/10 rounded-full text-[8px] font-black text-primary tracking-widest uppercase italic">
                          <Target size={10} strokeWidth={3} /> LIVE_STOCK
                        </div>
                        <div className="absolute bottom-4 right-4 bg-primary rounded-2xl px-5 py-2 shadow-glow-primary">
                          <span className="text-primary-foreground font-display font-black italic text-xl">{annonce.produit?.prix_prod}$</span>
                        </div>
                      </div>
                      
                      <div className="p-8 space-y-6 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-display text-[18px] font-black uppercase italic text-foreground tracking-tighter truncate">{annonce.produit?.nom_prod}</h3>
                          <div className="flex items-center gap-2 font-tech text-[10px] text-muted-foreground/60 uppercase font-black tracking-widest mt-1">
                            <MapPin size={12} className="text-primary" /> HUB_ITURI
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center bg-white/5 rounded-xl px-4 py-3 border border-white/5 font-tech">
                            <span className="text-[9px] text-muted-foreground font-bold uppercase italic">VOLUME</span>
                            <span className="text-[11px] text-primary font-black italic">{annonce.quantite_restante} {annonce.produit?.unite}</span>
                          </div>
                          <OrderAnnonceModal annonce={annonce} onOrder={(a, q) => { setPendingPayment({annonce: a, quantite: q}); return Promise.resolve(true); }} loading={loading} />
                        </div>
                      </div>
                    </Card>
                  </div>
                ))}
                <PromoCard />
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-8 animate-in fade-in">
                {mesCommandes.map((cmd: any) => (
                  <Card key={cmd.id} className="bg-secondary/30 border border-border/50 rounded-2xl p-6 flex items-center justify-between gap-4 group">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-14 h-14 bg-background border border-border/40 rounded-xl flex items-center justify-center text-primary/30 group-hover:text-primary transition-colors">
                        <Package size={24} />
                      </div>
                      <div className="leading-tight min-w-0">
                        <h4 className="text-[14px] font-black uppercase italic truncate">{cmd.annonce?.produit?.nom_prod}</h4>
                        <div className="flex gap-3 mt-2 items-center">
                           <span className={cn("text-[7px] px-2 py-0.5 rounded-md font-black uppercase tracking-widest", cmd.statut_paiement === 'PAYEE' ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-black/20 text-muted-foreground/40')}>{cmd.statut_paiement || 'PENDING'}</span>
                           <span className="text-[10px] text-primary font-black italic">{cmd.prix_total_commande}$</span>
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

      <div className="fixed bottom-[-10%] right-[-5%] w-[60%] h-[60%] bg-primary/5 blur-[150px] rounded-full pointer-events-none -z-10" />
    </div>
  );
}