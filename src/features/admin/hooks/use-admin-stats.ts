// src/features/admin/hooks/use-admin-stats.ts
import { useState, useEffect } from 'react';
import { supabase } from '@/supabase';

export const useAdminStats = () => {
  const [stats, setStats] = useState({
    usersCount: 0,
    agenciesCount: 0,
    activeExpeditions: 0,
    totalVolume: 0,
    totalSequestre: 0,
    commandesCount: 0,
    produitsCount: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      // Compteurs simples
      const { count: uCount } = await supabase.from('utilisateurs').select('*', { count: 'exact', head: true });
      const { count: aCount } = await supabase.from('agence').select('*', { count: 'exact', head: true });
      const { count: eCount } = await supabase.from('expedition').select('*', { count: 'exact', head: true }).eq('statut', 'EN_TRANSIT');
      const { count: cmdCount } = await supabase.from('commande').select('*', { count: 'exact', head: true });
      const { count: prodCount } = await supabase.from('produit').select('*', { count: 'exact', head: true });

      // Volume financier total (solde_disponible)
      const { data: walletData } = await supabase.from('portefeuille').select('solde_disponible');
      const total = walletData?.reduce((acc, curr) => acc + (curr.solde_disponible || 0), 0) || 0;

      // Solde séquestré (solde_bloque)
      const { data: blockedData } = await supabase.from('portefeuille').select('solde_bloque');
      const totalBlocked = blockedData?.reduce((acc, curr) => acc + (curr.solde_bloque || 0), 0) || 0;

      setStats({
        usersCount: uCount || 0,
        agenciesCount: aCount || 0,
        activeExpeditions: eCount || 0,
        totalVolume: total,
        totalSequestre: totalBlocked,
        commandesCount: cmdCount || 0,
        produitsCount: prodCount || 0,
      });
    } catch (error) {
      console.error("Stats_Fetch_Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  return { stats, loading, refresh: fetchStats };
};