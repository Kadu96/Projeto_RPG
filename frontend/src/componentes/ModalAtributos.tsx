import React, { useState } from 'react';

export interface AtributosData {
  forca?: number;
  destreza?: number;
  constituicao?: number;
  inteligencia?: number;
  sabedoria?: number;
  carisma?: number;
}

interface ModalAtributosProps {
  isOpen: boolean;
  onClose: () => void;
  atributos: AtributosData;
  xp: number;
  merito: number;
  onUpdateAtributo: (nome: keyof AtributosData, delta: number, recurso: 'xp' | 'merito') => void;
}

interface ModalAtributosInicialProps {
  isOpen: boolean;
  onClose: () => void;
  atributos: AtributosData;
  pontos: number;
  onUpdateAtributo: (nome: keyof AtributosData, delta: number, recurso: 'pontos') => void;
}

export default function ModalAtributos({
  isOpen,
  onClose,
  atributos,
  xp,
  merito,
  onUpdateAtributo,
}: ModalAtributosProps) {
  const [recurso, setRecurso] = useState<'xp' | 'merito'>('xp');

  if (!isOpen) return null;

  const listaAtributos: { key: keyof AtributosData; label: string }[] = [
    { key: 'forca', label: 'Força' },
    { key: 'destreza', label: 'Destreza' },
    { key: 'constituicao', label: 'Constituição' },
    { key: 'inteligencia', label: 'Inteligência' },
    { key: 'sabedoria', label: 'Sabedoria' },
    { key: 'carisma', label: 'Carisma' },
  ];

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      {/* Overlay customizado com z-index maior */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[-1]" onClick={onClose} />

      {/* Modal Content */}
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md p-8 rounded-2xl shadow-2xl relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black uppercase tracking-tighter text-white">
            <span className="text-violet-400">Atributos</span>
          </h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            ✕
          </button>
        </div>

        {/* Seleção de Recurso */}
        <div className="flex bg-slate-950 p-1 rounded-lg mb-8 border border-slate-800">
          <button
            onClick={() => setRecurso('xp')}
            className={`flex-1 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${
              recurso === 'xp' ? 'bg-violet-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Exp: <span className={recurso === 'xp' ? 'text-violet-200' : ''}>{xp}</span>
          </button>
          <button
            onClick={() => setRecurso('merito')}
            className={`flex-1 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${
              recurso === 'merito' ? 'bg-amber-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Méritos: <span className={recurso === 'merito' ? 'text-amber-200' : ''}>{merito}</span>
          </button>
        </div>

        {/* Lista de Atributos */}
        <div className="space-y-3">
          {listaAtributos.map((attr) => (
            <div key={attr.key} className="flex items-center justify-between bg-slate-950/40 p-3 rounded-xl border border-slate-800/50 hover:border-violet-500/30 transition-colors">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                {attr.label}
              </span>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => onUpdateAtributo(attr.key, -1, recurso)}
                  className="w-8 h-8 flex items-center justify-center bg-slate-800 hover:bg-red-900/40 text-slate-400 hover:text-red-400 rounded-lg border border-slate-700 transition-all font-black"
                >
                  -
                </button>
                <span className="text-xl font-black text-white w-6 text-center">
                  {atributos[attr.key] || 0}
                </span>
                <button
                  onClick={() => onUpdateAtributo(attr.key, 1, recurso)}
                  className="w-8 h-8 flex items-center justify-center bg-slate-800 hover:bg-green-900/40 text-slate-400 hover:text-green-400 rounded-lg border border-slate-700 transition-all font-black"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        <button onClick={onClose} className="w-full mt-8 py-4 bg-violet-600 hover:bg-violet-500 text-white font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-violet-900/20 active:scale-95">
          Finalizar Treino
        </button>
      </div>
    </div>
  );
}

export function ModalAtributosInicial({
  isOpen,
  onClose,
  atributos,
  pontos,
  onUpdateAtributo,
}: ModalAtributosInicialProps) {
  if (!isOpen) return null;

  const listaAtributos: { key: keyof AtributosData; label: string }[] = [
    { key: 'forca', label: 'Força' },
    { key: 'destreza', label: 'Destreza' },
    { key: 'constituicao', label: 'Constituição' },
    { key: 'inteligencia', label: 'Inteligência' },
    { key: 'sabedoria', label: 'Sabedoria' },
    { key: 'carisma', label: 'Carisma' },
  ];

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      {/* Overlay customizado com z-index maior */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[-1]" onClick={onClose} />

      {/* Modal Content */}
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md p-8 rounded-2xl shadow-2xl relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black uppercase tracking-tighter text-white">
            <span className="text-violet-400">Atributos</span>
          </h2>
          <div className="bg-violet-600/20 px-3 py-1 rounded-full border border-violet-500/30">
            <span className="text-violet-400 text-xs font-black uppercase tracking-widest">Pontos: {pontos}</span>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            ✕
          </button>
        </div>

        {/* Lista de Atributos */}
        <div className="space-y-3">
          {listaAtributos.map((attr) => (
            <div key={attr.key} className="flex items-center justify-between bg-slate-950/40 p-3 rounded-xl border border-slate-800/50 hover:border-violet-500/30 transition-colors">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                {attr.label}
              </span>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => onUpdateAtributo(attr.key, -1, 'pontos')}
                  className="w-8 h-8 flex items-center justify-center bg-slate-800 hover:bg-red-900/40 text-slate-400 hover:text-red-400 rounded-lg border border-slate-700 transition-all font-black"
                >
                  -
                </button>
                <span className="text-xl font-black text-white w-6 text-center">
                  {atributos[attr.key] || 0}
                </span>
                <button
                  onClick={() => onUpdateAtributo(attr.key, 1, 'pontos')}
                  className="w-8 h-8 flex items-center justify-center bg-slate-800 hover:bg-green-900/40 text-slate-400 hover:text-green-400 rounded-lg border border-slate-700 transition-all font-black"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        <button onClick={onClose} className="w-full mt-8 py-4 bg-violet-600 hover:bg-violet-500 text-white font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-violet-900/20 active:scale-95">
          Finalizar
        </button>
      </div>
    </div>
  );
}
