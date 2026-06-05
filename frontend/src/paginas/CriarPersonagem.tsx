import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { type AtributosData } from '../componentes/ModalAtributos';
// import ModalPericiasIniciais, { type PericiasData } from '../componentes/ModalPericias';
import { RACAS_DATA } from '../data/racas';

// Enumerações para compatibilidade com o DDL e schemas
const SPELL_AFFINITY = ['aqua', 'ignis', 'terra', 'ventus', 'lux', 'umbra', 'force'];
const EQUIP_CATEGORIES = [
  'weapon',
  'armor',
  'shield',
  'consumable',
  'tool',
  'adventuring_gear',
  'quest_item',
];

interface RaceCaracteristica {
  nome: string;
  descricao: string;
  efeito?: {
    tipo: 'SELECAO_DE_MAGIA' | 'SELECAO_DE_IDIOMA' | string;
    alvo: string;
    valor: number;
  };
}

interface RaceMaestria {
  tipo: string;
  valor: number;
  maestria: string;
  selecionavel: boolean;
}

interface RaceData {
  id: string; // ou slug: string conforme seu banco
  name: string;
  idioma: string[];
  maestria: RaceMaestria[];
  caracteristicas: RaceCaracteristica[];
}

interface EquipData {
  equipment_id: number;
  equip_name: string;
  equip_description: string;
  category:
    | 'weapon'
    | 'armor'
    | 'shield'
    | 'consumable'
    | 'tool'
    | 'adventuring_gear'
    | 'quest_item';
  equip_weight: number;
  equip_size: number;
}

interface SpellData {
  spell_id: number;
  spell_name: string;
  spell_description: string;
  magic_type: 'arcane' | 'divine' | 'natural' | 'profane' | 'unique';
  affinity: string;
  spell_circle: number;
  mana_cost: number;
  activation_time: string;
  range_type: string;
  range_value: number | null;
  duration: string;
}

export type PericiaEstrutura = {
  nivel: number;
  fragmentos: number;
  nivelMaximo: number;
};

export type PericiasData = {
  acrobacia: PericiaEstrutura;
  adestramento: PericiaEstrutura;
  arcanismo: PericiaEstrutura;
  atletismo: PericiaEstrutura;
  atuacao: PericiaEstrutura;
  enganacao: PericiaEstrutura;
  furtividade: PericiaEstrutura;
  historia: PericiaEstrutura;
  intimidacao: PericiaEstrutura;
  intuicao: PericiaEstrutura;
  investigacao: PericiaEstrutura;
  medicina: PericiaEstrutura;
  natureza: PericiaEstrutura;
  percepcao: PericiaEstrutura;
  persuasao: PericiaEstrutura;
  presdigitacao: PericiaEstrutura;
  religiao: PericiaEstrutura;
  sobrevivencia: PericiaEstrutura;
};

type PericiaChave = keyof PericiasData;

type CharacterForm = {
  character_name: string;
  adventure_id: number;
  character_info: {
    race_id: string;
    sexo: string;
    idade: string;
    altura: string;
    peso: string;
    tendencia: string;
    afinidade_principal: string;
    afinidade_secundaria: string;
    idiomas: string[];
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
    pericias?: PericiasData;
  };
  character_details: {
    equipamento_inicial_ids: number[];
    magias_iniciais_ids: number[];
    maestrias_iniciais_slugs: string[];
    extras_selecionados: Record<string, string | number>;
    nivel: number;
    xp: number;
  };
};

type Campanha = { adventure_id: number; adventure_name: string };

export default function CriarPersonagem() {
  const navigate = useNavigate();
  const [passo, setPasso] = useState<number>(1);

  const [ficha, setFicha] = useState<CharacterForm>({
    character_name: '',
    adventure_id: 0,
    character_info: {
      race_id: '',
      sexo: '',
      idade: '',
      altura: '',
      peso: '',
      tendencia: '',
      afinidade_principal: 'none',
      afinidade_secundaria: 'none',
      idiomas: [],
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
      pericias: {
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
      },
    },
    character_details: {
      equipamento_inicial_ids: [],
      magias_iniciais_ids: [],
      maestrias_iniciais_slugs: [],
      extras_selecionados: {},
      nivel: 1,
      xp: 0,
    },
  });

  // const [isModalAtributosAberto, setIsModalAtributosAberto] = useState(false);
  // const [isModalPericiasAberto, setIsModalPericiasAberto] = useState(false);
  const [campanhasDisponiveis, setCampanhasDisponiveis] = useState<Campanha[]>([]);
  const [pontosRestantes, setPontosRestantes] = useState(27);
  const [fragDisponiveis, setFragDisponiveis] = useState(10);

  // --- NOVO ESTADO: Armazena os equipamentos vindos da consulta do banco de dados ---
  const [equipamentosDisponiveis, setEquipamentosDisponiveis] = useState<EquipData[]>([]);
  const [listaMagias, setListaMagias] = useState<SpellData[]>([]);

  // const [periciasIniciais, setPericiasIniciais] = useState<PericiasData>({
  //   acrobacia: { nivel: 0, fragmentos: 0, nivelMaximo: 10 },
  //   adestramento: { nivel: 0, fragmentos: 0, nivelMaximo: 10 },
  //   arcanismo: { nivel: 0, fragmentos: 0, nivelMaximo: 10 },
  //   atletismo: { nivel: 0, fragmentos: 0, nivelMaximo: 10 },
  //   atuacao: { nivel: 0, fragmentos: 0, nivelMaximo: 10 },
  //   enganacao: { nivel: 0, fragmentos: 0, nivelMaximo: 10 },
  //   furtividade: { nivel: 0, fragmentos: 0, nivelMaximo: 10 },
  //   historia: { nivel: 0, fragmentos: 0, nivelMaximo: 10 },
  //   intimidacao: { nivel: 0, fragmentos: 0, nivelMaximo: 10 },
  //   intuicao: { nivel: 0, fragmentos: 0, nivelMaximo: 10 },
  //   investigacao: { nivel: 0, fragmentos: 0, nivelMaximo: 10 },
  //   medicina: { nivel: 0, fragmentos: 0, nivelMaximo: 10 },
  //   natureza: { nivel: 0, fragmentos: 0, nivelMaximo: 10 },
  //   percepcao: { nivel: 0, fragmentos: 0, nivelMaximo: 10 },
  //   persuasao: { nivel: 0, fragmentos: 0, nivelMaximo: 10 },
  //   presdigitacao: { nivel: 0, fragmentos: 0, nivelMaximo: 10 },
  //   religiao: { nivel: 0, fragmentos: 0, nivelMaximo: 10 },
  //   sobrevivencia: { nivel: 0, fragmentos: 0, nivelMaximo: 10 },
  // });

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

  // Carregar dados iniciais
  useEffect(() => {
    const carregarDadosIniciais = async () => {
      try {
        const [resCampanhas] = await Promise.all([fetch('http://127.0.0.1:8000/campanhas')]);
        const [resEquip] = await Promise.all([fetch('http://127.0.0.1:8000/equipamentos')]);
        const [resMagias] = await Promise.all([fetch('http://127.0.0.1:8000/magias')]);

        setCampanhasDisponiveis(await resCampanhas.json());
        setEquipamentosDisponiveis(await resEquip.json());
        setListaMagias(await resMagias.json());
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
    const isNumeric = ['adventure_id'].includes(name);
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

  // Função para mudar a raça
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
    const idiomasConhecidos = racaSelecionada.idioma;

    setFicha((prev) => ({
      ...prev,
      character_info: {
        ...prev.character_info,
        race_id: newRaceId,
        idiomas: idiomasConhecidos,
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
        pericias: prev.character_abilities?.pericias
          ? {
              ...prev.character_abilities.pericias,
            }
          : undefined,
      },
    }));

    setPontosRestantes((prev) => prev - diffCusto);
  };

  const atualizarPericiasIniciais = (nome: keyof PericiasData, delta: number) => {
    const valorAtual = ficha.character_abilities?.pericias?.[nome].fragmentos || 0;
    const novoValor = valorAtual + delta;

    // 1. Bloqueio para não ser negativo
    if (novoValor < 0) return;

    // 2. Bloqueio de limite de recursos disponíveis (se estiver subindo)
    if (delta > 0 && fragDisponiveis <= 0) return;

    // 3. Cálculo dinâmico
    const novoNivel = Math.floor(novoValor / 5);
    // const fragmentosRestantes = novoValor % 5;

    setFicha((prev) => ({
      ...prev,
      character_abilities: {
        ...prev.character_abilities,
        pericias: {
          ...(prev.character_abilities?.pericias as PericiasData),
          [nome]: {
            ...prev.character_abilities?.pericias?.[nome],
            fragmentos: novoValor,
            nivel: novoNivel,
          },
        } as PericiasData,
      },
    }));

    setFragDisponiveis((prev) => prev - delta);
  };

  const alternarEquipamento = (id: number) => {
    const selecionados = [...ficha.character_details.equipamento_inicial_ids];
    const index = selecionados.indexOf(id);
    if (index > -1) {
      selecionados.splice(index, 1);
    } else {
      selecionados.push(id);
    }
    setFicha((prev) => ({
      ...prev,
      character_details: { ...prev.character_details, equipamento_inicial_ids: selecionados },
    }));
  };

  const selecionarTruqueRacial = (spellId: number) => {
    setFicha((prev) => ({
      ...prev,
      character_details: {
        ...prev.character_details,
        extras_selecionados: {
          ...prev.character_details.extras_selecionados,
          truque_racial_id: spellId, // Salva o ID da magia escolhida pelo traço da raça
        },
      },
    }));
  };

  const avancarPasso = () => setPasso((p) => p + 1);

  const retrocederPasso = () => {
    if (passo === 1) {
      navigate('/dashboard');
    } else {
      setPasso((p) => p - 1);
    }
  };

  // Função Principal de envio dos dados para o backend
  const handleSalvar = async (e: React.ChangeEvent) => {
    e.preventDefault();
    const token = sessionStorage.getItem('token');

    const fichaParaEnviar = {
      ...ficha,
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Barra de Progresso Superior */}
        <div className="bg-slate-950 px-8 py-4 border-b border-slate-800 flex justify-between items-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
          <span className={passo === 1 ? 'text-violet-400 font-bold' : ''}>1. Dados Básicos</span>
          <span className={passo === 2 ? 'text-violet-400 font-bold' : ''}>
            2. Atributos & Perícias
          </span>
          <span className={passo === 3 ? 'text-violet-400 font-bold' : ''}>
            3. Equipamento Inicial
          </span>
          <span className={passo === 4 ? 'text-violet-400 font-bold' : ''}>4. Extras de Raça</span>
        </div>

        <form onSubmit={handleSalvar} className="p-8 space-y-6">
          {/* ==========================================
              TELA 01: DETALHES BÁSICOS
             ========================================== */}
          {passo === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="text-2xl font-black text-slate-200 tracking-wide border-b border-slate-800 pb-2">
                Detalhes Básicos
              </h2>
              {/* Bloco 01 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Nome */}
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">
                    Nome do Personagem
                  </label>
                  <input
                    type="text"
                    required
                    value={ficha.character_name}
                    onChange={(e) => setFicha({ ...ficha, character_name: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-violet-600"
                  />
                </div>
                {/* Campanha */}
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">Campanha</label>
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
                {/* Raça */}
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">Raça</label>
                  <select
                    name="race_id"
                    value={ficha.character_info.race_id}
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
              </div>
              {/* Bloco 02 */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Afinidade Principal */}
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">
                    Afinidade Principal
                  </label>
                  <select
                    value={ficha.character_info.afinidade_principal}
                    onChange={(e) =>
                      setFicha({
                        ...ficha,
                        character_info: {
                          ...ficha.character_info,
                          afinidade_principal: e.target.value,
                        },
                      })
                    }
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 capitalize focus:outline-none focus:border-violet-600"
                  >
                    {SPELL_AFFINITY.map((aff) => (
                      <option key={aff} value={aff}>
                        {aff}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Afinidade Secundária */}
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">
                    Afinidade Secundária
                  </label>
                  <select
                    value={ficha.character_info.afinidade_secundaria}
                    onChange={(e) =>
                      setFicha({
                        ...ficha,
                        character_info: {
                          ...ficha.character_info,
                          afinidade_secundaria: e.target.value,
                        },
                      })
                    }
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 capitalize focus:outline-none focus:border-violet-600"
                  >
                    {SPELL_AFFINITY.map((aff) => (
                      <option key={aff} value={aff}>
                        {aff}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Idade */}
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">Idade</label>
                  <input
                    type="text"
                    value={ficha.character_info.idade}
                    onChange={(e) =>
                      setFicha({
                        ...ficha,
                        character_info: { ...ficha.character_info, idade: e.target.value },
                      })
                    }
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-violet-600"
                  />
                </div>
                {/* Sexo */}
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">Sexo</label>
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
              {/* Bloco 03 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Altura */}
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">Altura</label>
                  <input
                    type="text"
                    value={ficha.character_info.altura}
                    onChange={(e) =>
                      setFicha({
                        ...ficha,
                        character_info: { ...ficha.character_info, altura: e.target.value },
                      })
                    }
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-violet-600"
                  />
                </div>
                {/* Peso */}
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">Peso</label>
                  <input
                    type="text"
                    value={ficha.character_info.peso}
                    onChange={(e) =>
                      setFicha({
                        ...ficha,
                        character_info: { ...ficha.character_info, peso: e.target.value },
                      })
                    }
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-violet-600"
                  />
                </div>
                {/* Tendencia */}
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">Tendência</label>
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
              </div>
            </div>
          )}

          {/* ==========================================
              TELA 02: ATRIBUTOS E PERÍCIAS
             ========================================== */}
          {passo === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <h2 className="text-2xl font-black text-slate-200 tracking-wide">
                  Atributos & Perícias
                </h2>
              </div>

              {/* Grid de Atributos Customizado */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <h2 className="text-xl font-bold text-slate-200 tracking-wide">
                    1. Distribuir Pontos de Atributo
                  </h2>
                  <div className="px-3 py-1 bg-violet-950/40 border border-violet-800 text-violet-300 rounded-lg text-sm font-bold">
                    Pontos Restantes: {pontosRestantes}
                  </div>
                </div>
                {Object.keys(ficha.character_abilities?.atributos || {}).map((attr) => (
                  <div
                    key={attr}
                    className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex flex-col items-center justify-between"
                  >
                    <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
                      {attr}
                    </span>
                    <span className="text-3xl font-black my-2 text-white">
                      {(ficha.character_abilities?.atributos as Record<string, number>)[attr]}
                    </span>
                    <div className="flex gap-2 w-full">
                      <button
                        type="button"
                        onClick={() => atualizarAtributoInicial(attr as keyof AtributosData, -1)}
                        className="flex-1 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded font-bold"
                      >
                        -
                      </button>
                      <button
                        type="button"
                        onClick={() => atualizarAtributoInicial(attr as keyof AtributosData, 1)}
                        className="flex-1 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Grid de Perícias Customizado */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex justify-between items-center border-b border-slate-800 pt-4 pb-2">
                  <h2 className="text-xl font-bold text-slate-200 tracking-wide">
                    2. Distribuir Fragmentos de Perícia
                  </h2>
                  <div className="px-3 py-1 bg-emerald-950/40 border border-emerald-800 text-emerald-300 rounded-lg text-sm font-bold">
                    Fragmentos Disponíveis: {fragDisponiveis}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
                  {(Object.keys(ficha.character_abilities?.pericias || {}) as PericiaChave[]).map(
                    (pKey) => {
                      const item = ficha.character_abilities?.pericias?.[pKey];
                      return (
                        <div
                          key={pKey}
                          className="bg-slate-950 border border-slate-800 p-3 rounded-xl flex items-center justify-between"
                        >
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-200 capitalize">
                              {pKey}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              Nvl: {item?.nivel} / Frag: {item?.fragmentos}
                            </span>
                          </div>
                          <div className="flex gap-1">
                            <button
                              type="button"
                              onClick={() => atualizarPericiasIniciais(pKey, -1)}
                              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded font-bold text-sm"
                            >
                              -
                            </button>
                            <button
                              type="button"
                              onClick={() => atualizarPericiasIniciais(pKey, 1)}
                              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded font-bold text-sm"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      );
                    },
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              TELA 03: EQUIPAMENTO INICIAL (CARDS POR TIPO)
             ========================================== */}
          {passo === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="text-2xl font-black text-slate-200 tracking-wide border-b border-slate-800 pb-2">
                Equipamento Inicial
              </h2>

              {EQUIP_CATEGORIES.map((categoria) => {
                const itensDaCategoria = equipamentosDisponiveis.filter(
                  (e) => e.category === categoria,
                );
                if (itensDaCategoria.length === 0) return null;

                return (
                  <div key={categoria} className="space-y-3">
                    <h3 className="text-sm font-black uppercase tracking-wider text-violet-400 border-l-2 border-violet-500 pl-2">
                      {categoria.replace('_', ' ')}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {itensDaCategoria.map((item) => {
                        const selecionado =
                          ficha.character_details.equipamento_inicial_ids.includes(
                            item.equipment_id,
                          );
                        return (
                          <div
                            key={item.equipment_id}
                            onClick={() => alternarEquipamento(item.equipment_id)}
                            className={`p-4 border rounded-xl cursor-pointer transition-all flex justify-between items-center ${
                              selecionado
                                ? 'bg-violet-950/40 border-violet-600 shadow-md shadow-violet-950/50'
                                : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                            }`}
                          >
                            <div>
                              <h4 className="font-bold text-slate-200">{item.equip_name}</h4>
                              <p className="text-xs text-slate-400 mt-1">
                                {item.equip_description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ==========================================
              TELA 04: EXTRAS DE RAÇA (DINÂMICO E AUTOMÁTICO)
            ========================================== */}
          {passo === 4 &&
            (() => {
              // Detecta se a raça escolhida possui traços customizáveis para a Tela 4
              const racaAtual = RACAS_DATA[ficha.character_info.race_id];

              if (!racaAtual) {
                return <div className="text-slate-400">Selecione uma raça válida no Passo 1.</div>;
              }

              // 2. Procura por características que exijam uma escolha de magia (Truque)
              const caracteristicaComMagia = racaAtual.caracteristicas?.find(
                (c) => c.efeito?.tipo === 'SELECAO_DE_MAGIA',
              );

              // 3. Procura se a raça dá direito a escolher um idioma customizado extra
              const possuiIdiomaEscolha = racaAtual.idioma?.includes('Adicional');

              // 4. Procura se existem proficiências/maestrias marcadas como selecionáveis: true
              const maestriasParaEscolher =
                racaAtual.maestria?.filter((m) => m.selecionavel === true) || [];

              const temAlgumExtra =
                caracteristicaComMagia || possuiIdiomaEscolha || maestriasParaEscolher.length > 0;

              return (
                <div className="space-y-6 animate-fadeIn">
                  <div className="border-b border-slate-800 pb-2">
                    <h2 className="text-2xl font-black text-slate-200 tracking-wide">
                      Extras de Raça: {racaAtual.nome}
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Seu sangue e ancestralidade concedem as seguintes particularidades
                      customizáveis.
                    </p>
                  </div>

                  {!temAlgumExtra ? (
                    <div className="p-8 text-center bg-slate-950 border border-slate-800 rounded-xl">
                      <p className="text-slate-400 font-medium">
                        Sua raça possui apenas traços fixos. Nenhuma decisão adicional é necessária,
                        sua ficha está pronta!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* SUB-SEÇÃO A: DETECTOU TRUQUE/MAGIA ADICIONAL (EX: ALTO ELFO) */}
                      {caracteristicaComMagia && (
                        <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl space-y-4">
                          <div className="flex items-center gap-2">
                            <span className="text-amber-400 font-bold text-lg">💡</span>
                            <div>
                              <h4 className="font-black text-slate-200 text-sm uppercase tracking-wide">
                                Traço: {caracteristicaComMagia.nome}
                              </h4>
                              <p className="text-xs text-slate-400">
                                {caracteristicaComMagia.descricao}
                              </p>
                            </div>
                          </div>

                          {/* Filtra a lista global do banco para renderizar APENAS Truques (Círculo 0) */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                            {listaMagias
                              .filter((m) => {
                                const truqueCirculo0 = m.spell_circle === 0;
                                const bateComAfinidades =
                                  m.affinity === ficha.character_info.afinidade_principal ||
                                  m.affinity === ficha.character_info.afinidade_secundaria;
                                return truqueCirculo0 && bateComAfinidades;
                              }) // Regra rígida: Apenas Truques/Nível 0
                              .map((truque) => {
                                const selecionado =
                                  ficha.character_details.extras_selecionados.truque_racial_id ===
                                  truque.spell_id;
                                return (
                                  <div
                                    key={truque.spell_id}
                                    onClick={() => selecionarTruqueRacial(truque.spell_id)}
                                    className={`p-3 border rounded-xl cursor-pointer transition-all flex flex-col justify-between text-left ${
                                      selecionado
                                        ? 'bg-amber-950/30 border-amber-500 shadow-md shadow-amber-950/20'
                                        : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                                    }`}
                                  >
                                    <span className="font-bold text-sm text-slate-200">
                                      {truque.spell_name}
                                    </span>
                                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                                      {truque.spell_description}
                                    </p>
                                    <span className="text-[9px] text-slate-500 mt-2 uppercase font-mono">
                                      Afinidade: {truque.affinity}
                                    </span>
                                  </div>
                                );
                              })}
                          </div>
                          {/* Mensagem de aviso caso o filtro resulte em uma lista vazia */}
                          {listaMagias.filter(
                            (m) =>
                              m.spell_circle === 0 &&
                              (m.affinity === ficha.character_info.afinidade_principal ||
                                m.affinity === ficha.character_info.afinidade_secundaria),
                          ).length === 0 && (
                            <p className="text-xs text-rose-400 italic font-medium">
                              Nenhum truque (Círculo 0) encontrado no banco para as afinidades
                              selecionadas.
                            </p>
                          )}
                        </div>
                      )}

                      {/* SUB-SEÇÃO B: DETECTOU IDIOMA ADICIONAL */}
                      {possuiIdiomaEscolha && (
                        <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl space-y-3">
                          <h4 className="font-black text-slate-200 text-sm uppercase tracking-wide">
                            🗣️ Seleção de Idioma Adicional
                          </h4>
                          <p className="text-xs text-slate-400">
                            Escolha um idioma extra conhecido por seu personagem:
                          </p>
                          <p className="text-xs text-slate-400">
                            Idiomas Conhecidos: {racaAtual.idioma.join(', ')}
                          </p>
                          <input
                            type="text"
                            placeholder="Ex: Dracônico, Anão, Gigante..."
                            value={
                              (ficha.character_details.extras_selecionados
                                .idioma_adicional as string) || ''
                            }
                            onChange={(e) =>
                              setFicha({
                                ...ficha,
                                character_details: {
                                  ...ficha.character_details,
                                  extras_selecionados: {
                                    ...ficha.character_details.extras_selecionados,
                                    idioma_adicional: e.target.value,
                                  },
                                },
                              })
                            }
                            className="w-full md:w-1/3 px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 text-sm focus:outline-none focus:border-violet-600"
                          />
                        </div>
                      )}

                      {/* SUB-SEÇÃO C: MAESTRIAS OPCIONAIS DE RAÇA */}
                      {maestriasParaEscolher.length > 0 && (
                        <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl space-y-3">
                          <h4 className="font-black text-slate-200 text-sm uppercase tracking-wide">
                            🛡️ Proficiência Opcional de Raça
                          </h4>
                          <p className="text-xs text-slate-400">
                            Sua sub-raça permite escolher uma ferramenta ou bônus extra:
                          </p>
                          {/* Adicione um mapeamento similar caso queira salvar chaves de maestria extra */}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })()}

          {/* ==========================================
              PAINEL DE BOTÕES ADAPTÁVEIS
             ========================================== */}
          <div className="flex gap-4 border-t border-slate-800 pt-6">
            <button
              type="button"
              onClick={retrocederPasso}
              className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-all"
            >
              {passo === 1 ? 'Cancelar' : 'Voltar'}
            </button>

            {passo < 4 ? (
              <button
                type="button"
                onClick={avancarPasso}
                className="flex-[2] py-3 bg-violet-600 hover:bg-violet-500 text-white font-black uppercase tracking-widest rounded-xl shadow-lg shadow-violet-900/20 transition-all"
              >
                Continuar
              </button>
            ) : (
              <button
                type="submit"
                className="flex-[2] py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest rounded-xl shadow-lg shadow-emerald-900/20 transition-all"
              >
                Salvar Ficha
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );

  // return (
  //   <div className="max-w-2xl mx-auto py-6">
  //     <div className="bg-slate-900 border border-slate-800 px-8 py-4 rounded-2xl shadow-2xl">
  //       <h1 className="text-3xl font-black text-white mb-8 tracking-tighter uppercase">
  //         Novo <span className="text-violet-400">Personagem</span>
  //       </h1>
  //       <form onSubmit={handleSalvar} className="space-y-4">
  //         <div>
  //           <label className="text-xs font-bold uppercase text-slate-500 ml-1">
  //             Nome do Personagem
  //           </label>
  //           <input
  //             name="character_name"
  //             value={ficha.character_name}
  //             onChange={handleChange}
  //             className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-violet-500 outline-none transition-all"
  //             placeholder="Ex: Valerius"
  //           />
  //         </div>
  //         <div>
  //           <label className="text-xs font-bold uppercase text-slate-500 ml-1">Campanha</label>
  //           <select
  //             name="adventure_id"
  //             value={ficha.adventure_id}
  //             onChange={handleChange}
  //             className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-violet-500 outline-none"
  //           >
  //             <option value="">Selecione...</option>
  //             {campanhasDisponiveis.map((c) => (
  //               <option key={c.adventure_id} value={c.adventure_id}>
  //                 {c.adventure_name}
  //               </option>
  //             ))}
  //           </select>
  //         </div>
  //         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  //           {/* Raça */}
  //           <div>
  //             <label className="text-xs font-bold uppercase text-slate-500 ml-1">Raça</label>
  //             <select
  //               name="race_id"
  //               value={ficha.character_info.race_id}
  //               onChange={(e) => handleRaceChange(e.target.value)}
  //               className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-violet-500 outline-none"
  //             >
  //               {Object.entries(RACAS_DATA).map(([id, raca]) => (
  //                 <option key={id} value={id}>
  //                   {raca.nome}
  //                 </option>
  //               ))}
  //             </select>
  //           </div>
  //           {/* Sexo */}
  //           <div>
  //             <label className="text-xs font-bold uppercase text-slate-500 ml-1">Sexo</label>
  //             <select
  //               name="sexo"
  //               value={ficha.character_info.sexo}
  //               onChange={handleChangeInfo}
  //               className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-violet-500 outline-none"
  //             >
  //               <option value="">Selecione...</option>
  //               <option value="Masculino">Masculino</option>
  //               <option value="Feminino">Feminino</option>
  //               <option value="Outro">Outro</option>
  //             </select>
  //           </div>
  //         </div>
  //         <div className="grid grid-cols-3 gap-4">
  //           <div>
  //             <label className="text-xs font-bold uppercase text-slate-500 ml-1">Idade</label>
  //             <input
  //               type="number"
  //               name="idade"
  //               value={ficha.character_info.idade}
  //               onChange={handleChangeInfo}
  //               className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white"
  //             />
  //           </div>
  //           <div>
  //             <label className="text-xs font-bold uppercase text-slate-500 ml-1">Altura</label>
  //             <input
  //               name="altura"
  //               value={ficha.character_info.altura}
  //               onChange={handleChangeInfo}
  //               className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white"
  //               placeholder="1.80m"
  //             />
  //           </div>
  //           <div>
  //             <label className="text-xs font-bold uppercase text-slate-500 ml-1">Peso</label>
  //             <input
  //               name="peso"
  //               value={ficha.character_info.peso}
  //               onChange={handleChangeInfo}
  //               className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white"
  //               placeholder="75kg"
  //             />
  //           </div>
  //         </div>
  //         <div>
  //           <label className="text-xs font-bold uppercase text-slate-500 ml-1">Tendência</label>
  //           <select
  //             name="tendencia"
  //             value={ficha.character_info.tendencia}
  //             onChange={handleChangeInfo}
  //             className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white"
  //           >
  //             <option value="">Selecione...</option>
  //             {tendencias.map((t) => (
  //               <option key={t} value={t}>
  //                 {t}
  //               </option>
  //             ))}
  //           </select>
  //         </div>
  //         <div className="flex gap-4 py-1">
  //           <button
  //             type="button"
  //             onClick={() => setIsModalAtributosAberto(true)}
  //             className="flex-[2] py-4 bg-purple-800 hover:bg-violet-500 text-white font-black uppercase tracking-widest rounded-lg shadow-lg shadow-violet-900/30 transition-all transform active:scale-[0.98]"
  //           >
  //             Distribuir Pontos de Atributo
  //           </button>
  //         </div>
  //         <div className="flex gap-4 py-2">
  //           <button
  //             type="button"
  //             onClick={() => setIsModalPericiasAberto(true)}
  //             className="flex-[2] py-4 bg-purple-800 hover:bg-violet-500 text-white font-black uppercase tracking-widest rounded-lg shadow-lg shadow-violet-900/30 transition-all transform active:scale-[0.98]"
  //           >
  //             Escolher Perícias Iniciais
  //           </button>
  //         </div>
  //         <div className="flex gap-4">
  //           <button
  //             type="button"
  //             onClick={() => navigate('/dashboard')}
  //             className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-lg transition-all"
  //           >
  //             Cancelar
  //           </button>
  //           <button
  //             type="submit"
  //             disabled={pontosRestantes !== 0 && !temEscolhaPendente && fragDisponiveis <= 0}
  //             className={`flex-[2] py-4 font-black uppercase tracking-widest rounded-lg shadow-lg transition-all transform active:scale-[0.98] ${
  //               pontosRestantes !== 0
  //                 ? 'bg-slate-700 text-slate-500 cursor-not-allowed grayscale'
  //                 : 'bg-violet-600 hover:bg-violet-500 text-white shadow-violet-900/30'
  //             }`}
  //           >
  //             Criar Ficha
  //           </button>
  //         </div>
  //       </form>
  //     </div>
  //     <ModalAtributosInicial
  //       isOpen={isModalAtributosAberto}
  //       onClose={() => setIsModalAtributosAberto(false)}
  //       atributos={ficha?.character_abilities?.atributos || {}}
  //       pontos={pontosRestantes}
  //       onUpdateAtributo={(nome, delta) => atualizarAtributoInicial(nome, delta)}
  //     />
  //     <ModalPericiasIniciais
  //       isOpen={isModalPericiasAberto}
  //       onClose={() => setIsModalPericiasAberto(false)}
  //       pericias={periciasIniciais}
  //       pontos={fragDisponiveis}
  //       onUpdateAtributo={(nome, delta) => atualizarPericiasIniciais(nome, delta)}
  //     />
  //   </div>
  // );
}
