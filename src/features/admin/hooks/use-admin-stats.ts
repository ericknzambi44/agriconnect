// src/features/admin/hooks/use-admin-stats.ts
import { useState, useEffect } from 'react';
import { supabase } from '@/supabase';

export const useAdminStats = () => {
  const [stats, setStats] = useState({
    usersCount: 0,
    agenciesCount: 0,
    activeExpeditions: 0,
    totalVolume: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      // 1. Compte des utilisateurs et agences
      const { count: uCount } = await supabase.from('utilisateurs').select('*', { count: 'exact', head: true });
      const { count: aCount } = await supabase.from('agence').select('*', { count: 'exact', head: true });

      // 2. Expéditions critiques (EN_TRANSIT)
      const { count: eCount } = await supabase
        .from('expedition')
        .select('*', { count: 'exact', head: true })
        .eq('statut', 'EN_TRANSIT');

      // 3. Volume financier total (Somme des portefeuilles ou transactions)
      const { data: walletData } = await supabase.from('portefeuille').select('solde_disponible');
      const total = walletData?.reduce((acc, curr) => acc + (curr.solde_disponible || 0), 0) || 0;

      setStats({
        usersCount: uCount || 0,
        agenciesCount: aCount || 0,
        activeExpeditions: eCount || 0,
        totalVolume: total,
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