// src/features/admin/hooks/use-admin-activity.ts
import { useState, useEffect } from 'react';
import { supabase } from '@/supabase';

export const useAdminActivity = () => {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActivity = async () => {
    setLoading(true);
    // On récupère les 5 dernières expéditions comme "activité"
    const { data } = await supabase
      .from('expedition')
      .select('id, tracking_number, statut, created_at, utilisateurs(nom, prenom)')
      .order('created_at', { ascending: false })
      .limit(5);

    setActivities(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchActivity(); }, []);

  return { activities, loading };
};