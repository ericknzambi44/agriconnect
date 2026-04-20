import { Store, ShoppingBag, Truck, ShieldCheck, Loader2, Info, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Configuration des modes avec lexique technique
const ROLE_MAP: Record<string, { icon: any, desc: string, tag: string }> = {
  VENDEUR: { 
    icon: Store, 
    desc: "Déploiement des stocks et gestion des actifs agricoles.",
    tag: "PRODUCER_NODE"
  },
  ACHETEUR: { 
    icon: ShoppingBag, 
    desc: "Acquisition de ressources en circuit court sécurisé.",
    tag: "CONSUMER_NODE"
  },
  TRANSPORTEUR: { 
    icon: Truck, 
    desc: "Optimisation logistique et exécution des flux physiques.",
    tag: "LOGISTICS_NODE"
  },
};

export function RoleSwitcher({ currentRoleId, roles, onRoleChange, loading }: any) {
  
  const handleRoleClick = (roleId: number, roleName: string) => {
    const promise = onRoleChange(roleId);
    
    toast.promise(promise, {
      loading: `Migration du noyau vers ${roleName}...`,
      success: `Terminal configuré : Mode ${roleName} actif.`,
      error: (err) => `Échec de reconfiguration : ${err.message}`
    });
  };

  return (
    <div className="bg-secondary border-2 border-border rounded-[2.5rem] p-6 md:p-8 space-y-8 relative overflow-hidden shadow-2xl">
      
      {/* SCANNER BACKGROUND EFFECT */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent animate-[scan_3s_linear_infinite]" />
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-primary/[0.03] blur-[100px] pointer-events-none" />

      {/* HEADER DE SECTION */}
      <div className="flex items-center justify-between relative z-10">
        <div className="space-y-1">
          <h2 className="text-2xl font-display font-black uppercase italic tracking-tighter text-foreground">
            Privilèges <span className="text-primary text-glow-primary">Système</span>
          </h2>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <p className="font-tech text-[10px] text-muted-foreground uppercase tracking-[0.4em] font-black">Autorisation_Active</p>
          </div>
        </div>
        <div className="p-4 bg-background border-2 border-primary/20 rounded-2xl shadow-inner">
           <ShieldCheck className="w-6 h-6 text-primary" />
        </div>
      </div>
      
      {/* GRID : SÉLECTEUR DE PROTOCOLE */}
      <div className="flex flex-col gap-6 relative z-10">
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
                "group relative flex flex-col p-6 rounded-[2rem] border-2 transition-all duration-500 text-left overflow-hidden",
                isActive 
                  ? "bg-primary/5 border-primary shadow-[0_15px_30px_rgba(0,0,0,0.2)] scale-[1.02]" 
                  : "bg-background border-border hover:border-primary/40 hover:bg-primary/[0.02] active:scale-98"
              )}
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-6">
                  {/* Icône de rôle stylisée */}
                  <div className={cn(
                    "p-5 rounded-2xl transition-all duration-500 relative border-2",
                    isActive 
                      ? "bg-primary border-primary text-primary-foreground shadow-[0_0_20px_rgba(var(--primary),0.4)]" 
                      : "bg-secondary border-border text-muted-foreground group-hover:text-primary group-hover:border-primary/30"
                  )}>
                    <Icon className={cn("w-6 h-6 md:w-7 md:h-7 transition-transform group-hover:scale-110", isActive && "animate-pulse")} />
                  </div>

                  <div className="flex flex-col">
                    <span className={cn(
                        "font-display italic font-black uppercase tracking-tight text-base md:text-lg transition-colors",
                        isActive ? "text-primary" : "text-foreground/40 group-hover:text-foreground"
                    )}>
                        {role.titre_role}
                    </span>
                    <span className={cn(
                      "font-tech text-[8px] tracking-[0.5em] uppercase mt-1.5 font-black",
                      isActive ? "text-primary/60" : "text-muted-foreground/30"
                    )}>
                      {config.tag}
                    </span>
                  </div>
                </div>
                
                {isActive && (
                   <div className="px-4 py-1.5 bg-success/10 border-2 border-success/20 rounded-full">
                      <span className="font-tech text-[9px] text-success font-black uppercase tracking-widest">Connecté</span>
                   </div>
                )}
              </div>

              {/* Description Technique */}
              <p className={cn(
                "font-tech text-[10px] md:text-[11px] leading-relaxed pl-1 transition-colors italic tracking-wide uppercase",
                isActive ? "text-foreground/80" : "text-muted-foreground/40 group-hover:text-muted-foreground/60"
              )}>
                {config.desc}
              </p>

              {/* Loader (Overlay Cyber) */}
              {loading && !isActive && (
                 <div className="absolute inset-0 bg-secondary/90 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-300 z-50">
                    <Loader2 className="w-10 h-10 animate-spin text-primary mb-3" />
                    <span className="font-tech text-[10px] text-primary uppercase tracking-[0.6em] font-black">Sync_In_Progress</span>
                 </div>
              )}
            </button>
          );
        })}
      </div>

      {/* FOOTER ADVISORY */}
      <div className="group/info flex items-start gap-5 p-6 bg-primary/5 border-2 border-primary/10 rounded-[1.8rem] relative z-10 transition-all hover:bg-primary/[0.08] hover:border-primary/20">
        <div className="p-2.5 bg-primary/10 rounded-xl">
          <Info className="w-4 h-4 text-primary" />
        </div>
        <p className="font-tech text-[9px] font-black text-primary/60 uppercase leading-relaxed tracking-[0.15em] italic">
          Attention : La permutation des privilèges réinitialise vos <span className="text-primary underline decoration-dotted">Smart_Contracts</span> et vos accès prioritaires au Hub de Bunia.
        </p>
      </div>

      <style>{`
        @keyframes scan {
          0% { transform: translateX(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(100%); opacity: 0; }
        }
      `}</style>
    </div>
  );
}