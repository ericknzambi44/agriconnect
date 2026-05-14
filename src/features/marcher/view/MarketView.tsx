import React, { useState, useEffect } from 'react';
import { useMarketplace, MarketAnnonce } from '../hooks/useMarketplace';
import { useMarketSearch } from '../hooks/useMarketSearch';
import { supabase } from '@/supabase';

// TES COMPOSANTS (Je les importe tels quels, sans modification)
import { MarketFilterBar } from '../components/MarketFilterBar';
import { OrderAnnonceModal } from '../components/OrderAnnonceModal';
import { OrderActionButtons } from '../components/OrderActionButtons';
import { Card } from "@/components/ui/card";
import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MarketView() {
  const { annonces, mesCommandes, loading, fetchMarket, fetchMesCommandes, annulerCommande } = useMarketplace();
  const [activeTab, setActiveTab] = useState<'market' | 'orders'>('market');
  const [searchTerm, setSearchTerm] = useState("");
  const filteredResult = useMarketSearch(annonces, searchTerm);

  useEffect(() => {
    fetchMarket();
    fetchMesCommandes();
  }, []);

  return (
    <div className="w-full flex flex-col bg-black min-h-screen">
      {/* Ton Header reste inchangé */}
      <header className="p-4 border-b border-white/5 flex justify-between items-center">
        <h1 className="text-xl font-black text-white">AGRI<span className="text-primary">MARKET</span></h1>
        <nav className="flex gap-2">
          <button onClick={() => setActiveTab('market')} className={cn("p-2", activeTab === 'market' ? 'text-primary' : 'text-white')}>EXPLORER</button>
          <button onClick={() => setActiveTab('orders')} className={cn("p-2", activeTab === 'orders' ? 'text-primary' : 'text-white')}>COMMANDES</button>
        </nav>
      </header>

      <main className="p-4">
        {activeTab === 'market' ? (
          <div className="space-y-6">
            <MarketFilterBar onSearch={setSearchTerm} />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {filteredResult.map((a: MarketAnnonce) => (
                <div key={a.id} className="p-4 bg-[#0A0A0A] rounded-2xl border border-white/5">
                  <h3 className="text-white font-black">{a.produit?.nom_prod}</h3>
                  {/* Ton Modal tel quel */}
                  <OrderAnnonceModal 
                    annonce={a} 
                    onOrder={async () => true} 
                    loading={loading} 
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mesCommandes.map((cmd: any) => (
              <Card key={cmd.id} className="p-4 bg-[#0A0A0A]">
                <h4 className="text-white font-black">{cmd.annonce?.produit?.nom_prod}</h4>
                {/* Ton bouton d'action tel quel */}
                <OrderActionButtons 
                  status={cmd.statut} 
                  onCancel={() => annulerCommande(cmd.id)}
                  onEdit={() => {}}
                  onViewDetails={() => {}}
                />
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}