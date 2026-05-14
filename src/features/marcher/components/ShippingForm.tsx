// components/marketplace/ShippingForm.tsx
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Navigation } from "lucide-react";
import { AdresseComplete } from '../hooks/useMarketplace';

interface ShippingFormProps {
  value: {
    ville: string;
    details: string;
  };
  onChange: (data: { ville: string; details: string }) => void;
  vendeurAdresse?: AdresseComplete;
}

export function ShippingForm({ value, onChange, vendeurAdresse }: ShippingFormProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-[10px] font-black uppercase text-primary tracking-[0.2em] flex items-center gap-2">
          <MapPin size={12} /> Ville de destination
        </Label>
        <Input
          value={value.ville}
          onChange={(e) => onChange({ ...value, ville: e.target.value })}
          placeholder="Ex: Kinshasa, Goma, Lubumbashi..."
          className="h-12 bg-white/5 border-white/10 rounded-xl text-white font-bold placeholder:text-white/20"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-[10px] font-black uppercase text-primary tracking-[0.2em] flex items-center gap-2">
          <Navigation size={12} /> Adresse précise / Point de livraison
        </Label>
        <Input
          value={value.details}
          onChange={(e) => onChange({ ...value, details: e.target.value })}
          placeholder="Quartier, avenue, référence..."
          className="h-12 bg-white/5 border-white/10 rounded-xl text-white font-bold placeholder:text-white/20"
        />
      </div>

      {vendeurAdresse && (
        <div className="p-3 bg-primary/5 border border-primary/20 rounded-xl mt-2">
          <p className="text-[9px] font-black text-primary/80 uppercase flex items-center gap-1">
            <MapPin size={10} /> Le vendeur est basé à
          </p>
          <p className="text-[11px] text-white font-bold uppercase italic mt-1">
            {vendeurAdresse.commune}, {vendeurAdresse.ville} ({vendeurAdresse.province})
          </p>
        </div>
      )}
    </div>
  );
}