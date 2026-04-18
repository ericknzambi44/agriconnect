import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, Truck, PackageCheck } from "lucide-react";

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
    <div className="bg-[#0a0a0a] border border-white/5 p-6 rounded-3xl space-y-4 relative">

      {/* HEADER */}
      <h3 className="text-[10px] font-tech uppercase tracking-widest text-emerald-500 flex items-center gap-2">
        <Lock className="w-3 h-3" />
        VALIDATION_SÉCURISÉE
      </h3>

      {/* INPUT */}
      <Input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Entrer code..."
        className="bg-black border-white/10 text-white"
      />

      {/* ERROR DISPLAY ⭐ IMPORTANT */}
      {error && (
        <div className="text-[10px] text-red-500 font-tech uppercase">
          {error}
        </div>
      )}

      {/* STATUS */}
      <div className="text-[9px] text-white/30 font-tech uppercase">
        {isValid ? "CODE_VALIDE" : "CODE_INSUFFISANT"}
      </div>

      {/* BUTTONS */}
      <div className="flex gap-2">

        <Button
          disabled={!isValid || loading}
          onClick={() => handleAction("depot")}
          className="w-full bg-emerald-500 text-black"
        >
          <Truck className="w-3 h-3 mr-2" />
          {loading && type === "depot" ? "..." : "Dépôt"}
        </Button>

        <Button
          disabled={!isValid || loading}
          onClick={() => handleAction("retrait")}
          className="w-full bg-white/10 text-white"
        >
          <PackageCheck className="w-3 h-3 mr-2" />
          {loading && type === "retrait" ? "..." : "Retrait"}
        </Button>

      </div>
    </div>
  );
}