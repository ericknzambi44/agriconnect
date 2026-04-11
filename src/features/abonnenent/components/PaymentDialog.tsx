// src/features/abonnement/components/PaymentDialog.tsx
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldCheck, Smartphone } from "lucide-react";
import { Plan } from "../types";

const OPERATORS = [
  { id: 'mpesa', name: 'M-PESA', icon: '/src/assets/icons/mpesa.png' },
  { id: 'airtel', name: 'AIRTEL', icon: '/src/assets/icons/airtel.png' },
  { id: 'orange', name: 'ORANGE', icon: '/src/assets/icons/orange.png' },
];

interface PaymentDialogProps {
  plan: Plan | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (phone: string, operator: string) => void;
  loading: boolean;
}

export function PaymentDialog({ plan, open, onOpenChange, onConfirm, loading }: PaymentDialogProps) {
  const [phone, setPhone] = useState("");
  const [operator, setOperator] = useState("mpesa");

  const handleSubmit = () => {
    // Validation basique côté client avant envoi au service
    if (phone.length >= 10 && !loading) {
      onConfirm(phone, operator);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#050505] border-white/5 sm:max-w-[425px] rounded-[2.5rem] overflow-hidden p-0 shadow-2xl shadow-emerald-500/10 outline-none">
        
        {/* BARRE DE SCAN / STATUT */}
        <div className="h-1.5 w-full bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50 animate-pulse" />

        <div className="p-8 space-y-8">
          <DialogHeader className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500/60">Agriconnect Secure Pay</span>
            </div>
            <DialogTitle className="text-3xl font-black uppercase italic leading-[0.9] tracking-tighter">
              VALIDATION <br />
              <span className="text-emerald-500 uppercase">TERMINAL</span>
            </DialogTitle>
            <DialogDescription className="text-[11px] uppercase font-bold tracking-widest text-white/40 flex justify-between items-center border-b border-white/5 pb-4 mt-4">
              <span className="italic">{plan?.nom}</span>
              <span className="text-white font-black text-sm italic">{plan?.prix}$</span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* SÉLECTION OPÉRATEUR */}
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Opérateur Réseau</Label>
              <RadioGroup 
                defaultValue="mpesa" 
                onValueChange={setOperator}
                className="grid grid-cols-3 gap-3"
              >
                {OPERATORS.map((op) => (
                  <Label 
                    key={op.id} 
                    className={`flex flex-col items-center justify-center rounded-2xl border transition-all duration-300 cursor-pointer aspect-square p-2
                      ${operator === op.id 
                        ? 'border-emerald-500 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.1)]' 
                        : 'border-white/5 bg-white/[0.02] hover:bg-white/5 hover:border-white/10'}`}
                  >
                    <RadioGroupItem value={op.id} className="sr-only" />
                    <img 
                      src={op.icon} 
                      alt={op.name} 
                      className={`w-10 h-10 object-contain mb-2 transition-all duration-500 ${operator === op.id ? 'grayscale-0 scale-110' : 'grayscale opacity-30'}`} 
                    />
                    <span className={`text-[9px] font-black tracking-tighter ${operator === op.id ? 'text-emerald-500' : 'text-white/20'}`}>
                      {op.name}
                    </span>
                  </Label>
                ))}
              </RadioGroup>
            </div>

            {/* INPUT NUMÉRO */}
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Ligne de Facturation</Label>
              <div className="relative group">
                <Smartphone className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${phone.length >= 10 ? 'text-emerald-500' : 'text-white/20'}`} />
                <Input 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} // On ne garde que les chiffres
                  placeholder="0810000000" 
                  className="h-16 pl-12 bg-white/[0.03] border-white/10 font-black text-xl italic tracking-tight rounded-2xl focus-visible:ring-emerald-500/50 focus-visible:border-emerald-500 transition-all placeholder:text-white/5"
                  maxLength={10}
                />
              </div>
            </div>
          </div>

          {/* ACTION FINALE */}
          <div className="pt-2">
            <Button 
              onClick={handleSubmit} 
              disabled={loading || phone.length < 10}
              className={`h-16 w-full font-black uppercase italic tracking-widest text-[11px] rounded-2xl transition-all duration-500
                ${loading || phone.length < 10
                  ? 'bg-white/5 text-white/20 border border-white/5 cursor-not-allowed' 
                  : 'bg-emerald-500 text-black hover:scale-[1.02] active:scale-95 shadow-[0_15px_30px_rgba(16,185,129,0.25)]'}`}
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="animate-pulse">Chiffrement en cours...</span>
                </div>
              ) : (
                "CONFIRMER LA TRANSACTION"
              )}
            </Button>
            <p className="text-center text-[8px] uppercase font-bold text-white/20 mt-6 tracking-[0.3em]">
              Protocol Secured by <span className="text-white/40">Pishopy Engine</span>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}