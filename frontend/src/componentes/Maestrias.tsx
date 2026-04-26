// import React from 'react';

interface MaestriaProps {
  dados?: {
    nome: string;
    nivel: number;
    fragmentos: number;
    nivelMaximo: number;
  };
}


export function MaestriaCard({ dados }: MaestriaProps) {
  if (!dados) return null;

  const { nome, nivel, fragmentos, nivelMaximo } = dados;
  const isMax = nivel >= nivelMaximo;
  // Calcula a largura da barra de progresso (máximo 100%)
  const progresso = isMax ? 100 : (fragmentos / 5) * 100;

  return (
    <div className="bg-[#262626] border border-[#444] rounded-lg p-4 shadow-md hover:border-[#d4af37] transition-colors group">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-[#eee] font-bold uppercase tracking-wider">{nome}</h3>
        <span className={`text-xs px-2 py-1 rounded ${isMax ? 'bg-purple-900 text-purple-200' : 'bg-gray-800 text-[#d4af37]'}`}>
          Nível {nivel}
        </span>
      </div>

      {/* Barra de Progresso */}
      <div className="w-full h-3 bg-gray-900 rounded-full overflow-hidden border border-[#333]">
        <div 
          className={`h-full transition-all duration-500 ${isMax ? 'bg-gradient-to-r from-purple-500 to-indigo-500' : 'bg-[#2ecc71]'}`}
          style={{ width: `${progresso}%` }}
        />
      </div>

      <div className="flex justify-between mt-2">
        <span className="text-[10px] text-gray-500 uppercase font-semibold">
          {isMax ? 'Nível Máximo Alcançado' : `Fragmentos: ${fragmentos} / 5`}
        </span>
        {/* Pequenos indicadores de fragmentos (bolinhas) */}
        {!isMax && (
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i} 
                className={`w-2 h-2 rounded-full ${i < fragmentos ? 'bg-[#2ecc71]' : 'bg-gray-700'}`} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MaestriaCard;