// src/features/profile/components/AddressForm.tsx
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Globe, Landmark, Navigation, Save } from "lucide-react";
import { toast } from "sonner";

export function AddressForm({ profile, onUpdate, loading }: any) {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      pays: profile?.adresse?.pays || "RDC",
      province: profile?.adresse?.province,
      ville: profile?.adresse?.ville, // Servira aussi de Territoire
      commune: profile?.adresse?.commune, // Servira aussi de Secteur/Chefferie
      quartier: profile?.adresse?.quartier, // Servira aussi de Groupement
      avenue: profile?.adresse?.avenue, // Servira aussi de Village
      numero: profile?.adresse?.numero
    }
  });

  const onSubmit = async (data: any) => {
    const promise = onUpdate({ ...profile, ...data });
    toast.promise(promise, {
      loading: 'Localisation en cours...',
      success: 'Coordonnées GPS synchronisées.',
      error: 'Erreur de géolocalisation.',
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-white/30 tracking-widest">Pays</label>
          <Input {...register("pays")} className="bg-white/5 border-white/10 uppercase font-bold" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-white/30 tracking-widest">Province</label>
          <Input {...register("province")} className="bg-white/5 border-white/10 uppercase font-bold" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-primary tracking-widest italic">Ville / Territoire</label>
          <Input {...register("ville")} placeholder="Ex: Beni / Lubero" className="bg-white/5 border-primary/20 uppercase font-bold" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-white/30 tracking-widest italic">Commune / Secteur</label>
          <Input {...register("commune")} className="bg-white/5 border-white/10 uppercase font-bold" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-white/30 tracking-widest italic">Quartier / Groupement</label>
          <Input {...register("quartier")} className="bg-white/5 border-white/10 uppercase font-bold" />
        </div>
        <div className="space-y-2 lg:col-span-1">
          <label className="text-[10px] font-black uppercase text-white/30 tracking-widest">Avenue / Village</label>
          <Input {...register("avenue")} className="bg-white/5 border-white/10 uppercase font-bold" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-white/30 tracking-widest">N° / Cellule</label>
          <Input {...register("numero")} className="bg-white/5 border-white/10 uppercase font-bold" />
        </div>
      </div>

      <Button disabled={loading} variant="outline" className="w-full border-primary/20 hover:bg-primary hover:text-black font-black uppercase italic">
        METTRE À JOUR LA LOCALISATION
      </Button>
    </form>
  );
}