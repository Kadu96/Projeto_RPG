import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Atributos from '../componentes/Atributos';
import Reservas from '../componentes/Reservas';
import Moedas from '../componentes/Moedas';
import SlotSimples from '../componentes/SlotSimples';
import ModalAtributos, { type AtributosData } from '../componentes/ModalAtributos';
import {
  TABELA_XP_NIVEL,
  TABELA_MERITO_NIVEL,
  podeSubirDeNivel,
  podeSubirDeRank,
} from '../utils/regrasRpg';

interface SlotEquipamento {
  nome: string;
  descricao?: string;
  tipo?: string;
  slotMagico?: boolean;
  slotAlma?: boolean;
}

interface Titulo {
  nome: string;
  principal: boolean;
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
  background_id?: number;
  background_name?: string;
  character_name?: string;
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
    titulos?: Titulo[];
    iniciativa?: number;
    deslocamento?: number;
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

const calcularModificador = (valor: number = 10) => Math.floor((valor - 10) / 2);

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

const mapeamentoRanks: Record<number, string> = {
  1: 'Recrutado',
  2: 'Vigilante',
  3: 'Guardião',
  4: 'Pretor',
  5: 'Arconte',
  6: 'Exarca',
  7: 'Primarca',
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

  const has_title = (personagem?.character_details?.titulos?.length ?? 0) > 0;
  const has_rank = (personagem?.character_details?.rank ?? 0) > 0;

  const nivelAtual = personagem?.character_details?.nivel || 1;
  const xpAtual = personagem?.character_details?.xp || 0;
  const xpProximoNivel = TABELA_XP_NIVEL[nivelAtual + 1] || 0;
  const aptoParaLevelUp = podeSubirDeNivel(nivelAtual, xpAtual);

  const rankAtual = personagem?.character_details?.rank || 1;
  const meritoAtual = personagem?.character_details?.merito || 0;
  const meritoProximoNivel = TABELA_MERITO_NIVEL[rankAtual + 1] || 0;
  const aptoParaRankUp = podeSubirDeRank(rankAtual, meritoAtual);

  const talentosHabilitados = personagem?.talento?.filter(f => f.is_enabled);
  // const talentosPassivos = personagem?.talento?.filter(f => !f.is_enabled);

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
          console.log("Dados do Personagem:", data);
          setPersonagem(data);
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
      const token = sessionStorage.getItem('token');

      if (!token) {
        console.warn('Usuário não autenticado. Salvamento cancelado.');
        return;
      }

      setSalvando(true);
      const inicio = Date.now(); // Marca o momento em que o salvamento começou
      try {
        const response = await fetch(`http://127.0.0.1:8000/personagens/${uuid}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(dados),
        });

        if (response.status === 401) {
          console.error('Sessão expirada. Redirecionando para login...');
          // Opcional: navigate("/login");
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
    const token = sessionStorage.getItem('token');
    try {
      const response = await fetch(`http://127.0.0.1:8000/personagens/${uuid}/talento/${featId}?is_enabled=${habilitar}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setPersonagem(data);
      }
    } catch (error) {
      console.error('Erro ao alternar talento:', error);
    }
  };

  const calcularDefesa = (valor: number = 10) => {
    if (personagem?.character_equipment?.armadura?.nome === '') return 10;

    const valorAtributo = personagem?.character_abilities?.atributos?.destreza ?? 0;
    const mod = calcularModificador(valorAtributo);
    const defesaBase = valor;

    if (personagem?.character_equipment?.armadura?.defFixa) return defesaBase;

    return defesaBase + mod;
  };

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
              <h2>{mapeamentoRanks[rankAtual]}</h2>
            </div>
          )}
        </div>
        {has_title && (
          <div className="flex flex-col gap-2 mb-6 p-6">
            {personagem?.character_details?.titulos?.map((titulo, index) =>
              titulo.principal ? (
                /* DESTAQUE: Título Principal */
                <div
                  key={index}
                  className="flex items-center gap-2 group cursor-default"
                  title="Título Principal"
                >
                  <span className="text-violet-500 animate-pulse text-lg">◈</span>
                  <h2 className="text-2xl font-black uppercase tracking-tighter text-white drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]">
                    {titulo.nome}
                  </h2>
                </div>
              ) : (
                /* SECUNDÁRIOS: Menores e mais discretos */
                <div
                  key={index}
                  className="flex items-center gap-2 ml-1 opacity-60 hover:opacity-100 transition-opacity"
                >
                  <span className="text-slate-600 text-xs">◇</span>
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    {titulo.nome}
                  </span>
                </div>
              ),
            )}
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* COLUNA ESQUERDA: Atributos e Reservas (Vida/Mana) */}
        <div className="lg:col-span-4 space-y-5">
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
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
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
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
              </span>
            )}
          </div>
          {/* Moedas */}
          <div className="card-pagina px-4">
            <Moedas dados={personagem?.character_details?.moedas} onUpdate={atualizarMoedas} />
          </div>
          {/* Talentos */}
          <div className="bg-slate-950/40 border border-slate-800/50 rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 border-b border-slate-800/50 bg-slate-900/50 flex justify-between items-center">
              <h2 className="titulo-secao-rpg flex items-center gap-2">
                <span className="text-violet-500 animate-pulse text-lg">◈</span> Talentos
              </h2>
              <button
                onClick={() => setIsModalTalentosAberto(true)}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-violet-400 text-[9px] font-black uppercase rounded-md border border-violet-900/30 transition-all"
              >
                Gerenciar
              </button>
            </div>
            <div className="divide-y divide-slate-800/50 text-sm text-slate-200 font-medium tracking-tight p-3">
              {talentosHabilitados?.map(item => (
                <div className='text-[12px]'
                  key={item.talento.feat_id}>{item.talento.feat_name} 
                  <span className='text-[9px] italic font-black text-slate-600 tracking-tight'><br/>{item.talento.feat_description}</span>              
                </div>
              ))}
            </div>
            {(!talentosHabilitados ||
              talentosHabilitados?.length === 0) && (
              <div className="text-[10px] text-slate-800 italic p-2 text-center">
                Nenhum Talento Habilitado
              </div>
            )}
          </div>
          {/* Atributos */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
            <div className="flex justify-between items-center mb-4 ml-2">
              <h2 className="titulo-secao-rpg mb-6 items-center gap-2">
                <span className="text-violet-500 animate-pulse text-lg">◈</span> Atributos
              </h2>
              <button
                onClick={() => setIsModalAtributosAberto(true)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-violet-400 text-[10px] font-black uppercase rounded-md border border-violet-900/30 transition-all mb-2 ml-2"
              >
                <span className="text-[10px] font-bold uppercase tracking-tighter">Gerenciar</span>
              </button>
            </div>
            <Atributos dados={personagem?.character_abilities?.atributos} />
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
            <h2 className="titulo-secao-rpg mb-6 flex items-center gap-2">
              <span className="text-violet-500 animate-pulse text-lg">◈</span> Reservas
            </h2>
            <Reservas
              dados={personagem?.character_details?.reservas}
              onUpdate={atualizarReservas}
            />
          </div>
        </div>
        {/* COLUNA CENTRAL/DIREITA: Detalhes, Perícias e Equipamentos */}
        <div className="lg:col-span-8 space-y-8">
          {/* Status Rápidos (CA, Iniciativa, etc) */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-center">
              <span className="block text-[10px] font-black uppercase text-slate-500">Defesa</span>
              <span className="text-2xl font-bold text-white">
                {calcularDefesa(personagem?.character_equipment?.armadura?.defesa ?? 10)}
              </span>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-center">
              <span className="block text-[10px] font-black uppercase text-slate-500">
                Iniciativa
              </span>
              <span className="text-2xl font-bold text-white">
                {10 + calcularModificador(personagem?.character_abilities?.atributos?.destreza)}
              </span>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-center">
              <span className="block text-[10px] font-black uppercase text-slate-500">
                Deslocamento
              </span>
              <span className="text-2xl font-bold text-white">
                {personagem?.character_details?.deslocamento}m
              </span>
            </div>
          </div>
          {/* Perícias (Grid de duas colunas) */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
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
            <div className="flex justify-between items-center mb-8">
              <h2 className="titulo-secao-rpg flex items-center gap-2">
                <span className="text-violet-500 animate-pulse text-lg">◈</span> Equipamentos
              </h2>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-violet-400 text-[10px] font-black uppercase rounded-md border border-violet-900/30 transition-all">
                  Gerenciar
                </button>
                <button className="px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white text-[10px] font-black uppercase rounded-md shadow-lg shadow-violet-900/20 transition-all">
                  Mochila ({personagem?.character_equipment?.mochila?.slotsOcupados || 0}/
                  {personagem?.character_equipment?.mochila?.slotsTotais || 0})
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
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
          </div>
        </div>
      </div>
      <ModalAtributos
        isOpen={isModalAtributosAberto}
        onClose={() => setIsModalAtributosAberto(false)}
        atributos={personagem?.character_abilities?.atributos || {}}
        xp={personagem?.character_details?.xp || 0}
        merito={personagem?.character_details?.merito || 0}
        onUpdateAtributo={atualizarAtributo}
      />
      <ModalTalentos
        isOpen={isModalTalentosAberto}
        onClose={() => setIsModalTalentosAberto(false)}
        talentos={personagem?.talento || []}
        onToggle={alternarTalento}
      />
    </div>
  );
}
