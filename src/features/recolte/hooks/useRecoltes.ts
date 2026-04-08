// src/features/recolte/hooks/useRecoltes.ts
import { useState, useEffect } from 'react';
import { supabase } from '@/supabase';
import { useAuthSession } from '@/features/auth/hooks/use-auth-session';
import { toast } from 'sonner';

// --- INTERFACES POUR TYPESCRIPT ---
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
  annonce?: Annonce[]; // Relation avec la table annonce
}

export interface Annonce {
  id: string;
  prix_total: number;
  date_pub: string;
  statut: string;
  prod_id: string;
  user_id: string;
}

export function useRecoltes() {
  const { profile } = useAuthSession();
  const [loading, setLoading] = useState(false);
  
  // -: On définit le type dans le useState ---
  const [produits, setProduits] = useState<Produit[]>([]);

  const fetchInventory = async () => {
    if (!profile?.id) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('produit')
        .select('*, annonce(*)') 
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Ici, le cast "as Produit[]" rassure TypeScript
      setProduits((data as Produit[]) || []);
    } catch (error: any) {
      toast.error("Erreur de synchronisation");
    } finally {
      setLoading(false);
    }
  };

  // --- AJOUT PRODUIT ---
  const addProduit = async (payload: Partial<Produit>) => {
    if (!profile?.id) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('produit')
        .insert([{ ...payload, user_id: profile.id }])
        .select()
        .single();

      if (error) throw error;
      setProduits(prev => [data as Produit, ...prev]);
      toast.success("Stock mis à jour");
      return data;
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // --- DELETE ---
  const deleteProduit = async (id: string) => {
    try {
      const { error } = await supabase.from('produit').delete().eq('id', id);
      if (error) throw error;
      setProduits(prev => prev.filter(p => p.id !== id));
      toast.success("Produit retiré");
    } catch (error: any) {
      toast.error("Erreur lors de la suppression");
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