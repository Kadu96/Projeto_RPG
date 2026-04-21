// Slot simples (Roupa, Armadura)
export default function SlotSimples({ label, valor }: { label: string; valor?: string }) {
  return (
    <div className="flex justify-between items-center border-b border-slate-800 pb-2">
      <span className="text-[10px] font-black text-slate-500 uppercase">{label}</span>
      <span className={valor ? "text-slate-200 font-medium" : "text-slate-700 italic text-sm"}>
        {valor || "Vazio"}
      </span>
    </div>
  );
}