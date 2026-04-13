import { supabase } from '@/supabase';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export function useAnnonces() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const publierAnnonce = async (data: {
    prod_id: string;
    quantite_vendre: number;
    prix_total?: number;
  }) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Session expirée");

      // 1. VÉRIFICATION DE L'ABONNEMENT ACTIF
      const { data: subscription, error: subError } = await supabase
        .from('abonnement') 
        .select('statut')
        .eq('id_utilisateur', user.id)
        .eq('statut', 'ACTIF')
        .maybeSingle();

      if (subError) throw subError;

      // 2. LOGIQUE DE BLOCAGE ET REDIRECTION
      if (!subscription) {
        toast.error("ABONNEMENT REQUIS", {
          description: "Vous devez avoir un abonnement actif pour publier une annonce.",
        });
        
        // Redirection vers ton lien spécifique
        setTimeout(() => {
          navigate('/dashboard/subscription');
        }, 1200);
        
        return false;
      }

      // 3. INSERTION DE L'ANNONCE (Si abonnement OK)
      const { error } = await supabase
        .from('annonce')
        .insert([
          {
            user_id: user.id,
            prod_id: data.prod_id,
            quantite_vendre: data.quantite_vendre,
            quantite_restante: data.quantite_vendre,
            statut: 'en_attente',
            date_pub: new Date().toISOString()
          }
        ]);

      if (error) throw error;
      
      toast.success("ANNONCE PUBLIÉE", {
        description: "Votre produit est maintenant visible sur le marché.",
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