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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-12 animate-in fade-in slide-in-from-top-4 duration-500">
      
      {/* MODULE AVATAR : STUDIO DIGITAL */}
      <div className="relative flex flex-col items-center gap-8 pb-12 border-b-2 border-border">
        <div className="absolute top-0 left-0 opacity-[0.05] pointer-events-none">
          <Fingerprint className="w-28 h-28 text-primary" />
        </div>

        <div className="relative group">
          {/* Bordure de scanneur active */}
          <div className="absolute -inset-2 bg-gradient-to-tr from-primary/30 via-transparent to-primary/30 rounded-[3rem] opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-700" />
          
          <div className="relative w-44 h-44 rounded-[2.5rem] bg-background border-2 border-border flex items-center justify-center overflow-hidden transition-all duration-500 group-hover:border-primary/50 shadow-2xl">
            {preview ? (
              <img src={preview} alt="Avatar" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            ) : (
              <div className="flex flex-col items-center gap-3">
                <User className="w-20 h-20 text-muted-foreground/20 group-hover:text-primary/30 transition-colors" />
                <span className="font-tech text-[8px] text-muted-foreground/30 tracking-[0.5em] uppercase font-black">NO_SIGNAL</span>
              </div>
            )}
            
            {/* Effet de Scan Horizontal */}
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
              <div className="w-full h-[2px] bg-primary/50 shadow-[0_0_15px_rgba(var(--primary),0.8)] animate-[scan_2s_linear_infinite]" />
            </div>
          </div>
          
          <label className="absolute -bottom-4 -right-4 bg-primary text-primary-foreground p-5 rounded-2xl cursor-pointer hover:bg-primary/90 hover:scale-110 active:scale-95 transition-all shadow-xl border-4 border-secondary z-20">
            <Camera className="w-6 h-6" />
            <input type="file" className="hidden" onChange={handleFile} accept="image/*" />
          </label>
        </div>

        <div className="text-center space-y-2">
          <p className="font-tech text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground/60">ID_Visuelle_Synchronisée</p>
          <div className="h-1 w-12 bg-primary/20 mx-auto rounded-full" />
        </div>
      </div>

      {/* GRILLE DE DONNÉES : HAUT CONTRASTE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* PRÉNOM */}
        <div className="space-y-3 group">
          <label className="font-tech text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground group-focus-within:text-primary transition-colors ml-1">Prénom_Entité</label>
          <Input 
            {...register("prenom")} 
            className="bg-background border-2 border-border h-16 font-display italic text-xl uppercase tracking-tighter focus-visible:border-primary text-foreground transition-all rounded-xl px-6" 
          />
        </div>
        
        {/* NOM */}
        <div className="space-y-3 group">
          <label className="font-tech text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground group-focus-within:text-primary transition-colors ml-1">Nom_Famille</label>
          <Input 
            {...register("nom")} 
            className="bg-background border-2 border-border h-16 font-display italic text-xl uppercase tracking-tighter focus-visible:border-primary text-foreground transition-all rounded-xl px-6" 
          />
        </div>
        
        {/* GENRE */}
        <div className="space-y-3 group">
          <label className="font-tech text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground group-focus-within:text-primary transition-colors ml-1">Attribut_Genre</label>
          <Select onValueChange={(v) => setValue("sexe", v)} defaultValue={watch("sexe")}>
            <SelectTrigger className="bg-background border-2 border-border h-16 font-tech font-black uppercase tracking-widest focus:border-primary text-foreground transition-all rounded-xl px-6">
              <SelectValue placeholder="SÉLECTIONNER" />
            </SelectTrigger>
            <SelectContent className="bg-secondary border-2 border-border text-foreground rounded-xl">
              <SelectItem value="M" className="font-tech py-4 focus:bg-primary focus:text-primary-foreground">MASCULIN // M</SelectItem>
              <SelectItem value="F" className="font-tech py-4 focus:bg-primary focus:text-primary-foreground">FÉMININ // F</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* CONTACT WHATSAPP (Priorité Bunia) */}
        <div className="space-y-3 group">
          <label className="font-tech text-[10px] font-black uppercase tracking-[0.3em] text-primary/80 ml-1 italic">Canal_Communication_WhatsApp</label>
          <div className="relative">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 p-2 bg-primary/10 rounded-lg">
              <Phone className="w-4 h-4 text-primary" />
            </div>
            <Input 
              {...register("numero_tel")} 
              placeholder="+243..."
              className="bg-primary/5 border-2 border-primary/40 h-16 pl-16 font-tech font-black text-lg focus-visible:border-primary text-primary transition-all rounded-xl tracking-[0.15em]" 
            />
          </div>
        </div>
      </div>

      {/* VALIDATION FINALE : LE SCEAU */}
      <div className="pt-8">
        <Button 
          disabled={loading} 
          type="submit"
          className="w-full h-24 bg-primary text-primary-foreground font-display font-black italic text-base tracking-[0.5em] rounded-[1.5rem] hover:bg-primary/90 shadow-2xl transition-all duration-300 active:scale-[0.98] group relative overflow-hidden"
        >
          {loading ? (
            <Loader2 className="animate-spin w-8 h-8" />
          ) : (
            <div className="flex items-center gap-5">
              <CheckCircle2 className="w-6 h-6 transition-transform group-hover:scale-125" />
              <span>SCELLER_L'IDENTITÉ_SÉCURISÉE</span>
            </div>
          )}
          
          {/* Effet de balayage vertical au survol */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent -translate-y-full group-hover:animate-[scan-vertical_2s_linear_infinite] pointer-events-none" />
        </Button>
      </div>
      
      <style>{`
        @keyframes scan {
          0% { transform: translateY(-100px); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(100px); opacity: 0; }
        }
        @keyframes scan-vertical {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
      `}</style>
    </form>
  );
}