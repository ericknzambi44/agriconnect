// src/features/auth/views/LoginView.tsx
import React, { useState } from 'react';
import { useAuthLogin } from '../hooks/use-auth-login';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, LogIn, ArrowRight } from "lucide-react";
import { Link } from 'react-router-dom';

export default function LoginView() {
  const { login, isLoading, error } = useAuthLogin();
  const [identifier, setIdentifier] = useState(''); // Email ou Téléphone
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(identifier, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md bg-glass-agri border-none shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in zoom-in-95 duration-500">
        {/* Ligne de style néon en haut */}
        <div className="h-1.5 w-full bg-gradient-to-r from-primary via-accent to-primary shadow-[0_0_15px_var(--color-primary)]"></div>

        <CardHeader className="text-center pt-12">
          <CardTitle className="text-5xl font-black text-glow-green tracking-tighter uppercase italic">
            Agri<span className="text-accent text-glow-yellow">Connect</span>
          </CardTitle>
          <CardDescription className="text-foreground/70 font-black uppercase tracking-[0.3em] text-[10px] mt-2">
            Authentification • Système • Sécurisé
          </CardDescription>
        </CardHeader>

        <CardContent className="px-8 pb-12 pt-6">
          {error && (
            <div className="mb-6 p-4 bg-destructive/20 border-l-4 border-destructive text-white rounded-r-lg text-xs font-bold animate-shake">
              <span className="opacity-70">ACCÈS REFUSÉ:</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-primary/80">Email ou Téléphone</Label>
              <Input 
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="erick@agri.cd ou +243..." 
                className="h-14 bg-input/50 border-none font-bold placeholder:text-foreground/10 focus:ring-1 focus:ring-primary"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-xs font-black uppercase tracking-widest text-primary/80">Mot de passe</Label>
                <Link 
  to="/forgot-password" 
  className="text-[10px] font-black uppercase text-accent/50 hover:text-accent transition-colors"
>
  Oublié ?
</Link>
              </div>
              <Input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••" 
                className="h-14 bg-input/50 border-none font-bold placeholder:text-foreground/10 focus:ring-1 focus:ring-primary"
                required
              />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full btn-elite h-16 group shadow-lg shadow-primary/20">
              {isLoading ? (
                <Loader2 className="animate-spin mr-2" />
              ) : (
                <LogIn className="mr-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              )}
              <span className="drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)] text-lg">Se Connecter</span>
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <p className="text-foreground/40 text-xs font-bold uppercase tracking-widest">
              Pas encore de compte ?
            </p>
            <Link to="/signup" className="inline-flex items-center mt-2 text-primary font-black uppercase italic tracking-tighter hover:text-white transition-colors group">
              Créer un accès système
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}