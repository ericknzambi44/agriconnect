import { IdentityForm } from '../components/IdentityForm';
import { AddressForm } from '../components/AddressForm';
import { RoleSwitcher } from '../components/RoleSwitcher';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { User, MapPin, ShieldAlert, Fingerprint, Activity, Settings, ShieldCheck } from "lucide-react";
import { useProfile } from '../hooks/useProfile';
import { cn } from "@/lib/utils";

export default function ProfileView() {
  const { profile, roles, isLoading, updateProfile, changeRole } = useProfile();

  if (isLoading && !profile) {
    return (
      <div className="p-6 md:p-10 space-y-10 animate-pulse bg-[#020202]">
        <div className="h-24 w-full bg-white/5 rounded-3xl" />
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="h-[400px] bg-white/5 rounded-3xl" />
          <div className="lg:col-span-3 h-[600px] bg-white/5 rounded-[3rem]" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen lg:h-[calc(100vh-80px)] flex flex-col gap-6 animate-in fade-in duration-1000 p-3 md:p-6 lg:overflow-hidden bg-[#020202]">
      
      {/* HEADER COMPACT STYLE TOP-BAR */}
      <header className="flex items-center justify-between px-4 py-4 bg-[#0A0A0A] border border-white/5 rounded-[2rem] shrink-0 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center overflow-hidden">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <Fingerprint className="w-6 h-6 text-emerald-500/50" />
            )}
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-display font-black uppercase italic tracking-tighter text-white">
              GESTION<span className="text-emerald-500">Profil</span>
            </h1>
            <p className="font-tech text-[8px] text-white/30 uppercase tracking-[0.3em]">{profile?.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end hidden md:flex">
             <span className="font-tech text-[9px] text-emerald-500 font-bold tracking-widest uppercase italic"></span>
             <span className="font-tech text-[7px] text-white/20 uppercase">Bunia</span>
          </div>
          <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
            <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
          </div>
        </div>
      </header>

      {/* MAIN LAYOUT AVEC SIDEBAR INTERNE */}
      <Tabs defaultValue="identity" className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
        
        {/* MINI SIDEBAR NAV (Verticale sur Desktop, Horizontale sur Mobile) */}
        <aside className="w-full lg:w-72 shrink-0 lg:h-full overflow-x-auto lg:overflow-y-auto no-scrollbar">
          <TabsList className="flex lg:flex-col h-auto w-max lg:w-full bg-[#0A0A0A] border border-white/5 p-2 rounded-[2rem] gap-2">
            
            <TabsTrigger value="identity" className="flex-1 lg:w-full justify-start gap-4 px-6 py-4 rounded-2xl data-[state=active]:bg-emerald-500 data-[state=active]:text-black text-white/40 font-display italic font-black uppercase text-[10px] tracking-widest transition-all duration-500">
              <User className="w-4 h-4 shrink-0" />
              <span className="hidden lg:inline">Identité</span>
            </TabsTrigger>

            <TabsTrigger value="location" className="flex-1 lg:w-full justify-start gap-4 px-6 py-4 rounded-2xl data-[state=active]:bg-emerald-500 data-[state=active]:text-black text-white/40 font-display italic font-black uppercase text-[10px] tracking-widest transition-all duration-500">
              <MapPin className="w-4 h-4 shrink-0" />
              <span className="hidden lg:inline">Localisation</span>
            </TabsTrigger>

            <TabsTrigger value="roles" className="flex-1 lg:w-full justify-start gap-4 px-6 py-4 rounded-2xl data-[state=active]:bg-emerald-500 data-[state=active]:text-black text-white/40 font-display italic font-black uppercase text-[10px] tracking-widest transition-all duration-500">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span className="hidden lg:inline">Privilèges</span>
            </TabsTrigger>

            <TabsTrigger value="danger" className="flex-1 lg:w-full justify-start gap-4 px-6 py-4 rounded-2xl data-[state=active]:bg-red-500 data-[state=active]:text-white text-red-500/40 font-display italic font-black uppercase text-[10px] tracking-widest transition-all duration-500">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span className="hidden lg:inline">Sécurité</span>
            </TabsTrigger>
          </TabsList>

          {/* PETIT WIDGET DE STATUT (Visible seulement sur Desktop) */}
          <div className="hidden lg:block mt-6 p-6 bg-[#0A0A0A] border border-white/5 rounded-[2rem] space-y-4">
            <p className="font-tech text-[8px] text-white/20 uppercase tracking-widest italic">_AgriConnect_Stats</p>
            <div className="flex justify-between items-end">
              <span className="font-tech text-[10px] text-white/40 uppercase">Réputation</span>
              <span className="font-display italic text-emerald-500 text-xl font-black">98%</span>
            </div>
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
               <div className="w-[98%] h-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
            </div>
          </div>
        </aside>

        {/* CONTENU PRINCIPAL (Scrolable individuellement) */}
        <main className="flex-1 lg:h-full lg:overflow-y-auto custom-scrollbar lg:pr-4">
          
          <TabsContent value="identity" className="mt-0 focus-visible:outline-none animate-in fade-in slide-in-from-right-4 duration-700">
            <Card className="bg-[#0A0A0A] border-white/5 p-6 md:p-12 rounded-[3rem] shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none">
                 <User className="w-32 h-32 text-white" />
               </div>
               <IdentityForm profile={profile} onUpdate={updateProfile} loading={isLoading} />
            </Card>
          </TabsContent>

          <TabsContent value="location" className="mt-0 focus-visible:outline-none animate-in fade-in slide-in-from-right-4 duration-700">
            <Card className="bg-[#0A0A0A] border-white/5 p-6 md:p-12 rounded-[3rem] shadow-2xl">
               <AddressForm profile={profile} onUpdate={updateProfile} loading={isLoading} />
            </Card>
          </TabsContent>

          <TabsContent value="roles" className="mt-0 focus-visible:outline-none animate-in fade-in slide-in-from-right-4 duration-700">
            <RoleSwitcher
              currentRoleId={profile?.role_id}
              roles={roles}
              onRoleChange={changeRole}
              loading={isLoading}
            />
          </TabsContent>

          <TabsContent value="danger" className="mt-0 focus-visible:outline-none animate-in fade-in slide-in-from-right-4 duration-700">
            <Card className="bg-red-500/[0.02] border border-red-500/10 p-8 rounded-[3rem] border-l-[6px] border-l-red-500 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-10 opacity-5">
                 <ShieldAlert className="w-24 h-24 text-red-500" />
               </div>
               <div className="max-w-md space-y-6 relative z-10">
                 <h3 className="text-red-500 font-display font-black uppercase italic text-2xl tracking-tighter">Zone de Rupture</h3>
                 <p className="font-tech text-xs text-white/40 leading-relaxed uppercase tracking-wider">
                   Toute action entreprise ici est irréversible. Cela inclut la suppression de vos nœuds logistiques et l'effacement de votre matrice d'identité.
                 </p>
                 <button className="px-8 py-5 bg-red-500 text-black font-display font-black uppercase italic text-xs tracking-[0.3em] rounded-2xl hover:bg-red-400 transition-all shadow-[0_15px_30px_rgba(239,68,68,0.2)]">
                   Initialiser la destruction
                 </button>
               </div>
            </Card>
          </TabsContent>

        </main>
      </Tabs>

      {/* FOOTER MOBILE (Seulement visible en bas du scroll sur petit écran) */}
      <footer className="lg:hidden text-center py-10 opacity-20">
        <p className="font-tech text-[8px] text-white uppercase tracking-[0.4em]"> Bunia_RDC</p>
      </footer>
    </div>
  );
}