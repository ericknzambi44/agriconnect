import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Package, ArrowRight, Zap, Target, CheckCircle2 } from "lucide-react";
import { MarketAnnonce } from '../hooks/useMarketplace';
import { cn } from "@/lib/utils";

interface Props {
  annonce: MarketAnnonce;
  onOrder: (annonce: MarketAnnonce, quantite: number) => Promise<boolean>;
  loading: boolean;
}

export function OrderAnnonceModal({ annonce, onOrder, loading }: Props) {
  const [open, setOpen] = useState(false);
  const [qty, setQty] = useState<number>(1);

  const available = annonce.quantite_restante || 0;
  const isInvalid = qty <= 0 || qty > available;

  useEffect(() => {
    if (open) {
      setQty(available < 1 && available > 0 ? available : 1);
    }
  }, [open, available]);

  const safePrix = annonce?.produit?.prix_prod || 0;
  const total = (qty * safePrix).toFixed(2);

  const handleOrder = async () => {
    if (isInvalid) return;
    const success = await onOrder(annonce, qty);
    if (success) setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {/* BOUTON D'APPEL : Style Node Actif */}
        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-display font-black uppercase italic rounded-xl h-10 text-[10px] tracking-[0.2em] group transition-all active:scale-95 shadow-lg shadow-primary/10">
          <span>POSTULER_OFFRE</span>
          <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-secondary border-2 border-border sm:max-w-[380px] w-[92vw] rounded-[1.8rem] shadow-2xl p-0 overflow-hidden outline-none animate-in fade-in zoom-in-95">
        
        <div className="relative p-6">
          {/* Filigrane Tech */}
          <div className="absolute -top-4 -right-4 opacity-[0.03] pointer-events-none rotate-12">
            <Target size={120} className="text-primary" />
          </div>

          <DialogHeader className="relative z-10 mb-6">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="font-tech text-[8px] font-black text-muted-foreground uppercase tracking-[0.3em]">
                Protocol_Order_AgriConnect
              </span>
            </div>
            <DialogTitle className="text-3xl font-display font-black uppercase italic tracking-tighter leading-none text-foreground">
              ORDRE_<span className="text-primary text-glow">FLUX</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5 relative z-10">
            {/* RÉCAPITULATIF PRODUIT */}
            <div className="flex items-center gap-4 p-3 bg-background border-2 border-border rounded-xl">
              <div className="w-12 h-12 rounded-lg overflow-hidden border-2 border-border bg-secondary shrink-0">
                {annonce.produit?.image ? (
                  <img src={annonce.produit.image} className="w-full h-full object-cover" alt="thumb" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary/5">
                    <Package size={16} className="text-primary/20" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-display text-[12px] font-black text-foreground uppercase truncate italic">{annonce.produit?.nom_prod}</h4>
                <p className="font-tech text-[8px] text-primary font-bold uppercase mt-1 tracking-widest italic leading-none">
                  STOCK_DISPONIBLE: {available} {annonce.produit?.unite}
                </p>
              </div>
            </div>

            {/* INPUT QUANTITÉ STYLE TERMINAL */}
            <div className="space-y-2">
              <label className="font-tech text-[8px] font-black uppercase text-muted-foreground/50 tracking-widest ml-1">_VOLUME_REQUIS</label>
              <div className="relative group">
                <Input 
                  type="number" 
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  className={cn(
                    "h-12 bg-background border-2 border-border rounded-xl pl-4 pr-16 font-tech text-base italic text-foreground focus-visible:border-primary transition-all outline-none shadow-inner",
                    isInvalid && "border-red-500/50 bg-red-500/5 text-red-500"
                  )}
                />
                <button 
                  type="button"
                  onClick={() => setQty(available)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground rounded-lg text-[8px] font-black uppercase transition-all italic"
                >
                  MAX_LIMIT
                </button>
              </div>
            </div>

            {/* TOTAL : STYLE FACTURE ÉLECTRONIQUE */}
            <div className="p-4 bg-primary/5 border-2 border-primary/10 rounded-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-1 opacity-10">
                  <Zap size={24} className="text-primary" />
               </div>
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="font-tech text-[8px] text-muted-foreground uppercase tracking-widest leading-none">Valeur_Transactionnelle</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-3xl font-display font-black italic text-primary tracking-tighter leading-none">{total}</span>
                    <span className="text-[10px] font-tech font-black text-primary/40 italic">USD</span>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end">
                  <span className="font-tech text-[8px] text-muted-foreground/40 uppercase">P.U_REF</span>
                  <p className="font-tech text-[10px] text-foreground font-black italic">{safePrix}$/{annonce.produit?.unite}</p>
                </div>
              </div>
            </div>

            {/* BOUTON DE VALIDATION */}
            <div className="pt-2">
              <Button 
                onClick={handleOrder}
                disabled={loading || isInvalid}
                className="w-full h-14 bg-primary text-primary-foreground font-display font-black uppercase italic text-[11px] tracking-[0.2em] rounded-xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-20"
              >
                {loading ? <Loader2 className="animate-spin" /> : (
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={16} />
                    <span>CONFIRMER_ORDRE_NODE</span>
                  </div>
                )}
              </Button>
              
              {isInvalid && qty > 0 && (
                <p className="mt-3 text-[8px] font-tech font-black text-red-500 uppercase tracking-widest text-center animate-pulse italic">
                  !! ERREUR_SYSTÈME: CAPACITÉ_STOCK_DÉPASSÉE !!
                </p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}