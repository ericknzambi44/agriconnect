import React from 'react';
import { MapPin, Info, Home, Building2, Truck, AlertTriangle } from 'lucide-react';
import { cn } from "@/lib/utils";

interface ShippingFormProps {
  data: { ville: string; details: string; agenceId: string };
  onChange: (field: string, value: string) => void;
  agences: any[];
}

export const ShippingForm = ({ data, onChange, agences }: ShippingFormProps) => {
  return (
    <div className="space-y-5 p-6 bg-secondary border-2 border-border rounded-[2rem] relative overflow-hidden shadow-2xl">
      
      {/* INDICATEUR DE FLUX */}
      <div className="absolute top-0 left-0 w-1.5 h-full bg-primary/20" />

      {/* HEADER : STATUS LOGISTIQUE */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
            <Truck size={18} className="text-primary" />
          </div>
          <div>
            <h3 className="font-display font-black italic uppercase text-lg tracking-tighter text-foreground leading-none">
              DESTINATION_COLIS
            </h3>
            <p className="font-tech text-[8px] font-black text-muted-foreground uppercase tracking-[0.3em] mt-1 italic">Protocol_Logistique_v2.1</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-background border border-border rounded-full">
          <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
          <span className="font-tech text-[8px] font-black text-primary uppercase italic">Ready_to_ship</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* VILLE / TERRITOIRE */}
        <div className="space-y-2">
          <label className="font-tech text-[9px] font-black text-muted-foreground/50 uppercase tracking-widest ml-1 italic">_Localité_Cible</label>
          <div className="relative group">
            <Home className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/30 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="BUNIA, KOMANDA, GOMA..."
              className="w-full h-12 bg-background border-2 border-border rounded-xl pl-12 pr-4 font-tech text-xs italic uppercase text-foreground focus:border-primary transition-all outline-none shadow-inner"
              value={data.ville}
              onChange={(e) => onChange('ville', e.target.value)}
            />
          </div>
        </div>

        {/* AGENCE DE RETRAIT */}
        <div className="space-y-2">
          <label className="font-tech text-[9px] font-black text-muted-foreground/50 uppercase tracking-widest ml-1 italic">_Point_Relais_Optionnel</label>
          <div className="relative group">
            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/30 group-focus-within:text-primary transition-colors" />
            <select
              className="w-full h-12 bg-background border-2 border-border rounded-xl pl-12 pr-10 font-tech text-xs italic uppercase text-foreground focus:border-primary transition-all outline-none appearance-none cursor-pointer"
              value={data.agenceId}
              onChange={(e) => onChange('agenceId', e.target.value)}
            >
              <option value="" className="bg-secondary text-muted-foreground italic tracking-widest uppercase text-[10px]">_Choisir_Plus_Tard</option>
              {agences.map((ag) => (
                <option key={ag.id} value={ag.id} className="bg-secondary text-foreground uppercase text-[10px]">
                  {ag.nom} [{ag.ville_territoire}]
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground/20 italic font-tech text-[10px]">SELECT</div>
          </div>
        </div>
      </div>

      {/* PRÉCISIONS DÉTAILLÉES */}
      <div className="space-y-2">
        <label className="font-tech text-[9px] font-black text-muted-foreground/50 uppercase tracking-widest ml-1 italic">_Coordonnées_Précises</label>
        <div className="relative group">
          <MapPin className="absolute left-4 top-4 w-4 h-4 text-muted-foreground/30 group-focus-within:text-primary transition-colors" />
          <textarea
            placeholder="QUARTIER, AVENUE, RÉFÉRENCE PHYSIQUE..."
            className="w-full h-24 bg-background border-2 border-border rounded-xl pl-12 pr-4 pt-3.5 font-tech text-xs italic uppercase text-foreground focus:border-primary transition-all outline-none resize-none shadow-inner leading-relaxed"
            value={data.details}
            onChange={(e) => onChange('details', e.target.value)}
          />
        </div>
      </div>

      {/* SYSTEM ALERT : LOOK CONGO CONTEXT */}
      <div className="p-4 bg-primary/5 border-2 border-primary/10 rounded-2xl flex gap-4 items-start">
        <div className="mt-1">
          <AlertTriangle className="w-5 h-5 text-primary animate-pulse" />
        </div>
        <div className="space-y-1">
          <h4 className="font-tech text-[10px] font-black text-primary uppercase italic tracking-widest leading-none">AVERTISSEMENT_COORDONNÉES</h4>
          <p className="font-tech text-[9px] text-foreground/60 leading-tight italic uppercase tracking-tighter">
            L'injection de données erronées peut causer la <span className="text-primary font-black underline">perte_totale</span> du colis ou des frais de stockage_node supplémentaires.
          </p>
        </div>
      </div>

      {/* BACKGROUND DECOR */}
      <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-primary/5 blur-[50px] rounded-full pointer-events-none" />
    </div>
  );
};