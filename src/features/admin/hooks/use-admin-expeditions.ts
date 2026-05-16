// src/features/admin/hooks/use-admin-expeditions.ts
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/supabase';
import { toast } from 'sonner';

export interface ExpeditionDetail {
  id: string;
  code_depot: string;
  code_retrait: string;
  statut_expedition: string;
  created_at: string;
  commande: {
    id: string;
    quantite_commandee: number;
    prix_total_commande: number;
    acheteur: { nom: string; prenom: string; numero_tel: string } | null;
    annonce: {
      produit: { nom_prod: string; unite: string };
      vendeur: { nom: string; prenom: string; numero_tel: string } | null;
    } | null;
  } | null;
}

export const useAdminExpeditions = () => {
  const [expeditions, setExpeditions] = useState<ExpeditionDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ statut: 'tous' });

  const fetchExpeditions = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('expedition')
        .select(`
          id,
          code_depot,
          code_retrait,
          statut_expedition,
          created_at,
          commande:commande_id (
            id,
            quantite_commandee,
            prix_total_commande,
            acheteur:acheteur_id (nom, prenom, numero_tel),
            annonce:annonce_id (
              produit:prod_id (nom_prod, unite),
              vendeur:user_id (nom, prenom, numero_tel)
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (filter.statut && filter.statut !== 'tous') {
        query = query.eq('statut_expedition', filter.statut);
      }

      const { data, error } = await query;

      if (error) throw error;
      setExpeditions(data as unknown as ExpeditionDetail[]);
    } catch (err: any) {
      toast.error("Erreur chargement expéditions");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filter.statut]);

  useEffect(() => {
    fetchExpeditions();
  }, [fetchExpeditions]);

  const updateExpeditionStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('expedition')
        .update({ statut_expedition: newStatus })
        .eq('id', id);

      if (error) throw error;
      toast.success("Statut mis à jour");
      await fetchExpeditions();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return { expeditions, loading, filter, setFilter, fetchExpeditions, updateExpeditionStatus };
};