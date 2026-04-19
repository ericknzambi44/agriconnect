// DashboardLayout.tsx
import React, { useState } from 'react'; 
import { Outlet, Navigate } from 'react-router-dom';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Topbar } from '@/components/dashboard/Topbar';
import { Zap } from 'lucide-react';
import { useAuthSession } from '@/features/auth/hooks/use-auth-session';
import { cn } from "@/lib/utils";

export default function DashboardLayout() {
  const { profile, isLoading } = useAuthSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#020202] relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative mb-10">
            <div className="absolute inset-0 blur-3xl bg-emerald-500/30 animate-pulse rounded-full" />
            <Zap className="w-12 h-12 text-emerald-500 relative animate-bounce" />
          </div>
          <div className="space-y-4 text-center">
            <h2 className="text-[10px] font-black text-emerald-500/50 uppercase tracking-[0.6em] animate-pulse">AgriConnect</h2>
            <div className="flex flex-col items-center gap-2">
              <span className="text-[9px] text-white/40 uppercase tracking-widest">Initialisation du système...</span>
              <div className="w-64 h-[2px] bg-white/5 rounded-full overflow-hidden relative">
                <div className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,1)] w-1/3 animate-[loading_2s_infinite]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) return <Navigate to="/login" replace />;

  return (
    <div className="flex h-screen w-full bg-[#020202] overflow-hidden font-sans selection:bg-emerald-500/30">
      
      {/* 1. SIDEBAR : Fixée à gauche */}
      <Sidebar 
        role={profile.role} 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />

      {/* OVERLAY MOBILE */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[45] lg:hidden animate-in fade-in duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* 2. WRAPPER DE DROITE (Topbar + Main) */}
      {/* On applique lg:pl-72 ici pour que TOUT ce qui est à droite respecte la largeur de la sidebar */}
      <div className="flex-1 flex flex-col min-w-0 h-full lg:pl-72 transition-all duration-300">
        
        {/* TOPBAR : Sticky en haut de sa zone */}
        <header className="sticky top-0 z-[40] w-full flex-shrink-0">
          <Topbar 
            user={profile} 
            onMenuClick={() => setIsMobileMenuOpen(true)} 
          />
        </header>

        {/* 3. ZONE DE SCROLL PRINCIPALE */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden relative no-scrollbar bg-[#020202]">
          
          {/* FX DE FOND (Gradients & Grain) - Positionné par rapport au main */}
          <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
             <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/[0.03] blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4" />
             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] mix-blend-overlay" />
          </div>

          {/* CONTENU RÉEL */}
          <div className="relative z-10 w-full min-h-full flex flex-col">
            <div className="flex-1 max-w-[1600px] w-full mx-auto p-4 sm:p-8 lg:p-10">
               
               <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
                  <Outlet />
               </div>

            </div>

            {/* Footer discret */}
            <footer className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-10 pb-10 pt-20 flex justify-between items-center opacity-20">
              <p className="font-mono text-[7px] uppercase tracking-[0.8em]">AgriConnect_OS v2.0</p>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent mx-10" />
              <p className="font-mono text-[7px] uppercase tracking-[0.3em]">Sector_Bunia</p>
            </footer>
          </div>
        </main>
      </div>
      
      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}