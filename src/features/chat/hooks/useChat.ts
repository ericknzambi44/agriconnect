// features/chat/hooks/useChat.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/supabase';
import { useAuthSession } from '@/features/auth/hooks/use-auth-session';
import { toast } from 'sonner';

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface UserInfo {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  numero_tel?: string;
  avatar_url?: string;
}

export interface Conversation {
  user_id: string;
  user: UserInfo;
  last_message: string;
  last_message_time: string;
  unread_count: number;
}

export function useChat() {
  const { profile } = useAuthSession();
  const userId = profile?.id;

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [searchResults, setSearchResults] = useState<UserInfo[]>([]);
  const [searching, setSearching] = useState(false);
  const searchDebounce = useRef<number | undefined>(undefined);
  const receivedIds = useRef<Set<string>>(new Set()); // Évite les doublons en temps réel

  // Charger les conversations
  const loadConversations = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const { data: messagesData, error: msgError } = await supabase
        .from('messages')
        .select('sender_id, receiver_id, message, created_at, is_read')
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .order('created_at', { ascending: false });
      if (msgError) throw msgError;

      if (!messagesData?.length) {
        setConversations([]);
        return;
      }

      const otherUserIds = new Set<string>();
      messagesData.forEach(msg => {
        if (msg.sender_id === userId) otherUserIds.add(msg.receiver_id);
        else otherUserIds.add(msg.sender_id);
      });

      const { data: usersData, error: usersError } = await supabase
        .from('utilisateurs')
        .select('id, nom, prenom, email, numero_tel, avatar_url')
        .in('id', Array.from(otherUserIds));
      if (usersError) throw usersError;

      const userMap = new Map(usersData?.map(u => [u.id, u as UserInfo]));

      const convMap = new Map<string, Conversation>();
      messagesData.forEach(msg => {
        const otherId = msg.sender_id === userId ? msg.receiver_id : msg.sender_id;
        const user = userMap.get(otherId);
        if (!user) return;

        const existing = convMap.get(otherId);
        if (!existing) {
          convMap.set(otherId, {
            user_id: otherId,
            user,
            last_message: msg.message,
            last_message_time: msg.created_at,
            unread_count: (!msg.is_read && msg.receiver_id === userId) ? 1 : 0,
          });
        } else {
          if (!msg.is_read && msg.receiver_id === userId) existing.unread_count += 1;
          if (new Date(msg.created_at) > new Date(existing.last_message_time)) {
            existing.last_message = msg.message;
            existing.last_message_time = msg.created_at;
          }
        }
      });

      const convList = Array.from(convMap.values());
      convList.sort((a, b) => new Date(b.last_message_time).getTime() - new Date(a.last_message_time).getTime());
      setConversations(convList);
    } catch (err) {
      console.error(err);
      toast.error("Impossible de charger les conversations");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Charger les messages avec un utilisateur spécifique
  const loadMessages = useCallback(async (otherUserId: string) => {
    if (!userId || !otherUserId) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${userId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${userId})`)
        .order('created_at', { ascending: true });
      if (error) throw error;

      // Reset received ids for this conversation
      receivedIds.current.clear();
      data?.forEach(msg => receivedIds.current.add(msg.id));
      setMessages(data || []);

      // Marquer comme lus les messages reçus non lus
      const unreadIds = data?.filter(m => m.receiver_id === userId && !m.is_read).map(m => m.id) || [];
      if (unreadIds.length) {
        await supabase.from('messages').update({ is_read: true }).in('id', unreadIds);
        setConversations(prev => prev.map(conv =>
          conv.user_id === otherUserId ? { ...conv, unread_count: 0 } : conv
        ));
      }
    } catch (err) {
      console.error(err);
      toast.error("Erreur chargement messages");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Envoyer un message
  const sendMessage = useCallback(async (receiverId: string, messageText: string) => {
    if (!userId || !receiverId || !messageText.trim()) return false;
    setSending(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          sender_id: userId,
          receiver_id: receiverId,
          message: messageText.trim(),
          is_read: false,
        })
        .select()
        .single();

      if (error) throw error;

      // Ajouter localement
      setMessages(prev => [...prev, data]);
      receivedIds.current.add(data.id);
      setConversations(prev => {
        const idx = prev.findIndex(c => c.user_id === receiverId);
        if (idx !== -1) {
          const updated = [...prev];
          updated[idx].last_message = messageText;
          updated[idx].last_message_time = new Date().toISOString();
          return updated;
        }
        loadConversations();
        return prev;
      });
      return true;
    } catch (err: any) {
      console.error(err);
      toast.error(`Échec de l'envoi : ${err.message || "Erreur inconnue"}`);
      return false;
    } finally {
      setSending(false);
    }
  }, [userId, loadConversations]);

  // Recherche d'utilisateurs
  const searchUsers = useCallback(async (query: string) => {
    if (!userId) {
      setSearchResults([]);
      return;
    }
    if (!query.trim() || query.length < 2) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    try {
      const { data, error } = await supabase
        .from('utilisateurs')
        .select('id, nom, prenom, email, numero_tel, avatar_url')
        .or(`nom.ilike.%${query}%,prenom.ilike.%${query}%,email.ilike.%${query}%,numero_tel.ilike.%${query}%`)
        .neq('id', userId)
        .limit(20);
      if (error) throw error;
      setSearchResults(data || []);
    } catch (err) {
      console.error("Erreur recherche:", err);
      toast.error("Erreur lors de la recherche");
    } finally {
      setSearching(false);
    }
  }, [userId]);

  const debouncedSearch = useCallback((query: string) => {
    if (searchDebounce.current) clearTimeout(searchDebounce.current);
    searchDebounce.current = window.setTimeout(() => {
      searchUsers(query);
    }, 400);
  }, [searchUsers]);

  const startConversation = useCallback(async (user: UserInfo) => {
    if (!user?.id) return;
    setSelectedUser(user);
    await loadMessages(user.id);
    setConversations(prev => {
      if (prev.some(c => c.user_id === user.id)) return prev;
      return [{
        user_id: user.id,
        user,
        last_message: "",
        last_message_time: new Date().toISOString(),
        unread_count: 0,
      }, ...prev];
    });
    setSearchResults([]);
  }, [loadMessages]);

  // Temps réel (gestion des inserts)
  useEffect(() => {
    if (!userId) return;
    const subscription = supabase
      .channel('chat-channel')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        const newMsg = payload.new as Message;
        // Éviter les doublons
        if (receivedIds.current.has(newMsg.id)) return;
        receivedIds.current.add(newMsg.id);

        if (newMsg.receiver_id === userId || newMsg.sender_id === userId) {
          // Si la conversation est ouverte, ajouter le message
          if (selectedUser && (newMsg.sender_id === selectedUser.id || newMsg.receiver_id === selectedUser.id)) {
            setMessages(prev => [...prev, newMsg]);
            // Si c'est l'utilisateur courant qui reçoit, marquer comme lu immédiatement
            if (newMsg.receiver_id === userId && !newMsg.is_read) {
              supabase.from('messages').update({ is_read: true }).eq('id', newMsg.id);
            }
          }
          loadConversations();
        }
      })
      .subscribe();
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [userId, selectedUser, loadConversations]);

  useEffect(() => {
    if (userId) loadConversations();
  }, [userId, loadConversations]);

  return {
    conversations,
    messages,
    selectedUser,
    setSelectedUser,
    loading,
    sending,
    searching,
    searchResults,
    loadMessages,
    sendMessage,
    searchUsers: debouncedSearch,
    startConversation,
    refresh: loadConversations,
  };
}