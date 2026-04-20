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
    <div className="bg-secondary border-2 border-border rounded-[1.8rem] p-5 space-y-5 relative overflow-hidden shadow-2xl">
      
      {/* HEADER SÉQUESTRE COMPACT */}
      <div className="flex items-center justify-between border-b-2 border-border pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
            <ShieldCheck size={18} className="text-primary" />
          </div>
          <div>
            <h3 className="font-tech text-[9px] font-black uppercase tracking-[0.2em] text-foreground leading-none">SÉQUESTRE_ACTIF</h3>
            <p className="font-tech text-[7px] text-muted-foreground uppercase mt-1 italic tracking-tighter">Flux_Sécurisé_Pied_Zyne</p>
          </div>
        </div>
        <div className="text-right">
          <span className="font-tech text-[8px] text-primary/60 block uppercase font-black tracking-widest mb-1 italic">TOTAL_FACTURE</span>
          <span className="text-2xl font-display font-black text-foreground italic leading-none">
            {amount} <small className="text-[10px] text-muted-foreground/30 font-tech not-italic">USD</small>
          </span>
        </div>
      </div>

      {/* GRILLE DES OPÉRATEURS (Style Node) */}
      <div className="space-y-2.5">
        <label className="font-tech text-[8px] font-black text-muted-foreground/40 uppercase tracking-[0.3em] ml-1 italic">_Choisir_Passerelle</label>
        <div className="grid grid-cols-3 gap-2">
          {providers.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onSelect(p.id)}
              className={cn(
                "relative flex flex-col items-center justify-center h-16 rounded-xl border-2 transition-all duration-300 gap-1",
                selectedId === p.id 
                  ? "bg-primary/5 border-primary shadow-lg shadow-primary/5" 
                  : "bg-background border-border hover:border-primary/30"
              )}
            >
              <img src={p.icon} alt={p.name} className="w-6 h-6 object-contain grayscale-[0.5] group-hover:grayscale-0" />
              <span className={cn(
                "font-tech text-[7px] font-black uppercase tracking-tighter",
                selectedId === p.id ? "text-primary" : "text-muted-foreground/40"
              )}>
                {p.name}
              </span>
              {selectedId === p.id && (
                <div className="absolute top-1.5 right-1.5 w-1 h-1 bg-primary rounded-full animate-pulse" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* INPUT TÉLÉPHONE (Look Terminal) */}
      <div className="space-y-2.5">
        <div className="flex justify-between items-center px-1">
          <label className="font-tech text-[8px] font-black text-muted-foreground/50 uppercase tracking-widest italic">NUMÉRO_DÉBITEUR</label>
          {isValidPhone && <CheckCircle2 size={12} className="text-primary animate-in zoom-in" />}
        </div>
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 pr-3 border-r border-border">
            <Smartphone size={14} className={cn(
              "transition-colors",
              isValidPhone ? 'text-primary' : 'text-muted-foreground/20'
            )} />
          </div>
          <input 
            type="tel"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value.replace(/\D/g, '').slice(0, 10))}
            placeholder="08XXXXXXXX"
            className="w-full h-12 pl-12 pr-4 bg-background border-2 border-border rounded-xl font-tech text-sm italic text-foreground focus:border-primary transition-all outline-none shadow-inner tracking-[0.1em]"
          />
        </div>
      </div>

      {/* FOOTER STATUT (Optionnel) */}
      <div className="flex items-center gap-2 pt-2 opacity-30">
        <Zap size={10} className="text-primary" />
        <span className="font-tech text-[7px] font-black uppercase tracking-[0.4em]">Ready_For_Transaction_Node</span>
      </div>

      {/* DÉCOR SUBTILE */}
      <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-primary/5 blur-[40px] rounded-full pointer-events-none" />
    </div>
  );
}