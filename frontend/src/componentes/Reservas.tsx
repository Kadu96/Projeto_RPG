interface Recurso {
  atual?: number;
  maximo?: number;
}

interface ReservasProps {
  dados?: {
    vida?: Recurso;
    mana?: Recurso;
    vigor?: Recurso;
  };
  onUpdate: (tipo: 'vida' | 'mana' | 'vigor', valor: number) => void;
}

// ADICIONE o onUpdate aqui no recebimento das props
export default function Reservas({ dados, onUpdate }: ReservasProps) {
  if (!dados) return null;

  // Criamos uma lista para facilitar o mapeamento dos componentes na tela
  const recursos = [
    { label: "Vida", valor: dados.vida, cor: "bg-red-600", chave: 'vida' as const },
    { label: "Mana", valor: dados.mana, cor: "bg-sky-600", chave: 'mana' as const },
    { label: "Vigor", valor: dados.vigor, cor: "bg-amber-500", chave: 'vigor' as const },
  ];

  return (
    <div className="space-y-6">
      {recursos.map((res) => {
        const porcentagem = res.valor?.maximo 
          ? (res.valor.atual! / res.valor.maximo!) * 100 
          : 0;

        return (
          <div key={res.chave} className="flex items-center gap-3">
            {/* BOTÃO DE DIMINUIR */}
            <button 
              onClick={() => onUpdate(res.chave, -1)}
              className="w-7 h-7 flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-md border border-slate-700 transition-colors"
            >
              -
            </button>

            {/* BARRA DE PROGRESSO */}
            <div className="flex-1 space-y-1">
              <div className="flex justify-between px-1">
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-tighter">
                  {res.label}
                </span>
                <span className="text-xs font-bold text-white">
                  {res.valor?.atual ?? 0} / {res.valor?.maximo ?? 0}
                </span>
              </div>
              <div className="h-2.5 w-full bg-slate-950 rounded-full border border-slate-800 overflow-hidden">
                <div 
                  className={`h-full ${res.cor} transition-all duration-500`}
                  style={{ width: `${Math.min(porcentagem, 100)}%` }}
                />
              </div>
            </div>

            {/* BOTÃO DE AUMENTAR */}
            <button 
              onClick={() => onUpdate(res.chave, 1)}
              className="w-7 h-7 flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-md border border-slate-700 transition-colors"
            >
              +
            </button>
          </div>
        );
      })}
    </div>
  );
}