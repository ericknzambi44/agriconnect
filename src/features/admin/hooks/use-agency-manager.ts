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

  const fetchAgencies = useCallback(async () => {
    setLoading(true);
    try {
      // Récupération avec compteurs d'agents
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
      await fetchAgencies(); // Rechargement complet pour garantir l'intégrité
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
      // 1. On libère d'abord les agents liés (on met leur agence_id à null ou on supprime la liaison)
      // Si ta table agents_agence est une table de liaison :
      await supabase.from('agents_agence').delete().eq('agence_id', id);

      // 2. On supprime l'agence
      const { error } = await supabase
        .from('agence')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setAgencies(prev => prev.filter(a => a.id !== id));
      toast.success("Agence supprimée définitivement");
    } catch (error: any) {
      console.error(error);
      toast.error("Erreur : Cette agence possède peut-être des données liées");
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
    refresh: fetchAgencies 
  };
};