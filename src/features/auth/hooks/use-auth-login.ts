// src/features/auth/hooks/use-auth-login.ts
// ce hook gere la l'authentification requette sql 
import { supabase } from '@/supabase';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuthLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const login = async (identifier: string, mot_de_pass: string) => {
    setIsLoading(true);
    setError(null);

    try {
      let emailToUse = identifier;

      // 1. DÉTECTION (Email vs Téléphone)
      const isEmail = identifier.includes('@');
      
      if (!isEmail) {
        const { data: userProfile, error: profileError } = await supabase
          .from('utilisateurs')
          .select('email')
          .eq('numero_tel', identifier)
          .single();

        if (profileError || !userProfile) {
          throw new Error("Identifiants incorrects ou compte inexistant.");
        }
        emailToUse = userProfile.email;
      }

      // 2. AUTHENTIFICATION (Création de la session Supabase)
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: emailToUse,
        password: mot_de_pass,
      });

      if (authError) throw authError;

      // 3. VÉRIFICATION ET RÉCUPÉRATION DU RÔLE
      // On s'assure que le profil existe et on récupère le titre du rôle pour le dashboard
      const { data: profile, error: roleError } = await supabase
        .from('utilisateurs')
        .select(`
          nom,
          role:role_id ( titre_role )
        `)
        .eq('id', authData.user.id)
        .single();

      if (roleError || !profile) {
        // Si le profil est introuvable, on déconnecte pour éviter une session fantôme
        await supabase.auth.signOut();
        throw new Error("Erreur lors de la récupération de votre profil.");
      }

      // Optionnel : Tu peux stocker ces infos dans un Store (Zustand/Context) ici
      console.log("Session active pour :", profile.nom, "Rôle :", profile.role);

      // 4. REDIRECTION
      navigate('/dashboard');
      return { success: true };

    } catch (err: any) {
      setError(err.message);
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
};