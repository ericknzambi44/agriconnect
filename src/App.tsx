// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// --- IMPORTS EXISTANTS (AGRICONNECT) ---
import LoginView from './features/auth/view/loginView';
import SignUpView from './features/auth/view/SignUpView';
import DashboardLayout from './layouts/DashboardLayout';
import Overview from './view/dashboard/Overview';
import Recoltes from './features/recolte/view/Recoltes';
import ProfileView from './features/profile/view/ProfileView';
import SubscriptionView from './features/abonnenent/view/SubscriptionView';
import MarketView from './features/marcher/view/MarketView';
import { AgencyTerminalView } from './features/transport/view/AgencyTerminalView';
import { NotificationCenterView } from './features/notifications/components/NotificationCenterView';
import { WalletView } from './features/portefeuille/components/WalletView';

import AdminTerminal from './features/admin/layouts/AdminTerminal';
import AdminOverview from './features/admin/pages/AdminOverview';
import AdminUsers from './features/admin/pages/AdminUsers';
import AdminAgencies from './features/admin/pages/AdminAgencies';

// COMPOSANTS UI
import { Toaster } from "@/components/ui/sonner"; 
import { useAuthSession } from '@/features/auth/hooks/use-auth-session';
import AdminLogin from './features/admin/pages/AdminLogin';

export default function App() {
  const { profile, isLoading } = useAuthSession();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-primary animate-pulse font-black uppercase italic tracking-widest text-[10px]">
          Initialisation AgriConnect...
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* --- ZONE PUBLIQUE --- */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginView />} />
        <Route path="/signup" element={<SignUpView />} />

        {/* --- ZONE PRIVÉE (DASHBOARD CLIENT / AGENT) --- */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Overview />} />
          <Route path="profile" element={<ProfileView />} />
          <Route path="notifications" element={<NotificationCenterView />} />
          <Route path="subscription" element={<SubscriptionView userId={profile?.id || ''} />} />
          <Route path="portefeuille" element={<WalletView />} />
          <Route path="settings" element={<div className="p-8 text-white">Paramètres...</div>} />
          
          <Route path="recoltes" element={<Recoltes />} />
          <Route path="marche" element={<MarketView />} />

          <Route 
            path="missions" 
            element={
              profile?.id_agence ? (
                <AgencyTerminalView />
              ) : (
                <div className="p-20 text-center">
                   <h2 className="text-red-500 font-black uppercase italic text-2xl">ACCÈS RESTREINT</h2>
                   <p className="text-white/40 text-xs mt-2 font-bold uppercase tracking-widest">
                     Ce terminal est réservé aux agents certifiés.
                   </p>
                </div>
              )
            } 
          />
        </Route>

        {/* --- ZONE ADMIN ( MASTER CONTROL) --- */}
        <Route path="/admin/login" element={<AdminLogin />} />
        
        <Route path="/admin" element={<AdminTerminal />}>
          {/* Redirection automatique vers overview */}
          <Route index element={<Navigate to="/admin/overview" replace />} />
          
          <Route path="overview" element={<AdminOverview />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="agencies" element={<AdminAgencies />} />
          
          {/* Route pour la gestion globale des expéditions (A créer après) */}
          <Route path="expeditions" element={<div className="p-10 text-white font-tech uppercase">Terminal_Expeditions_Global</div>} />
        </Route>

        {/* --- 404 --- */}
        <Route path="*" element={<div className="min-h-screen bg-black text-white flex items-center justify-center font-black italic">ERREUR_404 : NODE_NOT_FOUND</div>} />
      </Routes>

      <Toaster 
        position="top-right" 
        richColors 
        theme="dark" 
        closeButton
      /> 
    </BrowserRouter>
  );
}