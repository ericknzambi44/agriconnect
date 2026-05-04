// src/features/notifications/components/NotificationCenterView.tsx
import React from 'react';
import { 
  Bell, BellOff, Check, MailOpen, Package, 
  AlertCircle, Trash2, Loader2, ShieldCheck, Zap,
  Fingerprint
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { formatDistanceToNow, isValid } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useNotifications } from '../hooks/useNotifications';

export function NotificationCenterView() {
  const { notifications, loading, markAsRead, unreadCount, currentUserId } = useNotifications();

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <div className="relative">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-primary animate-pulse" />
      </div>
      <span className="font-tech text-[10px] text-primary font-black uppercase tracking-[0.4em] mt-4">SYNC_STREAM...</span>
    </div>
  );

  return (
    // h-full et overflow-hidden pour que le scroll soit interne au composant
    <div className="flex flex-col w-full h-full animate-in fade-in duration-500 overflow-hidden bg-background">
      
      {/* HEADER : COLLÉ AU TOP, STICKY ET ADAPTATIF */}
      <div className="sticky top-0 z-20 flex flex-col sm:flex-row sm:items-center justify-between p-4 md:p-6 lg:px-10 gap-4 border-b border-white/5 bg-background/80 backdrop-blur-xl shrink-0">
        <div className="flex items-center gap-4 md:gap-6">
          <div className="relative shrink-0">
            <div className="absolute -inset-1 bg-primary/20 rounded-xl blur-sm"></div>
            <div className="relative w-12 h-12 md:w-14 md:h-14 bg-black rounded-xl border border-primary/30 flex items-center justify-center">
              <Bell className="text-primary w-6 h-6 md:w-7 md:h-7" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 md:h-5 md:w-5 items-center justify-center rounded-full bg-primary text-[8px] md:text-[10px] font-black text-primary-foreground shadow-[0_0_10px_rgba(var(--primary),0.5)]">
                  {unreadCount}
                </span>
              )}
            </div>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)] animate-pulse" />
                <span className="font-tech text-[8px] text-emerald-500 font-bold uppercase tracking-widest truncate">Secure_Live_Feed</span>
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-black text-white italic leading-none tracking-tighter uppercase truncate">
              Flux_<span className="text-primary">Notifications</span>
            </h2>
          </div>
        </div>

        {unreadCount > 0 && (
          <button 
            onClick={() => {/* Logique globale ici */}}
            className="h-10 md:h-12 px-4 md:px-6 bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground rounded-lg border border-primary/20 font-display font-black text-[9px] md:text-[10px] uppercase italic transition-all flex items-center justify-center gap-2"
          >
            <Check size={14} strokeWidth={3} />
            <span>Tout marquer lu</span>
          </button>
        )}
      </div>

      {/* BODY : LISTE INTELLIGENTE */}
      <div className="flex-1 overflow-y-auto no-scrollbar bg-black/20 flex flex-col">
        
        {/* SUB-HEADER INFO (Mobile Hidden ou Compact) */}
        <div className="hidden sm:flex px-6 md:px-10 py-2 bg-white/[0.02] border-b border-white/5 items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
                <Fingerprint size={10} className="text-primary/30" />
                <span className="font-tech text-[7px] text-muted-foreground/40 font-bold uppercase tracking-widest italic text-white/40">Notification_Active</span>
            </div>
            <span className="font-tech text-[7px] text-muted-foreground/30 font-black uppercase tracking-tighter">{notifications?.length}détectés</span>
        </div>

        <div className="flex-1 divide-y divide-white/[0.03]">
          {notifications && notifications.length > 0 ? (
            notifications.map((notif) => (
              <NotificationRow 
                key={notif.id} 
                notif={notif} 
                currentUserId={currentUserId}
                onRead={() => markAsRead(notif.id)} 
              />
            ))
          ) : (
            <EmptyState />
          )}
        </div>

        {/* FOOTER INTERNE */}
        <div className="px-6 md:px-10 py-4 border-t border-white/5 flex justify-between items-center shrink-0">
          <span className="font-tech text-[8px] text-white/10 font-black uppercase tracking-[0.4em]">Agriconect_v1.0</span>
          <ShieldCheck size={12} className="text-white/5" />
        </div>
      </div>
    </div>
  );
}

function NotificationRow({ notif, onRead, currentUserId }: { notif: any, onRead: () => void, currentUserId: string | undefined }) {
  const isUnread = !notif.is_read;
  const dateObj = new Date(notif.created_at);
  const timeLabel = isValid(dateObj) ? formatDistanceToNow(dateObj, { addSuffix: true, locale: fr }) : "récent";
  const isSuccess = notif.type === 'SUCCESS';
  const isAcheteur = notif.expedition?.acheteur_id === currentUserId;
  const showSecurityCode = isAcheteur && notif.expedition?.code_retrait;

  return (
    <div className={cn(
      "group relative flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 p-5 md:p-8 transition-all duration-200",
      isUnread ? "bg-primary/[0.04]" : "hover:bg-white/[0.01]"
    )}>
      {/* INDICATEUR D'ÉTAT */}
      {isUnread && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary shadow-[2px_0_10px_rgba(var(--primary),0.5)]" />
      )}

      {/* ICONE & TIME (Mobile row) */}
      <div className="flex items-center justify-between w-full md:w-auto shrink-0">
        <div className={cn(
          "w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center border transition-transform group-hover:scale-105",
          isUnread 
            ? isSuccess ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500" : "bg-primary/10 border-primary/30 text-primary"
            : "bg-white/5 border-white/5 text-muted-foreground/30"
        )}>
          {isSuccess ? <Package size={20} /> : <AlertCircle size={20} />}
        </div>
        <span className="md:hidden font-tech text-[8px] text-primary/40 font-black uppercase">{timeLabel}</span>
      </div>

      {/* CONTENU */}
      <div className="flex-1 min-w-0">
        <div className="hidden md:flex items-center gap-3 mb-1">
          <h3 className={cn(
            "text-lg font-display font-black uppercase italic tracking-tight",
            isUnread ? "text-white" : "text-muted-foreground/40"
          )}>
            {notif.titre}
          </h3>
          <span className="font-tech text-[8px] text-primary/30 font-bold uppercase italic">{timeLabel}</span>
        </div>
        <h3 className={cn("md:hidden text-base font-display font-black uppercase italic mb-1", isUnread ? "text-white" : "text-muted-foreground/40")}>
          {notif.titre}
        </h3>
        <p className={cn(
          "text-sm leading-relaxed max-w-5xl transition-colors",
          isUnread ? "text-white/70" : "text-muted-foreground/20"
        )}>
          {notif.message}
        </p>
      </div>

      {/* CODE SÉCURISÉ & ACTIONS */}
      <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-4 mt-2 md:mt-0">
        {showSecurityCode && (
           <div className="bg-primary/10 px-4 py-2 rounded-lg border border-primary/20 flex flex-col items-center">
             <span className="font-tech text-[6px] text-primary font-black uppercase tracking-tighter">Token</span>
             <span className="font-display font-black text-lg text-white tracking-[0.1em]">{notif.expedition.code_retrait}</span>
           </div>
        )}
        
        <div className="flex gap-2">
          {isUnread && (
            <button onClick={onRead} className="h-9 w-9 flex items-center justify-center bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-black rounded-lg transition-all border border-emerald-500/20">
              <MailOpen size={16} />
            </button>
          )}
          <button className="h-9 w-9 flex items-center justify-center bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg transition-all border border-red-500/10">
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-10 opacity-20">
      <BellOff size={48} className="mb-4" />
      <h3 className="font-display text-xl uppercase italic font-black">Flux_Vierge</h3>
      <p className="font-tech text-[8px] uppercase tracking-[0.2em] mt-2 italic">Aucune donnée entrante...</p>
    </div>
  );
}