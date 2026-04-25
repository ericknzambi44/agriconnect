// src/features/notifications/components/NotificationCenterView.tsx
import React from 'react';
import { 
  Bell, BellOff, Check, MailOpen, Package, 
  AlertCircle, Trash2, Hash, Loader2 
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { formatDistanceToNow, isValid } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useNotifications } from '../hooks/useNotifications';


export function NotificationCenterView() {
  const { notifications, loading, markAsRead, unreadCount } = useNotifications();

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 min-h-[500px]">
      <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
      <span className="font-tech text-[10px] text-primary/40 uppercase tracking-[0.5em]">Sync_Nexus_Data...</span>
    </div>
  );

  return (
    // On met un z-0 ou z-10 pour qu'il reste DERRIÈRE la Topbar (qui est en z-50)
    <div className="relative z-10 w-full max-w-5xl mx-auto p-4 md:p-6 lg:p-10 animate-in fade-in duration-700">
      
      {/* HEADER : PLUS FIN ET BIEN CALÉ */}
      <div className="flex items-center justify-between mb-8 px-2">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20">
            <Bell className="text-primary w-6 h-6" />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-display text-glow-primary">Flux_<span className="text-primary">Msg</span></h2>
            <p className="font-tech text-[8px] text-muted-foreground uppercase tracking-[0.3em] font-bold">Terminal_Nexus_Logistique</p>
          </div>
        </div>

        {unreadCount > 0 && (
          <button className="h-10 px-4 bg-secondary border border-border rounded-xl font-tech text-[9px] hover:border-primary/50 transition-all flex items-center gap-2 group">
            <Check className="w-3 h-3 text-primary" />
            Clear_{unreadCount}
          </button>
        )}
      </div>

      {/* CONTENEUR PRINCIPAL : EFFET VERRE SÉCURISÉ */}
      <div className="relative overflow-hidden bg-secondary/30 backdrop-blur-md border-2 border-border/60 rounded-[2rem] shadow-2xl">
        
        {/* LISTE : CONTRASTE AUGMENTÉ */}
        <div className="divide-y divide-border/40 max-h-[70vh] overflow-y-auto no-scrollbar">
          {notifications && notifications.length > 0 ? (
            notifications.map((notif) => (
              <NotificationRow 
                key={notif.id} 
                notif={notif} 
                onRead={() => markAsRead(notif.id)} 
              />
            ))
          ) : (
            <EmptyState />
          )}
        </div>

        {/* FOOTER DISCRET */}
        <div className="px-8 py-4 bg-background/40 border-t border-border/40 flex justify-between items-center">
          <span className="font-tech text-[7px] text-muted-foreground/30 uppercase tracking-[0.4em]">Protocol_Nexus_v1.2</span>
          <div className="flex gap-1">
             <div className="w-1 h-1 bg-primary rounded-full animate-pulse" />
             <div className="w-1 h-1 bg-primary/20 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

function NotificationRow({ notif, onRead }: { notif: any, onRead: () => void }) {
  const isUnread = !notif.is_read;
  const dateObj = new Date(notif.created_at);
  const timeLabel = isValid(dateObj) ? formatDistanceToNow(dateObj, { addSuffix: true, locale: fr }) : "récent";

  return (
    <div className={cn(
      "group relative flex flex-col sm:flex-row items-start sm:items-center gap-5 p-6 md:p-8 transition-all duration-300",
      isUnread ? "bg-primary/[0.04]" : "hover:bg-white/[0.02]"
    )}>
      
      {/* Ligne Néon latérale pour les non-lus */}
      {isUnread && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary shadow-[0_0_15px_var(--color-primary)]" />
      )}

      {/* ICONE TYPE */}
      <div className={cn(
        "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border-2 transition-transform duration-500 group-hover:scale-105",
        isUnread ? "bg-background border-primary/40 text-primary shadow-lg shadow-primary/5" : "bg-muted/10 border-border text-muted-foreground/40"
      )}>
        {notif.type === 'SUCCESS' ? <Package size={24} /> : <AlertCircle size={24} />}
      </div>

      {/* CONTENU : VISIBILITÉ MAXIMUM */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1">
          <h3 className={cn(
            "text-lg font-display uppercase italic tracking-tight",
            isUnread ? "text-foreground" : "text-muted-foreground/60"
          )}>
            {notif.titre}
          </h3>
          <span className="font-tech text-[8px] text-primary/40 font-bold uppercase tracking-tighter">
            // {timeLabel}
          </span>
        </div>
        
        {/* Le message est ici plus clair et plus contrasté */}
        <p className={cn(
          "text-sm leading-relaxed max-w-2xl font-sans",
          isUnread ? "text-foreground/90 font-semibold" : "text-muted-foreground/50 font-medium"
        )}>
          {notif.message}
        </p>
      </div>

      {/* CODE DE SÉCURITÉ */}
      {notif.expedition?.code_retrait && (
        <div className="shrink-0 group-hover:translate-x-[-4px] transition-transform">
           <div className="bg-background/60 px-5 py-2.5 rounded-xl border-2 border-border group-hover:border-primary/40 transition-all flex flex-col items-center">
             <span className="font-tech text-[7px] text-muted-foreground uppercase mb-1">Pass_Code</span>
             <span className="font-tech font-black text-sm text-primary tracking-[0.2em]">
               {notif.expedition.code_retrait}
             </span>
           </div>
        </div>
      )}

      {/* ACTIONS RAPIDES */}
      <div className="flex gap-2 sm:opacity-0 group-hover:opacity-100 transition-all">
        {isUnread && (
          <button onClick={onRead} className="p-3 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-xl transition-all">
            <MailOpen size={18} />
          </button>
        )}
        <button className="p-3 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-xl transition-all">
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="py-32 flex flex-col items-center justify-center text-center opacity-30">
      <BellOff size={48} className="mb-4 text-muted-foreground" />
      <h3 className="font-display text-2xl uppercase italic">Silence_Radio</h3>
      <p className="font-tech text-[9px] uppercase tracking-[0.3em] mt-2">Flux de données vide</p>
    </div>
  );
}