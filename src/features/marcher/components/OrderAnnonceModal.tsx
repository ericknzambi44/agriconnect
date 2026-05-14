// components/marketplace/OrderAnnonceModal.tsx
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingCart, ArrowRight, Phone, Sprout, MapPin, Shield } from "lucide-react";
import { MarketAnnonce } from '../hooks/useMarketplace';
import { cn } from "@/lib/utils";
import { PaymentContainer } from './PaymentContainer';
import { ShippingForm } from './ShippingForm';

interface OrderAnnonceModalProps {
  annonce: MarketAnnonce;
  onOrder: (annonce: MarketAnnonce, quantite: number, deliveryDetails: any) => Promise<boolean>;
  loading: boolean;
  trigger?: React.ReactNode;
}

export function OrderAnnonceModal({ annonce, onOrder, loading, trigger }: OrderAnnonceModalProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [qty, setQty] = useState<number>(1);
  const [delivery, setDelivery] = useState({ ville: '', details: '' });

  const available = annonce.quantite_restante || 0;
  const isInvalid = qty <= 0 || qty > available;
  const total = qty * (annonce?.produit?.prix_prod || 0);

  const resetModal = () => {
    setStep(1);
    setOpen(false);
  };

  const displayPrice = annonce.prix_total || (annonce.quantite_vendre * annonce.produit?.prix_prod);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="w-full bg-gradient-to-r from-primary to-orange-400 hover:from-primary/80 hover:to-orange-500 text-black font-black uppercase italic rounded-xl h-12 transition-all shadow-lg shadow-primary/20">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Acheter
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="bg-gradient-to-br from-[#0a0a0a] to-black border-2 border-white/10 max-w-[500px] rounded-[32px] p-0 overflow-hidden outline-none shadow-2xl">
        {/* Header progressif avec dégradé */}
        <div className="p-5 sm:p-6 border-b border-white/5 bg-gradient-to-r from-primary/15 to-transparent">
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-1">
              {[1, 2, 3].map((s) => (
                <div key={s} className={cn("h-1.5 w-8 rounded-full transition-all duration-300", step >= s ? "bg-gradient-to-r from-primary to-orange-400" : "bg-white/10")} />
              ))}
            </div>
            <span className="text-[10px] font-black text-primary uppercase italic">Étape {step}/3</span>
          </div>
          <DialogTitle className="text-xl sm:text-2xl font-black uppercase italic text-white">
            {step === 1 && "Choisir quantité"}
            {step === 2 && "Livraison"}
            {step === 3 && "Paiement sécurisé"}
          </DialogTitle>
        </div>

        <div className="p-5 sm:p-6">
          {/* Étape 1 */}
          {step === 1 && (
            <div className="space-y-5 animate-in slide-in-from-right-4 duration-300">
              <div className="flex gap-4 p-3 bg-white/[0.03] border border-white/10 rounded-2xl">
                <img src={annonce.produit?.image} className="w-16 h-16 rounded-xl object-cover border border-white/10" alt="" />
                <div className="flex-1">
                  <p className="text-white font-black uppercase italic text-sm sm:text-base">{annonce.produit?.nom_prod}</p>
                  <p className="text-primary font-black text-xs sm:text-sm">{displayPrice?.toFixed(2)}$ / {annonce.produit?.unite}</p>
                  <div className="flex flex-wrap gap-3 mt-2 text-[10px] text-white/60">
                    <span className="flex items-center gap-1"><Phone size={10} /> {annonce.vendeur?.numero_tel}</span>
                    <span className="flex items-center gap-1"><Sprout size={10} /> {annonce.produit?.lieu_culture || "—"}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-primary">Quantité ({annonce.produit?.unite})</label>
                <div className="relative">
                  <Input type="number" value={qty} onChange={(e) => setQty(Number(e.target.value))} min={1} max={available}
                    className="h-14 bg-white/5 border-2 border-white/10 rounded-2xl text-xl font-black text-white focus:border-primary" />
                  <button onClick={() => setQty(available)} className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-primary/80 text-black rounded-lg text-[10px] font-black uppercase">MAX</button>
                </div>
                <p className="text-right text-[10px] text-white/40">Disponible: {available} {annonce.produit?.unite}</p>
              </div>

              <div className="p-4 bg-gradient-to-r from-primary/10 to-transparent border-l-4 border-primary rounded-2xl flex justify-between items-center">
                <span className="text-primary font-black uppercase text-sm">Total</span>
                <span className="text-2xl font-black text-white italic">{total.toFixed(2)} USD</span>
              </div>

              <Button onClick={() => setStep(2)} disabled={isInvalid} className="w-full h-12 bg-white text-black font-black uppercase italic rounded-xl shadow-md">
                Continuer <ArrowRight size={18} className="ml-2" />
              </Button>
            </div>
          )}

          {/* Étape 2 */}
          {step === 2 && (
            <div className="animate-in slide-in-from-right-4 duration-300">
              <ShippingForm
                value={delivery}
                onChange={setDelivery}
                vendeurAdresse={annonce.vendeur?.adresse}
              />
              <div className="flex gap-3 mt-6">
                <Button onClick={() => setStep(1)} variant="outline" className="flex-1 h-12 border-white/10 text-white">Retour</Button>
                <Button onClick={() => setStep(3)} disabled={!delivery.ville || !delivery.details} className="flex-1 h-12 bg-gradient-to-r from-primary to-orange-400 text-black">Finaliser</Button>
              </div>
            </div>
          )}

          {/* Étape 3 */}
          {step === 3 && (
            <div className="animate-in zoom-in-95 duration-300">
              <PaymentContainer
                amount={total}
                onCancel={() => setStep(2)}
                onConfirm={async (provider, phone) => {
                  const success = await onOrder(annonce, qty, { ...delivery, paymentProvider: provider, paymentPhone: phone });
                  if (success) resetModal();
                }}
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}