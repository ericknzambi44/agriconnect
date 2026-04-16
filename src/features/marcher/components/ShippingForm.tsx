import React from 'react';
import { MapPin, Info, Home, Building2 } from 'lucide-react';

interface ShippingFormProps {
  data: { ville: string; details: string; agenceId: string };
  onChange: (field: string, value: string) => void;
  agences: any[];
}

export const ShippingForm = ({ data, onChange, agences }: ShippingFormProps) => {
  return (
    <div className="space-y-4 p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl">
      <div className="flex items-center gap-2 mb-2">
        <MapPin className="w-5 h-5 text-emerald-500" />
        <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-200">
          Destination du Colis
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* VILLE */}
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-black text-zinc-500 ml-1">Ville / Territoire</label>
          <div className="relative">
            <Home className="absolute left-3 top-2.5 w-4 h-4 text-zinc-600" />
            <input
              type="text"
              placeholder="Ex: Bunia, Komanda..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 pl-10 pr-4 text-sm focus:border-emerald-500 transition-all outline-none"
              value={data.ville}
              onChange={(e) => onChange('ville', e.target.value)}
            />
          </div>
        </div>

        {/* AGENCE OPTIONNELLE */}
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-black text-zinc-500 ml-1">Agence de retrait (Optionnel)</label>
          <div className="relative">
            <Building2 className="absolute left-3 top-2.5 w-4 h-4 text-zinc-600" />
            <select
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 pl-10 pr-4 text-sm focus:border-emerald-500 transition-all outline-none appearance-none"
              value={data.agenceId}
              onChange={(e) => onChange('agenceId', e.target.value)}
            >
              <option value="">Choisir plus tard</option>
              {agences.map((ag) => (
                <option key={ag.id} value={ag.id}>{ag.nom} - {ag.ville_territoire}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* DÉTAILS PRÉCIS */}
      <div className="space-y-1">
        <label className="text-[10px] uppercase font-black text-zinc-500 ml-1">Précisions (Quartier, Avenue, Référence)</label>
        <textarea
          placeholder="Ex: Quartier Kindia, Avenue de l'Hôpital, derrière le grand dépôt bleu..."
          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-4 text-sm focus:border-emerald-500 transition-all outline-none h-20 resize-none"
          value={data.details}
          onChange={(e) => onChange('details', e.target.value)}
        />
      </div>

      {/* AVERTISSEMENT CONTEXTE CONGO */}
      <div className="flex gap-3 p-3 bg-amber-950/20 border border-amber-500/30 rounded-lg">
        <Info className="w-5 h-5 text-amber-500 shrink-0" />
        <p className="text-[11px] text-amber-200/80 leading-tight italic">
          <span className="font-bold text-amber-500 uppercase">Attention :</span> Soyez le plus précis possible. Une mauvaise adresse peut entraîner la perte de votre colis ou des frais de stockage supplémentaires en agence.
        </p>
      </div>
    </div>
  );
};