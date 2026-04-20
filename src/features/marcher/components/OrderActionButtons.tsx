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

  // ÉTAT VERROUILLÉ : Look Terminal Désactivé
  if (!canInteract) {
    return (
      <div className="flex items-center gap-3 px-4 py-2 bg-secondary/50 rounded-xl border-2 border-border/50 opacity-40 select-none">
        <Lock size={12} className="text-muted-foreground" />
        <span className="font-tech text-[8px] font-black text-muted-foreground uppercase tracking-[0.2em]">
          SESSION_LOCKED
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2.5 animate-in fade-in slide-in-from-right-2 duration-500">
      
      {/* BOUTON MODIFIER : Style Action Primaire */}
      <Button 
        onClick={(e) => {
          e.stopPropagation();
          onEdit();
        }}
        className="h-10 w-10 p-0 rounded-xl bg-background border-2 border-border hover:border-primary/50 hover:bg-primary/5 text-muted-foreground hover:text-primary transition-all group relative overflow-hidden"
        title="MODIFIER_ORDRE"
      >
        <Edit3 size={16} className="relative z-10 group-hover:rotate-12 transition-transform duration-300" />
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      </Button>

      {/* BOUTON ANNULER : Style Danger Zone */}
      <Button 
        onClick={(e) => {
          e.stopPropagation();
          if (window.confirm("RÉVOQUER CETTE POSTULATION ? CETTE ACTION EST IRRÉVERSIBLE.")) {
            onCancel();
          }
        }}
        className="h-10 w-10 p-0 rounded-xl bg-background border-2 border-border hover:border-red-500/50 hover:bg-red-500/5 text-muted-foreground hover:text-red-500 transition-all group relative overflow-hidden"
        title="RÉVOQUER_ORDRE"
      >
        <Trash2 size={16} className="relative z-10 group-hover:scale-110 transition-transform duration-300" />
        <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      </Button>

      {/* INDICATEUR DE FLUX ÉDITABLE */}
      <div className="ml-1 flex flex-col items-center gap-1 opacity-60">
        <Zap size={10} className="text-primary animate-pulse" />
        <div className="w-[2px] h-4 bg-gradient-to-b from-primary to-transparent rounded-full" />
      </div>

    </div>
  );
}