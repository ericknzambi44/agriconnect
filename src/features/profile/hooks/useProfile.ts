// src/features/profile/hooks/use-profile.ts
import { supabase } from '@/supabase';
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export interface Role {
  id: number;
  titre_role: string;
}

export interface Profile {
  id: string;
  email: string;
  nom: string;
  post_nom: string;
  prenom: string;
  numero_tel: string;
  sexe: string;
  avatar_url: string | null;
  role_id: number;
  address_id: string;
  // --- AJOUT CHAMP AGENCE ---
  id_agence: string | null; 
  // --------------------------
  role?: Role;
  adresse?: any;
}

export const useProfile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);

  // 1. RÉCUPÉRATION DES RÔLES DISPONIBLES
  const fetchRoles = useCallback(async () => {
    const { data } = await supabase.from('role').select('*');
    if (data) setRoles(data);
  }, []);

  // 2. RÉCUPÉRATION DU PROFIL COMPLET (Intégration id_agence)
  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      const { data, error } = await supabase
        .from('utilisateurs')
        .select(`
          *,
          role:role_id (id, titre_role),
          adresse:address_id (*)
        `) // Le '*' ici récupère automatiquement id_agence si la colonne existe en DB
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (err: any) {
      console.error("Erreur chargement profil:", err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
    fetchProfile();
  }, [fetchProfile, fetchRoles]);

  // 3. MISE À JOUR UNIVERSELLE (Inchangée pour ne rien casser)
  const updateProfile = async (formData: any) => {
    setIsLoading(true);
    try {
      if (!profile) throw new Error("Profil introuvable");

      const { error: addrError } = await supabase
        .from('adresse')
        .update({
          pays: formData.pays,
          province: formData.province,
          ville: formData.ville,
          commune: formData.commune,
          quartier: formData.quartier,
          avenue: formData.avenue,
          numero: formData.numero
        })
        .eq('id', profile.address_id);

      if (addrError) throw new Error(`Erreur Adresse: ${addrError.message}`);

      const { error: userError } = await supabase
        .from('utilisateurs')
        .update({
          nom: formData.nom,
          post_nom: formData.post_nom,
          prenom: formData.prenom,
          numero_tel: formData.numero_tel,
          sexe: formData.sexe,
          avatar_url: formData.avatar_url,
          role_id: formData.role_id,
        })
        .eq('id', profile.id);

      if (userError) throw new Error(`Erreur Identité: ${userError.message}`);

      toast.success("PROFIL SYNCHRONISÉ", {
        description: "Vos informations ont été mises à jour avec succès."
      });
      
      await fetchProfile();
      return { success: true };
    } catch (err: any) {
      toast.error("ÉCHEC DE MISE À JOUR", { description: err.message });
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  // 4. CHANGEMENT DE RÔLE RAPIDE
  const changeRole = async (newRoleId: number) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('utilisateurs')
        .update({ role_id: newRoleId })
        .eq('id', profile?.id);

      if (error) throw error;

      toast.success("RÔLE MODIFIÉ", {
        description: "Votre interface va s'adapter à votre nouveau rôle."
      });
      
      await fetchProfile();
    } catch (err: any) {
      toast.error("ERREUR DE RÔLE", { description: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    profile,
    roles,
    isLoading,
    updateProfile,
    changeRole,
    refresh: fetchProfile
  };
};