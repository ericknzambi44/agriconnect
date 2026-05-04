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

  // Skeleton adaptatif haute fidélité
  if (isLoading && !profile) {
    return (
      <div className="p-4 md:p-10 space-y-6 md:space-y-8 animate-pulse bg-background min-h-screen">
        <div className="h-20 md:h-24 w-full bg-secondary border-2 border-border rounded-2xl md:rounded-3xl" />
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
          <div className="hidden lg:block h-[400px] bg-secondary border-2 border-border rounded-3xl" />
          <div className="lg:col-span-3 h-[500px] md:h-[600px] bg-secondary border-2 border-border rounded-[2rem] md:rounded-[3rem]" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen lg:h-[calc(100vh-40px)] flex flex-col gap-4 md:gap-6 animate-in fade-in duration-700 p-3 md:p-6 lg:overflow-hidden bg-background">
      
      {/* HEADER : TERMINAL D'IDENTITÉ RESPONSIVE */}
      <header className="flex items-center justify-between px-4 md:px-8 py-4 md:py-5 bg-secondary/80 backdrop-blur-md border-2 border-border rounded-[1.5rem] md:rounded-[2.5rem] shrink-0 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-primary/40" />
        
        <div className="flex items-center gap-3 md:gap-6 min-w-0">
          <div className="relative w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-background border-2 border-primary/20 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <Fingerprint className="w-6 h-6 md:w-8 md:h-8 text-primary/30" />
            )}
          </div>
          <div className="min-w-0">
            <h1 className="text-[clamp(1rem,4vw,1.5rem)] font-display font-black uppercase italic tracking-tighter text-foreground leading-none truncate">
              GESTION_<span className="text-primary">PROFIL</span>
            </h1>
            <p className="font-tech text-[7px] md:text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold mt-1 truncate opacity-60">
              {profile?.email}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-5">
          <div className="flex flex-col items-end hidden xs:flex">
             <span className="font-tech text-[8px] md:text-[10px] text-primary font-black tracking-widest uppercase italic leading-none">NODE_SYNC_OK</span>
             <span className="font-tech text-[7px] text-muted-foreground uppercase mt-1 opacity-50">BUNIA_ITURI</span>
          </div>
          <div className="p-3 md:p-4 bg-background border-2 border-primary/10 rounded-xl shadow-lg">
            <Activity className="w-4 h-4 md:w-5 md:h-5 text-primary animate-pulse" />
          </div>
        </div>
      </header>

      {/* MAIN CONTENT : TABS ARCHITECTURE */}
      <Tabs defaultValue="identity" className="flex-1 flex flex-col lg:flex-row gap-4 md:gap-6 min-h-0">
        
        {/* SIDEBAR NAVIGATION : Transformation en barre horizontale sur Mobile */}
        <aside className="w-full lg:w-72 shrink-0 lg:h-full flex flex-col gap-4">
          <TabsList className="grid grid-cols-4 lg:flex lg:flex-col h-auto w-full bg-secondary/50 border-2 border-border p-2 md:p-3 rounded-[1.2rem] md:rounded-[2rem] gap-2 shadow-xl">
            
            {[
              { val: "identity", icon: User, label: "IDENTITÉ" },
              { val: "location", icon: MapPin, label: "POSITION" },
              { val: "roles", icon: ShieldCheck, label: "ROLE" },
              { val: "danger", icon: Lock, label: "SÉCURITÉ" }
            ].map((tab) => (
              <TabsTrigger 
                key={tab.val}
                value={tab.val} 
                className={cn(
                  "flex flex-col lg:flex-row items-center justify-center lg:justify-start gap-2 md:gap-4 px-2 py-3 md:px-6 md:py-5 rounded-xl transition-all duration-300",
                  "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground",
                  tab.val === "danger" && "data-[state=active]:bg-error data-[state=active]:text-white"
                )}
              >
                <tab.icon className="w-4 h-4 md:w-5 md:h-5 shrink-0" />
                <span className="text-[7px] md:text-[10px] lg:text-[11px] font-display italic font-black uppercase tracking-wider lg:tracking-widest">
                  {/* Sur Desktop texte complet, sur Mobile texte court */}
                  <span className="hidden lg:inline">{tab.val === 'identity' ? 'IDENTITÉ_BIO' : tab.label}</span>
                  <span className="lg:hidden">{tab.label.substring(0, 3)}</span>
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* WIDGET SCORE : Masqué sur Mobile pour laisser de la place au contenu */}
          <div className="hidden lg:block p-8 bg-secondary/30 border-2 border-border rounded-[2rem] space-y-6 shadow-inner border-t-primary/10">
            <div className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 bg-primary rounded-full animate-ping" />
               <p className="font-tech text-[9px] text-muted-foreground uppercase tracking-widest font-black italic">_Score_Reputation</p>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="font-tech text-[10px] text-muted-foreground uppercase font-bold">TRUST_SCORE</span>
                <span className="font-display italic text-primary text-2xl font-black">98%</span>
              </div>
              <div className="w-full h-1.5 bg-background rounded-full overflow-hidden">
                 <div className="w-[98%] h-full bg-primary shadow-glow-primary" />
              </div>
            </div>
          </div>
        </aside>

        {/* ZONE DE TRAVAIL : Défilement fluide */}
        <main className="flex-1 lg:h-full lg:overflow-y-auto custom-scrollbar lg:pr-2 pb-20 lg:pb-0">
          
          <TabsContent value="identity" className="mt-0 focus-visible:outline-none animate-in fade-in slide-in-from-bottom-4 lg:slide-in-from-right-8 duration-500">
            <Card className="bg-secondary/40 border-2 border-border p-5 md:p-10 lg:p-14 rounded-[1.5rem] md:rounded-[3rem] shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none hidden md:block">
                 <User size={200} className="text-primary" />
               </div>
               <IdentityForm profile={profile} onUpdate={updateProfile} loading={isLoading} />
            </Card>
          </TabsContent>

          <TabsContent value="location" className="mt-0 focus-visible:outline-none animate-in fade-in slide-in-from-bottom-4 lg:slide-in-from-right-8 duration-500">
            <Card className="bg-secondary/40 border-2 border-border p-5 md:p-10 lg:p-14 rounded-[1.5rem] md:rounded-[3rem] shadow-2xl">
               <AddressForm profile={profile} onUpdate={updateProfile} loading={isLoading} />
            </Card>
          </TabsContent>

          {/* <TabsContent value="roles" className="mt-0 focus-visible:outline-none animate-in fade-in slide-in-from-bottom-4 lg:slide-in-from-right-8 duration-500">
            <RoleSwitcher
              currentRoleId={profile?.role_id}
              roles={roles}
              onRoleChange={changeRole}
              loading={isLoading}
            />
          </TabsContent> */}

          <TabsContent value="danger" className="mt-0 focus-visible:outline-none animate-in fade-in slide-in-from-bottom-4 lg:slide-in-from-right-8 duration-500">
            <Card className="bg-error/5 border-2 border-error p-6 md:p-12 rounded-[1.5rem] md:rounded-[3rem] border-l-[8px] md:border-l-[16px] relative overflow-hidden shadow-2xl">
               <div className="absolute top-0 right-0 p-12 opacity-5 md:opacity-10">
                 <ShieldAlert className="w-24 h-24 md:w-32 md:h-32 text-error" />
               </div>
               <div className="max-w-xl space-y-6 md:space-y-8 relative z-10">
                 <h3 className="text-error font-display font-black uppercase italic text-xl md:text-3xl tracking-tighter">PROTOCOLE_RUPTURE</h3>
                 <p className="font-tech text-[9px] md:text-[11px] text-foreground/70 leading-relaxed uppercase tracking-[0.1em] font-bold italic">
                   ATTENTION : Cette action supprimera vos <span className="text-error underline">SMART_CONTRACTS</span> et vos accès au Hub de Bunia. Aucune récupération possible.
                 </p>
                 <button className="w-full sm:w-auto px-8 md:px-12 py-5 md:py-6 bg-error text-white font-display font-black uppercase italic text-[10px] md:text-sm tracking-[0.3em] rounded-xl md:rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-glow-error">
                    DÉTRUIRE_LA_MATRICE
                 </button>
               </div>
            </Card>
          </TabsContent>

        </main>
      </Tabs>

      {/* FOOTER SYSTÈME : Compact */}
      <footer className="text-center py-4 opacity-30 shrink-0">
        <p className="font-tech text-[7px] md:text-[9px] text-muted-foreground uppercase tracking-[0.4em] font-black"> 
           AgriConnect_Secure // version 1.0.0
        </p>
      </footer>
    </div>
  );
}