// src/layouts/DashboardLayout.tsx
import React, { useState } from 'react'; 
import { Outlet, Navigate } from 'react-router-dom';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Topbar } from '@/components/dashboard/Topbar';
import { Loader2 } from 'lucide-react';
import { useAuthSession } from '@/features/auth/hooks/use-auth-session';

export default function DashboardLayout() {
  const { profile, isLoading } = useAuthSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- ÉTAT 1 : CHARGEMENT (Splash Screen Terminal) ---
  if (isLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#050505]">
        <div className="relative">
          <Loader2 className="w-16 h-16 text-emerald-500 animate-spin" />
          <div className="absolute inset-0 blur-2xl bg-emerald-500/20 animate-pulse rounded-full"></div>
        </div>
        <h2 className="mt-8 text-sm font-black text-emerald-500 uppercase italic tracking-[0.4em] animate-pulse">
          Initialisation Matrice...
        </h2>
        <div className="mt-2 w-48 h-[1px] bg-white/5 overflow-hidden">
          <div className="w-full h-full bg-emerald-500 animate-[loading_2s_infinite]" />
        </div>
      </div>
    );
  }

  // --- ÉTAT 2 : SÉCURITÉ ---
  if (!profile) {
    return <Navigate to="/login" replace />;
  }

  // --- ÉTAT 3 : RENDER ---
  return (
    <div className="flex h-screen bg-[#050505] overflow-hidden font-sans selection:bg-emerald-500/30 selection:text-white">
      
      {/* 1. SIDEBAR */}
      <Sidebar 
        role={profile.role} 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />

      {/* Overlay mobile style "Glass" noir */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-40 lg:hidden animate-in fade-in duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* 2. ZONE DE DROITE */}
      <div className="flex-1 flex flex-col min-w-0 relative h-full transition-all duration-500 lg:ml-72">
        
        {/* 3. TOPBAR */}
        <Topbar 
          user={profile} 
          onMenuClick={() => setIsMobileMenuOpen(true)} 
        />

        {/* 4. MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto relative custom-scrollbar bg-[#050505]">
          <div className="p-4 sm:p-8 pt-28 lg:pt-32 max-w-7xl mx-auto min-h-full relative z-10">
             <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out">
                <Outlet />
             </div>
          </div>

          {/* Effet visuel Radial Gradient Émeraude (Top Right) */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_0%,_rgba(16,185,129,0.08)_0%,_transparent_50%)]"></div>
          
          {/* Effet visuel Radial Gradient Émeraude (Bottom Left) */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_100%,_rgba(16,185,129,0.03)_0%,_transparent_40%)]"></div>
          
          {/* Noise Texture (Subtile) */}
          <div className="pointer-events-none absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
        </main>

      </div>
    </div>
  );
}