import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Phone, CheckCircle2, Loader2, Camera, Fingerprint, Scan } from "lucide-react";
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
      loading: 'Chiffrement biométrique...',
      success: 'Identité synchronisée.',
      error: 'Échec de la liaison montante.',
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 md:space-y-12 animate-in fade-in slide-in-from-top-4 duration-500 pb-10">
      
      {/* MODULE AVATAR : S'adapte de 128px à 176px */}
      <div className="relative flex flex-col items-center gap-6 md:gap-8 pb-8 md:pb-12 border-b-2 border-border/50">
        <div className="absolute top-0 left-0 opacity-[0.03] md:opacity-[0.05] pointer-events-none">
          <Fingerprint className="w-20 h-20 md:w-28 md:h-28 text-primary" />
        </div>

        <div className="relative group">
          <div className="absolute -inset-2 bg-gradient-to-tr from-primary/30 via-transparent to-primary/30 rounded-[2rem] md:rounded-[3rem] opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-700" />
          
          <div className="relative w-32 h-32 md:w-44 md:h-44 rounded-[2rem] md:rounded-[2.5rem] bg-secondary border-2 border-border flex items-center justify-center overflow-hidden transition-all duration-500 group-hover:border-primary/50 shadow-2xl">
            {preview ? (
              <img src={preview} alt="Avatar" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            ) : (
              <div className="flex flex-col items-center gap-2">
                <User className="w-12 h-12 md:w-20 md:h-20 text-muted-foreground/20 group-hover:text-primary/30" />
                <span className="font-tech text-[6px] md:text-[8px] text-muted-foreground/30 tracking-[0.4em] uppercase font-black">NO_SIGNAL</span>
              </div>
            )}
            
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
              <div className="w-full h-[2px] bg-primary/50 shadow-glow-primary animate-[scan_2s_linear_infinite]" />
            </div>
          </div>
          
          <label className="absolute -bottom-2 -right-2 md:-bottom-4 md:-right-4 bg-primary text-primary-foreground p-3 md:p-5 rounded-xl md:rounded-2xl cursor-pointer hover:bg-primary/90 hover:scale-110 transition-all shadow-xl border-4 border-background z-20">
            <Camera className="w-5 h-5 md:w-6 md:h-6" />
            <input type="file" className="hidden" onChange={handleFile} accept="image/*" />
          </label>
        </div>

        <div className="text-center space-y-1">
          <p className="font-tech text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/60">ID_VISUELLE_SYNC</p>
          <div className="h-0.5 w-8 bg-primary/30 mx-auto rounded-full" />
        </div>
      </div>

      {/* FORMULAIRE : Grille Intelligente */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
        
        {/* CHAMPS TEXTE */}
        {[
          { id: "prenom", label: "Prénom_Entité", placeholder: "Prénom" },
          { id: "nom", label: "Nom_Famille", placeholder: "Nom" }
        ].map((field) => (
          <div key={field.id} className="space-y-2 group">
            <label className="font-tech text-[9px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground group-focus-within:text-primary transition-colors ml-1 italic">
              _{field.label}
            </label>
            <Input 
              {...register(field.id as any)} 
              placeholder={field.placeholder}
              className="bg-background border-2 border-border h-14 md:h-16 font-display italic text-lg md:text-xl uppercase tracking-tighter focus-visible:border-primary text-foreground transition-all rounded-xl px-5" 
            />
          </div>
        ))}
        
        {/* GENRE : Select Responsive */}
        <div className="space-y-2 group">
          <label className="font-tech text-[9px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground group-focus-within:text-primary ml-1 italic">Genre</label>
          <Select onValueChange={(v) => setValue("sexe", v)} defaultValue={watch("sexe")}>
            <SelectTrigger className="bg-background border-2 border-border h-14 md:h-16 font-tech font-black uppercase tracking-widest focus:border-primary text-foreground rounded-xl px-5">
              <SelectValue placeholder="SÉLECTIONNER" />
            </SelectTrigger>
            <SelectContent className="bg-secondary border-2 border-border text-foreground rounded-xl">
              <SelectItem value="M" className="font-tech py-3 focus:bg-primary">MASCULIN // M</SelectItem>
              <SelectItem value="F" className="font-tech py-3 focus:bg-primary">FÉMININ // F</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* WHATSAPP : Highlighté */}
        <div className="space-y-2 group">
          <label className="font-tech text-[9px] md:text-[10px] font-black uppercase tracking-widest text-primary/80 ml-1 italic">Numero</label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 bg-primary/10 rounded-lg">
              <Phone className="w-4 h-4 text-primary" />
            </div>
            <Input 
              {...register("numero_tel")} 
              placeholder="+243..."
              className="bg-primary/5 border-2 border-primary/30 h-14 md:h-16 pl-12 md:pl-14 font-tech font-black text-base md:text-lg focus-visible:border-primary text-primary transition-all rounded-xl tracking-widest" 
            />
          </div>
        </div>
      </div>

      {/* BOUTON VALIDATION : Responsive Text */}
      <div className="pt-4">
        <Button 
          disabled={loading} 
          type="submit"
          className="w-full h-16 md:h-24 bg-primary text-primary-foreground font-display font-black italic rounded-xl md:rounded-[1.5rem] hover:scale-[1.01] active:scale-[0.98] transition-all group relative overflow-hidden shadow-glow-primary"
        >
          {loading ? (
            <Loader2 className="animate-spin w-6 h-6 md:w-8 md:h-8" />
          ) : (
            <div className="flex items-center gap-3 md:gap-5">
              <Scan className="w-5 h-5 md:w-6 md:h-6 group-hover:rotate-90 transition-transform duration-500" />
              <span className="text-xs md:text-base tracking-[0.2em] md:tracking-[0.5em]">
                <span className="xs:hidden">SCELLER_ID</span>
                <span className="hidden xs:inline">SCELLER_L'IDENTITÉ_SÉCURISÉE</span>
              </span>
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent -translate-y-full group-hover:animate-[scan-vertical_2s_linear_infinite] pointer-events-none" />
        </Button>
      </div>
      
      <style>{`
        @keyframes scan {
          0% { transform: translateY(-50px); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(50px); opacity: 0; }
        }
        @keyframes scan-vertical {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
      `}</style>
    </form>
  );
}