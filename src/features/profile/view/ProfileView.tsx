import { IdentityForm } from '../components/IdentityForm';
import { AddressForm } from '../components/AddressForm';
//import { RoleSwitcher } from '../components/RoleSwitcher';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { User, MapPin, ShieldAlert, Fingerprint, Activity, ShieldCheck, Lock } from "lucide-react";
import { useProfile } from '../hooks/useProfile';
import { cn } from "@/lib/utils";

export default function ProfileView() {
  const { profile, roles, isLoading, updateProfile, changeRole } = useProfile();

  // Skeleton adaptatif
  if (isLoading && !profile) {
    return (
      <div className="p-4 md:p-10 space-y-6 md:space-y-8 animate-pulse bg-gradient-to-br from-[#0a0a0a] via-[#050505] to-black min-h-screen">
        <div className="h-20 md:h-24 w-full bg-white/[0.02] border border-white/10 rounded-2xl md:rounded-3xl" />
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
          <div className="hidden lg:block h-[400px] bg-white/[0.02] border border-white/10 rounded-3xl" />
          <div className="lg:col-span-3 h-[500px] md:h-[600px] bg-white/[0.02] border border-white/10 rounded-[2rem] md:rounded-[3rem]" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen lg:h-[calc(100vh-40px)] flex flex-col gap-4 md:gap-6 animate-in fade-in duration-700 p-3 md:p-6 lg:overflow-hidden bg-gradient-to-br from-[#0a0a0a] via-[#050505] to-black">
      
      {/* HEADER : TERMINAL D'IDENTITÉ AVEC DÉGRADÉ */}
      <header className="flex items-center justify-between px-4 md:px-8 py-4 md:py-5 bg-black/40 backdrop-blur-md border border-white/10 rounded-[1.5rem] md:rounded-[2.5rem] shrink-0 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-primary to-orange-400" />
        
        <div className="flex items-center gap-3 md:gap-6 min-w-0">
          <div className="relative w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-black/50 border border-primary/30 flex items-center justify-center overflow-hidden shrink-0 shadow-md">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <Fingerprint className="w-6 h-6 md:w-8 md:h-8 text-primary/50" />
            )}
          </div>
          <div className="min-w-0">
            <h1 className="text-[clamp(1rem,4vw,1.5rem)] font-display font-black uppercase italic tracking-tighter text-white leading-none truncate">
              GESTION <span className="text-primary">PROFIL</span>
            </h1>
            <p className="font-tech text-[7px] md:text-[10px] text-white/50 uppercase tracking-[0.2em] font-bold mt-1 truncate">
              {profile?.email}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-5">
          <div className="flex flex-col items-end hidden xs:flex">
            <span className="font-tech text-[8px] md:text-[10px] text-primary font-black tracking-widest uppercase italic leading-none">NŒUD SYNC OK</span>
            <span className="font-tech text-[7px] text-white/40 uppercase mt-1">BUNIA ITURI</span>
          </div>
          <div className="p-3 md:p-4 bg-black/50 border border-primary/20 rounded-xl shadow-lg">
            <Activity className="w-4 h-4 md:w-5 md:h-5 text-primary animate-pulse" />
          </div>
        </div>
      </header>

      {/* TABS ARCHITECTURE */}
      <Tabs defaultValue="identity" className="flex-1 flex flex-col lg:flex-row gap-4 md:gap-6 min-h-0">
        
        {/* SIDEBAR NAVIGATION (transformée en barre horizontale sur mobile) */}
        <aside className="w-full lg:w-72 shrink-0 lg:h-full flex flex-col gap-4">
          <TabsList className="grid grid-cols-4 lg:flex lg:flex-col h-auto w-full bg-black/40 backdrop-blur-sm border border-white/10 p-2 md:p-3 rounded-[1.2rem] md:rounded-[2rem] gap-2 shadow-xl">
            
            {[
              { val: "identity", icon: User, label: "IDENTITÉ" },
              { val: "location", icon: MapPin, label: "POSITION" },
              { val: "roles", icon: ShieldCheck, label: "RÔLE" },
              { val: "danger", icon: Lock, label: "SÉCURITÉ" }
            ].map((tab) => (
              <TabsTrigger 
                key={tab.val}
                value={tab.val} 
                className={cn(
                  "flex flex-col lg:flex-row items-center justify-center lg:justify-start gap-2 md:gap-4 px-2 py-3 md:px-6 md:py-5 rounded-xl transition-all duration-300",
                  "data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/20 data-[state=active]:to-transparent data-[state=active]:border-l-4 data-[state=active]:border-primary data-[state=active]:text-primary text-white/50",
                  tab.val === "danger" && "data-[state=active]:bg-red-500/20 data-[state=active]:border-red-500 data-[state=active]:text-red-400"
                )}
              >
                <tab.icon className="w-4 h-4 md:w-5 md:h-5 shrink-0" />
                <span className="text-[7px] md:text-[10px] lg:text-[11px] font-display italic font-black uppercase tracking-wider lg:tracking-widest">
                  <span className="hidden lg:inline">{tab.val === 'identity' ? 'IDENTITÉ' : tab.label}</span>
                  <span className="lg:hidden">{tab.label.substring(0, 3)}</span>
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* WIDGET SCORE (caché sur mobile) */}
          <div className="hidden lg:block p-6 bg-black/30 border border-white/10 rounded-[2rem] space-y-4 shadow-inner">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full animate-ping" />
              <p className="font-tech text-[8px] text-white/50 uppercase tracking-widest font-black italic">Score de réputation</p>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <span className="font-tech text-[9px] text-white/40 uppercase font-bold">INDICE DE CONFIANCE</span>
                <span className="font-display italic text-primary text-2xl font-black">98%</span>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="w-[98%] h-full bg-gradient-to-r from-primary to-orange-400 shadow-[0_0_6px_rgba(var(--primary),0.6)]" />
              </div>
            </div>
          </div>
        </aside>

        {/* ZONE DE CONTENU PRINCIPAL */}
        <main className="flex-1 lg:h-full lg:overflow-y-auto custom-scrollbar lg:pr-2 pb-20 lg:pb-0">
          
          <TabsContent value="identity" className="mt-0 focus-visible:outline-none animate-in fade-in slide-in-from-bottom-4 lg:slide-in-from-right-8 duration-500">
            <Card className="bg-black/30 backdrop-blur-sm border border-white/10 p-5 md:p-10 lg:p-14 rounded-[1.5rem] md:rounded-[3rem] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none hidden md:block">
                <User size={200} className="text-primary" />
              </div>
              <IdentityForm profile={profile} onUpdate={updateProfile} loading={isLoading} />
            </Card>
          </TabsContent>

          <TabsContent value="location" className="mt-0 focus-visible:outline-none animate-in fade-in slide-in-from-bottom-4 lg:slide-in-from-right-8 duration-500">
            <Card className="bg-black/30 backdrop-blur-sm border border-white/10 p-5 md:p-10 lg:p-14 rounded-[1.5rem] md:rounded-[3rem] shadow-2xl">
              <AddressForm profile={profile} onUpdate={updateProfile} loading={isLoading} />
            </Card>
          </TabsContent>

          {/* TABS ROLE (commenté dans l'original) */}
          {/* <TabsContent value="roles" className="mt-0 ...">
            <RoleSwitcher ... />
          </TabsContent> */}

          <TabsContent value="danger" className="mt-0 focus-visible:outline-none animate-in fade-in slide-in-from-bottom-4 lg:slide-in-from-right-8 duration-500">
            <Card className="bg-red-500/5 border border-red-500/30 p-6 md:p-12 rounded-[1.5rem] md:rounded-[3rem] border-l-[6px] md:border-l-[12px] border-l-red-500 relative overflow-hidden shadow-2xl backdrop-blur-sm">
              <div className="absolute top-0 right-0 p-12 opacity-5 md:opacity-10 pointer-events-none">
                <ShieldAlert className="w-24 h-24 md:w-32 md:h-32 text-red-500" />
              </div>
              {/* <div className="max-w-xl space-y-6 md:space-y-8 relative z-10">
                <h3 className="text-red-400 font-display font-black uppercase italic text-xl md:text-3xl tracking-tighter">Protocole de rupture</h3>
                <p className="font-tech text-[9px] md:text-[11px] text-white/70 leading-relaxed uppercase tracking-[0.1em] font-bold italic">
                  ATTENTION : Cette action supprimera vos <span className="text-red-400 underline">contrats intelligents</span> et vos accès au Hub de Bunia. Aucune récupération possible.
                </p>
                <button className="w-full sm:w-auto px-8 md:px-12 py-5 md:py-6 bg-gradient-to-r from-red-600 to-red-800 text-white font-display font-black uppercase italic text-[10px] md:text-sm tracking-[0.3em] rounded-xl md:rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-red-500/30">
                  DÉTRUIRE LA MATRICE
                </button>
              </div> */}
            </Card>
          </TabsContent>

        </main>
      </Tabs>

      {/* FOOTER SYSTÈME */}
      <footer className="text-center py-4 opacity-30 shrink-0">
        <p className="font-tech text-[7px] md:text-[9px] text-white/40 uppercase tracking-[0.4em] font-black"> 
          AgriConnect Secure // version 1.0.0
        </p>
      </footer>
    </div>
  );
}