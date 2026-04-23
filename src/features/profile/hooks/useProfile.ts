// src/features/profile/hooks/use-profile.ts
import { supabase } from '@/supabase';
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Profile, Role } from '../types';

export const useProfile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);

  // 1. RÉCUPÉRATION DES RÔLES
  const fetchRoles = useCallback(async () => {
    const { data } = await supabase.from('role').select('*');
    if (data) setRoles(data);
  }, []);

  // 2. RÉCUPÉRATION DU PROFIL (Fetch initial)
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
        `)
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

  // --- LOGIQUE DE SYNCHRONISATION TEMPS RÉEL (REALTIME) ---
  useEffect(() => {
    fetchRoles();
    fetchProfile();

    let channel: any;

    // On récupère l'ID utilisateur pour écouter uniquement SES changements
    const setupSubscription = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      channel = supabase
        .channel(`profile-changes-${user.id}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'utilisateurs',
            filter: `id=eq.${user.id}`,
          },
          () => {
            // DÈS QU'UNE MODIF EST DÉTECTÉE (Même si c'est le rôle) :
            // On relance le fetch pour que TOUTE l'app se synchronise
            fetchProfile();
          }
        )
        .subscribe();
    };

    setupSubscription();

    // Nettoyage de la souscription quand on quitte la page
    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [fetchProfile, fetchRoles]);
  // -------------------------------------------------------

  // 3. MISE À JOUR UNIVERSELLE
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

      toast.success("SYNCHRONISATION TERMINÉE", {
        description: "Matrice d'identité mise à jour."
      });
      
      // Pas besoin de fetchProfile() ici car le Realtime va le détecter !
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

      // Note: On ne fait pas fetchProfile() ici non plus, le Realtime s'en occupe
    } catch (err: any) {
      toast.error("ERREUR DE PROTOCOLE", { description: err.message });
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