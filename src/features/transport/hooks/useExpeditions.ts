// src/features/transport/hooks/useExpeditions.ts
import { useState, useEffect } from 'react';
import { supabase } from '@/supabase';

export function useExpeditions(agencyId?: string) {
  const [missions, setMissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMissions = async () => {
    setLoading(true);
    let query = supabase
      .from('expeditions')
      .select(`
        *,
        annonce:annonce_id (*, vendeur:user_id(nom, prenom)),
        acheteur:acheteur_id(nom, prenom)
      `)
      .order('created_at', { ascending: false });

    if (agencyId) {
      // Filtre : Missions qui partent ou arrivent dans cette agence
      query = query.or(`agence_depart_id.eq.${agencyId},agence_arrivee_id.eq.${agencyId}`);
    }

    const { data, error } = await query;
    if (!error) setMissions(data);
    setLoading(false);
  };

  useEffect(() => { fetchMissions(); }, [agencyId]);

  return { missions, loading, refresh: fetchMissions };
}