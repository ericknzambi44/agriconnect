// src/features/marcher/components/PaymentSelector.tsx
import React from 'react';
import { cn } from "@/lib/utils";
import { ShieldCheck, Smartphone, Zap } from "lucide-react";

interface PaymentProvider {
  id: 'mpesa' | 'airtel' | 'orange';
  name: string;
  icon: string;
  color: string;
}

const providers: PaymentProvider[] = [
  { id: 'mpesa', name: 'M-PESA', icon: '/src/assets/icons/mpesa.png', color: 'border-[#E61C24]' },
  { id: 'airtel', name: 'AIRTEL MONEY', icon: '/src/assets/icons/airtel.png', color: 'border-[#FF0000]' },
  { id: 'orange', name: 'ORANGE MONEY', icon: '/src/assets/icons/orange.png', color: 'border-[#FF6600]' },
];

interface PaymentSelectorProps {
  selectedId: string | null;
  onSelect: (id: 'mpesa' | 'airtel' | 'orange') => void;
  amount: number;
}

export function PaymentSelector({ selectedId, onSelect, amount }: PaymentSelectorProps) {
  return (
    <div className="bg-[#050505] border border-white/5 rounded-2xl p-4 md:p-6 space-y-6">
      {/* Header du Séquestre */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 rounded-lg">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Séquestre_Actif</h3>
            <p className="text-[8px] font-tech text-white/40 uppercase tracking-tighter">Fonds sécurisés par le système</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[8px] font-tech text-emerald-500/50 block uppercase">Total_A_Payer</span>
          <span className="text-xl font-display font-black text-white italic">{amount} <small className="text-[10px] opacity-50">USD</small></span>
        </div>
      </div>

      {/* Liste des Opérateurs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {providers.map((p) => (
          <button
            key={p.id}
            onClick={() => onSelect(p.id)}
            className={cn(
              "relative flex items-center gap-4 p-4 rounded-xl border transition-all duration-300",
              selectedId === p.id 
                ? "bg-white/5 border-emerald-500/50 ring-1 ring-emerald-500/20" 
                : "bg-[#0A0A0A] border-white/5 hover:border-white/10"
            )}
          >
            <div className="w-10 h-10 shrink-0 bg-white/5 rounded-lg flex items-center justify-center p-1">
              <img src={p.icon} alt={p.name} className="w-full h-full object-contain" />
            </div>
            
            <div className="flex flex-col items-start">
              <span className="text-[10px] font-black uppercase italic text-white tracking-widest">{p.name}</span>
              <span className="text-[7px] font-tech text-white/30 uppercase">Mobile paiement</span>
            </div>

            {selectedId === p.id && (
              <div className="absolute top-2 right-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Input Téléphone avec style Tech */}
      <div className="space-y-2">
        <label className="text-[8px] font-tech text-white/30 uppercase ml-2 tracking-[0.2em]">Entrer_Numéro_De_Compte</label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Smartphone className="w-4 h-4 text-white/20 group-focus-within:text-emerald-500 transition-colors" />
          </div>
          <input 
            type="tel"
            placeholder="000 000 000"
            className="w-full bg-[#0A0A0A] border border-white/5 rounded-xl py-4 pl-12 pr-4 text-white font-tech text-sm focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-white/10"
          />
        </div>
      </div>
    </div>
  );
}