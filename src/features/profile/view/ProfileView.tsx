// src/features/profile/view/ProfileView.tsx

import { IdentityForm } from '../components/IdentityForm';
import { AddressForm } from '../components/AddressForm';
import { RoleSwitcher } from '../components/RoleSwitcher';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { User, MapPin, ShieldAlert, Fingerprint, Activity, Globe } from "lucide-react";
import { useProfile } from '../hooks/useProfile';

export default function ProfileView() {
  const { profile, roles, isLoading, updateProfile, changeRole } = useProfile();

  if (isLoading && !profile) {
    return (
      <div className="p-4 md:p-10 space-y-8 animate-pulse">
        <div className="h-24 w-full bg-white/5 rounded-3xl" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 h-[500px] bg-white/5 rounded-[2.5rem]" />
          <div className="lg:col-span-4 h-[300px] bg-white/5 rounded-[2.5rem]" />
        </div>
      </div>
    );
  }

  return (
    /* Le container est scrollable par défaut sur mobile (h-auto) 
       et devient fixe avec scroll interne seulement sur grand écran (lg:h-...) */
    <div className="h-auto lg:h-[calc(100vh-110px)] flex flex-col gap-6 md:gap-8 animate-in fade-in slide-in-from-bottom-6 duration-700 lg:overflow-hidden p-1 md:p-4">
      
      {/* HEADER RESPONSIVE */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 shrink-0 px-2">
        <div className="flex items-center gap-4 md:gap-6">
          <div className="relative shrink-0">
            <div className="w-16 h-16 md:w-24 md:h-24 rounded-2xl md:rounded-[2rem] bg-white/5 border-2 border-primary/30 flex items-center justify-center overflow-hidden shadow-2xl">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <Fingerprint className="w-8 h-8 md:w-12 md:h-12 text-primary" />
              )}
            </div>
            <Activity className="absolute -bottom-1 -right-1 w-5 h-5 text-emerald-500 bg-[#050505] rounded-full border-2 border-emerald-500 p-0.5" />
          </div>

          <div>
            <h1 className="text-3xl md:text-5xl font-black uppercase italic text-glow-green tracking-tighter leading-none">
              Gestion <span className="text-primary">Profil</span>
            </h1>
            <p className="text-foreground/40 font-bold uppercase tracking-[0.2em] text-[9px] md:text-[10px] mt-2 truncate max-w-[200px] md:max-w-none">
              {profile?.email}
            </p>
          </div>
        </div>
        
        <div className="hidden sm:flex px-4 py-3 bg-white/5 border border-white/10 rounded-2xl items-center gap-3 backdrop-blur-md">
          <span className="text-[10px] font-black uppercase tracking-widest opacity-40 italic">System_Auth_Active</span>
        </div>
      </header>

      {/* GRILLE PRINCIPALE RESPONSIVE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 flex-1 min-h-0 overflow-y-auto lg:overflow-hidden pb-20 lg:pb-0">
        
        {/* COLONNE GAUCHE : FORMULAIRES */}
        <div className="lg:col-span-8 lg:overflow-y-auto lg:pr-4 scrollbar-hide space-y-6">
          <Tabs defaultValue="identity" className="w-full">
            <TabsList className="bg-glass-agri border border-white/5 p-1 h-14 rounded-xl md:rounded-2xl w-full sm:w-[350px] mb-6">
              <TabsTrigger value="identity" className="flex-1 rounded-lg md:rounded-xl data-[state=active]:bg-primary data-[state=active]:text-black font-black uppercase italic text-[9px] md:text-[10px] transition-all">
                Identité
              </TabsTrigger>
              <TabsTrigger value="location" className="flex-1 rounded-lg md:rounded-xl data-[state=active]:bg-primary data-[state=active]:text-black font-black uppercase italic text-[9px] md:text-[10px] transition-all">
                Adresse
              </TabsTrigger>
            </TabsList>

            <TabsContent value="identity" className="mt-0 outline-none animate-in fade-in slide-in-from-right-4 duration-300">
              <Card className="bg-glass-agri border-white/5 p-5 md:p-10 rounded-3xl md:rounded-[2.5rem] shadow-2xl">
                <IdentityForm profile={profile} onUpdate={updateProfile} loading={isLoading} />
              </Card>
            </TabsContent>

            <TabsContent value="location" className="mt-0 outline-none animate-in fade-in slide-in-from-right-4 duration-300">
              <Card className="bg-glass-agri border-white/5 p-5 md:p-10 rounded-3xl md:rounded-[2.5rem] shadow-2xl">
                <AddressForm profile={profile} onUpdate={updateProfile} loading={isLoading} />
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* COLONNE DROITE : RÔLE & SÉCURITÉ */}
        <div className="lg:col-span-4 lg:overflow-y-auto lg:pr-2 scrollbar-hide space-y-6 md:space-y-8">
          <Card className="bg-glass-agri border-white/5 p-6 md:p-8 rounded-3xl md:rounded-[2.5rem]">
            <RoleSwitcher 
              currentRoleId={profile?.role_id} 
              roles={roles} 
              onRoleChange={changeRole} 
              loading={isLoading} 
            />
          </Card>

          <Card className="bg-destructive/5 border border-destructive/10 p-6 md:p-8 rounded-3xl md:rounded-[2.5rem] border-l-4 border-l-destructive">
            <h3 className="text-destructive font-black uppercase italic text-[10px] tracking-widest mb-4 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" /> Zone Critique
            </h3>
            <p className="text-[10px] font-bold text-foreground/40 leading-relaxed uppercase mb-6">
              Actions irréversibles sur les accès du terminal.
            </p>
            <button className="w-full py-4 bg-destructive/10 border border-destructive/20 text-destructive text-[10px] font-black uppercase italic rounded-xl hover:bg-destructive hover:text-white transition-all">
              Réinitialiser
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
}