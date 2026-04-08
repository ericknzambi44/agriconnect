// src/features/auth/hooks/use-auth-session.ts
import { useEffect, useState } from 'react';
import { supabase } from '@/supabase';

export interface UserProfile {
  id: string;
  nom: string;
  prenom: string;
  role: 'vendeur' | 'acheteur' | 'transporteur';
  avatar_url?: string | null;
}

// 1. On définit l'interface de ce que Supabase renvoie réellement
interface SupabaseUserResponse {
  id: string;
  nom: string;
  prenom: string;
  avatar_url: string | null;
  role: { titre_role: string } | { titre_role: string }[] | null;
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

        // 2. On effectue la requête
        const { data, error } = await supabase
          .from('utilisateurs')
          .select(`
            id,
            nom, 
            prenom, 
            avatar_url,
            role:role_id ( titre_role )
          `)
          .eq('id', session.user.id)
          .single();

        if (error) throw error;

        // 3. ON FORCE LE TYPE ICI (Le cast)
        const userData = data as unknown as SupabaseUserResponse;

        // 4. Extraction sécurisée du titre_role
        let roleTitle = '';
        if (userData.role) {
          roleTitle = Array.isArray(userData.role) 
            ? userData.role[0].titre_role 
            : userData.role.titre_role;
        }

        setProfile({
          id: userData.id,
          nom: userData.nom,
          prenom: userData.prenom,
          avatar_url: userData.avatar_url,
          role: roleTitle.toLowerCase() as UserProfile['role']
        });

      } catch (err) {
        console.error("Session Error:", err);
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
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return { profile, isLoading };
};