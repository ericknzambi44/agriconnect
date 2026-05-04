// src/features/admin/layouts/AdminTerminal.tsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from '../components/AdminSidebar';
import { useAdminCore } from '../hooks/use-admin-core';
import { Loader2, Menu, Terminal, Shield } from 'lucide-react';
import { cn } from "@/lib/utils";

export default function AdminTerminal() {
  const { isSyncing, isAuthenticated } = useAdminCore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // État de chargement global (Full Screen)
  if (isSyncing) {
    return (
      <div className="h-screen bg-[#050505] flex flex-col items-center justify-center">
        <div className="relative">
            <Loader2 className="text-primary animate-spin mb-4" size={48} />
            <Shield className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary/20" size={20} />
        </div>
        <p className="font-tech text-[10px] text-white/20 uppercase tracking-[0.5em] animate-pulse">
            Establishing_Secure_Link...
        </p>
      </div>
    );
  }

  // Redirection automatique via hook si non auth
  if (!isAuthenticated) return null;

  return (
    <div className="flex h-screen bg-[#020202] text-white overflow-hidden font-sans">
      
      {/* SIDEBAR : Reçoit les props pour le contrôle mobile */}
      <AdminSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        {/* MOBILE HEADER : Invisible sur Desktop, crucial sur Mobile */}
        <header className="lg:hidden h-16 flex items-center justify-between px-6 border-b border-white/5 bg-[#080808]/50 backdrop-blur-xl z-[130]">
            <div className="flex items-center gap-3">
                <Terminal size={18} className="text-primary" />
                <span className="font-display font-black text-sm uppercase italic tracking-tighter">
                    Agri<span className="text-primary">Admin</span>
                </span>
            </div>
            
            <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 rounded-lg bg-white/5 border border-white/10 active:scale-90 transition-all"
            >
                <Menu size={20} className="text-white" />
            </button>
        </header>

        {/* ZONE DE CONTENU SCROLLABLE */}
        <div className="flex-1 overflow-y-auto relative no-scrollbar">
            
            {/* Effets Visuels de Fond (Performance-Optimized) */}
            <div className="absolute top-0 right-0 w-full lg:w-1/2 h-1/2 bg-primary/5 blur-[120px] rounded-full -z-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-1/2 h-1/3 bg-blue-500/5 blur-[100px] rounded-full -z-10 pointer-events-none" />

            {/* Container Principal Réactif */}
            <div className={cn(
                "p-4 md:p-8 lg:p-12 max-w-[1400px] mx-auto w-full transition-all duration-500",
                "animate-in fade-in slide-in-from-bottom-2 duration-700"
            )}>
                
                {/* Header de Page Dynamique (Optionnel mais recommandé) */}
                <div className="mb-8 hidden lg:block">
                    <div className="flex items-center gap-2 text-[10px] font-mono text-white/20 uppercase tracking-[0.3em] mb-1">
                        <span className="w-8 h-[1px] bg-primary/30"></span>
                        Terminal_Output
                    </div>
                    <h2 className="text-xs font-mono text-white/40 italic">
                        root@agriconnect:~$ <span className="text-white/60 animate-pulse font-bold tracking-widest">SYSTEM_READY</span>
                    </h2>
                </div>

                {/* Injection des pages (Overview, Users, etc.) */}
                <div className="relative z-10">
                    <Outlet />
                </div>
            </div>

            {/* Footer de Page (Subtil) */}
            <footer className="p-8 mt-auto border-t border-white/[0.02] flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-[9px] font-mono text-white/10 uppercase tracking-widest">
                    © 2026 AgriConnect — Infrastructure_Sécurisée
                </p>
                <div className="flex gap-4 items-center opacity-30">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    <span className="text-[8px] font-mono tracking-tighter">V1.0.0</span>
                </div>
            </footer>
        </div>
      </main>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}