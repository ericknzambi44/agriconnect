// hooks/useMarketplace.ts
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/supabase';
import { useAuthSession } from '@/features/auth/hooks/use-auth-session';
import { toast } from 'sonner';

// --- INTERFACES ---
export interface AdresseComplete {
  pays: string;
  province: string;
  ville: string;
  commune: string;
  quartier: string;
  avenue: string;
  numero: string;
}

export interface MarketAnnonce {
  id: string;
  prix_total: number;
  date_pub: string;
  statut: string;
  prod_id: string;
  user_id: string;
  quantite_vendre: number;
  quantite_restante: number;
  produit: {
    id: string;
    nom_prod: string;
    prix_prod: number;
    unite: string;
    image: string;
    lieu_culture: string;
    categorie: { id: string; libelle_categorie: string; };
  };
  vendeur: {
    nom: string;
    prenom: string;
    numero_tel: string;
    adresse: AdresseComplete;
  };
}

export function useMarketplace() {
  const { profile } = useAuthSession();
  const [loading, setLoading] = useState(false);
  const [annonces, setAnnonces] = useState<MarketAnnonce[]>([]);
  const [mesCommandes, setMesCommandes] = useState<any[]>([]);
  const [categories, setCategories] = useState<{ id: string; libelle: string }[]>([]);

  // Récupérer toutes les catégories
  const fetchCategories = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('categorie')
        .select('id, libelle_categorie');
      if (error) throw error;
      const cats = (data || []).map(cat => ({
        id: cat.id,
        libelle: cat.libelle_categorie
      }));
      setCategories(cats);
    } catch (error: any) {
      console.error("Erreur chargement catégories:", error.message);
    }
  }, []);

  // Récupérer le marché
  const fetchMarket = useCallback(async (categorieId?: string) => {
    setLoading(true);
    try {
      let query = supabase
        .from('annonce')
        .select(`
          *,
          produit:prod_id (
            id, nom_prod, prix_prod, unite, image, lieu_culture,
            categorie:categorie_id (id, libelle_categorie)
          ),
          vendeur:user_id (
            nom, prenom, numero_tel,
            adresse:address_id ( 
              pays, province, ville, commune, quartier, avenue, numero 
            )
          )
        `)
        .eq('statut', 'en_attente')
        .gt('quantite_restante', 0);

      if (categorieId && categorieId !== 'all') {
        query = query.eq('produit.categorie_id', categorieId);
      }

      const { data, error } = await query.order('date_pub', { ascending: false });
      if (error) throw error;
      setAnnonces((data as any) || []);
    } catch (error: any) {
      console.error("Erreur Marché:", error.message);
      toast.error("Problème de connexion au marché");
    } finally {
      setLoading(false);
    }
  }, []);

  // Récupérer les commandes de l'acheteur
  const fetchMesCommandes = useCallback(async () => {
    if (!profile?.id) return;
    try {
      const { data, error } = await supabase
        .from('commande')
        .select(`
          *,
          annonce:annonce_id (
            *,
            produit:prod_id (*),
            vendeur:user_id (
                nom, prenom, numero_tel,
                adresse:address_id (*)
            )
          )
        `)
        .eq('acheteur_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMesCommandes(data || []);
    } catch (error) {
      console.error("Erreur Commandes:", error);
    }
  }, [profile?.id]);

  const annulerCommande = async (id: string) => { /* logique */ };
  const modifierCommande = async (id: string, q: number, a: any) => { /* logique */ };

  useEffect(() => {
    fetchCategories();
    fetchMarket();
    if (profile?.id) fetchMesCommandes();
  }, [profile?.id, fetchMarket, fetchMesCommandes, fetchCategories]);

  return {
    annonces,
    mesCommandes,
    categories,
    loading,
    fetchMarket,
    fetchMesCommandes,
    annulerCommande,
    modifierCommande,
    refresh: () => { fetchMarket(); fetchMesCommandes(); }
  };
}