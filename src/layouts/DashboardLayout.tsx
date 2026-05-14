import React, { useState } from 'react'; 
import { Outlet, Navigate } from 'react-router-dom';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Topbar } from '@/components/dashboard/Topbar';
import { Zap } from 'lucide-react';
import { useAuthSession } from '@/features/auth/hooks/use-auth-session';

export default function DashboardLayout() {
  const { profile, isLoading } = useAuthSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#050505] to-black p-4">
        <div className="relative">
          <Zap className="w-12 h-12 text-primary animate-pulse mb-4" />
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-ping" />
        </div>
        <h2 className="font-tech text-[clamp(8px,2vw,10px)] text-primary uppercase tracking-[0.5em] text-center">
          Chargement AgriConnect...
        </h2>
      </div>
    );
  }

  if (!profile) return <Navigate to="/login" replace />;

  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-[#0a0a0a] via-[#050505] to-black overflow-hidden font-sans relative">
      
      {/* 1. SIDEBAR */}
      <Sidebar 
        role={profile.role} 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />

      {/* 2. WRAPPER PRINCIPAL */}
      <div className="flex-1 flex flex-col min-w-0 h-full lg:pl-72 transition-all duration-300">
        
        {/* TOPBAR : avec transparence et bordure lumineuse */}
        <header className="h-20 w-full flex-shrink-0 z-[50] border-b border-white/10 bg-black/40 backdrop-blur-md">
          <Topbar 
            user={profile} 
            onMenuClick={() => setIsMobileMenuOpen(true)} 
          />
        </header>

        {/* 3. ZONE DE SCROLL */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden relative no-scrollbar flex flex-col">
          
          {/* FOND D'ÉCRAN AVEC GRILLE TECHNIQUE */}
          <div className="absolute inset-0 pointer-events-none z-0">
            <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(var(--color-border)_1px,transparent_1px),linear-gradient(90deg,var(--color-border)_1px,transparent_1px)] bg-[size:clamp(20px,5vw,40px)_clamp(20px,5vw,40px)]" />
            {/* Dégradé radial subtil pour la profondeur */}
            <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent" />
          </div>

          {/* CONTENU PRINCIPAL : pleine largeur avec padding léger */}
          <div className="relative z-10 w-full min-h-full flex flex-col flex-1">
            <div className="flex-1 w-full px-4 sm:px-6 md:px-8 lg:px-10 pt-6 md:pt-8 pb-10">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        /* Animation de rotation pour le gradient radial */
        .bg-gradient-radial {
          background-image: radial-gradient(circle at 50% 0%, var(--tw-gradient-stops));
        }
        
        /* Assure que les éléments ne cassent pas le layout */
        * {
          min-width: 0;
          word-wrap: break-word;
        }
      `}</style>
    </div>
  );
}