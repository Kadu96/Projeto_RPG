import React from 'react';
import Flag from './Flags';

interface Titulo {
  nome: string;
  identificador: number;
  principal: boolean;
  ativo: boolean;
}

interface ModalTitulosProps {
  isOpen: boolean;
  onClose: () => void;
  titulos: Titulo[];
  maxEnabled: number;
  onToggle: (titleID: number, label: 'ativo' | 'principal', valor: boolean) => void;
}

export default function ModalTitulos({
  isOpen,
  onClose,
  titulos,
  maxEnabled,
  onToggle,
}: ModalTitulosProps) {
  if (!isOpen) return null;

  const limiteAtingido = titulos.filter((item) => item.ativo).length >= maxEnabled;
  const limitePrincipal = titulos.filter((item) => item.principal).length >= 1;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <h2 className="text-xl font-black uppercase tracking-tight text-white">
            Gerenciar <span className="text-violet-400">Títulos</span>
          </h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            ✕
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4">
          {titulos.length === 0 ? (
            <p className="text-slate-500 italic text-center">Nenhum titulo vinculado.</p>
          ) : (
            titulos.map((item) => (
              <div
                key={item.nome}
                className={`p-4 rounded-xl border transition-all flex items-center justify-between gap-4 ${
                  item.ativo
                    ? 'bg-violet-600/10 border-violet-500/50'
                    : 'bg-slate-950 border-slate-800'
                }`}
              >
                <div className="flex-1">
                  <h3
                    className={`font-bold uppercase text-xs tracking-widest ${item.ativo ? 'text-violet-400' : 'text-slate-400'}`}
                  >
                    {item.nome}
                  </h3>
                </div>
                <button 
                  onClick={() => onToggle(item.identificador, 'principal', !item.principal)}
                  disabled={(limitePrincipal && !item.principal)}
                  className={`${(limitePrincipal && !item.principal) ? 'opacity-50 cursor-not-allowed' : ''} px-3 py-1.5 rounded-md text-[10px] font-black uppercase transition-all`}
                >
                  {item.principal 
                    ? <Flag variant='success'>{'Principal'}</Flag> 
                    : <Flag variant='info'>{'Secundário'} </Flag>
                  }
                </button>
                <button
                  onClick={() => onToggle(item.identificador, 'ativo', !item.ativo)}
                  disabled={limiteAtingido && !item.ativo}
                  className={`${limiteAtingido && !item.ativo ? 'opacity-50 cursor-not-allowed' : ''} px-3 py-1.5 rounded-md text-[10px] font-black uppercase transition-all ${
                    item.ativo
                      ? 'bg-violet-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {item.ativo ? 'Ativo' : 'Habilitar'}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
