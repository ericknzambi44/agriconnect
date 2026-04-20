import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Globe, Loader2, Navigation } from "lucide-react";
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
    <div className="bg-secondary border-2 border-border rounded-[2rem] p-8 md:p-10 relative overflow-hidden group transition-all duration-500 hover:border-primary/30 shadow-xl">
      
      {/* EFFET DE FOND TECH - Discret et pro */}
      <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none group-hover:opacity-[0.07] transition-opacity duration-1000">
        <Globe className="w-48 h-48 text-primary rotate-12" />
      </div>

      {/* HEADER DE SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 relative z-10">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-background border-2 border-primary/20 rounded-2xl group-hover:scale-105 transition-transform duration-500 shadow-inner">
            <MapPin className="text-primary w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-display font-black uppercase italic tracking-tighter text-foreground leading-none">
              Point de <span className="text-primary text-glow-primary">Livraison</span>
            </h2>
            <p className="font-tech text-[10px] text-muted-foreground uppercase tracking-[0.3em] mt-2">Nœud_Logistique_Actif</p>
          </div>
        </div>
        
        <div className="hidden md:block h-[2px] flex-1 bg-gradient-to-r from-primary/20 to-transparent mx-10 opacity-30" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10 relative z-10">
        
        {/* GRILLE PRIMAIRE : LOCALISATION MACRO */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <label className="font-tech text-[9px] text-muted-foreground font-bold uppercase ml-2 tracking-widest italic">_Pays</label>
            <Input 
              {...register("pays")} 
              className="bg-background border-2 border-border font-tech font-black uppercase text-[11px] h-14 rounded-xl focus-visible:border-primary transition-all shadow-sm" 
            />
          </div>
          <div className="space-y-3">
            <label className="font-tech text-[9px] text-muted-foreground font-bold uppercase ml-2 tracking-widest italic">_Province</label>
            <Input 
              {...register("province")} 
              className="bg-background border-2 border-border font-tech font-black uppercase text-[11px] h-14 rounded-xl focus-visible:border-primary transition-all shadow-sm" 
            />
          </div>
          <div className="space-y-3">
            <label className="font-tech text-[9px] text-primary font-black uppercase ml-2 tracking-widest italic">_Ville_Nœud</label>
            <div className="relative">
              <Input 
                {...register("ville")} 
                className="bg-primary/5 border-2 border-primary font-display italic font-black text-primary text-base h-14 rounded-xl focus-visible:ring-0 shadow-[0_0_15px_rgba(var(--primary),0.05)]" 
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-success rounded-full animate-pulse shadow-[0_0_10px_hsl(var(--success))]" />
            </div>
          </div>
        </div>

        {/* GRILLE SECONDAIRE : MICRO LOCALISATION */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="col-span-2 space-y-3">
             <label className="font-tech text-[9px] text-muted-foreground font-bold uppercase ml-2 tracking-widest italic">_Commune_Secteur</label>
             <Input 
               {...register("commune")} 
               className="bg-background border-2 border-border font-tech font-black uppercase text-[11px] h-14 rounded-xl focus-visible:border-primary" 
             />
          </div>
          <div className="space-y-3">
             <label className="font-tech text-[9px] text-muted-foreground font-bold uppercase ml-2 tracking-widest italic">_Quartier</label>
             <Input 
               {...register("quartier")} 
               className="bg-background border-2 border-border font-tech font-black uppercase text-[11px] h-14 rounded-xl focus-visible:border-primary" 
             />
          </div>
          <div className="space-y-3">
             <label className="font-tech text-[9px] text-muted-foreground font-bold uppercase ml-2 tracking-widest italic">_Numéro_ID</label>
             <Input 
               {...register("numero")} 
               className="bg-background border-2 border-border font-tech font-black uppercase text-[11px] h-14 rounded-xl text-center focus-visible:border-primary" 
             />
          </div>
        </div>
        
        {/* BOUTON D'ACTION TYPE "COMMAND CENTER" */}
        <Button 
          disabled={loading} 
          type="submit" 
          className="w-full bg-primary text-primary-foreground font-display font-black italic uppercase tracking-[0.3em] h-20 rounded-2xl hover:bg-primary/90 hover:shadow-[0_10px_25px_rgba(var(--primary),0.2)] transition-all duration-300 group/btn active:scale-95 shadow-xl"
        >
          {loading ? (
            <Loader2 className="animate-spin w-6 h-6" />
          ) : (
            <div className="flex items-center gap-4">
              <Navigation className="w-5 h-5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
              <span className="text-sm">ACTUALISER_LA_POSITION</span>
            </div>
          )}
        </Button>
      </form>

      {/* FOOTER SYSTÈME */}
      <div className="mt-10 pt-6 border-t-2 border-border flex items-center justify-between opacity-30 group-hover:opacity-60 transition-all">
        <span className="font-tech text-[8px] uppercase tracking-[0.4em]">SYSTEM_NETWORK_SECURE</span>
        <div className="flex gap-4">
           <div className="w-2 h-2 rounded-full bg-primary/40" />
           <div className="w-2 h-2 rounded-full bg-primary/20" />
        </div>
        <span className="font-tech text-[8px] uppercase tracking-[0.4em]">BUNIA_DRC_2026</span>
      </div>
    </div>
  );
}