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
  TrendingUp,
  Sparkles
} from 'lucide-react';

export const WalletView = () => {
  const { wallet, transactions, isLoading } = useWallet();

  if (isLoading) return (
    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#050505] to-black">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-primary animate-pulse" />
        </div>
        <p className="font-display font-black italic uppercase text-xs tracking-widest text-primary/60">Chargement du coffre...</p>
      </div>
    </div>
  );

  return (
    <div className="h-screen max-h-screen flex flex-col bg-gradient-to-br from-[#0a0a0a] via-[#050505] to-black overflow-hidden">
      
      {/* HEADER STATIQUE AVEC DÉGRADÉ */}
      <div className="flex-shrink-0 p-4 md:p-8 space-y-6 bg-black/40 backdrop-blur-md border-b border-white/10 z-20">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h1 className="text-2xl md:text-4xl font-black italic uppercase tracking-tighter bg-gradient-to-r from-white via-primary to-white bg-clip-text text-transparent">
                Mon Portefeuille
              </h1>
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em] mt-1">
                Finance sécurisée
              </p>
            </div>
            <div className="hidden md:flex gap-2">
              <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-2 backdrop-blur-sm">
                <TrendingUp size={16} className="text-emerald-400" />
                <span className="text-[10px] font-black uppercase text-white/70">Activité positive</span>
              </div>
            </div>
          </div>

          {/* GRILLE DES CARTES */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* CARTE PRINCIPALE (SOLDE DISPONIBLE) */}
            <div className="md:col-span-2 relative overflow-hidden bg-gradient-to-br from-primary/90 via-primary to-orange-500 rounded-[2.5rem] p-6 md:p-8 shadow-2xl shadow-primary/40 border border-white/20">
              {/* Effet de fond lumineux */}
              <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/20 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-black/10 rounded-full blur-2xl" />
              
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <span className="font-display font-black italic uppercase tracking-wider text-white/70 text-[10px] md:text-xs">
                      Solde disponible
                    </span>
                    <div className="mt-1 flex items-baseline gap-2">
                      <h2 className="text-4xl md:text-7xl font-black italic tracking-tighter text-white drop-shadow-lg">
                        {wallet?.solde_disponible?.toLocaleString() || '0.00'}
                      </h2>
                      <span className="text-lg font-bold text-white/80">{wallet?.devise || 'USD'}</span>
                    </div>
                  </div>
                  <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20">
                    <Wallet size={24} className="text-white drop-shadow-md" />
                  </div>
                </div>
                
                <div className="mt-8 flex gap-3">
                  <button className="flex-1 bg-white text-primary h-12 rounded-2xl text-[11px] font-black uppercase italic hover:scale-[1.02] transition-transform active:scale-95 shadow-lg hover:shadow-xl">
                    Retrait rapide
                  </button>
                  <button className="p-3 bg-white/20 hover:bg-white/30 rounded-2xl transition-all backdrop-blur-md border border-white/20">
                    <ArrowRightLeft size={20} className="text-white" />
                  </button>
                </div>
              </div>
            </div>

            {/* CARTE SOLDE BLOQUÉ (SÉQUESTRE) */}
            <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-[2.5rem] p-6 md:p-8 flex flex-col justify-center relative overflow-hidden group hover:border-primary/50 transition-all">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition" />
              <div className="flex items-center gap-2 text-white/50 mb-3">
                <ShieldCheck size={18} className="group-hover:text-primary transition-colors drop-shadow-md" />
                <span className="text-[10px] font-black uppercase tracking-widest">Sous séquestre</span>
              </div>
              <div className="text-3xl md:text-4xl font-black italic text-white tracking-tighter drop-shadow-md">
                {wallet?.solde_bloque?.toLocaleString() || '0.00'} 
                <span className="text-xs ml-1 opacity-50 not-italic">{wallet?.devise}</span>
              </div>
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-[9px] text-white/40 font-medium leading-relaxed uppercase italic">
                  Déblocage automatique après validation du code de retrait.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION TRANSACTIONS (SCROLLABLE) */}
      <div className="flex-1 min-h-0 max-w-7xl mx-auto w-full px-4 md:px-8 pb-4">
        <div className="h-full flex flex-col bg-black/30 backdrop-blur-sm border border-white/10 rounded-[2.5rem] shadow-xl overflow-hidden">
          
          {/* Header fixe dans le conteneur */}
          <div className="flex-shrink-0 p-5 border-b border-white/10 flex justify-between items-center bg-black/40 backdrop-blur-sm">
            <h2 className="font-display font-black italic text-lg uppercase tracking-tight text-white">
              Activités récentes
            </h2>
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-primary rounded-full animate-ping shadow-[0_0_6px_rgba(var(--primary),0.8)]" />
            </div>
          </div>

          {/* Liste défilante */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2 md:p-4">
            <div className="space-y-2">
              {transactions.length > 0 ? (
                transactions.map((t) => (
                  <div 
                    key={t.id} 
                    className="group p-4 rounded-xl hover:bg-white/[0.02] transition-all border border-transparent hover:border-white/10 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                        t.type === 'VENTE' 
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                          : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                      }`}>
                        {t.type === 'VENTE' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                      </div>
                      <div>
                        <p className="font-black italic text-xs md:text-sm uppercase tracking-tight leading-none mb-1 text-white">
                          {t.type === 'VENTE' ? 'Vente' : 'Achat'}
                        </p>
                        <div className="flex items-center gap-2 text-[10px] text-white/40 font-bold uppercase">
                          <Clock size={10} />
                          {new Date(t.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className={`font-black italic text-sm md:text-base ${
                        t.type === 'VENTE' ? 'text-emerald-400' : 'text-white'
                      }`}>
                        {t.type === 'VENTE' ? '+' : '-'}{t.montant}
                      </p>
                      <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-[8px] font-black uppercase mt-1 ${
                        t.statut === 'COMPLETE' 
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                          : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                      }`}>
                        {t.statut === 'COMPLETE' ? 'Complété' : 'En cours'}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-20 text-center flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center">
                    <CreditCard size={32} className="text-white/20" />
                  </div>
                  <p className="text-[10px] font-black uppercase italic text-white/30 tracking-widest">
                    Aucune transaction détectée
                  </p>
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
          background: rgba(var(--primary), 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(var(--primary), 0.5);
        }
      `}</style>
    </div>
  );
};