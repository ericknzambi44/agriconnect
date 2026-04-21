import React from 'react';
import { Button } from "@/components/ui/button";
import { Edit3, Trash2, Lock, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  status: string;
  onEdit: () => void;
  onCancel: () => void;
}

export function OrderActionButtons({ status, onEdit, onCancel }: Props) {
  // Statut de modification autorisé uniquement en attente
  const canInteract = status === 'en_attente';

  // ÉTAT VERROUILLÉ : Adaptatif
  if (!canInteract) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-secondary/30 rounded-lg border border-border/50 opacity-50 select-none shrink-0 transition-all duration-300">
        <Lock size={10} className="text-muted-foreground shrink-0 md:w-3 md:h-3" />
        <span className="font-tech text-[7px] md:text-[8px] font-black text-muted-foreground uppercase tracking-[0.15em] whitespace-nowrap">
          LOCKED
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 sm:gap-3 animate-in fade-in slide-in-from-right-2 duration-500 shrink-0">
      
      {/* BOUTON MODIFIER : Optimisé pour le tactile */}
      <Button 
        onClick={(e) => {
          e.stopPropagation();
          onEdit();
        }}
        className={cn(
          "h-10 w-10 md:h-11 md:w-11 p-0 rounded-xl bg-background border-2 border-border shadow-sm",
          "hover:border-primary/50 hover:bg-primary/5 text-muted-foreground hover:text-primary",
          "active:scale-90 active:bg-primary/10 transition-all group relative overflow-hidden shrink-0"
        )}
      >
        <Edit3 size={16} className="relative z-10 group-hover:rotate-12 transition-transform duration-300 md:w-5 md:h-5" />
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      </Button>

      {/* BOUTON ANNULER : Style Danger Zone avec protection tactile */}
      <Button 
        onClick={(e) => {
          e.stopPropagation();
          if (window.confirm("RÉVOQUER CETTE POSTULATION ?")) {
            onCancel();
          }
        }}
        className={cn(
          "h-10 w-10 md:h-11 md:w-11 p-0 rounded-xl bg-background border-2 border-border shadow-sm",
          "hover:border-destructive/50 hover:bg-destructive/5 text-muted-foreground hover:text-destructive",
          "active:scale-90 active:bg-destructive/10 transition-all group relative overflow-hidden shrink-0"
        )}
      >
        <Trash2 size={16} className="relative z-10 group-hover:scale-110 transition-transform duration-300 md:w-5 md:h-5" />
        <div className="absolute inset-0 bg-destructive/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      </Button>

      {/* INDICATEUR DE FLUX : Masquage intelligent sur mobile ultra-petit */}
      <div className="hidden sm:flex flex-col items-center gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
        <Zap size={10} className="text-primary animate-pulse" />
        <div className="w-[2px] h-4 bg-gradient-to-b from-primary to-transparent rounded-full" />
      </div>

    </div>
  );
}