import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, Truck, PackageCheck, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function CodeValidatorPanel({ onDepot, onRetrait }: any) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<"depot" | "retrait" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isValid = code.trim().length >= 4;

  const handleAction = async (action: "depot" | "retrait") => {
    if (!isValid) return;

    setLoading(true);
    setType(action);
    setError(null);

    try {
      if (action === "depot") {
        await onDepot(code.trim());
      } else {
        await onRetrait(code.trim());
      }
      setCode("");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Erreur inconnue");
    } finally {
      setLoading(false);
      setType(null);
    }
  };

  return (
    <div className="bg-gradient-to-b from-white/[0.02] to-black/40 border border-white/10 p-5 md:p-6 rounded-2xl md:rounded-3xl space-y-4 backdrop-blur-sm relative overflow-hidden group">
      
      {/* Effet de lueur au survol */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* HEADER AVEC DÉGRADÉ */}
      <h3 className="text-[10px] font-tech uppercase tracking-widest text-primary flex items-center gap-2">
        <Lock className="w-3 h-3 text-primary drop-shadow-[0_0_4px_rgba(var(--primary),0.6)]" />
        Validation sécurisée
      </h3>

      {/* INPUT */}
      <Input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Entrer code..."
        className="bg-white/[0.02] border border-white/10 text-white placeholder:text-white/30 rounded-xl h-11 focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
      />

      {/* ERREUR (si présente) */}
      {error && (
        <div className="text-[10px] text-red-400 font-tech uppercase tracking-wider">
          {error}
        </div>
      )}

      {/* STATUT */}
      <div className="text-[9px] text-white/30 font-tech uppercase tracking-wider">
        {isValid ? "Code valide" : "Code insuffisant"}
      </div>

      {/* BOUTONS AVEC DÉGRADÉS */}
      <div className="flex gap-3">
        <Button
          disabled={!isValid || loading}
          onClick={() => handleAction("depot")}
          className={cn(
            "flex-1 h-11 rounded-xl font-black uppercase italic text-[11px] transition-all active:scale-95",
            isValid && !loading
              ? "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-500/30 hover:scale-[1.02]"
              : "bg-white/5 border border-white/10 text-white/30 cursor-not-allowed"
          )}
        >
          <Truck className="w-3 h-3 mr-2" />
          {loading && type === "depot" ? "..." : "Dépôt"}
        </Button>

        <Button
          disabled={!isValid || loading}
          onClick={() => handleAction("retrait")}
          className={cn(
            "flex-1 h-11 rounded-xl font-black uppercase italic text-[11px] transition-all active:scale-95",
            isValid && !loading
              ? "bg-gradient-to-r from-primary to-orange-400 text-black shadow-lg shadow-primary/30 hover:scale-[1.02]"
              : "bg-white/5 border border-white/10 text-white/30 cursor-not-allowed"
          )}
        >
          <PackageCheck className="w-3 h-3 mr-2" />
          {loading && type === "retrait" ? "..." : "Retrait"}
        </Button>
      </div>
    </div>
  );
}