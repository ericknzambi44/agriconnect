export interface Role {
  id: number;
  titre_role: string;
}


export interface UserProfile {
  id: string;
  nom: string;
  prenom: string;
  role: 'vendeur' | 'acheteur' | 'transporteur';
  avatar_url?: string | null;
  id_agence?: string | null; 
}

export interface SupabaseUserResponse {
  id: string;
  nom: string;
  prenom: string;
  avatar_url: string | null;
  role: { titre_role: string } | { titre_role: string }[] | null;
  // On gère les deux cas de retour possibles de Supabase
  agents_agence: any; 
}
