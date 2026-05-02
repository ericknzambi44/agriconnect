// src/features/admin/components/AgencyNetworkMap.tsx
import React from 'react';
import { useAgencyManager } from '../hooks/use-agency-manager';
import { MapPin, Users, Settings2, Trash2, Plus } from 'lucide-react';

export const AgencyNetworkMap = () => {
  const { agencies, loading, deleteAgency } = useAgencyManager();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h3 className="font-display font-black italic text-2xl text-white uppercase tracking-tighter">
            Réseau_<span className="text-primary">Agences</span>
          </h3>
          <p className="text-[9px] font-tech text-white/20 uppercase tracking-[0.4em]">Infrastructure_Nodes</p>
        </div>
        <button className="flex items-center gap-2 bg-primary px-4 py-2 rounded-xl text-black font-black text-[10px] uppercase italic hover:scale-105 transition-transform">
          <Plus size={14} /> Déployer Agence
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {loading ? (
           <div className="col-span-full py-20 text-center font-tech text-white/10 animate-pulse uppercase tracking-widest text-xs">Scanning_Network...</div>
        ) : agencies.map((agency) => (
          <div key={agency.id} className="group bg-[#0A0A0A] border border-white/5 p-6 rounded-[2rem] hover:border-primary/30 transition-all">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-primary/10 transition-colors">
                <MapPin className="text-primary" size={20} />
              </div>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-white/5 rounded-lg text-white/20 hover:text-white transition-colors">
                  <Settings2 size={16} />
                </button>
                <button 
                  onClick={() => deleteAgency(agency.id)}
                  className="p-2 hover:bg-red-500/10 rounded-lg text-white/20 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <h4 className="text-lg font-bold text-white uppercase italic tracking-tight mb-1">{agency.nom}</h4>
            <p className="text-[10px] text-white/30 font-medium mb-4 flex items-center gap-2">
               <span className="w-1 h-1 rounded-full bg-primary animate-pulse" /> {agency.adresse}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <div className="flex items-center gap-2">
                <Users size={14} className="text-white/20" />
                <span className="text-[10px] font-tech text-white/40">
                  STAFF: <span className="text-white">{agency.staff_count[0]?.count || 0}</span>
                </span>
              </div>
              <button className="text-[9px] font-black uppercase italic text-primary hover:underline underline-offset-4">
                Gérer le personnel →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};