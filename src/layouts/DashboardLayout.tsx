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
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[hsl(var(--background))] p-4">
        <Zap className="w-12 h-12 text-primary animate-bounce mb-4" />
        <h2 className="font-tech text-[clamp(8px,2vw,10px)] text-primary uppercase tracking-[0.5em] text-center">
          Chargement_AgriConnect...
        </h2>
      </div>
    );
  }

  if (!profile) return <Navigate to="/login" replace />;

  return (
    <div className="flex h-screen w-full bg-[hsl(var(--background))] overflow-hidden font-sans relative">
      
      {/* 1. SIDEBAR : Adaptative */}
      <Sidebar 
        role={profile.role} 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />

      {/* 2. WRAPPER PRINCIPAL */}
      <div className="flex-1 flex flex-col min-w-0 h-full lg:pl-72 transition-all duration-300">
        
        {/* TOPBAR : Hauteur fixe mais contenu interne flexible */}
        <header className="h-20 w-full flex-shrink-0 z-[50] border-b border-border bg-secondary/80 backdrop-blur-md">
          <Topbar 
            user={profile} 
            onMenuClick={() => setIsMobileMenuOpen(true)} 
          />
        </header>

        {/* 3. ZONE DE SCROLL INTELLIGENTE */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden relative no-scrollbar flex flex-col">
          
          {/* FX DE FOND NETS */}
          <div className="absolute inset-0 pointer-events-none z-0">
             <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(var(--color-border)_1px,transparent_1px),linear-gradient(90deg,var(--color-border)_1px,transparent_1px)] bg-[size:clamp(20px,5vw,40px)_clamp(20px,5vw,40px)]" />
          </div>

          {/* CONTENU : Adaptabilité fluide via clamp() */}
          <div className="relative z-10 w-full min-h-full flex flex-col flex-1">
            <div className="flex-1 max-w-[1600px] w-full mx-auto px-[clamp(1rem,5vw,3.5rem)] pt-[clamp(1.5rem,6vw,3rem)] pb-10">
               
               <div className="animate-in fade-in slide-in-from-top-2 duration-500 w-full h-full">
                  <Outlet />
               </div>

            </div>

            {/* FOOTER : Responsive et aligné */}
            <footer className="w-full max-w-[1600px] mx-auto px-[clamp(1rem,5vw,3.5rem)] pb-8 mt-auto flex justify-between items-center opacity-40 gap-4">
              <p className="font-tech text-[clamp(6px,1.5vw,8px)] tracking-[0.3em] whitespace-nowrap uppercase">
                AGRICONNECT_SYS
              </p>
              <div className="h-px flex-1 bg-border" />
              <p className="font-tech text-[clamp(6px,1.5vw,8px)] tracking-[0.2em] whitespace-nowrap uppercase">
                BUNIA_DRC
              </p>
            </footer>
          </div>
        </main>
      </div>
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        /* Assure que les éléments ne cassent pas le layout sur très petits écrans */
        * {
          min-width: 0;
          word-wrap: break-word;
        }
      `}</style>
    </div>
  );
}