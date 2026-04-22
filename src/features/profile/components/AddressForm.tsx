import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Navigation, MapPin, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export function AddressForm({ profile, onUpdate, loading }: any) {
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

  const onSubmit = async (data: any) => {
    const promise = onUpdate({ ...profile, adresse: { ...data } });
    toast.promise(promise, {
      loading: 'Cryptage des coordonnées...',
      success: 'Matrice de localisation à jour.',
      error: 'Erreur de liaison satellite.',
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6 md:space-y-10 animate-in fade-in zoom-in-95 duration-500">
      
      {/* HEADER ADAPTATIF */}
      <div className="flex items-center gap-4 p-4 bg-secondary/50 border border-border/50 rounded-[1.5rem] md:rounded-[2rem]">
        <div className="p-3 bg-primary/10 rounded-xl border border-primary/20 shrink-0">
          <MapPin className="w-5 h-5 md:w-6 md:h-6 text-primary" />
        </div>
        <div className="min-w-0">
          <h3 className="font-display text-[clamp(1.2rem,4vw,1.8rem)] text-foreground uppercase italic tracking-tighter leading-none truncate">
            GÉO_LOCALISATION
          </h3>
          <p className="font-tech text-[clamp(7px,1.5vw,9px)] text-muted-foreground uppercase tracking-[0.3em] mt-1 italic opacity-60">HUB_LOGISTIQUE_TERMINAL</p>
        </div>
      </div>

      {/* GRILLE INTELLIGENTE : 1 col mobile, 2 col tablette, 3 col desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        
        {/* VILLE (LE HUB) - Prend 2 colonnes sur tablette/desktop pour l'importance */}
        <div className="sm:col-span-2 space-y-2 group">
          <label className="font-tech text-[9px] uppercase tracking-widest text-primary font-black italic ml-1">_Ville_Territoire_Hub</label>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/30" />
            <Input 
              {...register("ville")} 
              placeholder="EX: BUNIA" 
              className="bg-primary/5 border-2 border-primary h-14 md:h-16 font-display italic font-black text-primary text-xl pl-12 rounded-2xl uppercase tracking-tighter focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-primary/50" 
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1">
                {[1,2].map(i => <div key={i} className="w-1 h-1 bg-primary rounded-full animate-pulse" />)}
            </div>
          </div>
        </div>

        {/* CHAMPS STANDARDS AVEC LABELS ADAPTATIFS */}
        {[
          { id: "province", label: "Province", placeholder: "ITURI" },
          { id: "commune", label: "Commune", placeholder: "MBUNYA" },
          { id: "quartier", label: "Quartier", placeholder: "LUMUMBA" },
          { id: "avenue", label: "Avenue", placeholder: "DE L'ÉCOLE" },
          { id: "numero", label: "N°_Parcelle", placeholder: "04" },
        ].map((field) => (
          <div key={field.id} className="space-y-2">
            <label className="font-tech text-[8px] md:text-[9px] uppercase tracking-[0.2em] text-muted-foreground/50 font-bold ml-1 italic truncate block">
              _{field.label}
            </label>
            <Input 
              {...register(field.id as any)} 
              placeholder={field.placeholder}
              className="bg-background border-2 border-border h-12 md:h-14 font-tech font-bold text-foreground rounded-xl uppercase tracking-wider focus-visible:border-primary/50 transition-all" 
            />
          </div>
        ))}
      </div>

      {/* BOUTON DE SYNCHRO : TEXTE ADAPTATIF */}
      <div className="pt-4">
        <Button 
          disabled={loading} 
          type="submit"
          className="w-full h-16 md:h-20 bg-primary text-primary-foreground font-display italic rounded-[1.2rem] md:rounded-[1.8rem] hover:scale-[1.01] active:scale-[0.98] transition-all group relative overflow-hidden shadow-glow-primary"
        >
          {loading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <div className="flex items-center justify-center gap-3">
              <Navigation className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              {/* Texte long sur desktop, court sur mobile */}
              <span className="font-black text-sm md:text-base tracking-[0.2em] md:tracking-[0.4em]">
                <span className="inline sm:hidden">SYNCHRONISER</span>
                <span className="hidden sm:inline">SYNCHRONISER_COORDONNÉES</span>
              </span>
            </div>
          )}
        </Button>
      </div>
    </form>
  );
}