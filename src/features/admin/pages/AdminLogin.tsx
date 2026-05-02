// src/features/admin/pages/AdminLogin.tsx
import { useState, FormEvent } from 'react'; // Utilisation de FormEvent direct
import { supabase } from '@/supabase';
import { toast } from 'sonner';
import { ShieldAlert, Lock, Mail, Loader2, Terminal } from 'lucide-react';
import { useAdminCore } from '../hooks/use-admin-core';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  
  const { isSyncing, admin } = useAdminCore();

  // Correction : handleLogin ne doit pas dépendre de variables externes instables
  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    setIsAuthenticating(true);
    const loginToast = toast.loading("Initialisation du protocole Pyshopy...");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setIsAuthenticating(false);
        toast.error(error.message || "Échec de l'authentification", { id: loginToast });
        return;
      }
      
      // On laisse le loader car useAdminCore va prendre le relais pour vérifier le rôle
      toast.loading("Vérification des privilèges ROOT...", { id: loginToast });

    } catch (error: any) {
      setIsAuthenticating(false);
      toast.error("Erreur système critique", { id: loginToast });
    }
  };

  // UI State : On ne bloque le bouton que si on AUTHENTIFIE ou si on SYNCHRONISE un admin déjà présent
  // Mais on ne bloque PAS au premier chargement si aucun admin n'est détecté
  const isPending = isAuthenticating || (isSyncing && !!admin);

  return (
    <div className="min-h-screen bg-[#020202] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Grille de fond style Terminal */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
      
      <div className="w-full max-w-md relative animate-in fade-in zoom-in duration-500">
        
        {/* Header : Pyshopy Admin */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 mb-4 shadow-[0_0_20px_rgba(var(--primary),0.1)]">
            <Terminal className="text-primary" size={28} />
          </div>
          <h1 className="text-2xl font-black uppercase italic text-white tracking-widest">
            Pyshopy<span className="text-primary">Admin</span>
          </h1>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="h-[1px] w-8 bg-white/10"></span>
            <p className="text-[9px] font-mono text-white/30 uppercase tracking-[0.3em]">
              Auth_Gateway_v2.1
            </p>
            <span className="h-[1px] w-8 bg-white/10"></span>
          </div>
        </div>

        {/* Cadre du Formulaire */}
        <div className="bg-white/[0.02] border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-md shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase ml-1 tracking-widest">Identifiant_Node</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary/50 transition-colors" size={16} />
                <input
                  type="email"
                  placeholder="admin@pyshopy.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-11 pr-4 text-white placeholder:text-white/5 focus:outline-none focus:border-primary/40 transition-all font-mono text-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase ml-1 tracking-widest">Clé_Accès</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary/50 transition-colors" size={16} />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-11 pr-4 text-white placeholder:text-white/5 focus:outline-none focus:border-primary/40 transition-all font-mono text-sm"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-white hover:bg-primary text-black font-black uppercase italic py-4 rounded-xl transition-all flex items-center justify-center gap-3 mt-4 shadow-xl active:scale-[0.98] disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span className="text-[11px] tracking-widest">Verification_Séquence...</span>
                </>
              ) : (
                <>
                  <ShieldAlert size={18} />
                  <span className="text-[11px] tracking-widest">Ouvrir_Session_Root</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Status Bar */}
        <div className="mt-8 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${isSyncing ? 'bg-yellow-500 animate-pulse' : 'bg-emerald-500'}`} />
            <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">System_Status: Secure</span>
          </div>
      
        </div>
      </div>
    </div>
  );
}