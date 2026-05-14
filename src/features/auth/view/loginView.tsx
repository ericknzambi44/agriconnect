// src/features/auth/views/LoginView.tsx
import React, { useState } from 'react';
import { useAuthLogin } from '../hooks/use-auth-login';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, LogIn, ArrowRight, Activity, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from 'react-router-dom';

export default function LoginView() {
  const { login, isLoading, error } = useAuthLogin();
  const [identifier, setIdentifier] = useState(''); 
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(identifier, password);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0a0a0a] via-[#050505] to-black flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      
      {/* EFFETS DE FOND IMMERSIFS (dégradés et lueurs) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-primary/15 blur-[80px] sm:blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/10 blur-[80px] rounded-full" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full" />
      </div>

      <Card className="w-full max-w-[460px] bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl shadow-primary/10 relative z-10 overflow-hidden">
        
        {/* Ligne technique supérieure avec dégradé */}
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary to-orange-400" />

        <CardHeader className="text-center pt-8 sm:pt-12 pb-4 sm:pb-6">
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-orange-400/30 rounded-2xl sm:rounded-3xl blur-xl group-hover:blur-2xl transition-all" />
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white/[0.05] to-black/40 border border-primary/40 flex items-center justify-center shadow-lg group-hover:border-primary/70 transition-all duration-500 rotate-3 group-hover:rotate-0">
                <ShieldCheck className="w-8 h-8 sm:w-10 sm:h-10 text-primary drop-shadow-[0_0_8px_rgba(var(--primary),0.8)]" />
              </div>
              <div className="absolute -bottom-1 -right-1 p-1 bg-black rounded-full border border-primary">
                <Activity className="w-2.5 h-2.5 text-primary animate-pulse" />
              </div>
            </div>
          </div>

          <CardTitle className="text-3xl sm:text-5xl font-display font-black italic uppercase tracking-tighter">
            Agri<span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">Connect</span>
          </CardTitle>
          <CardDescription className="font-tech text-[8px] sm:text-[9px] text-white uppercase tracking-[0.3em] sm:tracking-[0.4em] mt-2 sm:mt-3">
            zone de connexion
          </CardDescription>
        </CardHeader>

        <CardContent className="px-5 sm:px-12 pb-8 sm:pb-12">
          {error && (
            <div className="mb-6 p-3 sm:p-4 bg-red-500/10 border-l-2 border-red-500 text-red-400 font-tech text-[9px] sm:text-[10px] uppercase tracking-wider animate-in slide-in-from-left-4 rounded-r-lg">
              <span className="opacity-70">Erreur accès :</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* IDENTIFIANT */}
            <div className="space-y-2 sm:space-y-3">
              <Label className="font-tech text-[10px] text-white/ uppercase tracking-[0.2em] ml-2">
                Email ou téléphone
              </Label>
              <Input 
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="EX: agri@gmail.com ou +243812345678 " 
                className="h-12 sm:h-14 bg-white/[0.02] border border-white/10 rounded-xl sm:rounded-2xl text-white placeholder:text-white/20 focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all uppercase text-[10px] sm:text-[11px] tracking-wider px-4 sm:px-6"
                required
              />
            </div>

            {/* MOT DE PASSE */}
            <div className="space-y-2 sm:space-y-3">
              <div className="flex justify-between items-center px-2">
                <Label className="font-tech text-[10px] text-white uppercase tracking-[0.2em]">
                  Mot de passe
                </Label>
                <Link 
                  to="/forgot-password" 
                  className="text-[8px] sm:text-[9px] font-tech text-white/40 hover:text-primary transition-colors italic uppercase tracking-wider"
                >
                  Oublié ?
                </Link>
              </div>
              <Input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••" 
                className="h-12 sm:h-14 bg-white/[0.02] border border-white/10 rounded-xl sm:rounded-2xl text-white placeholder:text-white/20 focus:border-primary/50 transition-all px-4 sm:px-6"
                required
              />
            </div>

            <Button 
              type="submit" 
              disabled={isLoading} 
              className="w-full h-14 sm:h-16 bg-gradient-to-r from-primary to-orange-400 text-black font-display font-black italic uppercase text-[11px] sm:text-[13px] tracking-[0.2em] rounded-xl sm:rounded-2xl shadow-lg shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all duration-300"
            >
              {isLoading ? (
                <Loader2 className="animate-spin w-5 h-5" />
              ) : (
                <div className="flex items-center gap-3">
                  <span>Se connecter</span>
                  <LogIn className="w-4 h-4 group-hover:translate-x-1 transition-transform stroke-[3px]" />
                </div>
              )}
            </Button>
          </form>

          <div className="mt-8 sm:mt-10 pt-6 border-t border-white/10 text-center">
            <Link 
              to="/signup" 
              className="group font-display text-[11px] sm:text-[12px] text-primary italic uppercase tracking-tight hover:text-white transition-all flex items-center justify-center gap-2"
            >
              <span>Créer un nouveau compte</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </CardContent>
      </Card>
      
      {/* STATUT BAR - visible uniquement sur desktop */}
      <div className="hidden md:block fixed bottom-6 left-1/2 -translate-x-1/2 font-tech text-[8px] text-white/20 uppercase tracking-[0.8em] whitespace-nowrap">
        AgriConnect • Secure Gateway
      </div>
    </div>
  );
}