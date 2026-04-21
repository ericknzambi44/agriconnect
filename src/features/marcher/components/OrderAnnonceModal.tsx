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
        {/* BOUTON D'APPEL : Intelligent & Compact */}
        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-display font-black uppercase italic rounded-xl h-10 px-3 group transition-all active:scale-95 shadow-lg shadow-primary/10 overflow-hidden shrink-0">
          <span className="text-[10px] tracking-widest truncate">
            {/* Breakpoint personnalisé pour les écrans ultra-étroits */}
            <span className="min-[400px]:hidden">Acheter</span>
            <span className="hidden min-[400px]:inline">Commander</span>
          </span>
          <ArrowRight className="w-3.5 h-3.5 ml-2 group-hover:translate-x-1 transition-transform shrink-0" />
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-secondary border-2 border-border max-w-[380px] w-[95vw] rounded-[1.5rem] md:rounded-[2rem] shadow-2xl p-0 overflow-hidden outline-none animate-in fade-in zoom-in-95 focus:ring-0 select-none">
        
        <div className="relative p-5 md:p-7">
          {/* Filigrane Tech - Disparaît sur petit écran pour la lisibilité */}
          <div className="absolute -top-4 -right-4 opacity-[0.03] pointer-events-none rotate-12 hidden xs:block">
            <Target size={120} className="text-primary" />
          </div>

          <DialogHeader className="relative z-10 mb-5 text-left">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="font-tech text-[8px] font-black text-muted-foreground uppercase tracking-[0.25em]">
                SYS_ORDER_V1
              </span>
            </div>
            <DialogTitle className="text-[clamp(1.5rem,6vw,2rem)] font-display font-black uppercase italic tracking-tighter leading-tight text-foreground">
              ORDRE_<span className="text-primary text-glow">FLUX</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 md:space-y-6 relative z-10">
            {/* RÉCAPITULATIF PRODUIT - Plus compact sur mobile */}
            <div className="flex items-center gap-3 p-2.5 bg-background border border-border/50 rounded-xl">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg overflow-hidden border border-border bg-secondary shrink-0 shadow-inner">
                {annonce.produit?.image ? (
                  <img src={annonce.produit.image} className="w-full h-full object-cover" alt="thumb" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary/5">
                    <Package size={16} className="text-primary/20" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-display text-[11px] md:text-xs font-black text-foreground uppercase truncate italic tracking-wide">
                  {annonce.produit?.nom_prod}
                </h4>
                <p className="font-tech text-[8px] text-primary font-black uppercase mt-1 tracking-widest italic leading-none truncate opacity-80">
                  STK_DISPO: {available} {annonce.produit?.unite}
                </p>
              </div>
            </div>

            {/* INPUT QUANTITÉ - Ergonomie Mobile tactile */}
            <div className="space-y-2">
              <label className="font-tech text-[8px] font-black uppercase text-muted-foreground/40 tracking-[0.2em] ml-1 flex justify-between">
                <span>_VOLUME_REQUIS</span>
                {isInvalid && <span className="text-red-500 animate-pulse">! ERREUR_CAP !</span>}
              </label>
              <div className="relative group">
                <Input 
                  type="number" 
                  inputMode="decimal"
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  className={cn(
                    "h-12 bg-background border-2 border-border rounded-xl pl-4 pr-24 font-tech text-base italic text-foreground focus-visible:ring-1 focus-visible:ring-primary transition-all outline-none",
                    isInvalid && "border-red-500/30 bg-red-500/5 text-red-500"
                  )}
                />
                <button 
                  type="button"
                  onClick={() => setQty(available)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground rounded-lg text-[8px] font-black uppercase transition-all italic active:scale-90"
                >
                  MAX_CAP
                </button>
              </div>
            </div>

            {/* TOTAL - Typographie adaptative pour éviter le dépassement */}
            <div className="p-4 bg-primary/5 border border-primary/10 rounded-xl relative overflow-hidden group">
               <div className="absolute -top-1 -right-1 p-2 opacity-5 group-hover:opacity-20 transition-opacity">
                  <Zap size={32} className="text-primary" />
               </div>
              <div className="flex justify-between items-center gap-3">
                <div className="flex flex-col min-w-0">
                  <span className="font-tech text-[8px] text-muted-foreground/60 uppercase tracking-widest leading-none truncate">Valeur_Totale</span>
                  <div className="flex items-baseline gap-1 mt-1.5">
                    <span className="text-[clamp(1.5rem,7vw,2.25rem)] font-display font-black italic text-primary tracking-tighter leading-none truncate">
                      {total}
                    </span>
                    <span className="text-[9px] font-tech font-black text-primary/40 italic">USD</span>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end shrink-0 pl-2 border-l border-primary/10">
                  <span className="font-tech text-[7px] text-muted-foreground/30 uppercase">U_PRICE</span>
                  <p className="font-tech text-[11px] text-foreground font-black italic">{safePrix}$</p>
                </div>
              </div>
            </div>

            {/* ACTION FINALE */}
            <div className="pt-2">
              <Button 
                onClick={handleOrder}
                disabled={loading || isInvalid}
                className="w-full h-14 bg-primary text-primary-foreground font-display font-black uppercase italic text-[11px] tracking-[0.2em] rounded-xl shadow-[0_10px_20px_rgba(var(--primary),0.2)] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-20 disabled:grayscale overflow-hidden"
              >
                {loading ? (
                  <Loader2 className="animate-spin w-5 h-5" />
                ) : (
                  <div className="flex items-center justify-center gap-3">
                    <CheckCircle2 size={16} className="shrink-0" />
                    <span className="truncate">CONFIRMER_ORDRE</span>
                  </div>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}