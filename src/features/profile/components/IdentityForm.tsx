import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Phone, CheckCircle2, Loader2, Camera, Fingerprint } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function IdentityForm({ profile, onUpdate, loading }: any) {
  const [preview, setPreview] = useState(profile?.avatar_url);
  
  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      nom: profile?.nom,
      post_nom: profile?.post_nom,
      prenom: profile?.prenom,
      numero_tel: profile?.numero_tel,
      sexe: profile?.sexe || "M",
      avatar_url: profile?.avatar_url
    }
  });

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPreview(base64);
        setValue("avatar_url", base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: any) => {
    const promise = onUpdate({ ...profile.adresse, ...data });
    
    toast.promise(promise, {
      loading: 'Chiffrement des données biométriques...',
      success: 'Matrice d\'identité synchronisée.',
      error: 'Échec de la liaison montante.',
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-12 animate-in fade-in slide-in-from-top-4 duration-1000">
      
      {/* MODULE AVATAR : STUDIO DIGITAL */}
      <div className="relative flex flex-col items-center gap-6 pb-10 border-b border-white/5">
        <div className="absolute top-0 left-0 opacity-[0.03] pointer-events-none">
          <Fingerprint className="w-24 h-24 text-emerald-500" />
        </div>

        <div className="relative group">
          {/* Bordure animée style Scanner */}
          <div className="absolute -inset-1.5 bg-gradient-to-tr from-emerald-500/20 via-transparent to-emerald-500/20 rounded-[3rem] opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-700" />
          
          <div className="relative w-40 h-40 rounded-[2.8rem] bg-[#0A0A0A] border border-white/10 flex items-center justify-center overflow-hidden transition-all duration-700 group-hover:border-emerald-500/50 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            {preview ? (
              <img src={preview} alt="Avatar" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 group-hover:rotate-2" />
            ) : (
              <div className="flex flex-col items-center gap-2">
                <User className="w-16 h-16 text-white/5 group-hover:text-emerald-500/20 transition-colors" />
                <span className="font-tech text-[7px] text-white/10 tracking-[0.4em] uppercase">No_Signal</span>
              </div>
            )}
            
            {/* Overlay au survol */}
            <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
              <div className="w-full h-[1px] bg-emerald-500/40 animate-[scan_2s_linear_infinite]" />
            </div>
          </div>
          
          <label className="absolute -bottom-3 -right-3 bg-emerald-500 text-black p-4 rounded-2xl cursor-pointer hover:bg-emerald-400 hover:scale-110 active:scale-90 transition-all shadow-[0_15px_30px_rgba(16,185,129,0.4)] border-4 border-[#080808] z-20">
            <Camera className="w-5 h-5" />
            <input type="file" className="hidden" onChange={handleFile} accept="image/*" />
          </label>
        </div>

        <div className="text-center space-y-1">
          <p className="font-tech text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Profil_Identité_Visuelle</p>
          <p className="font-tech text-[8px] text-emerald-500/40 uppercase tracking-widest">Format: 1:1 • JPEG/PNG</p>
        </div>
      </div>

      {/* GRILLE DE DONNÉES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
        
        {/* PRÉNOM */}
        <div className="space-y-3 group">
          <label className="font-tech text-[9px] font-black uppercase tracking-[0.3em] text-white/20 group-focus-within:text-emerald-500 transition-colors ml-1">Prénom_Entité</label>
          <Input 
            {...register("prenom")} 
            className="bg-white/[0.02] border-white/5 h-16 font-display italic text-lg uppercase tracking-tighter focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500/40 text-white transition-all rounded-2xl px-6" 
          />
        </div>
        
        {/* NOM */}
        <div className="space-y-3 group">
          <label className="font-tech text-[9px] font-black uppercase tracking-[0.3em] text-white/20 group-focus-within:text-emerald-500 transition-colors ml-1">Nom_Famille</label>
          <Input 
            {...register("nom")} 
            className="bg-white/[0.02] border-white/5 h-16 font-display italic text-lg uppercase tracking-tighter focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500/40 text-white transition-all rounded-2xl px-6" 
          />
        </div>
        
        {/* GENRE */}
        <div className="space-y-3 group">
          <label className="font-tech text-[9px] font-black uppercase tracking-[0.3em] text-white/20 group-focus-within:text-emerald-500 transition-colors ml-1">Attribut Genre</label>
          <Select onValueChange={(v) => setValue("sexe", v)} defaultValue={watch("sexe")}>
            <SelectTrigger className="bg-white/[0.02] border-white/5 h-16 font-tech font-bold uppercase tracking-widest focus:ring-emerald-500/20 text-white transition-all rounded-2xl px-6">
              <SelectValue placeholder="SÉLECTIONNER" />
            </SelectTrigger>
            <SelectContent className="bg-[#0f0f0f] border-white/10 text-white rounded-xl">
              <SelectItem value="M" className="font-tech py-3 focus:bg-emerald-500 focus:text-black rounded-lg">MASCULIN // M</SelectItem>
              <SelectItem value="F" className="font-tech py-3 focus:bg-emerald-500 focus:text-black rounded-lg">FÉMININ // F</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* CONTACT */}
        <div className="space-y-3 group">
          <label className="font-tech text-[9px] font-black uppercase tracking-[0.3em] text-emerald-500/60 ml-1 italic">Canal_Communication_WhatsApp</label>
          <div className="relative">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 p-1.5 bg-emerald-500/10 rounded-lg">
              <Phone className="w-4 h-4 text-emerald-500" />
            </div>
            <Input 
              {...register("numero_tel")} 
              className="bg-emerald-500/[0.03] border-emerald-500/20 h-16 pl-16 font-tech font-black text-lg focus-visible:ring-emerald-500/40 text-emerald-500 transition-all rounded-2xl tracking-widest" 
            />
          </div>
        </div>
      </div>

      {/* VALIDATION FINALE */}
      <div className="pt-6">
        <Button 
          disabled={loading} 
          type="submit"
          className="w-full h-20 bg-emerald-500 text-black font-display font-black italic text-sm tracking-[0.5em] rounded-[2.5rem] hover:bg-emerald-400 shadow-[0_20px_40px_rgba(16,185,129,0.25)] transition-all duration-500 active:scale-[0.96] group relative overflow-hidden"
        >
          {loading ? (
            <Loader2 className="animate-spin w-6 h-6" />
          ) : (
            <div className="flex items-center gap-4">
              <CheckCircle2 className="w-5 h-5 transition-transform group-hover:scale-125 group-hover:rotate-12" />
              <span>SCELLER LES MODIFICATIONS</span>
            </div>
          )}
          
          {/* Ligne de scanning horizontale */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent -translate-y-full group-hover:animate-[scan-vertical_2s_linear_infinite] pointer-events-none" />
        </Button>
      </div>
    </form>
  );
}