// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginView from './features/auth/view/loginView';
import SignUpView from './features/auth/view/SignUpView';
import DashboardLayout from './layouts/DashboardLayout';
import Overview from './view/dashboard/Overview';
import Recoltes from './features/recolte/view/Recoltes';

// COMPOSANTS UI
import { Toaster } from "@/components/ui/sonner"; 
import ProfileView from './features/profile/view/ProfileView';
import SubscriptionView from './features/abonnenent/view/SubscriptionView';

// HOOK DE SESSION
import { useAuthSession } from '@/features/auth/hooks/use-auth-session';
import MarketView from './features/marcher/view/MarketView';
import { AgencyTerminalView } from './features/transport/view/AgencyTerminalView';
import { NotificationCenterView } from './features/notification/components/NotificationCenterView';


export default function App() {
  // Le hook nous donne déjà toutes les infos de l'utilisateur connecté
  const { profile, isLoading } = useAuthSession();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-primary animate-pulse font-black uppercase italic tracking-widest text-[10px]">
          Initialisation Agriconnect...
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
        

        {/* --- ZONE PRIVÉE (DASHBOARD) --- */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Overview />} />
          <Route path="profile" element={<ProfileView />} />
          
          {/* ROUTE NOTIFICATIONS AJOUTÉE ICI */}
          <Route path="notifications" element={<NotificationCenterView />} />
          
          <Route path="subscription" element={<SubscriptionView userId={profile?.id || ''} />} />
       
          <Route path="settings" element={<div className="p-8 text-white">Paramètres...</div>} />
          
          {/* Vendeur */}
          <Route path="recoltes" element={<Recoltes />} />
          
          {/* Acheteur / Transporteur */}
          <Route path="marche" element={<MarketView />} />

          {/* FLUX AGENCE : SÉCURISÉ 
              On extrait l'ID de l'agence directement du profil utilisateur.
              Si l'utilisateur n'est pas un agent, il ne verra rien (ou sera bloqué par le hook useAgencyShipping).
          */}
          <Route 
            path="missions" 
            element={
              profile?.id_agence ? (
                <AgencyTerminalView  />
              ) : (
                <div className="p-20 text-center">
                   <h2 className="text-red-500 font-black uppercase italic italic text-2xl">ACCÈS RESTREINT</h2>
                   <p className="text-white/40 text-xs mt-2 font-bold uppercase tracking-widest">
                     Ce terminal est réservé aux agents certifiés des agences partenaires.
                   </p>
                </div>
              )
            } 
          />
        </Route>

        <Route path="*" element={<div className="min-h-screen bg-black text-white flex items-center justify-center font-black">ERREUR_404 : NODE_NOT_FOUND</div>} />
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