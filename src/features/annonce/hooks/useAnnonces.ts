// src/features/annonce/hooks/useAnnonces.ts
import { supabase } from '@/supabase';
import { useState } from 'react';
import { toast } from 'sonner';

export function useAnnonces() {
  const [loading, setLoading] = useState(false);

  const publierAnnonce = async (data: {
    prod_id: string;
    quantite_vendre: number; // Volume que le vendeur met sur le marché
    prix_total?: number;     // Optionnel si calculé automatiquement
  }) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Session expirée");

      const { error } = await supabase
        .from('annonce')
        .insert([
          {
            user_id: user.id,
            prod_id: data.prod_id,
            quantite_vendre: data.quantite_vendre,    // Le volume total publié
            quantite_restante: data.quantite_vendre,  // Au début, tout est disponible
            statut: 'en_attente',
            date_pub: new Date().toISOString()
          }
        ]);

      if (error) throw error;
      
      toast.success("ANNONCE PROPULSÉE", {
        description: `${data.quantite_vendre} unités sont maintenant disponibles au marché.`,
      });
      return true;
    } catch (error: any) {
      toast.error("ERREUR SYSTÈME", {
        description: error.message,
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { publierAnnonce, loading };
}