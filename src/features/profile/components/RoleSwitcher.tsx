import { Store, ShoppingBag, Truck, ShieldCheck, Loader2, Info, Zap, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const ROLE_MAP: Record<string, { icon: any, desc: string, tag: string }> = {
  VENDEUR: { 
    icon: Store, 
    desc: "Déploiement des stocks et gestion des actifs.",
    tag: "PRODUCTEUR"
  },
  ACHETEUR: { 
    icon: ShoppingBag, 
    desc: "Acquisition de ressources en circuit sécurisé.",
    tag: "CONSOMMATEUR"
  },
  TRANSPORTEUR: { 
    icon: Truck, 
    desc: "Optimisation logistique et exécution des flux.",
    tag: "LOGISTIQUE"
  },
};

export function RoleSwitcher({ currentRoleId, roles, onRoleChange, loading }: any) {
  
  const handleRoleClick = (roleId: number, roleName: string) => {
    const promise = onRoleChange(roleId);
    toast.promise(promise, {
      loading: `Migration vers ${roleName}...`,
      success: `Terminal configuré : Mode ${roleName} actif.`,
      error: (err) => `Échec de reconfiguration : ${err.message}`
    });
  };

  return (
    <div className="bg-gradient-to-b from-white/[0.02] to-black/40 border border-white/10 rounded-[1.5rem] md:rounded-[2.5rem] p-4 md:p-8 space-y-6 md:space-y-8 relative overflow-hidden shadow-2xl backdrop-blur-sm">
      
      {/* LIGNE DE SCAN ANIMÉE */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/60 to-transparent animate-[scan_4s_linear_infinite]" />

      {/* HEADER */}
      <div className="flex items-center justify-between relative z-10 px-1">
        <div className="min-w-0">
          <h2 className="text-[clamp(1.1rem,5vw,1.6rem)] font-display font-black uppercase italic tracking-tighter text-white leading-none truncate">
            Privilèges <span className="text-primary">Système</span>
          </h2>
          <div className="flex items-center gap-2 mt-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_6px_rgba(16,185,129,0.6)]" />
            <p className="font-tech text-[7px] md:text-[9px] text-white/50 uppercase tracking-[0.3em] font-black italic">
              Autorisation active
            </p>
          </div>
        </div>
        <div className="p-3 md:p-4 bg-black/50 border border-primary/30 rounded-xl md:rounded-2xl shrink-0 ml-4 shadow-md">
          <ShieldCheck className="w-5 h-5 md:w-6 md:h-6 text-primary drop-shadow-[0_0_4px_rgba(var(--primary),0.6)]" />
        </div>
      </div>
      
      {/* GRILLE DES RÔLES */}
      <div className="flex flex-col gap-3 md:gap-5 relative z-10">
        {roles.map((role: any) => {
          const roleKey = role.titre_role.toUpperCase();
          const config = ROLE_MAP[roleKey] || { icon: Zap, desc: "Accès standard au réseau", tag: "Invité" };
          const Icon = config.icon;
          const isActive = currentRoleId === role.id;
          
          return (
            <button
              key={role.id}
              onClick={() => !isActive && handleRoleClick(role.id, role.titre_role)}
              disabled={loading}
              className={cn(
                "group relative flex flex-col p-4 md:p-6 rounded-[1.2rem] md:rounded-[2rem] border-2 transition-all duration-500 text-left overflow-hidden",
                isActive 
                  ? "bg-gradient-to-r from-primary/15 to-transparent border-primary/60 shadow-[0_0_20px_rgba(var(--primary),0.2)] scale-[1.01] md:scale-[1.02]" 
                  : "bg-white/[0.01] border-white/10 hover:border-primary/40 hover:bg-primary/[0.02] active:scale-95"
              )}
            >
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <div className="flex items-center gap-3 md:gap-5 min-w-0">
                  {/* ICÔNE AVEC DÉGRADÉ */}
                  <div className={cn(
                    "p-3 md:p-4 rounded-xl border transition-all duration-500 shrink-0",
                    isActive 
                      ? "bg-gradient-to-br from-primary to-orange-400 border-primary/60 text-black shadow-lg shadow-primary/30" 
                      : "bg-black/40 border-white/10 text-white/40 group-hover:text-primary group-hover:border-primary/30"
                  )}>
                    <Icon size={18} className={cn("md:w-6 md:h-6", isActive && "animate-pulse")} />
                  </div>

                  <div className="flex flex-col min-w-0">
                    <span className={cn(
                      "font-display italic font-black uppercase tracking-tight text-sm md:text-lg truncate",
                      isActive ? "text-primary" : "text-white/50 group-hover:text-white"
                    )}>
                      {role.titre_role}
                    </span>
                    <span className={cn(
                      "font-tech text-[7px] md:text-[8px] tracking-[0.3em] uppercase mt-0.5 font-black truncate",
                      isActive ? "text-primary" : "text-white/30"
                    )}>
                      {config.tag}
                    </span>
                  </div>
                </div>
                
                {isActive ? (
                  <div className="hidden xs:flex px-3 py-1 bg-emerald-500/20 border border-emerald-500/40 rounded-full shrink-0 backdrop-blur-sm">
                    <span className="font-tech text-[8px] text-emerald-400 font-black uppercase">ACTIF</span>
                  </div>
                ) : (
                  <ChevronRight size={14} className="text-white/20 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                )}
              </div>

              {/* DESCRIPTION */}
              <p className={cn(
                "font-tech text-[8px] md:text-[10px] leading-relaxed pl-1 italic tracking-wide",
                isActive ? "text-white/80" : "text-white/30"
              )}>
                {config.desc}
              </p>

              {/* LOADER SUR BOUTON NON ACTIF */}
              {loading && !isActive && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center z-50">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* NOTE DE SÉCURITÉ */}
      <div className="flex items-start gap-3 md:gap-4 p-4 bg-primary/10 border border-primary/20 rounded-[1.2rem] md:rounded-[1.8rem] relative z-10 backdrop-blur-sm">
        <Info className="w-4 h-4 text-primary shrink-0 mt-0.5 drop-shadow-[0_0_4px_rgba(var(--primary),0.5)]" />
        <p className="font-tech text-[7px] md:text-[9px] font-bold text-primary/90 uppercase leading-normal tracking-wider italic">
          <span className="hidden xs:inline">Note de sécurité : </span>La permutation réinitialise vos protocoles de <span className="text-primary underline decoration-primary/50">contrats intelligents</span>.
        </p>
      </div>

      <style>{`
        @keyframes scan {
          0% { transform: translateX(-100%); opacity: 0; }
          50% { opacity: 0.6; }
          100% { transform: translateX(100%); opacity: 0; }
        }
      `}</style>
    </div>
  );
}