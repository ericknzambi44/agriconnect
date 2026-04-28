import React from 'react';
import { Button } from "@/components/ui/button";
import { Edit3, Trash2, Lock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  status: string;
  onEdit: () => void;
  onCancel: () => void;
}

export function OrderActionButtons({ status, onEdit, onCancel }: Props) {
  const canInteract = status === 'en_attente' || status === 'PENDING';

  // --- ÉTAT VERROUILLÉ : Plus lisible et plus pro ---
  if (!canInteract) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary/50 rounded-full border border-white/5 opacity-60 select-none shrink-0">
        <Lock size={14} className="text-muted-foreground" />
        <span className="font-tech text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
          VERROUILLÉ
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2.5 sm:gap-4 animate-in fade-in slide-in-from-right-3 duration-500 shrink-0">
      
      {/* BOUTON MODIFIER : Cible tactile élargie (44px+) */}
      <Button 
        onClick={(e) => {
          e.stopPropagation();
          onEdit();
        }}
        variant="outline"
        className={cn(
          "h-11 w-11 md:h-12 md:w-12 p-0 rounded-2xl bg-secondary/40 border-white/10 shadow-lg",
          "hover:border-primary/50 hover:bg-primary/10 text-foreground hover:text-primary",
          "active:scale-90 transition-all group shrink-0"
        )}
      >
        <Edit3 size={20} className="group-hover:rotate-12 transition-transform duration-300 md:w-6 md:h-6" />
      </Button>

      {/* BOUTON ANNULER : Rouge plus visible pour la sécurité */}
      <Button 
        onClick={(e) => {
          e.stopPropagation();
          // Une confirmation un peu plus "Tech"
          if (window.confirm("CONFIRMER LA SUPPRESSION DE L'ORDRE ?")) {
            onCancel();
          }
        }}
        variant="outline"
        className={cn(
          "h-11 w-11 md:h-12 md:w-12 p-0 rounded-2xl bg-destructive/5 border-destructive/20 shadow-lg",
          "hover:border-destructive hover:bg-destructive hover:text-destructive-foreground text-destructive",
          "active:scale-90 transition-all group shrink-0"
        )}
      >
        <Trash2 size={20} className="group-hover:scale-110 transition-transform duration-300 md:w-6 md:h-6" />
      </Button>

      {/* INDICATEUR D'ÉTAT : Visible uniquement si l'espace le permet */}
      <div className="hidden lg:flex flex-col items-center gap-1 opacity-20">
        <div className="w-[1px] h-3 bg-primary" />
        <AlertCircle size={10} className="text-primary" />
        <div className="w-[1px] h-3 bg-primary" />
      </div>

    </div>
  );
}