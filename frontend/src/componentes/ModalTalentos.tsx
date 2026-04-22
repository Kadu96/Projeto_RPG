import React from 'react';

interface Feat {
  feat_id: number;
  feat_name: string;
  feat_description: string;
}

interface AssFeat {
  is_enabled: boolean;
  talento: Feat;
}

interface ModalTalentosProps {
  isOpen: boolean;
  onClose: () => void;
  talentos: AssFeat[];
  onToggle: (featId: number, enabled: boolean) => void;
}

export default function ModalTalentos({ isOpen, onClose, talentos, onToggle }: ModalTalentosProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <h2 className="text-xl font-black uppercase tracking-tight text-white">
            Gerenciar <span className="text-violet-400">Talentos</span>
          </h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">✕</button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4">
          {talentos.length === 0 ? (
            <p className="text-slate-500 italic text-center">Nenhum talento vinculado.</p>
          ) : (
            talentos.map((item) => (
              <div 
                key={item.talento.feat_id}
                className={`p-4 rounded-xl border transition-all flex items-center justify-between gap-4 ${
                  item.is_enabled ? 'bg-violet-600/10 border-violet-500/50' : 'bg-slate-950 border-slate-800'
                }`}
              >
                <div className="flex-1">
                  <h3 className={`font-bold uppercase text-xs tracking-widest ${item.is_enabled ? 'text-violet-400' : 'text-slate-400'}`}>
                    {item.talento.feat_name}
                  </h3>
                  <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">{item.talento.feat_description}</p>
                </div>
                
                <button
                  onClick={() => onToggle(item.talento.feat_id, !item.is_enabled)}
                  className={`px-3 py-1.5 rounded-md text-[10px] font-black uppercase transition-all ${
                    item.is_enabled ? 'bg-violet-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {item.is_enabled ? 'Ativo' : 'Habilitar'}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}