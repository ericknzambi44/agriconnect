// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginView from './features/auth/view/loginView';
import SignUpView from './features/auth/view/SignUpView';
import DashboardLayout from './layouts/DashboardLayout';
import Overview from './view/dashboard/Overview';
import Recoltes from './features/recolte/view/Recoltes';

// 1. IMPORTE LE COMPOSANT TOASTER DE SONNER
import { Toaster } from "@/components/ui/sonner"; 
import ProfileView from './features/profile/view/ProfileView';

export default function App() {
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
          <Route path="profile" element={<  ProfileView />} />
          <Route path="subscription" element={<div className="p-8 text-white">Abonnement...</div>} />
          <Route path="settings" element={<div className="p-8 text-white">Paramètres...</div>} />
          
          {/* Vendeur */}
          <Route path="recoltes" element={<Recoltes />} />
          
          {/* Acheteur / Transporteur */}
          <Route path="marche" element={<div className="p-8 text-white">Marché...</div>} />
          <Route path="missions" element={<div className="p-8 text-white">Missions...</div>} />
        </Route>

        <Route path="*" element={<div className="...">Erreur 404</div>} />
      </Routes>

      {/* 2. PLACE LE TOASTER ICI (Il doit être présent sur toutes les pages) */}
      <Toaster 
        position="top-right" 
        richColors 
        theme="dark" // Pour coller à l'esthétique pishopy
        closeButton
      /> 
    </BrowserRouter>
  );
}