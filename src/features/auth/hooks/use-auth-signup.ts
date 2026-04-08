// src/features/auth/hooks/use-auth-signup.ts
import { supabase } from '@/supabase';
import { useState, useEffect, useCallback } from 'react';

export interface Role {
  id: number;
  titre_role: string;
}

export const useAuthSignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);

  const fetchRoles = useCallback(async () => {
    try {
      const { data, error: roleError } = await supabase.from('role').select('id, titre_role');
      if (roleError) throw roleError;
      setRoles(data || []);
    } catch (err: any) {
      console.error("Erreur rôles:", err.message);
    }
  }, []);

  useEffect(() => { fetchRoles(); }, [fetchRoles]);

  const signUp = async (formData: any) => {
    setIsLoading(true);
    setError(null);
    let createdAddressId: string | null = null;

    try {
      // --- ÉTAPE 0 : VÉRIFICATION PRÉALABLE ---
      // On vérifie si le profil existe déjà dans 'utilisateurs' pour éviter le crash PKEY
      const { data: existingUser } = await supabase
        .from('utilisateurs')
        .select('id')
        .eq('email', formData.email)
        .single();

      if (existingUser) {
        throw new Error("Un profil avec cet email existe déjà.");
      }

      // --- ÉTAPE A : CRÉATION ADRESSE ---
      const { data: addressData, error: addressError } = await supabase
        .from('adresse')
        .insert([{
          pays: formData.pays,
          province: formData.province,
          ville: formData.ville,
          commune: formData.commune,
          quartier: formData.quartier,
          avenue: formData.avenue,
          numero: formData.numero
        }])
        .select()
        .single();

      if (addressError) throw new Error(`Erreur Adresse: ${addressError.message}`);
      createdAddressId = addressData.id;

      // --- ÉTAPE B : AUTHENTIFICATION ---
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.mot_de_pass,
      });

      // Gestion spécifique du "User already registered" de Supabase Auth
      if (authError) {
        // Si l'auth échoue, on nettoie l'adresse créée pour ne pas polluer la DB
        if (createdAddressId) await supabase.from('adresse').delete().eq('id', createdAddressId);
        throw new Error(`Erreur Auth: ${authError.message}`);
      }

      const user = authData.user;
      if (!user) throw new Error("Erreur inattendue lors de la création Auth.");

      // --- ÉTAPE C : PROFIL UTILISATEUR (UPSERT au lieu de INSERT) ---
      // L'utilisation de .upsert() permet de mettre à jour si l'ID existe déjà 
      // au lieu de crash l'application.
      const { error: profileError } = await supabase
        .from('utilisateurs')
        .upsert([{
          id: user.id, 
          email: formData.email,
          nom: formData.nom,
          post_nom: formData.post_nom,
          prenom: formData.prenom,
          numero_tel: formData.numero_tel,
          sexe: formData.sexe,
          avatar_url: formData.avatar_url || null,
          address_id: createdAddressId,
          role_id: formData.role_id,
        }], { onConflict: 'id' });

      if (profileError) {
        // En cas d'erreur ici, l'utilisateur est déjà dans Auth. 
        // On informe l'utilisateur qu'il doit peut-être se connecter ou contacter l'admin.
        throw new Error(`Erreur Profil: ${profileError.message}`);
      }

      return { success: true };
    } catch (err: any) {
      setError(err.message);
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  return { signUp, isLoading, error, roles, refreshRoles: fetchRoles };
};