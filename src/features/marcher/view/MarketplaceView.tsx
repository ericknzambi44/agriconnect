// features/marketplace/views/MarketplaceView.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useMarketplace } from '../hooks/useMarketplace';
import { useMarketSearch } from '../hooks/useMarketSearch';
import { usePayment } from '../hooks/usePayment';
import { MarketFilterBar } from '../components/MarketFilterBar';
import { MarketRadar } from '../components/MarketRadar';
import { OrderAnnonceModal } from '../components/OrderAnnonceModal';
import { toast } from 'sonner';
import { useAuthSession } from '@/features/auth/hooks/use-auth-session';
import { MarketAnnonce } from '../hooks/useMarketplace';

export function MarketplaceView() {
  const { profile } = useAuthSession();
  const { annonces, categories, loading, fetchMarket, fetchMesCommandes } = useMarketplace();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedAnnonce, setSelectedAnnonce] = useState<MarketAnnonce | null>(null);
  const [orderLoading, setOrderLoading] = useState(false);

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
      
      {/* Contenu pleine largeur avec un padding léger mais sans max-width */}
      <div className="w-full px-4 sm:px-6 md:px-8 py-4 sm:py-6">
        {/* Header */}
        <div className="mb-6 md:mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase italic bg-gradient-to-r from-primary via-white to-primary bg-clip-text text-transparent tracking-tighter">
            MarketPlace Pro
          </h1>
          <p className="text-white/40 text-xs sm:text-sm mt-2 font-mono">
            Produits frais • Paiement sécurisé sous séquestre
          </p>
        </div>

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
          />
        )}
      </div>
    </div>
  );
}