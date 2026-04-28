import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Package, ShoppingCart, Zap, CheckCircle2 } from "lucide-react";
import { MarketAnnonce } from '../hooks/useMarketplace';
import { cn } from "@/lib/utils";

interface Props {
  annonce: MarketAnnonce;
  onOrder: (annonce: MarketAnnonce, quantite: number) => Promise<boolean>;
  loading: boolean;
}

/**
 * MARKET_CARD_NANO : Version "Low-Profile"
 * Optimisée pour l'affichage en grille dense (3 lignes+)
 */
export function MarketAnnonceCard({ annonce, onOrder, loading }: Props) {
  return (
    <div className="group relative bg-secondary/20 border border-white/5 rounded-[14px] overflow-hidden transition-all hover:border-primary/40 hover:bg-secondary/40">
      
      {/* 1. MEDIA SECTION : Format Bandeau (Serré en hauteur) */}
      <div className="relative h-[75px] md:h-[85px] w-full overflow-hidden bg-muted/10">
        {annonce.produit?.image ? (
          <img 
            src={annonce.produit.image} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
            alt="img" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center opacity-10">
            <Package size={16} />
          </div>
        )}
        
        {/* Badge Tech ultra-petit */}
        <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-black/80 backdrop-blur-sm rounded-md border border-white/5">
          <p className="font-tech text-[5px] font-black text-primary uppercase tracking-[0.2em]">
            ID_{annonce.id?.toString().slice(-3)}
          </p>
        </div>
      </div>

      {/* 2. CONTENT SECTION : Très dense */}
      <div className="p-2 space-y-2">
        <div>
          <h4 className="font-display font-black italic uppercase text-[16px] text-foreground/90 truncate leading-tight">
            {annonce.produit?.nom_prod}
          </h4>
          
          <div className="flex items-center justify-between mt-1">
             <div className="flex items-baseline gap-0.5">
                <span className="text-[16px] font-tech font-bold tracking-tighter text-white italic">
                  {annonce.produit?.prix_prod}
                </span>
                <span className="text-[8px] font-tech font-bold text-primary opacity-80 uppercase">USD</span>
             </div>
             <p className="font-tech text-[12px] font-black text-emerald-500/90 uppercase border-l border-white/10 pl-1.5">
               STK: {annonce.quantite_restante}
             </p>
          </div>
        </div>

        {/* 3. BOUTON D'ACTION : Priorité Visibilité */}
        <OrderAnnonceModal annonce={annonce} onOrder={onOrder} loading={loading} />
      </div>
    </div>
  );
}

export function OrderAnnonceModal({ annonce, onOrder, loading }: Props) {
  const [open, setOpen] = useState(false);
  const [qty, setQty] = useState<number>(1);

  const available = annonce.quantite_restante || 0;
  const isInvalid = qty <= 0 || qty > available;

  useEffect(() => {
    if (open) setQty(available < 1 && available > 0 ? available : 1);
  }, [open, available]);

  const total = (qty * (annonce?.produit?.prix_prod || 0)).toFixed(2);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-display font-black uppercase italic rounded-lg h-7.5 transition-all active:scale-95 shadow-lg shadow-primary/10">
          <ShoppingCart className="w-3 h-3 mr-1.5" />
          <span className="text-[12px] font-bold tracking-widest">COMMANDER</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-[#050505] border border-white/10 max-w-[320px] rounded-[24px] p-0 overflow-hidden outline-none">
        <div className="relative p-5 bg-gradient-to-b from-primary/10 to-transparent">
          <DialogHeader className="mb-4">
            <div className="flex items-center gap-1.5 mb-1 opacity-50">
              <span className="w-1 h-1 rounded-full bg-primary animate-pulse" />
              <span className="font-tech text-[6px] font-black text-muted-foreground uppercase tracking-[0.3em]">Market.Sync_Active</span>
            </div>
            <DialogTitle className="text-xl font-display font-black uppercase italic tracking-tighter text-white">
              ÉMETTRE_<span className="text-primary">ORDRE</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Recap Nano */}
            <div className="flex items-center gap-3 p-2 bg-white/[0.03] border border-white/5 rounded-xl">
              <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/10 shrink-0">
                <img src={annonce.produit?.image} className="w-full h-full object-cover" alt="img" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display text-[12px] font-black text-white uppercase italic truncate">
                  {annonce.produit?.nom_prod}
                </p>
                <span className="font-tech text-[12px] text-primary font-black uppercase tracking-tighter">P_UNIT: {annonce.produit?.prix_prod}$</span>
              </div>
            </div>

            {/* Input Tactile */}
            <div className="space-y-1.5">
              <label className="font-tech text-[12.5px] font-black uppercase text-white text-muted-foreground/60 tracking-widest px-1 italic">Quantité_Engagement</label> <br />
              <div className="relative">
                <Input 
                  type="number" 
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  className={cn(
                    "h-10 bg-white/[0.02] border-white/10 rounded-xl px-4 font-tech text-sm italic text-white focus-visible:ring-primary transition-all",
                    isInvalid && "border-red-500/50 bg-red-500/5"
                  )}
                />
                <button 
                  onClick={() => setQty(available)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-0.5 bg-primary/20 hover:bg-primary text-primary hover:text-black rounded-md text-[6px] font-black uppercase transition-all"
                >
                  MAX
                </button>
              </div>
            </div>

            {/* Total Section */}
            <div className="p-3 bg-gradient-to-r from-primary/20 via-transparent to-transparent rounded-xl border border-primary/10">
              <p className="font-tech text-[8.5px] text-primary/60 font-black uppercase tracking-[0.2em] mb-1">Estimation_Valide</p>
              <div className="flex items-baseline gap-1 leading-none">
                <span className="text-3xl font-display font-black italic text-white tracking-tighter">
                  {total}
                </span>
                <span className="text-[9px] font-tech font-black text-primary italic">USD</span>
              </div>
            </div>

            <Button 
              onClick={async () => {
                if (isInvalid) return;
                const success = await onOrder(annonce, qty);
                if (success) setOpen(false);
              }}
              disabled={loading || isInvalid}
              className="w-full h-11 bg-primary text-primary-foreground font-display font-black uppercase italic text-[9px] tracking-[0.2em] rounded-xl hover:brightness-110 active:scale-95 shadow-lg shadow-primary/20"
            >
              {loading ? <Loader2 className="animate-spin w-4 h-4" /> : (
                <div className="flex text-[12px] items-center gap-2">
                  <CheckCircle2 size={14} />
                  <span className=" font-bold ">TRANSMETTRE_ORDRE</span>
                </div>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}