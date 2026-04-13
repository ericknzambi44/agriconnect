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
import { Plus, Loader2, CheckCircle2, BadgeDollarSign, CalendarDays, LayoutGrid, ImagePlus, X } from "lucide-react";
import { toast } from "sonner";

export function AddRecolteModal() {
  const { addProduit, loading, refresh } = useRecoltes();
  const [open, setOpen] = React.useState(false);
  const [categories, setCategories] = useState<{id: string, libelle_categorie: string}[]>([]);
  
  // États pour l'image
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

  // Gérer le changement d'image
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
    };

    // On passe le payload ET le fichier image au hook
    const success = await addProduit(payload, selectedFile || undefined);
    
    if (success) {
      toast.success("PROTOCOLE VALIDÉ", {
        description: `${data.nom_prod.toUpperCase()} INTÉGRÉ AU SYSTÈME.`,
        duration: 3000,
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
        <Button className="bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase italic tracking-[0.2em] px-8 h-12 rounded-2xl shadow-[0_10px_25px_rgba(16,185,129,0.2)] transition-all active:scale-95 group">
          <Plus className="w-4 h-4 mr-2 stroke-[4px] group-hover:rotate-90 transition-transform" />
          Nouvelle Récolte
        </Button>
      </DialogTrigger>
      
      <DialogContent className="bg-[#050505] border-white/5 text-white sm:max-w-[550px] rounded-[3rem] shadow-2xl shadow-emerald-500/5 backdrop-blur-3xl overflow-y-auto max-h-[90vh] p-0 border-l-emerald-500/20 border-l-4 custom-scrollbar">
        <div className="p-8 md:p-10">
          <DialogHeader>
            <DialogTitle className="text-3xl font-black uppercase italic tracking-tighter text-white flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              </div>
              Entrée <span className="text-emerald-500">Stock</span>
            </DialogTitle>
            <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] mt-3 italic pl-1 border-l border-emerald-500/30 ml-1">Configuration_Ressources_Terminal</p>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-8">
            
            {/* ZONE UPLOAD IMAGE */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 ml-1">Image_Ressource</label>
              <div className="relative group">
                {!previewUrl ? (
                  <label className="flex flex-col items-center justify-center w-full h-32 rounded-2xl border-2 border-dashed border-white/10 bg-white/[0.02] hover:bg-emerald-500/[0.05] hover:border-emerald-500/40 transition-all cursor-pointer group/upload">
                    <ImagePlus className="w-8 h-8 text-white/10 group-hover/upload:text-emerald-500 transition-colors mb-2" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-white/20 group-hover/upload:text-emerald-500">Scanner_Fichier_Media</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                  </label>
                ) : (
                  <div className="relative w-full h-40 rounded-2xl overflow-hidden border border-emerald-500/30">
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    <button 
                      type="button" 
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-2 bg-black/60 backdrop-blur-md rounded-xl text-white hover:text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-emerald-500/80 backdrop-blur-md py-1 text-center">
                      <span className="text-[8px] font-black text-black uppercase tracking-widest">Image_Ready_To_Sync</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* DÉSIGNATION PRODUIT */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 ml-1">Désignation_Logistique</label>
              <Input 
                {...register("nom_prod")} 
                placeholder="EX: MAÏS JAUNE DE BUNIA" 
                className="bg-white/[0.02] border-white/10 focus-visible:ring-emerald-500/30 focus-visible:border-emerald-500/50 uppercase font-black text-emerald-500 placeholder:text-white/5 h-14 rounded-2xl tracking-widest pl-6" 
                required 
              />
            </div>

            {/* SÉLECTEUR DE CATÉGORIE */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 ml-1">Classification_Système</label>
              <div className="relative group">
                <LayoutGrid className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-emerald-500 transition-colors z-10" />
                <Controller
                  name="categorie_id"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="bg-white/[0.03] border-white/10 text-white font-black uppercase text-[10px] h-14 rounded-2xl focus:ring-emerald-500/20 pl-12">
                        <SelectValue placeholder="SÉLECTIONNER UNE CATÉGORIE" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#050505] border-white/10 text-white font-black uppercase text-[10px] rounded-xl backdrop-blur-xl">
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id} className="focus:bg-emerald-500 focus:text-black transition-colors">
                            {cat.libelle_categorie}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 ml-1">Volume_Net</label>
                <Input 
                  type="number" 
                  step="any" 
                  {...register("quantite_prod")} 
                  placeholder="0.00" 
                  className="bg-white/[0.02] border-white/10 font-black h-14 rounded-2xl focus-visible:ring-emerald-500/20 text-white pl-6" 
                  required 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 ml-1">Unité_Mesure</label>
                <Controller
                  name="unite"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="bg-white/[0.02] border-white/10 text-white font-black uppercase text-[10px] h-14 rounded-2xl focus:ring-emerald-500/20">
                        <SelectValue placeholder="UNITÉ" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#050505] border-white/10 text-white font-black uppercase text-[10px] rounded-xl">
                        <SelectItem value="kg">Kilogramme (kg)</SelectItem>
                        <SelectItem value="tonne">Tonne (t)</SelectItem>
                        <SelectItem value="sac">Sac (100kg)</SelectItem>
                        <SelectItem value="bidon">Bidon (20L)</SelectItem>
                        <SelectItem value="litre">Litre (L)</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 ml-1">Valeur_USD</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <BadgeDollarSign className="w-4 h-4 text-emerald-500" />
                    </div>
                    <Input 
                      type="number" 
                      step="0.01" 
                      {...register("prix_prod")} 
                      placeholder="0.00" 
                      className="bg-white/[0.02] border-white/10 font-black h-14 pl-12 text-white rounded-2xl focus-visible:ring-emerald-500/30" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 ml-1">Date_Ressource</label>
                  <div className="relative group">
                    <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <Input 
                      type="date" 
                      {...register("date_recolte")} 
                      className="bg-white/[0.02] border-white/10 text-white font-black h-14 pl-12 rounded-2xl [color-scheme:dark] focus-visible:ring-emerald-500/30" 
                      required 
                    />
                  </div>
                </div>
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-emerald-500 text-black font-black uppercase italic h-16 mt-4 rounded-2xl shadow-xl shadow-emerald-500/10 hover:shadow-emerald-500/30 transition-all group active:scale-[0.98] tracking-[0.3em]"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <span className="flex items-center gap-3">
                  INITIALISER L'ENTRÉE
                  <Plus className="w-5 h-5 stroke-[4px]" />
                </span>
              )}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}