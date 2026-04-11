import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "./index.css";
import SignUpView from "./features/auth/view/SignUpView";
import { Sidebar } from "./components/dashboard/Sidebar";
import { Topbar } from "./components/dashboard/Topbar";
import DashboardOverview from "./view/dashboard/Overview";
import App from "./App";
import ProfileView from "./features/profile/view/ProfileView";
import MarketView from "./features/marcher/view/MarketView";
import { AppWindow } from "lucide-react";




// 1. Création du client pour la gestion du cache et des requêtes
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Évite de recharger dès qu'on change d'onglet
    },
  },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    {/* 2. On enveloppe l'application avec le Provider obligatoire */}
    <QueryClientProvider client={queryClient}>
      <App/>
    </QueryClientProvider>
  </React.StrictMode>,
);