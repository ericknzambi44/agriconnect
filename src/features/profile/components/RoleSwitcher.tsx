// src/features/profile/components/RoleSwitcher.tsx
import { Store, ShoppingBag, Truck, ShieldCheck, Loader2, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Mise à jour de la configuration pour unifier les couleurs sur l'émeraude
const ROLE_MAP: Record<string, { icon: any, desc: string }> = {
  VENDEUR: { 
    icon: Store, 
    desc: "Vendre mes récoltes et gérer mon stock de produits." 
  },
  ACHETEUR: { 
    icon: ShoppingBag, 
    desc: "Acheter des produits frais directement aux producteurs." 
  },
  TRANSPORTEUR: { 
    icon: Truck, 
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
    <div className="bg-[#050505] border border-white/5 rounded-[2.5rem] p-5 md:p-8 space-y-6 relative h-auto overflow-visible shadow-2xl">
      
      {/* Effet de background émeraude subtil */}
      <div className="absolute -top-12 -left-12 w-48 h-48 bg-emerald-500/5 blur-[80px] pointer-events-none" />

      <div className="flex items-center justify-between relative z-10">
        <div>
          <h2 className="text-xl font-black uppercase italic tracking-tighter text-white">Privilèges</h2>
          <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Mode opératoire</p>
        </div>
        <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
           <ShieldCheck className="w-5 h-5 text-emerald-500" />
        </div>
      </div>
      
      {/* GRID : Liste des modes opératoires */}
      <div className="flex flex-col gap-4 relative z-10">
        {roles.map((role: any) => {
          const roleKey = role.titre_role.toUpperCase();
          const config = ROLE_MAP[roleKey] || { icon: ShieldCheck, desc: "Accès standard au réseau" };
          const Icon = config.icon;
          const isActive = currentRoleId === role.id;
          
          return (
            <button
              key={role.id}
              onClick={() => !isActive && handleRoleClick(role.id, role.titre_role)}
              disabled={loading}
              className={cn(
                "group relative flex flex-col p-4 md:p-6 rounded-[1.5rem] border transition-all duration-500 text-left overflow-hidden",
                isActive 
                  ? "bg-emerald-500/10 border-emerald-500/40 shadow-[0_15px_30px_rgba(16,185,129,0.1)] scale-[1.02]" 
                  : "bg-white/[0.03] border-white/5 hover:border-white/20 hover:bg-white/[0.05] active:scale-95"
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "p-3 rounded-xl transition-all duration-500",
                    isActive 
                      ? "bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]" 
                      : "bg-white/5 text-white/20 group-hover:text-emerald-500/60"
                  )}>
                    <Icon className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className={cn(
                        "font-black uppercase italic tracking-[0.15em] text-xs md:text-sm transition-colors",
                        isActive ? "text-emerald-500" : "text-white/40 group-hover:text-white"
                    )}>
                        {role.titre_role}
                    </span>
                    {isActive && (
                      <span className="text-[7px] font-black text-emerald-500/60 tracking-[0.3em] uppercase mt-0.5">
                        Système Connecté
                      </span>
                    )}
                  </div>
                </div>
                
                {isActive && (
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_12px_#10b981]" />
                )}
              </div>

              {/* Description */}
              <p className={cn(
                "text-[9px] md:text-[10px] font-bold leading-relaxed pl-1 transition-colors uppercase tracking-wider italic",
                isActive ? "text-white/70" : "text-white/20 group-hover:text-white/40"
              )}>
                {config.desc}
              </p>

              {/* Loader de transition (Style Cyber) */}
              {loading && !isActive && (
                 <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center animate-in fade-in">
                    <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
                 </div>
              )}
            </button>
          );
        })}
      </div>

      {/* INFO FOOTER - Thème Émeraude */}
      <div className="flex items-start gap-3 p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 relative z-10">
        <Info className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
        <p className="text-[9px] font-black text-emerald-500/40 uppercase leading-normal tracking-widest italic">
          Le changement de mode reconfigure instantanément vos flux de données sécurisés.
        </p>
      </div>
    </div>
  );
}