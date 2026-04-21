// src/features/recolte/components/AddRecolteModal.tsx
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from "react-hook-form";
import { useRecoltes } from '../hooks/useRecoltes';
import { supabase } from '@/supabase';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Plus, Loader2, CheckCircle2, BadgeDollarSign, 
  CalendarDays, LayoutGrid, ImagePlus, X, Zap, Cpu, Target
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function AddRecolteModal() {
  const { addProduit, loading, refresh } = useRecoltes();
  const [open, setOpen] = React.useState(false);
  const [categories, setCategories] = useState<{id: string, libelle_categorie: string}[]>([]);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchCats = async () => {
      const { data } = await supabase.from('categorie').select('*').order('libelle_categorie');
      if (data) setCategories(data);
    };
    if (open) fetchCats();
  }, [open]);

  const { register, handleSubmit, reset, control } = useForm({
    defaultValues: {
      nom_prod: "",
      categorie_id: "",
      quantite_prod: "",
      unite: "kg",
      prix_prod: "",
      date_recolte: new Date().toISOString().split('T')[0]
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const onSubmit = async (data: any) => {
    const payload = { ...data, prix_prod: parseFloat(data.prix_prod) || 0, quantite_prod: parseFloat(data.quantite_prod) || 0 };
    const success = await addProduit(payload, selectedFile || undefined);
    
    if (success) {
      toast.success("PROTOCOLE_VALIDÉ", {
        description: `${data.nom_prod.toUpperCase()} INTÉGRÉ AU SYSTÈME.`,
        className: "bg-primary/20 border-2 border-primary text-foreground font-tech italic uppercase font-black backdrop-blur-xl",
      });
      reset();
      removeImage();
      setOpen(false);
      refresh(); 
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => { setOpen(val); if(!val) removeImage(); }}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:scale-105 text-primary-foreground font-display font-black uppercase italic tracking-[0.2em] px-8 h-14 rounded-2xl shadow-glow-primary transition-all active:scale-95 group border-none">
          <Plus className="w-5 h-5 mr-2 stroke-[3px] group-hover:rotate-90 transition-transform" />
          Nouvelle_Récolte
        </Button>
      </DialogTrigger>
      
      <DialogContent className="bg-secondary/95 border-primary/20 text-foreground sm:max-w-[600px] rounded-[3rem] shadow-2xl shadow-primary/5 backdrop-blur-3xl overflow-y-auto max-h-[95vh] p-0 border-l-primary border-l-4 font-tech no-scrollbar">
        
        {/* Glow de fond pour le mode Terminal */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 blur-[100px] pointer-events-none" />

        <div className="p-8 md:p-12 relative">
          <DialogHeader className="mb-10">
            <div className="flex items-center gap-4">
               <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-glow-primary -rotate-6">
                  <Cpu className="text-primary-foreground w-7 h-7" strokeWidth={2.5} />
               </div>
               <div>
                  <DialogTitle className="text-3xl font-display font-black uppercase italic tracking-tighter leading-none">
                    Entrée <span className="text-primary">_STOCK</span>
                  </DialogTitle>
                  <p className="text-[9px] font-black text-primary/40 uppercase tracking-[0.5em] mt-1 italic">nexus_inventory_protocol_v3</p>
               </div>
            </div>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            
            {/* ZONE UPLOAD - LOOK CARTE MARKET */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 ml-1">Photo produit</label>
              <div className="relative group">
                {!previewUrl ? (
                  <label className="flex flex-col items-center justify-center w-full h-44 rounded-[2.5rem] border-2 border-dashed border-primary/10 bg-background/50 hover:bg-primary/5 hover:border-primary/40 transition-all duration-500 cursor-pointer group/upload overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent translate-y-[-100%] group-hover/upload:translate-y-[100%] transition-transform duration-[2000ms]" />
                    <ImagePlus className="w-10 h-10 text-muted-foreground/20 group-hover/upload:text-primary transition-colors mb-3" strokeWidth={1.5} />
                    <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 group-hover/upload:text-primary">Scanner_Fichier_Ressource</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                  </label>
                ) : (
                  <div className="relative w-full h-52 rounded-[2.5rem] overflow-hidden border-2 border-primary/30 shadow-2xl">
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                    <button 
                      type="button" 
                      onClick={removeImage}
                      className="absolute top-4 right-4 p-3 bg-secondary/80 backdrop-blur-xl rounded-2xl text-foreground hover:text-red-500 transition-colors border border-white/5 shadow-xl"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-primary px-4 py-2 rounded-xl shadow-glow-primary">
                      <Target size={12} className="text-primary-foreground animate-pulse" strokeWidth={3} />
                      <span className="text-[9px] font-black text-primary-foreground uppercase tracking-widest italic">READY_TO_SYNC</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* DÉSIGNATION - STYLE HEADER MARKET */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 ml-1">Nom du produit</label>
              <Input 
                {...register("nom_prod")} 
                placeholder="EX: MAÏS_GRAIN_TYPE_B" 
                className="bg-background/50 border-border/40 focus-visible:ring-primary/20 focus-visible:border-primary/50 uppercase font-display font-black text-primary placeholder:text-muted-foreground/10 h-16 rounded-2xl tracking-[0.1em] pl-6 text-xl transition-all" 
                required 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 ml-1">Categorie</label>
                  <Controller
                    name="categorie_id"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="bg-background/50 border-border/40 text-foreground font-black uppercase text-[10px] h-16 rounded-2xl focus:ring-primary/20 pl-6">
                          <LayoutGrid className="w-4 h-4 mr-3 text-primary" strokeWidth={3} />
                          <SelectValue placeholder="CATEGORIE_CORE" />
                        </SelectTrigger>
                        <SelectContent className="bg-secondary border-primary/20 text-foreground font-black uppercase text-[10px] rounded-2xl backdrop-blur-3xl shadow-2xl">
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id} className="focus:bg-primary focus:text-primary-foreground py-4 transition-colors">
                              {cat.libelle_categorie}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 ml-1">Date recolte</label>
                  <div className="relative">
                    <CalendarDays className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-primary z-10" strokeWidth={3} />
                    <Input 
                      type="date" 
                      {...register("date_recolte")} 
                      className="bg-background/50 border-border/40 text-foreground font-black h-16 pl-14 rounded-2xl [color-scheme:dark] focus-visible:ring-primary/20" 
                      required 
                    />
                  </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 ml-1">Quantite</label>
                <div className="flex bg-background/50 border border-border/40 rounded-2xl overflow-hidden focus-within:border-primary/40 transition-colors">
                  <Input 
                    type="number" 
                    step="any" 
                    {...register("quantite_prod")} 
                    placeholder="0.00" 
                    className="bg-transparent border-none font-black h-16 focus-visible:ring-0 text-foreground pl-6 text-xl" 
                    required 
                  />
                  <div className="flex items-center px-4 bg-primary/10 border-l border-primary/10">
                    <Controller
                      name="unite"
                      control={control}
                      render={({ field }) => (
                        <select 
                          onChange={field.onChange} 
                          value={field.value}
                          className="bg-transparent text-primary font-black uppercase text-[10px] outline-none cursor-pointer tracking-widest"
                        >
                          <option value="Unite">UNITE</option>
                          <option value="kg">KG</option>
                          <option value="tonne">T</option>
                          <option value="sac">SAC</option>
                          <option value="bidon">L</option>
                        </select>
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 ml-1">Valeur/unite en $</label>
                <div className="relative group">
                  <BadgeDollarSign className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" strokeWidth={3} />
                  <Input 
                    type="number" 
                    step="0.01" 
                    {...register("prix_prod")} 
                    placeholder="0.00" 
                    className="bg-background/50 border-border/40 font-black h-16 pl-14 text-foreground rounded-2xl focus-visible:ring-primary/20 text-xl" 
                  />
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary text-primary-foreground font-display font-black uppercase italic h-20 mt-6 rounded-[2rem] shadow-glow-primary hover:scale-[1.02] transition-all group active:scale-[0.97] tracking-[0.4em] text-sm border-none"
            >
              {loading ? (
                <Loader2 className="animate-spin w-6 h-6" />
              ) : (
                <span className="flex items-center gap-4">
                  INITIALISER
                  <Zap className="w-5 h-5 fill-primary-foreground" />
                </span>
              )}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}