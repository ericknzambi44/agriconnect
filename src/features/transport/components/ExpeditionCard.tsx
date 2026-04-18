import { Card } from "@/components/ui/card";

export function ExpeditionCard({ exp, onSelect }: any) {
  return (
    <Card
      onClick={() => onSelect?.(exp)}
      className="bg-[#0a0a0a] border-white/5 p-5 rounded-3xl cursor-pointer hover:border-emerald-500/30 transition"
    >
      <div className="text-[10px] text-emerald-500 uppercase font-tech">
        EXPÉDITION #{exp.id.slice(0, 6)}
      </div>

      <div className="text-white text-sm mt-2">
        {exp.commande?.quantite_commandee} unité(s) • {exp.commande?.prix_total_commande}$
      </div>

      <div className="text-[9px] text-white/40 mt-2">
        Statut: {exp.statut_expedition}
      </div>

      <div className="flex gap-2 mt-3 text-[9px]">
        <span className="bg-emerald-500/10 px-2 py-1 rounded">
          DEPOT: {exp.code_depot}
        </span>
        <span className="bg-white/10 px-2 py-1 rounded">
          RETRAIT: {exp.code_retrait}
        </span>
      </div>
    </Card>
  );
}