import { Card } from "@/components/ui/card";
import { ShieldCheck, Package, Users, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export function ExpeditionDetailDrawer({ exp, agence }: any) {
  if (!exp) return null;

  return (
    <Card className="relative overflow-hidden bg-gradient-to-b from-white/[0.02] to-black/40 border border-white/10 p-6 rounded-2xl md:rounded-3xl space-y-4 backdrop-blur-sm shadow-2xl group">
      
      {/* Lueur au survol */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* En-tête */}
      <div className="flex items-center gap-2 text-primary text-[10px] uppercase font-tech font-black tracking-wider">
        <ShieldCheck size={14} className="drop-shadow-[0_0_4px_rgba(var(--primary),0.6)]" />
        Détail expédition
      </div>

      {/* Agence */}
      <div className="flex items-center gap-2 text-[9px] text-white/50 font-tech uppercase tracking-wider">
        <MapPin size={12} className="text-primary/70" />
        Agence: <span className="text-primary font-bold">{agence?.nom_agence || "Non assignée"}</span>
      </div>

      {/* Commande */}
      <div className="flex items-center gap-2 text-white text-sm md:text-base font-black italic tracking-tight">
        <Package size={14} className="text-primary" />
        Commande #{exp.commande?.id}
      </div>

      {/* Quantité / Prix */}
      <div className="text-[9px] text-white/40 font-tech uppercase tracking-wider pl-6">
        Quantité: {exp.commande?.quantite_commandee} | Prix: {exp.commande?.prix_total_commande} USD
      </div>

      {/* Vendeur */}
      <div className="text-[9px] text-white/40 font-tech uppercase tracking-wider border-l-2 border-primary/30 pl-3">
        Vendeur: {exp.vendeur?.nom} {exp.vendeur?.prenom || ""} {exp.vendeur?.numero_tel ? `(${exp.vendeur.numero_tel})` : "(N° non renseigné)"}
      </div>

      {/* Acheteur */}
      <div className="text-[9px] text-white/40 font-tech uppercase tracking-wider border-l-2 border-primary/30 pl-3">
        Acheteur: {exp.acheteur?.nom} {exp.acheteur?.prenom || ""} {exp.acheteur?.numero_tel ? `(${exp.acheteur.numero_tel})` : "(N° non renseigné)"}
      </div>

      {/* Statut */}
      <div className="flex items-center gap-2 pt-2">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
        <span className="text-emerald-400 text-[10px] uppercase font-tech font-black tracking-wider">
          {exp.statut_expedition}
        </span>
      </div>
    </Card>
  );
}