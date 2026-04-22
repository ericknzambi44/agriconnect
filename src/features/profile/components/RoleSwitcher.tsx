import { Store, ShoppingBag, Truck, ShieldCheck, Loader2, Info, Zap, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const ROLE_MAP: Record<string, { icon: any, desc: string, tag: string }> = {
  VENDEUR: { 
    icon: Store, 
    desc: "Déploiement des stocks et gestion des actifs.",
    tag: "PRODUCER_NODE"
  },
  ACHETEUR: { 
    icon: ShoppingBag, 
    desc: "Acquisition de ressources en circuit sécurisé.",
    tag: "CONSUMER_NODE"
  },
  TRANSPORTEUR: { 
    icon: Truck, 
    desc: "Optimisation logistique et exécution des flux.",
    tag: "LOGISTICS_NODE"
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
    <div className="bg-secondary/50 border-2 border-border rounded-[1.5rem] md:rounded-[2.5rem] p-4 md:p-8 space-y-6 md:space-y-8 relative overflow-hidden shadow-2xl">
      
      {/* SCANNER EFFECT */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-[scan_4s_linear_infinite]" />

      {/* HEADER : Adaptatif */}
      <div className="flex items-center justify-between relative z-10 px-1">
        <div className="min-w-0">
          <h2 className="text-[clamp(1.1rem,5vw,1.6rem)] font-display font-black uppercase italic tracking-tighter text-foreground leading-none truncate">
            PRIVILÈGES_<span className="text-primary">SYSTÈME</span>
          </h2>
          <div className="flex items-center gap-2 mt-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            <p className="font-tech text-[7px] md:text-[9px] text-muted-foreground uppercase tracking-[0.3em] font-black italic opacity-70">AUTORISATION_ACTIVE</p>
          </div>
        </div>
        <div className="p-3 md:p-4 bg-background border border-primary/20 rounded-xl md:rounded-2xl shrink-0 ml-4">
           <ShieldCheck className="w-5 h-5 md:w-6 md:h-6 text-primary" />
        </div>
      </div>
      
      {/* GRID : Sélecteur vertical */}
      <div className="flex flex-col gap-3 md:gap-5 relative z-10">
        {roles.map((role: any) => {
          const roleKey = role.titre_role.toUpperCase();
          const config = ROLE_MAP[roleKey] || { icon: Zap, desc: "Accès standard au réseau", tag: "GUEST_NODE" };
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
                  ? "bg-primary/5 border-primary shadow-glow-primary scale-[1.01] md:scale-[1.02]" 
                  : "bg-background border-border hover:border-primary/30 hover:bg-primary/[0.01] active:scale-95"
              )}
            >
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <div className="flex items-center gap-3 md:gap-5 min-w-0">
                  {/* Icône adaptative */}
                  <div className={cn(
                    "p-3 md:p-4 rounded-xl border transition-all duration-500 shrink-0",
                    isActive 
                      ? "bg-primary border-primary text-primary-foreground shadow-lg" 
                      : "bg-secondary border-border text-muted-foreground group-hover:text-primary group-hover:border-primary/20"
                  )}>
                    <Icon size={18} className={cn("md:w-6 md:h-6", isActive && "animate-pulse")} />
                  </div>

                  <div className="flex flex-col min-w-0">
                    <span className={cn(
                        "font-display italic font-black uppercase tracking-tight text-sm md:text-lg truncate",
                        isActive ? "text-primary" : "text-foreground/50 group-hover:text-foreground"
                    )}>
                        {role.titre_role}
                    </span>
                    <span className={cn(
                      "font-tech text-[7px] md:text-[8px] tracking-[0.3em] uppercase mt-0.5 font-black truncate opacity-60",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )}>
                      {config.tag}
                    </span>
                  </div>
                </div>
                
                {isActive ? (
                   <div className="hidden xs:flex px-3 py-1 bg-success/10 border border-success/30 rounded-full shrink-0">
                      <span className="font-tech text-[8px] text-success font-black uppercase">ACTIVE</span>
                   </div>
                ) : (
                  <ChevronRight size={14} className="text-muted-foreground/20 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                )}
              </div>

              {/* Description : Texte plus petit sur mobile */}
              <p className={cn(
                "font-tech text-[8px] md:text-[10px] leading-relaxed pl-1 italic tracking-wide uppercase",
                isActive ? "text-foreground/80" : "text-muted-foreground/40"
              )}>
                {config.desc}
              </p>

              {/* Loader Overlay */}
              {loading && !isActive && (
                 <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px] flex items-center justify-center z-50">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                 </div>
              )}
            </button>
          );
        })}
      </div>

      {/* FOOTER : Version compacte sur mobile */}
      <div className="flex items-start gap-3 md:gap-4 p-4 bg-primary/5 border border-primary/10 rounded-[1.2rem] md:rounded-[1.8rem] relative z-10">
        <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <p className="font-tech text-[7px] md:text-[9px] font-bold text-primary/70 uppercase leading-normal tracking-wider italic">
          <span className="hidden xs:inline">Note de sécurité : </span>La permutation réinitialise vos protocoles de <span className="text-primary underline">Smart_Contracts</span>.
        </p>
      </div>

      <style>{`
        @keyframes scan {
          0% { transform: translateX(-100%); opacity: 0; }
          50% { opacity: 0.5; }
          100% { transform: translateX(100%); opacity: 0; }
        }
      `}</style>
    </div>
  );
}