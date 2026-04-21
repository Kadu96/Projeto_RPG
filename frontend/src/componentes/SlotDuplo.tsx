// Slot duplo (Cintura, Costas, Peitoral)
export default function SlotDuplo({ label, s1, s2 }: { label: string; s1?: string; s2?: string }) {
  return (
    <div className="space-y-1">
      <span className="text-[10px] font-black text-violet-500 uppercase tracking-widest">{label}</span>
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-slate-950/50 p-2 rounded border border-slate-800 text-center text-xs">
          {s1 ? <span className="text-slate-200">{s1}</span> : <span className="text-slate-800">---</span>}
        </div>
        <div className="bg-slate-950/50 p-2 rounded border border-slate-800 text-center text-xs">
          {s2 ? <span className="text-slate-200">{s2}</span> : <span className="text-slate-800">---</span>}
        </div>
      </div>
    </div>
  );
}