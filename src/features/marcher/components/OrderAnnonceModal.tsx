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
        {/* BOUTON D'APPEL : Fix débordement et responsive */}
        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-display font-black uppercase italic rounded-xl h-9 md:h-10 px-2 md:px-4 group transition-all active:scale-95 shadow-lg shadow-primary/10 overflow-hidden">
          <span className="text-[9px] md:text-[10px] tracking-[0.1em] md:tracking-[0.2em] truncate">
            {/* Texte adaptatif pour mobile très petit */}
            <span className="xs:hidden">Achat</span>
            <span className="hidden xs:inline">Commander</span>
          </span>
          <ArrowRight className="w-3 h-3 ml-1 md:ml-2 group-hover:translate-x-1 transition-transform shrink-0" />
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-secondary border-2 border-border sm:max-w-[380px] w-[95vw] rounded-[1.5rem] md:rounded-[1.8rem] shadow-2xl p-0 overflow-hidden outline-none animate-in fade-in zoom-in-95 focus:ring-0">
        
        <div className="relative p-4 md:p-6">
          {/* Filigrane Tech */}
          <div className="absolute -top-4 -right-4 opacity-[0.03] pointer-events-none rotate-12">
            <Target size={120} className="text-primary" />
          </div>

          <DialogHeader className="relative z-10 mb-4 md:mb-6 text-left">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="font-tech text-[7px] md:text-[8px] font-black text-muted-foreground uppercase tracking-[0.2em] md:tracking-[0.3em]">
                Protocol_Order_AgriConnect
              </span>
            </div>
            <DialogTitle className="text-2xl md:text-3xl font-display font-black uppercase italic tracking-tighter leading-none text-foreground">
              ORDRE_<span className="text-primary text-glow">FLUX</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 md:space-y-5 relative z-10">
            {/* RÉCAPITULATIF PRODUIT */}
            <div className="flex items-center gap-3 md:gap-4 p-2 md:p-3 bg-background border border-border rounded-xl">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg overflow-hidden border border-border bg-secondary shrink-0">
                {annonce.produit?.image ? (
                  <img src={annonce.produit.image} className="w-full h-full object-cover" alt="thumb" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary/5">
                    <Package size={14} className="text-primary/20" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-display text-[10px] md:text-[12px] font-black text-foreground uppercase truncate italic">{annonce.produit?.nom_prod}</h4>
                <p className="font-tech text-[7px] md:text-[8px] text-primary font-bold uppercase mt-0.5 md:mt-1 tracking-widest italic leading-none truncate">
                  STOCK: {available} {annonce.produit?.unite}
                </p>
              </div>
            </div>

            {/* INPUT QUANTITÉ STYLE TERMINAL */}
            <div className="space-y-1.5">
              <label className="font-tech text-[7px] md:text-[8px] font-black uppercase text-muted-foreground/50 tracking-widest ml-1">_VOLUME_REQUIS</label>
              <div className="relative group">
                <Input 
                  type="number" 
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  className={cn(
                    "h-10 md:h-12 bg-background border border-border rounded-xl pl-3 pr-20 font-tech text-sm md:text-base italic text-foreground focus-visible:ring-1 focus-visible:ring-primary transition-all outline-none",
                    isInvalid && "border-red-500/50 bg-red-500/5 text-red-500"
                  )}
                />
                <button 
                  type="button"
                  onClick={() => setQty(available)}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2 py-1 bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground rounded-lg text-[7px] md:text-[8px] font-black uppercase transition-all italic whitespace-nowrap"
                >
                  MAX_CAP
                </button>
              </div>
            </div>

            {/* TOTAL : STYLE FACTURE */}
            <div className="p-3 md:p-4 bg-primary/5 border border-primary/10 rounded-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-1 opacity-10">
                  <Zap size={20} className="text-primary" />
               </div>
              <div className="flex justify-between items-center gap-2">
                <div className="flex flex-col min-w-0">
                  <span className="font-tech text-[7px] md:text-[8px] text-muted-foreground uppercase tracking-widest leading-none truncate">Valeur_Transaction</span>
                  <div className="flex items-baseline gap-1 mt-1 overflow-hidden">
                    <span className="text-2xl md:text-3xl font-display font-black italic text-primary tracking-tighter leading-none truncate">{total}</span>
                    <span className="text-[8px] md:text-[10px] font-tech font-black text-primary/40 italic">USD</span>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end shrink-0">
                  <span className="font-tech text-[7px] md:text-[8px] text-muted-foreground/40 uppercase">REF_UNIT</span>
                  <p className="font-tech text-[9px] md:text-[10px] text-foreground font-black italic">{safePrix}$</p>
                </div>
              </div>
            </div>

            {/* BOUTON DE VALIDATION */}
            <div className="pt-1">
              <Button 
                onClick={handleOrder}
                disabled={loading || isInvalid}
                className="w-full h-12 md:h-14 bg-primary text-primary-foreground font-display font-black uppercase italic text-[9px] md:text-[11px] tracking-[0.15em] md:tracking-[0.2em] rounded-xl shadow-xl hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-30 overflow-hidden"
              >
                {loading ? <Loader2 className="animate-spin w-4 h-4" /> : (
                  <div className="flex items-center justify-center gap-2 md:gap-3">
                    <CheckCircle2 size={14} className="md:w-[16px]" />
                    <span className="truncate">CONFIRMER_ORDRE</span>
                  </div>
                )}
              </Button>
              
              {isInvalid && qty > 0 && (
                <p className="mt-2 text-[7px] md:text-[8px] font-tech font-black text-red-500 uppercase tracking-widest text-center animate-pulse italic">
                  !! ERREUR: STOCK_HORS_LIMITE !!
                </p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}