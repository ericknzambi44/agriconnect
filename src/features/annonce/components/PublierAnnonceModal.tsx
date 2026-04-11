// src/features/annonce/components/PublierAnnonceModal.tsx
import React, { useState } from 'react';
import { useAnnonces } from '../hooks/useAnnonces';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Megaphone, Calculator, ArrowRight, BadgeDollarSign, AlertCircle } from "lucide-react";

interface Props {
  produit: any; 
}

export function PublierAnnonceModal({ produit }: Props) {
  const { publierAnnonce, loading } = useAnnonces();
  const [open, setOpen] = useState(false);
  
  // Par défaut, on propose de tout vendre
  const [quantite, setQuantite] = useState(produit.quantite_prod);
  const [prixUnitaire, setPrixUnitaire] = useState(produit.prix_prod);

  const prixTotal = (quantite * prixUnitaire).toFixed(2);
  const isOverStock = quantite > produit.quantite_prod;

  const handlePublish = async () => {
    // On envoie 'quantite_vendre' au hook pour la nouvelle logique de table
    const success = await publierAnnonce({
      prod_id: produit.id,
      quantite_vendre: quantite, 
      // Note: prix_total est calculé dans le hook, mais on peut le passer si besoin
    });
    if (success) setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2.5 px-4 py-2.5 text-emerald-500/60 hover:text-emerald-500 hover:bg-emerald-500/10 rounded-xl transition-all border border-white/5 bg-white/[0.02] group">
          <Megaphone className="w-4 h-4 group-hover:-rotate-12 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">Vendre</span>
        </button>
      </DialogTrigger>

      <DialogContent className="bg-[#050505] border-white/5 text-white sm:max-w-[420px] rounded-[2.5rem] shadow-2xl shadow-emerald-500/5 backdrop-blur-2xl outline-none">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter text-white flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-500">
              <Megaphone className="w-6 h-6" />
            </div>
            Mise en <span className="text-emerald-500">Marché</span>
          </DialogTitle>
          <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] mt-1 italic pl-1">Déploiement sur le réseau pishopy</p>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* RÉCAPITULATIF PRODUIT ET STOCK RÉEL */}
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 blur-2xl rounded-full" />
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] mb-1">Source_Produit</p>
                <h4 className="text-xl font-black uppercase text-emerald-500 italic tracking-tight">{produit.nom_prod}</h4>
              </div>
              <div className="text-right">
                <p className="text-[8px] font-black text-white/20 uppercase">Stock_Total</p>
                <p className="text-xs font-black text-white italic">{produit.quantite_prod} {produit.unite}</p>
              </div>
            </div>
          </div>

          {/* CONFIGURATION DE L'OFFRE */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 ml-1">Volume_à_vendre</label>
              <Input 
                type="number" 
                value={quantite} 
                onChange={(e) => setQuantite(Number(e.target.value))}
                className={`bg-white/[0.02] font-black h-14 rounded-2xl focus-visible:ring-emerald-500/20 text-white transition-colors ${isOverStock ? 'border-red-500/50 text-red-400' : 'border-white/10'}`}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 ml-1">Prix_Unit ({produit.unite})</label>
              <div className="relative">
                <BadgeDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500/40" />
                <Input 
                  type="number" 
                  value={prixUnitaire} 
                  onChange={(e) => setPrixUnitaire(Number(e.target.value))}
                  className="bg-white/[0.02] border-white/10 font-black h-14 pl-12 rounded-2xl focus-visible:ring-emerald-500/20 text-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* MESSAGE D'ALERTE SI OVERSTOCK */}
          {isOverStock && (
            <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl animate-pulse">
              <AlertCircle className="w-3 h-3 text-red-500" />
              <p className="text-[8px] font-black text-red-500 uppercase tracking-widest">Attention : dépassement du stock physique</p>
            </div>
          )}

          {/* CALCULATEUR DE REVENUS */}
          <div className="p-8 rounded-[2rem] bg-emerald-500/[0.03] border border-emerald-500/10 flex flex-col items-center justify-center gap-3 relative overflow-hidden group">
            <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center gap-2 text-emerald-500/40 relative z-10">
              <Calculator className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Valeur_de_l_offre</span>
            </div>
            <div className="text-5xl font-black italic tracking-tighter text-white relative z-10">
              {prixTotal} <span className="text-base font-black text-emerald-500 opacity-50">USD</span>
            </div>
          </div>

          <Button 
            onClick={handlePublish}
            disabled={loading || quantite <= 0 || isOverStock}
            className="w-full h-16 bg-emerald-500 text-black font-black uppercase italic tracking-[0.2em] rounded-2xl shadow-xl shadow-emerald-500/10 hover:bg-emerald-400 hover:shadow-emerald-500/25 transition-all active:scale-[0.98] group disabled:opacity-50 disabled:grayscale"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> SYNCHRONISATION...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                PROPAGER L'OFFRE
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform stroke-[3px]" />
              </span>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const Loader2 = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
);