// src/config/navigation.ts
// configuration de chemin de navigation dashboard
import { 
  LayoutDashboard, 
  UserCog, 
  CreditCard, 
  Settings, 
  //Truck, 
  ShoppingCart, 
  Leaf, 
  Building2, 
  LayoutDashboardIcon
} from "lucide-react";

// 1. On définit les liens communs à tout le monde
export const COMMON_ROUTES = [
  { name: "Vue d'ensemble", href: "/dashboard", icon: LayoutDashboardIcon },
  { name: "Gestion Profil", href: "/dashboard/profile", icon: UserCog },
  { name: "Abonnement", href: "/dashboard/subscription", icon: CreditCard },
  { name: "Paramètres", href: "/dashboard/settings", icon: Settings },
];

// 2. On définit les liens spécifiques par rôle
export const ROLE_SPECIFIC_ROUTES = {
  vendeur: [
    { name: "Mes Récoltes", href: "/dashboard/recoltes", icon: Leaf },
  ],
  acheteur: [
    { name: "Marché Agricole", href: "/dashboard/marche", icon: ShoppingCart },
  ],
  transporteur: [
    // On utilise "Terminal Agence" pour la clarté et on ajoute isAgencyOnly
    { 
      name: "Terminal Agence", 
      href: "/dashboard/missions", 
      icon: Building2, 
      isAgencyOnly: true 
    },
  ]
};

// 3. Fonction utilitaire pour récupérer les bons liens
export const getNavigationForRole = (role: string) => {
  const roleRoutes = ROLE_SPECIFIC_ROUTES[role as keyof typeof ROLE_SPECIFIC_ROUTES] || [];
  
  // On met les routes spécifiques en premier, suivies des routes communes
  return [...roleRoutes, ...COMMON_ROUTES];
};