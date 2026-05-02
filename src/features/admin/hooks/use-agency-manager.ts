// src/features/admin/hooks/use-agency-manager.ts
import { useState, useEffect } from 'react';
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

  const fetchAgencies = async () => {
    setLoading(true);
    try {
      // 1. Récupération des agences avec compteurs d'agents
      const { data: agencyData, error: agencyError } = await supabase
        .from('agence')
        .select('*, agents_count:agents_agence(count)')
        .order('created_at', { ascending: false });
      
      if (agencyError) throw agencyError;
      setAgencies(agencyData || []);

      // 2. Récupération des rôles (pour UserControlList)
      const { data: roleData, error: roleError } = await supabase
        .from('role')
        .select('*')
        .order('titre_role', { ascending: true });

      if (roleError) throw roleError;
      setRoles(roleData || []);

    } catch (error: any) {
      toast.error("Échec de la synchronisation");
      console.error("Fetch Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Crée une nouvelle agence dans la base de données
   * Les champs id et created_at sont gérés par Supabase
   */
  const createAgency = async (agencyData: AgencyInput) => {
    try {
      const { data, error } = await supabase
        .from('agence')
        .insert([agencyData])
        .select();

      if (error) throw error;

      // Mise à jour locale pour une réactivité instantanée
      if (data) {
        const newAgency = { ...data[0], agents_count: [{ count: 0 }] };
        setAgencies(prev => [newAgency, ...prev]);
      }
      
      return data;
    } catch (error: any) {
      console.error("Create Error:", error.message);
      throw error;
    }
  };

  /**
   * Supprime une agence par son UUID
   */
  const deleteAgency = async (id: string) => {
    try {
      const { error } = await supabase
        .from('agence')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setAgencies(prev => prev.filter(a => a.id !== id));
      toast.success("Node supprimé avec succès");
    } catch (error: any) {
      toast.error("Erreur lors de la suppression");
      throw error;
    }
  };

  useEffect(() => { 
    fetchAgencies(); 
  }, []);

  return { 
    agencies, 
    roles, 
    loading, 
    createAgency, 
    deleteAgency, 
    refresh: fetchAgencies 
  };
};