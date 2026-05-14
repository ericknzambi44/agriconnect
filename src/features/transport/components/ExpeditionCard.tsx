import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Package, ShieldCheck, Phone, User } from "lucide-react";

interface ExpeditionCardProps {
  exp: any;
  onSelect?: (exp: any) => void;
  vendeur?: { nom?: string; prenom?: string; numero_tel?: string };
  acheteur?: { nom?: string; prenom?: string; numero_tel?: string };
}

export function ExpeditionCard({ exp, onSelect, vendeur, acheteur }: ExpeditionCardProps) {
  return (
    <Card
      onClick={() => onSelect?.(exp)}
      className={cn(
        "group relative overflow-hidden bg-gradient-to-b from-white/[0.02] to-black/40 border border-white/10 p-5 rounded-2xl cursor-pointer transition-all duration-500 hover:border-primary/60 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 backdrop-blur-sm"
      )}
    >
      {/* Barre lumineuse au survol */}
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* En-tête */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-[10px] text-primary uppercase font-tech font-black tracking-wider">
          <ShieldCheck size={12} className="text-primary drop-shadow-[0_0_4px_rgba(var(--primary),0.6)]" />
          Expédition #{exp.id.slice(0, 8)}
        </div>
        <div className="w-6 h-6 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Package size={12} className="text-primary" />
        </div>
      </div>

      {/* Détails commande */}
      <div className="text-white text-sm md:text-base font-black italic tracking-tight mt-1">
        {exp.commande?.quantite_commandee} unité(s) • {exp.commande?.prix_total_commande} USD
      </div>

      {/* Statut */}
      <div className="flex items-center gap-2 mt-3">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
        <span className="text-[9px] text-white/50 uppercase font-tech tracking-wider">
          Statut: {exp.statut_expedition}
        </span>
      </div>

      {/* Codes dépôt / retrait */}
      <div className="flex flex-wrap gap-2 mt-4">
        <div className="bg-emerald-500/10 border border-emerald-500/30 px-2 py-1 rounded-lg text-[9px] font-tech font-black uppercase text-emerald-400 shadow-sm">
          Dépôt: {exp.code_depot}
        </div>
        <div className="bg-white/5 border border-white/10 px-2 py-1 rounded-lg text-[9px] font-tech font-black uppercase text-white/70 hover:border-primary/50 transition-colors">
          Retrait: {exp.code_retrait}
        </div>
      </div>

      {/* Contacts (vendeur & acheteur) */}
      {(vendeur || acheteur) && (
        <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-2 gap-3 text-[9px] font-tech">
          {vendeur && vendeur.numero_tel && (
            <div className="flex items-center gap-2 text-white/70">
              <User size={10} className="text-primary/70" />
              <span className="truncate">V: {vendeur.nom} {vendeur.prenom}</span>
              <a href={`tel:${vendeur.numero_tel}`} className="ml-auto hover:text-primary transition">
                <Phone size={10} />
              </a>
            </div>
          )}
          {acheteur && acheteur.numero_tel && (
            <div className="flex items-center gap-2 text-white/70">
              <User size={10} className="text-primary/70" />
              <span className="truncate">A: {acheteur.nom} {acheteur.prenom}</span>
              <a href={`tel:${acheteur.numero_tel}`} className="ml-auto hover:text-primary transition">
                <Phone size={10} />
              </a>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}