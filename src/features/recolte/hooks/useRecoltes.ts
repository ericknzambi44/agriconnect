import { useState, useEffect } from 'react';
import { supabase } from '@/supabase';
import { useAuthSession } from '@/features/auth/hooks/use-auth-session';
import { toast } from 'sonner';
import { Produit } from '../types';


export function useRecoltes() {
  const { profile } = useAuthSession();
  const [loading, setLoading] = useState(false);
  const [produits, setProduits] = useState<Produit[]>([]);

  const fetchInventory = async () => {
    if (!profile?.id) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('produit')
        .select(`*, annonce(*), categorie(*)`) 
        .eq('user_id', profile.id) // 🔴 CORRECTION ICI : user_id au lieu de id_utilisateur
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Détails Erreur Sync:", error);
        throw error;
      }
      setProduits((data as unknown as Produit[]) || []);
    } catch (error: any) {
      toast.error("ERREUR DE SYNCHRONISATION");
    } finally {
      setLoading(false);
    }
  };

  const addProduit = async (payload: Partial<Produit>, imageFile?: File) => {
    if (!profile?.id) return null;
    setLoading(true);

    try {
      let finalImageUrl = payload.image || "";

      // --- GESTION ROBUSTE DE L'IMAGE ---
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const cleanFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
        const filePath = `${profile.id}/${cleanFileName}`;

        const { error: uploadError } = await supabase.storage
          .from('produits') 
          .upload(filePath, imageFile, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error("Détails Upload Error:", uploadError);
          throw new Error(`Échec de l'envoi : ${uploadError.message}`);
        }

        const { data: { publicUrl } } = supabase.storage
          .from('produits')
          .getPublicUrl(filePath);
        
        finalImageUrl = publicUrl;
      }

      // --- INSERTION DANS LA TABLE PRODUIT ---
      const { data, error } = await supabase
        .from('produit')
        .insert([{ 
          ...payload, 
          user_id: profile.id, // On utilise bien user_id ici
          image: finalImageUrl 
        }])
        .select(`*, categorie(*)`)
        .single();

      if (error) throw error;
      
      const newProduit = data as Produit;
      setProduits(prev => [newProduit, ...prev]);
      toast.success("RESSOURCE ENREGISTRÉE");
      
      return newProduit;
    } catch (error: any) {
      console.error("Erreur complète:", error);
      toast.error("ERREUR CRITIQUE", {
        description: error.message || "Impossible de finaliser l'opération"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduit = async (id: string) => {
    try {
      const { error } = await supabase.from('produit').delete().eq('id', id);
      if (error) throw error;
      setProduits(prev => prev.filter(p => p.id !== id));
      toast.success("PRODUIT RETIRÉ");
      return true;
    } catch (error: any) {
      toast.error("ERREUR DE SUPPRESSION");
      return false;
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