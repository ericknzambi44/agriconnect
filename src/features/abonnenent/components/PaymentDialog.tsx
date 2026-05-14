import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldCheck, Smartphone, CheckCircle2, ArrowRight, Zap } from "lucide-react";
import { Plan } from "../types";
import { cn } from "@/lib/utils";

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

  useEffect(() => { if (open) setPhone(""); }, [open]);

  const isValidPhone = phone.length === 10 && (phone.startsWith("08") || phone.startsWith("09"));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gradient-to-br from-[#0a0a0a] via-[#050505] to-black border-2 border-white/10 sm:max-w-[400px] w-[92vw] rounded-[2rem] p-0 overflow-hidden outline-none shadow-2xl shadow-primary/10">
        
        {/* HEADER AVEC DÉGRADÉ */}
        <div className="bg-gradient-to-r from-primary/10 to-transparent p-5 border-b border-white/10 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 rounded-full blur-sm" />
              <ShieldCheck size={18} className="text-primary relative" />
            </div>
            <span className="font-tech text-[9px] font-black uppercase tracking-wider text-white/80">SEQUESTRE V1</span>
          </div>
          <span className="text-2xl font-display font-black bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent italic">
            {plan?.prix}$
          </span>
        </div>

        <div className="p-6 space-y-5">
          {/* PASSERELLES AVEC DÉGRADÉ AU SURVOL */}
          <RadioGroup defaultValue="mpesa" onValueChange={setOperator} className="grid grid-cols-3 gap-3">
            {OPERATORS.map((op) => (
              <Label key={op.id} className={cn(
                "flex flex-col items-center justify-center h-16 rounded-xl border-2 transition-all duration-300 cursor-pointer gap-1.5",
                operator === op.id 
                  ? "border-primary bg-gradient-to-br from-primary/20 to-transparent shadow-md shadow-primary/20" 
                  : "border-white/10 bg-white/[0.02] hover:border-primary/50 hover:bg-primary/5"
              )}>
                <RadioGroupItem value={op.id} className="sr-only" />
                <img src={op.icon} alt={op.name} className="w-6 h-6 object-contain filter brightness-0 invert opacity-80" />
                <span className="font-tech text-[7px] font-black uppercase tracking-wider text-white/60">{op.name}</span>
              </Label>
            ))}
          </RadioGroup>

          {/* INPUT TÉLÉPHONE */}
          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <span className="font-tech text-[8px] font-black text-primary/80 uppercase tracking-wider italic">NUMERO MOBILE</span>
              {isValidPhone && <CheckCircle2 size={12} className="text-emerald-500 drop-shadow-[0_0_4px_rgba(16,185,129,0.8)]" />}
            </div>
            <div className="relative group">
              <Smartphone size={14} className={cn(
                "absolute left-3.5 top-1/2 -translate-y-1/2 transition-all duration-300",
                isValidPhone ? "text-primary" : "text-white/20 group-focus-within:text-primary/60"
              )} />
              <Input 
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="08XXXXXXXX" 
                className="h-12 pl-10 bg-black/40 border-2 border-white/10 rounded-xl font-tech text-sm text-white placeholder:text-white/20 focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
              />
            </div>
            <p className="text-[8px] text-white/30 font-tech pl-1">Format: 08 ou 09 suivi de 8 chiffres</p>
          </div>

          {/* BOUTON D'ACTION AVEC DÉGRADÉ */}
          <Button 
            onClick={() => onConfirm(phone, operator)} 
            disabled={loading || !isValidPhone}
            className={cn(
              "h-12 w-full font-display font-black uppercase italic text-[11px] tracking-wider rounded-xl transition-all duration-300 active:scale-95",
              isValidPhone 
                ? "bg-gradient-to-r from-primary to-orange-400 text-black shadow-lg shadow-primary/30 hover:shadow-xl hover:scale-[1.01]" 
                : "bg-white/10 text-white/20 border border-white/5 cursor-not-allowed"
            )}
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5 text-black" /> : (
              <span className="flex items-center gap-2">CONFIRMER PAIEMENT <ArrowRight size={14} /></span>
            )}
          </Button>
        </div>

        {/* PETIT DÉTAIL DE SÉCURITÉ EN BAS */}
        <div className="px-6 pb-5 flex justify-center">
          <div className="flex items-center gap-1.5 opacity-40">
            <Zap size={8} className="text-primary" />
            <span className="font-tech text-[6px] text-white/50 uppercase tracking-wider">Transaction sécurisée</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}