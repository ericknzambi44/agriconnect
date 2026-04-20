// src/features/auth/views/LoginView.tsx

//  interface pour se connecter 

import React, { useState } from 'react';
import { useAuthLogin } from '../hooks/use-auth-login';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, LogIn, ArrowRight, Activity, Lock } from "lucide-react";
import { Link } from 'react-router-dom';

export default function LoginView() {
  const { login, isLoading, error } = useAuthLogin();
  const [identifier, setIdentifier] = useState(''); 
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.ChangeEvent) => {
    e.preventDefault();
    await login(identifier, password);
  };

  return (
    <div className="min-h-screen w-full bg-[#050505] grid place-items-center p-4 selection:bg-[#bef264] selection:text-black relative overflow-hidden">
      
      {/* EFFETS DE FOND IMMERSIFS */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 blur-[140px] rounded-full animate-pulse" />
      </div>

      {/* CARTE CARRÉE & CENTRÉE */}
      <Card className="w-full max-w-[480px] bg-white/[0.02] border border-white/5 rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden animate-in fade-in zoom-in-95 duration-700 relative z-10">
        
        {/* INDICATEUR DE CHARGE SUPÉRIEUR */}
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"></div>

        <CardHeader className="text-center pt-14 pb-6">
          {/* ICON MODERNE STYLE PROFILE */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-20 h-20 rounded-[2rem] bg-white/[0.02] border-2 border-emerald-500/30 flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.1)] transition-transform hover:scale-105 duration-500">
                <Lock className="w-8 h-8 text-emerald-500 stroke-[1.5px]" />
              </div>
              {/* Badge d'activité comme sur le profil */}
              <div className="absolute -bottom-1 -right-1 p-1 bg-[#050505] rounded-full border-2 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]">
                 <Activity className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
              </div>
            </div>
          </div>

          <CardTitle className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter leading-none text-white">
            AGRI<span className="text-[#bef264]">CONNECT</span>
          </CardTitle>
          <CardDescription className="text-white/20 font-black uppercase tracking-[0.5em] text-[9px] mt-4 italic">
           System d'authentification
          </CardDescription>
        </CardHeader>

        <CardContent className="px-10 md:px-14 pb-14">
          {/* ALERTES ERREUR STYLE PROFILEVIEW */}
          {error && (
            <div className="mb-8 p-4 bg-red-500/5 border-l-4 border-red-500 text-red-500 rounded-r-xl text-[10px] font-black uppercase tracking-widest animate-in slide-in-from-top-2">
              <span className="opacity-50">Erreur_Accès :</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-7">
            {/* IDENTIFIANT */}
           
            <div className="space-y-2.5">
              <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500/50 ml-1">Identifiant </Label>
              <Input 
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="EMAIL OU TÉLÉPHONE" 
                className="h-14 bg-[#050505] border-white/5 rounded-2xl font-bold text-white placeholder:text-white/5 focus:border-emerald-500/50 focus:ring-0 transition-all uppercase text-[11px] tracking-widest px-6"
                required
              />
            </div>

            {/* MOT DE PASSE */}
            <div className="space-y-2.5">
              <div className="flex justify-between items-center ml-1">
                <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500/50">Clé_Privée</Label>
                <Link 
                  to="/forgot-password" 
                  className="text-[9px] font-black uppercase text-white/20 hover:text-[#bef264] transition-colors italic tracking-wider"
                >
                  Perdu ?
                </Link>
              </div>
              <Input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••" 
                className="h-14 bg-[#050505] border-white/5 rounded-2xl font-bold text-white placeholder:text-white/5 focus:border-emerald-500/50 focus:ring-0 transition-all text-xs px-6"
                required
              />
            </div>

            {/* BOUTON  de connection*/}
            <Button 
              type="submit" 
              disabled={isLoading} 
              className={`w-full h-16 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] italic transition-all relative overflow-hidden group
                ${isLoading 
                  ? 'bg-white/10 text-white/20' 
                  : 'bg-emerald-500 text-black shadow-[0_20px_40px_rgba(16,185,129,0.15)] hover:shadow-[0_20px_50px_rgba(16,185,129,0.3)] hover:scale-[1.02]'}`}
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                {isLoading ? (
                  <Loader2 className="animate-spin w-5 h-5" />
                ) : (
                  <>
                   Connexion
                    <LogIn className="w-4 h-4 group-hover:translate-x-1 transition-transform stroke-[3px]" />
                  </>
                )}
              </span>
            </Button>
          </form>

          {/* ACCÈS EXTERNE */}
          <div className="mt-12 pt-8 border-t border-white/5 text-center">
            <Link to="/signup" className="inline-flex items-center gap-2 text-[#bef264] font-black uppercase italic tracking-tighter hover:text-white transition-all group text-[11px]">
              Créez-compt
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </CardContent>
      </Card>
      
      {/* STATUS BAR FIXE */}
      <div className="fixed bottom-6 text-[8px] font-black text-white/5 uppercase tracking-[0.8em] italic">
        AgriConnect secure
      </div>
    </div>
  );
}