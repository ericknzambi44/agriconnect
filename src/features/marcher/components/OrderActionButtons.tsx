// src/features/marcher/components/OrderActionButtons.tsx
import React from 'react';
import { Button } from "@/components/ui/button";
import { Edit3, Trash2, Lock, AlertTriangle } from "lucide-react";

interface Props {
  status: string;
  onEdit: () => void;
  onCancel: () => void;
}

export function OrderActionButtons({ status, onEdit, onCancel }: Props) {
  // Une commande ne peut être modifiée ou annulée que si le vendeur ne l'a pas encore traitée
  const canInteract = status === 'en_attente';

  // État Verrouillé (Validée ou Annulée)
  if (!canInteract) {
    return (
      <div className="flex items-center gap-3 px-4 py-2 bg-white/[0.02] rounded-2xl border border-white/5 opacity-50">
        <Lock className="w-3 h-3 text-white/20" />
        <span className="text-[8px] font-black text-white/40 uppercase tracking-[0.2em]">Transaction_Close</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2 duration-500">
      {/* BOUTON MODIFIER */}
      <Button 
        variant="ghost" 
        onClick={(e) => {
          e.stopPropagation(); // Évite de trigger d'éventuels clics sur la carte
          onEdit();
        }}
        title="Modifier la quantité de la postulation"
        className="h-10 w-10 p-0 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-emerald-500/10 hover:border-emerald-500/20 hover:text-emerald-500 transition-all text-white/40 group"
      >
        <Edit3 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
      </Button>

      {/* BOUTON ANNULER (DANGER ZONE) */}
      <Button 
        variant="ghost" 
        onClick={(e) => {
          e.stopPropagation();
          if (confirm("Voulez-vous vraiment révoquer cette postulation ?")) {
            onCancel();
          }
        }}
        title="Annuler cette commande"
        className="h-10 w-10 p-0 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-500 transition-all text-white/40 group"
      >
        <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
      </Button>

      {/* Petit indicateur visuel de l'état éditable */}
      <div className="ml-2 hidden md:block">
        <div className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
      </div>
    </div>
  );
}