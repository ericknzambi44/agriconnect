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
  Plus, Loader2, BadgeDollarSign, CalendarDays, LayoutGrid, 
  ImagePlus, X, Zap, Cpu, Target, MapPin
} from "lucide-react";
import { toast } from "sonner";

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
      date_recolte: new Date().toISOString().split('T')[0],
      lieu_culture: "" // 🔴 Nouveau champ
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
    const payload = { 
      ...data, 
      prix_prod: parseFloat(data.prix_prod) || 0, 
      quantite_prod: parseFloat(data.quantite_prod) || 0,
      lieu_culture: data.lieu_culture || null
    };
    const success = await addProduit(payload, selectedFile || undefined);
    
    if (success) {
      toast.success("Produit ajouté", {
        description: `${data.nom_prod.toUpperCase()} intégré au système.`,
        className: "bg-primary/20 border border-primary/50 text-white font-tech italic uppercase font-black backdrop-blur-xl",
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
        <Button className="bg-gradient-to-r from-primary to-orange-400 hover:scale-105 text-black font-display font-black uppercase italic tracking-[0.2em] px-6 h-12 rounded-2xl shadow-lg shadow-primary/30 transition-all active:scale-95 group border-none">
          <Plus className="w-5 h-5 mr-2 stroke-[3px] group-hover:rotate-90 transition-transform" />
          Nouvelle récolte
        </Button>
      </DialogTrigger>
      
      <DialogContent className="bg-gradient-to-b from-black/90 to-[#0a0a0a] border border-white/10 text-white sm:max-w-[600px] rounded-[2rem] shadow-2xl shadow-primary/20 backdrop-blur-xl overflow-y-auto max-h-[95vh] p-0 font-tech no-scrollbar">
        
        {/* Lueur de fond */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/20 blur-[100px] pointer-events-none" />

        <div className="p-6 md:p-10 relative">
          <DialogHeader className="mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-orange-400 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 -rotate-6">
                <Cpu className="text-black w-6 h-6" strokeWidth={2.5} />
              </div>
              <div>
                <DialogTitle className="text-2xl md:text-3xl font-display font-black uppercase italic tracking-tighter leading-none text-white">
                  Entrée <span className="text-primary">stock</span>
                </DialogTitle>
                <p className="text-[8px] font-black text-white/40 uppercase tracking-[0.4em] mt-1 italic">Ajouter un nouveau produit</p>
              </div>
            </div>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* UPLOAD IMAGE */}
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/50 ml-1">Photo produit</label>
              <div className="relative group">
                {!previewUrl ? (
                  <label className="flex flex-col items-center justify-center w-full h-40 rounded-2xl border-2 border-dashed border-white/20 bg-white/[0.02] hover:bg-primary/5 hover:border-primary/50 transition-all duration-500 cursor-pointer group/upload overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent translate-y-[-100%] group-hover/upload:translate-y-[100%] transition-transform duration-[2000ms]" />
                    <ImagePlus className="w-10 h-10 text-white/20 group-hover/upload:text-primary transition-colors mb-2" strokeWidth={1.5} />
                    <span className="text-[8px] font-black uppercase tracking-widest text-white/40 group-hover/upload:text-primary">Sélectionner une image</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                  </label>
                ) : (
                  <div className="relative w-full h-48 rounded-2xl overflow-hidden border-2 border-primary/40 shadow-xl">
                    <img src={previewUrl} alt="Aperçu" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <button 
                      type="button" 
                      onClick={removeImage}
                      className="absolute top-3 right-3 p-2 bg-black/60 backdrop-blur-md rounded-xl text-white hover:text-red-400 transition-colors border border-white/10"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-gradient-to-r from-primary to-orange-400 px-3 py-1.5 rounded-lg shadow-md">
                      <Target size={10} className="text-black animate-pulse" strokeWidth={3} />
                      <span className="text-[8px] font-black text-black uppercase tracking-wider">Prêt à synchroniser</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* NOM PRODUIT */}
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/50 ml-1">Nom du produit</label>
              <Input 
                {...register("nom_prod")} 
                placeholder="EX: MAÏS GRAIN" 
                className="bg-white/[0.02] border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/30 uppercase font-display font-black text-white placeholder:text-white/20 h-14 rounded-xl tracking-[0.05em] pl-5 text-lg transition-all" 
                required 
              />
            </div>

            {/* GRILLE : CATÉGORIE / DATE RÉCOLTE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/50 ml-1">Catégorie</label>
                <Controller
                  name="categorie_id"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="bg-white/[0.02] border border-white/10 text-white font-black uppercase text-[10px] h-14 rounded-xl focus:ring-primary/30 pl-4">
                        <LayoutGrid className="w-4 h-4 mr-2 text-primary" strokeWidth={3} />
                        <SelectValue placeholder="SÉLECTIONNER" />
                      </SelectTrigger>
                      <SelectContent className="bg-black border border-white/10 text-white font-black uppercase text-[10px] rounded-xl backdrop-blur-xl">
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id} className="focus:bg-primary/20 focus:text-primary py-3 transition-colors">
                            {cat.libelle_categorie}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/50 ml-1">Date de récolte</label>
                <div className="relative">
                  <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary z-10" strokeWidth={3} />
                  <Input 
                    type="date" 
                    {...register("date_recolte")} 
                    className="bg-white/[0.02] border border-white/10 text-white font-black h-14 pl-11 rounded-xl [color-scheme:dark] focus:border-primary/50 focus:ring-1 focus:ring-primary/30" 
                    required 
                  />
                </div>
              </div>
            </div>

            {/* 🔴 LIEU DE CULTURE (champ ajouté) */}
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/50 ml-1">Lieu de culture</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary z-10" strokeWidth={3} />
                <Input 
                  {...register("lieu_culture")} 
                  placeholder="EX: BUNIA, ITURI" 
                  className="bg-white/[0.02] border border-white/10 text-white font-black h-14 pl-11 rounded-xl uppercase tracking-[0.05em] focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all" 
                />
              </div>
            </div>

            {/* GRILLE : QUANTITÉ / PRIX */}
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/50 ml-1">Quantité</label>
                <div className="flex bg-white/[0.02] border border-white/10 rounded-xl overflow-hidden focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/30 transition-all">
                  <Input 
                    type="number" 
                    step="any" 
                    {...register("quantite_prod")} 
                    placeholder="0.00" 
                    className="bg-transparent border-none font-black h-14 focus-visible:ring-0 text-white pl-4 text-lg" 
                    required 
                  />
                  <div className="flex items-center px-3 bg-primary/10 border-l border-primary/20">
                    <Controller
                      name="unite"
                      control={control}
                      render={({ field }) => (
                        <select 
                          onChange={field.onChange} 
                          value={field.value}
                          className="bg-transparent text-primary font-black uppercase text-[9px] outline-none cursor-pointer tracking-wider"
                        >
                          <option value="Unite">UNITÉ</option>
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

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/50 ml-1">Prix unitaire (USD)</label>
                <div className="relative">
                  <BadgeDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" strokeWidth={3} />
                  <Input 
                    type="number" 
                    step="0.01" 
                    {...register("prix_prod")} 
                    placeholder="0.00" 
                    className="bg-white/[0.02] border border-white/10 font-black h-14 pl-11 text-white rounded-xl focus:border-primary/50 focus:ring-1 focus:ring-primary/30 text-lg" 
                  />
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-orange-400 text-black font-display font-black uppercase italic h-16 mt-4 rounded-xl shadow-lg shadow-primary/30 hover:scale-[1.02] transition-all group active:scale-[0.98] tracking-[0.2em] text-sm border-none"
            >
              {loading ? (
                <Loader2 className="animate-spin w-5 h-5" />
              ) : (
                <span className="flex items-center gap-3">
                  ENREGISTRER
                  <Zap className="w-4 h-4 fill-black" />
                </span>
              )}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}