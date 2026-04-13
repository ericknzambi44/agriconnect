

export interface Categorie {
  id: string;
  libelle_categorie: string;
}

export interface Annonce {
  id: string;
  prix_total: number;
  date_pub: string;
  statut: string;
  prod_id: string;
  user_id: string;
}

export interface Produit {
  id: string;
  nom_prod: string;
  prix_prod: number;
  quantite_prod: number;
  unite: string;
  date_recolte: string;
  user_id: string;
  categorie_id?: string;
  created_at: string;
  image?: string ;
  // Relations jointes
  annonce?: Annonce[];
  categorie?: Categorie; 
}