import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ModalAtributosInicial, type AtributosData } from '../componentes/ModalAtributos';
import ModalPericiasIniciais, { type PericiasData } from '../componentes/ModalPericias';
import { RACAS_DATA } from '../data/racas';
import { FERRAMENTAS_DATA } from '../data/ferramentas';
// import { useFichaStats } from '../hooks/useFichaStats';

type CharacterForm = {
  character_name: string;
  race_id: string;
  adventure_id: number;
  character_info: {
    sexo: string;
    idade: string;
    altura: string;
    peso: string;
    tendencia: string;
  };
  character_details?: {
    maestria?: [
      {
        tipo: string;
        nome: string;
        nivel: number;
        fragmentos: number;
        origem: string;
        nivelMaximo: number;
      },
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
    magias?: [
      {
        nome: string;
        nivel: number;
        descricao: string;
      },
    ];
  };
};

type Campanha = { adventure_id: number; adventure_name: string };

export default function CriarPersonagem() {
  const navigate = useNavigate();
  const [ficha, setFicha] = useState<CharacterForm>({
    character_name: '',
    race_id: '',
    adventure_id: 0,
    character_info: {
      sexo: '',
      idade: '',
      altura: '',
      peso: '',
      tendencia: '',
    },
    character_details: {
      maestria: [
        {
          tipo: '',
          nome: '',
          nivel: 0,
          fragmentos: 0,
          origem: '',
          nivelMaximo: 0,
        },
      ],
    },
    character_abilities: {
      atributos: {
        forca: 8,
        destreza: 8,
        constituicao: 8,
        inteligencia: 8,
        sabedoria: 8,
        carisma: 8,
      },
      magias: [
        {
          nome: '',
          nivel: 0,
          descricao: '',
        },
      ],
    },
  });
  const [isModalAtributosAberto, setIsModalAtributosAberto] = useState(false);
  const [isModalPericiasAberto, setIsModalPericiasAberto] = useState(false);
  const [campanhasDisponiveis, setCampanhasDisponiveis] = useState<Campanha[]>([]);
  const [pontosRestantes, setPontosRestantes] = useState(27);
  const [fragDisponiveis, setFragDisponiveis] = useState(10);
  const [periciasIniciais, setPericiasIniciais] = useState<PericiasData>({
    acrobacia: { nivel: 0, fragmentos: 0, nivelMaximo: 10 },
    adestramento: { nivel: 0, fragmentos: 0, nivelMaximo: 10 },
    arcanismo: { nivel: 0, fragmentos: 0, nivelMaximo: 10 },
    atletismo: { nivel: 0, fragmentos: 0, nivelMaximo: 10 },
    atuacao: { nivel: 0, fragmentos: 0, nivelMaximo: 10 },
    enganacao: { nivel: 0, fragmentos: 0, nivelMaximo: 10 },
    furtividade: { nivel: 0, fragmentos: 0, nivelMaximo: 10 },
    historia: { nivel: 0, fragmentos: 0, nivelMaximo: 10 },
    intimidacao: { nivel: 0, fragmentos: 0, nivelMaximo: 10 },
    intuicao: { nivel: 0, fragmentos: 0, nivelMaximo: 10 },
    investigacao: { nivel: 0, fragmentos: 0, nivelMaximo: 10 },
    medicina: { nivel: 0, fragmentos: 0, nivelMaximo: 10 },
    natureza: { nivel: 0, fragmentos: 0, nivelMaximo: 10 },
    percepcao: { nivel: 0, fragmentos: 0, nivelMaximo: 10 },
    persuasao: { nivel: 0, fragmentos: 0, nivelMaximo: 10 },
    presdigitacao: { nivel: 0, fragmentos: 0, nivelMaximo: 10 },
    religiao: { nivel: 0, fragmentos: 0, nivelMaximo: 10 },
    sobrevivencia: { nivel: 0, fragmentos: 0, nivelMaximo: 10 },
  });

  // Tabelas fixas
  const CUSTO_ATRIBUTOS: Record<number, number> = {
    8: 0,
    9: 1,
    10: 2,
    11: 3,
    12: 4,
    13: 5,
    14: 7,
    15: 9,
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

  const racaAtual = RACAS_DATA[ficha.race_id];
  const maestriasParaEscolher = racaAtual?.maestria.filter((m) => m.selecionavel === true);
  const temEscolhaPendente = maestriasParaEscolher?.length > 0;

  // Carregar dados iniciais
  useEffect(() => {
    const carregarDadosIniciais = async () => {
      try {
        const [resCampanhas] = await Promise.all([fetch('http://127.0.0.1:8000/campanhas')]);

        setCampanhasDisponiveis(await resCampanhas.json());
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };
    carregarDadosIniciais();
  }, []);

  // Funções de mudança
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

  // Função para mudar a raça e resetar magias se necessário
  const handleRaceChange = (newRaceId: string) => {
    // console.log("Tentando encontrar a raça com ID:", newRaceId);
    // console.log("IDs disponíveis:", Object.keys(RACAS_DATA));
    const racaSelecionada = RACAS_DATA[newRaceId];
    if (!racaSelecionada) return;
    // console.log(racaSelecionada)
    // Função auxiliar para buscar o valor de bonus
    const getBonus = (attrTag: string) => {
      return racaSelecionada.bonus_attr.find((b) => b.atributo === attrTag)?.valor || 0;
    };

    setFicha((prev) => ({
      ...prev,
      race_id: newRaceId,
      character_details: {
        ...prev.character_details,
        maestria: [
          {
            tipo: '',
            nome: '',
            nivel: 0,
            fragmentos: 0,
            nivelMaximo: 10,
            origem: '',
          },
        ],
      },
      character_abilities: {
        ...prev.character_abilities,
        atributos: {
          forca: 8 + getBonus('forca'),
          destreza: 8 + getBonus('destreza'),
          constituicao: 8 + getBonus('constituicao'),
          inteligencia: 8 + getBonus('inteligencia'),
          sabedoria: 8 + getBonus('sabedoria'),
          carisma: 8 + getBonus('carisma'),
        },
        magias: [
          {
            nome: '',
            nivel: 0,
            descricao: '',
          },
        ],
      },
    }));

    // Resetar pontos para 27 (padrão Point Buy) ao trocar de raça
    setPontosRestantes(27);
  };

  // Funções de tratamento de informação
  const atualizarAtributoInicial = (nome: keyof AtributosData, delta: number) => {
    const atributosAtuais = ficha.character_abilities?.atributos || {};
    const valorAtual = atributosAtuais[nome] ?? 8;
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
    const valorAtual = periciasIniciais[nome].fragmentos || 0;
    const novoValor = valorAtual + delta;

    // 1. Bloqueio para não ser negativo
    if (novoValor < 0) return;

    // 2. Bloqueio de limite de recursos disponíveis (se estiver subindo)
    if (delta > 0 && fragDisponiveis <= 0) return;

    // 3. Cálculo dinâmico
    const novoNivel = Math.floor(novoValor / 5);
    // const fragmentosRestantes = novoValor % 5;

    setPericiasIniciais((prev) => ({
      ...prev,
      [nome]: {
        ...prev[nome], // Mantém outros campos que a perícia possa ter no futuro
        fragmentos: novoValor, // Atualiza o total de fragmentos (ou resto)
        nivel: novoNivel, // Atualiza o nível calculado
      },
    }));

    setFragDisponiveis((prev) => prev - delta);
  };

  // Função Principal de envio dos dados para o backend
  const handleSalvar = async (e: React.ChangeEvent) => {
    e.preventDefault();
    const token = sessionStorage.getItem('token');

    // Converte o estado de periciasIniciais para o formato de Maestria do backend
    const maestriasFormatadas = Object.entries(periciasIniciais)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([_, dados]) => dados.fragmentos > 0)
      .map(([nome, dados]) => {
        const fragmentosNivelAtual = dados.fragmentos % 5;
        return {
          tipo: 'pericia',
          nome: nome,
          nivel: dados.nivel, // Agora usamos o nível calculado no estado
          fragmentos: fragmentosNivelAtual,
          nivelMaximo: dados.nivelMaximo,
        };
      });

    const fichaParaEnviar = {
      ...ficha,
      character_details: { ...ficha.character_details, maestria: maestriasFormatadas },
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
    <div className="max-w-2xl mx-auto py-6">
      <div className="bg-slate-900 border border-slate-800 px-8 py-4 rounded-2xl shadow-2xl">
        <h1 className="text-3xl font-black text-white mb-8 tracking-tighter uppercase">
          Novo <span className="text-violet-400">Personagem</span>
        </h1>
        <form onSubmit={handleSalvar} className="space-y-4">
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
                onChange={(e) => handleRaceChange(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-violet-500 outline-none"
              >
                {Object.entries(RACAS_DATA).map(([id, raca]) => (
                  <option key={id} value={id}>
                    {raca.nome}
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
          {temEscolhaPendente && (
            <div className="p-4 bg-violet-950/20 border border-violet-500/30 rounded-xl space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-violet-500 rounded-full animate-pulse" />
                <p className="text-sm font-bold text-violet-300 uppercase tracking-widest">
                  Escolha de Raça: {maestriasParaEscolher[0].maestria}
                </p>
              </div>

              <select
                className="w-full bg-slate-900 border border-slate-700 p-2 rounded-lg text-sm outline-none focus:border-violet-500"
                onChange={(e) => {
                  const ferramentaId = e.target.value;
                  const dadosFerramenta = FERRAMENTAS_DATA[ferramentaId];
                  if (!dadosFerramenta) return;

                  setFicha((prev) => ({
                    ...prev,
                    character_details: {
                      ...prev.character_details,
                      maestria: [
                        {
                          tipo: 'ferramenta',
                          nome: dadosFerramenta.nome,
                          nivel: 1, // Maestria inicial
                          fragmentos: 0,
                          nivelMaximo: 10,
                          origem: 'racial',
                        },
                      ],
                    },
                  }));
                }}
              >
                <option value="">Selecione uma ferramenta...</option>
                {/* Aqui filtramos as ferramentas que fazem sentido para a escolha */}
                {Object.values(FERRAMENTAS_DATA)
                  .filter((f) => f.categoria === 'Artesão') // Exemplo: Anão escolhe ferramenta de artesão
                  .map((ferr) => (
                    <option key={ferr.id} value={ferr.nome}>
                      {ferr.nome}
                    </option>
                  ))}
              </select>
            </div>
          )}
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
          <div className="flex gap-4 py-1">
            <button
              type="button"
              onClick={() => setIsModalAtributosAberto(true)}
              className="flex-[2] py-4 bg-purple-800 hover:bg-violet-500 text-white font-black uppercase tracking-widest rounded-lg shadow-lg shadow-violet-900/30 transition-all transform active:scale-[0.98]"
            >
              Distribuir Pontos de Atributo
            </button>
          </div>
          <div className="flex gap-4 py-2">
            <button
              type="button"
              onClick={() => setIsModalPericiasAberto(true)}
              className="flex-[2] py-4 bg-purple-800 hover:bg-violet-500 text-white font-black uppercase tracking-widest rounded-lg shadow-lg shadow-violet-900/30 transition-all transform active:scale-[0.98]"
            >
              Escolher Perícias Iniciais
            </button>
          </div>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-lg transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={pontosRestantes !== 0 && !temEscolhaPendente && fragDisponiveis <= 0}
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
