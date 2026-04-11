// src/features/recolte/hooks/useRecoltes.ts
import { useState, useEffect } from 'react';
import { supabase } from '@/supabase';
import { useAuthSession } from '@/features/auth/hooks/use-auth-session';
import { toast } from 'sonner';

// --- INTERFACES POUR TYPESCRIPT ---

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
  // Relations jointes
  annonce?: Annonce[];
  categorie?: Categorie; 
}

export function useRecoltes() {
  const { profile } = useAuthSession();
  const [loading, setLoading] = useState(false);
  const [produits, setProduits] = useState<Produit[]>([]);

  // --- RÉCUPÉRATION DU STOCK (Jointure avec Annonce et Categorie) ---
  const fetchInventory = async () => {
    if (!profile?.id) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('produit')
        .select(`
          *,
          annonce(*),
          categorie(*)
        `) 
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setProduits((data as unknown as Produit[]) || []);
    } catch (error: any) {
      console.error(error);
      toast.error("Erreur de synchronisation du stock");
    } finally {
      setLoading(false);
    }
  };

  // --- AJOUT PRODUIT (Prend en compte categorie_id) ---
  const addProduit = async (payload: Partial<Produit>) => {
    if (!profile?.id) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('produit')
        .insert([{ 
          ...payload, 
          user_id: profile.id 
        }])
        .select(`*, categorie(*)`) // On récupère la catégorie direct pour l'affichage UI immédiat
        .single();

      if (error) throw error;
      
      setProduits(prev => [data as Produit, ...prev]);
      toast.success("Produit ajouté à votre récolte");
      return data;
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de l'ajout");
    } finally {
      setLoading(false);
    }
  };

  // --- SUPPRESSION ---
  const deleteProduit = async (id: string) => {
    try {
      const { error } = await supabase
        .from('produit')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setProduits(prev => prev.filter(p => p.id !== id));
      toast.success("Produit retiré du stock");
    } catch (error: any) {
      toast.error("Impossible de supprimer ce produit");
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [profile?.id]);

  return {
    produits,
    loading,
    addProduit,
    deleteProduit,
    refresh: fetchInventory
  };
}