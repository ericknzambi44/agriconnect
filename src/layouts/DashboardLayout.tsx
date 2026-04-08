// src/layouts/DashboardLayout.tsx
import React, { useState } from 'react'; // NOUVEAU : Import de useState
import { Outlet, Navigate } from 'react-router-dom';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Topbar } from '@/components/dashboard/Topbar';
import { Loader2 } from 'lucide-react';
import { useAuthSession } from '@/features/auth/hooks/use-auth-session';

export default function DashboardLayout() {
  const { profile, isLoading } = useAuthSession();
  
  // NOUVEAU : État pour gérer l'ouverture du menu sur mobile
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- ÉTAT 1 : CHARGEMENT ---
  if (isLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-background">
        <div className="relative">
          <Loader2 className="w-16 h-16 text-primary animate-spin" />
          <div className="absolute inset-0 blur-xl bg-primary/20 animate-pulse rounded-full"></div>
        </div>
        <h2 className="mt-6 text-xl font-black text-glow-green uppercase italic tracking-[0.2em] animate-pulse">
          Initialisation Terminal...
        </h2>
      </div>
    );
  }

  // --- ÉTAT 2 : SÉCURITÉ ---
  if (!profile) {
    return <Navigate to="/login" replace />;
  }

  // --- ÉTAT 3 : RENDER ---
  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans selection:bg-primary/30">
      
      {/* 1. SIDEBAR (Fixe à gauche, caché sur mobile sauf si isMobileMenuOpen est true) */}
      {/* NOUVEAU : On passe l'état et la fonction de fermeture */}
      <Sidebar 
        role={profile.role} 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />

      {/* NOUVEAU : Overlay sombre pour fermer le menu sur mobile en cliquant à côté */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-200"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* 2. ZONE DE DROITE (Décalée dynamiquement) */}
      <div className="flex-1 flex flex-col min-w-0 relative h-full transition-all duration-300
        /* lg:ml-72 : On crée l'espace pour le sidebar uniquement sur Desktop */
        lg:ml-72">
        
        {/* 3. TOPBAR (S'adapte à la largeur du conteneur parent) */}
        {/* NOUVEAU : On passe la fonction pour ouvrir le menu */}
        <Topbar 
          user={profile} 
          onMenuClick={() => setIsMobileMenuOpen(true)} 
        />

        {/* 4. MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto relative custom-scrollbar bg-[#0a0a0a]">
          {/* pt-28 : On descend le contenu pour qu'il soit bien SOUS la Topbar (h-20) */}
          <div className="p-4 sm:p-8 pt-28 lg:pt-32 max-w-7xl mx-auto min-h-full relative z-10">
             <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
                <Outlet />
             </div>
          </div>

          {/* Effet visuel Radial Gradient en fond pour le look Élite */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--color-primary)_0%,_transparent_40%)] opacity-20"></div>
          
          {/* Noise Texture */}
          <div className="pointer-events-none absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02]"></div>
        </main>

      </div>
    </div>
  );
}