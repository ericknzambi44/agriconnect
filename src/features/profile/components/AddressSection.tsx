// src/features/profile/components/AddressSection.tsx
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Save, Loader2 } from "lucide-react";

export function AddressSection({ profile, onUpdate, loading }: any) {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      pays: profile?.adresse?.pays,
      province: profile?.adresse?.province,
      ville: profile?.adresse?.ville,
      commune: profile?.adresse?.commune,
      quartier: profile?.adresse?.quartier,
      avenue: profile?.adresse?.avenue,
      numero: profile?.adresse?.numero
    }
  });

  const onSubmit = (addressData: any) => {
    // On conserve les infos d'identité et on met à jour l'adresse
    onUpdate({ ...profile, ...addressData });
  };

  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 space-y-6 group">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-accent/10 rounded-lg group-hover:bg-accent/20 transition-colors">
          <MapPin className="text-accent w-5 h-5" />
        </div>
        <h2 className="text-xl font-black uppercase italic tracking-tighter">Coordonnées de Livraison</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Input {...register("pays")} placeholder="PAYS" className="bg-white/5 border-white/10 font-bold uppercase text-[10px] h-11" />
          <Input {...register("province")} placeholder="PROVINCE" className="bg-white/5 border-white/10 font-bold uppercase text-[10px] h-11" />
          <Input {...register("ville")} placeholder="VILLE" className="bg-white/5 border-white/10 font-bold uppercase text-[10px] h-11" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Input {...register("commune")} placeholder="COMMUNE" className="col-span-2 bg-white/5 border-white/10 font-bold uppercase text-[10px] h-11" />
          <Input {...register("numero")} placeholder="N°" className="bg-white/5 border-white/10 font-bold uppercase text-[10px] h-11" />
        </div>
        
        <Button disabled={loading} type="submit" variant="outline" className="w-full border-accent/30 text-accent font-black uppercase italic h-11 hover:bg-accent hover:text-black">
          {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "ACTUALISER LA POSITION"}
        </Button>
      </form>
    </div>
  );
}