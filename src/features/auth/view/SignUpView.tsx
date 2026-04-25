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

  // --- ÉTAT SUCCÈS ---
  if (isSuccess) {
    return (
      <div className="min-h-screen w-full bg-background flex items-center justify-center p-6">
        <Card className="w-full max-w-[480px] bg-glass border-2 border-primary/30 rounded-[3rem] shadow-2xl animate-in zoom-in-95 duration-500">
          <CardContent className="pt-16 pb-16 text-center space-y-8 px-10">
            <div className="flex justify-center">
              <div className="rounded-[2.5rem] bg-primary/10 p-8 border-2 border-primary/40 shadow-glow-primary animate-bounce">
                <CheckCircle2 className="w-16 h-16 text-primary" strokeWidth={2.5} />
              </div>
            </div>
            <div>
              <h2 className="text-4xl font-display text-glow-primary uppercase italic tracking-tighter">
                Matricule_OK
              </h2>
              <p className="font-tech text-[10px] text-muted-foreground uppercase tracking-[0.3em] mt-4 leading-relaxed">
                Votre profil a été injecté avec succès dans le réseau <span className="text-primary font-black">AgriConnect</span>.
              </p>
            </div>
            <Button className="btn-elite w-full h-16 shadow-xl" onClick={() => navigate('/login')}>
              Accéder au Terminal
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (roles.length === 0 && isLoading) return <SignUpSkeleton />;

  return (
    // Centrage parfait sur l'écran
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-6 md:p-12 relative overflow-hidden">
      
      {/* GLOW DE FOND */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 blur-[140px] rounded-full animate-pulse" />
      </div>

      <Card className="w-full max-w-[650px] bg-glass border-2 border-border/50 rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] relative z-10 overflow-hidden">
        
        {/* PROGRESS BAR ÉLITE */}
        <div className="h-1.5 w-full bg-secondary">
          <div 
            className="h-full bg-gradient-to-r from-primary via-accent to-primary shadow-glow-primary transition-all duration-700 ease-out"
            style={{ width: step === "identity" ? "50%" : "100%" }}
          ></div>
        </div>
        
        <CardHeader className="text-center pt-10 pb-4">
          <div className="flex justify-center mb-4">
             <div className="w-14 h-14 rounded-2xl bg-secondary border border-primary/20 flex items-center justify-center shadow-inner">
                <ShieldCheck className="w-8 h-8 text-primary" />
             </div>
          </div>
          <CardTitle className="text-4xl md:text-5xl font-display text-glow-primary tracking-tighter italic">
            AGRI<span className="text-accent">CONNECT</span>
          </CardTitle>
          <CardDescription className="font-tech text-[9px] text-muted-foreground/40 uppercase tracking-[0.4em] mt-3">
            Nouveau_Protocole_Enregistrement
          </CardDescription>
        </CardHeader>

        <CardContent className="px-8 md:px-12 pb-12">
          {displayError && (
            <div className="mb-8 p-4 bg-destructive/10 border-l-2 border-destructive text-destructive font-tech text-[10px] uppercase tracking-widest animate-in slide-in-from-top-2">
              <span className="opacity-50">Log_Erreur :</span> {displayError}
            </div>
          )}

          <Tabs value={step} onValueChange={setStep} className="w-full">
            <TabsList className="hidden">
              <TabsTrigger value="identity">ID</TabsTrigger>
              <TabsTrigger value="address">LOC</TabsTrigger>
            </TabsList>

            {/* --- ÉTAPE 1 : IDENTITÉ --- */}
            <TabsContent value="identity" className="space-y-6 animate-in fade-in slide-in-from-left-6 duration-500">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2.5">
                  <Label className="font-tech text-[9px] text-primary/60 uppercase tracking-[0.2em] ml-2">Nom_Famille</Label>
                  <Input name="nom" placeholder="NOM" className="h-14 bg-secondary/50 border-border/50 rounded-2xl font-bold text-white placeholder:text-white/40 focus:border-primary/50 transition-all uppercase px-6" onChange={handleChange} />
                </div>
                <div className="space-y-2.5">
                  <Label className="font-tech text-[9px] text-primary/60 uppercase tracking-[0.2em] ml-2">Prénom_Alpha</Label>
                  <Input name="prenom" placeholder="PRÉNOM" className="h-14 bg-secondary/50 border-border/50 rounded-2xl font-bold text-white placeholder:text-white/40 focus:border-primary/50 transition-all uppercase px-6" onChange={handleChange} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2.5">
                  <Label className="font-tech text-[9px] text-primary/60 uppercase tracking-[0.2em] ml-2 flex items-center gap-2"><Mail size={10}/> Email_Data</Label>
                  <Input name="email" type="email" placeholder="ERIK@AGRI.CD" className="h-14 bg-secondary/50 border-border/50 rounded-2xl font-bold text-white placeholder:text-white/40 focus:border-primary/50 px-6" onChange={handleChange} />
                </div>
                <div className="space-y-2.5">
                  <Label className="font-tech text-[9px] text-primary/60 uppercase tracking-[0.2em] ml-2 flex items-center gap-2"><Phone size={10}/> Téléphone_Com</Label>
                  <Input name="numero_tel" type="tel" placeholder="+243..." className="h-14 bg-secondary/50 border-border/50 rounded-2xl font-bold text-white placeholder:text-white/40 focus:border-primary/50 px-6" onChange={handleChange} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2.5">
                  <Label className="font-tech text-[9px] text-primary/60 uppercase tracking-[0.2em] ml-2">Genre_Sexe</Label>
                  <Select onValueChange={(v) => setFormData({...formData, sexe: v})}>
                    <SelectTrigger className="h-14 bg-secondary/50 border-border/50 rounded-2xl font-bold text-white uppercase px-6">
                      <SelectValue placeholder="SÉLECTIONNER" />
                    </SelectTrigger>
                    <SelectContent className="bg-secondary border-border shadow-2xl">
                      <SelectItem value="M" className="font-tech text-[10px]">MASCULIN</SelectItem>
                      <SelectItem value="F" className="font-tech text-[10px]">FÉMININ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2.5">
                  <Label className="font-tech text-[9px] text-primary/60 uppercase tracking-[0.2em] ml-2">Fonction_Rôle</Label>
                  <Select onValueChange={(v) => setFormData({...formData, role_id: v})}>
                    <SelectTrigger className="h-14 bg-secondary/50 border-border/50 rounded-2xl font-bold text-accent shadow-sm px-6 uppercase">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-5 bg-background/50 rounded-3xl border border-white/5">
                <div className="space-y-2.5">
                  <Label className="font-tech text-[9px] text-primary/60 uppercase tracking-[0.2em] ml-2">Clé_Accès</Label>
                  <Input name="mot_de_pass" type="password" placeholder="••••••••••••" className="h-14 bg-secondary/50 border-border/50 rounded-2xl font-bold text-white placeholder:text-white/40 focus:border-primary/50 px-6" onChange={handleChange} />
                </div>
                <div className="space-y-2.5">
                  <Label className="font-tech text-[9px] text-primary/60 uppercase tracking-[0.2em] ml-2">Confirmation</Label>
                  <Input name="confirm_password" type="password" placeholder="••••••••••••" className="h-14 bg-secondary/50 border-border/50 rounded-2xl font-bold text-white placeholder:text-white/40 focus:border-primary/50 px-6" onChange={handleChange} />
                </div>
              </div>

              <Button onClick={handleNext} className="btn-elite w-full h-16 mt-4">
                Étape_Suivante: Localisation
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </TabsContent>

            {/* --- ÉTAPE 2 : ADRESSE --- */}
            <TabsContent value="address" className="space-y-6 animate-in fade-in slide-in-from-right-6 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2.5">
                  <Label className="font-tech text-[9px] text-primary/60 uppercase tracking-[0.2em] ml-2">Province_Region</Label>
                  <Input name="province" placeholder="NORD-KIVU" className="h-14 bg-secondary/50 border-border/50 rounded-2xl font-bold text-white placeholder:text-white/40 focus:border-primary/50 px-6" onChange={handleChange} />
                </div>
                <div className="space-y-2.5">
                  <Label className="font-tech text-[9px] text-primary/60 uppercase tracking-[0.2em] ml-2">Ville_Territoire</Label>
                  <Input name="ville" placeholder="BUNIA" className="h-14 bg-secondary/50 border-border/50 rounded-2xl font-bold text-white placeholder:text-white/40 focus:border-primary/50 px-6" onChange={handleChange} />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2.5">
                  <Label className="font-tech text-[9px] text-primary/60 uppercase tracking-[0.2em] ml-2">Commune</Label>
                  <Input name="commune" placeholder="COMMUNE" className="h-14 bg-secondary/50 border-border/50 rounded-2xl font-bold text-white placeholder:text-white/40 focus:border-primary/50 px-6" onChange={handleChange} />
                </div>
                <div className="space-y-2.5">
                  <Label className="font-tech text-[9px] text-primary/60 uppercase tracking-[0.2em] ml-2">Quartier</Label>
                  <Input name="quartier" placeholder="QUARTIER" className="h-14 bg-secondary/50 border-border/50 rounded-2xl font-bold text-white placeholder:text-white/40 focus:border-primary/50 px-6" onChange={handleChange} />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-5">
                <div className="col-span-3 space-y-2.5">
                  <Label className="font-tech text-[9px] text-primary/60 uppercase tracking-[0.2em] ml-2 flex items-center gap-2"><MapPin size={10}/> Avenue_Rue</Label>
                  <Input name="avenue" placeholder="NOM DE L'AVENUE" className="h-14 bg-secondary/50 border-border/50 rounded-2xl font-bold text-white placeholder:text-white/40 focus:border-primary/50 px-6" onChange={handleChange} />
                </div>
                <div className="space-y-2.5">
                  <Label className="font-tech text-[9px] text-primary/60 uppercase tracking-[0.2em] ml-2">N°</Label>
                  <Input name="numero" placeholder="44" className="h-14 bg-secondary/50 border-border/50 rounded-2xl font-bold text-white placeholder:text-white/40 focus:border-primary/50 text-center" onChange={handleChange} />
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-5 mt-8">
                <Button variant="ghost" onClick={() => setStep("identity")} className="h-16 flex-1 font-tech text-[10px] uppercase border border-border/40 rounded-2xl hover:bg-white/5 transition-all">
                  <ArrowLeft size={16} className="mr-3" /> Retour_ID
                </Button>
                <Button onClick={handleSubmit} disabled={isLoading} className="btn-elite h-16 flex-[2] shadow-primary/20">
                  {isLoading ? (
                    <Loader2 className="animate-spin w-5 h-5" />
                  ) : (
                    <>Injecter_Profil <Activity size={18} className="ml-3" /></>
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-8 text-center">
            <Link to="/login" className="font-tech text-[9px] text-muted-foreground/50 hover:text-accent flex items-center justify-center gap-2 transition-all uppercase tracking-widest italic">
              Terminal de connexion déjà actif ? Accéder
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SignUpSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <Card className="w-full max-w-[650px] bg-glass border-none p-12 space-y-8 rounded-[2.5rem]">
        <div className="space-y-4 flex flex-col items-center">
          <Skeleton className="h-16 w-80 bg-primary/10 rounded-2xl" />
          <Skeleton className="h-4 w-48 bg-white/5" />
        </div>
        <div className="grid grid-cols-2 gap-6 pt-10">
          <Skeleton className="h-14 bg-secondary rounded-2xl" />
          <Skeleton className="h-14 bg-secondary rounded-2xl" />
          <Skeleton className="h-14 bg-secondary rounded-2xl" />
          <Skeleton className="h-14 bg-secondary rounded-2xl" />
        </div>
        <Skeleton className="h-16 w-full bg-primary/20 rounded-2xl" />
      </Card>
    </div>
  );
}