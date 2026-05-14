import React, { useMemo } from 'react';
import { cn } from "@/lib/utils";
import { ShieldCheck, Smartphone, Zap, CheckCircle2, Info, AlertTriangle } from "lucide-react";

interface PaymentProvider {
  id: 'mpesa' | 'airtel' | 'orange';
  name: string;
  color: string;
  prefixes: string[]; // Pour la validation intelligente
  icon: string;
}

const providers: PaymentProvider[] = [
  { id: 'mpesa', name: 'M-PESA', color: '#81c784', prefixes: ['081', '082', '083'], icon: '/src/assets/icons/mpesa.png' },
  { id: 'airtel', name: 'AIRTEL', color: '#e57373', prefixes: ['097', '098', '099'], icon: '/src/assets/icons/airtel.png' },
  { id: 'orange', name: 'ORANGE', color: '#ffb74d', prefixes: ['084', '085', '089'], icon: '/src/assets/icons/orange.png' },
];

interface PaymentSelectorProps {
  selectedId: 'mpesa' | 'airtel' | 'orange' | null;
  onSelect: (id: 'mpesa' | 'airtel' | 'orange') => void;
  phone: string;
  onPhoneChange: (val: string) => void;
  amount: number;
}

export function PaymentSelector({ selectedId, onSelect, phone, onPhoneChange, amount }: PaymentSelectorProps) {
  
  // Validation intelligente basée sur l'opérateur
  const phoneValidation = useMemo(() => {
    if (!selectedId || phone.length < 3) return { isValid: false, msg: "Saisir numéro" };
    
    const currentProvider = providers.find(p => p.id === selectedId);
    const prefix = phone.substring(0, 3);
    const isGoodPrefix = currentProvider?.prefixes.includes(prefix);
    const isGoodLength = phone.length === 10;

    if (!isGoodPrefix) return { isValid: false, msg: "Préfixe invalide" };
    if (!isGoodLength) return { isValid: false, msg: "10 chiffres requis" };
    
    return { isValid: true, msg: "Format valide" };
  }, [phone, selectedId]);

  return (
    <div className="relative w-full overflow-hidden border-2 bg-zinc-950/50 border-white/5 rounded-[2.5rem] p-6 md:p-8 shadow-2xl backdrop-blur-xl">
      
      {/* SCANNER LINE ANIMATION */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-scan" />

      {/* HEADER : MONTANT & STATUT */}
      <div className="flex flex-col gap-6 mb-8 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <h3 className="font-display font-black text-[10px] tracking-[0.3em] text-primary uppercase italic">
              Checkout Terminal
            </h3>
          </div>
          <p className="text-3xl font-black italic text-white md:text-5xl font-display">
            {amount.toLocaleString()} <span className="text-sm not-italic font-tech text-primary/50">USD</span>
          </p>
        </div>

        <div className="px-4 py-2 border rounded-xl bg-white/5 border-white/10 backdrop-blur-md">
            <div className="flex items-center gap-3">
                <ShieldCheck size={18} className="text-emerald-500" />
                <span className="font-tech text-[9px] font-bold text-emerald-500/80 uppercase tracking-widest">Encrypted_E2E</span>
            </div>
        </div>
      </div>

      {/* SECTION 1 : OPÉRATEURS */}
      <div className="mb-8 space-y-4">
        <div className="flex items-center gap-2 opacity-40">
           <div className="w-8 h-px bg-white/20" />
           <span className="font-tech text-[9px] font-black uppercase tracking-widest text-white italic">Select_Provider</span>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {providers.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onSelect(p.id)}
              className={cn(
                "group relative overflow-hidden flex flex-col items-center justify-center py-6 rounded-3xl border-2 transition-all duration-500",
                selectedId === p.id 
                  ? "bg-primary/10 border-primary shadow-[0_0_30px_rgba(var(--primary),0.2)]" 
                  : "bg-white/[0.02] border-white/5 hover:border-white/20"
              )}
            >
              <div className={cn(
                "w-10 h-10 mb-2 transition-all duration-500",
                selectedId === p.id ? "scale-110 rotate-3 grayscale-0" : "grayscale opacity-20 group-hover:opacity-40"
              )}>
                <img src={p.icon} alt={p.name} className="object-contain w-full h-full" />
              </div>
              <span className={cn(
                "font-display font-black text-[10px] uppercase tracking-tighter transition-colors",
                selectedId === p.id ? "text-white" : "text-white/20"
              )}>
                {p.name}
              </span>
              
              {/* Indicateur actif discret */}
              {selectedId === p.id && (
                <div className="absolute top-2 right-2">
                   <div className="relative flex w-2 h-2">
                      <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-primary"></span>
                      <span className="relative inline-flex w-2 h-2 rounded-full bg-primary"></span>
                   </div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 2 : INPUT SMARTPHONE */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
            <span className="font-tech text-[9px] font-black text-white/40 uppercase tracking-widest italic ml-1">Phone_Endpoint</span>
            <div className={cn(
                "flex items-center gap-2 px-3 py-1 rounded-full border transition-all duration-300",
                phoneValidation.isValid ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-white/5 border-white/10 text-white/30"
            )}>
                <span className="font-tech text-[8px] font-black uppercase tracking-tighter">{phoneValidation.msg}</span>
                {phoneValidation.isValid ? <CheckCircle2 size={10} /> : <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />}
            </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-transparent blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
          <div className="relative flex items-center group">
            <div className="absolute left-6 text-white/20 group-focus-within:text-primary transition-colors">
                <Smartphone size={22} />
            </div>
            <input 
              type="tel"
              value={phone}
              onChange={(e) => onPhoneChange(e.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder="08XXXXXXXX"
              className={cn(
                  "w-full h-20 pl-16 pr-6 bg-black/60 border-2 rounded-[1.5rem] font-tech text-2xl italic text-white transition-all outline-none tracking-[0.2em] placeholder:opacity-10",
                  phoneValidation.isValid ? "border-primary" : "border-white/5 focus:border-white/20"
              )}
            />
          </div>
        </div>
      </div>

      {/* ALERT BOX STYLISÉE */}
      <div className="flex gap-4 p-5 mt-6 border bg-white/5 border-white/5 rounded-2xl">
          <Info size={20} className="shrink-0 text-primary" />
          <p className="font-tech text-[11px] text-white/50 leading-relaxed uppercase italic">
            Une demande de confirmation USSD sera envoyée sur ce numéro. Assurez-vous d'avoir le solde nécessaire incluant les frais.
          </p>
      </div>

      {/* DECORATIVE NODES */}
      <div className="flex items-center justify-between mt-8 opacity-20">
          <div className="flex gap-1">
             {[1,2,3].map(i => <div key={i} className="w-4 h-1 rounded-full bg-primary" />)}
          </div>
          <span className="font-tech text-[8px] font-black tracking-[0.5em] text-white">Agriconnect SECURE</span>
      </div>
    </div>
  );
}