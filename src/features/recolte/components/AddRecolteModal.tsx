// src/features/recolte/components/AddRecolteModal.tsx
import React from 'react';
import { useForm, Controller } from "react-hook-form";
import { useRecoltes } from '../hooks/useRecoltes';
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
import { Plus, Loader2, CheckCircle2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PublierAnnonceModal } from '@/features/annonce/components/PublierAnnonceModal';

export function AddRecolteModal() {
  const { addProduit, loading, refresh } = useRecoltes();
  const [open, setOpen] = React.useState(false);
  
  const { register, handleSubmit, reset, control } = useForm({
    defaultValues: {
      nom_prod: "",
      quantite_prod: "",
      unite: "kg",
      prix_prod: "",
      date_recolte: new Date().toISOString().split('T')[0]
    }
  });

  const onSubmit = async (data: any) => {
    const payload = {
      ...data,
      prix_prod: parseFloat(data.prix_prod) || 0,
      quantite_prod: parseFloat(data.quantite_prod) || 0,
    };

    const success = await addProduit(payload);
    
    if (success) {
      // 1. Notification Sonner Pro
      toast.success("PRODUIT ENREGISTRÉ", {
        description: `${data.nom_prod.toUpperCase()} est maintenant disponible dans votre stock.`,
        duration: 4000,
      });

      // 2. Nettoyage et fermeture
      reset();
      setOpen(false);

      // 3. Mise à jour instantanée de la vue
      refresh(); 
    } else {
      toast.error("ERREUR DE CONNEXION", {
        description: "Impossible de synchroniser avec le terminal pishopy.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/80 text-black font-black uppercase italic tracking-widest px-6 shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all active:scale-95">
          <Plus className="w-4 h-4 mr-2 stroke-[3px]" />
          Nouvelle Récolte
        </Button>
      
      </DialogTrigger>
      
      <DialogContent className="bg-[#0a0a0a] border-white/10 text-white sm:max-w-[425px] shadow-2xl shadow-primary/10 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter text-glow-green flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-primary" />
            Enregistrer un Produit
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          {/* NOM DU PRODUIT */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">Désignation</label>
            <Input 
              {...register("nom_prod")} 
              placeholder="EX: MAÏS JAUNE" 
              className="bg-white/5 border-white/10 focus:border-primary uppercase font-bold h-12" 
              required 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* QUANTITÉ */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">Quantité</label>
              <Input 
                type="number" 
                step="any" 
                {...register("quantite_prod")} 
                placeholder="0" 
                className="bg-white/5 border-white/10 font-bold h-12" 
                required 
              />
            </div>

            {/* UNITÉ (SÉLECTION AGRICOLE) */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">Unité</label>
              <Controller
                name="unite"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white font-bold uppercase text-[10px] h-12">
                      <SelectValue placeholder="UNITÉ" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0a0a0a] border-white/10 text-white font-bold uppercase text-[10px]">
                      <SelectItem value="kg">Kilogramme (kg)</SelectItem>
                      <SelectItem value="tonne">Tonne (t)</SelectItem>
                      <SelectItem value="sac">Sac (90/120kg)</SelectItem>
                      <SelectItem value="bidon">Bidon (20L)</SelectItem>
                      <SelectItem value="litre">Litre (L)</SelectItem>
                      <SelectItem value="caisse">Caisse</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          {/* PRIX UNITAIRE */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">Prix Estimé (USD)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-bold italic">$</span>
              <Input 
                type="number" 
                step="0.01" 
                {...register("prix_prod")} 
                placeholder="0.00" 
                className="bg-white/5 border-white/10 font-bold h-12 pl-8 text-white" 
              />
            </div>
          </div>

          {/* DATE DE RÉCOLTE */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">Date de Récolte</label>
            <Input 
              type="date" 
              {...register("date_recolte")} 
              className="bg-white/5 border-white/10 text-white font-bold h-12 [color-scheme:dark]" 
              required 
            />
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary text-black font-black uppercase italic h-14 mt-6 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all group active:scale-[0.98]"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <span className="flex items-center gap-2">
                VALIDER L'ENTRÉE EN STOCK
                <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
              </span>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}