// src/features/admin/pages/AdminLogin.tsx
import { useState, FormEvent } from 'react';
import { supabase } from '@/supabase';
import { toast } from 'sonner';
import { ShieldAlert, Lock, Mail, Loader2, Terminal, Cpu, Fingerprint } from 'lucide-react';
import { useAdminCore } from '../hooks/use-admin-core';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  
  const { isSyncing, admin } = useAdminCore();

  // Bloque le bouton si on est en train de s'authentifier OU si on attend la réponse du rôle
  const isPending = isAuthenticating || (isSyncing && !!admin);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
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
      
      toast.loading("ACCÈS_AUTORISÉ : Vérification des privilèges...", { id: loginToast });

    } catch (error: any) {
      setIsAuthenticating(false);
      toast.error("ERREUR_SYSTÈME_CRITIQUE", { id: loginToast });
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* BACKGROUND TECHNIQUE */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ 
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '32px 32px' 
        }} 
      />
      
      {/* GLOW DE STRUCTURE */}
      <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-[420px] relative z-10 animate-in fade-in zoom-in duration-1000">
        
        {/* LOGO & BRANDING */}
        <div className="text-center mb-12">
          <div className="relative inline-flex items-center justify-center mb-6">
             <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
             <div className="relative w-20 h-20 bg-[#0A0A0A] border-2 border-white/10 rounded-[2rem] flex items-center justify-center shadow-2xl">
                <Cpu className="text-primary" size={40} strokeWidth={1.5} />
             </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black italic uppercase text-white tracking-tighter leading-none">
            Agri<span className="text-primary">Admin</span>
          </h1>
          
          <div className="mt-4 inline-flex items-center gap-3 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em]">
                Secure Infrastructure Portal
            </span>
          </div>
        </div>

        {/* CONSOLE D'AUTHENTIFICATION */}
        <div className="bg-[#0A0A0A] border border-white/10 p-8 md:p-10 rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)]">
          <form onSubmit={handleLogin} className="space-y-7">
            
            {/* EMAIL / IDENTIFIANT */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">
                Identifiant_Session
              </label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors">
                    <Mail size={18} />
                </div>
                <input
                  type="email"
                  placeholder="NOM@AGRICONNECT.IO"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-16 bg-white/[0.03] border-2 border-white/5 rounded-2xl pl-14 pr-6 text-white text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-primary/40 focus:bg-white/[0.05] transition-all placeholder:text-white/5"
                  required
                />
              </div>
            </div>

            {/* PASSWORD / PASSCODE */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">
                Clé_Accès_Chiffrée
              </label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors">
                    <Lock size={18} />
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-16 bg-white/[0.03] border-2 border-white/5 rounded-2xl pl-14 pr-6 text-white focus:outline-none focus:border-primary/40 focus:bg-white/[0.05] transition-all placeholder:text-white/5 tracking-[0.5em]"
                  required
                />
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full h-16 bg-white hover:bg-primary text-black font-black uppercase italic rounded-2xl transition-all flex items-center justify-center gap-4 mt-4 active:scale-95 disabled:opacity-40 shadow-xl shadow-white/5 group"
            >
              {isPending ? (
                <>
                  <Loader2 className="animate-spin" size={20} strokeWidth={3} />
                  <span className="text-[11px] tracking-widest">Protocol_Syncing...</span>
                </>
              ) : (
                <>
                  <Fingerprint size={20} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
                  <span className="text-[11px] tracking-[0.2em]">Initialiser_Root</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* FOOTER INFO TECHNIQUE */}
        <div className="mt-12 space-y-6">
          <div className="flex items-center justify-center gap-8">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isSyncing ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
              <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">Network: {isSyncing ? 'Syncing' : 'Online'}</span>
            </div>
            <div className="flex items-center gap-2">
                <Terminal size={12} className="text-white/10" />
                <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">v1.0.0_Secure</span>
            </div>
          </div>
          
          <p className="text-center text-[7px] text-white/10 font-black uppercase tracking-[0.6em]">
            © 2026  • Cyber-Infrastructure
          </p>
        </div>
      </div>
    </div>
  );
}