// src/features/admin/hooks/use-admin-activity.ts
import { useState, useEffect } from 'react';
import { supabase } from '@/supabase';

export const useAdminActivity = () => {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActivity = async () => {
    setLoading(true);
    try {
      // Récupérer les 10 dernières expéditions avec détails utilisateur
      const { data: expeditions } = await supabase
        .from('expedition')
        .select(`
          id, 
          statut_expedition, 
          created_at,
          commande:commande_id (
            acheteur:acheteur_id (
              nom, 
              prenom
            )
          )
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      // Récupérer les 10 derniers utilisateurs créés
      const { data: users } = await supabase
        .from('utilisateurs')
        .select('id, nom, prenom, created_at')
        .order('created_at', { ascending: false })
        .limit(10);

      // Fonction utilitaire pour extraire le premier élément d'une relation (au cas où c'est un tableau)
      const getFirst = (maybeArray: any) => Array.isArray(maybeArray) ? maybeArray[0] : maybeArray;

      // Fusionner et formater
      const formatted = [
        ...(expeditions?.map(e => {
          const commande = getFirst(e.commande);
          const acheteur = commande ? getFirst(commande.acheteur) : null;
          return {
            id: e.id,
            type: 'EXPEDITION',
            description: `Expédition ${e.id.slice(0,8)} : ${e.statut_expedition}`,
            date: e.created_at,
            user: acheteur ? `${acheteur.prenom} ${acheteur.nom}` : 'N/A'
          };
        }) || []),
        ...(users?.map(u => ({
          id: u.id,
          type: 'USER_CREATED',
          description: `Nouvel utilisateur : ${u.prenom} ${u.nom}`,
          date: u.created_at,
          user: `${u.prenom} ${u.nom}`
        })) || [])
      ].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10);

      setActivities(formatted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchActivity(); }, []);

  return { activities, loading, refresh: fetchActivity };
};