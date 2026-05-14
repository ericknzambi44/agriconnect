// src/features/admin/hooks/use-admin-user-master.ts
import { useState, useCallback } from 'react';
import { supabase } from '@/supabase';

export interface UserMasterData {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  role?: { admin_role: string } | null;
  agents_agence?: { agence: { id: string; nom: string } | null }[];
}

export const useAdminUserMaster = () => {
  const [users, setUsers] = useState<UserMasterData[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('utilisateurs')
        .select(`
          id, nom, prenom, email, 
          role:role_id(admin_role),
          agents_agence(agence:agence_id(id, nom))
        `)
        .order('nom', { ascending: true });
      
      if (error) throw error;
      setUsers((data as unknown as UserMasterData[]) || []);
    } catch (err) {
      console.error("Erreur Fetch:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createUser = async (userData: any) => {
    // On s'assure d'envoyer uniquement les colonnes réelles
    const { data, error } = await supabase
      .from('utilisateurs')
      .insert([{
        nom: userData.nom,
        prenom: userData.prenom,
        email: userData.email,
        role_id: userData.role_id // On passe l'ID, pas l'objet
      }])
      .select();
    
    if (error) throw error;
    await fetchUsers();
    return data?.[0];
  };

  const updateUser = async (userId: string, updates: any) => {
    // FIX CRITIQUE : Supprimer les données de jointure avant l'update
    const cleanUpdates = { ...updates };
    delete cleanUpdates.role;
    delete cleanUpdates.agents_agence;
    delete cleanUpdates.id;

    const { error } = await supabase
      .from('utilisateurs')
      .update(cleanUpdates)
      .eq('id', userId);
    
    if (error) throw error;
    await fetchUsers();
  };

  const deleteUser = async (userId: string) => {
   
    await supabase.from('agents_agence').delete().eq('user_id', userId);
    const { error } = await supabase.from('utilisateurs').delete().eq('id', userId);
    if (error) throw error;
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  return { users, loading, fetchUsers, createUser, updateUser, deleteUser };
};