import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Navigation, MapPin } from "lucide-react";
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
      loading: 'Chiffrement des coordonnées GPS...',
      success: 'Matrice de localisation synchronisée.',
      error: 'Échec de la liaison satellite.',
    });
  };

  // Label ajusté pour une lisibilité maximale
  const Label = ({ children, highlighted = false }: { children: React.ReactNode, highlighted?: boolean }) => (
    <label className={cn(
      "font-tech text-[10px] uppercase tracking-[0.25em] ml-1 mb-2 block",
      highlighted ? "text-primary font-black italic" : "text-muted-foreground/80 font-bold"
    )}>
      {children}
    </label>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
      
      {/* SECTION HEADER : POSITIONNEMENT NÉGATIF */}
      <div className="flex items-center gap-5 mb-4">
        <div className="p-4 bg-background border-2 border-primary/30 rounded-2xl shadow-lg">
          <MapPin className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="font-display text-2xl text-foreground uppercase italic tracking-tighter leading-none">Géo-Localisation</h3>
          <p className="font-tech text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Point_Accès_Logistique</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* PAYS */}
        <div className="group space-y-1">
          <Label>Pays_Origine</Label>
          <Input 
            {...register("pays")} 
            className="bg-background border-2 border-border h-14 font-tech font-black text-foreground focus-visible:border-primary transition-all rounded-xl uppercase tracking-widest" 
          />
        </div>

        {/* PROVINCE */}
        <div className="group space-y-1">
          <Label>Province_Région</Label>
          <Input 
            {...register("province")} 
            className="bg-background border-2 border-border h-14 font-tech font-black text-foreground focus-visible:border-primary transition-all rounded-xl uppercase tracking-widest" 
          />
        </div>

        {/* VILLE / TERRITOIRE (HUB CRITIQUE) */}
        <div className="group space-y-1">
          <Label highlighted>Ville_Territoire_Hub</Label>
          <div className="relative">
            <Input 
              {...register("ville")} 
              placeholder="EX: BUNIA" 
              className="bg-primary/5 border-2 border-primary h-14 font-display italic font-black text-primary placeholder:text-primary/20 focus-visible:ring-0 focus-visible:border-primary transition-all rounded-xl uppercase tracking-tighter text-xl" 
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-success rounded-full animate-pulse shadow-[0_0_10px_hsl(var(--success))]" />
          </div>
        </div>

        {/* COMMUNE */}
        <div className="group space-y-1">
          <Label>Commune_Secteur</Label>
          <Input 
            {...register("commune")} 
            className="bg-background border-2 border-border h-14 font-tech font-bold text-foreground focus-visible:border-primary transition-all rounded-xl uppercase" 
          />
        </div>

        {/* QUARTIER */}
        <div className="group space-y-1">
          <Label>Quartier_Groupement</Label>
          <Input 
            {...register("quartier")} 
            className="bg-background border-2 border-border h-14 font-tech font-bold text-foreground focus-visible:border-primary transition-all rounded-xl uppercase" 
          />
        </div>

        {/* AVENUE */}
        <div className="group space-y-1">
          <Label>Avenue_Village</Label>
          <Input 
            {...register("avenue")} 
            className="bg-background border-2 border-border h-14 font-tech font-bold text-foreground focus-visible:border-primary transition-all rounded-xl uppercase" 
          />
        </div>

        {/* N° / CELLULE */}
        <div className="group space-y-1 lg:col-span-1">
          <Label>ID_Parcelle_Cellule</Label>
          <Input 
            {...register("numero")} 
            className="bg-background border-2 border-border h-14 font-tech font-bold text-foreground focus-visible:border-primary transition-all rounded-xl uppercase" 
          />
        </div>
      </div>

      {/* BOUTON D'ACTION - MASSIF ET VISIBLE */}
      <div className="pt-8">
        <Button 
          disabled={loading} 
          type="submit"
          className="w-full h-24 bg-primary text-primary-foreground font-display italic text-base tracking-[0.4em] rounded-[1.5rem] hover:bg-primary/90 hover:scale-[1.01] transition-all duration-300 active:scale-[0.98] group relative overflow-hidden shadow-2xl"
        >
          {loading ? (
            <Loader2 className="w-8 h-8 animate-spin" />
          ) : (
            <div className="flex items-center justify-center gap-6">
              <Navigation className="w-6 h-6 transition-transform group-hover:rotate-12" />
              <span className="font-black">SYNCHRONISER_COORDONNÉES</span>
            </div>
          )}
          
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </Button>
      </div>
    </form>
  );
}