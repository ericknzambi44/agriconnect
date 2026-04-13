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

  // Petit Helper pour les labels stylisés
  const Label = ({ children, emerald = false }: { children: React.ReactNode, emerald?: boolean }) => (
    <label className={cn(
      "font-tech text-[9px] uppercase tracking-[0.3em] ml-1 mb-2 block transition-colors duration-500",
      emerald ? "text-emerald-500 font-black italic" : "text-white/20 group-focus-within:text-emerald-500/50"
    )}>
      {children}
    </label>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* SECTION HEADER : INFO DE POSITION */}
      <div className="flex items-center gap-4 mb-2">
        <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
          <MapPin className="w-5 h-5 text-emerald-500" />
        </div>
        <div>
          <h3 className="font-display text-xl text-white uppercase italic tracking-tighter">Géo-Localisation</h3>
          <p className="font-tech text-[9px] text-white/30 uppercase tracking-widest italic">Définition du point nodal de l'entité</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
        
        {/* PAYS */}
        <div className="group space-y-1">
          <Label>Pays_Origine</Label>
          <Input 
            {...register("pays")} 
            className="bg-[#0A0A0A] border-white/5 h-14 font-tech font-bold text-white/80 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500/40 transition-all rounded-2xl uppercase tracking-widest shadow-inner" 
          />
        </div>

        {/* PROVINCE */}
        <div className="group space-y-1">
          <Label>Province_Région</Label>
          <Input 
            {...register("province")} 
            className="bg-[#0A0A0A] border-white/5 h-14 font-tech font-bold text-white/80 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500/40 transition-all rounded-2xl uppercase tracking-widest shadow-inner" 
          />
        </div>

        {/* VILLE / TERRITOIRE (Le point critique) */}
        <div className="group space-y-1 lg:col-span-1">
          <Label emerald>Ville_Territoire_Hub</Label>
          <div className="relative">
            <Input 
              {...register("ville")} 
              placeholder="EX: BUNIA / BENI" 
              className="bg-emerald-500/[0.03] border-emerald-500/30 h-14 font-display italic font-black text-emerald-500 placeholder:text-emerald-500/10 focus-visible:ring-emerald-500/40 focus-visible:border-emerald-500 transition-all rounded-2xl uppercase tracking-tighter text-lg" 
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
          </div>
        </div>

        {/* COMMUNE / SECTEUR */}
        <div className="group space-y-1">
          <Label>Commune_Secteur</Label>
          <Input 
            {...register("commune")} 
            className="bg-[#0A0A0A] border-white/5 h-14 font-tech font-bold text-white/70 focus-visible:ring-emerald-500/20 rounded-2xl uppercase shadow-inner transition-all group-hover:border-white/10" 
          />
        </div>

        {/* QUARTIER / GROUPEMENT */}
        <div className="group space-y-1">
          <Label>Quartier_Groupement</Label>
          <Input 
            {...register("quartier")} 
            className="bg-[#0A0A0A] border-white/5 h-14 font-tech font-bold text-white/70 focus-visible:ring-emerald-500/20 rounded-2xl uppercase shadow-inner transition-all group-hover:border-white/10" 
          />
        </div>

        {/* AVENUE / VILLAGE */}
        <div className="group space-y-1">
          <Label>Avenue_Village</Label>
          <Input 
            {...register("avenue")} 
            className="bg-[#0A0A0A] border-white/5 h-14 font-tech font-bold text-white/70 focus-visible:ring-emerald-500/20 rounded-2xl uppercase shadow-inner transition-all group-hover:border-white/10" 
          />
        </div>

        {/* N° / CELLULE */}
        <div className="group space-y-1 md:col-span-2 lg:col-span-1">
          <Label>ID_Parcelle_Cellule</Label>
          <Input 
            {...register("numero")} 
            className="bg-[#0A0A0A] border-white/5 h-14 font-tech font-bold text-white/70 focus-visible:ring-emerald-500/20 rounded-2xl uppercase shadow-inner transition-all group-hover:border-white/10" 
          />
        </div>
      </div>

      {/* BOUTON D'ACTION - LOOK INDUSTRIEL */}
      <div className="pt-6">
        <Button 
          disabled={loading} 
          type="submit"
          className="w-full h-20 bg-emerald-500 text-black font-display italic text-sm tracking-[0.4em] rounded-[2rem] hover:bg-emerald-400 hover:shadow-[0_25px_50px_rgba(16,185,129,0.2)] transition-all duration-500 active:scale-[0.97] group relative overflow-hidden"
        >
          {loading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <div className="flex items-center justify-center gap-4">
              <Navigation className="w-5 h-5 transition-transform group-hover:rotate-12 group-hover:scale-110" />
              <span>SYNCHRONISER LA POSITION</span>
            </div>
          )}
          
          {/* Effet de brillance au survol */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
        </Button>
      </div>
    </form>
  );
}