import { Card } from "@/components/ui/card";

export function ExpeditionDetailDrawer({ exp, agence }: any) {
  if (!exp) return null;

  return (
    <Card className="bg-[#0b0b0b] border-white/5 p-6 rounded-3xl space-y-3">

      <div className="text-emerald-500 text-[10px] uppercase font-tech">
        DÉTAIL_EXPÉDITION
      </div>

      {/* AGENCE CONTEXT */}
      <div className="text-[9px] text-white/40">
        Agence: <span className="text-emerald-500">{agence?.nom_agence || "N/A"}</span>
      </div>

      {/* COMMANDE */}
      <div className="text-white text-sm">
        Commande #{exp.commande?.id}
      </div>

      <div className="text-[9px] text-white/40">
        Quantité: {exp.commande?.quantite_commandee} | Prix: {exp.commande?.prix_total_commande}$
      </div>

      {/* ACTEURS */}
      <div className="text-[9px] text-white/40">
        Vendeur: {exp.vendeur?.nom} {exp.vendeur?.prenom} ({exp.vendeur?.numero_tel})
      </div>

      <div className="text-[9px] text-white/40">
        Acheteur: {exp.acheteur?.nom} {exp.acheteur?.prenom} ({exp.acheteur?.numero_tel})
      </div>

      {/* STATUT */}
      <div className="text-emerald-400 text-[9px] uppercase">
        {exp.statut_expedition}
      </div>

    </Card>
  );
}