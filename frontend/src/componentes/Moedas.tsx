interface MoedasProps {
  dados?: {
    ouro?: number;
    prata?: number;
    cobre?: number;
  };
  onUpdate: (tipo: 'ouro' | 'prata' | 'cobre', valor: number) => void;
}

export default function Moedas({ dados, onUpdate }: MoedasProps) {
  const moedas = [
    { label: "Ouro", valor: dados?.ouro ?? 0, cor: "text-amber-500", chave: "ouro" as const },
    { label: "Prata", valor: dados?.prata ?? 0, cor: "text-slate-400", chave: "prata" as const },
    { label: "Cobre", valor: dados?.cobre ?? 0, cor: "text-orange-700", chave: "cobre" as const },
  ];

  return (
    <div className="grid grid-cols-3 gap-4 w-full py-4">
      {moedas.map((m) => (
        <div key={m.chave} className="flex flex-col items-center gap-1">
          <span className={`text-[10px] font-black uppercase tracking-widest ${m.cor}`}>
            {m.label}
          </span>
          <input
            type="number"
            value={m.valor} 
            onChange={(e) => onUpdate(m.chave, parseInt(e.target.value) || 0)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 text-center font-bold text-white focus:border-violet-500 focus:outline-none transition-colors"
          />
        </div>
      ))}
    </div>
  );
}