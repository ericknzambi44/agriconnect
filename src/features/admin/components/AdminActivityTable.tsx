// src/features/admin/components/AdminActivityTable.tsx
import React from 'react';
import { useAdminActivity } from '../hooks/use-admin-activity';

export const AdminActivityTable = () => {
  const { activities, loading } = useAdminActivity();

  return (
    <div className="bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] p-8">
      <h3 className="font-display font-black italic text-xl text-white uppercase mb-6 tracking-tighter">
        Flux_<span className="text-primary">Récent</span>
      </h3>
      
      <div className="space-y-4">
        {loading ? (
          <div className="text-center font-tech text-[10px] text-white/10 py-10 tracking-[0.5em]">Fetching_Data...</div>
        ) : activities.map((act) => (
          <div key={act.id} className="flex items-center justify-between p-4 border-b border-white/5 hover:bg-white/[0.01] transition-colors">
            <div>
              <p className="text-[10px] font-bold text-white uppercase">{act.tracking_number}</p>
              <p className="text-[9px] font-tech text-white/30 tracking-widest">
                PAR: {act.utilisateurs?.prenom} {act.utilisateurs?.nom}
              </p>
            </div>
            <span className={`text-[8px] font-black px-3 py-1 rounded-full uppercase italic ${
              act.statut === 'EN_TRANSIT' ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-white/5 text-white/40'
            }`}>
              {act.statut}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};