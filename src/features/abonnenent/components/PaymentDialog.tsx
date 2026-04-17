import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldCheck, Smartphone, CheckCircle2, ArrowRight } from "lucide-react";
import { Plan } from "../types";
import { cn } from "@/lib/utils";

// Données consolidées avec les icônes de ton sélecteur
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

  const handleSubmit = () => {
    if (isValidPhone && !loading) onConfirm(phone, operator);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#050505] border-white/10 sm:max-w-[400px] w-[95vw] rounded-[2rem] p-0 overflow-hidden shadow-2xl outline-none">
        
        {/* HEADER DE SÉQUESTRE (Style PaymentSelector) */}
        <div className="bg-white/[0.02] p-6 border-b border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Séquestre_Actif</h3>
                <p className="text-[7px] font-medium text-white/40 uppercase">Fonds sécurisés par le système</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[8px] text-emerald-500/50 block uppercase font-bold">Total_À_Payer</span>
              <span className="text-2xl font-black text-white italic">{plan?.prix} <small className="text-[10px] opacity-30">USD</small></span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black uppercase text-white/60 bg-white/5 px-2 py-1 rounded-md border border-white/5 italic">
              Pack: {plan?.nom}
            </span>
            <span className="text-[9px] font-black text-emerald-500/60 uppercase tracking-widest">+ {plan?.duree_jour}J</span>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* GRILLE DES OPÉRATEURS (Style PaymentSelector) */}
          <div className="space-y-3">
            <Label className="text-[8px] font-black uppercase tracking-widest text-white/20 ml-1">Choisir_Passerelle</Label>
            <RadioGroup defaultValue="mpesa" onValueChange={setOperator} className="grid grid-cols-3 gap-2">
              {OPERATORS.map((op) => (
                <Label key={op.id} className={cn(
                  "relative flex flex-col items-center justify-center h-20 rounded-xl border transition-all cursor-pointer gap-2",
                  operator === op.id ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/5 bg-white/[0.02]'
                )}>
                  <RadioGroupItem value={op.id} className="sr-only" />
                  <div className="w-8 h-8 rounded-lg bg-white/5 p-1">
                    <img src={op.icon} alt={op.name} className="w-full h-full object-contain" />
                  </div>
                  <span className={cn(
                    "text-[8px] font-black uppercase",
                    operator === op.id ? 'text-emerald-500' : 'text-white/20'
                  )}>
                    {op.name}
                  </span>
                  {operator === op.id && (
                    <div className="absolute top-1.5 right-1.5 w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                  )}
                </Label>
              ))}
            </RadioGroup>
          </div>

          {/* INPUT TÉLÉPHONE  */}
          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <Label className="text-[8px] font-black uppercase text-white/20 tracking-widest italic">Numero Compte mobile money</Label>
              {isValidPhone && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
            </div>
            <div className="relative group">
              <Smartphone className={cn(
                "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors",
                isValidPhone ? 'text-emerald-500' : 'text-white/20'
              )} />
              <Input 
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="08..." 
                type="tel"
                className="h-12 pl-10 bg-[#0A0A0A] border-white/10 font-black text-base italic rounded-xl text-white focus-visible:border-emerald-500/50 transition-all outline-none"
              />
            </div>
          </div>

          {/* BOUTON D'ACTION */}
          <div className="pt-2">
            <Button 
              onClick={handleSubmit} 
              disabled={loading || !isValidPhone}
              className={cn(
                "h-14 w-full font-black uppercase italic tracking-widest text-[10px] rounded-xl transition-all border-none",
                isValidPhone ? 'bg-emerald-500 text-black hover:bg-emerald-400' : 'bg-white/5 text-white/10'
              )}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <span className="flex items-center gap-2">Confirmer_Paiement <ArrowRight className="w-4 h-4" /></span>
              )}
            </Button>
            
            <p className="mt-4 text-center text-[6px] font-black text-white/10 uppercase tracking-[0.5em]">
             KOfuta abonnement
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}