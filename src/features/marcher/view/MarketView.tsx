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
  Loader2, ShoppingBag, Globe, Package, MapPin, Zap, ArrowLeft, CheckCircle2, Target, Megaphone, Sparkles
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
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const filteredResult = useMarketSearch(annonces, searchTerm);

  // --- 🔄 AUTO-SCROLL INTELLIGENT ---
  useEffect(() => {
    if (activeTab !== 'market' || pendingPayment || filteredResult.length === 0) return;
    const autoScroll = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        const nextScroll = scrollLeft >= (scrollWidth - clientWidth - 10) ? 0 : scrollLeft + (clientWidth * 0.8);
        scrollRef.current.scrollTo({ left: nextScroll, behavior: 'smooth' });
      }
    }, 6000);
    return () => clearInterval(autoScroll);
  }, [activeTab, pendingPayment, filteredResult]);

  useEffect(() => {
    const init = async () => {
      const [{ data: catData }, { data: agenceData }] = await Promise.all([
        supabase.from('categorie').select('*').order('libelle_categorie'),
        supabase.from('agence').select('*')
      ]);
      if (catData) setCategories(catData);
      if (agenceData) setAgences(agenceData);
      fetchMarket();
      fetchMesCommandes();
    };
    init();
  }, []);

  const handleConfirmPayment = async () => {
    if (!pendingPayment || !selectedProvider) return;
    if (!shippingData.ville.trim() || !shippingData.details.trim()) {
      toast.error("ERREUR_PROTOCOLE", { description: "Coordonnées de livraison incomplètes." });
      return;
    }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const totalAmount = (pendingPayment.annonce.produit?.prix_prod || 0) * pendingPayment.quantite;
    const result = await executeOrderAndPayment({
      annonce_id: pendingPayment.annonce.id,
      acheteur_id: user.id,
      quantite: pendingPayment.quantite,
      total: totalAmount,
      destination_ville: shippingData.ville,
      destination_details: shippingData.details,
      id_agence_retrait: shippingData.agenceId || null
    }, {
      phone,
      amount: totalAmount,
      provider: selectedProvider.toUpperCase() as any
    });

    if (result?.success) {
      setPaymentSuccess(true);
      fetchMesCommandes();
      fetchMarket();
    }
  };

  return (
    <div className="w-full min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/30 overflow-x-hidden font-tech pb-10">
      
      {/* HEADER RESPONSIVE & STICKY */}
      <header className="sticky top-0 z-[60] w-full bg-secondary/80 backdrop-blur-2xl border-b border-border/50">
        <div className="max-w-[1800px] mx-auto px-4 py-4 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-4 self-start">
            <div className="w-10 h-10 rounded-xl bg-primary shadow-glow-primary -rotate-6 flex items-center justify-center">
               <Zap className="text-primary-foreground fill-primary-foreground w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-display font-black uppercase italic tracking-tighter leading-none">AGRI<span className="text-primary">_CONNECT</span></h1>
              <p className="text-[7px] md:text-[8px] text-primary/60 uppercase tracking-[0.4em] font-black italic">NEXUS_MARKET_V3</p>
            </div>
          </div>

          <nav className="flex items-center bg-black/20 p-1 rounded-xl border border-border/40 w-full sm:w-auto">
            {[{ id: 'market', icon: Globe, label: 'MARCHÉ' }, { id: 'orders', icon: ShoppingBag, label: `ORDRES [${mesCommandes.length}]` }].map((tab) => (
              <button 
                key={tab.id}
                onClick={() => {setActiveTab(tab.id as any); setPendingPayment(null); setPaymentSuccess(false);}} 
                className={cn(
                  "flex-1 sm:flex-none px-4 md:px-6 py-2.5 rounded-lg font-display font-black uppercase italic text-[9px] md:text-[10px] tracking-widest transition-all flex items-center justify-center gap-2",
                  activeTab === tab.id && !pendingPayment ? 'bg-primary text-primary-foreground shadow-glow-primary' : 'text-muted-foreground/40 hover:text-foreground'
                )}
              >
                <tab.icon size={14} /> {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="w-full flex-1 max-w-[1800px] mx-auto relative px-4 md:px-8">
        
        {/* MODAL DE RÉUSSITE PLEIN ÉCRAN */}
        {paymentSuccess && (
          <div className="fixed inset-0 flex items-center justify-center p-4 bg-background/95 backdrop-blur-xl z-[100] animate-in fade-in">
            <div className="bg-secondary border-2 border-primary/30 rounded-[2.5rem] p-8 md:p-12 max-w-lg w-full text-center shadow-2xl">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-12 h-12 text-primary animate-bounce" strokeWidth={3} />
              </div>
              <h2 className="text-2xl md:text-3xl font-display font-black uppercase italic mb-4">ORDRE_SYNCHRONISÉ</h2>
              <div className="bg-background/40 border border-border rounded-2xl p-4 mb-8 text-left">
                <p className="text-[8px] text-muted-foreground uppercase font-black mb-1">HUB_DESTINATION</p>
                <p className="text-sm font-black text-primary italic uppercase truncate">{shippingData.ville}</p>
              </div>
              <button onClick={() => {setPaymentSuccess(false); setActiveTab('orders');}} className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-display font-black uppercase italic text-xs tracking-widest shadow-glow-primary active:scale-95 transition-all">TERMINER_LA_SESSION</button>
            </div>
          </div>
        )}

        {/* VUE PAIEMENT (CHECKOUT) */}
        {pendingPayment ? (
          <div className="max-w-3xl mx-auto py-8 md:py-12 animate-in slide-in-from-bottom-5">
            <button onClick={() => setPendingPayment(null)} className="flex items-center gap-2 text-muted-foreground hover:text-primary font-tech text-[10px] font-black uppercase italic tracking-widest mb-6 group">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> RETOUR_AU_MARCHÉ
            </button>
            <div className="space-y-6">
              <ShippingForm data={shippingData} agences={agences} onChange={(f, v) => setShippingData(p => ({ ...p, [f]: v }))} />
              <PaymentSelector selectedId={selectedProvider} onSelect={setSelectedProvider} phone={phone} onPhoneChange={setPhone} amount={(pendingPayment.annonce.produit?.prix_prod || 0) * pendingPayment.quantite} />
              <button 
                disabled={!selectedProvider || paymentLoading || phone.length < 10} 
                onClick={handleConfirmPayment} 
                className={cn(
                  "w-full h-16 rounded-2xl flex items-center justify-center gap-3 font-display font-black uppercase italic text-sm tracking-widest transition-all",
                  selectedProvider && phone.length >= 10 ? "bg-primary text-primary-foreground shadow-glow-primary active:scale-[0.98]" : "bg-muted/10 text-muted-foreground/20 cursor-not-allowed"
                )}
              >
                {paymentLoading ? <Loader2 className="animate-spin" /> : <><Target size={20} /> EXECUTER_LA_TRANSACTION</>}
              </button>
            </div>
          </div>
        ) : (
          /* VUE MARCHÉ ET FILTRES */
          <div className="space-y-4">
            <div className="py-6">
              <MarketFilterBar categories={categories} onSearch={setSearchTerm} onFilter={(id) => fetchMarket(id)} />
            </div>

            {activeTab === 'market' && (
              <div 
                ref={scrollRef}
                className="flex flex-nowrap overflow-x-auto snap-x snap-mandatory gap-5 md:gap-8 pb-12 no-scrollbar scroll-smooth items-stretch"
              >
                {filteredResult.map((annonce) => (
                  <div key={annonce.id} className="snap-center shrink-0 w-[88vw] sm:w-[400px] md:w-[450px]">
                    <Card className="h-full bg-secondary/30 border-2 border-border/40 rounded-[2.5rem] overflow-hidden group hover:border-primary/50 transition-all duration-500 shadow-xl flex flex-col">
                      {/* Image Adaptative */}
                      <div className="relative aspect-video sm:aspect-square md:aspect-video bg-black overflow-hidden">
                        {annonce.produit?.image ? (
                          <img src={annonce.produit.image} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000" alt="p" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center opacity-5"><Package size={60} /></div>
                        )}
                        <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-[8px] font-black text-primary tracking-widest uppercase italic flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> LIVE_NODE
                        </div>
                        <div className="absolute bottom-4 right-4 bg-primary text-primary-foreground px-5 py-2 rounded-2xl shadow-glow-primary font-display font-black italic text-xl">
                          {annonce.produit?.prix_prod}$
                        </div>
                      </div>

                      {/* Infos Produit */}
                      <div className="p-6 md:p-8 flex-1 flex flex-col justify-between space-y-6">
                        <div>
                          <h3 className="text-xl md:text-2xl font-display font-black uppercase italic tracking-tighter truncate leading-tight">{annonce.produit?.nom_prod}</h3>
                          <div className="flex items-center gap-2 font-tech text-[9px] text-muted-foreground/50 uppercase font-black tracking-widest mt-2 italic">
                            <MapPin size={12} className="text-primary" /> DISPONIBLE : {annonce.produit?.unite}
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex justify-between items-center bg-background/50 rounded-xl px-4 py-3 border border-border/50">
                            <span className="text-[8px] text-muted-foreground/40 font-black uppercase tracking-widest">STOCK_RÉEL</span>
                            <span className="text-xs text-primary font-black italic">{annonce.quantite_restante} {annonce.produit?.unite}</span>
                          </div>
                          <OrderAnnonceModal annonce={annonce} onOrder={(a, q) => { setPendingPayment({annonce: a, quantite: q}); return Promise.resolve(true); }} loading={loading} />
                        </div>
                      </div>
                    </Card>
                  </div>
                ))}
                
                {/* PROMO CARD INTÉGRÉE AU FLUX */}
                <div className="snap-center shrink-0 w-[88vw] sm:w-[400px] md:w-[450px]">
                   <Card className="h-full bg-gradient-to-br from-primary/20 via-secondary to-background border-2 border-primary/30 p-8 rounded-[2.5rem] flex flex-col items-center justify-center text-center relative overflow-hidden group shadow-2xl">
                      <Megaphone size={48} className="text-primary mb-6 animate-bounce" />
                      <h2 className="text-3xl md:text-4xl font-display font-black uppercase italic leading-[0.9] mb-4">EN L'ECOUTE!! <br/><span className="text-primary"> ICI C'EST MEILLEUR</span></h2>
                      <p className="font-tech text-[10px] text-muted-foreground uppercase tracking-widest mb-8 max-w-[80%] italic opacity-60 italic leading-relaxed">AgriConnect : Le nexus pour acheter en gros et réduire les coûts produits agricoles.</p>
                      <div className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-display font-black italic text-[10px] uppercase shadow-glow-primary active:scale-95 cursor-pointer">
                        <Sparkles size={14} /> REJOINDRE_LE_FLUX
                      </div>
                   </Card>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 animate-in fade-in py-4">
                {mesCommandes.map((cmd: any) => (
                  <Card key={cmd.id} className="bg-secondary/40 border border-border/50 rounded-2xl p-5 flex items-center justify-between group hover:border-primary/30 transition-colors">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-12 h-12 md:w-14 md:h-14 bg-background border border-border/40 rounded-xl flex items-center justify-center text-primary/30 group-hover:text-primary group-hover:bg-primary/5 transition-all">
                        <Package size={24} />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs md:text-sm font-black uppercase italic truncate pr-2">{cmd.annonce?.produit?.nom_prod}</h4>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                           <span className={cn(
                             "text-[7px] px-2 py-0.5 rounded-md font-black uppercase tracking-tighter", 
                             cmd.statut_paiement === 'PAYEE' ? 'bg-primary/20 text-primary border border-primary/20' : 'bg-black/20 text-muted-foreground/40'
                           )}>
                             {cmd.statut_paiement || 'PENDING'}
                           </span>
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

      {/* DÉCORATION DE FOND IMMERSIVE */}
      <div className="fixed bottom-[-10%] right-[-5%] w-[60vw] h-[60vw] bg-primary/5 blur-[150px] rounded-full pointer-events-none -z-10 animate-pulse" />
    </div>
  );
}