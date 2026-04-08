// src/features/profile/components/RoleSwitcher.tsx
import { Store, ShoppingBag, Truck, ShieldCheck, Loader2, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const ROLE_MAP: Record<string, { icon: any, color: string, desc: string }> = {
  VENDEUR: { 
    icon: Store, 
    color: "text-emerald-500", 
    desc: "Vendre mes récoltes et gérer mon stock de produits." 
  },
  ACHETEUR: { 
    icon: ShoppingBag, 
    color: "text-blue-500", 
    desc: "Acheter des produits frais directement aux producteurs." 
  },
  TRANSPORTEUR: { 
    icon: Truck, 
    color: "text-amber-500", 
    desc: "Assurer la logistique et livrer les commandes." 
  },
};

export function RoleSwitcher({ currentRoleId, roles, onRoleChange, loading }: any) {
  
  const handleRoleClick = (roleId: number, roleName: string) => {
    const promise = onRoleChange(roleId);
    
    toast.promise(promise, {
      loading: `Migration vers le statut ${roleName}...`,
      success: `Terminal configuré en mode ${roleName}.`,
      error: (err) => `Erreur de protocole : ${err.message}`
    });
  };

  return (
    /* 1. Retrait de overflow-hidden pour éviter de couper les ombres
       2. h-auto garantit que le conteneur grandit avec le nombre de rôles
    */
    <div className="bg-glass-agri border border-white/5 rounded-[2rem] p-5 md:p-8 space-y-6 relative h-auto overflow-visible shadow-2xl">
      
      {/* Effet de background subtil */}
      <div className="absolute -top-12 -left-12 w-48 h-48 bg-primary/5 blur-[80px] pointer-events-none" />

      <div className="flex items-center justify-between relative z-10">
        <div>
          <h2 className="text-xl font-black uppercase italic tracking-tighter text-white">Privilèges</h2>
          <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Mode opératoire</p>
        </div>
        <div className="p-2 bg-primary/10 rounded-xl">
           <ShieldCheck className="w-5 h-5 text-primary" />
        </div>
      </div>
      
      {/* GRID : 1 colonne partout pour garder l'aspect liste de contrôle */}
      <div className="flex flex-col gap-4 relative z-10">
        {roles.map((role: any) => {
          const roleKey = role.titre_role.toUpperCase();
          const config = ROLE_MAP[roleKey] || { icon: ShieldCheck, color: "text-white", desc: "Accès standard" };
          const Icon = config.icon;
          const isActive = currentRoleId === role.id;
          
          return (
            <button
              key={role.id}
              onClick={() => !isActive && handleRoleClick(role.id, role.titre_role)}
              disabled={loading}
              className={cn(
                "group relative flex flex-col p-4 md:p-5 rounded-2xl border transition-all duration-500 text-left overflow-hidden",
                isActive 
                  ? "bg-primary/10 border-primary/50 shadow-[0_10px_25px_rgba(34,197,94,0.1)] scale-[1.02]" 
                  : "bg-white/[0.03] border-white/5 hover:border-white/20 hover:bg-white/[0.05] active:scale-95"
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "p-3 rounded-xl transition-all duration-500 shadow-lg",
                    isActive ? "bg-primary text-black" : "bg-white/5 text-white/20 group-hover:text-white"
                  )}>
                    <Icon className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className={cn(
                        "font-black uppercase italic tracking-widest text-xs md:text-sm",
                        isActive ? "text-primary text-glow-green" : "text-white/40 group-hover:text-white"
                    )}>
                        {role.titre_role}
                    </span>
                    {isActive && <span className="text-[7px] font-black text-primary/60 tracking-[0.3em] uppercase">Session Active</span>}
                  </div>
                </div>
                
                {isActive && (
                   <div className="w-2 h-2 rounded-full bg-primary animate-ping shadow-[0_0_10px_#22c55e]" />
                )}
              </div>

              {/* Description adaptative */}
              <p className={cn(
                "text-[9px] md:text-[10px] font-bold leading-relaxed pl-1 shadow-sm transition-colors",
                isActive ? "text-white/70" : "text-white/20 group-hover:text-white/50"
              )}>
                {config.desc}
              </p>

              {/* Loader de transition */}
              {loading && !isActive && (
                 <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                 </div>
              )}
            </button>
          );
        })}
      </div>

      {/* INFO FOOTER */}
      <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-2xl border border-primary/10 relative z-10">
        <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <p className="text-[9px] font-bold text-white/50 uppercase leading-normal tracking-widest italic">
          Le changement de mode reconfigure instantanément vos flux de données.
        </p>
      </div>
    </div>
  );
}