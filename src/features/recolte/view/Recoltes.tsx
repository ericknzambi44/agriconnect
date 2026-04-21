// src/features/recolte/views/Recoltes.tsx
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
  ChevronUp,
  Zap,
  Layers,
  Database
} from "lucide-react";
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
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-32 selection:bg-primary/30 font-tech">
      
      {/* --- HEADER DE SECTION --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 px-1">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-secondary border border-primary/20 rounded-[1.5rem] flex items-center justify-center shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-500">
             <Database className="text-primary w-8 h-8" strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-4xl md:text-6xl font-display font-black tracking-tighter uppercase italic text-foreground leading-none">
              Gestion <span className="text-primary shadow-glow-primary">_STOCK</span>
            </h1>
            <p className="text-primary/40 text-[9px] md:text-[10px] font-black uppercase tracking-[0.5em] mt-3 italic">
              Inventaire_Local & Synchronisation_Réseau
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={refresh}
            className="border-border/40 bg-secondary/50 hover:bg-primary/10 hover:border-primary/40 transition-all rounded-2xl h-14 w-14 shadow-xl"
          >
            <RefreshCcw className={cn("w-5 h-5 text-primary/60", loading && "animate-spin text-primary")} strokeWidth={3} />
          </Button>
          
          <AddRecolteModal /> 
        </div>
      </div>

      {/* --- BARRE DE FILTRE --- */}
      <div className="relative max-w-xl group px-1">
        <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-3">
          <Search className="w-5 h-5 text-muted-foreground/30 group-focus-within:text-primary transition-colors" strokeWidth={3} />
          <div className="w-[1px] h-4 bg-border/40" />
        </div>
        <Input 
          placeholder="RECHERCHER_DANS_LA_MATRICE..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-16 bg-secondary/40 border-border/40 pl-20 font-black text-[11px] tracking-[0.2em] focus-visible:ring-primary/20 focus-visible:border-primary/40 text-foreground uppercase rounded-[1.5rem] transition-all backdrop-blur-xl shadow-inner"
        />
      </div>

      {/* --- LISTE DES PRODUITS --- */}
      <div className="grid gap-6">
        {loading && produits.length === 0 ? (
          [1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full bg-secondary/50 rounded-[2.5rem] border border-border/20" />
          ))
        ) : filteredProduits.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-border/20 rounded-[3rem] bg-secondary/20 backdrop-blur-sm">
            <AlertCircle className="w-16 h-16 text-muted-foreground/10 mb-6" />
            <p className="text-muted-foreground/30 font-black uppercase tracking-[0.4em] text-[10px] text-center px-4 italic">
              AUCUNE_RESSOURCE_IDENTIFIÉE_DANS_CE_SECTEUR
            </p>
          </div>
        ) : (
          <>
            {displayedProduits.map((produit) => (
              <div 
                key={produit.id}
                className="group relative bg-secondary/30 border border-border/50 hover:border-primary/40 p-6 md:p-8 rounded-[2.5rem] transition-all duration-700 hover:shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
              >
                {/* Effet de lueur arrière */}
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity rounded-[2.5rem] blur-xl" />

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
                  
                  {/* Info Produit */}
                  <div className="flex items-center gap-8">
                    <div className="w-24 h-24 rounded-3xl bg-black border border-border/40 overflow-hidden flex items-center justify-center group-hover:border-primary/50 transition-all duration-700 shadow-2xl relative">
                      {produit.image ? (
                        <img 
                          src={produit.image} 
                          alt={produit.nom_prod} 
                          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-125"
                        />
                      ) : (
                        <Package className="w-10 h-10 text-muted-foreground/10 group-hover:text-primary/40 transition-all" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center gap-4">
                         <h3 className="text-2xl md:text-3xl font-display font-black uppercase italic tracking-tighter leading-none text-foreground group-hover:text-primary transition-colors duration-500">
                           {produit.nom_prod}
                         </h3>
                         {produit.categorie && (
                           <span className="text-[8px] border border-primary/20 px-3 py-1 rounded-lg text-primary uppercase font-black tracking-widest bg-primary/5">
                             {produit.categorie.libelle_categorie}
                           </span>
                         )}
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em]">
                        <div className="flex flex-col">
                          <span className="text-muted-foreground/30 text-[8px] mb-1">VOLUME_DISPONIBLE</span>
                          <span className="text-foreground italic">{produit.quantite_prod} {produit.unite}</span>
                        </div>
                        <div className="w-px h-6 bg-border/40 hidden md:block" />
                        <div className="flex flex-col">
                          <span className="text-muted-foreground/30 text-[8px] mb-1">VALUATION_USD</span>
                          <span className="text-primary italic">{produit.prix_prod}$ / UNIT</span>
                        </div>
                        <div className="w-px h-6 bg-border/40 hidden md:block" />
                        <div className="flex flex-col">
                          <span className="text-muted-foreground/30 text-[8px] mb-1">DATA_LOG</span>
                          <span className="text-muted-foreground/60 italic">{new Date(produit.date_recolte).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Statut & Actions */}
                  <div className="flex flex-wrap items-center gap-8 ml-auto lg:ml-0">
                    {produit.annonce && produit.annonce.length > 0 ? (
                      <div className="flex items-center gap-3 px-6 py-3 bg-primary/10 border border-primary/30 rounded-2xl shadow-glow-primary/10">
                        <Zap size={14} className="text-primary fill-primary animate-pulse" />
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] italic">Actif sur le marcher</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 px-6 py-3 bg-background/50 border border-border/40 rounded-2xl">
                        <Layers size={14} className="text-muted-foreground/20" />
                        <span className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-[0.3em] italic">STOCKE_LOCAL</span>
                      </div>
                    )}

                    <div className="flex items-center gap-4 pl-8 border-l border-border/40">
                      <button 
                        onClick={() => {
                          if(confirm("Confirmer la désactivation de la ressource ?")) {
                            deleteProduit(produit.id);
                          }
                        }}
                        className="p-4 text-muted-foreground/20 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all active:scale-90 border border-transparent hover:border-red-500/20"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" strokeWidth={2.5} />
                      </button>

                      <PublierAnnonceModal produit={produit} />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* BOUTON VOIR TOUT */}
            {filteredProduits.length > displayLimit && (
              <div className="flex justify-center mt-10">
                <Button 
                  variant="ghost" 
                  onClick={() => setShowAll(!showAll)}
                  className="h-14 px-10 rounded-2xl bg-secondary/50 border border-border/40 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 hover:text-primary hover:border-primary/40 transition-all hover:bg-primary/5"
                >
                  {showAll ? (
                    <span className="flex items-center gap-4 italic">COMPRESSER_LA_MATRICE <ChevronUp className="w-5 h-5 text-primary" /></span>
                  ) : (
                    <span className="flex items-center gap-4 italic">
                      DÉPLOYER_LES_RESSOURCES ({filteredProduits.length}) <ChevronDown className="w-5 h-5 text-primary" />
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