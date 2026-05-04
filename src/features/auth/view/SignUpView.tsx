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
import { Loader2, CheckCircle2, ArrowRight, ArrowLeft, Phone, Mail, ShieldCheck, MapPin, Activity } from "lucide-react";
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
      setLocalError("CONFLIT : LES CLÉS DE SÉCURITÉ NE CORRESPONDENT PAS.");
      return false;
    }
    if (!formData.email && !formData.numero_tel) {
      setLocalError("REQUIS : FOURNIR EMAIL OU TÉLÉPHONE.");
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
      <div className="min-h-screen w-full bg-background flex items-center justify-center p-4 sm:p-6">
        <Card className="w-full max-w-[480px] bg-glass border-2 border-primary/30 rounded-[2rem] sm:rounded-[3rem] shadow-2xl animate-in zoom-in-95 duration-500">
          <CardContent className="pt-10 sm:pt-16 pb-10 sm:pb-16 text-center space-y-6 sm:space-y-8 px-6 sm:px-10">
            <div className="flex justify-center">
              <div className="rounded-[1.5rem] sm:rounded-[2.5rem] bg-primary/10 p-5 sm:p-8 border-2 border-primary/40 shadow-glow-primary animate-bounce">
                <CheckCircle2 className="w-10 h-10 sm:w-16 sm:h-16 text-primary" strokeWidth={2.5} />
              </div>
            </div>
            <div>
              <h2 className="text-2xl sm:text-4xl font-display text-glow-primary uppercase italic tracking-tighter">
                Matricule_OK
              </h2>
              <p className="font-tech text-[8px] sm:text-[10px] text-muted-foreground uppercase tracking-[0.2em] sm:tracking-[0.3em] mt-2 sm:mt-4 leading-relaxed">
                Votre profil a été injecté avec succès dans le réseau <span className="text-primary font-black">AgriConnect</span>.
              </p>
            </div>
            <Button className="btn-elite w-full h-14 sm:h-16 shadow-xl text-[11px]" onClick={() => navigate('/login')}>
              Accéder au Terminal
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (roles.length === 0 && isLoading) return <SignUpSkeleton />;

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-0 sm:p-6 md:p-12 relative overflow-hidden">
      
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-primary/5 blur-[80px] sm:blur-[140px] rounded-full animate-pulse" />
      </div>

      <Card className="w-full max-w-[650px] bg-glass border-2 border-border/50 rounded-none sm:rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] relative z-10 overflow-hidden min-h-screen sm:min-h-fit">
        
        <div className="h-1.5 w-full bg-secondary">
          <div 
            className="h-full bg-gradient-to-r from-primary via-accent to-primary shadow-glow-primary transition-all duration-700 ease-out"
            style={{ width: step === "identity" ? "50%" : "100%" }}
          ></div>
        </div>
        
        <CardHeader className="text-center pt-6 sm:pt-10 pb-2 sm:pb-4">
          <div className="flex justify-center mb-3 sm:mb-4 scale-75 sm:scale-100">
             <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-secondary border border-primary/20 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
             </div>
          </div>
          <CardTitle className="text-3xl sm:text-5xl font-display text-glow-primary tracking-tighter italic">
            AGRI<span className="text-accent">CONNECT</span>
          </CardTitle>
          <CardDescription className="font-tech text-[7px] sm:text-[9px] text-muted-foreground/40 uppercase tracking-[0.3em] sm:tracking-[0.4em] mt-2">
            Nouveau_Protocole_Enregistrement
          </CardDescription>
        </CardHeader>

        <CardContent className="px-4 sm:px-12 pb-10 sm:pb-12">
          {displayError && (
            <div className="mb-6 p-3 sm:p-4 bg-destructive/10 border-l-2 border-destructive text-destructive font-tech text-[8px] sm:text-[10px] uppercase tracking-widest animate-in slide-in-from-top-2">
              <span className="opacity-50">Log_Erreur :</span> {displayError}
            </div>
          )}

          <Tabs value={step} onValueChange={setStep} className="w-full">
            <TabsList className="hidden">
              <TabsTrigger value="identity">ID</TabsTrigger>
              <TabsTrigger value="address">LOC</TabsTrigger>
            </TabsList>

            <TabsContent value="identity" className="space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-left-6 duration-500">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
                <div className="space-y-1.5 sm:space-y-2.5">
                  <Label className="font-tech text-[8px] sm:text-[9px] text-primary/60 uppercase tracking-[0.2em] ml-2">Nom_Famille</Label>
                  <Input name="nom" placeholder="NOM" className="h-12 sm:h-14 bg-secondary/50 border-border/50 rounded-xl sm:rounded-2xl font-bold text-white placeholder:text-white/20 focus:border-primary/50 uppercase px-4 sm:px-6 text-xs sm:text-sm" onChange={handleChange} />
                </div>
                <div className="space-y-1.5 sm:space-y-2.5">
                  <Label className="font-tech text-[8px] sm:text-[9px] text-primary/60 uppercase tracking-[0.2em] ml-2">Prénom_Alpha</Label>
                  <Input name="prenom" placeholder="PRÉNOM" className="h-12 sm:h-14 bg-secondary/50 border-border/50 rounded-xl sm:rounded-2xl font-bold text-white placeholder:text-white/20 focus:border-primary/50 uppercase px-4 sm:px-6 text-xs sm:text-sm" onChange={handleChange} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
                <div className="space-y-1.5 sm:space-y-2.5">
                  <Label className="font-tech text-[8px] sm:text-[9px] text-primary/60 uppercase tracking-[0.2em] ml-2 flex items-center gap-2"><Mail size={10}/> Email_Data</Label>
                  <Input name="email" type="email" placeholder="ERIK@AGRI.CD" className="h-12 sm:h-14 bg-secondary/50 border-border/50 rounded-xl sm:rounded-2xl font-bold text-white placeholder:text-white/20 focus:border-primary/50 px-4 sm:px-6 text-xs sm:text-sm" onChange={handleChange} />
                </div>
                <div className="space-y-1.5 sm:space-y-2.5">
                  <Label className="font-tech text-[8px] sm:text-[9px] text-primary/60 uppercase tracking-[0.2em] ml-2 flex items-center gap-2"><Phone size={10}/> Téléphone_Com</Label>
                  <Input name="numero_tel" type="tel" placeholder="+243..." className="h-12 sm:h-14 bg-secondary/50 border-border/50 rounded-xl sm:rounded-2xl font-bold text-white placeholder:text-white/20 focus:border-primary/50 px-4 sm:px-6 text-xs sm:text-sm" onChange={handleChange} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
                <div className="space-y-1.5 sm:space-y-2.5">
                  <Label className="font-tech text-[8px] sm:text-[9px] text-primary/60 uppercase tracking-[0.2em] ml-2">Genre_Sexe</Label>
                  <Select onValueChange={(v) => setFormData({...formData, sexe: v})}>
                    <SelectTrigger className="h-12 sm:h-14 bg-secondary/50 border-border/50 rounded-xl sm:rounded-2xl font-bold text-white uppercase px-4 sm:px-6 text-xs sm:text-sm">
                      <SelectValue placeholder="SÉLECTIONNER" />
                    </SelectTrigger>
                    <SelectContent className="bg-secondary border-border shadow-2xl">
                      <SelectItem value="M" className="font-tech text-[10px]">MASCULIN</SelectItem>
                      <SelectItem value="F" className="font-tech text-[10px]">FÉMININ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5 sm:space-y-2.5">
                  <Label className="font-tech text-[8px] sm:text-[9px] text-primary/60 uppercase tracking-[0.2em] ml-2">Fonction_Rôle</Label>
                  <Select onValueChange={(v) => setFormData({...formData, role_id: v})}>
                    <SelectTrigger className="h-12 sm:h-14 bg-secondary/50 border-border/50 rounded-xl sm:rounded-2xl font-bold text-accent px-4 sm:px-6 uppercase text-xs sm:text-sm">
                      <SelectValue placeholder="RÔLE SYSTÈME" />
                    </SelectTrigger>
                    <SelectContent className="bg-secondary border-border">
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.id.toString()} className="font-tech text-[10px] uppercase">
                          {role.titre_role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5 p-4 sm:p-5 bg-background/50 rounded-2xl sm:rounded-3xl border border-white/5">
                <div className="space-y-1.5 sm:space-y-2.5">
                  <Label className="font-tech text-[8px] sm:text-[9px] text-primary/60 uppercase tracking-[0.2em] ml-2">Clé_Accès</Label>
                  <Input name="mot_de_pass" type="password" placeholder="••••••••••••" className="h-12 sm:h-14 bg-secondary/50 border-border/50 rounded-xl sm:rounded-2xl font-bold text-white placeholder:text-white/20 focus:border-primary/50 px-4 sm:px-6" onChange={handleChange} />
                </div>
                <div className="space-y-1.5 sm:space-y-2.5">
                  <Label className="font-tech text-[8px] sm:text-[9px] text-primary/60 uppercase tracking-[0.2em] ml-2">Confirmation</Label>
                  <Input name="confirm_password" type="password" placeholder="••••••••••••" className="h-12 sm:h-14 bg-secondary/50 border-border/50 rounded-xl sm:rounded-2xl font-bold text-white placeholder:text-white/20 focus:border-primary/50 px-4 sm:px-6" onChange={handleChange} />
                </div>
              </div>

              <Button onClick={handleNext} className="btn-elite w-full h-14 sm:h-16 mt-2 text-[10px] sm:text-[12px]">
                Étape_Suivante: Localisation
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </TabsContent>

            <TabsContent value="address" className="space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-right-6 duration-500">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
                <div className="space-y-1.5 sm:space-y-2.5">
                  <Label className="font-tech text-[8px] sm:text-[9px] text-primary/60 uppercase tracking-[0.2em] ml-2">Province_Region</Label>
                  <Input name="province" placeholder="NORD-KIVU" className="h-12 sm:h-14 bg-secondary/50 border-border/50 rounded-xl sm:rounded-2xl font-bold text-white placeholder:text-white/20 px-4 sm:px-6 text-xs" onChange={handleChange} />
                </div>
                <div className="space-y-1.5 sm:space-y-2.5">
                  <Label className="font-tech text-[8px] sm:text-[9px] text-primary/60 uppercase tracking-[0.2em] ml-2">Ville_Territoire</Label>
                  <Input name="ville" placeholder="BUNIA" className="h-12 sm:h-14 bg-secondary/50 border-border/50 rounded-xl sm:rounded-2xl font-bold text-white placeholder:text-white/20 px-4 sm:px-6 text-xs" onChange={handleChange} />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
                <div className="space-y-1.5 sm:space-y-2.5">
                  <Label className="font-tech text-[8px] sm:text-[9px] text-primary/60 uppercase tracking-[0.2em] ml-2">Commune</Label>
                  <Input name="commune" placeholder="COMMUNE" className="h-12 sm:h-14 bg-secondary/50 border-border/50 rounded-xl sm:rounded-2xl font-bold text-white placeholder:text-white/20 px-4 sm:px-6 text-xs" onChange={handleChange} />
                </div>
                <div className="space-y-1.5 sm:space-y-2.5">
                  <Label className="font-tech text-[8px] sm:text-[9px] text-primary/60 uppercase tracking-[0.2em] ml-2">Quartier</Label>
                  <Input name="quartier" placeholder="QUARTIER" className="h-12 sm:h-14 bg-secondary/50 border-border/50 rounded-xl sm:rounded-2xl font-bold text-white placeholder:text-white/20 px-4 sm:px-6 text-xs" onChange={handleChange} />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3 sm:gap-5">
                <div className="col-span-3 space-y-1.5 sm:space-y-2.5">
                  <Label className="font-tech text-[8px] sm:text-[9px] text-primary/60 uppercase tracking-[0.2em] ml-2 flex items-center gap-2"><MapPin size={10}/> Avenue_Rue</Label>
                  <Input name="avenue" placeholder="AVENUE" className="h-12 sm:h-14 bg-secondary/50 border-border/50 rounded-xl sm:rounded-2xl font-bold text-white placeholder:text-white/20 px-4 sm:px-6 text-xs" onChange={handleChange} />
                </div>
                <div className="space-y-1.5 sm:space-y-2.5">
                  <Label className="font-tech text-[8px] sm:text-[9px] text-primary/60 uppercase tracking-[0.2em] ml-2">N°</Label>
                  <Input name="numero" placeholder="44" className="h-12 sm:h-14 bg-secondary/50 border-border/50 rounded-xl sm:rounded-2xl font-bold text-white placeholder:text-white/20 text-center text-xs" onChange={handleChange} />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 mt-4 sm:mt-8">
                <Button variant="ghost" onClick={() => setStep("identity")} className="h-12 sm:h-16 order-2 sm:order-1 font-tech text-[8px] sm:text-[10px] uppercase border border-border/40 rounded-xl sm:rounded-2xl hover:bg-white/5 transition-all">
                  <ArrowLeft size={14} className="mr-2 sm:mr-3" /> Retour_ID
                </Button>
                <Button onClick={handleSubmit} disabled={isLoading} className="btn-elite h-14 sm:h-16 order-1 sm:order-2 flex-[2] text-[10px] sm:text-[12px] shadow-primary/20">
                  {isLoading ? (
                    <Loader2 className="animate-spin w-5 h-5" />
                  ) : (
                    <>Injecter_Profil <Activity size={18} className="ml-2 sm:ml-3" /></>
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6 sm:mt-8 text-center">
            <Link to="/login" className="font-tech text-[12px] sm:text-[9px] text-white hover:text-accent flex items-center justify-center gap-2 transition-all uppercase tracking-widest italic">
              J'ai un compte ? Accéder
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SignUpSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-[650px] bg-glass border-none p-6 sm:p-12 space-y-6 sm:space-y-8 rounded-[2rem]">
        <div className="space-y-4 flex flex-col items-center">
          <Skeleton className="h-12 sm:h-16 w-48 sm:w-80 bg-primary/10 rounded-2xl" />
          <Skeleton className="h-3 sm:h-4 w-32 sm:w-48 bg-white/5" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-5 sm:pt-10">
          <Skeleton className="h-12 sm:h-14 bg-secondary rounded-xl" />
          <Skeleton className="h-12 sm:h-14 bg-secondary rounded-xl" />
          <Skeleton className="h-12 sm:h-14 bg-secondary rounded-xl" />
          <Skeleton className="h-12 sm:h-14 bg-secondary rounded-xl" />
        </div>
        <Skeleton className="h-14 sm:h-16 w-full bg-primary/20 rounded-xl" />
      </Card>
    </div>
  );
}