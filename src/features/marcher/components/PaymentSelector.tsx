import React from 'react';
import { cn } from "@/lib/utils";
import { ShieldCheck, Smartphone, Zap, CheckCircle2 } from "lucide-react";

interface PaymentProvider {
  id: 'mpesa' | 'airtel' | 'orange';
  name: string;
  icon: string;
}

const providers: PaymentProvider[] = [
  { id: 'mpesa', name: 'M-PESA', icon: '/src/assets/icons/mpesa.png' },
  { id: 'airtel', name: 'AIRTEL', icon: '/src/assets/icons/airtel.png' },
  { id: 'orange', name: 'ORANGE', icon: '/src/assets/icons/orange.png' },
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
    <div className="bg-secondary border-2 border-border rounded-[1.5rem] md:rounded-[1.8rem] p-4 md:p-6 space-y-5 relative overflow-hidden shadow-2xl w-full max-w-full">
      
      {/* HEADER SÉQUESTRE : Réorganisation sur Mobile */}
      <div className="flex flex-row items-center justify-between border-b-2 border-border/50 pb-4 gap-2">
        <div className="flex items-center gap-2 md:gap-3 min-w-0">
          <div className="p-2 bg-primary/10 rounded-lg border border-primary/20 shrink-0">
            <ShieldCheck size={16} className="text-primary md:w-[18px] md:h-[18px]" />
          </div>
          <div className="min-w-0">
            <h3 className="font-tech text-[8px] md:text-[9px] font-black uppercase tracking-[0.15em] text-foreground leading-none truncate">SÉQUESTRE_ACTIF</h3>
            <p className="font-tech text-[6px] md:text-[7px] text-muted-foreground uppercase mt-1 italic tracking-tighter truncate opacity-60">Flux_Pied_Zyne</p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <span className="font-tech text-[7px] md:text-[8px] text-primary/60 block uppercase font-black tracking-widest mb-0.5 italic">TOTAL</span>
          <span className="text-xl md:text-2xl font-display font-black text-foreground italic leading-none whitespace-nowrap">
            {amount} <small className="text-[9px] md:text-[10px] text-muted-foreground/30 font-tech not-italic">USD</small>
          </span>
        </div>
      </div>

      {/* GRILLE DES OPÉRATEURS : Taille de boutons fluide */}
      <div className="space-y-3">
        <label className="font-tech text-[8px] font-black text-muted-foreground/40 uppercase tracking-[0.25em] ml-1 italic">_CHOISIR_PASSERELLE</label>
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {providers.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onSelect(p.id)}
              className={cn(
                "relative flex flex-col items-center justify-center h-14 md:h-16 rounded-xl border-2 transition-all duration-300 gap-1 active:scale-95",
                selectedId === p.id 
                  ? "bg-primary/5 border-primary shadow-lg shadow-primary/10" 
                  : "bg-background border-border hover:border-primary/30"
              )}
            >
              {/* Image d'icône adaptative */}
              <div className="w-5 h-5 md:w-6 md:h-6 relative">
                 <img 
                    src={p.icon} 
                    alt={p.name} 
                    className={cn(
                        "w-full h-full object-contain transition-all",
                        selectedId === p.id ? "grayscale-0 scale-110" : "grayscale opacity-40"
                    )} 
                 />
              </div>
              <span className={cn(
                "font-tech text-[6px] md:text-[7px] font-black uppercase tracking-tighter",
                selectedId === p.id ? "text-primary" : "text-muted-foreground/40"
              )}>
                {p.name}
              </span>
              {selectedId === p.id && (
                <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_8px_rgba(var(--primary),0.8)]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* INPUT TÉLÉPHONE : Focus tactile amélioré */}
      <div className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <label className="font-tech text-[8px] font-black text-muted-foreground/50 uppercase tracking-widest italic">NUMÉRO_DÉBITEUR</label>
          {isValidPhone && (
            <div className="flex items-center gap-1 text-primary animate-in fade-in zoom-in">
                <span className="font-tech text-[6px] font-black">VALID_NODE</span>
                <CheckCircle2 size={10} />
            </div>
          )}
        </div>
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 pr-3 border-r border-border/50">
            <Smartphone size={14} className={cn(
              "transition-colors duration-500",
              isValidPhone ? 'text-primary' : 'text-muted-foreground/20'
            )} />
          </div>
          <input 
            type="tel"
            inputMode="tel"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value.replace(/\D/g, '').slice(0, 10))}
            placeholder="08XXXXXXXX"
            className={cn(
                "w-full h-12 md:h-14 pl-14 pr-4 bg-background border-2 border-border rounded-xl font-tech text-base italic text-foreground transition-all outline-none shadow-inner tracking-[0.15em]",
                isValidPhone ? "border-primary/50 bg-primary/5" : "focus:border-primary"
            )}
          />
        </div>
      </div>

      {/* FOOTER & DÉCOR : Réduit sur mobile */}
      <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2 opacity-30">
            <Zap size={10} className="text-primary animate-pulse" />
            <span className="font-tech text-[6px] md:text-[7px] font-black uppercase tracking-[0.3em]">SECURE_HANDSHAKE</span>
          </div>
          <div className="flex gap-1">
              {[1,2,3].map(i => (
                  <div key={i} className="w-1 h-1 bg-border rounded-full" />
              ))}
          </div>
      </div>

      {/* GLOW DE FOND */}
      <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-primary/5 blur-[50px] rounded-full pointer-events-none" />
    </div>
  );
}