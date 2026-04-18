// src/features/auth/hooks/use-auth-session.ts
import { useEffect, useState } from 'react';
import { supabase } from '@/supabase';

export interface UserProfile {
  id: string;
  nom: string;
  prenom: string;
  role: 'vendeur' | 'acheteur' | 'transporteur';
  avatar_url?: string | null;
  id_agence?: string | null; 
}

interface SupabaseUserResponse {
  id: string;
  nom: string;
  prenom: string;
  avatar_url: string | null;
  role: { titre_role: string } | { titre_role: string }[] | null;
  // On gère les deux cas de retour possibles de Supabase
  agents_agence: any; 
}

export const useAuthSession = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getSessionAndProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setProfile(null);
          setIsLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('utilisateurs')
          .select(`
            id,
            nom, 
            prenom, 
            avatar_url,
            role:role_id ( titre_role ),
            agents_agence ( agence_id )
          `)
          .eq('id', session.user.id)
          .single();

        if (error) throw error;

        const userData = data as unknown as SupabaseUserResponse;

        // 1. Extraction du rôle (identique à ton code)
        let roleTitle = '';
        if (userData.role) {
          roleTitle = Array.isArray(userData.role) 
            ? userData.role[0].titre_role 
            : userData.role.titre_role;
        }

        // 2. Extraction robuste de l'agence_id
        let agenceId = null;
        if (userData.agents_agence) {
          if (Array.isArray(userData.agents_agence) && userData.agents_agence.length > 0) {
            agenceId = userData.agents_agence[0].agence_id;
          } else if (userData.agents_agence.agence_id) {
            agenceId = userData.agents_agence.agence_id;
          }
        }

        setProfile({
          id: userData.id,
          nom: userData.nom,
          prenom: userData.prenom,
          avatar_url: userData.avatar_url,
          id_agence: agenceId,
          role: roleTitle.toLowerCase() as UserProfile['role']
        });

      } catch (err) {
        console.error("Erreur de session Pishopy:", err);
        setProfile(null);
      } finally {
        setIsLoading(false);
      }
    };

    getSessionAndProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setProfile(null);
        setIsLoading(false);
      } else {
        getSessionAndProfile();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return { profile, isLoading };
};