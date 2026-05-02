// src/features/admin/hooks/use-admin-user-master.ts
import { useState, useCallback } from 'react';
import { supabase } from '@/supabase';

// Typage strict décomposé pour éviter les erreurs "any"
export interface AgencyData {
  id: string;
  nom: string;
}

export interface AgencyLink {
  agence: AgencyData | null;
}

export interface UserRole {
  admin_role: string;
}

export interface UserMasterData {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  role: UserRole | null;
  agents_agence: AgencyLink[];
}

export const useAdminUserMaster = () => {
  const [users, setUsers] = useState<UserMasterData[]>([]);
  const [loading, setLoading] = useState(false);

  // FETCH : Récupération des opérateurs
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
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // FIX : Le "as unknown as" contourne l'inférence par défaut de Supabase 
      // qui prenait à tort les objets liés pour des tableaux.
      setUsers((data as unknown as UserMasterData[]) || []);
    } catch (err) {
      console.error("Erreur FetchUsers:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // CREATE : Enregistrement
  const createUser = async (userData: { nom: string; prenom: string; email: string }) => {
    const { data, error } = await supabase
      .from('utilisateurs')
      .insert([userData])
      .select();
    
    if (error) throw error;
    await fetchUsers(); // Rafraîchir pour avoir les jointures
    return data?.[0];
  };

  // UPDATE : Mise à jour
  const updateUser = async (userId: string, updates: Partial<UserMasterData>) => {
    const { error } = await supabase
      .from('utilisateurs')
      .update(updates)
      .eq('id', userId);
    
    if (error) throw error;
    await fetchUsers();
  };

  // DELETE : Suppression propre
  const deleteUser = async (userId: string) => {
    try {
      // 1. Nettoyage des liaisons (Sécurité FK)
      await supabase.from('agents_agence').delete().eq('user_id', userId);
      
      // 2. Destruction du profil
      const { error } = await supabase.from('utilisateurs').delete().eq('id', userId);
      if (error) throw error;

      // Mise à jour de l'état local pour la fluidité (sans refetch)
      setUsers(prev => prev.filter(u => u.id !== userId));
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
      throw err;
    }
  };

  // ASSIGN : Protocole de liaison d'agence
  const assignToAgency = async (uId: string, aId: string | null) => {
    try {
      // Étape 1 : On purge toujours l'ancienne liaison pour ce user (évite les doublons)
      const { error: delError } = await supabase
        .from('agents_agence')
        .delete()
        .eq('user_id', uId);

      if (delError) throw delError;
      
      // Étape 2 : Si un aId est fourni, on crée la nouvelle liaison
      if (aId) {
        const { error: insError } = await supabase
          .from('agents_agence')
          .insert([{ user_id: uId, agence_id: aId }]);
        
        if (insError) throw insError;
      }
      
      // Étape 3 : Synchronisation silencieuse de l'interface
      await fetchUsers();
    } catch (err) {
      console.error("Erreur protocole affectation:", err);
      throw err;
    }
  };

  return { 
    users, 
    loading, 
    fetchUsers, 
    createUser, 
    updateUser, 
    deleteUser, 
    assignToAgency 
  };
};