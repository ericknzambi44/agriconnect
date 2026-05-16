// features/chat/components/ChatView.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../hooks/useChat';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Search, ArrowLeft, UserPlus, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from 'date-fns';

export function ChatView() {
  const {
    conversations,
    messages,
    selectedUser,
    setSelectedUser,
    loading,
    sending,
    searchResults,
    searching,
    sendMessage,
    searchUsers,
    startConversation
  } = useChat();

  const [messageInput, setMessageInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewChat, setShowNewChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input
  useEffect(() => {
    if (selectedUser) inputRef.current?.focus();
  }, [selectedUser]);

  // Debounced search
  useEffect(() => {
    if (showNewChat && searchTerm.length >= 2) {
      const delayDebounce = setTimeout(() => {
        searchUsers(searchTerm);
      }, 300);
      return () => clearTimeout(delayDebounce);
    }
  }, [searchTerm, showNewChat, searchUsers]);

  const handleSelectUser = async (user: any) => {
    setSelectedUser(user);
    setShowNewChat(false);
    setSearchTerm('');
  };

  const handleSend = async () => {
    if (!messageInput.trim() || !selectedUser) return;
    const success = await sendMessage(selectedUser.id, messageInput);
    if (success) setMessageInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatMessageDate = (date: string) => format(new Date(date), 'HH:mm');
  const formatConversationDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    return d.toDateString() === now.toDateString()
      ? format(d, 'HH:mm')
      : format(d, 'dd/MM');
  };

  return (
    <div className="w-full h-[calc(100vh-120px)] bg-gradient-to-br from-[#0a0a0a] via-[#050505] to-black rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex">
      {/* Sidebar */}
      <div className={cn(
        "w-full md:w-96 border-r border-white/10 bg-black/40 backdrop-blur-sm flex flex-col transition-all duration-300",
        selectedUser ? "hidden md:flex" : "flex"
      )}>
        <div className="p-4 border-b border-white/10">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-display font-black italic uppercase text-white tracking-tighter">Messages</h2>
            <button onClick={() => setShowNewChat(!showNewChat)} className={cn(
              "p-2 rounded-full transition-all",
              showNewChat ? "bg-primary text-black" : "bg-primary/20 text-primary hover:bg-primary hover:text-black"
            )}>
              <UserPlus size={18} />
            </button>
          </div>
          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <Input
              placeholder={showNewChat ? "Rechercher..." : "Rechercher une conversation..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {showNewChat ? (
            searching ? (
              <div className="text-center py-10 text-white/40 font-tech text-xs">Recherche...</div>
            ) : searchResults.length === 0 && searchTerm.length >= 2 ? (
              <div className="text-center py-10 text-white/40 font-tech text-xs">Aucun utilisateur trouvé</div>
            ) : (
              searchResults.map(user => (
                <button key={user.id} onClick={() => startConversation(user)} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all duration-300 text-left">
                  <Avatar className="w-12 h-12 border border-white/20 rounded-xl">
                    <AvatarImage src={user.avatar_url || ''} />
                    <AvatarFallback className="bg-primary/20 text-primary font-black rounded-xl">
                      {user.prenom?.[0]}{user.nom?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-black uppercase italic text-white truncate">{user.prenom} {user.nom}</p>
                    <p className="text-[11px] text-white/50 truncate">{user.email}</p>
                  </div>
                </button>
              ))
            )
          ) : loading && conversations.length === 0 ? (
            <div className="text-center py-10 text-white/40 font-tech text-xs">Chargement...</div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-10 text-white/40 font-tech text-xs">Aucune conversation</div>
          ) : (
            conversations.map(conv => (
              <button key={conv.user_id} onClick={() => handleSelectUser(conv.user)} className={cn(
                "w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 text-left",
                selectedUser?.id === conv.user_id ? "bg-gradient-to-r from-primary/20 to-transparent border-l-4 border-primary" : "hover:bg-white/5"
              )}>
                <Avatar className="w-12 h-12 border border-white/20 rounded-xl">
                  <AvatarImage src={conv.user.avatar_url || ''} />
                  <AvatarFallback className="bg-primary/20 text-primary font-black rounded-xl">
                    {conv.user.prenom?.[0]}{conv.user.nom?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <p className="font-display font-black uppercase italic text-white truncate">{conv.user.prenom} {conv.user.nom}</p>
                    <span className="text-[8px] text-white/40 font-tech">{formatConversationDate(conv.last_message_time)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <p className="text-[11px] text-white/50 truncate flex-1">{conv.last_message || "Nouvelle conversation"}</p>
                    {conv.unread_count > 0 && (
                      <div className="w-5 h-5 rounded-full bg-primary text-[10px] font-black flex items-center justify-center shadow-[0_0_8px_rgba(var(--primary),0.8)]">
                        {conv.unread_count}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Zone de chat */}
      <div className={cn(
        "flex-1 flex flex-col bg-black/30 backdrop-blur-sm",
        !selectedUser ? "hidden md:flex md:items-center md:justify-center" : "flex"
      )}>
        {!selectedUser ? (
          <div className="text-center text-white/30 font-tech text-xs uppercase tracking-wider">
            Sélectionnez une conversation ou démarrez-en une nouvelle
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/40">
              <div className="flex items-center gap-3">
                <button onClick={() => setSelectedUser(null)} className="md:hidden text-white/60 hover:text-white">
                  <ArrowLeft size={20} />
                </button>
                <Avatar className="w-10 h-10 border border-white/20 rounded-xl">
                  <AvatarImage src={selectedUser.avatar_url} />
                  <AvatarFallback className="bg-primary/20 text-primary rounded-xl">
                    {selectedUser.prenom?.[0]}{selectedUser.nom?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-display font-black uppercase italic text-white">{selectedUser.prenom} {selectedUser.nom}</p>
                  <p className="text-[9px] text-white/40 font-tech">En ligne</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {loading ? (
                <div className="flex justify-center py-10"><div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>
              ) : messages.length === 0 ? (
                <div className="text-center text-white/40 font-tech text-xs py-20">Aucun message. Envoyez un message !</div>
              ) : (
                messages.map(msg => {
                  const isMine = msg.sender_id === selectedUser.id ? false : true;
                  return (
                    <div key={msg.id} className={cn("flex", isMine ? "justify-end" : "justify-start")}>
                      <div className={cn(
                        "max-w-[70%] px-4 py-2 rounded-2xl relative",
                        isMine ? "bg-gradient-to-r from-primary to-orange-400 text-black rounded-br-sm" : "bg-white/10 text-white rounded-bl-sm"
                      )}>
                        <p className="text-sm break-words">{msg.message}</p>
                        <div className="flex items-center justify-end gap-1 mt-1">
                          <span className="text-[8px] opacity-70">{formatMessageDate(msg.created_at)}</span>
                          {isMine && (
                            msg.is_read ? (
                              <CheckCheck size={12} className="opacity-70 text-green-600" />
                            ) : (
                              <CheckCheck size={12} className="opacity-70 text-white/50" />
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10 bg-black/40">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Écrire un message..."
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl"
                  disabled={sending}
                />
                <Button
                  onClick={handleSend}
                  disabled={sending || !messageInput.trim()}
                  className="bg-gradient-to-r from-primary to-orange-400 text-black rounded-xl px-4 disabled:opacity-50"
                >
                  <Send size={18} />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}