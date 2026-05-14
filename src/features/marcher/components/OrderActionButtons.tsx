// components/marketplace/OrderActionButtons.tsx
import React from 'react';
import { Button } from "@/components/ui/button";
import { ShoppingCart, Eye } from "lucide-react";
import { MarketAnnonce } from '../hooks/useMarketplace';
import { cn } from "@/lib/utils";

interface OrderActionButtonsProps {
  annonce: MarketAnnonce;
  onOrderStart: (annonce: MarketAnnonce) => void;
  compact?: boolean;
}

export function OrderActionButtons({ annonce, onOrderStart, compact = false }: OrderActionButtonsProps) {
  const disabled = annonce.quantite_restante <= 0;

  return (
    <div className="flex gap-2 mt-2">
      <Button
        onClick={() => onOrderStart(annonce)}
        disabled={disabled}
        className={cn(
          "flex-1 bg-gradient-to-r from-primary to-orange-400 hover:from-primary/80 hover:to-orange-500 text-black font-black uppercase italic rounded-xl transition-all active:scale-95 shadow-md shadow-primary/20",
          compact ? "h-9 text-[11px]" : "h-11 text-sm"
        )}
      >
        <ShoppingCart className="w-4 h-4 mr-2 stroke-[2.5px]" />
        {disabled ? "Rupture" : "Acheter"}
      </Button>
      <Button
        variant="outline"
        className="border-white/10 text-white/70 hover:text-primary hover:border-primary/40 transition-all"
      >
        <Eye className="w-4 h-4" />
      </Button>
    </div>
  );
}