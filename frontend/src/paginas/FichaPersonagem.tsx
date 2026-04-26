import { useCallback, useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowUpCircleIcon } from '@heroicons/react/24/solid';
import Atributos from '../componentes/Atributos';
import Reservas from '../componentes/Reservas';
import Moedas from '../componentes/Moedas';
import MaestriaCard from '../componentes/Maestrias';
import SlotSimples from '../componentes/SlotSimples';
import ModalAtributos, { type AtributosData } from '../componentes/ModalAtributos';
import ModalTalentos from '../componentes/ModalTalentos';
import ModalTitulos from '../componentes/ModalTitulos';
import {
  TABELA_XP_NIVEL,
  TABELA_MERITO_NIVEL,
  podeSubirDeNivel,
  podeSubirDeRank,
} from '../utils/regrasRpg';
import {
  API_BASE_URL,
  getAuthHeaders,
  handleAuthError,
  calcularModificador,
  MAPEAMENTO_RANKS,
} from '../shared';

interface SlotEquipamento {
  nome: string;
  descricao?: string;
  tipo?: string;
  slotMagico?: boolean;
  slotAlma?: boolean;
}

interface Titulo {
  nome: string;
  identificador: number;
  principal: boolean;
  ativo: boolean;
}

interface Maestria {
  nome: string;
  nivel: number;
  fragmentos: number;
  nivelMaximo: number;
}

interface AssFeatDetalhe {
  is_enabled: boolean;
  talento: {
    feat_id: number;
    feat_name: string;
    feat_description: string;
  };
}

interface PersonagemDetalhe {
  character_uuid: string;
  race_id?: number;
  race_name?: string;
  character_name?: string;
  url_image?: string | null;
  character_info?: {
    peso?: string;
    idade?: string;
    sexo?: string;
    altura?: string;
    tendencia?: string;
  };
  talento?: AssFeatDetalhe[];
  character_details?: {
    ca?: number;
    titulos?: Titulo[] | undefined;
    maestria?: Maestria[];
    iniciativa?: number;
    deslocamento?: number | string;
    xp?: number;
    merito?: number;
    nivel?: number;
    rank?: number;
    moedas?: {
      ouro?: number;
      prata?: number;
      cobre?: number;
    };
    reservas?: {
      vida?: {
        atual?: number;
        maximo?: number;
        dado?: number;
      };
      mana?: {
        atual?: number;
        maximo?: number;
        dado?: number;
      };
      vigor?: {
        atual?: number;
        maximo?: number;
        dado?: number;
      };
    };
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
    pericias?: {
      acrobacia?: number;
      adestramento?: number;
      arcanismo?: number;
      atletismo?: number;
      atuacao?: number;
      enganacao?: number;
      furtividade?: number;
      historia?: number;
      intimidacao?: number;
      intuicao?: number;
      investigacao?: number;
      medicina?: number;
      natureza?: number;
      percepcao?: number;
      persuasao?: number;
      presdigitacao?: number;
      religiao?: number;
      sobrevivencia?: number;
    };
  };
  character_equipment?: {
    roupa?: string;
    mochila?: {
      descricao?: string;
      slotsOcupados?: number;
      slotsTotais?: number;
    };
    armadura?: {
      nome?: string;
      descricao?: string;
      defesa?: number;
      defFixa?: boolean;
    };
    acessorios?: SlotEquipamento[];
    cintura?: SlotEquipamento[];
    costas?: SlotEquipamento[];
    peitoral?: SlotEquipamento[];
  };
}

const mapeamentoPericias: Record<string, keyof AtributosData> = {
  acrobacia: 'destreza',
  adestramento: 'sabedoria',
  arcanismo: 'inteligencia',
  atletismo: 'forca',
  atuacao: 'carisma',
  enganacao: 'carisma',
  furtividade: 'destreza',
  historia: 'inteligencia',
  intimidacao: 'carisma',
  intuicao: 'sabedoria',
  investigacao: 'inteligencia',
  medicina: 'sabedoria',
  natureza: 'inteligencia',
  percepcao: 'sabedoria',
  persuasao: 'carisma',
  presdigitacao: 'destreza',
  religiao: 'inteligencia',
  sobrevivencia: 'sabedoria',
};

function LinhaEquipamento({ label, item }: { label: string; item?: SlotEquipamento | string }) {
  const nomeItem = typeof item === 'object' ? item?.nome : item;
  const isAlma = typeof item === 'object' ? item?.slotAlma : false;
  const isMagico = typeof item === 'object' ? item?.slotMagico : false;

  return (
    <div className="group flex items-center justify-between p-2 hover:bg-violet-500/5 transition-all">
      <div className="flex flex-col">
        <span className="text-[9px] font-black text-slate-600 uppercase tracking-tight">
          {label}
        </span>
        <span
          className={
            nomeItem ? 'text-sm text-slate-200 font-medium' : 'text-sm text-slate-800 italic'
          }
        >
          {nomeItem || ''}
        </span>
      </div>

      {/* Indicadores Laterais */}
      <div className="flex gap-1.5">
        <div
          title="Slot de Alma"
          className={`w-2 h-4 rounded-sm border ${isAlma ? 'bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)] border-cyan-400' : 'bg-slate-900 border-slate-800'}`}
        />
        <div
          title="Sintonização"
          className={`w-2 h-4 rounded-sm border ${isMagico ? 'bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.5)] border-violet-400' : 'bg-slate-900 border-slate-800'}`}
        />
      </div>
    </div>
  );
}

export default function FichaPersonagem() {
  const { uuid } = useParams();
  const [personagem, setPersonagem] = useState<PersonagemDetalhe | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [isModalAtributosAberto, setIsModalAtributosAberto] = useState(false);
  const [isModalTalentosAberto, setIsModalTalentosAberto] = useState(false);
  const [isModalTitulosAberto, setIsModalTitulosAberto] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const nivelAtual = personagem?.character_details?.nivel || 1;
  const xpAtual = personagem?.character_details?.xp || 0;
  const xpProximoNivel = TABELA_XP_NIVEL[nivelAtual + 1] || 0;
  const aptoParaLevelUp = podeSubirDeNivel(nivelAtual, xpAtual);
  const xpDisponivel = xpAtual - TABELA_XP_NIVEL[nivelAtual] || 0;

  const rankAtual = personagem?.character_details?.rank || 1;
  const meritoAtual = personagem?.character_details?.merito || 0;
  const meritoProximoNivel = TABELA_MERITO_NIVEL[rankAtual + 1] || 0;
  const aptoParaRankUp = podeSubirDeRank(rankAtual, meritoAtual);

  const talentosAtivos = personagem?.talento?.filter((f) => f.is_enabled);
  const titulosAtivos = personagem?.character_details?.titulos?.filter((f) => f.ativo);
  const maestrias = personagem?.character_details?.maestria;


  const has_title = (titulosAtivos?.length ?? 0) > 0;
  const has_rank = (personagem?.character_details?.rank ?? 0) > 0;


  // Carregamento dos dados do personagem
  useEffect(() => {
    const buscarPersonagens = async () => {
      const token = sessionStorage.getItem('token');
      console.log('Token enviado:', token);
      try {
        const response = await fetch(`http://127.0.0.1:8000/personagens/${uuid}`, {
          method: 'GET',
          headers: {
            // O espaço entre 'Bearer' e o token é obrigatório
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Dados do Personagem:', data);
          setPersonagem(data);
          if (data.url_image) setUrlInput(data.url_image);
        } else if (response.status === 401) {
          // Token expirado ou inválido
          sessionStorage.removeItem('token');
          window.location.href = '/login';
        }
      } catch (error) {
        console.error('Erro ao carregar personagens:', error);
      } finally {
        setSalvando(false);
      }
    };
    buscarPersonagens();
  }, [uuid]);

  const autoSave = useCallback(
    async (dados: PersonagemDetalhe) => {
      setSalvando(true);
      const inicio = Date.now(); // Marca o momento em que o salvamento começou
      try {
        const response = await fetch(`${API_BASE_URL}/personagens/${uuid}`, {
          method: 'PATCH',
          headers: getAuthHeaders(),
          body: JSON.stringify(dados),
        });

        if (handleAuthError(response.status)) {
          return;
        }

        if (response.ok) {
          console.log('Sincronizado com o plano astral...');
        }
      } catch (error) {
        console.error('Erro na conexão ao salvar:', error);
      } finally {
        // Calcula quanto tempo a requisição levou
        const fim = Date.now();
        const tempoDecorrido = fim - inicio;
        const tempoMinimo = 3000; // 3 segundos

        // Se foi mais rápido que 1s, espera o tempo restante
        if (tempoDecorrido < tempoMinimo) {
          await new Promise((resolve) => setTimeout(resolve, tempoMinimo - tempoDecorrido));
        }
        setSalvando(false);
      }
    },
    [uuid],
  ); // Só recria a função se o UUID do personagem mudar

  useEffect(() => {
    if (!personagem) return;

    const delayDebounceFn = setTimeout(() => {
      autoSave(personagem);
    }, 3000);

    return () => clearTimeout(delayDebounceFn);
  }, [personagem, autoSave]);

  const handleSaveImage = () => {
    const finalUrl = urlInput.trim() || null;
    setPersonagem((prev) => (prev ? { ...prev, url_image: finalUrl } : null));
    setIsEditing(false);
  };

  const handleCancelEditImage = () => {
    setUrlInput(personagem?.url_image || '');
    setIsEditing(false);
  };

  const atualizarReservas = (tipo: 'vida' | 'mana' | 'vigor', valor: number) => {
    setPersonagem((prev) => {
      if (!prev) return prev;
      // Pegamos o valor atual ou 0 se não existir
      const atual = prev.character_details?.reservas?.[tipo]?.atual ?? 0;
      const max = prev.character_details?.reservas?.[tipo]?.maximo ?? 1;

      // Garantimos que a vida/mana não fique negativa nem passe do máximo
      const novoValor = Math.max(0, Math.min(max, atual + valor));

      return {
        ...prev,
        character_details: {
          ...prev.character_details,
          reservas: {
            ...prev.character_details?.reservas,
            [tipo]: {
              ...prev.character_details?.reservas?.[tipo],
              atual: novoValor,
            },
          },
        },
      };
    });
  };

  const atualizarMoedas = (tipo: 'ouro' | 'prata' | 'cobre', valor: number) => {
    setPersonagem((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        character_details: {
          ...prev.character_details,
          moedas: {
            ...prev.character_details?.moedas,
            [tipo]: valor,
          },
        },
      };
    });
  };

  const atualizarNivel = (delta: number) => {
    setPersonagem((prev) => {
      if (!prev) return prev;

      const novoNivel = delta;

      return {
        ...prev,
        character_details: {
          ...prev.character_details,
          nivel: novoNivel,
        },
      };
    });
  };

  const atualizarRank = (delta: number) => {
    setPersonagem((prev) => {
      if (!prev) return prev;

      const novoRank = delta;

      return {
        ...prev,
        character_details: {
          ...prev.character_details,
          rank: novoRank,
        },
      };
    });
  };

  const atualizarAtributo = (
    nome: keyof AtributosData,
    delta: number,
    recurso: 'xp' | 'merito',
  ) => {
    setPersonagem((prev) => {
      if (!prev) return prev;

      const custo = recurso === 'xp' ? 10 : 1; // Exemplo: 10 XP ou 1 Mérito por ponto
      const saldoAtual = prev.character_details?.[recurso] || 0;

      if (delta > 0 && saldoAtual < custo) {
        alert(`Recursos insuficientes de ${recurso.toUpperCase()}!`);
        return prev;
      }

      const atributosAtuais = prev.character_abilities?.atributos || {};
      const valorAtual = atributosAtuais[nome] ?? 0;
      const novoValor = Math.max(0, valorAtual + delta);

      if (novoValor === valorAtual) return prev;

      const novoSaldo = saldoAtual - delta * custo;

      return {
        ...prev,
        character_details: { ...prev.character_details, [recurso]: novoSaldo },
        character_abilities: {
          ...prev.character_abilities,
          atributos: {
            ...atributosAtuais,
            [nome]: novoValor,
          },
        },
      };
    });
  };

  const alternarTalento = async (featId: number, habilitar: boolean) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/personagens/${uuid}/talento/${featId}?is_enabled=${habilitar}`,
        {
          method: 'PATCH',
          headers: getAuthHeaders(),
        },
      );

      if (response.ok) {
        const data = await response.json();
        setPersonagem(data);
      }
    } catch (error) {
      console.error('Erro ao alternar talento:', error);
    }
  };

  const alternarTitulos = async (titleID: number, label: 'ativo' | 'principal', valor: boolean) => {
    setPersonagem((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        character_details: {
          ...prev.character_details,
          titulos: prev.character_details?.titulos?.map((titulo) => {
            if (titulo.identificador === titleID) {
              return { ...titulo, [label]: valor };
            }
            return titulo;
          }),
        },
      };
    });
  };

  const calcularDefesa = (valor: number = 10) => {
    if (personagem?.character_equipment?.armadura?.nome === '') return 10;

    const valorAtributo = personagem?.character_abilities?.atributos?.destreza ?? 0;
    const mod = calcularModificador(valorAtributo);
    const defesaBase = valor;

    if (personagem?.character_equipment?.armadura?.defFixa) return defesaBase;

    return defesaBase + mod;
  };

  const ListaTitulos = ({ titulosAtivos }: { titulosAtivos: Titulo[] }) => {
    const titulosProcessados = useMemo(() => {
      return [...titulosAtivos].sort((a, b) => {
        // Prioridade para o principal
        if (a.principal !== b.principal) return a.principal ? -1 : 1;

        // Ordem alfabética para o resto (pelo campo 'nome' ou 'titulo')
        return a.nome.localeCompare(b.nome);
      });
    }, [titulosAtivos]);

    return (
      <div>
        {titulosProcessados?.map((item) =>
          item.principal ? (
            /* DESTAQUE: Título Principal */
            <div
              key={item.identificador}
              className="flex items-center gap-2 group cursor-default"
              title="Título Principal"
            >
              <span className="text-violet-500 animate-pulse text-lg">◈</span>
              <h2 className="text-2xl font-black uppercase tracking-tighter text-white drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]">
                {item.nome}
              </h2>
            </div>
          ) : (
            /* SECUNDÁRIOS: Menores e mais discretos */
            <div
              key={item.identificador}
              className="flex items-center gap-2 ml-1 opacity-60 hover:opacity-100 transition-opacity"
            >
              <span className="text-slate-600 text-xs">◇</span>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                {item.nome}
              </span>
            </div>
          ),
        )}
      </div>
    );
  };

   console.log(personagem);
  return (
    <div className="container mx-auto px-6 py-8 bg-slate-950 min-h-screen text-slate-200">
      {/* Indicador de Salvamento Flutuante */}
      {salvando && (
        <div className="fixed bottom-6 right-6 flex items-center gap-2 bg-violet-600/90 text-white px-4 py-2 rounded-full shadow-lg shadow-violet-900/40 backdrop-blur-sm z-[100] animate-bounce">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest">
            Sincronizando com o Plano Astral...
          </span>
        </div>
      )}
      {/* Indicador de LevelUp Flutuante */}
      {aptoParaLevelUp && (
        <div className="fixed top-3 inset-x-0 flex justify-center z-[100] pointer-events-none">
          <div className="flex items-center gap-2 bg-[#2ecc71] text-white px-4 py-2 rounded-full shadow-lg shadow-violet-900/40 backdrop-blur-sm animate-bounce pointer-events-auto">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Parabéns!! Você alcançou os requisitos para subir de nível!!
            </span>
          </div>
        </div>
      )}
      {/* Indicador de RankUp Flutuante */}
      {aptoParaRankUp && (
        <div className="fixed top inset-x-0 flex justify-center z-[100] pointer-events-none">
          <div className="flex items-center gap-2 bg-[#2ecc65] text-white px-4 py-2 rounded-full shadow-lg shadow-violet-900/40 backdrop-blur-sm animate-bounce pointer-events-auto">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Parabéns!! Você alcançou os requisitos para subir de rank!!
            </span>
          </div>
        </div>
      )}
      {/* header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Imagem Personagem */}
        <div className="lg:col-span-3 space-y-3">
          <div className=" text-sm text-slate-200 font-medium tracking-tight px-1 leading-none">
            {/* Container da Imagem */}
            <div className="relative group flex flex-col w-full h-64 border-2 border-dashed border-slate-700 rounded-lg items-center justify-center overflow-hidden bg-slate-950">
              <div className="flex-grow w-full flex items-center justify-center text-sm text-center">
                {personagem?.url_image ? (
                  <img
                    src={personagem.url_image}
                    alt="Imagem do Personagem"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  ' '
                )}
              </div>
              {/* Camada de UI */}
              {isEditing ? (
                /* Modo de Edição: Sempre visível */
                <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-sm p-4 flex flex-col justify-center gap-3 animate-in fade-in zoom-in-95 duration-200">
                  <label className="text-[10px] font-black uppercase text-violet-400 tracking-widest text-center">
                    URL da Imagem
                  </label>
                  <input
                    type="text"
                    autoFocus
                    placeholder="Cole o link ou apague para remover..."
                    className="w-full px-3 py-2 bg-slate-900 border border-violet-500 rounded-md text-white text-sm outline-none focus:ring-1 focus:ring-violet-500"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveImage}
                      className="flex-1 bg-violet-600 text-white py-2 rounded-md font-bold text-xs hover:bg-violet-500 uppercase tracking-tighter"
                    >
                      Salvar
                    </button>
                    <button
                      onClick={handleCancelEditImage}
                      className="flex-1 bg-slate-800 text-slate-400 py-2 rounded-md font-bold text-xs hover:bg-slate-700 uppercase tracking-tighter"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                /* Modo Normal: Botão no Hover se houver imagem, ou fixo se não houver */
                <div
                  className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${personagem?.url_image ? 'bg-black/60 opacity-0 group-hover:opacity-100' : ''}`}
                >
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-2 bg-violet-600/90 hover:bg-violet-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg transition-transform transform active:scale-95"
                  >
                    {personagem?.url_image ? 'Alterar Imagem' : 'Adicionar Imagem'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Cabeçalho */}
        <div className="lg:col-span-9 space-y-3">
          {/* Personagem */}
          <div className="card-pagina">
            <div className="gap-4 p-6">
              <h1 className="text-4xl font-black uppercase tracking-tighter text-white">
                {personagem?.character_name}{' '}
                <div className="inline-flex flex-col ml-2">
                  <span className="text-2xl font-black text-violet-400">[ {nivelAtual} ]</span>
                </div>
              </h1>
              <div className="flex flex-col md:flex-row md:items-center gap-4 mt-2">
                <div className="flex gap-4 text-violet-400 font-bold uppercase text-xs tracking-widest">
                  <span>{personagem?.race_name}</span>
                  <span className="text-slate-700">|</span>
                  <span>{personagem?.character_info?.tendencia}</span>
                </div>
              </div>
              {has_rank && (
                <div className="flex text-2xl font-black items-center gap-2 group cursor-default ml-5 mt-3">
                  <span className="text-violet-500 animate-pulse text-lg">◈</span>
                  <h2>{MAPEAMENTO_RANKS[rankAtual]}</h2>
                </div>
              )}
            </div>
            {/* Títulos */}
            <div className="flex flex-col gap-2 mb-6 p-6">
              <button
                onClick={() => setIsModalTitulosAberto(true)}
                className="btn-header-rpg px-2 py-1 text-[9px] text-right"
              >
                Gerenciar
              </button>
              {has_title && (
                <ListaTitulos titulosAtivos={titulosAtivos || []} />
              )}
            </div>
          </div>
          {/* Barra de XP e Rank */}
          <div className="flex gap-8 justify-between">
            {/* Barra de XP */}
            <div className="flex-1 max-w-xs group relative">
              <div className="flex flex-col justify-between text-[14px] font-black uppercase mb-1 tracking-tighter">
                <span className="text-slate-500">Experiência </span>
                <span className="text-violet-400">
                  {xpAtual} / {xpProximoNivel} XP
                </span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
                <div
                  className="h-full bg-violet-500 transition-all duration-500 shadow-[0_0_8px_rgba(139,92,246,0.4)]"
                  style={{ width: `${Math.min(100, (xpAtual / xpProximoNivel) * 100)}%` }}
                />
              </div>
              {aptoParaLevelUp && (
                <span className="absolute -top-1 -right-1 flex h-8 w-8 justify-center items-center">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75 pointer-events-none"></span>
                  <button
                    onClick={() => {
                      atualizarNivel(nivelAtual + 1);
                      alert('Parabéns por Alcançar o nível ' + (nivelAtual + 1));
                    }}
                    className="hover:text-[#48bb78] transition-colors text-violet-500"
                  >
                    <ArrowUpCircleIcon className="w-8 h-8" />
                  </button>
                </span>
              )}
            </div>
            {/* Barra de Rank */}
            <div className="flex-1 max-w-xs group relative">
              <div className="flex flex-col justify-between text-[14px] font-black uppercase mb-1 tracking-tighter">
                <span className="text-slate-500">Méritos </span>
                <span className="text-violet-400">
                  {meritoAtual} / {meritoProximoNivel}
                </span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
                <div
                  className="h-full bg-violet-500 transition-all duration-500 shadow-[0_0_8px_rgba(139,92,246,0.4)]"
                  style={{ width: `${Math.min(100, (meritoAtual / meritoProximoNivel) * 100)}%` }}
                />
              </div>
              {aptoParaRankUp && (
                <span className="absolute -top-1 -right-1 flex h-8 w-8 justify-center items-center">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75 pointer-events-none"></span>
                  <button
                    onClick={() => {
                      atualizarRank(rankAtual + 1);
                      alert('Parabéns por Alcançar o rank ' + MAPEAMENTO_RANKS[rankAtual + 1]);
                    }}
                    className="hover:text-[#48bb78] transition-colors text-violet-500"
                  >
                    <ArrowUpCircleIcon className="w-8 h-8" />
                  </button>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Conteúdo Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4">
        {/* COLUNA ESQUERDA */}
        <div className="lg:col-span-4 space-y-3">
          {/* Moedas */}
          <div className="card-pagina px-4">
            <Moedas dados={personagem?.character_details?.moedas} onUpdate={atualizarMoedas} />
          </div>
          {/* Talentos */}
          <div className="secao-rpg">
            <div className="secao-header-rpg">
              <h2 className="titulo-secao-rpg">
                <span className="text-violet-500 animate-pulse text-lg">◈</span> Talentos
                <span className="text-[10px]">
                  [ {talentosAtivos?.length} / {nivelAtual + 1} ]{' '}
                </span>
              </h2>
              <button
                onClick={() => setIsModalTalentosAberto(true)}
                className="btn-secundario-rpg px-2 py-1 text-[9px]"
              >
                Gerenciar
              </button>
            </div>
            <div className=" text-sm text-slate-200 font-medium tracking-tight px-5 leading-none">
              {talentosAtivos?.map((item) => (
                <div className="text-[12px] my-2" key={item.talento.feat_id}>
                  {item.talento.feat_name}
                  <span className="text-[9px] italic font-black text-slate-600 tracking-tight">
                    <br />
                    {item.talento.feat_description}
                  </span>
                </div>
              ))}
            </div>
            {(!talentosAtivos || talentosAtivos?.length === 0) && (
              <div className="text-[10px] text-slate-800 italic p-2 text-center">
                Nenhum Talento Habilitado
              </div>
            )}
          </div>
          {/* Atributos */}
          <div className="secao-rpg">
            <div className="secao-header-rpg">
              <h2 className="titulo-secao-rpg">
                <span className="text-violet-500 animate-pulse text-lg">◈</span> Atributos
              </h2>
              <button
                onClick={() => setIsModalAtributosAberto(true)}
                className="btn-secundario-rpg mb-2 ml-2"
              >
                Gerenciar
              </button>
            </div>
            <div className="p-4">
              <Atributos dados={personagem?.character_abilities?.atributos} />
            </div>
          </div>
          {/* Reservas */}
          <div className="secao-rpg">
            <div className="secao-header-rpg">
              <h2 className="titulo-secao-rpg">
                <span className="text-violet-500 animate-pulse text-lg">◈</span> Reservas
              </h2>
            </div>
            <div className="p-6">
              <Reservas
                dados={personagem?.character_details?.reservas}
                onUpdate={atualizarReservas}
              />
            </div>
          </div>
        </div>
        {/* COLUNA CENTRAL/DIREITA */}
        <div className="lg:col-span-8 space-y-3">
          {/* Status Rápidos (CA, Iniciativa, etc) */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-2 rounded-xl text-center">
              <span className="block text-[14px] font-black uppercase text-slate-400">Defesa</span>
              <span className="text-2xl font-bold text-white">
                {calcularDefesa(personagem?.character_equipment?.armadura?.defesa ?? 10)}
              </span>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-2 rounded-xl text-center">
              <span className="block text-[14px] font-black uppercase text-slate-400">
                Iniciativa
              </span>
              <span className="text-2xl font-bold text-white">
                {10 + calcularModificador(personagem?.character_abilities?.atributos?.destreza)}
              </span>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-2 rounded-xl text-center">
              <span className="block text-[14px] font-black uppercase text-slate-400">
                Deslocamento
              </span>
              <span className="text-2xl font-bold text-white">
                {personagem?.character_details?.deslocamento}m
              </span>
            </div>
          </div>
          {/* Perícias (Grid de duas colunas) */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
            <h2 className="titulo-secao-rpg mb-4">
              <span className="text-violet-500 animate-pulse text-lg">◈</span> Perícias
            </h2>
            <div className="grid grid-cols-3 gap-x-8 gap-y-2">
              {/* Mapeie suas perícias aqui conforme o retorno do backend */}
              {Object.entries(personagem?.character_abilities?.pericias || {}).map(
                ([nome, valor]) => {
                  const atributoVinculado = mapeamentoPericias[nome];
                  const valorAtributo =
                    personagem?.character_abilities?.atributos?.[atributoVinculado] ?? 10;
                  const mod = calcularModificador(valorAtributo);
                  const total = (valor || 0) + mod;

                  return (
                    <div
                      key={nome}
                      className="flex justify-between border-b border-slate-800/50 py-1"
                    >
                      <span className="capitalize text-sm text-slate-400">{nome}</span>
                      <span className="font-bold text-violet-400">
                        {total >= 0 ? `+${total}` : total}
                      </span>
                    </div>
                  );
                },
              )}
            </div>
          </div>
          {/* Container Principal de Equipamentos */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="titulo-secao-rpg">
                <span className="text-violet-500 animate-pulse text-lg">◈</span> Equipamentos
              </h2>
              <div className="flex gap-2">
                <button className="btn-secundario-rpg">Gerenciar</button>
                <button className="px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white text-[10px] font-black uppercase rounded-md shadow-lg shadow-violet-900/20 transition-all">
                  Mochila ({personagem?.character_equipment?.mochila?.slotsOcupados || 0}/
                  {personagem?.character_equipment?.mochila?.slotsTotais || 0})
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
              <div className="space-y-4">
                <SlotSimples label="Roupa" valor={personagem?.character_equipment?.roupa} />
                <SlotSimples
                  label="Armadura"
                  valor={personagem?.character_equipment?.armadura?.nome}
                />
                <div className="bg-slate-950/40 border border-slate-800/50 rounded-xl overflow-hidden mt-2">
                  <div className="px-4 py-2.5 border-b border-slate-800/50 bg-slate-900/50">
                    <h3 className="text-[10px] font-black text-violet-500 uppercase tracking-widest">
                      Acessórios
                    </h3>
                  </div>
                  <div className="divide-y divide-slate-800/50">
                    {personagem?.character_equipment?.acessorios?.map((acessório, i) => (
                      <LinhaEquipamento key={i} label={`#${i + 1}`} item={acessório} />
                    ))}
                  </div>
                  {(!personagem?.character_equipment?.acessorios ||
                    personagem?.character_equipment?.acessorios?.length === 0) && (
                    <div className="text-[10px] text-slate-800 italic p-6 text-center">
                      Nenhum acessório equipado
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-slate-950/40 border border-slate-800/50 rounded-xl overflow-hidden mt-2">
                <div className="px-4 py-2.5 border-b border-slate-800/50 bg-slate-900/50">
                  <h3 className="text-[10px] font-black text-violet-500 uppercase tracking-widest">
                    Cintura
                  </h3>
                </div>
                <div className="divide-y divide-slate-800/50">
                  {personagem?.character_equipment?.cintura?.map((cintura, i) => (
                    <LinhaEquipamento key={i} label={`#${i + 1}`} item={cintura} />
                  ))}
                </div>
                {(!personagem?.character_equipment?.cintura ||
                  personagem?.character_equipment?.cintura?.length === 0) && (
                  <div className="text-[10px] text-slate-800 italic p-6 text-center">
                    Nenhum item equipado
                  </div>
                )}
                <div className="px-4 py-2.5 border-b border-slate-800/50 bg-slate-900/50">
                  <h3 className="text-[10px] font-black text-violet-500 uppercase tracking-widest">
                    Costas
                  </h3>
                </div>
                <div className="divide-y divide-slate-800/50">
                  {personagem?.character_equipment?.costas?.map((costas, i) => (
                    <LinhaEquipamento key={i} label={`#${i + 1}`} item={costas} />
                  ))}
                </div>
                {(!personagem?.character_equipment?.costas ||
                  personagem?.character_equipment?.costas?.length === 0) && (
                  <div className="text-[10px] text-slate-800 italic p-6 text-center">
                    Nenhum item equipado
                  </div>
                )}
                <div className="px-4 py-2.5 border-b border-slate-800/50 bg-slate-900/50">
                  <h3 className="text-[10px] font-black text-violet-500 uppercase tracking-widest">
                    Peitoral
                  </h3>
                </div>
                <div className="divide-y divide-slate-800/50">
                  {personagem?.character_equipment?.peitoral?.map((peitoral, i) => (
                    <LinhaEquipamento key={i} label={`#${i + 1}`} item={peitoral} />
                  ))}
                </div>
                {(!personagem?.character_equipment?.peitoral ||
                  personagem?.character_equipment?.peitoral?.length === 0) && (
                  <div className="text-[10px] text-slate-800 italic p-6 text-center">
                    Nenhum item equipado
                  </div>
                )}
              </div>
            </div>
            <div>
              <div className="flex h-3 grid-cols-1 md:grid-cols-2 gap-x-2 gap-y- justify-self-auto rounded-xl">
                <div
                  title="Slot de Alma"
                  className={`w-2 rounded-sm border bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)] border-cyan-400`}
                />
                <span className="block text-[8px] font-black uppercase text-slate-400">
                  Slot de Alma
                </span>
                <div
                  title="Sintonização"
                  className={`w-2 rounded-sm border bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.5)] border-violet-400`}
                />
                <span className="block text-[8px] font-black uppercase text-slate-400">
                  Sintonização
                </span>
              </div>
            </div>
          </div>
          {/* Maestrias */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
            <h2 className="titulo-secao-rpg mb-4">
              <span className="text-violet-500 animate-pulse text-lg">◈</span> Maestrias
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {maestrias?.map((m, index) => (
                <MaestriaCard key={index} dados={m} />
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Telas */}
      <ModalAtributos
        isOpen={isModalAtributosAberto}
        onClose={() => setIsModalAtributosAberto(false)}
        atributos={personagem?.character_abilities?.atributos || {}}
        xp={xpDisponivel}
        merito={personagem?.character_details?.merito || 0}
        onUpdateAtributo={atualizarAtributo}
      />
      <ModalTalentos
        isOpen={isModalTalentosAberto}
        onClose={() => setIsModalTalentosAberto(false)}
        talentos={personagem?.talento || []}
        maxEnabled={nivelAtual + 1}
        onToggle={alternarTalento}
      />
      <ModalTitulos
        isOpen={isModalTitulosAberto}
        onClose={() => setIsModalTitulosAberto(false)}
        titulos={
          personagem?.character_details?.titulos?.map((t, index) => ({
            ...t,
            identificador: index + 1, // Passamos o índice como ID para o backend
            ativo: t.ativo !== false,
            principal: t.principal !== false,
          })) || []
        }
        maxEnabled={3}
        onToggle={alternarTitulos}
      />
    </div>
  );
}
