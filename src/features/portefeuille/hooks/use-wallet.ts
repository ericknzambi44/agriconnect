import { useEffect, useState } from 'react';
import { supabase } from '@/supabase';
import { useAuthSession } from '@/features/auth/hooks/use-auth-session';

export function useWallet() {
  const { profile } = useAuthSession();
  const [wallet, setWallet] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Garde-fou TypeScript et Logique
    if (!profile?.id) {
      setIsLoading(false);
      return;
    }

    // Extraction de l'ID pour garantir à TS qu'il n'est pas null dans les fonctions async
    const userId = profile.id;
    const channelId = `wallet-changes-${userId}`;
    const channel = supabase.channel(channelId);

    async function fetchWalletData() {
      try {
        // Récupération du portefeuille
        const { data: walletData, error: wErr } = await supabase
          .from('portefeuille')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();

        if (wErr) throw wErr;
        
        if (walletData) {
          setWallet(walletData);

          // Récupération des transactions
          const { data: transData, error: tErr } = await supabase
            .from('transactions_portefeuille')
            .select('*')
            .eq('portefeuille_id', walletData.id)
            .order('created_at', { ascending: false })
            .limit(10);

          if (tErr) throw tErr;
          setTransactions(transData || []);
        }
      } catch (error) {
        console.error("❌ Erreur Wallet Fetch:", error);
      } finally {
        setIsLoading(false);
      }
    }

    // Lancement de la récupération initiale
    fetchWalletData();

    // 2. Configuration Realtime (Ordre : .on AVANT .subscribe)
    channel
      .on(
        'postgres_changes',
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'portefeuille', 
          filter: `user_id=eq.${userId}` 
        }, 
        (payload) => {
          console.log('💰 Nouveau solde reçu en direct:', payload.new);
          setWallet(payload.new);
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`✅ Flux Wallet actif: ${channelId}`);
        }
      });

    // 3. Nettoyage au démontage
    return () => {
      console.log(`0️⃣ Fermeture du flux: ${channelId}`);
      supabase.removeChannel(channel);
    };
  }, [profile?.id]); // Se relance si l'ID change

  return { wallet, transactions, isLoading };
}