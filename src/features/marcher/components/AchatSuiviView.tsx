// features/marcher/components/AchatSuiviView.tsx
import React, { useState } from 'react';
import { useAchatSuivi } from '../hooks/useAchatSuivi';
import { 
  Package, 
  MapPin, 
  Truck, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Loader2,
  ShoppingBag,
  Calendar,
  DollarSign
} from 'lucide-react';
import { cn } from "@/lib/utils";

export function AchatSuiviView() {
  const { achats, loading, error, refresh } = useAchatSuivi();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <div className="relative">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <AlertCircle className="w-12 h-12 text-red-400" />
        <p className="text-white/60 font-tech text-sm">Erreur : {error}</p>
        <button 
          onClick={refresh}
          className="px-4 py-2 bg-primary/20 text-primary rounded-xl text-sm font-black uppercase tracking-wider hover:bg-primary/30 transition"
        >
          Réessayer
        </button>
      </div>
    );
  }

  if (achats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <ShoppingBag className="w-16 h-16 text-white/10" />
        <p className="text-white/40 font-tech text-sm uppercase tracking-wider">Aucun achat effectué ou probleme de connexion</p>
        <p className="text-white/20 text-xs">Vos commandes apparaîtront ici</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500 bg-gradient-to-br from-[#0a0a0a] via-[#050505] to-black p-4 md:p-6 rounded-3xl">
      
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="p-3 bg-gradient-to-br from-primary/20 to-transparent rounded-xl border border-primary/30">
          <Package className="text-primary drop-shadow-[0_0_6px_rgba(var(--primary),0.6)]" size={24} />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-black italic uppercase tracking-tighter text-white">
            Suivi des <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">commandes</span>
          </h1>
          <p className="font-tech text-[8px] text-white/50 uppercase tracking-[0.2em] mt-1">
            État de vos achats
          </p>
        </div>
        <button 
          onClick={refresh}
          className="ml-auto p-2 bg-white/5 rounded-xl hover:bg-white/10 transition"
        >
          <Loader2 size={16} className="text-white/60 hover:text-primary animate-spin-slow" />
        </button>
      </div>

      {/* Liste des commandes */}
      <div className="space-y-4">
        {achats.map((achat) => {
          const isExpanded = expandedId === achat.id;
          const statut = achat.expedition?.statut || 'EN_ATTENTE';
          
          // Icône et couleur selon statut
          let StatusIcon = Clock;
          let statusColor = "text-yellow-400";
          let bgStatus = "bg-yellow-400/10 border-yellow-400/30";
          if (statut === 'A_DEPOSER') {
            StatusIcon = AlertCircle;
            statusColor = "text-orange-400";
            bgStatus = "bg-orange-400/10 border-orange-400/30";
          } else if (statut === 'EN_TRANSIT') {
            StatusIcon = Truck;
            statusColor = "text-blue-400";
            bgStatus = "bg-blue-400/10 border-blue-400/30";
          } else if (statut === 'LIVREE') {
            StatusIcon = CheckCircle2;
            statusColor = "text-emerald-400";
            bgStatus = "bg-emerald-400/10 border-emerald-400/30";
          }

          return (
            <div 
              key={achat.id}
              className="group relative bg-gradient-to-b from-white/[0.02] to-black/40 border border-white/10 rounded-2xl overflow-hidden transition-all duration-500 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10"
            >
              {/* Barre de statut en haut */}
              <div className={cn("h-1 w-full bg-gradient-to-r", 
                statut === 'LIVREE' ? "from-emerald-500 to-emerald-600" :
                statut === 'EN_TRANSIT' ? "from-blue-500 to-blue-600" :
                statut === 'A_DEPOSER' ? "from-orange-500 to-orange-600" :
                "from-yellow-500 to-yellow-600"
              )} />

              <div className="p-5">
                {/* En-tête de la commande */}
                <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    {achat.produit.image ? (
                      <img 
                        src={achat.produit.image} 
                        alt={achat.produit.nom}
                        className="w-12 h-12 rounded-xl object-cover border border-white/10"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                        <Package size={20} className="text-white/30" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-white font-black uppercase italic text-base">
                        {achat.produit.nom}
                      </h3>
                      <div className="flex items-center gap-3 text-[10px] text-white/40 font-tech uppercase mt-1">
                        <span className="flex items-center gap-1"><Calendar size={10} /> {new Date(achat.date_commande).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1"><DollarSign size={10} /> {achat.prix_total} USD</span>
                        <span>Quantité: {achat.quantite} {achat.produit.unite}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Badge de statut */}
                  <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded-full border", bgStatus)}>
                    <StatusIcon size={12} className={statusColor} />
                    <span className={cn("text-[9px] font-black uppercase tracking-wider", statusColor)}>
                      {statut === 'A_DEPOSER' ? 'En attente de dépôt' :
                       statut === 'EN_TRANSIT' ? 'En transit' :
                       statut === 'LIVREE' ? 'Livré' : 'En traitement'}
                    </span>
                  </div>
                </div>

                {/* Message de statut */}
                <p className="text-white/70 text-xs font-tech italic mb-3">
                  {achat.message_statut}
                </p>
                {achat.action_requise && (
                  <p className="text-primary/70 text-[10px] font-tech uppercase tracking-wider">
                    {achat.action_requise}
                  </p>
                )}

                {/* Bouton détails */}
                <button 
                  onClick={() => setExpandedId(isExpanded ? null : achat.id)}
                  className="mt-3 text-[9px] font-black uppercase tracking-wider text-primary/60 hover:text-primary transition"
                >
                  {isExpanded ? "Masquer les détails" : "Voir les détails"}
                </button>

                {/* Détails expansibles */}
                {isExpanded && achat.expedition && (
                  <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-3 text-[10px] font-tech">
                    <div className="space-y-1">
                      <span className="text-white/40 uppercase">Patience</span>
                      <div className="bg-primary/10 border border-primary/30 rounded-lg px-3 py-1.5 font-mono text-primary font-black">
                        Vous aurez code retrait quand le vendeur deposera votre colis
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-white/40 uppercase">Code de retrait</span>
                      <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 font-mono text-white/80">
                        {achat.expedition.code_retrait || "En attente"}
                      </div>
                    </div>
                    {achat.expedition.agence_depot_nom && (
                      <div className="flex items-center gap-2">
                        <MapPin size={10} className="text-primary" />
                        <span className="text-white/60">Agence dépôt: {achat.expedition.agence_depot_nom}</span>
                      </div>
                    )}
                    {achat.expedition.agence_retrait_nom && (
                      <div className="flex items-center gap-2">
                        <MapPin size={10} className="text-primary" />
                        <span className="text-white/60">Agence retrait: {achat.expedition.agence_retrait_nom}</span>
                      </div>
                    )}
                    {achat.expedition.code_depot_used_at && (
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={10} className="text-emerald-400" />
                        <span className="text-white/60">Dépôt effectué le {new Date(achat.expedition.code_depot_used_at).toLocaleDateString()}</span>
                      </div>
                    )}
                    {achat.expedition.code_retrait_used_at && (
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={10} className="text-emerald-400" />
                        <span className="text-white/60">Retrait effectué le {new Date(achat.expedition.code_retrait_used_at).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}