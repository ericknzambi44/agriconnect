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
        <button className="flex items-center gap-2.5 px-5 py-2.5 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground rounded-2xl transition-all duration-300 border border-primary/20 shadow-glow-primary/5 group">
          <Megaphone className="w-4 h-4 group-hover:-rotate-12 transition-transform" strokeWidth={2.5} />
          <span className="text-[10px] font-display font-black uppercase tracking-[0.2em] italic">Vendre</span>
        </button>
      </DialogTrigger>

      <DialogContent className="bg-secondary/95 border-primary/20 text-foreground sm:max-w-[450px] rounded-[3rem] shadow-2xl shadow-primary/5 backdrop-blur-3xl outline-none p-0 overflow-hidden font-tech border-l-4 border-l-primary">
        
        {/* Effet visuel de scan en fond */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent animate-pulse" />

        <div className="p-8 md:p-10">
          <DialogHeader className="mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary rounded-2xl text-primary-foreground shadow-glow-primary -rotate-6">
                <Globe className="w-6 h-6" strokeWidth={2.5} />
              </div>
              <div>
                <DialogTitle className="text-2xl font-display font-black uppercase italic tracking-tighter text-foreground">
                  Mise_en <span className="text-primary">_MARCHÉ</span>
                </DialogTitle>
                <p className="text-[9px] font-black text-primary/40 uppercase tracking-[0.4em] mt-1 italic">déploiement_nexus_pyshopy_v3</p>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {/* RÉCAPITULATIF SOURCE */}
            <div className="p-6 rounded-3xl bg-background/50 border border-border/40 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-3xl rounded-full group-hover:bg-primary/10 transition-colors" />
              <div className="flex justify-between items-center relative z-10">
                <div>
                  <p className="text-[8px] font-black text-muted-foreground/40 uppercase tracking-[0.3em] mb-1">SOURCE_UNIT</p>
                  <h4 className="text-xl font-display font-black uppercase text-primary italic tracking-tight">{produit.nom_prod}</h4>
                </div>
                <div className="text-right flex flex-col items-end">
                  <div className="flex items-center gap-2 px-2 py-1 bg-black/20 rounded-lg border border-white/5 mb-1">
                    <Zap size={10} className="text-primary" />
                    <span className="text-[8px] font-black text-white/40 uppercase">STOCK_ACTUEL</span>
                  </div>
                  <p className="text-xs font-black text-foreground italic">{produit.quantite_prod} {produit.unite}</p>
                </div>
              </div>
            </div>

            {/* CONFIGURATION DE L'OFFRE */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2.5">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">Volume_Sortie</label>
                <Input 
                  type="number" 
                  value={quantite} 
                  onChange={(e) => setQuantite(Number(e.target.value))}
                  className={cn(
                    "bg-background/50 font-black h-14 rounded-2xl focus-visible:ring-primary/20 text-foreground transition-all border-border/40",
                    isOverStock && "border-red-500/50 text-red-500 bg-red-500/5"
                  )}
                />
              </div>
              <div className="space-y-2.5">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">Prix_Unit ({produit.unite})</label>
                <div className="relative">
                  <BadgeDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" strokeWidth={3} />
                  <Input 
                    type="number" 
                    value={prixUnitaire} 
                    onChange={(e) => setPrixUnitaire(Number(e.target.value))}
                    className="bg-background/50 border-border/40 font-black h-14 pl-12 rounded-2xl focus-visible:ring-primary/20 text-primary"
                  />
                </div>
              </div>
            </div>

            {/* MESSAGE D'ALERTE DÉPASSEMENT */}
            {isOverStock && (
              <div className="flex items-center gap-3 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-2xl animate-in slide-in-from-top-2">
                <AlertCircle className="w-4 h-4 text-red-500" strokeWidth={3} />
                <p className="text-[9px] font-black text-red-500 uppercase tracking-widest leading-none">ERREUR: CAPACITÉ_STOCK_DÉPASSÉE</p>
              </div>
            )}

            {/* CALCULATEUR DE VALEUR ORANGE */}
            <div className="p-8 rounded-[2.5rem] bg-primary/5 border border-primary/20 flex flex-col items-center justify-center gap-3 relative overflow-hidden group transition-all duration-500 hover:border-primary/40">
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity blur-2xl" />
              <div className="flex items-center gap-2 text-primary/40 relative z-10">
                <Calculator className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Valeur_Offre_Générée</span>
              </div>
              <div className="text-5xl font-display font-black italic tracking-tighter text-foreground relative z-10">
                {prixTotal} <span className="text-base font-black text-primary/50">USD</span>
              </div>
            </div>

            <Button 
              onClick={handlePublish}
              disabled={loading || quantite <= 0 || isOverStock}
              className="w-full h-20 bg-primary text-primary-foreground font-display font-black uppercase italic tracking-[0.3em] rounded-3xl shadow-glow-primary hover:scale-[1.02] transition-all active:scale-[0.98] group disabled:opacity-30 disabled:grayscale border-none"
            >
              {loading ? (
                <span className="flex items-center gap-3">
                  <Loader2 className="w-5 h-5 animate-spin" /> SYNCHRONISATION...
                </span>
              ) : (
                <span className="flex items-center gap-3">
                  Publier_L_OFFRE
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform stroke-[3px]" />
                </span>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}