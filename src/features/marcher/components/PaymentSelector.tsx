import React from 'react';
import { cn } from "@/lib/utils";
import { ShieldCheck, Smartphone, Zap, CheckCircle2, Info } from "lucide-react";

interface PaymentProvider {
  id: 'mpesa' | 'airtel' | 'orange';
  name: string;
  color: string;
  icon: string;
}

const providers: PaymentProvider[] = [
  { id: 'mpesa', name: 'M-PESA', color: '#81c784', icon: '/src/assets/icons/mpesa.png' },
  { id: 'airtel', name: 'AIRTEL', color: '#e57373', icon: '/src/assets/icons/airtel.png' },
  { id: 'orange', name: 'ORANGE', color: '#ffb74d', icon: '/src/assets/icons/orange.png' },
];

interface PaymentSelectorProps {
  selectedId: 'mpesa' | 'airtel' | 'orange' | null;
  onSelect: (id: 'mpesa' | 'airtel' | 'orange') => void;
  phone: string;
  onPhoneChange: (val: string) => void;
  amount: number;
}

export function PaymentSelector({ selectedId, onSelect, phone, onPhoneChange, amount }: PaymentSelectorProps) {
  const isValidPhone = phone.length === 10 && (phone.startsWith("08") || phone.startsWith("09"));

  return (
    <div className="bg-secondary/40 border-2 border-white/10 rounded-[2rem] p-5 md:p-8 space-y-6 relative overflow-hidden shadow-2xl w-full">
      
      {/* HEADER DE TRANSACTION */}
      <div className="flex items-center justify-between border-b border-white/5 pb-5">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20 shrink-0">
            <ShieldCheck size={24} className="text-primary" />
          </div>
          <div>
            <h3 className="font-display font-black text-xs md:text-sm uppercase tracking-widest text-white leading-none">PAIEMENT_SÉCURISÉ</h3>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <p className="font-tech text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">GATEWAY_ACTIVE_RDC</p>
            </div>
          </div>
        </div>
        <div className="text-right">
          <span className="font-tech text-[9px] text-primary font-black block uppercase tracking-widest mb-1 italic opacity-70">À RÉGLER</span>
          <div className="flex items-baseline gap-1 justify-end">
            <span className="text-2xl md:text-3xl font-display font-black text-white italic leading-none">
              {amount.toLocaleString()}
            </span>
            <span className="text-xs font-tech font-black text-primary italic">USD</span>
          </div>
        </div>
      </div>

      {/* SÉLECTEUR D'OPÉRATEUR */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <Info size={12} className="text-primary" />
          <label className="font-tech text-[10px] font-black text-white uppercase tracking-[0.2em] italic">CHOISIR_VOTRE_OPÉRATEUR</label>
        </div>
        
        <div className="grid grid-cols-3 gap-3 md:gap-4">
          {providers.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onSelect(p.id)}
              className={cn(
                "relative flex flex-col items-center justify-center py-4 md:py-6 rounded-2xl border-2 transition-all duration-300 gap-3 active:scale-95 group",
                selectedId === p.id 
                  ? "bg-white/5 border-primary shadow-[0_0_20px_rgba(var(--primary),0.15)] scale-[1.02]" 
                  : "bg-black/20 border-white/5 hover:border-white/20"
              )}
            >
              {/* Icône de l'opérateur - Toujours visible mais colorée si sélectionnée */}
              <div className="w-8 h-8 md:w-10 md:h-10 relative">
                 <img 
                    src={p.icon} 
                    alt={p.name} 
                    className={cn(
                        "w-full h-full object-contain transition-all duration-500",
                        selectedId === p.id ? "grayscale-0 scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" : "grayscale opacity-30 group-hover:opacity-60"
                    )} 
                 />
              </div>
              <span className={cn(
                "font-display font-black text-[9px] md:text-[10px] uppercase tracking-widest transition-colors",
                selectedId === p.id ? "text-primary" : "text-muted-foreground"
              )}>
                {p.name}
              </span>
              
              {selectedId === p.id && (
                <div className="absolute -top-1.5 -right-1.5 bg-primary text-black p-1 rounded-full shadow-lg">
                  <CheckCircle2 size={12} />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* CHAMP DE TÉLÉPHONE */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <label className="font-tech text-[10px] font-black text-white uppercase tracking-widest italic">NUMÉRO_DE_TÉLÉPHONE</label>
          {isValidPhone && (
            <div className="flex items-center gap-2 text-emerald-400 animate-in slide-in-from-right-2">
                <span className="font-tech text-[8px] font-black tracking-widest">FORMAT_OK</span>
                <CheckCircle2 size={14} />
            </div>
          )}
        </div>
        <div className="relative group">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 pr-4 border-r border-white/10 flex items-center justify-center">
            <Smartphone size={20} className={cn(
              "transition-all duration-300",
              isValidPhone ? 'text-primary scale-110' : 'text-muted-foreground/30'
            )} />
          </div>
          <input 
            type="tel"
            inputMode="tel"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value.replace(/\D/g, '').slice(0, 10))}
            placeholder="08XXXXXXXX"
            className={cn(
                "w-full h-14 md:h-16 pl-20 pr-6 bg-black/40 border-2 rounded-2xl font-tech text-lg md:text-xl italic text-white transition-all outline-none tracking-[0.2em] placeholder:opacity-20",
                isValidPhone ? "border-primary bg-primary/5" : "border-white/5 focus:border-primary/50"
            )}
          />
        </div>
        <p className="px-2 font-tech text-[14px] text-destructive italic uppercase leading-relaxed">
          * Veuillez saisir le numéro lié à votre compte Mobile Money pour recevoir la demande de confirmation.
        </p>
      </div>

      {/* FOOTER & DÉCOR */}
      <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div className="flex items-center gap-3 opacity-50">
            <Zap size={14} className="text-primary animate-pulse" />
            <span className="font-tech text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] text-white">NODAL_ENCRYPTION_ACTIVE</span>
          </div>
          <div className="flex gap-1.5">
              {[1,2,3,4].map(i => (
                  <div key={i} className="w-1.5 h-1.5 bg-white/10 rounded-full" />
              ))}
          </div>
      </div>

      {/* GLOW DE FOND POUR LE LOOK TECH */}
      <div className="absolute -top-20 -left-20 w-48 h-48 bg-primary/5 blur-[80px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-primary/5 blur-[80px] rounded-full pointer-events-none" />
    </div>
  );
}