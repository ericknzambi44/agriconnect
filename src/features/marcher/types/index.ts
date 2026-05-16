export interface AchatSuivi {
  id: string;
  date_commande: string;
  quantite: number;
  prix_total: number;
  produit: {
    id: string;
    nom: string;
    unite: string;
    image?: string;
  };
  expedition?: {
    id: string;
    statut: string;
    code_depot?: string;
    code_retrait?: string;
    code_depot_used_at?: string;
    code_retrait_used_at?: string;
    agence_depot_nom?: string;
    agence_retrait_nom?: string;
  };
  message_statut: string;
  action_requise?: string;
}
