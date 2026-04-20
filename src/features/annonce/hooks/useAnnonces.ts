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
    
    console.log("🚀 [PiedZyne_Engine] Initialisation publication annonce...");

    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error("AUTH_SESSION_INVALID");

      // 1. VÉRIFICATION DE L'ABONNEMENT ACTIF (FIX: SUPPORT MULTIPLES PLANS)
      // On ajoute .limit(1) pour éviter l'erreur PGRST116 si plusieurs ACTIF existent
      const { data: subscription, error: subError } = await supabase
        .from('abonnement') 
        .select('statut')
        .eq('id_utilisateur', user.id)
        .eq('statut', 'ACTIF')
       // .order('created_at', { ascending: false }) // Priorité au plus récent
        .limit(1) 
        .maybeSingle();

      if (subError) {
        console.error("❌ [Sub_Check_Error]:", subError);
        throw new Error("Erreur lors de la vérification du node_abonnement");
      }

      // 2. LOGIQUE DE BLOCAGE ET REDIRECTION
      if (!subscription) {
        toast.error("ACCÈS REFUSÉ", {
          description: "Protocole de sécurité : Licence Pied Zyne active requise pour publier.",
          className: "bg-secondary border-2 border-primary text-foreground font-tech uppercase italic font-black",
        });
        
        setTimeout(() => {
          navigate('/dashboard/subscription');
        }, 1500);
        
        return false;
      }

      // 3. INSERTION DE L'ANNONCE
      const payload = {
        user_id: user.id,
        prod_id: data.prod_id,
        quantite_vendre: data.quantite_vendre,
        quantite_restante: data.quantite_vendre,
        statut: 'en_attente',
        date_pub: new Date().toISOString()
      };

      console.log("📦 [Payload_Dump]:", payload);

      const { error: insertError } = await supabase
        .from('annonce')
        .insert([payload]);

      if (insertError) {
        console.error("❌ [Insert_Error_Details]:", insertError);
        if (insertError.code === '42501') throw new Error("Permission RLS refusée sur la table 'annonce'.");
        if (insertError.code === '23503') throw new Error("Référence produit (prod_id) introuvable.");
        throw insertError;
      }

      // SUCCÈS
      toast.success("PUBLICATION VALIDÉE", {
        description: "Flux synchronisé. Votre produit est maintenant en attente sur AgriMarket.",
        className: "border-2 border-primary bg-background text-primary font-tech italic font-black",
      });
      
      return true;

    } catch (error: any) {
      console.error("⚠️ [System_Failure]:", error);
      
      toast.error("ERREUR SYSTÈME", {
        description: error.message || "Interruption du flux de données.",
        className: "bg-red-950 border-2 border-red-500 text-white font-tech",
      });
      
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { publierAnnonce, loading };
}