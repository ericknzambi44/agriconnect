export interface Notification {
  id: string;
  titre: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
  expedition_id?: string;
  expedition?: {
    code_retrait: string;
    statut_expedition: string;
    commande: {
      annonce: { produit: { nom_prod: string } }
    }
  };
}