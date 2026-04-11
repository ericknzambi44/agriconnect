// src/features/profile/components/AddressForm.tsx
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Navigation } from "lucide-react";

export function AddressForm({ profile, onUpdate, loading }: any) {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      pays: profile?.adresse?.pays || "RDC",
      province: profile?.adresse?.province,
      ville: profile?.adresse?.ville, 
      commune: profile?.adresse?.commune, 
      quartier: profile?.adresse?.quartier, 
      avenue: profile?.adresse?.avenue, 
      numero: profile?.adresse?.numero
    }
  });

  const onSubmit = async (data: any) => {
    // On conserve la structure attendue par ton hook (adresse dans profile)
    const promise = onUpdate({ ...profile, adresse: { ...data } });
    
    toast.promise(promise, {
      loading: 'Cryptage des coordonnées...',
      success: 'Matrice de localisation synchronisée.',
      error: 'Échec de la liaison GPS.',
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        
        {/* PAYS */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-white/20 tracking-[0.2em] ml-1">Pays</label>
          <Input 
            {...register("pays")} 
            className="bg-white/[0.02] border-white/5 h-12 uppercase font-bold text-white/80 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500/30 transition-all" 
          />
        </div>

        {/* PROVINCE */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-white/20 tracking-[0.2em] ml-1">Province</label>
          <Input 
            {...register("province")} 
            className="bg-white/[0.02] border-white/5 h-12 uppercase font-bold text-white/80 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500/30 transition-all" 
          />
        </div>

        {/* VILLE / TERRITOIRE (Focus Émeraude) */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-emerald-500 tracking-[0.2em] italic ml-1">Ville / Territoire</label>
          <Input 
            {...register("ville")} 
            placeholder="Ex: BENI / LUBERO" 
            className="bg-emerald-500/5 border-emerald-500/20 h-12 uppercase font-black text-emerald-500 placeholder:text-emerald-500/20 focus-visible:ring-emerald-500/30 transition-all" 
          />
        </div>

        {/* COMMUNE / SECTEUR */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-white/20 tracking-[0.2em] italic ml-1">Commune / Secteur</label>
          <Input {...register("commune")} className="bg-white/[0.02] border-white/5 h-12 uppercase font-bold text-white/70 focus-visible:ring-emerald-500/20" />
        </div>

        {/* QUARTIER / GROUPEMENT */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-white/20 tracking-[0.2em] italic ml-1">Quartier / Groupement</label>
          <Input {...register("quartier")} className="bg-white/[0.02] border-white/5 h-12 uppercase font-bold text-white/70 focus-visible:ring-emerald-500/20" />
        </div>

        {/* AVENUE / VILLAGE */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-white/20 tracking-[0.2em] ml-1">Avenue / Village</label>
          <Input {...register("avenue")} className="bg-white/[0.02] border-white/5 h-12 uppercase font-bold text-white/70 focus-visible:ring-emerald-500/20" />
        </div>

        {/* N° / CELLULE */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-white/20 tracking-[0.2em] ml-1">N° / Cellule</label>
          <Input {...register("numero")} className="bg-white/[0.02] border-white/5 h-12 uppercase font-bold text-white/70 focus-visible:ring-emerald-500/20" />
        </div>
      </div>

      {/* BOUTON D'ACTION - Style "Sync" */}
      <Button 
        disabled={loading} 
        variant="outline" 
        className="w-full h-16 border-emerald-500/20 bg-emerald-500/5 text-emerald-500 hover:bg-emerald-500 hover:text-black font-black uppercase italic tracking-[0.3em] transition-all duration-500 rounded-2xl shadow-lg hover:shadow-emerald-500/20"
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin mr-3" />
        ) : (
          <Navigation className="w-4 h-4 mr-3" />
        )}
        {loading ? "SYNCHRONISATION..." : "METTRE À JOUR LA LOCALISATION"}
      </Button>
    </form>
  );
}