import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ModalAtributosInicial, type AtributosData } from '../componentes/ModalAtributos';
import ModalPericiasIniciais, { type PericiasData } from '../componentes/ModalPericias';


type CharacterForm = {
  character_name: string;
  race_id: number;
  adventure_id: number;
  character_info: {
    sexo: string;
    idade: string;
    altura: string;
    peso: string;
    tendencia: string;
  };
  character_details?:{
    maestria?:[
      {
        "tipo": string;
        "nome": string;
        "nivel": number;
        "fragmentos": number;
      }
    ];
  };
  character_abilities?: {
    atributos?: {
      forca?: number;
      destreza?: number;
      constituicao?: number;
      inteligencia?: number;
      sabedoria?: number;
      carisma?: number;
    };
  };
};

type Raca = { race_id: number; race_name: string };
type Campanha = { adventure_id: number; adventure_name: string };

export default function CriarPersonagem() {
  const navigate = useNavigate();
  const [ficha, setFicha] = useState<CharacterForm>({
    character_name: '',
    race_id: 0,
    adventure_id: 0,
    character_info: {
      sexo: '',
      idade: '',
      altura: '',
      peso: '',
      tendencia: '',
    },
    character_details: {
      maestria: [],
    },
    character_abilities: {
      atributos: {
        forca: 10,
        destreza: 10,
        constituicao: 10,
        inteligencia: 10,
        sabedoria: 10,
        carisma: 10,
      },
    },
  });

  const [isModalAtributosAberto, setIsModalAtributosAberto] = useState(false);
  const [isModalPericiasAberto, setIsModalPericiasAberto] = useState(false);
  const [racasDisponiveis, setRacasDisponiveis] = useState<Raca[]>([]);
  const [campanhasDisponiveis, setCampanhasDisponiveis] = useState<Campanha[]>([]);
  const [pontosRestantes, setPontosRestantes] = useState(27);
  const [fragDisponiveis, setFragDisponiveis] = useState(10);
  
  // Estado para gerenciar os fragmentos das perícias de forma isolada antes do envio
  const [periciasIniciais, setPericiasIniciais] = useState<PericiasData>({
    acrobacia: 0,
    adestramento: 0,
    arcanismo: 0,
    atletismo: 0,
    atuacao: 0,
    enganacao: 0,
    furtividade: 0,
    historia: 0,
    intimidacao: 0,
    intuicao: 0,
    investigacao: 0,
    medicina: 0,
    natureza: 0,
    percepcao: 0,
    persuasao: 0,
    presdigitacao: 0,
    religiao: 0,
    sobrevivencia: 0,
  });

  // Tabela de custos conforme sua regra
  const CUSTO_ATRIBUTOS: Record<number, number> = {
    10: 0,
    11: 1,
    12: 2,
    13: 3,
    14: 5,
    15: 7,
  };

  const tendencias = [
    'Leal e Bom',
    'Neutro e Bom',
    'Caótico e Bom',
    'Leal e Neutro',
    'Neutro Verdadeiro',
    'Caótico e Neutro',
    'Leal e Mau',
    'Neutro e Mau',
    'Caótico e Mau',
  ];

  useEffect(() => {
    const carregarDadosIniciais = async () => {
      try {
        const [resRacas, resCampanhas] = await Promise.all([
          fetch('http://127.0.0.1:8000/racas'),
          fetch('http://127.0.0.1:8000/campanhas'),
        ]);

        setRacasDisponiveis(await resRacas.json());
        setCampanhasDisponiveis(await resCampanhas.json());
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };
    carregarDadosIniciais();
  }, []);

  // Função genérica para atualizar qualquer campo
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // Converte IDs para número, caso contrário o backend rejeita como string
    const isNumeric = ['race_id', 'adventure_id'].includes(name);
    const val = isNumeric ? (value === '' ? 0 : parseInt(value)) : value;
    setFicha((prev) => ({ ...prev, [name]: val }) as CharacterForm);
  };

  const handleChangeInfo = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFicha((prev) => ({
      ...prev,
      character_info: {
        ...prev.character_info,
        [name]: value,
      },
    }));
  };

  const atualizarAtributoInicial = (nome: keyof AtributosData, delta: number) => {
    const atributosAtuais = ficha.character_abilities?.atributos || {};
    const valorAtual = atributosAtuais[nome] ?? 10;
    const novoValor = valorAtual + delta;

    // Regras de Limite: Mínimo 10, Máximo 15
    if (novoValor < 8 || novoValor > 15) return;

    // Calcula a diferença de custo entre o valor atual e o novo
    const custoAtual = CUSTO_ATRIBUTOS[valorAtual];
    const custoNovo = CUSTO_ATRIBUTOS[novoValor];
    const diffCusto = custoNovo - custoAtual;

    if (diffCusto > pontosRestantes) return;

    setFicha((prev) => ({
      ...prev,
      character_abilities: {
        ...prev.character_abilities,
        atributos: {
          ...atributosAtuais,
          [nome]: novoValor,
        },
      },
    }));

    setPontosRestantes((prev) => prev - diffCusto);
  };

  const atualizarPericiasIniciais = (nome: keyof PericiasData, delta: number) => {
    const valorAtual = periciasIniciais[nome] || 0;
    const novoValor = valorAtual + delta;

    // Limites: não pode ser negativo e não pode ultrapassar o máximo (ex: 5 fragmentos para o nível 1)
    if (novoValor < 0 || novoValor > 5) return;
    if (delta > 0 && fragDisponiveis <= 0) return;

    setPericiasIniciais(prev => ({ ...prev, [nome]: novoValor }));
    setFragDisponiveis(prev => prev - delta);
  };

  const handleSalvar = async (e: React.ChangeEvent) => {
    e.preventDefault();
    const token = sessionStorage.getItem('token');

    // Converte o estado de periciasIniciais para o formato de Maestria do backend
    const maestriasFormatadas = Object.entries(periciasIniciais)
      .filter(([_, frags]) => frags > 0)
      .map(([nome, frags]) => ({
        tipo: 'pericia',
        nome: nome,
        nivel: frags === 5 ? 1 : 0,
        fragmentos: frags === 5 ? 0 : frags,
        nivelMaximo: 10
      }));

    const fichaParaEnviar = {
      ...ficha,
      character_details: { ...ficha.character_details, maestria: maestriasFormatadas }
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/personagens/salvar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Enviamos o "crachá" de login
        },
        body: JSON.stringify(fichaParaEnviar),
      });

      if (response.ok) {
        alert('Personagem criado com sucesso!');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl">
        <h1 className="text-3xl font-black text-white mb-8 tracking-tighter uppercase">
          Novo <span className="text-violet-400">Personagem</span>
        </h1>
        <form onSubmit={handleSalvar} className="space-y-6">
          <div>
            <label className="text-xs font-bold uppercase text-slate-500 ml-1">
              Nome do Personagem
            </label>
            <input
              name="character_name"
              value={ficha.character_name}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-violet-500 outline-none transition-all"
              placeholder="Ex: Valerius"
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-slate-500 ml-1">Campanha</label>
            <select
              name="adventure_id"
              value={ficha.adventure_id}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-violet-500 outline-none"
            >
              <option value="">Selecione...</option>
              {campanhasDisponiveis.map((c) => (
                <option key={c.adventure_id} value={c.adventure_id}>
                  {c.adventure_name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Raça */}
            <div>
              <label className="text-xs font-bold uppercase text-slate-500 ml-1">Raça</label>
              <select
                name="race_id"
                value={ficha.race_id}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-violet-500 outline-none"
              >
                <option value="">Selecione...</option>
                {racasDisponiveis.map((r) => (
                  <option key={r.race_id} value={r.race_id}>
                    {r.race_name}
                  </option>
                ))}
              </select>
            </div>
            {/* Sexo */}
            <div>
              <label className="text-xs font-bold uppercase text-slate-500 ml-1">Sexo</label>
              <select
                name="sexo"
                value={ficha.character_info.sexo}
                onChange={handleChangeInfo}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-violet-500 outline-none"
              >
                <option value="">Selecione...</option>
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
                <option value="Outro">Outro</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold uppercase text-slate-500 ml-1">Idade</label>
              <input
                type="number"
                name="idade"
                value={ficha.character_info.idade}
                onChange={handleChangeInfo}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-slate-500 ml-1">Altura</label>
              <input
                name="altura"
                value={ficha.character_info.altura}
                onChange={handleChangeInfo}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white"
                placeholder="1.80m"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-slate-500 ml-1">Peso</label>
              <input
                name="peso"
                value={ficha.character_info.peso}
                onChange={handleChangeInfo}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white"
                placeholder="75kg"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-slate-500 ml-1">Tendência</label>
            <select
              name="tendencia"
              value={ficha.character_info.tendencia}
              onChange={handleChangeInfo}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white"
            >
              <option value="">Selecione...</option>
              {tendencias.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => setIsModalAtributosAberto(true)}
              className="flex-[2] py-4 bg-purple-800 hover:bg-violet-500 text-white font-black uppercase tracking-widest rounded-lg shadow-lg shadow-violet-900/30 transition-all transform active:scale-[0.98]"
            >
              Distribuir Pontos de Atributo
            </button>
          </div>
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => setIsModalPericiasAberto(true)}
              className="flex-[2] py-4 bg-purple-800 hover:bg-violet-500 text-white font-black uppercase tracking-widest rounded-lg shadow-lg shadow-violet-900/30 transition-all transform active:scale-[0.98]"
            >
              Escolher Perícias Iniciais
            </button>
          </div>
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-lg transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={pontosRestantes !== 0}
              className={`flex-[2] py-4 font-black uppercase tracking-widest rounded-lg shadow-lg transition-all transform active:scale-[0.98] ${
                pontosRestantes !== 0
                  ? 'bg-slate-700 text-slate-500 cursor-not-allowed grayscale'
                  : 'bg-violet-600 hover:bg-violet-500 text-white shadow-violet-900/30'
              }`}
            >
              Criar Ficha
            </button>
          </div>
        </form>
      </div>
      <ModalAtributosInicial
        isOpen={isModalAtributosAberto}
        onClose={() => setIsModalAtributosAberto(false)}
        atributos={ficha?.character_abilities?.atributos || {}}
        pontos={pontosRestantes}
        onUpdateAtributo={(nome, delta) => atualizarAtributoInicial(nome, delta)}
      />
      <ModalPericiasIniciais
        isOpen={isModalPericiasAberto}
        onClose={() => setIsModalPericiasAberto(false)}
        pericias={periciasIniciais}
        pontos={fragDisponiveis}
        onUpdateAtributo={(nome, delta) => atualizarPericiasIniciais(nome, delta)}
      />
    </div>
  );
}
