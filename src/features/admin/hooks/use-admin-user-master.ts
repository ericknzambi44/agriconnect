// src/features/admin/hooks/use-admin-user-master.ts
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/supabase';
import { toast } from 'sonner';

export interface UserMasterData {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  numero_tel?: string;
  role?: { id: string; admin_role: string } | null;
  agents_agence?: { agence: { id: string; nom: string } | null }[];
}

export const useAdminUserMaster = () => {
  const [users, setUsers] = useState<UserMasterData[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRoles = useCallback(async () => {
    const { data, error } = await supabase.from('role').select('*');
    if (!error) setRoles(data || []);
  }, []);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('utilisateurs')
        .select(`
          id, nom, prenom, email, numero_tel,
          role:role_id ( id, admin_role ),
          agents_agence (
            agence:agence_id ( id, nom )
          )
        `)
        .order('nom', { ascending: true });
      if (error) throw error;
      setUsers(data as unknown as UserMasterData[]);
    } catch (err) {
      console.error("Erreur fetchUsers:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Création d'utilisateur avec mot de passe
  const createUser = async (userData: any, password: string) => {
    try {
      // 1. Créer l'utilisateur dans Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: password,
      });
      if (authError) throw authError;
      if (!authData.user) throw new Error("Utilisateur non créé");

      const userId = authData.user.id;

      // 2. Mettre à jour les informations dans la table utilisateurs (si le trigger ne l'a pas fait)
      const { error: updateError } = await supabase
        .from('utilisateurs')
        .update({
          nom: userData.nom,
          prenom: userData.prenom,
          numero_tel: userData.numero_tel,
          role_id: userData.role_id,
        })
        .eq('id', userId);
      if (updateError) {
        // Si l'utilisateur n'existe pas, on l'insère
        const { error: insertError } = await supabase
          .from('utilisateurs')
          .insert({
            id: userId,
            email: userData.email,
            nom: userData.nom,
            prenom: userData.prenom,
            numero_tel: userData.numero_tel,
            role_id: userData.role_id,
          });
        if (insertError) throw insertError;
      }

      // 3. Lier à une agence si demandé
      if (userData.agence_id) {
        await supabase.from('agents_agence').insert([{
          user_id: userId,
          agence_id: userData.agence_id,
        }]);
      }

      toast.success(`Utilisateur créé. Email : ${userData.email}, Mot de passe : ${password}`);
      await fetchUsers();
      return authData.user;
    } catch (error: any) {
      console.error(error);
      toast.error("Erreur création : " + error.message);
      throw error;
    }
  };

  const updateUser = async (userId: string, updates: any) => {
    const cleanUpdates = { ...updates };
    delete cleanUpdates.role;
    delete cleanUpdates.agents_agence;
    delete cleanUpdates.id;
    delete cleanUpdates.email; // l'email ne se modifie pas via cette méthode (à gérer avec Auth si besoin)

    const { error } = await supabase
      .from('utilisateurs')
      .update(cleanUpdates)
      .eq('id', userId);
    if (error) throw error;
    toast.success("Utilisateur mis à jour");
    await fetchUsers();
  };

  const deleteUser = async (userId: string) => {
    await supabase.from('agents_agence').delete().eq('user_id', userId);
    const { error } = await supabase.from('utilisateurs').delete().eq('id', userId);
    if (error) throw error;
    setUsers(prev => prev.filter(u => u.id !== userId));
    toast.success("Utilisateur supprimé");
  };

  const linkUserToAgency = async (userId: string, agenceId: string) => {
    const { error } = await supabase.from('agents_agence').insert([{ user_id: userId, agence_id: agenceId }]);
    if (error) throw error;
    toast.success("Utilisateur lié à l'agence");
    await fetchUsers();
  };

  const unlinkUserFromAgency = async (userId: string) => {
    const { error } = await supabase.from('agents_agence').delete().eq('user_id', userId);
    if (error) throw error;
    toast.success("Utilisateur délié");
    await fetchUsers();
  };

  useEffect(() => {
    fetchRoles();
    fetchUsers();
  }, []);

  return { users, roles, loading, fetchUsers, createUser, updateUser, deleteUser, linkUserToAgency, unlinkUserFromAgency };
};