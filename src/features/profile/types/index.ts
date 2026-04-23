// modele de donnees 


export interface Role {
  id: number;
  titre_role: string;
}

export interface Profile {
  id: string;
  email: string;
  nom: string;
  post_nom: string;
  prenom: string;
  numero_tel: string;
  sexe: string;
  avatar_url: string | null;
  role_id: number;
  address_id: string;
  id_agence: string | null; 
  role?: Role;
  adresse?: any;
}