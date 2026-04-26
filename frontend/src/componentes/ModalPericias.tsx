export interface PericiasData {
  acrobacia: number,
  adestramento: number,
  arcanismo: number,
  atletismo: number,
  atuacao: number,
  enganacao: number,
  furtividade: number,
  historia: number,
  intimidacao: number,
  intuicao: number,
  investigacao: number,
  medicina: number,
  natureza: number,
  percepcao: number,
  persuasao: number,
  presdigitacao: number,
  religiao: number,
  sobrevivencia: number,
}

interface ModalPericiasInicialProps {
  isOpen: boolean;
  onClose: () => void;
  pericias: PericiasData;
  pontos: number;
  onUpdateAtributo: (nome: keyof PericiasData, delta: number, recurso: 'pontos') => void;
}

export default function ModalPericiasInicial({
  isOpen,
  onClose,
  pericias,
  pontos,
  onUpdateAtributo,
}: ModalPericiasInicialProps) {
  if (!isOpen) return null;

  const listaPericias: { key: keyof PericiasData; label:  string }[] = [
      { key: 'acrobacia'     , label: 'Acrobacia'    },  
      { key: 'adestramento'  , label: 'Adestramento' },  
      { key: 'arcanismo'     , label: 'Arcanismo'    },  
      { key: 'atletismo'     , label: 'Atletismo'    },  
      { key: 'atuacao'       , label: 'Atuacao'      },  
      { key: 'enganacao'     , label: 'Enganacao'    },  
      { key: 'furtividade'   , label: 'Furtividade'  },  
      { key: 'historia'      , label: 'Historia'     },  
      { key: 'intimidacao'   , label: 'Intimidacao'  },  
      { key: 'intuicao'      , label: 'Intuicao'     },  
      { key: 'investigacao'  , label: 'Investigacao' },  
      { key: 'medicina'      , label: 'Medicina'     },  
      { key: 'natureza'      , label: 'Natureza'     },  
      { key: 'percepcao'     , label: 'Percepcao'    },  
      { key: 'persuasao'     , label: 'Persuasao'    },  
      { key: 'presdigitacao' , label: 'Presdigitacao'},  
      { key: 'religiao'      , label: 'Religiao'     },  
      { key: 'sobrevivencia' , label: 'Sobrevivencia'},  
    ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <h2 className="text-xl font-black uppercase tracking-tight text-white">
            Escolher <span className="text-violet-400">Perícias</span>
          </h2>
          <div className="bg-violet-600/20 px-3 py-1 rounded-full border border-violet-500/30">
            <span className="text-violet-400 text-xs font-black uppercase tracking-widest">Fragmentos Restantes: {pontos}</span>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            ✕
          </button>
        </div>

        {/* Lista de Pericias */}
        <div className="space-y-3">
          {listaPericias.map((p) => (
            <div key={p.key} className="flex items-center justify-between bg-slate-950/40 p-3 rounded-xl border border-slate-800/50 hover:border-violet-500/30 transition-colors">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                {p.label}
              </span>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => onUpdateAtributo(p.key, -1, 'pontos')}
                  className="w-8 h-8 flex items-center justify-center bg-slate-800 hover:bg-red-900/40 text-slate-400 hover:text-red-400 rounded-lg border border-slate-700 transition-all font-black"
                >
                  -
                </button>
                <span className="text-xl font-black text-white w-6 text-center">
                  {pericias[p.key] || 0}
                </span>
                <button
                  onClick={() => onUpdateAtributo(p.key, 1, 'pontos')}
                  className="w-8 h-8 flex items-center justify-center bg-slate-800 hover:bg-green-900/40 text-slate-400 hover:text-green-400 rounded-lg border border-slate-700 transition-all font-black"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
