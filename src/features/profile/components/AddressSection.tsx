import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Save, Loader2, Globe, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";

export function AddressSection({ profile, onUpdate, loading }: any) {
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

  const onSubmit = (addressData: any) => {
    // Structure alignée sur le schéma AgriConnect
    onUpdate({ ...profile, adresse: { ...addressData } });
  };

  return (
    <div className="bg-[#050505] border border-white/5 rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden group transition-all duration-700 hover:border-emerald-500/20 shadow-2xl">
      
      {/* EFFET DE FOND TECH */}
      <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity duration-1000">
        <Globe className="w-40 h-40 text-emerald-500 rotate-12" />
      </div>

      {/* HEADER DE SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 relative z-10">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 group-hover:scale-110 transition-transform duration-500">
            <MapPin className="text-emerald-500 w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-display font-black uppercase italic tracking-tighter text-white">
              Point de <span className="text-emerald-500">Livraison</span>
            </h2>
            <p className="font-tech text-[9px] text-white/20 uppercase tracking-[0.3em] mt-1">Nœud logistique actif</p>
          </div>
        </div>
        
        <div className="hidden md:block h-[1px] flex-1 bg-gradient-to-r from-emerald-500/20 to-transparent mx-8 opacity-20" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 relative z-10">
        
        {/* GRILLE PRIMAIRE : LOCALISATION MACRO */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="font-tech text-[8px] text-white/30 uppercase ml-2 tracking-widest italic">_Pays</label>
            <Input {...register("pays")} className="bg-white/[0.02] border-white/5 font-tech font-bold uppercase text-[11px] h-14 rounded-2xl focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500/30" />
          </div>
          <div className="space-y-2">
            <label className="font-tech text-[8px] text-white/30 uppercase ml-2 tracking-widest italic">_Province</label>
            <Input {...register("province")} className="bg-white/[0.02] border-white/5 font-tech font-bold uppercase text-[11px] h-14 rounded-2xl focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500/30" />
          </div>
          <div className="space-y-2">
            <label className="font-tech text-[8px] text-emerald-500/50 uppercase ml-2 tracking-widest italic">_Ville_Nœud</label>
            <Input {...register("ville")} className="bg-emerald-500/[0.03] border-emerald-500/20 font-display italic font-black text-emerald-500 text-[13px] h-14 rounded-2xl focus-visible:ring-emerald-500/40" />
          </div>
        </div>

        {/* GRILLE SECONDAIRE : MICRO LOCALISATION */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="col-span-2 space-y-2">
             <label className="font-tech text-[8px] text-white/30 uppercase ml-2 tracking-widest italic">_Commune_Secteur</label>
             <Input {...register("commune")} className="bg-white/[0.02] border-white/5 font-tech font-bold uppercase text-[11px] h-14 rounded-2xl" />
          </div>
          <div className="space-y-2">
             <label className="font-tech text-[8px] text-white/30 uppercase ml-2 tracking-widest italic">_Quartier</label>
             <Input {...register("quartier")} className="bg-white/[0.02] border-white/5 font-tech font-bold uppercase text-[11px] h-14 rounded-2xl" />
          </div>
          <div className="space-y-2">
             <label className="font-tech text-[8px] text-white/30 uppercase ml-2 tracking-widest italic">_Numéro_ID</label>
             <Input {...register("numero")} className="bg-white/[0.02] border-white/5 font-tech font-bold uppercase text-[11px] h-14 rounded-2xl text-center" />
          </div>
        </div>
        
        {/* BOUTON D'ACTION TYPE "COMMAND CENTER" */}
        <Button 
          disabled={loading} 
          type="submit" 
          className="w-full bg-emerald-500 text-black font-display font-black italic uppercase tracking-[0.2em] h-16 rounded-2xl hover:bg-emerald-400 hover:shadow-[0_15px_30px_rgba(16,185,129,0.2)] transition-all duration-500 group/btn"
        >
          {loading ? (
            <Loader2 className="animate-spin w-5 h-5" />
          ) : (
            <div className="flex items-center gap-3">
              <Navigation className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
              <span>ACTUALISER LA POSITION</span>
            </div>
          )}
        </Button>
      </form>

      {/* FOOTER SYSTÈME */}
      <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between opacity-30 group-hover:opacity-60 transition-opacity">
        <span className="font-tech text-[7px] uppercase tracking-[0.5em]">Network_AgriConnect_Secure</span>
        <span className="font-tech text-[7px] uppercase tracking-[0.5em]">RDC_2026</span>
      </div>
    </div>
  );
}