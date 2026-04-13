import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Package, ArrowRight, Zap, Target } from "lucide-react";
import { MarketAnnonce } from '../hooks/useMarketplace';
import { cn } from "@/lib/utils";

interface Props {
  annonce: MarketAnnonce;
  onOrder: (annonce: MarketAnnonce, quantite: number) => Promise<any>;
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
        {/* BOUTON ADAPTÉ POUR LA GRILLE : Fin et percutant */}
        <Button className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase italic rounded-xl h-10 text-[10px] tracking-widest group transition-all active:scale-95 shadow-[0_4px_15px_rgba(16,185,129,0.2)]">
          <span>POSTULER</span>
          <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-[#050505] border-white/5 text-white sm:max-w-[400px] w-[92vw] rounded-[1.5rem] shadow-2xl backdrop-blur-3xl p-0 overflow-hidden outline-none border border-emerald-500/10 animate-in zoom-in-95 duration-200">
        
        <div className="relative p-5 md:p-6">
          {/* Filigrane discret */}
          <div className="absolute top-0 right-0 p-4 opacity-[0.02] pointer-events-none">
            <Target className="w-32 h-32" />
          </div>

          <DialogHeader className="relative z-10 mb-6">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-[7px] font-black text-white/30 uppercase tracking-[0.3em]">
                Protocol_Order_Secure
              </span>
            </div>
            <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter leading-none">
              ORDRE_<span className="text-emerald-500">FLUX</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 relative z-10">
            {/* RÉCAP PRODUIT COMPACT */}
            <div className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/5 rounded-xl">
              <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/10 bg-black shrink-0">
                {annonce.produit?.image ? (
                  <img src={annonce.produit.image} className="w-full h-full object-cover opacity-80" alt="thumb" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><Package className="w-3 h-3 opacity-20" /></div>
                )}
              </div>
              <div className="flex-1 min-w-0 leading-none">
                <h4 className="text-[11px] font-black text-white uppercase truncate italic">{annonce.produit?.nom_prod}</h4>
                <p className="text-[7px] font-mono text-white/20 uppercase mt-1 tracking-wider">Ref_{annonce.id.slice(0,8)}</p>
              </div>
            </div>

            {/* INPUT STYLE TERMINAL */}
            <div className="space-y-2">
              <div className="flex justify-between items-end px-1">
                <label className="font-mono text-[8px] font-black uppercase text-white/40">Quantité_Requise</label>
                <span className="text-[8px] font-mono text-emerald-500/50">Stock: {available} {annonce.produit?.unite}</span>
              </div>
              <div className="relative">
                <Input 
                  type="number" 
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  className={cn(
                    "h-12 bg-black border-white/5 rounded-xl pl-4 pr-16 text-base font-black text-white focus:ring-emerald-500/10 transition-all",
                    isInvalid && "border-red-500/40 bg-red-500/5"
                  )}
                />
                <button 
                  onClick={() => setQty(available)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1.5 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-black rounded-lg text-[7px] font-black uppercase transition-all"
                >
                  MAX
                </button>
              </div>
            </div>

            {/* TOTAL SECTION */}
            <div className="p-4 bg-emerald-500/[0.03] border border-emerald-500/10 rounded-xl">
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="font-mono text-[7px] text-white/20 uppercase tracking-widest">Valeur_Totale</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black italic text-emerald-500 tracking-tighter">{total}</span>
                    <span className="text-[9px] font-black text-emerald-500/40 italic">USD</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono text-[7px] text-white/20 uppercase">Unit_Price</span>
                  <p className="font-mono text-[9px] text-white/40 font-bold">{safePrix}$/{annonce.produit?.unite}</p>
                </div>
              </div>
            </div>

            {/* ACTION FINALE */}
            <Button 
              onClick={handleOrder}
              disabled={loading || isInvalid}
              className="w-full h-14 bg-emerald-500 text-black font-black uppercase italic text-[10px] tracking-[0.2em] rounded-xl shadow-[0_10px_20px_rgba(16,185,129,0.1)] hover:bg-emerald-400 transition-all active:scale-[0.98] disabled:opacity-10"
            >
              {loading ? <Loader2 className="animate-spin w-4 h-4" /> : (
                <div className="flex items-center gap-2">
                  <Zap className="w-3 h-3 fill-black" />
                  <span>CONFIRMER_L_ORDRE</span>
                </div>
              )}
            </Button>

            {isInvalid && qty > 0 && (
              <p className="text-[7px] font-mono font-black text-red-500 uppercase tracking-widest text-center animate-pulse">
                !! Erreur de flux: Capacité dépassée !!
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}