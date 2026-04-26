import { calcularModificador } from "../shared";

interface AtributosProps {
  dados?: {
    forca?: number | undefined;
    destreza?: number | undefined;
    constituicao?: number | undefined;
    inteligencia?: number | undefined;
    sabedoria?: number | undefined;
    carisma?: number | undefined;
  };
}

export default function Atributos({ dados }: AtributosProps) {
  // Se os dados ainda não carregaram, mostramos um estado de carregamento
  if (!dados) return <div className="text-slate-500">Carregando atributos...</div>;

  return (
    <div className="grid grid-cols-2 gap-4">
      {Object.entries(dados).map(([nome, valor]) => (
        <div key={nome} className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex justify-between items-center">
          <span className="text-xs uppercase font-black text-slate-500">{nome.substring(0, 3)}</span>
          <span className="text-xl font-bold text-white">{valor}</span>
          <span className="text-violet-400 font-mono">
            ({calcularModificador(valor) >= 0 ? '+' : ''}{calcularModificador(valor)})
          </span>
        </div>
      ))}
    </div>
  );
}