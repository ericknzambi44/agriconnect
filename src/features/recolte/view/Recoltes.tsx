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
  Database,
  MapPin
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
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-32 selection:bg-primary/30 font-tech bg-gradient-to-br from-[#0a0a0a] via-[#050505] to-black">
      
      {/* HEADER AVEC TITRE DÉGRADÉ */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 px-1">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-white/[0.02] border border-primary/20 rounded-[1.5rem] flex items-center justify-center shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-500">
             <Database className="text-primary w-8 h-8" strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-4xl md:text-6xl font-display font-black tracking-tighter uppercase italic text-white leading-none">
              Gestion{' '}
              <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
                stock
              </span>
            </h1>
            <p className="text-primary/50 text-[9px] md:text-[10px] font-black uppercase tracking-[0.5em] mt-3 italic">
              Inventaire local & synchronisation réseau
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={refresh}
            className="border border-white/10 bg-white/[0.02] hover:bg-primary/10 hover:border-primary/40 transition-all rounded-2xl h-14 w-14 shadow-xl"
          >
            <RefreshCcw className={cn("w-5 h-5 text-primary/60", loading && "animate-spin text-primary")} strokeWidth={3} />
          </Button>
          
          <AddRecolteModal /> 
        </div>
      </div>

      {/* RECHERCHE */}
      <div className="relative max-w-xl group px-1">
        <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-3">
          <Search className="w-5 h-5 text-white/30 group-focus-within:text-primary transition-colors" strokeWidth={3} />
          <div className="w-[1px] h-4 bg-white/10" />
        </div>
        <Input 
          placeholder="RECHERCHER DANS LA MATRICE..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-16 bg-white/[0.02] border border-white/10 pl-20 font-black text-[11px] tracking-[0.2em] focus-visible:ring-primary/30 focus-visible:border-primary/50 text-white uppercase rounded-[1.5rem] transition-all backdrop-blur-xl shadow-inner"
        />
      </div>

      {/* LISTE DES PRODUITS */}
      <div className="grid gap-6">
        {loading && produits.length === 0 ? (
          [1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full bg-white/[0.02] rounded-[2.5rem] border border-white/10" />
          ))
        ) : filteredProduits.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-white/10 rounded-[3rem] bg-white/[0.02] backdrop-blur-sm">
            <AlertCircle className="w-16 h-16 text-white/10 mb-6" />
            <p className="text-white/30 font-black uppercase tracking-[0.4em] text-[10px] text-center px-4 italic">
              Aucune ressource identifiée dans ce secteur
            </p>
          </div>
        ) : (
          <>
            {displayedProduits.map((produit) => (
              <div 
                key={produit.id}
                className="group relative bg-white/[0.02] border border-white/10 hover:border-primary/50 p-6 md:p-8 rounded-[2.5rem] transition-all duration-700 hover:shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
              >
                {/* Effet de lueur */}
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity rounded-[2.5rem] blur-xl" />

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
                  
                  {/* INFOS PRODUIT */}
                  <div className="flex items-center gap-8">
                    <div className="w-24 h-24 rounded-3xl bg-black/40 border border-white/10 overflow-hidden flex items-center justify-center group-hover:border-primary/50 transition-all duration-700 shadow-2xl relative">
                      {produit.image ? (
                        <img 
                          src={produit.image} 
                          alt={produit.nom_prod} 
                          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-125"
                        />
                      ) : (
                        <Package className="w-10 h-10 text-white/20 group-hover:text-primary/40 transition-all" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center gap-4">
                         <h3 className="text-2xl md:text-3xl font-display font-black uppercase italic tracking-tighter leading-none text-white group-hover:text-primary transition-colors duration-500">
                           {produit.nom_prod}
                         </h3>
                         {produit.categorie && (
                           <span className="text-[8px] border border-primary/30 px-3 py-1 rounded-lg text-primary uppercase font-black tracking-widest bg-primary/10">
                             {produit.categorie.libelle_categorie}
                           </span>
                         )}
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em]">
                        <div className="flex flex-col">
                          <span className="text-white/40 text-[8px] mb-1">Volume disponible</span>
                          <span className="text-white italic">{produit.quantite_prod} {produit.unite}</span>
                        </div>
                        <div className="w-px h-6 bg-white/10 hidden md:block" />
                        <div className="flex flex-col">
                          <span className="text-white/40 text-[8px] mb-1">Prix unitaire (USD)</span>
                          <span className="text-primary italic">{produit.prix_prod}$ / {produit.unite}</span>
                        </div>
                        <div className="w-px h-6 bg-white/10 hidden md:block" />
                        <div className="flex flex-col">
                          <span className="text-white/40 text-[8px] mb-1">Date récolte</span>
                          <span className="text-white/60 italic">{new Date(produit.date_recolte).toLocaleDateString()}</span>
                        </div>
                        {/* AFFICHAGE LIEU CULTURE */}
                        {produit.lieu_culture && (
                          <>
                            <div className="w-px h-6 bg-white/10 hidden md:block" />
                            <div className="flex flex-col">
                              <span className="text-white/40 text-[8px] mb-1 flex items-center gap-1"><MapPin size={10} /> Lieu culture</span>
                              <span className="text-primary/80 italic">{produit.lieu_culture}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex flex-wrap items-center gap-8 ml-auto lg:ml-0">
                    {produit.annonce && produit.annonce.length > 0 ? (
                      <div className="flex items-center gap-3 px-6 py-3 bg-primary/10 border border-primary/30 rounded-2xl shadow-lg shadow-primary/10">
                        <Zap size={14} className="text-primary fill-primary animate-pulse" />
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] italic">Actif sur le marché</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 px-6 py-3 bg-white/[0.02] border border-white/10 rounded-2xl">
                        <Layers size={14} className="text-white/20" />
                        <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] italic">Stocké localement</span>
                      </div>
                    )}

                    <div className="flex items-center gap-4 pl-8 border-l border-white/10">
                      <button 
                        onClick={() => {
                          if(confirm("Confirmer la désactivation de la ressource ?")) {
                            deleteProduit(produit.id);
                          }
                        }}
                        className="p-4 text-white/30 hover:text-red-400 hover:bg-red-500/10 rounded-2xl transition-all active:scale-90 border border-transparent hover:border-red-500/30"
                        title="Supprimer"
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
                  className="h-14 px-10 rounded-2xl bg-white/[0.02] border border-white/10 text-[10px] font-black uppercase tracking-[0.4em] text-white/40 hover:text-primary hover:border-primary/50 transition-all hover:bg-primary/5"
                >
                  {showAll ? (
                    <span className="flex items-center gap-4 italic">Réduire la liste <ChevronUp className="w-5 h-5 text-primary" /></span>
                  ) : (
                    <span className="flex items-center gap-4 italic">
                      Voir tous les produits ({filteredProduits.length}) <ChevronDown className="w-5 h-5 text-primary" />
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