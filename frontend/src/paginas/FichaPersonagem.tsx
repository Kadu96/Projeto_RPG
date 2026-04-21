import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Atributos from "../componentes/Atributos";
import Reservas from "../componentes/Reservas";
import Moedas from "../componentes/Moedas";
import SlotSimples from "../componentes/SlotSimples";
import SlotDuplo from "../componentes/SlotDuplo";

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
  character_details?: {
    ca?: number;
    titulos?: Titulo[];
    iniciativa?: number;
    deslocamento?: number;
    xp?: number;
    merito?: number;
    nivel?: number;
    rank?: string;
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
    };
    acessorios?: SlotEquipamento[];
    cintura?: {
      slot1?: SlotEquipamento;
      slot2?: SlotEquipamento;
    };
    costas?: {
      slot1?: SlotEquipamento;
      slot2?: SlotEquipamento;
    };
    peitoral?: {
      slot1?: SlotEquipamento;
      slot2?: SlotEquipamento;
    };
  };
}

function LinhaEquipamento({
  label,
  item,
}: {
  label: string;
  item?: SlotEquipamento | string;
}) {
  const nomeItem = typeof item === "object" ? item?.nome : item;
  const isAlma = typeof item === "object" ? item?.slotAlma : false;
  const isMagico = typeof item === "object" ? item?.slotMagico : false;

  return (
    <div className="group flex items-center justify-between bg-slate-950/40 border border-slate-800/50 p-2.5 rounded-lg hover:border-violet-500/30 transition-all">
      <div className="flex flex-col">
        <span className="text-[9px] font-black text-slate-600 uppercase tracking-tight">
          {label}
        </span>
        <span
          className={
            nomeItem
              ? "text-sm text-slate-200 font-medium"
              : "text-sm text-slate-800 italic"
          }
        >
          {nomeItem || ""}
        </span>
      </div>

      {/* Indicadores Laterais */}
      <div className="flex gap-1.5">
        <div
          title="Slot de Alma"
          className={`w-2 h-4 rounded-sm border ${isAlma ? "bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)] border-cyan-400" : "bg-slate-900 border-slate-800"}`}
        />
        <div
          title="Sintonização"
          className={`w-2 h-4 rounded-sm border ${isMagico ? "bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.5)] border-violet-400" : "bg-slate-900 border-slate-800"}`}
        />
      </div>
    </div>
  );
}

export default function FichaPersonagem() {
  const { uuid } = useParams();
  const [personagem, setPersonagem] = useState<PersonagemDetalhe | null>(null);
  const [carregando, setCarregando] = useState(false);

  // Carregamento dos dados do personagem
  useEffect(() => {
    const buscarPersonagens = async () => {
      const token = localStorage.getItem("token");
      console.log("Token enviado:", token);
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/personagens/${uuid}`,
          {
            method: "GET",
            headers: {
              // O espaço entre 'Bearer' e o token é obrigatório
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        if (response.ok) {
          const data = await response.json();
          setPersonagem(data);
        } else if (response.status === 401) {
          // Token expirado ou inválido
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
      } catch (error) {
        console.error("Erro ao carregar personagens:", error);
      } finally {
        setCarregando(false);
      }
    };
    buscarPersonagens();
  }, [uuid]);

  const autoSave = useCallback(
    async (dados: PersonagemDetalhe) => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.warn("Usuário não autenticado. Salvamento cancelado.");
        return;
      }

      try {
        const response = await fetch(
          `http://127.0.0.1:8000/personagens/${uuid}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(dados),
          },
        );

        if (response.status === 401) {
          console.error("Sessão expirada. Redirecionando para login...");
          // Opcional: navigate("/login");
          return;
        }

        if (response.ok) {
          console.log("Sincronizado com o plano astral...");
        }
      } catch (error) {
        console.error("Erro na conexão ao salvar:", error);
      }
    },
    [uuid],
  ); // Só recria a função se o UUID do personagem mudar

  useEffect(() => {
    if (!personagem) return;

    const delayDebounceFn = setTimeout(() => {
      autoSave(personagem);
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [personagem, autoSave]);

  const atualizarReservas = (
    tipo: "vida" | "mana" | "vigor",
    valor: number,
  ) => {
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

  const atualizarMoedas = (tipo: "ouro" | "prata" | "cobre", valor: number) => {
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

  console.log("Conteúdo de character_details:", personagem?.character_details);
  return (
    <div className="container mx-auto px-6 py-8 bg-slate-950 min-h-screen text-slate-200">
      <div className="flex justify-between items-center bg-slate-900 border border-slate-800 p-6 rounded-2xl mb-8 shadow-xl">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-white">
            {personagem?.character_name}{" "}
            <span className="text-2xl font-black text-violet-400">
              [ {personagem?.character_details?.nivel || 0} ]
            </span>
          </h1>
          <div className="flex gap-4 mt-2 text-violet-400 font-bold uppercase text-xs tracking-widest">
            <span>{personagem?.race_name}</span>
            <span className="text-slate-700">|</span>
            <span>{personagem?.character_info?.tendencia}</span>
          </div>
        </div>
        {/* Seção de Títulos */}
        <div className="flex flex-col gap-2 mb-6">
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* COLUNA ESQUERDA: Atributos e Reservas (Vida/Mana) */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-slate-900 border border-slate-800 px-4 rounded-2xl shadow-lg">
            <Moedas
              dados={personagem?.character_details?.moedas}
              onUpdate={atualizarMoedas}
            />
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
            <div className="flex justify-between items-center mb-4 ml-2">
              <h2 className="text-xs font-black uppercase text-slate-500 mb-6 flex items-center gap-2">
                <span className="w-2 h-2 bg-violet-500 rounded-full animate-pulse" />
                Atributos
              </h2>
              <button
                onClick={() => alert("Abrindo edição de atributos...")}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-violet-400 text-[10px] font-black uppercase rounded-md border border-violet-900/30 transition-all mb-2 ml-2"
              >
                <span className="text-[10px] font-bold uppercase tracking-tighter">
                  Gerenciar
                </span>
              </button>
            </div>
            <Atributos dados={personagem?.character_abilities?.atributos} />
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
            <h2 className="text-xs font-black uppercase text-slate-500 mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-violet-500 rounded-full animate-pulse" />
              Reservas
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
              <span className="block text-[10px] font-black uppercase text-slate-500">
                Defesa
              </span>
              <span className="text-2xl font-bold text-white">
                {personagem?.character_details?.ca}
              </span>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-center">
              <span className="block text-[10px] font-black uppercase text-slate-500">
                Iniciativa
              </span>
              <span className="text-2xl font-bold text-white">
                {personagem?.character_details?.iniciativa}
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
            <h2 className="text-xs font-black uppercase text-slate-500 mb-4">
              Perícias
            </h2>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2">
              {/* Mapeie suas perícias aqui conforme o retorno do backend */}
              {Object.entries(
                personagem?.character_abilities?.pericias || {},
              ).map(([nome, valor]) => (
                <div
                  key={nome}
                  className="flex justify-between border-b border-slate-800/50 py-1"
                >
                  <span className="capitalize text-sm text-slate-400">
                    {nome}
                  </span>
                  <span className="font-bold text-violet-400">+{valor}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Container Principal de Equipamentos */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
            <div className="flex justify-between items-center mb-8">
              <h2 className="titulo-secao-rpg flex items-center gap-2">
                <span className="text-violet-500">◈</span> EQUIPAMENTOS
                EQUIPADOS
              </h2>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-violet-400 text-[10px] font-black uppercase rounded-md border border-violet-900/30 transition-all">
                  Gerenciar
                </button>
                <button className="px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white text-[10px] font-black uppercase rounded-md shadow-lg shadow-violet-900/20 transition-all">
                  Mochila (
                  {personagem?.character_equipment?.mochila?.slotsOcupados || 0}
                  /{personagem?.character_equipment?.mochila?.slotsTotais || 0})
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
              <div className="space-y-4">
                <SlotSimples
                  label="Roupa"
                  valor={personagem?.character_equipment?.roupa}
                />
                <SlotSimples
                  label="Armadura"
                  valor={personagem?.character_equipment?.armadura?.nome}
                />
                <div className="space-y-3">
                  <h3 className="text-[10px] font-black text-violet-500 uppercase tracking-widest mb-2">
                    Acessórios
                  </h3>
                  {personagem?.character_equipment?.acessorios?.map(
                    (acessório, i) => (
                      <LinhaEquipamento
                        key={i}
                        label={`Acessório ${i + 1}`}
                        item={acessório}
                      />
                    ),
                  )}
                  {(!personagem?.character_equipment?.acessorios ||
                    personagem?.character_equipment?.acessorios?.length ===
                      0) && (
                    <div className="text-[10px] text-slate-800 italic p-2 border border-dashed border-slate-800 rounded-lg text-center">
                      Nenhum acessório equipado
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <SlotDuplo
                  label="Cintura"
                  s1={personagem?.character_equipment?.cintura?.slot1?.nome}
                  s2={personagem?.character_equipment?.cintura?.slot2?.nome}
                />
                <SlotDuplo
                  label="Costas"
                  s1={personagem?.character_equipment?.costas?.slot1?.nome}
                  s2={personagem?.character_equipment?.costas?.slot2?.nome}
                />
                <SlotDuplo
                  label="Peitoral"
                  s1={personagem?.character_equipment?.peitoral?.slot1?.nome}
                  s2={personagem?.character_equipment?.peitoral?.slot2?.nome}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
