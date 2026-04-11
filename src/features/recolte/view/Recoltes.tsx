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
  const [showAll, setShowAll] = useState(false);

  const filteredProduits = produits.filter(p => 
    p.nom_prod.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayLimit = 5;
  const displayedProduits = showAll ? filteredProduits : filteredProduits.slice(0, displayLimit);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      
      {/* --- HEADER DE SECTION --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic text-white leading-none">
            Gestion <span className="text-emerald-500 text-glow-green">Stock</span>
          </h1>
          <p className="text-white/20 text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] mt-3 italic">
            Inventaire des récoltes & Disponibilité réseau
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={refresh}
            className="border-white/5 bg-white/[0.02] hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all rounded-xl h-12 w-12"
          >
            <RefreshCcw className={cn("w-5 h-5 text-emerald-500/60", loading && "animate-spin text-emerald-500")} />
          </Button>
          
          <AddRecolteModal /> 
        </div>
      </div>

      {/* --- BARRE D'OUTILS --- */}
      <div className="relative max-w-md group px-1">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-emerald-500 transition-colors" />
        <Input 
          placeholder="FILTRER L'INVENTAIRE..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-14 bg-[#050505] border-white/5 pl-14 font-black text-[10px] tracking-[0.2em] focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500/30 text-white uppercase rounded-2xl transition-all"
        />
      </div>

      {/* --- LISTE DES PRODUITS --- */}
      <div className="grid gap-5">
        {loading && produits.length === 0 ? (
          [1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 w-full bg-white/[0.02] rounded-[2rem]" />
          ))
        ) : filteredProduits.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 border border-dashed border-white/5 rounded-[3rem] bg-white/[0.01]">
            <AlertCircle className="w-12 h-12 text-white/5 mb-4" />
            <p className="text-white/20 font-black uppercase tracking-[0.3em] text-[10px] text-center px-4 italic">
              Zéro ressource détectée dans le terminal
            </p>
          </div>
        ) : (
          <>
            {displayedProduits.map((produit) => (
              <div 
                key={produit.id}
                className="group relative bg-[#050505] border border-white/5 hover:border-emerald-500/30 p-6 md:p-8 rounded-[2rem] transition-all duration-500 hover:bg-white/[0.01] hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
              >
                {/* Overlay effet de lumière au survol */}
                <div className="absolute inset-0 bg-emerald-500/[0.01] opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem]" />

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
                  
                  {/* Info Produit */}
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center group-hover:border-emerald-500/50 group-hover:bg-emerald-500/10 transition-all duration-500">
                      <Package className="w-8 h-8 text-white/20 group-hover:text-emerald-500 group-hover:scale-110 transition-all" />
                    </div>
                    <div>
                      <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter leading-none text-white italic group-hover:text-emerald-500 transition-colors">
                        {produit.nom_prod}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 mt-3 text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">
                        <span className="flex items-center gap-1.5">
                          STOCK: <span className="text-white font-black">{produit.quantite_prod} {produit.unite}</span>
                        </span>
                        <span className="w-1 h-1 bg-emerald-500/30 rounded-full" />
                        <span className="flex items-center gap-1.5">
                          VALEUR: <span className="text-emerald-500">{produit.prix_prod} USD</span>
                        </span>
                        <span className="w-1 h-1 bg-emerald-500/30 rounded-full" />
                        <span>DATE: <span className="text-white/40">{new Date(produit.date_recolte).toLocaleDateString()}</span></span>
                      </div>
                    </div>
                  </div>

                  {/* Statut & Actions */}
                  <div className="flex flex-wrap items-center gap-6 ml-auto lg:ml-0">
                    {produit.annonce && produit.annonce.length > 0 ? (
                      <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/5 border border-emerald-500/20 rounded-full">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
                        <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest italic">Live_Market</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full">
                        <div className="w-1.5 h-1.5 bg-white/20 rounded-full" />
                        <span className="text-[9px] font-black text-white/20 uppercase tracking-widest italic">Local_Storage</span>
                      </div>
                    )}

                    <div className="flex items-center gap-3 pl-6 border-l border-white/10">
                      <button 
                        onClick={() => {
                          if(confirm("Confirmer la suppression définitive du produit ?")) {
                            deleteProduit(produit.id);
                          }
                        }}
                        className="p-3 text-white/10 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all active:scale-90"
                        title="Supprimer"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>

                      {/* Modal de publication stylisé par défaut */}
                      <PublierAnnonceModal produit={produit} />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* BOUTON VOIR TOUT / RÉDUIRE */}
            {filteredProduits.length > displayLimit && (
              <div className="flex justify-center mt-6">
                <Button 
                  variant="ghost" 
                  onClick={() => setShowAll(!showAll)}
                  className="h-12 px-8 rounded-xl bg-white/[0.02] border border-white/5 text-[9px] font-black uppercase tracking-[0.4em] text-white/30 hover:text-emerald-500 hover:bg-emerald-500/5 transition-all"
                >
                  {showAll ? (
                    <span className="flex items-center gap-3 italic">RÉDUIRE LA MATRICE <ChevronUp className="w-4 h-4" /></span>
                  ) : (
                    <span className="flex items-center gap-3 italic">
                      DÉPLOYER TOUT ({filteredProduits.length}) <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
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