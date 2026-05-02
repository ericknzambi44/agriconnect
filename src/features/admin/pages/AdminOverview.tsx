// src/features/admin/pages/AdminOverview.tsx
import React from 'react';
import { AdminStatGrid } from '../components/AdminStatGrid';
import { AdminActivityTable } from '../components/AdminActivityTable';

export default function AdminOverview() {
  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <header>
        <h2 className="text-4xl font-display font-black italic uppercase text-white tracking-tighter">Dash<span className="text-primary">board</span></h2>
        <p className="text-white/20 font-tech text-[10px] uppercase tracking-[0.5em] mt-1">Status_Check: Normal_Operation</p>
      </header>

      <AdminStatGrid />
      
      <div className="grid grid-cols-1 gap-8">
        <AdminActivityTable />
      </div>
    </div>
  );
}