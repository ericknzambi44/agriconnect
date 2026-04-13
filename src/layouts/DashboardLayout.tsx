import React, { useState } from 'react'; 
import { Outlet, Navigate } from 'react-router-dom';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Topbar } from '@/components/dashboard/Topbar';
import { Loader2, Zap } from 'lucide-react';
import { useAuthSession } from '@/features/auth/hooks/use-auth-session';
import { cn } from "@/lib/utils";

export default function DashboardLayout() {
  const { profile, isLoading } = useAuthSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- ÉTAT 1 : SPLASH SCREEN TERMINAL (BOOT SEQUENCE) ---
  if (isLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#020202] relative overflow-hidden font-tech">
        {/* Grille de fond subtile */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative mb-10">
            <div className="absolute inset-0 blur-3xl bg-emerald-500/30 animate-pulse rounded-full" />
            <Zap className="w-12 h-12 text-emerald-500 relative animate-bounce" />
          </div>

          <div className="space-y-4 text-center">
            <h2 className="text-[10px] font-black text-emerald-500/50 uppercase tracking-[0.6em] animate-pulse">
              AgriConnect
            </h2>
            <div className="flex flex-col items-center gap-2">
              <span className="text-[9px] text-white/40 uppercase tracking-widest">Initialisation...</span>
              <div className="w-64 h-[2px] bg-white/5 rounded-full overflow-hidden relative">
                <div className="absolute inset-0 bg-emerald-500/20" />
                <div className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,1)] transition-all duration-500 w-1/3 animate-[loading_2s_infinite]" />
              </div>
            </div>
          </div>
        </div>

        {/* Déco d'angle technique */}
        <div className="absolute bottom-10 left-10 text-[8px] text-white/10 uppercase tracking-widest">
          Sector_Bunia 
        </div>
      </div>
    );
  }

  // --- ÉTAT 2 : SÉCURITÉ ---
  if (!profile) {
    return <Navigate to="/login" replace />;
  }

  // --- ÉTAT 3 : RENDER LAYOUT ELITE ---
  return (
    <div className="flex h-screen bg-[#020202] overflow-hidden font-sans selection:bg-emerald-500/30 selection:text-white">
      
      {/* 1. SIDEBAR (Fixed Left) */}
      <Sidebar 
        role={profile.role} 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />

      {/* OVERLAY MOBILE (Glass Noir) */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 lg:hidden animate-in fade-in duration-500"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* 2. ZONE DE CONTENU (Scrollable) */}
      <div className={cn(
        "flex-1 flex flex-col min-w-0 relative h-full transition-all duration-500",
        "lg:ml-72" // Aligné sur la largeur de la sidebar
      )}>
        
        {/* 3. TOPBAR (Fixed Top) */}
        <Topbar 
          user={profile} 
          onMenuClick={() => setIsMobileMenuOpen(true)} 
        />

        {/* 4. MAIN CONTENT AREA */}
        <main className="flex-1 overflow-y-auto relative no-scrollbar bg-[#020202]">
          
          {/* Gradients de Profondeur (Atmosphère) */}
          <div className="fixed inset-0 pointer-events-none">
            {/* Lueur Émeraude en haut à droite */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
            {/* Lueur de base en bas à gauche */}
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/2 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/4" />
          </div>

          {/* Grain de texture pour le look "Mat" */}
          <div className="fixed inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] mix-blend-overlay" />

          {/* Wrapper du contenu de l'Outlet */}
          <div className="relative z-10 p-4 sm:p-10 pt-28 lg:pt-32 max-w-[1600px] mx-auto min-h-full">
             <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]">
                <Outlet />
             </div>
          </div>

          {/* Footer discret dans le main (Optionnel) */}
          <footer className="p-10 text-center opacity-10">
            <p className="font-tech text-[8px] uppercase tracking-[0.5em]">AgriConnect</p>
          </footer>
        </main>

      </div>
    </div>
  );
}