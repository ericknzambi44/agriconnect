// components/marketplace/MarketRadar.tsx
import React from 'react';
import { MarketAnnonce } from '../hooks/useMarketplace';
import { MapPin, Phone, Sprout, Package, TrendingUp } from "lucide-react";
import { OrderActionButtons } from './OrderActionButtons';

interface MarketRadarProps {
  annonces: MarketAnnonce[];
  loading: boolean;
  onOrderStart: (annonce: MarketAnnonce) => void;
}

export function MarketRadar({ annonces, loading, onOrderStart }: MarketRadarProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-primary/30 rounded-full animate-ping" />
          <div className="absolute inset-2 border-4 border-t-primary rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (annonces.length === 0) {
    return (
      <div className="text-center py-16 bg-gradient-to-br from-white/[0.02] to-transparent rounded-3xl border border-white/10 backdrop-blur-sm">
        <Package className="w-12 h-12 text-white/20 mx-auto mb-3" />
        <p className="text-white/50 font-black uppercase italic">Aucune annonce disponible</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
      {annonces.map((annonce) => {
        // Prix affiché : priorité à prix_total sinon calcul
        const displayPrice = annonce.prix_total || (annonce.quantite_vendre * annonce.produit?.prix_prod);
        return (
          <div
            key={annonce.id}
            className="group relative bg-gradient-to-b from-white/[0.04] to-black/40 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-1"
          >
            {/* Badge gradient en haut */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-pink-500 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Image avec overlay gradient */}
            <div className="relative h-44 sm:h-48 overflow-hidden bg-gradient-to-br from-black/60 to-black/20">
              <img
                src={annonce.produit?.image || '/api/placeholder/400/300'}
                alt={annonce.produit?.nom_prod}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded-full text-[10px] font-black text-primary uppercase border border-primary/30">
                {annonce.produit?.categorie?.libelle_categorie}
              </div>
            </div>

            {/* Corps */}
            <div className="p-4 space-y-3">
              <div>
                <h3 className="text-white font-black uppercase italic text-base sm:text-lg line-clamp-1">
                  {annonce.produit?.nom_prod}
                </h3>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-primary font-black text-xl sm:text-2xl">
                    {displayPrice?.toFixed(2)} $
                  </span>
                  <span className="text-white/40 text-[10px] font-black uppercase">
                    / {annonce.produit?.unite}
                  </span>
                </div>
              </div>

              {/* Infos vendeur */}
              <div className="space-y-1.5 text-[11px] font-bold">
                <div className="flex items-center gap-1.5 text-white/70">
                  <Phone className="w-3 h-3 text-primary flex-shrink-0" />
                  <span className="truncate">{annonce.vendeur?.numero_tel || "—"}</span>
                </div>
                <div className="flex items-center gap-1.5 text-white/70">
                  <Sprout className="w-3 h-3 text-primary flex-shrink-0" />
                  <span className="truncate">{annonce.produit?.lieu_culture || "Lieu inconnu"}</span>
                </div>
                <div className="flex items-start gap-1.5 text-white/50 text-[10px]">
                  <MapPin className="w-3 h-3 mt-0.5 text-primary/70 flex-shrink-0" />
                  <span className="line-clamp-1">{annonce.vendeur?.adresse?.commune}, {annonce.vendeur?.adresse?.ville}</span>
                </div>
              </div>

              {/* Stock */}
              <div className="flex justify-between items-center border-t border-white/10 pt-2 text-[10px] font-black uppercase">
                <span className="text-white/40">Restant</span>
                <span className="text-primary">{annonce.quantite_restante} {annonce.produit?.unite}</span>
              </div>

              <OrderActionButtons annonce={annonce} onOrderStart={onOrderStart} />
            </div>
          </div>
        );
      })}
    </div>
  );
}