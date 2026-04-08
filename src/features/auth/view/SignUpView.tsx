import React, { useState } from 'react';
import { useAuthSignUp } from '@/features/auth/hooks/use-auth-signup';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, MapPin, User, CheckCircle2, ArrowRight, ArrowLeft, Phone, Mail } from "lucide-react";
import { useNavigate } from 'react-router-dom';

export default function SignUpView() {
  const { signUp, isLoading, error: serverError, roles } = useAuthSignUp();
  const [step, setStep] = useState("identity");
  const [isSuccess, setIsSuccess] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '', 
    numero_tel: '', // Ajout du numéro de téléphone
    mot_de_pass: '', 
    confirm_password: '', // Ajout de la confirmation du mot de passe
    nom: '', post_nom: '', prenom: '',
    sexe: '', role_id: '', avatar_url: '',
    pays: 'RDC', province: '', ville: '', commune: '', quartier: '', avenue: '', numero: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setLocalError(null); // On efface l'erreur locale quand l'utilisateur tape
  };

  const validateIdentityStep = () => {
    if (formData.mot_de_pass !== formData.confirm_password) {
      setLocalError("Les mots de passe ne correspondent pas.");
      return false;
    }
    if (!formData.email && !formData.numero_tel) {
      setLocalError("Veuillez fournir un Email OU un Numéro de téléphone.");
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
    // Petit check final avant l'envoi
    if (!validateIdentityStep()) {
      setStep("identity");
      return;
    }

    const result = await signUp(formData);
    if (result?.success) {
      setIsSuccess(true);
    }
  };

  // On combine l'erreur du serveur (hook) et l'erreur locale (validation front)
  const displayError = localError || serverError;

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <Card className="w-full max-w-md bg-glass-agri border-active-green animate-in zoom-in-95 duration-500">
          <CardContent className="pt-12 pb-12 text-center space-y-6">
            <div className="flex justify-center">
              <div className="rounded-full bg-primary/20 p-6 shadow-[0_0_50px_rgba(34,197,94,0.3)] animate-bounce">
                <CheckCircle2 className="w-20 h-20 text-primary" strokeWidth={3} />
              </div>
            </div>
            <h2 className="text-3xl font-black text-glow-green uppercase tracking-tighter italic">
              Compte Créé !
            </h2>
            <p className="text-foreground/80 font-bold">
              Bienvenue dans l'écosystème <span className="text-primary">AgriConnect</span>. 
              Votre aventure commence maintenant.
            </p>
            <Button className="btn-elite w-full shadow-lg" onClick={() => navigate('/login')}>
              Accéder à la connexion
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (roles.length === 0 && isLoading) {
    return <SignUpSkeleton />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background selection:bg-primary selection:text-white">
      <Card className="w-full max-w-3xl bg-glass-agri border-none shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
        <div className="h-1.5 w-full bg-input/30">
          <div 
            className="h-full bg-gradient-to-r from-primary via-accent to-primary shadow-[0_0_15px_var(--color-primary)] transition-all duration-500"
            style={{ width: step === "identity" ? "50%" : "100%" }}
          ></div>
        </div>
        
        <CardHeader className="text-center pt-10">
          <CardTitle className="text-5xl font-black text-glow-green tracking-tighter uppercase italic">
            Agri<span className="text-accent text-glow-yellow">Connect</span>
          </CardTitle>
          <CardDescription className="text-foreground/70 font-black uppercase tracking-[0.3em] text-[10px] mt-2">
            Technologie • Agriculture • Performance
          </CardDescription>
        </CardHeader>

        <CardContent className="px-8 pb-10">
          {displayError && (
            <div className="mb-6 p-4 bg-destructive/20 border-l-4 border-destructive text-white rounded-r-lg text-sm font-bold animate-in fade-in slide-in-from-top-2">
              <span className="opacity-70">ERREUR:</span> {displayError}
            </div>
          )}

          <Tabs value={step} onValueChange={setStep} className="w-full">
            <TabsList className="hidden">
              <TabsTrigger value="identity">ID</TabsTrigger>
              <TabsTrigger value="address">LOC</TabsTrigger>
            </TabsList>

            {/* --- ÉTAPE 1 : IDENTITÉ --- */}
            <TabsContent value="identity" className="space-y-6 animate-in fade-in slide-in-from-left-6 duration-300">
              
              {/* Ligne 1 : Nom / Prénom */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-primary/80">Nom de famille</Label>
                  <Input name="nom" placeholder="NZAMBI" className="h-12 bg-input/50 border-none font-bold placeholder:text-foreground/20 focus:border-active-green" onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-primary/80">Prénom</Label>
                  <Input name="prenom" placeholder="ERICK" className="h-12 bg-input/50 border-none font-bold placeholder:text-foreground/20" onChange={handleChange} />
                </div>
              </div>

              {/* Ligne 2 : Contact (Email / Tél) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-primary/80 flex items-center gap-2">
                    <Mail className="w-3 h-3" /> Email 
                  </Label>
                  <Input name="email" type="email" placeholder="erick@agri.cd" className="h-12 bg-input/50 border-none font-bold placeholder:text-foreground/20" onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-primary/80 flex items-center gap-2">
                    <Phone className="w-3 h-3" /> Téléphone <span className="text-foreground/40 lowercase text-[10px]">(Optionnel si Email)</span>
                  </Label>
                  <Input name="numero_tel" type="tel" placeholder="+243..." className="h-12 bg-input/50 border-none font-bold placeholder:text-foreground/20" onChange={handleChange} />
                </div>
              </div>

              {/* Ligne 3 : Sexe / Rôle */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-primary/80">Sexe</Label>
                  <Select onValueChange={(v) => setFormData({...formData, sexe: v})}>
                    <SelectTrigger className="h-12 bg-input/50 border-none font-bold">
                      <SelectValue placeholder="SÉLECTIONNER" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-primary/20">
                      <SelectItem value="M" className="font-bold">MASCULIN</SelectItem>
                      <SelectItem value="F" className="font-bold">FÉMININ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-primary/80">Rôle Acteur</Label>
                  <Select onValueChange={(v) => setFormData({...formData, role_id: v})}>
                    <SelectTrigger className="h-12 bg-input/50 border-primary/30 font-bold text-accent shadow-[0_0_10px_rgba(255,193,7,0.1)]">
                      <SelectValue placeholder="VOTRE FONCTION" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-primary/20">
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.id.toString()} className="font-bold uppercase tracking-tight">
                          {role.titre_role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Ligne 4 : Sécurité */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-black/20 rounded-xl border border-white/5">
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-primary/80">Mot de passe</Label>
                  <Input name="mot_de_pass" type="password" placeholder="••••••••••••" className="h-12 bg-input/50 border-none font-bold" onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-primary/80">Confirmer Mot de passe</Label>
                  <Input name="confirm_password" type="password" placeholder="••••••••••••" className="h-12 bg-input/50 border-none font-bold" onChange={handleChange} />
                </div>
              </div>

              <Button onClick={handleNext} className="w-full btn-elite h-14 group shadow-lg shadow-primary/20 mt-4">
                <span className="drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">Continuer vers Localisation</span>
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </TabsContent>

            {/* --- ÉTAPE 2 : ADRESSE (Reste identique, juste la taille max du card ajustée) --- */}
            <TabsContent value="address" className="space-y-6 animate-in fade-in slide-in-from-right-6 duration-300">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-primary/80">Province</Label>
                  <Input name="province" placeholder="NORD-KIVU" className="h-12 bg-input/50 border-none font-bold" onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-primary/80">Ville / Territoire</Label>
                  <Input name="ville" placeholder="GOMA" className="h-12 bg-input/50 border-none font-bold" onChange={handleChange} />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-primary/80">Commune</Label>
                  <Input name="commune" placeholder="GOMA" className="h-12 bg-input/50 border-none font-bold" onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-primary/80">Quartier</Label>
                  <Input name="quartier" placeholder="KYESHERO" className="h-12 bg-input/50 border-none font-bold" onChange={handleChange} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2 space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-primary/80">Avenue</Label>
                  <Input name="avenue" placeholder="DE LA PAIX" className="h-12 bg-input/50 border-none font-bold" onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-primary/80">N°</Label>
                  <Input name="numero" placeholder="44" className="h-12 bg-input/50 border-none font-bold text-center" onChange={handleChange} />
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 mt-8">
                <Button variant="ghost" onClick={() => setStep("identity")} className="flex-1 font-black uppercase tracking-widest text-xs h-14 border border-white/5 hover:bg-white/5">
                  <ArrowLeft className="mr-2 w-4 h-4" /> Retour
                </Button>
                <Button onClick={handleSubmit} disabled={isLoading} className="flex-[2] btn-elite h-14 bg-gradient-to-r from-primary to-green-700 shadow-xl shadow-primary/20">
                  {isLoading ? (
                    <Loader2 className="animate-spin mr-2" />
                  ) : (
                    <CheckCircle2 className="mr-2 w-5 h-5 drop-shadow-md" />
                  )}
                  <span className="drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">Finaliser mon Profil</span>
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function SignUpSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-3xl bg-glass-agri border-none p-12 space-y-8">
        <div className="space-y-2 flex flex-col items-center">
          <Skeleton className="h-12 w-64 bg-primary/20" />
          <Skeleton className="h-4 w-40 bg-white/5" />
        </div>
        <div className="grid grid-cols-2 gap-6">
          <Skeleton className="h-14 bg-input/50 rounded-lg" />
          <Skeleton className="h-14 bg-input/50 rounded-lg" />
        </div>
        <Skeleton className="h-14 w-full bg-input/50 rounded-lg" />
        <Skeleton className="h-14 w-full bg-primary/30 rounded-lg mt-6" />
      </Card>
    </div>
  );
}