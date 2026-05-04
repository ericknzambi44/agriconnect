// src/features/auth/views/LoginView.tsx
import React, { useState } from 'react';
import { useAuthLogin } from '../hooks/use-auth-login';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, LogIn, ArrowRight, Activity, ShieldCheck } from "lucide-react";
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
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      
      {/* EFFETS DE FOND IMMERSIFS */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-primary/10 blur-[80px] sm:blur-[120px] rounded-full animate-pulse" />
      </div>

      <Card className="w-full max-w-[460px] bg-glass border-2 border-border/50 rounded-[2rem] sm:rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] relative z-10 overflow-hidden max-sm:border-x-0 max-sm:rounded-3xl">
        
        {/* Ligne technique supérieure */}
        <div className="h-1.5 w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

        <CardHeader className="text-center pt-8 sm:pt-12 pb-4 sm:pb-6">
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="relative group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-secondary border-2 border-primary/30 flex items-center justify-center shadow-lg group-hover:border-primary transition-all duration-500 rotate-3 group-hover:rotate-0">
                <ShieldCheck className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
              </div>
              <div className="absolute -bottom-1 -right-1 p-1 bg-background rounded-full border-2 border-primary">
                 <Activity className="w-2.5 h-2.5 text-primary animate-pulse" />
              </div>
            </div>
          </div>

          <CardTitle className="text-3xl sm:text-5xl font-display text-glow-primary tracking-tighter break-words">
            AGRI<span className="text-accent">CONNECT</span>
          </CardTitle>
          <CardDescription className="font-tech text-[8px] sm:text-[9px] text-muted-foreground/40 uppercase tracking-[0.3em] sm:tracking-[0.4em] mt-2 sm:mt-3">
            Authentication_Protocol_v1.0.0
          </CardDescription>
        </CardHeader>

        <CardContent className="px-5 sm:px-12 pb-8 sm:pb-12">
          {error && (
            <div className="mb-6 p-3 sm:p-4 bg-destructive/10 border-l-2 border-destructive text-destructive font-tech text-[9px] sm:text-[10px] uppercase tracking-wider animate-in slide-in-from-left-4">
              <span className="opacity-50">Erreur_Accès :</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* IDENTIFIANT */}
            <div className="space-y-2 sm:space-y-3">
              <Label className="font-tech text-[12px] sm:text-[10px] text-white uppercase tracking-[0.2em] ml-2">Email or phone</Label>
              <Input 
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="EMAIL OU TÉLÉPHONE" 
                className="h-12 sm:h-14 bg-secondary/50 border-border/50 rounded-xl sm:rounded-2xl font-sans font-bold text-white placeholder:text-white/20 focus:border-primary/50 transition-all uppercase text-[10px] sm:text-[11px] tracking-widest px-4 sm:px-6"
                required
              />
            </div>

            {/* MOT DE PASSE */}
            <div className="space-y-2 sm:space-y-3">
              <div className="flex justify-between items-center px-2">
                <Label className="font-tech text-[12px] sm:text-[10px] text-white uppercase tracking-[0.2em]">Mot de pass</Label>
                <Link 
                  to="/forgot-password" 
                  className="text-[8px] sm:text-[9px] font-tech text-muted-foreground hover:text-accent transition-colors italic uppercase tracking-wider"
                >
                  Oubli ?
                </Link>
              </div>
              <Input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••" 
                className="h-12 sm:h-14 bg-secondary/50 border-border/50 rounded-xl sm:rounded-2xl text-white placeholder:text-white/20 focus:border-primary/50 transition-all px-4 sm:px-6"
                required
              />
            </div>

            <Button 
              type="submit" 
              disabled={isLoading} 
              className="btn-elite w-full h-14 sm:h-16 shadow-primary/20 text-[11px] sm:text-[13px]"
            >
              {isLoading ? (
                <Loader2 className="animate-spin w-5 h-5" />
              ) : (
                <div className="flex items-center gap-2">
                  Connecter
                  <LogIn className="w-4 h-4 group-hover:translate-x-1 transition-transform stroke-[3px]" />
                </div>
              )}
            </Button>
          </form>

          <div className="mt-8 sm:mt-10 pt-6 border-t border-border/30 text-center">
            <Link 
              to="/signup" 
              className="group font-display text-[11px] sm:text-[12px] text-accent italic uppercase tracking-tight hover:text-white transition-all flex items-center justify-center gap-2"
            >
              Créer un nouveau compte
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </CardContent>
      </Card>
      
      {/* STATUS BAR - Masqué sur très petits mobiles pour éviter le chevauchement */}
      <div className="hidden sm:block fixed bottom-8 font-tech text-[8px] text-muted-foreground/20 uppercase tracking-[1em]">
        AgriConnect // Secure_Gateway
      </div>
    </div>
  );
}