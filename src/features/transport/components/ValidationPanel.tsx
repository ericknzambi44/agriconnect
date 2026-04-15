import { Input } from "@/components/ui/input";
import { ShieldAlert, Fingerprint, Loader2, Badge } from "lucide-react";

export function ValidationPanel({ mission, code, setCode, onConfirm, loading }: any) {
  const isDepot = mission?.statut === 'EN_ATTENTE_DEPOT';

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-2">
      {/* INFOS PROTOCOLE */}
      <div className="flex-1 space-y-6">
        <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl relative overflow-hidden">
          <Fingerprint className="absolute -right-4 -bottom-4 w-24 h-24 text-white/[0.02]" />
          <div className="relative z-10 space-y-4">
            <Badge className="bg-emerald-500/10 text-emerald-500 border-none font-tech text-[8px]">AUTO_GEN_SECURITY</Badge>
            <h4 className="font-display text-3xl italic text-white leading-none uppercase">
              {isDepot ? "Vérification_Dépôt" : "Vérification_Remise"}
            </h4>
            <p className="font-tech text-[10px] text-white/30 leading-relaxed uppercase italic">
              Veuillez saisir le code transmis par {isDepot ? "le vendeur" : "l'acheteur"} pour authentifier physiquement le transfert de <span className="text-white font-bold">{mission?.quantite_transportee}kg</span>.
            </p>
          </div>
        </div>
      </div>

      {/* ZONE DE SAISIE */}
      <div className="w-full lg:w-[350px] space-y-4">
        <div className="bg-black border border-white/10 p-6 rounded-3xl flex flex-col items-center gap-6">
          <span className="font-tech text-[9px] text-white/20 uppercase tracking-[0.3em]">Code_Validation</span>
          <Input 
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            className="h-16 bg-transparent border-none text-center font-display text-4xl italic text-emerald-500 focus:ring-0 placeholder:text-white/5 tracking-[0.4em]"
            placeholder="000000"
          />
          <button 
            onClick={onConfirm}
            disabled={loading || code.length < 4}
            className="w-full py-4 bg-emerald-500 text-black font-tech font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-emerald-400 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldAlert className="w-4 h-4" />}
            {loading ? "SYNC_EN_COURS" : "CONFIRMER_FLUX"}
          </button>
        </div>
      </div>
    </div>
  );
}