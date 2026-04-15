import { CheckCircle2, Terminal } from "lucide-react";

export const LogSuccess = ({ title, message, qty }: { title: string, message: string, qty: string }) => (
  <div className="bg-[#0A0A0A] border-l-4 border-emerald-500 p-6 rounded-r-2xl shadow-2xl relative overflow-hidden group">
    <div className="absolute inset-0 bg-emerald-500/5 opacity-20 pointer-events-none" />
    <div className="flex items-start gap-4 relative z-10">
      <div className="p-2 bg-emerald-500/10 rounded-lg">
        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
      </div>
      <div className="space-y-1">
        <h4 className="font-tech text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500">
          {title} <span className="text-white/20">// SYNC_OK</span>
        </h4>
        <p className="font-tech text-xl font-black italic text-white tracking-tighter">
          {message}
        </p>
        <div className="flex gap-4 mt-2">
          <div className="px-2 py-1 bg-white/[0.03] border border-white/5 rounded-md">
            <span className="font-tech text-[8px] text-white/40">DÉDUCTION_FLUX: </span>
            <span className="font-tech text-[8px] text-emerald-500 font-bold">-{qty} UNITÉS</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);