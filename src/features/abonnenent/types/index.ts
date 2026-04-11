// src/features/abonnement/types/index.ts

export type SubscriptionStatus = 'ACTIF' | 'EXPIRE' | 'EN_ATTENTE' | 'ANNULE';

export interface Plan {
  id_plans: string; // Changé en string car Supabase utilise souvent des UUID, mais garde 'number' si c'est ton cas précis
  nom: string;
  prix: number;
  duree_jour: number;
  avantages: string[];
}

export interface Abonnement {
  id: string;
  id_plan: string;
  id_utilisateur: string;
  date_debut: string; // ISOString (timestamptz)
  date_fin: string;   // ISOString (timestamptz)
  statut: SubscriptionStatus;
  plans?: Plan;       // Pour la jointure via .select('*, plans(*)')
}

export interface Payement {
  id: string;
  id_utilisateur: string;
  montant: number;
  reference: string;
  statut: 'SUCCESS' | 'FAILED' | 'PENDING';
  date_payement: string;
}