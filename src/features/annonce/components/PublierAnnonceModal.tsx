// src/features/annonce/components/PublierAnnonceModal.tsx
import React, { useState } from 'react';
import { useAnnonces } from '../hooks/useAnnonces';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Megaphone, 
  Calculator, 
  ArrowRight, 
  BadgeDollarSign, 
  AlertCircle, 
  Loader2, 
  Zap,
  Globe
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  produit: any; 
}

export function PublierAnnonceModal({ produit }: Props) {
  const { publierAnnonce, loading } = useAnnonces();
  const [open, setOpen] = useState(false);
  
  const [quantite, setQuantite] = useState(produit.quantite_prod);
  const [prixUnitaire, setPrixUnitaire] = useState(produit.prix_prod);

  const prixTotal = (quantite * prixUnitaire).toFixed(2);
  const isOverStock = quantite > produit.quantite_prod;

  const handlePublish = async () => {
    const success = await publierAnnonce({
      prod_id: produit.id,
      quantite_vendre: quantite, 
    });
    if (success) setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2.5 px-5 py-2.5 bg-primary/10 text-primary hover:bg-gradient-to-r hover:from-primary hover:to-orange-400 hover:text-black rounded-2xl transition-all duration-300 border border-primary/30 shadow-md group">
          <Megaphone className="w-4 h-4 group-hover:-rotate-12 transition-transform" strokeWidth={2.5} />
          <span className="text-[10px] font-display font-black uppercase tracking-[0.2em] italic">Publier</span>
        </button>
      </DialogTrigger>

      <DialogContent className="bg-gradient-to-b from-black/90 to-[#0a0a0a] border border-white/10 text-white sm:max-w-[450px] rounded-[2rem] shadow-2xl shadow-primary/20 backdrop-blur-xl outline-none p-0 overflow-hidden font-tech">
        
        {/* Ligne de scan lumineuse */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-orange-400 animate-pulse" />

        <div className="p-6 md:p-8">
          <DialogHeader className="mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-primary to-orange-400 rounded-2xl text-black shadow-lg shadow-primary/30 -rotate-6">
                <Globe className="w-6 h-6" strokeWidth={2.5} />
              </div>
              <div>
                <DialogTitle className="text-2xl font-display font-black uppercase italic tracking-tighter text-white">
                  Mise en <span className="text-primary">marché</span>
                </DialogTitle>
                <p className="text-[8px] font-black text-white/40 uppercase tracking-[0.4em] mt-1 italic">Déploiement sur le marketplace</p>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-5">
            {/* RÉCAPITULATIF PRODUIT */}
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-3xl rounded-full group-hover:bg-primary/10 transition-colors" />
              <div className="flex justify-between items-center relative z-10">
                <div>
                  <p className="text-[8px] font-black text-white/40 uppercase tracking-[0.3em] mb-1">Produit</p>
                  <h4 className="text-xl font-display font-black uppercase text-primary italic tracking-tight">{produit.nom_prod}</h4>
                </div>
                <div className="text-right flex flex-col items-end">
                  <div className="flex items-center gap-2 px-2 py-1 bg-black/40 rounded-lg border border-white/10 mb-1">
                    <Zap size={10} className="text-primary" />
                    <span className="text-[8px] font-black text-white/40 uppercase">Stock actuel</span>
                  </div>
                  <p className="text-xs font-black text-white italic">{produit.quantite_prod} {produit.unite}</p>
                </div>
              </div>
            </div>

            {/* CONFIGURATION DE L'OFFRE */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/50 ml-1">Quantité à vendre</label>
                <Input 
                  type="number" 
                  value={quantite} 
                  onChange={(e) => setQuantite(Number(e.target.value))}
                  className={cn(
                    "bg-white/[0.02] border border-white/10 font-black h-12 rounded-xl focus-visible:ring-primary/30 focus-visible:border-primary/50 text-white transition-all",
                    isOverStock && "border-red-500/50 text-red-400 bg-red-500/10"
                  )}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/50 ml-1">Prix unitaire ({produit.unite})</label>
                <div className="relative">
                  <BadgeDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/60" strokeWidth={3} />
                  <Input 
                    type="number" 
                    value={prixUnitaire} 
                    onChange={(e) => setPrixUnitaire(Number(e.target.value))}
                    className="bg-white/[0.02] border border-white/10 font-black h-12 pl-9 rounded-xl focus-visible:ring-primary/30 focus-visible:border-primary/50 text-primary"
                  />
                </div>
              </div>
            </div>

            {/* ALERTE DÉPASSEMENT */}
            {isOverStock && (
              <div className="flex items-center gap-3 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl animate-in slide-in-from-top-2">
                <AlertCircle className="w-4 h-4 text-red-400" strokeWidth={3} />
                <p className="text-[9px] font-black text-red-400 uppercase tracking-wider">Stock insuffisant</p>
              </div>
            )}

            {/* VALEUR TOTALE */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-primary/10 to-transparent border border-primary/30 flex flex-col items-center justify-center gap-2 relative overflow-hidden group transition-all">
              <div className="flex items-center gap-2 text-primary/60">
                <Calculator className="w-4 h-4" />
                <span className="text-[9px] font-black uppercase tracking-[0.4em]">Valeur totale de l'offre</span>
              </div>
              <div className="text-4xl font-display font-black italic tracking-tighter text-white">
                {prixTotal} <span className="text-sm font-black text-primary/60">USD</span>
              </div>
            </div>

            <Button 
              onClick={handlePublish}
              disabled={loading || quantite <= 0 || isOverStock}
              className="w-full h-14 bg-gradient-to-r from-primary to-orange-400 text-black font-display font-black uppercase italic tracking-[0.2em] rounded-xl shadow-lg shadow-primary/30 hover:scale-[1.02] transition-all active:scale-[0.98] group disabled:opacity-40 disabled:grayscale"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Synchronisation...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Publier l'offre
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform stroke-[2.5px]" />
                </span>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}