import React from 'react';
import { MapPin, Home, Building2, Truck, AlertTriangle, ChevronDown } from 'lucide-react';
import { cn } from "@/lib/utils";

interface ShippingFormProps {
  data: { ville: string; details: string; agenceId: string };
  onChange: (field: string, value: string) => void;
  agences: any[];
}

export const ShippingForm = ({ data, onChange, agences }: ShippingFormProps) => {
  return (
    <div className="relative w-full space-y-4 md:space-y-6 p-4 md:p-8 bg-secondary border-2 border-border rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-500">
      
      {/* RAIL DE FLUX LOGISTIQUE (Visuel dynamique) */}
      <div className="absolute top-0 left-0 w-1 md:w-1.5 h-full bg-gradient-to-b from-primary/40 via-primary/5 to-transparent" />

      {/* HEADER : IDENTITÉ DU PROTOCOLE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pl-2">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 rounded-xl border border-primary/20 shrink-0 shadow-inner">
            <Truck size={20} className="text-primary md:w-6 md:h-6" />
          </div>
          <div className="min-w-0">
            <h3 className="font-display font-black italic uppercase text-base md:text-xl tracking-tighter text-foreground leading-none truncate">
              DESTINATION_COLIS
            </h3>
            <p className="font-tech text-[7px] md:text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] md:tracking-[0.4em] mt-1.5 italic opacity-70">
              LOG_PROTOCOL_ITURI_2.1
            </p>
          </div>
        </div>
        
        {/* Badge Status - Auto-hide sur très petits écrans */}
        <div className="hidden xs:flex items-center gap-2 px-3 py-1.5 bg-background/50 backdrop-blur-sm border border-border rounded-full self-start sm:self-center">
          <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse shadow-[0_0_8px_rgba(var(--primary),0.6)]" />
          <span className="font-tech text-[8px] font-black text-primary uppercase italic tracking-tighter">READY_TO_SHIP</span>
        </div>
      </div>

      {/* GRILLE D'INPUTS INTELLIGENTE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 pl-2">
        
        {/* LOCALITÉ CIBLE */}
        <div className="group space-y-2">
          <label className="font-tech text-[8px] md:text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.2em] ml-1 italic transition-colors group-focus-within:text-primary/50">
            _Localité_Cible
          </label>
          <div className="relative">
            <Home className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/20 group-focus-within:text-primary transition-all duration-300" />
            <input
              type="text"
              placeholder="BUNIA, GOMA, KOMANDA..."
              className="w-full h-12 md:h-14 bg-background border-2 border-border rounded-xl md:rounded-2xl pl-12 pr-4 font-tech text-[11px] md:text-xs italic uppercase text-foreground focus:border-primary transition-all outline-none shadow-inner tracking-widest placeholder:text-muted-foreground/20"
              value={data.ville}
              onChange={(e) => onChange('ville', e.target.value)}
            />
          </div>
        </div>

        {/* POINT RELAIS (SELECT OPTIMISÉ) */}
        <div className="group space-y-2">
          <label className="font-tech text-[8px] md:text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.2em] ml-1 italic transition-colors group-focus-within:text-primary/50">
            _Point_Relais_Optionnel
          </label>
          <div className="relative">
            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/20 group-focus-within:text-primary transition-all duration-300" />
            <select
              className="w-full h-12 md:h-14 bg-background border-2 border-border rounded-xl md:rounded-2xl pl-12 pr-10 font-tech text-[10px] md:text-xs italic uppercase text-foreground focus:border-primary transition-all outline-none appearance-none cursor-pointer truncate shadow-inner"
              value={data.agenceId}
              onChange={(e) => onChange('agenceId', e.target.value)}
            >
              <option value="" className="bg-secondary text-muted-foreground">_CHOISIR_PLUS_TARD</option>
              {agences.map((ag) => (
                <option key={ag.id} value={ag.id} className="bg-secondary text-foreground">
                  {ag.nom}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/30 pointer-events-none group-focus-within:text-primary transition-colors" />
          </div>
        </div>
      </div>

      {/* COORDONNÉES PRÉCISES (TEXTAREA FLEXIBLE) */}
      <div className="group space-y-2 pl-2">
        <label className="font-tech text-[8px] md:text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.2em] ml-1 italic transition-colors group-focus-within:text-primary/50">
          _Précisions_Géographiques
        </label>
        <div className="relative">
          <MapPin className="absolute left-4 top-4 w-4 h-4 text-muted-foreground/20 group-focus-within:text-primary transition-all duration-300" />
          <textarea
            placeholder="AVENUE, QUARTIER, RÉFÉRENCE PHYSIQUE..."
            className="w-full h-28 md:h-36 bg-background border-2 border-border rounded-xl md:rounded-2xl pl-12 pr-4 pt-3.5 font-tech text-[10px] md:text-xs italic uppercase text-foreground focus:border-primary transition-all outline-none resize-none shadow-inner leading-relaxed placeholder:text-muted-foreground/20"
            value={data.details}
            onChange={(e) => onChange('details', e.target.value)}
          />
        </div>
      </div>

      {/* ALERT CONTEXTUELLE (Look Industriel) */}
      <div className="ml-2 p-4 bg-primary/5 border-2 border-primary/10 rounded-2xl md:rounded-[1.5rem] flex gap-4 items-start group/alert">
        <div className="mt-0.5 p-1.5 bg-primary/10 rounded-lg shrink-0">
          <AlertTriangle className="w-4 h-4 md:w-5 md:h-5 text-primary animate-pulse group-hover/alert:rotate-12 transition-transform" />
        </div>
        <div className="space-y-1.5 min-w-0">
          <h4 className="font-tech text-[9px] md:text-[11px] font-black text-primary uppercase italic tracking-widest leading-none">
            AVERTISSEMENT_COORDONNÉES
          </h4>
          <p className="font-tech text-[8px] md:text-[10px] text-foreground/60 leading-snug italic uppercase tracking-tighter max-w-[400px]">
            L'injection de données erronées entraîne la <span className="text-primary font-black underline decoration-primary/30">perte_totale</span> du colis ou des frais de stockage_node.
          </p>
        </div>
      </div>

      {/* DÉCOR DE FOND */}
      <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-primary/5 blur-[60px] rounded-full pointer-events-none" />
    </div>
  );
};