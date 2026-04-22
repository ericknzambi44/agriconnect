import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Globe, Loader2, Navigation, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

export function AddressSection({ profile, onUpdate, loading }: any) {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      pays: profile?.adresse?.pays || "RDC",
      province: profile?.adresse?.province || "",
      ville: profile?.adresse?.ville || "",
      commune: profile?.adresse?.commune || "",
      quartier: profile?.adresse?.quartier || "",
      avenue: profile?.adresse?.avenue || "",
      numero: profile?.adresse?.numero || ""
    }
  });

  const onSubmit = (addressData: any) => {
    onUpdate({ ...profile, adresse: { ...addressData } });
  };

  return (
    <div className="bg-secondary/50 border-2 border-border rounded-[1.5rem] md:rounded-[2.5rem] p-5 md:p-10 relative overflow-hidden group transition-all duration-500 hover:border-primary/40 shadow-2xl">
      
      {/* BACKGROUND TECH : S'efface sur mobile pour la clarté */}
      <div className="absolute top-0 right-0 p-8 opacity-[0.02] md:opacity-[0.05] pointer-events-none group-hover:opacity-[0.1] transition-all duration-1000 hidden xs:block">
        <Globe className="w-32 h-32 md:w-64 md:h-64 text-primary rotate-12" />
      </div>

      {/* HEADER : Adaptatif */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 md:mb-12 relative z-10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-background border-2 border-primary/20 rounded-xl shadow-inner shrink-0">
            <MapPin className="text-primary w-5 h-5 md:w-7 md:h-7" />
          </div>
          <div className="min-w-0">
            <h2 className="text-[clamp(1.1rem,5vw,1.8rem)] font-display font-black uppercase italic tracking-tighter text-foreground leading-none truncate">
              POINT_DE_<span className="text-primary">LIVRAISON</span>
            </h2>
            <div className="flex items-center gap-2 mt-1.5">
               <Activity size={10} className="text-primary animate-pulse" />
               <p className="font-tech text-[7px] md:text-[9px] text-muted-foreground uppercase tracking-[0.2em] italic">NODE_ACTIVE_STATION</p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 md:space-y-10 relative z-10">
        
        {/* GRILLE 1 : PAYS / PROVINCE / VILLE */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          <div className="space-y-2">
            <label className="font-tech text-[8px] md:text-[9px] text-muted-foreground/50 font-bold uppercase ml-1 tracking-widest italic truncate block">_Pays</label>
            <Input {...register("pays")} className="bg-background border-2 border-border font-tech font-black uppercase text-xs h-12 md:h-14 rounded-xl focus-visible:border-primary transition-all" />
          </div>
          <div className="space-y-2">
            <label className="font-tech text-[8px] md:text-[9px] text-muted-foreground/50 font-bold uppercase ml-1 tracking-widest italic truncate block">_Province</label>
            <Input {...register("province")} className="bg-background border-2 border-border font-tech font-black uppercase text-xs h-12 md:h-14 rounded-xl focus-visible:border-primary transition-all" />
          </div>
          <div className="space-y-2">
            <label className="font-tech text-[8px] md:text-[9px] text-primary font-black uppercase ml-1 tracking-widest italic block">_Ville_Nœud</label>
            <div className="relative">
              <Input {...register("ville")} className="bg-primary/5 border-2 border-primary font-display italic font-black text-primary text-sm md:text-base h-12 md:h-14 rounded-xl focus-visible:ring-0" />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-primary rounded-full animate-ping" />
            </div>
          </div>
        </div>

        {/* GRILLE 2 : COMMUNE / QUARTIER / NUMÉRO */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <div className="col-span-2 md:col-span-2 space-y-2">
             <label className="font-tech text-[8px] md:text-[9px] text-muted-foreground/50 font-bold uppercase ml-1 tracking-widest italic truncate block">_Commune_Secteur</label>
             <Input {...register("commune")} className="bg-background border-2 border-border font-tech font-black uppercase text-xs h-12 md:h-14 rounded-xl" />
          </div>
          <div className="col-span-1 space-y-2">
             <label className="font-tech text-[8px] md:text-[9px] text-muted-foreground/50 font-bold uppercase ml-1 tracking-widest italic truncate block">_Quartier</label>
             <Input {...register("quartier")} className="bg-background border-2 border-border font-tech font-black uppercase text-xs h-12 md:h-14 rounded-xl" />
          </div>
          <div className="col-span-1 space-y-2">
             <label className="font-tech text-[8px] md:text-[9px] text-muted-foreground/50 font-bold uppercase ml-1 tracking-widest italic truncate block">_Numéro_ID</label>
             <Input {...register("numero")} className="bg-background border-2 border-border font-tech font-black uppercase text-xs h-12 md:h-14 rounded-xl text-center" />
          </div>
        </div>
        
        {/* BOUTON D'ACTION : Texte adaptatif intelligent */}
        <Button 
          disabled={loading} 
          type="submit" 
          className="w-full bg-primary text-primary-foreground font-display font-black italic uppercase h-16 md:h-20 rounded-xl md:rounded-2xl hover:scale-[1.01] active:scale-95 transition-all shadow-glow-primary group/btn"
        >
          {loading ? (
            <Loader2 className="animate-spin w-6 h-6" />
          ) : (
            <div className="flex items-center gap-3">
              <Navigation className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              <span className="text-[10px] md:text-sm tracking-[0.2em] md:tracking-[0.4em]">
                {/* Switch de texte responsive */}
                <span className="xs:hidden">ACTUALISER</span>
                <span className="hidden xs:inline">ACTUALISER_LA_POSITION</span>
              </span>
            </div>
          )}
        </Button>
      </form>

      {/* FOOTER SYSTÈME : Devient invisible si trop petit */}
      <div className="mt-8 pt-4 border-t border-border flex items-center justify-between opacity-20">
       
        <div className="hidden sm:flex gap-2">
           <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
           <div className="w-1.5 h-1.5 rounded-full bg-primary/20" />
        </div>
        <span className="font-tech text-[6px] md:text-[8px] uppercase tracking-widest italic">version 1.0.0</span>
      </div>
    </div>
  );
}