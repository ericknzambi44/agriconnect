// src/features/profile/components/IdentityForm.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Phone, CheckCircle2, Loader2, Camera } from "lucide-react";
import { toast } from "sonner";

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
      loading: 'Cryptage et synchronisation...',
      success: 'Matrice d\'identité mise à jour.',
      error: 'Échec de la liaison de données.',
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 animate-in fade-in duration-500">
      
      {/* MODULE AVATAR INTERACTIF - Style Cyber */}
      <div className="flex flex-col items-center gap-4 pb-6 border-b border-white/5">
        <div className="relative group">
          <div className="w-32 h-32 rounded-[2.5rem] bg-white/[0.02] border-2 border-white/5 flex items-center justify-center overflow-hidden group-hover:border-emerald-500/50 transition-all duration-500 shadow-2xl">
            {preview ? (
              <img src={preview} alt="Avatar" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            ) : (
              <User className="w-12 h-12 text-white/10 group-hover:text-emerald-500/40 transition-colors" />
            )}
            <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </div>
          
          <label className="absolute -bottom-2 -right-2 bg-emerald-500 text-black p-3 rounded-2xl cursor-pointer hover:scale-110 active:scale-95 transition-all shadow-[0_10px_20px_rgba(16,185,129,0.3)] border-2 border-[#050505]">
            <Camera className="w-4 h-4" />
            <input type="file" className="hidden" onChange={handleFile} accept="image/*" />
          </label>
        </div>
        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20">Protocole: JPG, PNG • Max 2Mo</p>
      </div>

      {/* FORMULAIRE IDENTITÉ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-emerald-500/60 ml-1">Prénom</label>
          <Input 
            {...register("prenom")} 
            className="bg-white/[0.03] border-white/5 h-14 font-black uppercase focus-visible:ring-emerald-500/30 text-white italic transition-all hover:bg-white/5" 
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-emerald-500/60 ml-1">Nom & Post-nom</label>
          <Input 
            {...register("nom")} 
            className="bg-white/[0.03] border-white/5 h-14 font-black uppercase focus-visible:ring-emerald-500/30 text-white italic transition-all hover:bg-white/5" 
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-emerald-500/60 ml-1">Sexe / Genre</label>
          <Select onValueChange={(v) => setValue("sexe", v)} defaultValue={watch("sexe")}>
            <SelectTrigger className="bg-white/[0.03] border-white/5 h-14 font-black uppercase focus:ring-emerald-500/30 text-white italic hover:bg-white/5 transition-all">
              <SelectValue placeholder="SÉLECTIONNER" />
            </SelectTrigger>
            <SelectContent className="bg-[#0a0a0a] border-white/10 text-white">
              <SelectItem value="M" className="font-bold cursor-pointer focus:bg-emerald-500/20 focus:text-emerald-400">MASCULIN (M)</SelectItem>
              <SelectItem value="F" className="font-bold cursor-pointer focus:bg-emerald-500/20 focus:text-emerald-400">FÉMININ (F)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-emerald-500/60 ml-1">Contact (WhatsApp/Tel)</label>
          <div className="relative group">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-emerald-500 transition-colors" />
            <Input 
              {...register("numero_tel")} 
              className="bg-white/[0.03] border-white/5 h-14 pl-12 font-black uppercase focus-visible:ring-emerald-500/30 text-white italic transition-all hover:bg-white/5" 
            />
          </div>
        </div>
      </div>

      {/* BOUTON DE VALIDATION ÉMERAUDE */}
      <Button 
        disabled={loading} 
        type="submit"
        className="w-full bg-emerald-500 text-black font-black uppercase italic h-16 rounded-[1.25rem] hover:bg-emerald-400 shadow-[0_15px_30px_rgba(16,185,129,0.2)] transition-all active:scale-[0.98] mt-4"
      >
        {loading ? (
          <Loader2 className="animate-spin mr-3 w-5 h-5" />
        ) : (
          <CheckCircle2 className="mr-3 w-5 h-5" />
        )}
        {loading ? "SYNCHRONISATION EN COURS..." : "VALIDER LES MODIFICATIONS"}
      </Button>
    </form>
  );
}