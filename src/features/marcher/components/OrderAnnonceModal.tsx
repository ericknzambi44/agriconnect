// src/features/marcher/components/OrderAnnonceModal.tsx
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingCart, BadgeDollarSign, Weight, Loader2, AlertCircle, Info } from "lucide-react";
import { MarketAnnonce } from '../hooks/useMarketplace';

interface Props {
  annonce: MarketAnnonce;
  onOrder: (annonce: MarketAnnonce, quantite: number) => Promise<any>;
  loading: boolean;
}

export function OrderAnnonceModal({ annonce, onOrder, loading }: Props) {
  const [open, setOpen] = useState(false);
  // On commence par 1 ou le max s'il reste moins de 1
  const [qty, setQty] = useState<number>(1);

  const available = annonce.quantite_restante || 0;
  const isInvalid = qty <= 0 || qty > available;

  // Sync qty si le stock restant change ou à l'ouverture
  useEffect(() => {
    if (available > 0 && qty > available) setQty(available);
  }, [available, open]);

  const safePrix = annonce?.produit?.prix_prod || 0;
  const total = (qty * safePrix).toFixed(2);

  const handleOrder = async () => {
    if (isInvalid) return;
    const success = await onOrder(annonce, qty);
    if (success) {
      setOpen(false);
      setQty(1);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase italic rounded-2xl px-6 group transition-all active:scale-95">
          Postuler
          <ShoppingCart className="w-4 h-4 ml-2 group-hover:scale-110 transition-transform" />
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-[#050505] border-white/5 text-white sm:max-w-[450px] rounded-[3rem] shadow-2xl backdrop-blur-3xl p-0 overflow-hidden outline-none">
        <div className="p-10">
          <DialogHeader>
            <DialogTitle className="text-3xl font-black uppercase italic tracking-tighter text-white">
              Saisir <span className="text-emerald-500">Quantité</span>
            </DialogTitle>
            <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] mt-2 italic border-l border-emerald-500/50 pl-3">
              Validation_Volume_Annonce
            </p>
          </DialogHeader>

          <div className="mt-8 space-y-6">
            {/* RÉCAP PRODUIT & DISPONIBILITÉ RÉELLE DE L'ANNONCE */}
            <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[9px] font-black text-emerald-500/50 uppercase tracking-widest">Lot_Sélectionné</p>
                  <p className="text-lg font-black uppercase text-white tracking-tight truncate max-w-[200px]">
                    {annonce.produit?.nom_prod}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black text-white/20 uppercase">Disponible</p>
                  <p className="text-lg font-black text-white italic">
                    {available} <span className="text-[10px] opacity-40">{annonce.produit?.unite}</span>
                  </p>
                </div>
              </div>
              
              {/* Barre visuelle du stock restant dans l'annonce */}
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-700"
                  style={{ width: `${(available / (annonce.quantite_vendre || available)) * 100}%` }}
                />
              </div>
            </div>

            {/* INPUT DE QUANTITÉ */}
            <div className="space-y-3">
              <div className="flex justify-between items-center px-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">
                  Votre_Part ({annonce.produit?.unite})
                </label>
                {isInvalid && qty > 0 && (
                  <span className="text-[9px] font-black text-red-500 uppercase animate-pulse">
                    Capacité_Dépassée
                  </span>
                )}
              </div>
              <div className="relative">
                <Weight className={`absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${isInvalid ? 'text-red-500' : 'text-emerald-500'}`} />
                <Input 
                  type="number" 
                  min="0.1"
                  max={available}
                  step="any"
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  className={`h-16 bg-[#080808] border-white/10 rounded-2xl pl-14 text-xl font-black text-white focus:ring-emerald-500/20 transition-all ${isInvalid ? 'border-red-500/50 bg-red-500/5' : ''}`}
                />
                <button 
                  onClick={() => setQty(available)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[8px] font-black uppercase text-white/40 transition-colors"
                >
                  MAX
                </button>
              </div>
            </div>

            {/* TOTAL ET INFO PRIX */}
            <div className="pt-4 border-t border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white/40 italic">
                  <BadgeDollarSign className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Coût_Transaction</span>
                </div>
                <div className="text-3xl font-black text-[#bef264] tracking-tighter">
                  {total} <span className="text-sm opacity-50">$</span>
                </div>
              </div>

              {/* Petit avertissement si l'utilisateur essaie de tout prendre */}
              {qty === available && available > 0 && (
                <div className="flex items-center gap-2 p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                  <Info className="w-3 h-3 text-emerald-500" />
                  <p className="text-[8px] font-black text-emerald-500/60 uppercase tracking-tighter">
                    Vous allez acquérir l'intégralité du lot restant.
                  </p>
                </div>
              )}
            </div>

            <Button 
              onClick={handleOrder}
              disabled={loading || isInvalid}
              className="w-full h-16 bg-emerald-500 text-black font-black uppercase italic text-sm tracking-[0.2em] rounded-2xl shadow-xl shadow-emerald-500/10 hover:shadow-emerald-500/30 transition-all active:scale-95 group disabled:opacity-20 disabled:grayscale"
            >
              {loading ? <Loader2 className="animate-spin w-6 h-6" /> : (
                <span className="flex items-center gap-3">
                  Transmettre l'Ordre
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Icône ArrowRight pour le bouton
const ArrowRight = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
);