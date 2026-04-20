import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldCheck, Smartphone, CheckCircle2, ArrowRight } from "lucide-react";
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
      <DialogContent className="bg-secondary border-2 border-border sm:max-w-[360px] w-[92vw] rounded-[1.5rem] p-0 overflow-hidden outline-none shadow-2xl">
        
        {/* HEADER MINI */}
        <div className="bg-background/40 p-4 border-b-2 border-border flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-primary" />
            <span className="font-tech text-[9px] font-black uppercase tracking-tighter text-foreground">SÉQUESTRE_V1</span>
          </div>
          <span className="text-xl font-display font-black text-primary italic">{plan?.prix}$</span>
        </div>

        <div className="p-5 space-y-4">
          {/* PASSERELLES COMPACTES */}
          <RadioGroup defaultValue="mpesa" onValueChange={setOperator} className="grid grid-cols-3 gap-2">
            {OPERATORS.map((op) => (
              <Label key={op.id} className={cn(
                "flex flex-col items-center justify-center h-14 rounded-xl border-2 transition-all cursor-pointer gap-1",
                operator === op.id ? 'border-primary bg-primary/5' : 'border-border bg-background'
              )}>
                <RadioGroupItem value={op.id} className="sr-only" />
                <img src={op.icon} alt={op.name} className="w-5 h-5 object-contain" />
                <span className="font-tech text-[7px] font-black uppercase tracking-widest text-muted-foreground">{op.name}</span>
              </Label>
            ))}
          </RadioGroup>

          {/* INPUT TÉLÉPHONE */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center px-1">
              <span className="font-tech text-[8px] font-black text-muted-foreground uppercase italic">NUMÉRO_MOBILE</span>
              {isValidPhone && <CheckCircle2 size={12} className="text-primary" />}
            </div>
            <div className="relative">
              <Smartphone size={14} className={cn("absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors", isValidPhone ? 'text-primary' : 'text-muted-foreground/20')} />
              <Input 
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="08XXXXXXXX" 
                className="h-11 pl-10 bg-background border-2 border-border font-tech text-sm italic rounded-xl focus-visible:border-primary outline-none"
              />
            </div>
          </div>

          {/* BOUTON D'ACTION VISIBLE */}
          <Button 
            onClick={() => onConfirm(phone, operator)} 
            disabled={loading || !isValidPhone}
            className={cn(
              "h-12 w-full font-display font-black uppercase italic text-[11px] tracking-widest rounded-xl transition-all",
              isValidPhone ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'bg-border text-muted-foreground/20'
            )}
          >
            {loading ? <Loader2 className="animate-spin" /> : (
              <span className="flex items-center gap-2">CONFIRMER_PAYEMENT <ArrowRight size={14} /></span>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}