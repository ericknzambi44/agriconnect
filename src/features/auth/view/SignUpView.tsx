// src/features/auth/views/SignUpView.tsx
import React, { useState } from 'react';
import { useAuthSignUp } from '@/features/auth/hooks/use-auth-signup';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, CheckCircle2, ArrowRight, ArrowLeft, Phone, Mail, ShieldCheck, MapPin, Activity, Sparkles } from "lucide-react";
import { useNavigate, Link } from 'react-router-dom';

export default function SignUpView() {
  const { signUp, isLoading, error: serverError, roles } = useAuthSignUp();
  const [step, setStep] = useState("identity");
  const [isSuccess, setIsSuccess] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '', 
    numero_tel: '', 
    mot_de_pass: '', 
    confirm_password: '', 
    nom: '', post_nom: '', prenom: '',
    sexe: '', role_id: '', avatar_url: '',
    pays: 'RDC', province: '', ville: '', commune: '', quartier: '', avenue: '', numero: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setLocalError(null);
  };

  const validateIdentityStep = () => {
    if (formData.mot_de_pass !== formData.confirm_password) {
      setLocalError("Les mots de passe ne correspondent pas.");
      return false;
    }
    if (!formData.email && !formData.numero_tel) {
      setLocalError("Email ou téléphone requis.");
      return false;
    }
    setLocalError(null);
    return true;
  };

  const handleNext = () => {
    if (validateIdentityStep()) {
      setStep("address");
    }
  };

  const handleSubmit = async () => {
    if (!validateIdentityStep()) {
      setStep("identity");
      return;
    }
    const result = await signUp(formData);
    if (result?.success) {
      setIsSuccess(true);
    }
  };

  const displayError = localError || serverError;

  if (isSuccess) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-[#0a0a0a] via-[#050505] to-black flex items-center justify-center p-4 sm:p-6">
        <Card className="w-full max-w-[480px] bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2rem] sm:rounded-[3rem] shadow-2xl shadow-primary/20 animate-in zoom-in-95 duration-500">
          <CardContent className="pt-10 sm:pt-16 pb-10 sm:pb-16 text-center space-y-6 sm:space-y-8 px-6 sm:px-10">
            <div className="flex justify-center">
              <div className="rounded-[1.5rem] sm:rounded-[2.5rem] bg-primary/20 p-5 sm:p-8 border border-primary/50 shadow-[0_0_30px_rgba(var(--primary),0.4)] animate-bounce">
                <CheckCircle2 className="w-10 h-10 sm:w-16 sm:h-16 text-primary drop-shadow-md" strokeWidth={2.5} />
              </div>
            </div>
            <div>
              <h2 className="text-2xl sm:text-4xl font-display font-black italic uppercase tracking-tighter text-white">
                Inscription réussie
              </h2>
              <p className="font-tech text-[8px] sm:text-[10px] text-white/60 uppercase tracking-[0.2em] sm:tracking-[0.3em] mt-2 sm:mt-4 leading-relaxed">
                Votre profil a été créé dans le réseau <span className="text-primary font-black">AgriConnect</span>.
              </p>
            </div>
            <Button 
              onClick={() => navigate('/login')} 
              className="w-full h-14 sm:h-16 bg-gradient-to-r from-primary to-orange-400 text-black font-display font-black italic uppercase text-[11px] tracking-[0.2em] rounded-xl shadow-lg shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all"
            >
              Accéder au terminal
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (roles.length === 0 && isLoading) return <SignUpSkeleton />;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0a0a0a] via-[#050505] to-black flex items-center justify-center p-0 sm:p-6 md:p-12 relative overflow-hidden">
      
      {/* Lueurs d'arrière‑plan */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-primary/15 blur-[80px] sm:blur-[140px] rounded-full animate-pulse" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/10 blur-[80px] rounded-full" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full" />
      </div>

      <Card className="w-full max-w-[650px] bg-black/40 backdrop-blur-xl border border-white/10 rounded-none sm:rounded-[2.5rem] shadow-2xl shadow-primary/10 relative z-10 overflow-hidden min-h-screen sm:min-h-fit">
        
        {/* Barre de progression */}
        <div className="h-1 w-full bg-white/10">
          <div 
            className="h-full bg-gradient-to-r from-primary to-orange-400 shadow-[0_0_8px_rgba(var(--primary),0.8)] transition-all duration-700 ease-out"
            style={{ width: step === "identity" ? "50%" : "100%" }}
          />
        </div>
        
        <CardHeader className="text-center pt-6 sm:pt-10 pb-2 sm:pb-4">
          <div className="flex justify-center mb-3 sm:mb-4 scale-75 sm:scale-100">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 rounded-2xl blur-xl" />
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/[0.02] border border-primary/40 flex items-center justify-center shadow-md">
                <ShieldCheck className="w-6 h-6 sm:w-8 sm:h-8 text-primary drop-shadow-[0_0_6px_rgba(var(--primary),0.6)]" />
              </div>
            </div>
          </div>
          <CardTitle className="text-3xl sm:text-5xl font-display font-black italic uppercase tracking-tighter text-white">
            Agri<span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">Connect</span>
          </CardTitle>
          <CardDescription className="font-tech text-[7px] sm:text-[9px] text-white uppercase tracking-[0.3em] sm:tracking-[0.4em] mt-2">
            zone d'enregistrement
          </CardDescription>
        </CardHeader>

        <CardContent className="px-4 sm:px-12 pb-10 sm:pb-12">
          {displayError && (
            <div className="mb-6 p-3 sm:p-4 bg-red-500/10 border-l-2 border-red-500 text-red-400 font-tech text-[8px] sm:text-[10px] uppercase tracking-wider animate-in slide-in-from-top-2 rounded-r-lg">
              <span className="opacity-70">Erreur :</span> {displayError}
            </div>
          )}

          <Tabs value={step} onValueChange={setStep} className="w-full">
            <TabsList className="hidden">
              <TabsTrigger value="identity">ID</TabsTrigger>
              <TabsTrigger value="address">LOC</TabsTrigger>
            </TabsList>

            {/* ÉTAPE 1 : IDENTITÉ */}
            <TabsContent value="identity" className="space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-left-6 duration-500">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
                <div className="space-y-1.5 sm:space-y-2.5">
                  <Label className="font-tech text-[8px] sm:text-[9px] text-white uppercase tracking-[0.2em] ml-2">Nom</Label>
                  <Input 
                    name="nom" 
                    placeholder="NOM" 
                    className="h-12 sm:h-14 bg-white/[0.02] border border-white/10 rounded-xl sm:rounded-2xl font-bold text-white placeholder:text-white/20 focus:border-primary/50 focus:ring-1 focus:ring-primary/30 uppercase px-4 sm:px-6 text-xs sm:text-sm" 
                    onChange={handleChange} 
                    value={formData.nom}
                  />
                </div>
                <div className="space-y-1.5 sm:space-y-2.5">
                  <Label className="font-tech text-[8px] sm:text-[9px] text-white uppercase tracking-[0.2em] ml-2">Prénom</Label>
                  <Input 
                    name="prenom" 
                    placeholder="PRÉNOM" 
                    className="h-12 sm:h-14 bg-white/[0.02] border border-white/10 rounded-xl sm:rounded-2xl font-bold text-white placeholder:text-white/20 focus:border-primary/50 focus:ring-1 focus:ring-primary/30 uppercase px-4 sm:px-6 text-xs sm:text-sm" 
                    onChange={handleChange} 
                    value={formData.prenom}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
                <div className="space-y-1.5 sm:space-y-2.5">
                  <Label className="font-tech text-[8px] sm:text-[9px] text-white uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                    <Mail size={10} className="text-primary" /> Email
                  </Label>
                  <Input 
                    name="email" 
                    type="email" 
                    placeholder="ERIK@AGRI.CD" 
                    className="h-12 sm:h-14 bg-white/[0.02] border border-white/10 rounded-xl sm:rounded-2xl font-bold text-white placeholder:text-white/20 focus:border-primary/50 px-4 sm:px-6 text-xs sm:text-sm" 
                    onChange={handleChange} 
                    value={formData.email}
                  />
                </div>
                <div className="space-y-1.5 sm:space-y-2.5">
                  <Label className="font-tech text-[8px] sm:text-[9px] text-white uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                    <Phone size={10} className="text-primary" /> Téléphone
                  </Label>
                  <Input 
                    name="numero_tel" 
                    type="tel" 
                    placeholder="+243..." 
                    className="h-12 sm:h-14 bg-white/[0.02] border border-white/10 rounded-xl sm:rounded-2xl font-bold text-white placeholder:text-white/20 focus:border-primary/50 px-4 sm:px-6 text-xs sm:text-sm" 
                    onChange={handleChange} 
                    value={formData.numero_tel}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
                <div className="space-y-1.5 sm:space-y-2.5">
                  <Label className="font-tech text-[8px] sm:text-[9px] text-white uppercase tracking-[0.2em] ml-2">Genre</Label>
                  <Select onValueChange={(v) => setFormData({...formData, sexe: v})} value={formData.sexe}>
                    <SelectTrigger className="h-12 sm:h-14 bg-white/[0.02] border border-white/10 rounded-xl sm:rounded-2xl font-bold text-white uppercase px-4 sm:px-6 text-xs sm:text-sm">
                      <SelectValue placeholder="SÉLECTIONNER" />
                    </SelectTrigger>
                    <SelectContent className="bg-black border border-white/10 backdrop-blur-xl rounded-xl">
                      <SelectItem value="M" className="font-tech text-[10px] text-white">MASCULIN</SelectItem>
                      <SelectItem value="F" className="font-tech text-[10px] text-white">FÉMININ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5 sm:space-y-2.5">
                  <Label className="font-tech text-[8px] sm:text-[9px] text-white uppercase tracking-[0.2em] ml-2">Rôle</Label>
                  <Select onValueChange={(v) => setFormData({...formData, role_id: v})} value={formData.role_id}>
                    <SelectTrigger className="h-12 sm:h-14 bg-white/[0.02] border border-white/10 rounded-xl sm:rounded-2xl font-bold text-white px-4 sm:px-6 uppercase text-xs sm:text-sm">
                      <SelectValue placeholder="RÔLE" />
                    </SelectTrigger>
                    <SelectContent className="bg-black border border-white/10 backdrop-blur-xl">
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.id.toString()} className="font-tech text-[10px] uppercase text-white">
                          {role.titre_role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5 p-4 sm:p-5 bg-white/[0.02] rounded-2xl sm:rounded-3xl border border-white/10">
                <div className="space-y-1.5 sm:space-y-2.5">
                  <Label className="font-tech text-[8px] sm:text-[9px] text-white uppercase tracking-[0.2em] ml-2">Mot de passe</Label>
                  <Input 
                    name="mot_de_pass" 
                    type="password" 
                    placeholder="••••••••••••" 
                    className="h-12 sm:h-14 bg-white/[0.02] border border-white/10 rounded-xl sm:rounded-2xl font-bold text-white placeholder:text-white/20 focus:border-primary/50 px-4 sm:px-6" 
                    onChange={handleChange} 
                    value={formData.mot_de_pass}
                  />
                </div>
                <div className="space-y-1.5 sm:space-y-2.5">
                  <Label className="font-tech text-[8px] sm:text-[9px] text-white uppercase tracking-[0.2em] ml-2">Confirmation</Label>
                  <Input 
                    name="confirm_password" 
                    type="password" 
                    placeholder="••••••••••••" 
                    className="h-12 sm:h-14 bg-white/[0.02] border border-white/10 rounded-xl sm:rounded-2xl font-bold text-white placeholder:text-white/20 focus:border-primary/50 px-4 sm:px-6" 
                    onChange={handleChange} 
                    value={formData.confirm_password}
                  />
                </div>
              </div>

              <Button 
                onClick={handleNext} 
                className="w-full h-14 sm:h-16 mt-2 bg-gradient-to-r from-primary to-orange-400 text-black font-display font-black italic uppercase text-[10px] sm:text-[12px] tracking-[0.2em] rounded-xl shadow-lg shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all"
              >
                Étape suivante : localisation
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </TabsContent>

            {/* ÉTAPE 2 : ADRESSE */}
            <TabsContent value="address" className="space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-right-6 duration-500">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
                <div className="space-y-1.5 sm:space-y-2.5">
                  <Label className="font-tech text-[8px] sm:text-[9px] text-white uppercase tracking-[0.2em] ml-2">Province</Label>
                  <Input 
                    name="province" 
                    placeholder="NORD-KIVU" 
                    className="h-12 sm:h-14 bg-white/[0.02] border border-white/10 rounded-xl sm:rounded-2xl font-bold text-white placeholder:text-white/20 px-4 sm:px-6 text-xs" 
                    onChange={handleChange} 
                    value={formData.province}
                  />
                </div>
                <div className="space-y-1.5 sm:space-y-2.5">
                  <Label className="font-tech text-[8px] sm:text-[9px] text-white uppercase tracking-[0.2em] ml-2">Ville / Territoire</Label>
                  <Input 
                    name="ville" 
                    placeholder="BUNIA" 
                    className="h-12 sm:h-14 bg-white/[0.02] border border-white/10 rounded-xl sm:rounded-2xl font-bold text-white placeholder:text-white/20 px-4 sm:px-6 text-xs" 
                    onChange={handleChange} 
                    value={formData.ville}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
                <div className="space-y-1.5 sm:space-y-2.5">
                  <Label className="font-tech text-[8px] sm:text-[9px] text-white uppercase tracking-[0.2em] ml-2">Commune</Label>
                  <Input 
                    name="commune" 
                    placeholder="COMMUNE" 
                    className="h-12 sm:h-14 bg-white/[0.02] border border-white/10 rounded-xl sm:rounded-2xl font-bold text-white placeholder:text-white/20 px-4 sm:px-6 text-xs" 
                    onChange={handleChange} 
                    value={formData.commune}
                  />
                </div>
                <div className="space-y-1.5 sm:space-y-2.5">
                  <Label className="font-tech text-[8px] sm:text-[9px] text-white uppercase tracking-[0.2em] ml-2">Quartier</Label>
                  <Input 
                    name="quartier" 
                    placeholder="QUARTIER" 
                    className="h-12 sm:h-14 bg-white/[0.02] border border-white/10 rounded-xl sm:rounded-2xl font-bold text-white placeholder:text-white/20 px-4 sm:px-6 text-xs" 
                    onChange={handleChange} 
                    value={formData.quartier}
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3 sm:gap-5">
                <div className="col-span-3 space-y-1.5 sm:space-y-2.5">
                  <Label className="font-tech text-[8px] sm:text-[9px] text-white uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                    <MapPin size={10} className="text-primary" /> Avenue / Rue
                  </Label>
                  <Input 
                    name="avenue" 
                    placeholder="AVENUE" 
                    className="h-12 sm:h-14 bg-white/[0.02] border border-white/10 rounded-xl sm:rounded-2xl font-bold text-white placeholder:text-white/20 px-4 sm:px-6 text-xs" 
                    onChange={handleChange} 
                    value={formData.avenue}
                  />
                </div>
                <div className="space-y-1.5 sm:space-y-2.5">
                  <Label className="font-tech text-[8px] sm:text-[9px] text-white uppercase tracking-[0.2em] ml-2">N°</Label>
                  <Input 
                    name="numero" 
                    placeholder="44" 
                    className="h-12 sm:h-14 bg-white/[0.02] border border-white/10 rounded-xl sm:rounded-2xl font-bold text-white placeholder:text-white/20 text-center text-xs" 
                    onChange={handleChange} 
                    value={formData.numero}
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 mt-4 sm:mt-8">
                <Button 
                  variant="ghost" 
                  onClick={() => setStep("identity")} 
                  className="h-12 sm:h-16 order-2 sm:order-1 font-tech text-[8px] sm:text-[10px] uppercase border border-white/20 rounded-xl sm:rounded-2xl hover:bg-white/10 transition-all text-white"
                >
                  <ArrowLeft size={14} className="mr-2 sm:mr-3" /> Retour
                </Button>
                <Button 
                  onClick={handleSubmit} 
                  disabled={isLoading} 
                  className="h-14 sm:h-16 order-1 sm:order-2 flex-[2] bg-gradient-to-r from-primary to-orange-400 text-black font-display font-black italic uppercase text-[10px] sm:text-[12px] tracking-[0.2em] rounded-xl shadow-lg shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin w-5 h-5" />
                  ) : (
                    <>Créer mon compte <Activity size={18} className="ml-2 sm:ml-3" /></>
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6 sm:mt-8 text-center">
            <Link 
              to="/login" 
              className="font-tech text-[12px] sm:text-[9px] text-white hover:text-primary transition-all flex items-center justify-center gap-2 uppercase tracking-widest italic"
            >
              Déjà inscrit ? Se connecter
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SignUpSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#0a0a0a] via-[#050505] to-black">
      <Card className="w-full max-w-[650px] bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 sm:p-12 space-y-6 sm:space-y-8">
        <div className="space-y-4 flex flex-col items-center">
          <Skeleton className="h-12 sm:h-16 w-48 sm:w-80 bg-white/5 rounded-2xl" />
          <Skeleton className="h-3 sm:h-4 w-32 sm:w-48 bg-white/5" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-5 sm:pt-10">
          <Skeleton className="h-12 sm:h-14 bg-white/5 rounded-xl" />
          <Skeleton className="h-12 sm:h-14 bg-white/5 rounded-xl" />
          <Skeleton className="h-12 sm:h-14 bg-white/5 rounded-xl" />
          <Skeleton className="h-12 sm:h-14 bg-white/5 rounded-xl" />
        </div>
        <Skeleton className="h-14 sm:h-16 w-full bg-white/10 rounded-xl" />
      </Card>
    </div>
  );
}