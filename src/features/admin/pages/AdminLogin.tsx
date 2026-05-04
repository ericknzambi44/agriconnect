// src/features/admin/pages/AdminLogin.tsx
import { useState, FormEvent } from 'react';
import { supabase } from '@/supabase';
import { toast } from 'sonner';
import { ShieldAlert, Lock, Mail, Loader2, Terminal, Cpu } from 'lucide-react';
import { useAdminCore } from '../hooks/use-admin-core';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  
  const { isSyncing, admin } = useAdminCore();

  // Bloque le bouton si on est en train de s'authentifier OU si on attend la réponse du rôle
  const isPending = isAuthenticating || (isSyncing && !!admin);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Empêche strictement le rechargement de la page
    
    if (!email || !password) {
      toast.error("PARAMÈTRES_MANQUANTS : Veuillez remplir tous les champs");
      return;
    }

    setIsAuthenticating(true);
    const loginToast = toast.loading("Initialisation du protocole AgriConnect...");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setIsAuthenticating(false);
        toast.error(error.message || "ÉCHEC_AUTHENTIFICATION", { id: loginToast });
        return;
      }
      
      // Succès Auth : Le hook useAdminCore détectera le changement d'état 
      // et procèdera à la vérification des privilèges ROOT
      toast.loading("ACCÈS_AUTORISÉ : Vérification des privilèges...", { id: loginToast });

    } catch (error: any) {
      setIsAuthenticating(false);
      toast.error("ERREUR_SYSTÈME_CRITIQUE", { id: loginToast });
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Grid d'arrière-plan Matrix/Terminal */}
      <div 
        className="absolute inset-0 opacity-[0.05] pointer-events-none" 
        style={{ 
          backgroundImage: `linear-gradient(to right, #1a1a1a 1px, transparent 1px), linear-gradient(to bottom, #1a1a1a 1px, transparent 1px)`,
          backgroundSize: '40px 40px' 
        }} 
      />
      
      {/* Effet Glow au centre */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative animate-in fade-in zoom-in duration-700">
        
        {/* Header : Branding AgriConnect Admin */}
        <div className="text-center mb-10">
          <div className="relative inline-block">
             <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
             <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-[#0A0A0A] border border-white/10 mb-4">
                <Cpu className="text-primary" size={32} strokeWidth={1.5} />
             </div>
          </div>
          <h1 className="text-3xl font-black uppercase italic text-white tracking-tighter">
            Agri<span className="text-primary underline decoration-2 underline-offset-4">Admin</span>
          </h1>
          <div className="flex items-center justify-center gap-3 mt-3">
            <span className="h-[1px] w-6 bg-primary/30"></span>
            <p className="text-[9px] font-mono text-white/40 uppercase tracking-[0.4em] font-bold">
                Infrastructure_Security_Portal
            </p>
            <span className="h-[1px] w-6 bg-primary/30"></span>
          </div>
        </div>

        {/* Console Box */}
        <div className="bg-[#0A0A0A]/80 border border-white/5 p-8 md:p-10 rounded-[2.5rem] backdrop-blur-xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-white/30 uppercase ml-1 tracking-widest">
                Admin_Identifier
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors">
                    <Mail size={16} />
                </div>
                <input
                  type="email"
                  placeholder="NOM@AGRICONNECT.IO"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/[0.02] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/5 focus:outline-none focus:border-primary/50 focus:bg-white/[0.04] transition-all font-mono text-[11px] uppercase tracking-wider"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black text-white/30 uppercase ml-1 tracking-widest">
                Access_Passcode
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors">
                    <Lock size={16} />
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/[0.02] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/5 focus:outline-none focus:border-primary/50 focus:bg-white/[0.04] transition-all font-mono text-[11px]"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="group relative w-full overflow-hidden bg-white hover:bg-primary text-black font-black uppercase italic py-4.5 rounded-2xl transition-all flex items-center justify-center gap-3 mt-4 active:scale-[0.98] disabled:opacity-40 disabled:cursor-wait shadow-2xl shadow-white/5"
            >
              {isPending ? (
                <>
                  <Loader2 className="animate-spin text-black" size={18} />
                  <span className="text-[10px] tracking-[0.2em]">Executing_Sequence...</span>
                </>
              ) : (
                <>
                  <ShieldAlert size={18} className="group-hover:animate-pulse" />
                  <span className="text-[10px] tracking-[0.2em]">Initialiser_Session_Root</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Interface Footer Info */}
        <div className="mt-10 flex flex-col items-center gap-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${isSyncing ? 'bg-yellow-500 animate-pulse' : 'bg-primary'}`} />
              <span className="text-[8px] font-mono text-white/30 uppercase tracking-[0.2em]">Node_Status: {isSyncing ? 'Sync' : 'Ready'}</span>
            </div>
            <div className="h-3 w-[1px] bg-white/10" />
            <div className="flex items-center gap-2 text-white/30">
                <Terminal size={10} />
               
            </div>
          </div>
          <p className="text-[7px] text-white/10 font-mono uppercase tracking-[0.4em]">
            © 2026  Engineering Infrastructure
          </p>
        </div>
      </div>
    </div>
  );
}