// src/features/marcher/views/MarketView.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useMarketplace } from '../hooks/useMarketplace';
import { useMarketSearch } from '../hooks/useMarketSearch'; // Notre nouveau cerveau
import { supabase } from '@/supabase';
import { MarketFilterBar } from '../components/MarketFilterBar';
import { OrderAnnonceModal } from '../components/OrderAnnonceModal';
import { OrderActionButtons } from '../components/OrderActionButtons';
import { Card, CardContent } from "@/components/ui/card";
import { 
  Loader2, ShoppingBag, Globe, PackageCheck, 
  Menu, X, LayoutGrid, Database, Zap, Clock, MapPin 
} from "lucide-react";

const animationStyles = `
  @keyframes scrollInfinite { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
  .animate-scroll-infinite { animation: scrollInfinite 80s linear infinite; }
  .carousel-container:hover .animate-scroll-infinite { animation-play-state: paused; }
`;

export default function MarketView() {
  const { 
    annonces, mesCommandes, loading, fetchMarket, 
    fetchMesCommandes, passerCommande, annulerCommande, modifierCommande 
  } = useMarketplace();

  const [categories, setCategories] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'market' | 'orders'>('market');
  const [searchTerm, setSearchTerm] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // BRANCHEMENT DE LA RECHERCHE INTELLIGENTE
  const filteredResult = useMarketSearch(annonces, searchTerm);

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = animationStyles;
    document.head.appendChild(styleSheet);
    
    const init = async () => {
      const { data } = await supabase.from('categorie').select('*').order('libelle_categorie');
      if (data) setCategories(data);
      fetchMarket();
      fetchMesCommandes();
    };
    init();
    return () => { document.head.removeChild(styleSheet); };
  }, []);

  // Préparation du carrousel (Top 20 pour la fluidité)
  const displayAnnonces = useMemo(() => {
    const top = filteredResult.slice(0, 20);
    return [...top, ...top];
  }, [filteredResult]);

  return (
    <div className="p-4 md:p-10 space-y-8 max-w-[100vw] overflow-x-hidden min-h-screen bg-[#020202] text-white selection:bg-emerald-500">
      
      {/* HEADER */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 max-w-7xl mx-auto border-b border-white/5 pb-8">
        <div>
          <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter">
            AGRI<span className="text-emerald-500">MARKET</span>
          </h1>
          <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 mt-2">Intelligence_Artificielle_Distribution</p>
        </div>

        <div className={`${isMenuOpen ? 'flex' : 'hidden lg:flex'} flex-col md:flex-row bg-white/[0.02] p-2 rounded-3xl border border-white/5 gap-2`}>
          <button onClick={() => setActiveTab('market')} className={`px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all ${activeTab === 'market' ? 'bg-emerald-500 text-black shadow-xl' : 'text-white/40'}`}>
            <Globe className="inline mr-2 w-4 h-4" /> Le_Marché
          </button>
          <button onClick={() => setActiveTab('orders')} className={`px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all ${activeTab === 'orders' ? 'bg-emerald-500 text-black shadow-xl' : 'text-white/40'}`}>
            <ShoppingBag className="inline mr-2 w-4 h-4" /> Mes_Ordres ({mesCommandes.length})
          </button>
        </div>
      </header>

      {activeTab === 'market' && (
        <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
          <MarketFilterBar categories={categories} onSearch={setSearchTerm} onFilter={(id) => fetchMarket(id)} />
        </div>
      )}

      {loading && annonces.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
        </div>
      ) : (
        <main>
          {/* VUE MARCHÉ */}
          {activeTab === 'market' && (
            <div className="carousel-container relative py-12">
              <div className="flex gap-8 animate-scroll-infinite w-fit">
                {displayAnnonces.map((annonce, idx) => (
                  <div key={`${annonce.id}-${idx}`} className="min-w-[380px]">
                    <Card className="bg-[#080808] border border-white/5 rounded-[3rem] p-10 hover:border-emerald-500/40 transition-all duration-500 group">
                       <div className="flex justify-between items-start mb-8">
                          <div className="space-y-1">
                             <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">{annonce.produit?.categorie?.libelle_categorie}</span>
                             <h3 className="text-3xl font-black uppercase italic text-white tracking-tighter">{annonce.produit?.nom_prod}</h3>
                          </div>
                          <p className="text-3xl font-black text-[#bef264] tracking-tighter italic">{annonce.produit?.prix_prod}$</p>
                       </div>
                       
                       <div className="space-y-6">
                          <div className="flex justify-between text-[10px] font-black uppercase text-white/20 italic">
                             <span>Volume_Disponible</span>
                             <span className="text-white">{annonce.quantite_restante} {annonce.produit?.unite}</span>
                          </div>
                          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                             <div className="h-full bg-emerald-500 group-hover:bg-[#bef264] transition-all" style={{ width: `${(annonce.quantite_restante / (annonce.quantite_vendre || 1)) * 100}%` }} />
                          </div>
                       </div>
                       
                       <div className="pt-8">
                          <OrderAnnonceModal annonce={annonce} onOrder={passerCommande} loading={loading} />
                       </div>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VUE COMMANDES (RESTAURÉE) */}
          {activeTab === 'orders' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
              {mesCommandes.map((cmd) => (
                <Card key={cmd.id} className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">ID_{cmd.id.slice(0,8)}</p>
                      <h4 className="text-2xl font-black uppercase italic text-white">{cmd.annonce?.produit?.nom_prod}</h4>
                    </div>
                    <OrderActionButtons 
                       status={cmd.statut} 
                       onCancel={() => annulerCommande(cmd.id)} 
                       onEdit={() => modifierCommande(cmd.id, cmd.quantite_commandee, cmd.annonce as any)} 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 p-5 bg-black/40 rounded-3xl border border-white/5">
                    <div>
                      <p className="text-[8px] font-black text-white/20 uppercase">Quantité</p>
                      <p className="text-lg font-black text-white italic">{cmd.quantite_commandee} {cmd.annonce?.produit?.unite}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[8px] font-black text-white/20 uppercase">Total</p>
                      <p className="text-lg font-black text-[#bef264] italic">{cmd.prix_total_commande}$</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-white/5">
                     <div className="flex items-center gap-2 text-[10px] font-black text-white/20 uppercase">
                        <Clock className="w-3 h-3" /> {new Date(cmd.created_at).toLocaleDateString()}
                     </div>
                     <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${
                       cmd.statut === 'validee' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-white/5 text-white/40'
                     }`}>
                       {cmd.statut}
                     </span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </main>
      )}

      {/* EMPTY STATE */}
      {!loading && filteredResult.length === 0 && activeTab === 'market' && (
        <div className="flex flex-col items-center justify-center py-40 opacity-20">
          <PackageCheck size={60} />
          <p className="text-xl font-black uppercase italic tracking-widest mt-4">Signal_Perdu : Aucun Produit</p>
        </div>
      )}
    </div>
  );
}