import React, { useState } from 'react';
import { useExpeditions } from '../hooks/useExpeditions';
import { useEscrowVoucher } from '../hooks/useEscrowVoucher';
import { MissionCard } from '../components/MissionCard';
import { LogSuccess } from '../components/LogSuccess';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ValidationPanel } from '../components/ValidationPanel';
import { Loader2, Radio } from "lucide-react";

export default function TransportControlCenter() {
  const { missions, loading, refresh } = useExpeditions();
  const { validerDepotVendeur, validerLivraisonFinale, processing } = useEscrowVoucher();
  
  const [activeMission, setActiveMission] = useState<any>(null);
  const [inputCode, setInputCode] = useState("");
  const [successInfo, setSuccessInfo] = useState<any>(null);

  const handleValidation = async () => {
    const isDepot = activeMission.statut === 'EN_ATTENTE_DEPOT';
    let success = false;

    if (isDepot) {
      success = await validerDepotVendeur(activeMission.id, inputCode);
    } else {
      success = await validerLivraisonFinale(activeMission.id, inputCode);
    }

    if (success) {
      setSuccessInfo({
        title: isDepot ? "DÉPÔT_VALIDÉ" : "LIVRAISON_VALIDÉE",
        msg: `MISSION_${activeMission.id.split('-')[0]}`,
        qty: activeMission.quantite_transportee
      });
      setActiveMission(null);
      setInputCode("");
      refresh();
      setTimeout(() => setSuccessInfo(null), 5000);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto p-4 sm:p-10 space-y-12">
      
      {/* HEADER DYNAMIQUE */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-emerald-500">
            <Radio className="w-4 h-4 animate-pulse" />
            <span className="font-tech text-[10px] uppercase tracking-[0.5em] font-bold">Node_Active</span>
          </div>
          <h1 className="text-5xl sm:text-7xl font-display italic text-white font-black uppercase tracking-tighter leading-none">
            Flux_<span className="text-emerald-500">Logistique</span>
          </h1>
        </div>
      </header>

      {/* FEEDBACK RÉUSSITE */}
      {successInfo && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-500">
           <LogSuccess title={successInfo.title} message={successInfo.msg} qty={successInfo.qty} />
        </div>
      )}

      {/* GRILLE DÉDIÉE */}
      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center border border-white/5 rounded-[3rem] bg-white/[0.01]">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-4" />
          <p className="font-tech text-[10px] text-white/20 uppercase tracking-[0.4em]">Lecture_Base_Données...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {missions.map(m => (
            <MissionCard key={m.id} mission={m} onAction={setActiveMission} />
          ))}
        </div>
      )}

      {/* DIALOG DE SÉCURITÉ */}
      <Dialog open={!!activeMission} onOpenChange={() => !processing && setActiveMission(null)}>
        <DialogContent className="max-w-4xl bg-[#050505] border-white/10 p-4 sm:p-10 rounded-[3rem] outline-none">
          <ValidationPanel 
            mission={activeMission}
            code={inputCode}
            setCode={setInputCode}
            onConfirm={handleValidation}
            loading={processing}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}