// src/features/profile/components/IdentityForm.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Phone, CheckCircle2, Loader2, Save, Camera } from "lucide-react";
import { toast } from "sonner";

export function IdentityForm({ profile, onUpdate, loading }: any) {
  // Gestion de l'état pour la prévisualisation de l'avatar en temps réel
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

  // Fonction pour convertir l'image locale en base64 pour un affichage immédiat
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPreview(base64);
        setValue("avatar_url", base64); // Met à jour les données du formulaire
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: any) => {
    // Fusionne avec l'adresse existante pour ne rien écraser côté hook
    const promise = onUpdate({ ...profile.adresse, ...data });
    
    toast.promise(promise, {
      loading: 'Cryptage et synchronisation...',
      success: 'Matrice d\'identité mise à jour avec succès.',
      error: 'Échec de la liaison de données.',
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 animate-in fade-in duration-500">
      
      {/* MODULE AVATAR INTERACTIF */}
      <div className="flex flex-col items-center gap-4 pb-6 border-b border-white/5">
        <div className="relative group">
          <div className="w-32 h-32 rounded-[2rem] bg-white/5 border-2 border-primary/20 flex items-center justify-center overflow-hidden group-hover:border-primary transition-all duration-500 shadow-[0_0_30px_rgba(34,197,94,0.05)]">
            {preview ? (
              <img src={preview} alt="Avatar du terminal" className="w-full h-full object-cover" />
            ) : (
              <User className="w-12 h-12 text-primary/20 group-hover:text-primary/50 transition-colors" />
            )}
          </div>
          
          <label className="absolute -bottom-2 -right-2 bg-primary text-black p-3 rounded-2xl cursor-pointer hover:scale-110 active:scale-95 transition-all shadow-[0_10px_20px_rgba(34,197,94,0.3)] border-2 border-[#0a0a0a]">
            <Camera className="w-4 h-4" />
            <input type="file" className="hidden" onChange={handleFile} accept="image/*" />
          </label>
        </div>
        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-foreground/30">Format: JPG, PNG • Max 2Mo</p>
      </div>

      {/* FORMULAIRE IDENTITÉ (Grille Elite) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-primary/60 ml-1">Prénom</label>
          <Input 
            {...register("prenom")} 
            className="bg-white/5 border-white/5 h-14 font-black uppercase focus:border-primary/50 text-white italic transition-all hover:bg-white/10" 
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-primary/60 ml-1">Nom & Post-nom</label>
          <Input 
            {...register("nom")} 
            className="bg-white/5 border-white/5 h-14 font-black uppercase focus:border-primary/50 text-white italic transition-all hover:bg-white/10" 
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-primary/60 ml-1">Sexe / Genre</label>
          <Select onValueChange={(v) => setValue("sexe", v)} defaultValue={watch("sexe")}>
            <SelectTrigger className="bg-white/5 border-white/5 h-14 font-black uppercase focus:border-primary/50 text-white italic hover:bg-white/10 transition-all">
              <SelectValue placeholder="SÉLECTIONNER" />
            </SelectTrigger>
            <SelectContent className="bg-[#0f0f0f] border-white/10 text-white">
              <SelectItem value="M" className="font-bold cursor-pointer focus:bg-primary/20">MASCULIN (M)</SelectItem>
              <SelectItem value="F" className="font-bold cursor-pointer focus:bg-primary/20">FÉMININ (F)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-primary/60 ml-1">Contact (WhatsApp/Tel)</label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            <Input 
              {...register("numero_tel")} 
              className="bg-white/5 border-white/5 h-14 pl-12 font-black uppercase focus:border-primary/50 text-white italic transition-all hover:bg-white/10" 
            />
          </div>
        </div>
      </div>

      <Button 
        disabled={loading} 
        type="submit"
        className="w-full bg-primary text-black font-black uppercase italic h-14 rounded-2xl hover:bg-primary/90 hover:shadow-[0_0_30px_rgba(34,197,94,0.3)] transition-all active:scale-[0.98] mt-4"
      >
        {loading ? (
          <Loader2 className="animate-spin mr-2 w-5 h-5" />
        ) : (
          <CheckCircle2 className="mr-2 w-5 h-5" />
        )}
        {loading ? "SYNCHRONISATION EN COURS..." : "VALIDER LES MODIFICATIONS"}
      </Button>
    </form>
  );
}