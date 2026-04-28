// src/features/notifications/hooks/useNotifications.ts
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/supabase';
import { useAuthSession } from '@/features/auth/hooks/use-auth-session';

export function useNotifications() {
  const { profile } = useAuthSession();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    if (!profile?.id) return;

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select(`
          *,
          expedition:expedition_id (
            code_retrait,
            statut_expedition,
            acheteur_id,
            vendeur_id,
            commande:commande_id (
              annonce:annonce_id (produit:prod_id (nom_prod))
            )
          )
        `)
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotifications(data || []);
      setUnreadCount(data?.filter(n => !n.is_read).length || 0);
    } catch (err) {
      console.error("[NOTIFICATIONS] Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [profile?.id]);

  useEffect(() => {
    if (!profile?.id) return;
    fetchNotifications();

    const instanceId = Math.random().toString(36).substring(7);
    const channel = supabase.channel(`notifs_realtime_${instanceId}`);

    channel
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'notifications',
          filter: `user_id=eq.${profile.id}` 
        },
        () => fetchNotifications()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile?.id, fetchNotifications]);

  const markAsRead = async (id: string) => {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id);

    if (!error) {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  return { notifications, unreadCount, loading, markAsRead, currentUserId: profile?.id };
}