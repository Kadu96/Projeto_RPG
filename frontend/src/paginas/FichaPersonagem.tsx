import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import "./FichaPersonagem.css";
import Atributos from "../componentes/Atributos";
import Reservas from "../componentes/Reservas";
import EquipamentoCard from "../componentes/Equipamentos";

type PersonagemDetalhe = {
  id: number;
  nome_personagem: string;
  sexo_personagem?: string;
  raca_personagem?: string;
  idade_personagem?: number;
  altura_personagem?: string;
  peso_personagem?: string;
  antecedente?: string;
  tendencia?: string;
  nivel_personagem?: number;
  pontos_experiencia?: number;
  pontos_merito?: number;
  rank?: string;
  algibeira?: {
    ouro?: number;
    prata?: number;
    cobre?: number;
  };
  atributos?: {
    forca?: number;
    destreza?: number;
    constituicao?: number;
    inteligencia?: number;
    sabedoria?: number;
    carisma?: number;
  };
  equipamentos?: {
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
    acessorios?: {
      nome?: string;
      efeito?: string;
      tipo?: string;
      slotMagico?: boolean;
      slotAlma?: boolean;
    };
    cintura?: {
      slot1?: {
        nome?: string;
        descricao?: string; 
        tipo?: string;
        slotMagico?: boolean;
        slotAlma?: boolean;     
      };
      slot2?: {
        nome?: string;
        descricao?: string;
        tipo?: string;
        slotMagico?: boolean;
        slotAlma?: boolean;
      };
    };
    costas?: {
      slot1?: {
        nome?: string;
        descricao?: string; 
        tipo?: string;
        slotMagico?: boolean;
        slotAlma?: boolean;     
      };
      slot2?: {
        nome?: string;
        descricao?: string;
        tipo?: string;
        slotMagico?: boolean;
        slotAlma?: boolean;
      };
    };
    peitoral?: {
      slot1?: {
        nome?: string;
        descricao?: string; 
        tipo?: string;
        slotMagico?: boolean;
        slotAlma?: boolean;     
      };
      slot2?: {
        nome?: string;
        descricao?: string;
        tipo?: string;
        slotMagico?: boolean;
        slotAlma?: boolean;
      };
    };
  };
  info_combate?: {
    ca?: number;
    iniciativa?: number;
    deslocamento?: number;
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

export default function FichaPersonagem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [personagem, setPersonagem] = useState<PersonagemDetalhe | null>(null);
  const [mostrar, setMostrar] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [dano, setDano] = useState<string>("0");
  const [mana, setMana] = useState<string>("0");
  const [vigor, setVigor] = useState<string>("0");

  // Carregamento dos dados do personagem
  useEffect(() => {
    const fetchPersonagem = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://127.0.0.1:8000/personagem/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.detail || "Erro ao carregar ficha");
        }

        const data = await response.json();
        setPersonagem(data);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Falha ao carregar a ficha";
        console.error("Erro ao carregar ficha:", error);
        setErro(message);
      }
    };

    if (id) {
      fetchPersonagem();
    }
  }, [id]);

  // Modificador de Atributo
  const calcularModificador = (atributo?: number) => {
    if (atributo === undefined) return 0;
    return Math.floor((atributo - 10) / 2);
  };

  // Atualização das reservas no backend
  const atualizarReservas = async () => {
    if (!personagem?.id) {
      setErro("Personagem não carregado para atualização.");
      return;
    }

    const novaVida = (personagem.reservas?.vida?.atual || 0) - Number(dano);
    const novaMana = (personagem.reservas?.mana?.atual || 0) - Number(mana);
    const novoVigor = (personagem.reservas?.vigor?.atual || 0) - Number(vigor);

    // Garanta que os valores finais sejam números inteiros
    const payload = {
      ...personagem,
      reservas: {
        ...personagem.reservas,
        vida: {
          ...personagem.reservas?.vida,
          atual: novaVida >= 0 ? novaVida : 0,
        },
        mana: {
          ...personagem.reservas?.mana,
          atual: novaMana >= 0 ? novaMana : 0,
        },
        vigor: {
          ...personagem.reservas?.vigor,
          atual: novoVigor >= 0 ? novoVigor : 0,
        },
      },
    };

    setLoading(true);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/personagem/atualizar/${personagem.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Erro ao atualizar personagem");
      }

      const data = await response.json();
      setPersonagem(data);
      setDano("0");
      setMana("0");
      setVigor("0");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Falha ao aplicar dano";
      console.error("Erro ao aplicar dano:", error);
      setErro(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ficha-container">   {/*Container G1*/}
      <div className="ficha-header">    {/*Header G2*/}
        <button className="btn-secondary" onClick={() => navigate("/dashboard")}> Voltar
        </button>
        <h1>
          {personagem?.nome_personagem}
          <span style={{ marginLeft: "20px", fontSize: "20px" }}>
            [{" "}
             {personagem?.nivel_personagem ? personagem?.nivel_personagem : "1"}{" "}
             ]
           </span>
         </h1>
      </div>
      <div className="ficha-notify">
        <input type="checkbox" onClick={() => setMostrar(!mostrar)} />
        {mostrar && (
          <div style={{ display: "flex", alignItems: "center" }}>
            <label
              style={{
                fontWeight: "bold",
                fontSize: "20px",
                marginRight: "20px",
                color: "rgb(113, 255, 85)",
              }}
            >Subir de Nível Disponível!!!
            </label>
            <button
              className="btn-secondary"
              onClick={() =>
                alert("Função de promoção ainda não implementada")
              }
            > Promover
            </button>
          </div>
        )}
      </div>
      <div className="ficha-layout">    {/*Layout G2*/}
        <div about="Info Básica" className="info-section">  {/*Seção G3*/}
          <div className="info-item">
            <span className="info-label">Raça:</span>
            <span className="info-value"> {personagem?.raca_personagem || "Não informado"}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Antecedente:</span>
            <span className="info-value"> {personagem?.antecedente || "Não informado"}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Tendência:</span>
            <span className="info-value"> {personagem?.tendencia || "Não informado"}</span>
          </div>
          <div about="Detalhes" className="info-section" style={{display: 'flex', flexWrap: 'wrap', minWidth: '50%'}}>  {/*Seção G3*/}
            <span className="info-label">Sexo:</span>{" "}
            <span className="info-value"> {personagem?.sexo_personagem || "Não informado"}</span>
            <span className="info-label">Idade:</span>{" "}
            <span className="info-value"> {personagem?.idade_personagem ?? "Não informado"}</span>
            <span className="info-label">Altura:</span>{" "}
            <span className="info-value"> {personagem?.altura_personagem || "Não informado"}&nbsp;m</span>
            <span className="info-label">Peso:</span>{" "}
            <span className="info-value"> {personagem?.peso_personagem || "Não informado"}&nbsp;Kg</span>
          </div>
        </div>
        <div about="Evolucao" className="info-section">  {/*Seção G3*/}
          <div about="pontos_XP" className="info-item">
            <span className="info-label">Experiência</span>
            <span className="info-value"> {personagem?.pontos_experiencia || 0}</span>
          </div>
          <div about="pontos_Merito" className="info-item">
            <span className="info-label">Mérito</span>
            <span className="info-value"> {personagem?.pontos_merito || 0}</span>
          </div>          
          <div about="rank_Militar" style={{ display: "flex", marginTop: "20px", gap: "10px", alignItems: "center" }}>
            <strong className="info-label" style={{ minWidth: "100px" }}>Rank Militar</strong>
            <label className="info_value">
              {personagem?.rank?.toString() || "Não informado"}
            </label>
            <input type="checkbox" onClick={() => setMostrar(!mostrar)} />
            {mostrar && (
              <div style={{ display: "flex", alignItems: "center" }}>
                <label
                  style={{
                    fontWeight: "bold",
                    fontSize: "20px",
                    color: "rgb(113, 255, 85)",
                  }}
                >
                  Promoção de Rank Militar Disponível!!!
                </label>
                <button
                  className="btn-secondary"
                  onClick={() =>
                    alert("Função de promoção ainda não implementada")
                  }
                >
                  Promover
                </button>
              </div>
            )}
          </div> 
          <div about="Algibeira" className="info-section" style={{marginTop:'20px'}}>  {/*Seção G3*/}
            <div about="moedaOuro" className="info-item">
              <span className="info-label">Ouro</span>
              <input
                type="number"
                className="info-value"
                value={personagem?.algibeira?.ouro || 0}
                onChange={(e) =>
                  setPersonagem({
                    ...personagem!,
                    algibeira: {
                      ...personagem?.algibeira,
                      ouro: parseInt(e.target.value) || 0,
                    },
                  })
                }
              />
            </div>
            <div about="moedaPrata" className="info-item">
              <span className="info-label">Prata</span>
              <input
                type="number"
                className="info-value"
                value={personagem?.algibeira?.prata || 0}
                onChange={(e) =>
                  setPersonagem({
                    ...personagem!,
                    algibeira: {
                      ...personagem?.algibeira,
                      prata: parseInt(e.target.value) || 0,
                    },
                  })
                }
              />
            </div>
            <div about="moedaCobre" className="info-item">
              <span className="info-label">Cobre</span>
              <input
                type="number"
                className="info-value"
                value={personagem?.algibeira?.cobre || 0}
                onChange={(e) =>
                  setPersonagem({
                    ...personagem!,
                    algibeira: {
                      ...personagem?.algibeira,
                      cobre: parseInt(e.target.value) || 0,
                    },
                  })
                }
              />
            </div>
          </div>       
        </div>
        <div about="Atributos" className="info-section">  {/*Seção G3*/}
          <div style={{display: 'flex'}}>
            <h2>Atributos</h2>
            <button className="btn-secondary" style={{marginLeft: 'auto', height: '50px'}} onClick={() => alert("Função de evolução de atributos ainda não implementada")}> Gerenciar Atributos</button>
          </div>
          <div className="atributos-grid"> {/*Grid para os atributos G4*/}
            <Atributos label="Força" value={personagem?.atributos?.forca} />  
            <Atributos label="Destreza" value={personagem?.atributos?.destreza} />
            <Atributos label="Constituição" value={personagem?.atributos?.constituicao} />
            <Atributos label="Inteligência" value={personagem?.atributos?.inteligencia} />
            <Atributos label="Sabedoria" value={personagem?.atributos?.sabedoria} />
            <Atributos label="Carisma" value={personagem?.atributos?.carisma} />
          </div>
        </div>
        <div about="Reservas" className="info-section">  {/*Seção G3*/}
          <h2>Reservas</h2>
          <div className="atributos-grid">
            <Reservas label="Vida" atual={personagem?.reservas?.vida?.atual} maximo={personagem?.reservas?.vida?.maximo} />
            <Reservas label="Mana" atual={personagem?.reservas?.mana?.atual} maximo={personagem?.reservas?.mana?.maximo} />
            <Reservas label="Vigor" atual={personagem?.reservas?.vigor?.atual} maximo={personagem?.reservas?.vigor?.maximo} />
          </div>
          <div about="gastoReservas" style={{display: 'flex', alignItems: 'center', marginTop: '20px'}}>
            <strong className="info-label" style={{minWidth: '100px'}}>Controle de Reservas</strong>
            <input type="number" className="info-value" placeholder="Dano" value={dano} disabled={!personagem} onBlur={() => atualizarReservas()} onChange={(e) => setDano(e.target.value)} onFocus={(e) => e.target.select()} />
            <input type="number" className="info-value" placeholder="Mana" value={mana} disabled={!personagem} onBlur={() => atualizarReservas()} onChange={(e) => setMana(e.target.value)} onFocus={(e) => e.target.select()} />
            <input type="number" className="info-value" placeholder="Vigor" value={vigor} disabled={!personagem} onBlur={() => atualizarReservas()} onChange={(e) => setVigor(e.target.value)} onFocus={(e) => e.target.select()} />
          </div>
        </div>
        <div about="Pericias" className="pericias-container"> {/*Seção G3*/}
          <h2>Perícias</h2>
          <div className="pericias-header">
            <span className="pericia-label-topo"></span>
            <span className="pericia-label-topo">Mod</span>
            <span className="pericia-label-topo">Passiva</span>
          </div>
          <div className="pericias-lista"> {/*Lista para as perícias G4*/}
              <div className="pericia-linha">
                <span className="pericia-nome">Acrobacia</span>
                <span className="pericia-valor">{calcularModificador(personagem?.atributos?.destreza)}</span>
                <span className="pericia-valor">{10 + calcularModificador(personagem?.atributos?.destreza)}</span>
              </div>
              <div className="pericia-linha">
                <span className="pericia-nome">Adestramento</span>
                <span className="pericia-valor">{calcularModificador(personagem?.atributos?.sabedoria)}</span>
                <span className="pericia-valor">{10 + calcularModificador(personagem?.atributos?.sabedoria)}</span>
              </div>
              <div className="pericia-linha">
                <span className="pericia-nome">Arcanismo</span>
                <span className="pericia-valor">{calcularModificador(personagem?.atributos?.inteligencia)}</span>
                <span className="pericia-valor">{10 + calcularModificador(personagem?.atributos?.inteligencia)}</span>
              </div>
              <div className="pericia-linha">
                <span className="pericia-nome">Atletismo</span>
                <span className="pericia-valor">{calcularModificador(personagem?.atributos?.forca)}</span>
                <span className="pericia-valor">{10 + calcularModificador(personagem?.atributos?.forca)}</span>
              </div>
              <div className="pericia-linha">
                <span className="pericia-nome">Atuação</span>
                <span className="pericia-valor">{calcularModificador(personagem?.atributos?.carisma)}</span>
                <span className="pericia-valor">{10 + calcularModificador(personagem?.atributos?.carisma)}</span>
              </div>
              <div className="pericia-linha">
                <span className="pericia-nome">Enganação</span>
                <span className="pericia-valor">{calcularModificador(personagem?.atributos?.carisma)}</span>
                <span className="pericia-valor">{10 + calcularModificador(personagem?.atributos?.carisma)}</span>
              </div>
              <div className="pericia-linha">
                <span className="pericia-nome">Furtividade</span>
                <span className="pericia-valor">{calcularModificador(personagem?.atributos?.destreza)}</span>
                <span className="pericia-valor">{10 + calcularModificador(personagem?.atributos?.destreza)}</span>
              </div>
              <div className="pericia-linha">
                <span className="pericia-nome">História</span>
                <span className="pericia-valor">{calcularModificador(personagem?.atributos?.inteligencia)}</span>
                <span className="pericia-valor">{10 + calcularModificador(personagem?.atributos?.inteligencia)}</span>
              </div>
              <div className="pericia-linha">
                <span className="pericia-nome">Indimidação</span>
                <span className="pericia-valor">{calcularModificador(personagem?.atributos?.carisma)}</span>
                <span className="pericia-valor">{10 + calcularModificador(personagem?.atributos?.carisma)}</span>
              </div>
              <div className="pericia-linha">
                <span className="pericia-nome">Intuição</span>
                <span className="pericia-valor">{calcularModificador(personagem?.atributos?.sabedoria)}</span>
                <span className="pericia-valor">{10 + calcularModificador(personagem?.atributos?.sabedoria)}</span>
              </div>
              <div className="pericia-linha">
                <span className="pericia-nome">Investigação</span>
                <span className="pericia-valor">{calcularModificador(personagem?.atributos?.inteligencia)}</span>
                <span className="pericia-valor">{10 + calcularModificador(personagem?.atributos?.inteligencia)}</span>
              </div>
              <div className="pericia-linha">
                <span className="pericia-nome">Medicina</span>
                <span className="pericia-valor">{calcularModificador(personagem?.atributos?.sabedoria)}</span>
                <span className="pericia-valor">{10 + calcularModificador(personagem?.atributos?.sabedoria)}</span>
              </div>
              <div className="pericia-linha">
                <span className="pericia-nome">Natureza</span>
                <span className="pericia-valor">{calcularModificador(personagem?.atributos?.inteligencia)}</span>
                <span className="pericia-valor">{10 + calcularModificador(personagem?.atributos?.inteligencia)}</span>
              </div>
              <div className="pericia-linha">
                <span className="pericia-nome">Percepção</span>
                <span className="pericia-valor">{calcularModificador(personagem?.atributos?.sabedoria)}</span>
                <span className="pericia-valor">{10 + calcularModificador(personagem?.atributos?.sabedoria)}</span>
              </div>
              <div className="pericia-linha">
                <span className="pericia-nome">Persuasão</span>
                <span className="pericia-valor">{calcularModificador(personagem?.atributos?.carisma)}</span>
                <span className="pericia-valor">{10 + calcularModificador(personagem?.atributos?.carisma)}</span>
              </div>
              <div className="pericia-linha">
                <span className="pericia-nome">Prestidigitação</span>
                <span className="pericia-valor">{calcularModificador(personagem?.atributos?.destreza)}</span>
                <span className="pericia-valor">{10 + calcularModificador(personagem?.atributos?.destreza)}</span>
              </div>
              <div className="pericia-linha">
                <span className="pericia-nome">Religião</span>
                <span className="pericia-valor">{calcularModificador(personagem?.atributos?.inteligencia)}</span>
                <span className="pericia-valor">{10 + calcularModificador(personagem?.atributos?.inteligencia)}</span>
              </div>
              <div className="pericia-linha">
                <span className="pericia-nome">Sobrevivência</span>
                <span className="pericia-valor">{calcularModificador(personagem?.atributos?.sabedoria)}</span>
                <span className="pericia-valor">{10 + calcularModificador(personagem?.atributos?.sabedoria)}</span>
              </div>
          </div>
        </div>
        <div about="Equipamentos" className="equip-section">  {/*Seção G3*/}
          <div style={{display: 'flex'}}>
            <h2>Equipamentos</h2>
            <button className="btn-secondary" style={{marginLeft: 'auto', height: '50px'}} onClick={() => alert("Função de evolução de atributos ainda não implementada")}> Gerenciar Eqipamentos</button>
          </div>
          <div className="equipamentos-grid"> {/*Grid para os equipamentos G4*/}
            <EquipamentoCard dados={personagem?.equipamentos} />                
          </div>
        </div>
      </div>
    </div>
  );  
}