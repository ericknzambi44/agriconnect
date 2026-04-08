// src/features/annonce/hooks/useAnnonces.ts
import { supabase } from '@/supabase';
import { useState } from 'react';

import { toast } from 'sonner';

export function useAnnonces() {
  const [loading, setLoading] = useState(false);

  const publierAnnonce = async (data: {
    prod_id: string;
    quantite_publiee: number;
    prix_unitaire: number;
  }) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      const prix_total = data.quantite_publiee * data.prix_unitaire;

      const { error } = await supabase
        .from('annonce')
        .insert([
          {
            user_id: user.id,
            prod_id: data.prod_id,
            prix_total: prix_total,
            statut: 'en_attente', // ou 'actif' selon ton workflow
          }
        ]);

      if (error) throw error;
      
      toast.success("ANNONCE PUBLIÉE", {
        description: `Votre offre est maintenant visible sur le marché.`,
      });
      return true;
    } catch (error: any) {
      toast.error("ÉCHEC DE PUBLICATION", {
        description: error.message,
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { publierAnnonce, loading };
}