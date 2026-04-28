import React, { useState, useEffect } from 'react';
import { useMarketplace, MarketAnnonce } from '../hooks/useMarketplace';
import { useMarketSearch } from '../hooks/useMarketSearch';
import { usePayment } from '../hooks/usePayment'; 
import { supabase } from '@/supabase';
import { MarketFilterBar } from '../components/MarketFilterBar';
import { OrderActionButtons } from '../components/OrderActionButtons';
import { PaymentSelector } from '../components/PaymentSelector'; 
import { ShippingForm } from '../components/ShippingForm';
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { 
  Loader2, ShoppingBag, Globe, Package, Zap, ArrowLeft, CheckCircle2, Target, Megaphone
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from '@/components/ui/button';
import { MarketAnnonceCard } from '../components/OrderAnnonceModal';

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
    // SÉCURITÉ 1 : On bloque l'exécution si déjà en cours ou données manquantes
    if (paymentLoading || !pendingPayment || !selectedProvider) return;
    
    if (!shippingData.ville.trim() || !shippingData.details.trim()) {
      toast.error("ERREUR_LIVRAISON", { description: "Coordonnées de livraison incomplètes." });
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
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
    } catch (err) {
      console.error("Payment error:", err);
      toast.error("ÉCHEC_TRANSACTION", { description: "Une erreur réseau est survenue." });
    }
  };

  return (
    <div className="w-full flex flex-col bg-background/50 font-tech pb-20">
      
      {/* HEADER : Identité visuelle forte */}
      <header className="sticky top-0 z-[50] w-full bg-background/95 backdrop-blur-xl border-b border-white/5 px-4 py-4 md:py-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
               <Zap className="text-primary-foreground w-5 h-5" fill="currentColor" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-display font-black uppercase italic tracking-tighter leading-none text-white">
                AGRI<span className="text-primary">MARKET</span>
              </h1>
            </div>
          </div>

          <nav className="flex items-center bg-secondary/50 p-1.5 rounded-2xl border border-white/5 w-full md:w-auto overflow-x-auto no-scrollbar">
            {[
              { id: 'market', icon: Globe, label: 'EXPLORER' }, 
              { id: 'orders', icon: ShoppingBag, label: `MES COMMANDES (${mesCommandes.length})` }
            ].map((tab) => (
              <button 
                key={tab.id}
                onClick={() => {setActiveTab(tab.id as any); setPendingPayment(null);}} 
                className={cn(
                  "flex-1 md:flex-none px-6 py-3 rounded-xl font-display font-black uppercase italic text-[10px] md:text-[11px] tracking-widest transition-all flex items-center justify-center gap-2 whitespace-nowrap",
                  activeTab === tab.id && !pendingPayment 
                    ? 'bg-primary text-primary-foreground shadow-glow-primary' 
                    : 'text-muted-foreground hover:text-white hover:bg-white/5'
                )}
              >
                <tab.icon size={14} /> {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="p-4 md:p-8 w-full max-w-[1700px] mx-auto transition-all">
        
        {/* VUE PAIEMENT : Sécurisée et anti-double-clic */}
        {pendingPayment ? (
          <div className="max-w-2xl mx-auto py-6 animate-in slide-in-from-bottom-5">
            <button 
              disabled={paymentLoading}
              onClick={() => setPendingPayment(null)} 
              className="flex items-center gap-2 text-muted-foreground hover:text-primary font-tech text-[11px] font-black uppercase mb-8 group transition-colors disabled:opacity-30"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
              RETOUR_AU_FLUX
            </button>

            <div className="grid gap-8">
              <ShippingForm 
                data={shippingData} 
                agences={agences} 
                onChange={(f, v) => setShippingData(p => ({ ...p, [f]: v }))} 
              />
              
              <PaymentSelector 
                selectedId={selectedProvider} 
                onSelect={setSelectedProvider} 
                phone={phone} 
                onPhoneChange={setPhone} 
                amount={(pendingPayment.annonce.produit?.prix_prod || 0) * pendingPayment.quantite} 
              />

              {/* BOUTON SÉCURISÉ : Feedback immédiat et blocage technique */}
              <Button 
                disabled={!selectedProvider || paymentLoading || phone.length < 10} 
                onClick={handleConfirmPayment} 
                className={cn(
                  "h-16 md:h-20 rounded-2xl font-display font-black uppercase italic text-sm md:text-base tracking-widest shadow-xl transition-all",
                  paymentLoading 
                    ? "bg-muted text-muted-foreground cursor-not-allowed opacity-70" 
                    : "bg-primary text-primary-foreground shadow-primary/20 active:scale-95 hover:brightness-110"
                )}
              >
                {paymentLoading ? (
                  <div className="flex items-center gap-3">
                    <Loader2 className="animate-spin w-5 h-5" />
                    <span>TRAITEMENT_EN_COURS...</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Target size={22} className="mr-3" />
                    <span>EXÉCUTER_LA_TRANSACTION</span>
                  </div>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="bg-secondary/20 p-3 rounded-[2rem] border border-white/5 shadow-inner">
              <MarketFilterBar categories={categories} onSearch={setSearchTerm} onFilter={(id) => fetchMarket(id)} />
            </div>

            {activeTab === 'market' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 animate-in fade-in">
                {/* PROMO CARD */}
                <Card className="hidden lg:flex flex-col items-center justify-center text-center p-8 bg-black/40 border-2 border-primary/20 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Globe size={120} />
                    </div>
                    <Megaphone size={48} className="text-primary mb-5 animate-bounce" />
                    <h2 className="text-2xl font-display font-black uppercase italic leading-[0.9] mb-4 text-white">
                      AGRI_<span className="text-primary">info</span>
                    </h2>
                    <p className="text-[10px] text-muted-foreground uppercase leading-relaxed mb-6 font-bold tracking-tight">
                      Le réseau AgriConnect optimise vos marges et sécurise vos échanges agricoles en temps réel.
                    </p>
                    <div className="text-[9px] font-tech text-primary font-black uppercase border-2 border-primary/30 px-5 py-2 rounded-full bg-primary/5">
                      STATUS: CONNECTED
                    </div>
                </Card>

                {filteredResult.map((annonce) => (
                  <MarketAnnonceCard 
                    key={annonce.id} 
                    annonce={annonce} 
                    onOrder={(a: MarketAnnonce, q: number) => { 
                      setPendingPayment({ annonce: a, quantite: q }); 
                      return Promise.resolve(true); 
                    }} 
                    loading={loading} 
                  />
                ))}
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 py-4 animate-in slide-in-from-right-4">
                {mesCommandes.map((cmd: any) => (
                  <Card key={cmd.id} className="bg-[#0c0c0c] border-2 border-white/5 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 group hover:border-primary/40 transition-all duration-300 shadow-xl">
                    <div className="flex items-center gap-5 min-w-0 w-full">
                      <div className="w-16 h-16 bg-white/5 border-2 border-white/5 rounded-2xl flex items-center justify-center text-primary/50 group-hover:text-primary group-hover:scale-105 transition-all">
                        <Package size={32} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-base font-black uppercase italic truncate text-white mb-2">{cmd.annonce?.produit?.nom_prod}</h4>
                        <div className="flex items-center gap-3 flex-wrap">
                           <span className={cn(
                             "text-[9px] px-3 py-1 rounded-lg font-black uppercase tracking-wider", 
                             cmd.statut_paiement === 'PAYEE' 
                               ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                               : 'bg-primary/10 text-primary border border-primary/20'
                           )}>
                             {cmd.statut_paiement || 'EN ATTENTE'}
                           </span>
                           <span className="text-base text-white font-black italic tracking-tighter">
                             {cmd.prix_total_commande}<small className="text-[10px] text-primary ml-1">USD</small>
                           </span>
                        </div>
                      </div>
                    </div>
                    <div className="w-full sm:w-auto flex justify-end pt-4 sm:pt-0 border-t sm:border-none border-white/5">
                        <OrderActionButtons 
                          status={cmd.statut} 
                          onCancel={() => annulerCommande(cmd.id)} 
                          onEdit={() => modifierCommande(cmd.id, cmd.quantite_commandee, cmd.annonce as any)} 
                        />
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* SUCCESS OVERLAY */}
      {paymentSuccess && (
        <div className="fixed inset-0 flex items-center justify-center p-6 bg-black/95 backdrop-blur-2xl z-[100] animate-in zoom-in-95 duration-500">
          <div className="bg-secondary/40 border-2 border-primary/40 rounded-[3rem] p-12 max-w-md w-full text-center shadow-[0_0_100px_rgba(var(--primary),0.3)]">
            <div className="w-24 h-24 bg-primary/20 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner border border-primary/30">
                <CheckCircle2 className="w-14 h-14 text-primary animate-pulse" />
            </div>
            <h2 className="text-3xl font-display font-black uppercase italic mb-4 tracking-tighter text-white">ORDRE_CREE !</h2>
            <p className="text-[11px] text-muted-foreground uppercase font-bold mb-10 leading-relaxed max-w-[300px] mx-auto tracking-widest opacity-80">
              La transaction a été validée et injectée dans le protocole de livraison AgriConnect.
            </p>
            <Button 
              onClick={() => {setPaymentSuccess(false); setActiveTab('orders');}} 
              className="w-full h-16 bg-primary text-primary-foreground font-display font-black text-sm tracking-[0.2em] shadow-glow-primary rounded-2xl active:scale-95 transition-all"
            >
              VOIR LE RÉCAPITULATIF
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}