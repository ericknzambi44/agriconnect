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
  role?: { admin_role: string; id: string } | null;
  agence?: { id: string; nom: string } | null;
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
      // 1. Récupérer tous les utilisateurs avec leur rôle
      const { data: utilisateurs, error: usersError } = await supabase
        .from('utilisateurs')
        .select(`
          id, nom, prenom, email, numero_tel,
          role:role_id ( id, admin_role )
        `)
        .order('nom', { ascending: true });
      if (usersError) throw usersError;

      // 2. Récupérer les liaisons agence
      const { data: agents, error: agentsError } = await supabase
        .from('agents_agence')
        .select(`
          user_id,
          agence:agence_id ( id, nom )
        `);
      if (agentsError) throw agentsError;

      // 3. Construire un map user_id -> agence
      const agencyMap = new Map();
      agents?.forEach(agent => {
        if (!agencyMap.has(agent.user_id) && agent.agence) {
          agencyMap.set(agent.user_id, agent.agence);
        }
      });

      // 4. Normaliser les données (Supabase peut retourner un tableau pour une relation 1-1)
      const normalized = utilisateurs.map(user => {
        // Extraire le premier élément du tableau 'role' si c'est un tableau
        let roleObj = null;
        if (user.role) {
          if (Array.isArray(user.role) && user.role.length > 0) {
            roleObj = user.role[0];
          } else if (!Array.isArray(user.role)) {
            roleObj = user.role;
          }
        }
        return {
          ...user,
          role: roleObj,
          agence: agencyMap.get(user.id) || null,
        };
      });

      setUsers(normalized as UserMasterData[]);
    } catch (err) {
      console.error("Erreur fetchUsers:", err);
      toast.error("Impossible de charger les utilisateurs");
    } finally {
      setLoading(false);
    }
  }, []);

  const createUser = async (userData: any, password: string) => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: password,
      });
      if (authError) throw authError;
      if (!authData.user) throw new Error("Utilisateur non créé");

      const userId = authData.user.id;

      const { error: updateError } = await supabase
        .from('utilisateurs')
        .update({
          nom: userData.nom,
          prenom: userData.prenom,
          numero_tel: userData.numero_tel,
          role_id: userData.role_id,
        })
        .eq('id', userId);
      if (updateError) throw updateError;

      if (userData.agence_id) {
        await supabase.from('agents_agence').insert([{
          user_id: userId,
          agence_id: userData.agence_id,
        }]);
      }

      toast.success(`Utilisateur créé. Mot de passe : ${password}`);
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
    delete cleanUpdates.agence;
    delete cleanUpdates.id;
    delete cleanUpdates.email;

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
    await supabase.from('agents_agence').delete().eq('user_id', userId);
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