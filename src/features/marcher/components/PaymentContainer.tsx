// components/marketplace/PaymentContainer.tsx
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreditCard, Smartphone, Loader2, ShieldCheck, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaymentContainerProps {
  amount: number;
  onConfirm: (provider: string, phone: string) => Promise<void>;
  onCancel: () => void;
}

export function PaymentContainer({ amount, onConfirm, onCancel }: PaymentContainerProps) {
  const [provider, setProvider] = useState<'orange' | 'vodacom' | 'africell'>('orange');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!phone || phone.length < 9) return;
    setLoading(true);
    try {
      await onConfirm(provider, phone);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-primary/20 border border-primary/30 backdrop-blur-sm mb-2">
          <Lock className="w-3 h-3 text-primary" />
          <span className="text-[9px] font-black text-primary uppercase">Paiement sécurisé</span>
        </div>
        <p className="text-3xl sm:text-4xl font-black text-white italic">
          {amount.toFixed(2)} <span className="text-base">USD</span>
        </p>
      </div>

      {/* Opérateurs */}
      <div className="flex gap-2 justify-center flex-wrap">
        {[
          { id: 'orange', name: 'Orange Money', color: 'orange' },
          { id: 'vodacom', name: 'M-Pesa', color: 'red' },
          { id: 'africell', name: 'Africell', color: 'green' }
        ].map((op) => (
          <button
            key={op.id}
            onClick={() => setProvider(op.id as any)}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-black uppercase italic transition-all duration-300",
              provider === op.id
                ? "bg-gradient-to-r from-primary to-orange-400 text-black shadow-lg scale-105"
                : "bg-white/5 text-white/50 hover:bg-white/10"
            )}
          >
            {op.name}
          </button>
        ))}
      </div>

      {/* Numéro téléphone */}
      <div>
        <Input
          type="tel"
          placeholder="Numéro Mobile Money (ex: 0991234567)"
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
          className="h-12 bg-white/5 border-white/10 rounded-xl text-white font-mono text-center text-lg focus:border-primary transition-all"
        />
      </div>

      {/* Boutons */}
      <div className="flex gap-3 pt-2">
        <Button
          onClick={onCancel}
          variant="outline"
          className="flex-1 h-12 border-white/10 text-white/70 font-black uppercase italic rounded-xl hover:bg-white/5"
        >
          Retour
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={loading || !phone || phone.length < 9}
          className="flex-1 h-12 bg-gradient-to-r from-primary to-orange-400 text-black font-black uppercase italic rounded-xl shadow-lg shadow-primary/30 transition-all active:scale-95"
        >
          {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Payer"}
        </Button>
      </div>

      <p className="text-[9px] text-white/30 text-center">
        Simulation de paiement – argent sécurisé sous séquestre
      </p>
    </div>
  );
}