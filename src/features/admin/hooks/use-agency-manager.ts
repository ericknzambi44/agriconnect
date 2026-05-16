// src/features/admin/hooks/use-agency-manager.ts
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/supabase';
import { toast } from 'sonner';

export interface AgencyInput {
  nom: string;
  ville_territoire: string;
  telephone_responsable?: string;
}

export const useAgencyManager = () => {
  const [agencies, setAgencies] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [agentsList, setAgentsList] = useState<any[]>([]); // pour une agence sélectionnée

  const fetchAgencies = useCallback(async () => {
    setLoading(true);
    try {
      const { data: agencyData, error: agencyError } = await supabase
        .from('agence')
        .select('*, agents_count:agents_agence(count)')
        .order('nom', { ascending: true });
      
      if (agencyError) throw agencyError;
      setAgencies(agencyData || []);

      const { data: roleData, error: roleError } = await supabase
        .from('role')
        .select('*')
        .order('titre_role', { ascending: true });

      if (roleError) throw roleError;
      setRoles(roleData || []);

    } catch (error: any) {
      toast.error("Erreur de synchronisation");
    } finally {
      setLoading(false);
    }
  }, []);

  const createAgency = async (agencyData: AgencyInput) => {
    try {
      const { data, error } = await supabase
        .from('agence')
        .insert([agencyData])
        .select();

      if (error) throw error;
      toast.success("Agence créée avec succès");
      await fetchAgencies();
      return data;
    } catch (error: any) {
      toast.error("Impossible de créer l'agence");
      throw error;
    }
  };

  const updateAgency = async (id: string, updates: Partial<AgencyInput>) => {
    try {
      const { error } = await supabase
        .from('agence')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      toast.success("Informations mises à jour");
      await fetchAgencies();
    } catch (error: any) {
      toast.error("Échec de la modification");
      throw error;
    }
  };

  const deleteAgency = async (id: string) => {
    try {
      // Supprimer les liaisons agents
      await supabase.from('agents_agence').delete().eq('agence_id', id);
      const { error } = await supabase.from('agence').delete().eq('id', id);
      if (error) throw error;
      setAgencies(prev => prev.filter(a => a.id !== id));
      toast.success("Agence supprimée définitivement");
    } catch (error: any) {
      toast.error("Erreur : Cette agence possède peut-être des données liées");
    }
  };

  // Gestion des agents d'une agence
  const fetchAgentsForAgency = async (agenceId: string) => {
    try {
      const { data, error } = await supabase
        .from('agents_agence')
        .select('user_id, utilisateur:user_id(id, nom, prenom, email, numero_tel)')
        .eq('agence_id', agenceId);
      if (error) throw error;
      setAgentsList(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const addAgentToAgency = async (agenceId: string, userId: string) => {
    try {
      const { error } = await supabase
        .from('agents_agence')
        .insert([{ agence_id: agenceId, user_id: userId }]);
      if (error) throw error;
      toast.success("Agent ajouté à l'agence");
      await fetchAgentsForAgency(agenceId);
      await fetchAgencies(); // pour rafraîchir le compteur
    } catch (err: any) {
      toast.error("Erreur lors de l'ajout");
    }
  };

  const removeAgentFromAgency = async (agenceId: string, userId: string) => {
    try {
      const { error } = await supabase
        .from('agents_agence')
        .delete()
        .eq('agence_id', agenceId)
        .eq('user_id', userId);
      if (error) throw error;
      toast.success("Agent retiré de l'agence");
      await fetchAgentsForAgency(agenceId);
      await fetchAgencies();
    } catch (err: any) {
      toast.error("Erreur lors du retrait");
    }
  };

  useEffect(() => { fetchAgencies(); }, [fetchAgencies]);

  return { 
    agencies, 
    roles, 
    loading, 
    createAgency, 
    updateAgency, 
    deleteAgency, 
    refresh: fetchAgencies,
    agentsList,
    fetchAgentsForAgency,
    addAgentToAgency,
    removeAgentFromAgency
  };
};