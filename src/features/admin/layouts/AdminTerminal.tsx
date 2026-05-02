// src/features/admin/layouts/AdminTerminal.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from '../components/AdminSidebar';
import { useAdminCore } from '../hooks/use-admin-core';
import { Loader2 } from 'lucide-react';

export default function AdminTerminal() {
  const { isSyncing, isAuthenticated } = useAdminCore();

  if (isSyncing) {
    return (
      <div className="h-screen bg-[#050505] flex flex-col items-center justify-center">
        <Loader2 className="text-primary animate-spin mb-4" size={40} />
        <p className="font-tech text-[10px] text-white/20 uppercase tracking-[0.5em] animate-pulse">Syncing_Database...</p>
      </div>
    );
  }

  // Si non authentifié, le hook useAdminCore redirigera vers /admin/login automatiquement
  if (!isAuthenticated) return null;

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden font-sans">
      <AdminSidebar />
      
      <main className="flex-1 overflow-y-auto relative">
        {/* Background Gradient Effect */}
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/5 blur-[120px] rounded-full -z-10" />
        
        <div className="p-8 lg:p-12 max-w-7xl mx-auto">
          {/* C'est ici que les pages AdminOverview, AdminAgencies, etc. s'afficheront */}
          <Outlet />
        </div>
      </main>
    </div>
  );
}