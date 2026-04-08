// src/features/recolte/view/Recoltes.tsx
import React, { useState } from 'react';
import { PublierAnnonceModal } from '../../annonce/components/PublierAnnonceModal';
import { useRecoltes } from '../hooks/useRecoltes';
import { AddRecolteModal } from '../components/AddRecolteModal'; 
import { 
  Package, 
  Trash2, 
  RefreshCcw,
  Search,
  AlertCircle,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function Recoltes() {
  const { produits, loading, deleteProduit, refresh } = useRecoltes();
  const [searchTerm, setSearchTerm] = useState("");
  const [showAll, setShowAll] = useState(false); // État pour la limite d'affichage

  // Filtrage local pour la recherche
  const filteredProduits = produits.filter(p => 
    p.nom_prod.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Logique de limitation (Afficher 5 par défaut)
  const displayLimit = 5;
  const displayedProduits = showAll ? filteredProduits : filteredProduits.slice(0, displayLimit);

  return (
    <div className="space-y-8">
      {/* --- HEADER DE SECTION --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic text-glow-green">
            Gestion du Stock
          </h1>
          <p className="text-foreground/40 text-[10px] font-bold uppercase tracking-[0.3em] mt-1">
            Inventaire des récoltes & Disponibilité marché
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={refresh}
            className="border-white/5 bg-white/5 hover:bg-primary/10 transition-all"
          >
            <RefreshCcw className={cn("w-4 h-4", loading && "animate-spin")} />
          </Button>
          
          <AddRecolteModal /> 
        </div>
      </div>

      {/* --- BARRE D'OUTILS --- */}
      <div className="relative max-w-md group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/20 group-focus-within:text-primary transition-colors" />
        <Input 
          placeholder="FILTRER MON STOCK..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-12 bg-white/5 border-white/5 pl-12 font-bold text-[10px] tracking-widest focus:ring-primary/20 uppercase"
        />
      </div>

      {/* --- LISTE DES PRODUITS --- */}
      <div className="grid gap-4">
        {loading && produits.length === 0 ? (
          [1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 w-full bg-white/5 rounded-2xl" />
          ))
        ) : filteredProduits.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.02]">
            <AlertCircle className="w-12 h-12 text-foreground/10 mb-4" />
            <p className="text-foreground/30 font-black uppercase tracking-widest text-[10px] text-center px-4">
              Aucun produit enregistré dans votre terminal
            </p>
          </div>
        ) : (
          <>
            {displayedProduits.map((produit) => (
              <div 
                key={produit.id}
                className="group relative bg-white/[0.03] border border-white/5 hover:border-primary/30 p-6 rounded-2xl transition-all hover:bg-white/[0.05] hover:shadow-[0_0_30px_rgba(34,197,94,0.05)]"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  
                  {/* Info Produit */}
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
                      <Package className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black uppercase tracking-tight leading-none group-hover:text-primary transition-colors italic">
                        {produit.nom_prod}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-[9px] font-bold text-foreground/40 uppercase tracking-widest">
                        <span>STOCK: <span className="text-white">{produit.quantite_prod} {produit.unite}</span></span>
                        <span className="w-1 h-1 bg-white/20 rounded-full" />
                        <span>VALEUR UNITAIRE: <span className="text-accent">{produit.prix_prod} $</span></span>
                        <span className="w-1 h-1 bg-white/20 rounded-full" />
                        <span>DATE: <span className="text-white">{new Date(produit.date_recolte).toLocaleDateString()}</span></span>
                      </div>
                    </div>
                  </div>

                  {/* Statut Annonce & Actions */}
                  <div className="flex items-center gap-4 ml-auto md:ml-0">
                    {produit.annonce && produit.annonce.length > 0 ? (
                      <Badge className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-black italic px-4 py-1.5 text-[9px] tracking-widest uppercase">
                        ● EN VENTE
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-white/5 text-foreground/30 border-white/10 font-black italic px-4 py-1.5 text-[9px] tracking-widest uppercase">
                        STOCK PRIVÉ
                      </Badge>
                    )}

                    <div className="flex items-center gap-2 border-l border-white/10 pl-4">
                      <button 
                        onClick={() => {
                          if(confirm("Voulez-vous vraiment retirer ce produit du stock ?")) {
                            deleteProduit(produit.id);
                          }
                        }}
                        className="p-2.5 text-foreground/20 hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      {/* --- LE BOUTON DE PUBLICATION EST ICI, DANS LE MAP --- */}
                      <PublierAnnonceModal produit={produit} />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* BOUTON VOIR TOUT / RÉDUIRE */}
            {filteredProduits.length > displayLimit && (
              <div className="flex justify-center mt-4">
                <Button 
                  variant="ghost" 
                  onClick={() => setShowAll(!showAll)}
                  className="group text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40 hover:text-primary transition-all"
                >
                  {showAll ? (
                    <span className="flex items-center gap-2">RÉDUIRE LA LISTE <ChevronUp className="w-4 h-4" /></span>
                  ) : (
                    <span className="flex items-center gap-2">
                      VOIR TOUT ({filteredProduits.length}) <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
                    </span>
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}