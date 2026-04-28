// src/features/wallet/components/WalletView.tsx
import React from 'react';
import { useWallet } from '../hooks/use-wallet';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  ShieldCheck, 
  CreditCard,
  ArrowRightLeft,
  TrendingUp
} from 'lucide-react';

export const WalletView = () => {
  const { wallet, transactions, isLoading } = useWallet();

  if (isLoading) return (
    <div className="h-full w-full flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        <p className="font-display font-black italic uppercase text-xs tracking-widest text-muted-foreground">Pyshopy Wallet...</p>
      </div>
    </div>
  );

  return (
    <div className="h-screen max-h-screen flex flex-col bg-background overflow-hidden">
      
      {/* --- HEADER STATIQUE (NE SCROLLE PAS) --- */}
      <div className="flex-shrink-0 p-4 md:p-8 space-y-6 bg-background/80 backdrop-blur-md z-20">
        <div className="max-w-6xl mx-auto w-full">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter text-foreground">Mon Portefeuille</h1>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Finance & Séquestre</p>
            </div>
            <div className="hidden md:flex gap-2">
               <div className="bg-muted px-4 py-2 rounded-2xl flex items-center gap-2">
                  <TrendingUp size={16} className="text-green-500" />
                  <span className="text-[10px] font-black uppercase">Activité Positive</span>
               </div>
            </div>
          </div>

          {/* GRILLE DES CARTES */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* CARTE PRINCIPALE */}
            <div className="md:col-span-2 relative overflow-hidden bg-primary text-primary-foreground rounded-[2.5rem] p-6 md:p-8 shadow-2xl shadow-primary/30 border border-white/10">
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <span className="font-display font-black italic uppercase tracking-wider text-primary-foreground/60 text-[10px] md:text-xs">Solde Disponible</span>
                    <div className="mt-1 flex items-baseline gap-2">
                      <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter">
                        {wallet?.solde_disponible?.toLocaleString() || '0.00'}
                      </h2>
                      <span className="text-lg font-bold opacity-80">{wallet?.devise || 'USD'}</span>
                    </div>
                  </div>
                  <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                    <Wallet size={24} className="text-white" />
                  </div>
                </div>
                
                <div className="mt-8 flex gap-3">
                  <button className="flex-1 bg-white text-primary h-12 rounded-2xl text-[11px] font-black uppercase italic hover:scale-[1.02] transition-transform active:scale-95 shadow-lg">
                    Retrait Rapide
                  </button>
                  <button className="p-3 bg-white/20 hover:bg-white/30 rounded-2xl transition-colors backdrop-blur-md">
                    <ArrowRightLeft size={20} />
                  </button>
                </div>
              </div>
              {/* Design Elements */}
              <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute top-1/2 right-0 w-32 h-32 bg-black/10 rounded-full blur-2xl"></div>
            </div>

            {/* CARTE SOLDE BLOQUÉ */}
            <div className="bg-card border-2 border-dashed border-muted-foreground/20 rounded-[2.5rem] p-6 md:p-8 flex flex-col justify-center relative overflow-hidden group">
              <div className="flex items-center gap-2 text-muted-foreground mb-3">
                <ShieldCheck size={18} className="group-hover:text-primary transition-colors" />
                <span className="text-[10px] font-black uppercase tracking-widest">En Séquestre</span>
              </div>
              <div className="text-3xl font-black italic text-foreground tracking-tighter">
                {wallet?.solde_bloque?.toLocaleString() || '0.00'} 
                <span className="text-xs ml-1 opacity-50 not-italic">{wallet?.devise}</span>
              </div>
              <div className="mt-4 pt-4 border-t border-muted-foreground/10">
                <p className="text-[9px] text-muted-foreground font-medium leading-relaxed uppercase italic">
                  Déblocage automatique après validation du code dépôt par l'agence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- SECTION TRANSACTIONS (SCROLLABLE) --- */}
      <div className="flex-1 min-h-0 max-w-6xl mx-auto w-full px-4 md:px-8 pb-4">
        <div className="h-full flex flex-col bg-card/50 border border-muted/50 rounded-[2.5rem] shadow-sm overflow-hidden">
          
          {/* Header de la liste (Fixe dans son conteneur) */}
          <div className="flex-shrink-0 p-6 border-b border-muted/50 flex justify-between items-center bg-card/80 backdrop-blur-sm">
            <h2 className="font-display font-black italic text-lg uppercase tracking-tight">Activités Récentes</h2>
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-primary rounded-full animate-ping" />
            </div>
          </div>

          {/* Liste défilante */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2 md:p-4">
            <div className="space-y-2">
              {transactions.length > 0 ? (
                transactions.map((t) => (
                  <div 
                    key={t.id} 
                    className="group p-4 rounded-[1.5rem] hover:bg-background transition-all border border-transparent hover:border-muted flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner transition-transform group-hover:scale-110 ${
                        t.type === 'VENTE' ? 'bg-green-500/10 text-green-600' : 'bg-orange-500/10 text-orange-600'
                      }`}>
                        {t.type === 'VENTE' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                      </div>
                      <div>
                        <p className="font-black italic text-xs md:text-sm uppercase tracking-tight leading-none mb-1">
                          {t.type}
                        </p>
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-bold uppercase">
                          <Clock size={10} />
                          {new Date(t.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className={`font-black italic text-sm md:text-base ${
                        t.type === 'VENTE' ? 'text-green-600' : 'text-foreground'
                      }`}>
                        {t.type === 'VENTE' ? '+' : '-'}{t.montant}
                      </p>
                      <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-[8px] font-black uppercase mt-1 ${
                        t.statut === 'COMPLETE' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                      }`}>
                        {t.statut}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-20 text-center flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-muted rounded-3xl flex items-center justify-center opacity-20">
                    <CreditCard size={32} />
                  </div>
                  <p className="text-[10px] font-black uppercase italic text-muted-foreground tracking-widest">Aucun mouvement détecté</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(var(--primary), 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(var(--primary), 0.2);
        }
      `}</style>
    </div>
  );
};