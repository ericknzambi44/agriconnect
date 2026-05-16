// features/marketplace/views/MarketplaceView.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useMarketplace } from '../hooks/useMarketplace';
import { useMarketSearch } from '../hooks/useMarketSearch';
import { usePayment } from '../hooks/usePayment';
import { MarketFilterBar } from '../components/MarketFilterBar';
import { MarketRadar } from '../components/MarketRadar';
import { OrderAnnonceModal } from '../components/OrderAnnonceModal';
import { AchatSuiviView } from '../components/AchatSuiviView'; // ✅ Nouvel import
import { toast } from 'sonner';
import { useAuthSession } from '@/features/auth/hooks/use-auth-session';
import { MarketAnnonce } from '../hooks/useMarketplace';
import { cn } from "@/lib/utils";

export function MarketplaceView() {
  const { profile } = useAuthSession();
  const { annonces, categories, loading, fetchMarket, fetchMesCommandes } = useMarketplace();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedAnnonce, setSelectedAnnonce] = useState<MarketAnnonce | null>(null);
  const [orderLoading, setOrderLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'market' | 'suivi'>('market'); // ✅ Onglet

  const { executeOrderAndPayment } = usePayment();

  useEffect(() => {
    fetchMarket();
  }, [fetchMarket]);

  const filteredByCat = useMemo(() => {
    if (selectedCategory === 'all') return annonces;
    return annonces.filter(ann => ann.produit?.categorie?.id === selectedCategory);
  }, [annonces, selectedCategory]);

  const searchedAnnonces = useMarketSearch(filteredByCat, searchQuery);

  const handleOrder = async (annonce: MarketAnnonce, quantite: number, deliveryDetails: any) => {
    if (!profile?.id) {
      toast.error("Connexion requise");
      return false;
    }

    setOrderLoading(true);
    const total = quantite * annonce.produit.prix_prod;

    const orderData = {
      annonce_id: annonce.id,
      acheteur_id: profile.id,
      quantite: quantite,
      total: total,
      destination_ville: deliveryDetails.ville,
      destination_details: deliveryDetails.details,
      id_agence_retrait: null,
    };

    const paymentRequest = {
      amount: total,
      phone: deliveryDetails.paymentPhone,
      provider: deliveryDetails.paymentProvider,
      description: `Achat ${annonce.produit.nom_prod} - ${quantite} ${annonce.produit.unite}`,
    };

    const result = await executeOrderAndPayment(orderData, paymentRequest);
    setOrderLoading(false);

    if (result.success) {
      toast.success("Commande validée !");
      fetchMesCommandes();
      return true;
    }
    return false;
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#050505] to-black">
      {/* Bandeau dégradé supérieur */}
      <div className="w-full h-2 bg-gradient-to-r from-primary via-pink-500 to-primary animate-gradient-x" />
      
      <div className="w-full px-4 sm:px-6 md:px-8 py-4 sm:py-6">
        {/* Header */}
        <div className="mb-6 md:mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase italic bg-gradient-to-r from-primary via-white to-primary bg-clip-text text-transparent tracking-tighter">
            MarketPlace
          </h1>
          <p className="text-white/40 text-xs sm:text-sm mt-2 font-mono">
            Produits frais • Paiement sécurisé sous séquestre
          </p>
        </div>

        {/* ✅ Onglets de navigation */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setActiveTab('market')}
            className={cn(
              "px-6 py-2 rounded-full font-tech text-[10px] font-black uppercase tracking-wider transition-all",
              activeTab === 'market'
                ? "bg-gradient-to-r from-primary to-orange-400 text-black shadow-lg"
                : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
            )}
          >
            Explorer
          </button>
          <button
            onClick={() => setActiveTab('suivi')}
            className={cn(
              "px-6 py-2 rounded-full font-tech text-[10px] font-black uppercase tracking-wider transition-all",
              activeTab === 'suivi'
                ? "bg-gradient-to-r from-primary to-orange-400 text-black shadow-lg"
                : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
            )}
          >
            Mes achats
          </button>
        </div>

        {/* Contenu conditionnel */}
        {activeTab === 'market' ? (
          <>
            <MarketFilterBar
              onSearch={setSearchQuery}
              onCategoryChange={setSelectedCategory}
              categories={categories}
              loading={loading}
            />

            <MarketRadar
              annonces={searchedAnnonces}
              loading={loading}
              onOrderStart={setSelectedAnnonce}
            />

            {selectedAnnonce && (
              <OrderAnnonceModal
                annonce={selectedAnnonce}
                onOrder={handleOrder}
                loading={orderLoading}
                onClose={() => setSelectedAnnonce(null)}
              />
            )}
          </>
        ) : (
          <AchatSuiviView />
        )}
      </div>
    </div>
  );
}