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
      numero: profile?.adresse?.numero || "",
    },
  });

  const onSubmit = async (data: any) => {
    const promise = onUpdate({ ...profile, adresse: { ...data } });
    toast.promise(promise, {
      loading: "Cryptage des coordonnées...",
      success: "Matrice de localisation à jour.",
      error: "Erreur de liaison satellite.",
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full space-y-6 md:space-y-10 animate-in fade-in zoom-in-95 duration-500"
    >
      {/* HEADER AVEC DÉGRADÉ */}
      <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-white/[0.02] to-black/40 border border-white/10 rounded-[1.5rem] md:rounded-[2rem] backdrop-blur-sm">
        <div className="p-3 bg-gradient-to-br from-primary/20 to-transparent rounded-xl border border-primary/30 shrink-0 shadow-md">
          <MapPin className="w-5 h-5 md:w-6 md:h-6 text-primary drop-shadow-[0_0_4px_rgba(var(--primary),0.5)]" />
        </div>
        <div className="min-w-0">
          <h3 className="font-display text-[clamp(1.2rem,4vw,1.8rem)] text-white uppercase italic tracking-tighter leading-none truncate">
            Géo Localisation
          </h3>
          <p className="font-tech text-[clamp(7px,1.5vw,9px)] text-white/40 uppercase tracking-[0.3em] mt-1 italic">
            Hub Logistique Terminal
          </p>
        </div>
      </div>

      {/* GRILLE RESPONSIVE */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {/* VILLE - prend 2 colonnes sur tablette/desktop */}
        <div className="sm:col-span-2 space-y-2 group">
          <label className="font-tech text-[9px] uppercase tracking-widest text-primary font-black italic ml-1">
            Ville Territoire Hub
          </label>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50" />
            <Input
              {...register("ville")}
              placeholder="EX: BUNIA"
              className="bg-white/[0.02] border-2 border-white/10 text-white h-14 md:h-16 font-display italic font-black text-xl pl-12 rounded-2xl uppercase tracking-tighter focus-visible:ring-1 focus-visible:ring-primary/50 focus-visible:border-primary/50"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1">
              {[1, 2].map((i) => (
                <div key={i} className="w-1 h-1 bg-primary rounded-full animate-pulse" />
              ))}
            </div>
          </div>
        </div>

        {/* AUTRES CHAMPS */}
        {[
          { id: "province", label: "Province", placeholder: "ITURI" },
          { id: "commune", label: "Commune", placeholder: "MBUNYA" },
          { id: "quartier", label: "Quartier", placeholder: "LUMUMBA" },
          { id: "avenue", label: "Avenue", placeholder: "DE L'ÉCOLE" },
          { id: "numero", label: "Numéro Parcelle", placeholder: "04" },
        ].map((field) => (
          <div key={field.id} className="space-y-2">
            <label className="font-tech text-[8px] md:text-[9px] uppercase tracking-[0.2em] text-white/40 font-bold ml-1 italic truncate block">
              {field.label}
            </label>
            <Input
              {...register(field.id as any)}
              placeholder={field.placeholder}
              className="bg-white/[0.02] border-2 border-white/10 text-white h-12 md:h-14 font-tech font-bold rounded-xl uppercase tracking-wider focus-visible:border-primary/50 focus-visible:ring-1 focus-visible:ring-primary/30 transition-all"
            />
          </div>
        ))}
      </div>

      {/* BOUTON DE SYNCHRONISATION AVEC DÉGRADÉ */}
      <div className="pt-4">
        <Button
          disabled={loading}
          type="submit"
          className="w-full h-16 md:h-20 bg-gradient-to-r from-primary to-orange-400 text-black font-display italic rounded-[1.2rem] md:rounded-[1.8rem] hover:scale-[1.01] active:scale-[0.98] transition-all group relative overflow-hidden shadow-lg shadow-primary/30"
        >
          {loading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <div className="flex items-center justify-center gap-3">
              <Navigation className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span className="font-black text-sm md:text-base tracking-[0.2em] md:tracking-[0.4em]">
                <span className="inline sm:hidden">SYNCHRONISER</span>
                <span className="hidden sm:inline">SYNCHRONISER COORDONNÉES</span>
              </span>
            </div>
          )}
        </Button>
      </div>
    </form>
  );
}