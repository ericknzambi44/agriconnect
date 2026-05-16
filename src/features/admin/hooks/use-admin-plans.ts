// src/features/admin/hooks/use-admin-plans.ts
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/supabase';
import { toast } from 'sonner';

export interface Plan {
  id_plans: string;
  code_plan: string;
  nom: string;
  prix: number;
  duree_jour: number;
  avantages?: string[];
}

export const useAdminPlans = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPlans = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .order('prix', { ascending: true });

      if (error) throw error;
      setPlans(data || []);
    } catch (err: any) {
      toast.error("Erreur chargement des plans");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createPlan = async (planData: Omit<Plan, 'id_plans'>) => {
    try {
      const { data, error } = await supabase
        .from('plans')
        .insert([planData])
        .select()
        .single();

      if (error) throw error;
      toast.success("Plan créé avec succès");
      await fetchPlans();
      return data;
    } catch (err: any) {
      toast.error(err.message || "Erreur création");
      throw err;
    }
  };

  const updatePlan = async (id: string, updates: Partial<Plan>) => {
    try {
      const { error } = await supabase
        .from('plans')
        .update(updates)
        .eq('id_plans', id);

      if (error) throw error;
      toast.success("Plan mis à jour");
      await fetchPlans();
    } catch (err: any) {
      toast.error(err.message || "Erreur mise à jour");
      throw err;
    }
  };

  const deletePlan = async (id: string) => {
    try {
      const { error } = await supabase
        .from('plans')
        .delete()
        .eq('id_plans', id);

      if (error) throw error;
      toast.success("Plan supprimé");
      await fetchPlans();
    } catch (err: any) {
      toast.error(err.message || "Impossible de supprimer");
      throw err;
    }
  };

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  return { plans, loading, fetchPlans, createPlan, updatePlan, deletePlan };
};