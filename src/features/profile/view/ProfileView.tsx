import { IdentityForm } from '../components/IdentityForm';
import { AddressForm } from '../components/AddressForm';
import { RoleSwitcher } from '../components/RoleSwitcher';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { User, MapPin, ShieldAlert, Fingerprint, Activity, ShieldCheck } from "lucide-react";
import { useProfile } from '../hooks/useProfile';
import { cn } from "@/lib/utils";

export default function ProfileView() {
  const { profile, roles, isLoading, updateProfile, changeRole } = useProfile();

  // Skeleton d'attente haute fidélité
  if (isLoading && !profile) {
    return (
      <div className="p-6 md:p-10 space-y-8 animate-pulse bg-background min-h-screen">
        <div className="h-24 w-full bg-secondary border-2 border-border rounded-3xl" />
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="h-[400px] bg-secondary border-2 border-border rounded-3xl" />
          <div className="lg:col-span-3 h-[600px] bg-secondary border-2 border-border rounded-[3rem]" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen lg:h-[calc(100vh-80px)] flex flex-col gap-6 animate-in fade-in duration-700 p-4 md:p-6 lg:overflow-hidden bg-background">
      
      {/* HEADER : TERMINAL D'IDENTITÉ */}
      <header className="flex items-center justify-between px-6 py-5 bg-secondary border-2 border-border rounded-[2rem] shrink-0 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-primary/40" />
        
        <div className="flex items-center gap-5">
          <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-background border-2 border-primary/30 flex items-center justify-center overflow-hidden shadow-inner">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <Fingerprint className="w-7 h-7 text-primary/40" />
            )}
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-display font-black uppercase italic tracking-tighter text-foreground">
              GESTION_<span className="text-primary">PROFIL</span>
            </h1>
            <p className="font-tech text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold">{profile?.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end hidden sm:flex">
             <span className="font-tech text-[10px] text-primary font-black tracking-widest uppercase italic leading-none">NODE_SYNC_OK</span>
             <span className="font-tech text-[8px] text-muted-foreground uppercase mt-1">BUNIA_HUB_ITURI</span>
          </div>
          <div className="p-4 bg-background border-2 border-primary/20 rounded-xl shadow-lg group">
            <Activity className="w-5 h-5 text-primary animate-pulse group-hover:scale-110 transition-transform" />
          </div>
        </div>
      </header>

      {/* MAIN LAYOUT : ARCHITECTURE EN NOEUDS */}
      <Tabs defaultValue="identity" className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
        
        {/* MINI SIDEBAR NAV : Look Hardware */}
        <aside className="w-full lg:w-80 shrink-0 lg:h-full flex flex-col gap-6 overflow-visible">
          <TabsList className="flex lg:flex-col h-auto w-full bg-secondary border-2 border-border p-3 rounded-[2rem] gap-3 shadow-lg">
            
            <TabsTrigger value="identity" className="flex-1 lg:w-full justify-start gap-4 px-6 py-5 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground font-display italic font-black uppercase text-[11px] tracking-widest transition-all shadow-md">
              <User className="w-5 h-5 shrink-0" />
              <span className="hidden lg:inline">IDENTITÉ_BIO</span>
            </TabsTrigger>

            <TabsTrigger value="location" className="flex-1 lg:w-full justify-start gap-4 px-6 py-5 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground font-display italic font-black uppercase text-[11px] tracking-widest transition-all shadow-md">
              <MapPin className="w-5 h-5 shrink-0" />
              <span className="hidden lg:inline">LOCALISATION</span>
            </TabsTrigger>

            <TabsTrigger value="roles" className="flex-1 lg:w-full justify-start gap-4 px-6 py-5 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground font-display italic font-black uppercase text-[11px] tracking-widest transition-all shadow-md">
              <ShieldCheck className="w-5 h-5 shrink-0" />
              <span className="hidden lg:inline">PRIVILÈGES</span>
            </TabsTrigger>

            <TabsTrigger value="danger" className="flex-1 lg:w-full justify-start gap-4 px-6 py-5 rounded-xl data-[state=active]:bg-error data-[state=active]:text-error-foreground text-error/40 font-display italic font-black uppercase text-[11px] tracking-widest transition-all">
              <ShieldAlert className="w-5 h-5 shrink-0" />
              <span className="hidden lg:inline">SÉCURITÉ</span>
            </TabsTrigger>
          </TabsList>

          {/* WIDGET DE STATUT : PERFORMANCE RÉSEAU */}
          <div className="hidden lg:block p-8 bg-secondary border-2 border-border rounded-[2rem] space-y-6 shadow-xl border-t-primary/20">
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 bg-primary rounded-full animate-ping" />
               <p className="font-tech text-[9px] text-muted-foreground uppercase tracking-widest font-black italic">_Performance_AgriConnect</p>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="font-tech text-[11px] text-muted-foreground uppercase font-bold">Réputation_Score</span>
                <span className="font-display italic text-primary text-2xl font-black">98%</span>
              </div>
              <div className="w-full h-2 bg-background border border-border rounded-full overflow-hidden p-0.5">
                 <div className="w-[98%] h-full bg-primary rounded-full shadow-[0_0_15px_rgba(var(--primary),0.5)]" />
              </div>
            </div>
          </div>
        </aside>

        {/* CONTENU PRINCIPAL : ZONE DE TRAVAIL */}
        <main className="flex-1 lg:h-full lg:overflow-y-auto custom-scrollbar lg:pr-2">
          
          <TabsContent value="identity" className="mt-0 focus-visible:outline-none animate-in fade-in slide-in-from-right-8 duration-500">
            <Card className="bg-secondary border-2 border-border p-8 md:p-14 rounded-[3rem] shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                 <User className="w-48 h-48 text-primary" />
               </div>
               <IdentityForm profile={profile} onUpdate={updateProfile} loading={isLoading} />
            </Card>
          </TabsContent>

          <TabsContent value="location" className="mt-0 focus-visible:outline-none animate-in fade-in slide-in-from-right-8 duration-500">
            <Card className="bg-secondary border-2 border-border p-8 md:p-14 rounded-[3rem] shadow-2xl">
               <AddressForm profile={profile} onUpdate={updateProfile} loading={isLoading} />
            </Card>
          </TabsContent>

          <TabsContent value="roles" className="mt-0 focus-visible:outline-none animate-in fade-in slide-in-from-right-8 duration-500">
            <RoleSwitcher
              currentRoleId={profile?.role_id}
              roles={roles}
              onRoleChange={changeRole}
              loading={isLoading}
            />
          </TabsContent>

          <TabsContent value="danger" className="mt-0 focus-visible:outline-none animate-in fade-in slide-in-from-right-8 duration-500">
            <Card className="bg-error/5 border-2 border-error p-10 rounded-[3rem] border-l-[12px] relative overflow-hidden group shadow-2xl">
               <div className="absolute top-0 right-0 p-12 opacity-10">
                 <ShieldAlert className="w-32 h-32 text-error" />
               </div>
               <div className="max-w-xl space-y-8 relative z-10">
                 <h3 className="text-error font-display font-black uppercase italic text-3xl tracking-tighter">PROTOCOLE_DE_RUPTURE</h3>
                 <p className="font-tech text-[11px] text-foreground/60 leading-relaxed uppercase tracking-[0.1em] font-bold">
                   ALERTE : L'initialisation de ce protocole entraînera la suppression immédiate et irréversible de tous vos nœuds logistiques, de vos contrats intelligents et de votre matrice d'identité sur le Hub de Bunia.
                 </p>
                 <button className="px-10 py-6 bg-error text-error-foreground font-display font-black uppercase italic text-sm tracking-[0.4em] rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-[0_15px_40px_rgba(var(--error),0.3)]">
                   EXÉCUTER_DESTRUCTION
                 </button>
               </div>
            </Card>
          </TabsContent>

        </main>
      </Tabs>

      {/* FOOTER SYSTEME */}
      <footer className="text-center py-6 opacity-40 shrink-0">
        <p className="font-tech text-[9px] text-muted-foreground uppercase tracking-[0.5em] font-black"> AgriConnect_Secure_OS // Bunia_RDC_2026</p>
      </footer>
    </div>
  );
}