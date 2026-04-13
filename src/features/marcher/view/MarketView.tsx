import React, { useState, useEffect } from 'react';
import { useMarketplace } from '../hooks/useMarketplace';
import { useMarketSearch } from '../hooks/useMarketSearch';
import { supabase } from '@/supabase';
import { MarketFilterBar } from '../components/MarketFilterBar';
import { OrderAnnonceModal } from '../components/OrderAnnonceModal';
import { OrderActionButtons } from '../components/OrderActionButtons';
import { Card } from "@/components/ui/card";
import { 
  Loader2, ShoppingBag, Globe, Clock, Package, MapPin, Zap, Target 
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function MarketView() {
  const { 
    annonces, mesCommandes, loading, fetchMarket, 
    fetchMesCommandes, passerCommande, annulerCommande, modifierCommande 
  } = useMarketplace();

  const [categories, setCategories] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'market' | 'orders'>('market');
  const [searchTerm, setSearchTerm] = useState("");

  const filteredResult = useMarketSearch(annonces, searchTerm);

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.from('categorie').select('*').order('libelle_categorie');
      if (data) setCategories(data);
      fetchMarket();
      fetchMesCommandes();
    };
    init();
  }, [fetchMarket, fetchMesCommandes]);

  return (
    <div className="h-screen bg-[#020202] text-white flex flex-col overflow-hidden selection:bg-emerald-500">
      
      {/* --- MINI HEADER (Ultra Compact) --- */}
      <header className="flex items-center justify-between px-4 py-3 bg-[#080808] border-b border-white/5 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500">
             <Zap className="text-black fill-black w-4 h-4" />
          </div>
          <h1 className="text-xl font-black uppercase italic tracking-tighter">
            AGRI<span className="text-emerald-500">Market</span>
          </h1>
        </div>

        <nav className="flex items-center bg-black/40 p-1 rounded-xl border border-white/5">
          <button 
            onClick={() => setActiveTab('market')} 
            className={cn(
              "px-4 py-2 rounded-lg font-black uppercase italic text-[9px] tracking-widest transition-all flex items-center gap-2",
              activeTab === 'market' ? 'bg-emerald-500 text-black' : 'text-white/30'
            )}
          >
            <Globe className="w-3 h-3" /> MARCHÉ
          </button>
          <button 
            onClick={() => setActiveTab('orders')} 
            className={cn(
              "px-4 py-2 rounded-lg font-black uppercase italic text-[9px] tracking-widest transition-all flex items-center gap-2",
              activeTab === 'orders' ? 'bg-emerald-500 text-black' : 'text-white/30'
            )}
          >
            <ShoppingBag className="w-3 h-3" /> ORDRES ({mesCommandes.length})
          </button>
        </nav>
      </header>

      {/* --- BARRE DE FILTRE COMPACTE --- */}
      <div className="px-4 py-2 bg-[#050505] border-b border-white/5 shrink-0">
        <div className="max-w-full">
           <MarketFilterBar categories={categories} onSearch={setSearchTerm} onFilter={(id) => fetchMarket(id)} />
        </div>
      </div>

      {/* --- ZONE DE GRILLE SCROLLABLE --- */}
      <main className="flex-1 overflow-y-auto p-4 no-scrollbar">
        {loading && annonces.length === 0 ? (
          <div className="h-full flex items-center justify-center animate-pulse">
            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
          </div>
        ) : (
          <div className="max-w-[1600px] mx-auto">
            {activeTab === 'market' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {filteredResult.map((annonce) => (
                  <Card key={annonce.id} className="bg-[#0A0A0A] border border-white/5 rounded-2xl overflow-hidden group hover:border-emerald-500/40 transition-all flex flex-col">
                    
                    {/* Image réduite */}
                    <div className="relative aspect-square overflow-hidden bg-white/5">
                      {annonce.produit?.image ? (
                        <img src={annonce.produit.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt="p" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center opacity-10"><Package className="w-6 h-6" /></div>
                      )}
                      <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-md rounded-lg px-2 py-1 border border-white/10">
                        <span className="text-emerald-500 font-black italic text-xs">
                          {annonce.produit?.prix_prod}$
                        </span>
                      </div>
                    </div>

                    {/* Infos compactes */}
                    <div className="p-3 space-y-3 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-[11px] font-black uppercase italic text-white truncate leading-tight">
                          {annonce.produit?.nom_prod}
                        </h3>
                        <div className="flex items-center gap-1 mt-1 opacity-40">
                          <MapPin className="w-2.5 h-2.5" />
                          <span className="text-[7px] font-mono uppercase tracking-tighter">BUNIA_RD</span>
                        </div>
                      </div>

                      {/* Mini Stock & Action */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-[8px] font-mono text-emerald-500/60 uppercase">
                          <span>Stock</span>
                          <span>{annonce.quantite_restante} {annonce.produit?.unite}</span>
                        </div>
                        <OrderAnnonceModal annonce={annonce} onOrder={passerCommande} loading={loading} />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mesCommandes.map((cmd) => (
                  <Card key={cmd.id} className="bg-[#0A0A0A] border border-white/5 rounded-xl p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-500">
                        <Package className="w-5 h-5" />
                      </div>
                      <div className="leading-none">
                        <h4 className="text-xs font-black uppercase italic text-white">{cmd.annonce?.produit?.nom_prod}</h4>
                        <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">{cmd.prix_total_commande}$ — {cmd.quantite_commandee}qty</span>
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