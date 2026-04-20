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
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[hsl(var(--background))]">
        <Zap className="w-12 h-12 text-primary animate-bounce mb-4" />
        <h2 className="font-tech text-[10px] text-primary uppercase tracking-[0.5em]">Chargement_AgriConnect...</h2>
      </div>
    );
  }

  if (!profile) return <Navigate to="/login" replace />;

  return (
    <div className="flex h-screen w-full bg-[hsl(var(--background))] overflow-hidden font-sans">
      
      {/* 1. SIDEBAR : Fixe à gauche */}
      <Sidebar 
        role={profile.role} 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />

      {/* 2. WRAPPER PRINCIPAL (Contenu à droite de la Sidebar) */}
      <div className="flex-1 flex flex-col min-w-0 h-full lg:pl-72">
        
        {/* TOPBAR : On lui donne une hauteur fixe (h-20) pour bien délimiter */}
        <header className="h-20 w-full flex-shrink-0 z-[50] border-b border-border bg-secondary/80 backdrop-blur-md">
          <Topbar 
            user={profile} 
            onMenuClick={() => setIsMobileMenuOpen(true)} 
          />
        </header>

        {/* 3. ZONE DE SCROLL : On s'assure qu'elle prend tout l'espace restant */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden relative no-scrollbar">
          
          {/* FX DE FOND NETS (On les baisse en z-index pour ne pas gêner) */}
          <div className="absolute inset-0 pointer-events-none z-0">
             <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(var(--color-border)_1px,transparent_1px),linear-gradient(90deg,var(--color-border)_1px,transparent_1px)] bg-[size:40px_40px]" />
          </div>

          {/* CONTENU : Ici on ajoute le padding-top (pt-12) pour décoller de la topbar */}
          <div className="relative z-10 w-full min-h-full flex flex-col">
            <div className="flex-1 max-w-[1600px] w-full mx-auto px-6 pt-12 pb-20 sm:px-10 lg:px-14">
               
               <div className="animate-in fade-in slide-in-from-top-2 duration-500">
                  <Outlet />
               </div>

            </div>

            {/* FOOTER : Discret et net */}
            <footer className="w-full max-w-[1600px] mx-auto px-6 sm:px-14 pb-10 flex justify-between items-center opacity-40">
              <p className="font-tech text-[8px] tracking-[0.5em]">AGRICONNECT_SYS</p>
              <div className="h-px flex-1 bg-border mx-8" />
              <p className="font-tech text-[8px] tracking-[0.2em]">BUNIA_DRC</p>
            </footer>
          </div>
        </main>
      </div>
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}