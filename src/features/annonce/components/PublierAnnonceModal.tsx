// src/features/annonce/components/PublierAnnonceModal.tsx
import React, { useState, useEffect } from 'react';
import { useAnnonces } from '../hooks/useAnnonces';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Megaphone, Calculator, ArrowRight } from "lucide-react";

interface Props {
  produit: any; // L'objet complet depuis la table produit
}

export function PublierAnnonceModal({ produit }: Props) {
  const { publierAnnonce, loading } = useAnnonces();
  const [open, setOpen] = useState(false);
  const [quantite, setQuantite] = useState(produit.quantite_prod);
  const [prixUnitaire, setPrixUnitaire] = useState(produit.prix_prod);

  // Calcul dynamique du prix total
  const prixTotal = (quantite * prixUnitaire).toFixed(2);

  const handlePublish = async () => {
    const success = await publierAnnonce({
      prod_id: produit.id,
      quantite_publiee: quantite,
      prix_unitaire: prixUnitaire
    });
    if (success) setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 p-2.5 text-primary/60 hover:text-primary hover:bg-primary/10 rounded-xl transition-all border border-white/5 bg-white/5">
          <Megaphone className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-widest">Vendre</span>
        </button>
      </DialogTrigger>

      <DialogContent className="bg-[#0a0a0a] border-white/10 text-white sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-black uppercase italic text-glow-green flex items-center gap-2">
            Mise en Marché
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* RÉCAPITULATIF PRODUIT */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/5">
            <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Produit sélectionné</p>
            <h4 className="text-lg font-black uppercase text-primary italic">{produit.nom_prod}</h4>
          </div>

          {/* CONFIGURATION DE L'OFFRE */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-foreground/40">Quantité à vendre</label>
              <Input 
                type="number" 
                value={quantite} 
                onChange={(e) => setQuantite(Number(e.target.value))}
                className="bg-white/5 border-white/10 font-bold"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-foreground/40">Prix / {produit.unite}</label>
              <Input 
                type="number" 
                value={prixUnitaire} 
                onChange={(e) => setPrixUnitaire(Number(e.target.value))}
                className="bg-white/5 border-white/10 font-bold text-primary"
              />
            </div>
          </div>

          {/* CALCULATEUR DE REVENUS */}
          <div className="p-6 rounded-2xl bg-primary/10 border-2 border-primary/20 flex flex-col items-center justify-center gap-2 shadow-[0_0_30px_rgba(34,197,94,0.1)]">
            <div className="flex items-center gap-2 text-primary">
              <Calculator className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Revenu Total Estimé</span>
            </div>
            <div className="text-4xl font-black italic tracking-tighter">
              {prixTotal} <span className="text-sm font-bold opacity-50">$</span>
            </div>
          </div>

          <Button 
            onClick={handlePublish}
            disabled={loading || quantite <= 0}
            className="w-full h-14 bg-primary text-black font-black uppercase italic tracking-widest hover:bg-primary/80"
          >
            {loading ? "SYNCHRONISATION..." : "PROPAGER L'ANNONCE SUR LE RÉSEAU"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}