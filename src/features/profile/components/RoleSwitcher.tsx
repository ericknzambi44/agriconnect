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
    <div className="bg-[#050505] border border-white/5 rounded-[2.5rem] p-6 md:p-8 space-y-8 relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)]">
      
      {/* SCANNER BACKGROUND EFFECT */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent animate-[scan_3s_linear_infinite]" />
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-emerald-500/[0.03] blur-[100px] pointer-events-none" />

      {/* HEADER DE SECTION */}
      <div className="flex items-center justify-between relative z-10">
        <div className="space-y-1">
          <h2 className="text-2xl font-display font-black uppercase italic tracking-tighter text-white">
            Privilèges <span className="text-emerald-500">Système</span>
          </h2>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <p className="font-tech text-[8px] text-white/30 uppercase tracking-[0.4em]">Autorisation</p>
          </div>
        </div>
        <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
           <ShieldCheck className="w-5 h-5 text-emerald-500" />
        </div>
      </div>
      
      {/* GRID : SÉLECTEUR DE PROTOCOLE */}
      <div className="flex flex-col gap-5 relative z-10">
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
                "group relative flex flex-col p-5 md:p-6 rounded-[2rem] border transition-all duration-700 text-left overflow-hidden",
                isActive 
                  ? "bg-emerald-500/[0.07] border-emerald-500/40 shadow-[0_20px_40px_rgba(0,0,0,0.4)] scale-[1.02]" 
                  : "bg-white/[0.02] border-white/5 hover:border-white/20 hover:bg-white/[0.04] active:scale-95"
              )}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-5">
                  {/* Icône de rôle stylisée */}
                  <div className={cn(
                    "p-4 rounded-2xl transition-all duration-700 relative",
                    isActive 
                      ? "bg-emerald-500 text-black shadow-[0_0_25px_rgba(16,185,129,0.5)]" 
                      : "bg-[#0A0A0A] text-white/20 group-hover:text-emerald-500/60 group-hover:border-emerald-500/20 border border-white/5"
                  )}>
                    <Icon className={cn("w-5 h-5 md:w-6 md:h-6 transition-transform group-hover:scale-110", isActive && "animate-pulse")} />
                  </div>

                  <div className="flex flex-col">
                    <span className={cn(
                        "font-display italic font-black uppercase tracking-tight text-sm md:text-base transition-colors",
                        isActive ? "text-emerald-500" : "text-white/40 group-hover:text-white"
                    )}>
                        {role.titre_role}
                    </span>
                    <span className={cn(
                      "font-tech text-[7px] tracking-[0.4em] uppercase mt-1",
                      isActive ? "text-emerald-500/60" : "text-white/10"
                    )}>
                      {config.tag}
                    </span>
                  </div>
                </div>
                
                {isActive && (
                   <div className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
                      <span className="font-tech text-[8px] text-emerald-500 font-bold uppercase tracking-widest">Active</span>
                   </div>
                )}
              </div>

              {/* Description Technique */}
              <p className={cn(
                "font-sans text-[10px] md:text-[11px] font-medium leading-relaxed pl-1 transition-colors italic tracking-wide",
                isActive ? "text-white/80" : "text-white/20 group-hover:text-white/40"
              )}>
                {config.desc}
              </p>

              {/* Loader (Overlay Cyber) */}
              {loading && !isActive && (
                 <div className="absolute inset-0 bg-[#050505]/80 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-300">
                    <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mb-2" />
                    <span className="font-tech text-[8px] text-emerald-500 uppercase tracking-[0.5em]">Synchronizing...</span>
                 </div>
              )}
            </button>
          );
        })}
      </div>

      {/* FOOTER ADVISORY */}
      <div className="group/info flex items-start gap-4 p-5 bg-emerald-500/[0.03] border border-emerald-500/10 rounded-[1.5rem] relative z-10 transition-colors hover:bg-emerald-500/[0.06]">
        <div className="p-2 bg-emerald-500/10 rounded-lg">
          <Info className="w-3.5 h-3.5 text-emerald-500" />
        </div>
        <p className="font-tech text-[9px] font-bold text-emerald-500/40 uppercase leading-relaxed tracking-widest italic group-hover/info:text-emerald-500/60 transition-colors">
          Note : La permutation des privilèges modifie l'indexation de vos <span className="text-emerald-500/80 underline decoration-dotted">Smart_Contracts</span> et vos accès au Hub de Bunia.
        </p>
      </div>
    </div>
  );
}