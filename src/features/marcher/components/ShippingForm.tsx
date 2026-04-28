import React from 'react';
import { MapPin, Home, Building2, Truck, AlertTriangle, ChevronDown, Info } from 'lucide-react';
import { cn } from "@/lib/utils";

interface ShippingFormProps {
  data: { ville: string; details: string; agenceId: string };
  onChange: (field: string, value: string) => void;
  agences: any[];
}

export const ShippingForm = ({ data, onChange, agences }: ShippingFormProps) => {
  return (
    <div className="relative w-full space-y-6 md:space-y-8 p-5 md:p-10 bg-secondary/40 border-2 border-white/10 rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl transition-all duration-500">
      
      {/* RAIL DE FLUX LOGISTIQUE */}
      <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-primary/60 via-primary/10 to-transparent" />

      {/* HEADER : IDENTITÉ DU PROTOCOLE (Agrandi) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pl-3">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/20 rounded-2xl border border-primary/30 shrink-0 shadow-glow-primary/10">
            <Truck size={28} className="text-primary" />
          </div>
          <div className="min-w-0">
            <h3 className="font-display font-black italic uppercase text-lg md:text-2xl tracking-tighter text-white leading-none">
              COORDONNÉES_<span className="text-primary">LIVRAISON</span>
            </h3>
           
          </div>
        </div>
        
        <div className="flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl self-start sm:self-center">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_10px_rgba(var(--primary),0.8)]" />
          <span className="font-tech text-[10px] font-black text-white uppercase italic tracking-wider">ACTIVE_NODE</span>
        </div>
      </div>

      {/* GRILLE D'INPUTS : Labels clairs et inputs larges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 pl-3">
        
        {/* LOCALITÉ CIBLE */}
        <div className="group space-y-3">
          <div className="flex items-center gap-2 ml-1">
            <div className="w-1 h-3 bg-primary rounded-full" />
            <label className="font-tech text-[10px] md:text-[12px] font-black text-white uppercase tracking-widest italic group-focus-within:text-primary transition-colors">
              VILLE_DESTINATION
            </label>
          </div>
          <div className="relative">
            <Home className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/30 group-focus-within:text-primary transition-all duration-300" />
            <input
              type="text"
              placeholder="EX: BUNIA, GOMA, BUTEMBO..."
              className="w-full h-14 md:h-16 bg-black/40 border-2 border-white/5 rounded-2xl pl-14 pr-6 font-tech text-sm md:text-base italic uppercase text-white focus:border-primary transition-all outline-none tracking-widest placeholder:opacity-20"
              value={data.ville}
              onChange={(e) => onChange('ville', e.target.value)}
            />
          </div>
        </div>

        {/* POINT RELAIS */}
        <div className="group space-y-3">
          <div className="flex items-center gap-2 ml-1">
            <div className="w-1 h-3 bg-primary rounded-full" />
            <label className="font-tech text-[10px] md:text-[12px] font-black text-white uppercase tracking-widest italic group-focus-within:text-primary transition-colors">
              AGENCE_DE_RETRAIT
            </label>
          </div>
          <div className="relative">
            <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/30 group-focus-within:text-primary transition-all duration-300" />
            <select
              className="w-full h-14 md:h-16 bg-black/40 border-2 border-white/5 rounded-2xl pl-14 pr-12 font-tech text-xs md:text-sm italic uppercase text-white focus:border-primary transition-all outline-none appearance-none cursor-pointer truncate shadow-inner"
              value={data.agenceId}
              onChange={(e) => onChange('agenceId', e.target.value)}
            >
              <option value="" className="bg-[#0a0a0a] text-muted-foreground">_SÉLECTIONNER_UNE_AGENCE</option>
              {agences.map((ag) => (
                <option key={ag.id} value={ag.id} className="bg-[#0a0a0a] text-white">
                  {ag.nom}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/40 pointer-events-none group-focus-within:rotate-180 transition-transform duration-300" />
          </div>
        </div>
      </div>

      {/* COORDONNÉES PRÉCISES (TEXTAREA) */}
      <div className="group space-y-3 pl-3">
        <div className="flex items-center gap-2 ml-1">
          <div className="w-1 h-3 bg-primary rounded-full" />
          <label className="font-tech text-[10px] md:text-[12px] font-black text-white uppercase tracking-widest italic group-focus-within:text-primary transition-colors">
            PRÉCISIONS_ADRESSE_&_RÉFÉRENCES
          </label>
        </div>
        <div className="relative">
          <MapPin className="absolute left-5 top-5 w-5 h-5 text-muted-foreground/30 group-focus-within:text-primary transition-all duration-300" />
          <textarea
            placeholder="AVENUE, QUARTIER, NUMÉRO, RÉFÉRENCE PHYSIQUE (EX: EN FACE DE L'ÉCOLE...)"
            className="w-full h-32 md:h-44 bg-black/40 border-2 border-white/5 rounded-2xl pl-14 pr-6 pt-5 font-tech text-xs md:text-sm italic uppercase text-white focus:border-primary transition-all outline-none resize-none leading-relaxed placeholder:opacity-20"
            value={data.details}
            onChange={(e) => onChange('details', e.target.value)}
          />
        </div>
      </div>

      {/* ALERT CONTEXTUELLE : Très visible pour la sécurité */}
      <div className="ml-3 p-5 bg-primary/10 border-2 border-primary/20 rounded-[1.5rem] md:rounded-[2rem] flex gap-5 items-start group/alert shadow-[0_0_20px_rgba(var(--primary),0.05)]">
        <div className="mt-1 p-2 bg-primary/20 rounded-xl shrink-0">
          <AlertTriangle className="w-6 h-6 text-primary animate-pulse group-hover/alert:scale-110 transition-transform" />
        </div>
        <div className="space-y-2 min-w-0">
          <h4 className="font-tech text-[11px] md:text-[13px] font-black text-primary uppercase italic tracking-[0.2em] leading-none">
            AVERTISSEMENT_COORDONNÉES_CRITIQUES
          </h4>
          <p className="font-tech text-[10px] md:text-[12px] text-white/70 leading-relaxed italic uppercase tracking-tight">
            Toute erreur dans ces informations entraînera une <span className="text-primary font-black underline decoration-primary/40 underline-offset-4">INTERRUPTION_FLUX</span> et des frais de stockage supplémentaires sur le Node de destination.
          </p>
        </div>
      </div>

      {/* DÉCOR DE FOND TECH */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 blur-[80px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-20 -left-10 w-40 h-40 bg-primary/5 blur-[80px] rounded-full pointer-events-none" />
    </div>
  );
};