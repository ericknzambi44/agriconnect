// src/features/admin/hooks/use-admin-wallets.ts
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/supabase';
import { toast } from 'sonner';

export interface WalletInfo {
  id: string;
  utilisateur: {
    id: string;
    nom: string;
    prenom: string;
    email: string;
    numero_tel: string;
  };
  solde_disponible: number;
  solde_bloque: number;
  devise: string;
}

export const useAdminWallets = () => {
  const [wallets, setWallets] = useState<WalletInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchWallets = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('portefeuille')
        .select(`
          id,
          solde_disponible,
          solde_bloque,
          devise,
          utilisateur:user_id (id, nom, prenom, email, numero_tel)
        `)
        .order('created_at', { ascending: false });

      if (searchTerm) {
        // Filtrage côté client ou via Supabase ?
        // Simplifié : on récupère tout et on filtre ensuite
      }

      const { data, error } = await query;
      if (error) throw error;

      let results = data as unknown as WalletInfo[];
      if (searchTerm) {
        results = results.filter(w => 
          w.utilisateur?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          w.utilisateur?.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          w.utilisateur?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          w.utilisateur?.numero_tel?.includes(searchTerm)
        );
      }
      setWallets(results);
    } catch (err: any) {
      toast.error("Erreur chargement portefeuilles");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchWallets();
  }, [fetchWallets]);

  return { wallets, loading, searchTerm, setSearchTerm, fetchWallets };
};