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
import TransportControlCenter from './features/transport/view/TransportControlCenter';


export default function App() {
  // 1. RÉCUPÉRATION DU PROFIL ET DU STATUT DE CHARGEMENT
  const { profile, isLoading } = useAuthSession();

  // 2. ÉCRAN DE CHARGEMENT SÉCURISÉ
  // Empêche le rendu des routes tant qu'on ne sait pas si l'utilisateur a une session
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
          
          {/* CORRECTION DU BUG UUID : On passe l'ID du profil récupéré par le hook */}
          <Route path="subscription" element={<SubscriptionView userId={profile?.id || ''} />} />
       
          <Route path="settings" element={<div className="p-8 text-white">Paramètres...</div>} />
          
          {/* Vendeur */}
          <Route path="recoltes" element={<Recoltes />} />
          
          {/* Acheteur / Transporteur */}
          <Route path="marche" element={<MarketView />} />
          <Route path="missions" element={<TransportControlCenter />} />
        </Route>

        <Route path="*" element={<div className="...">Erreur 404</div>} />
      </Routes>

      {/* LE TOASTER GLOBAL */}
      <Toaster 
        position="top-right" 
        richColors 
        theme="dark" 
        closeButton
      /> 
    </BrowserRouter>
  );
}