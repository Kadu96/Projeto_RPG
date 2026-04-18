import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';

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
  patente?: string;
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
    mochila?: {
      descricao?: string;
      slotsOcupados?: number;
      slotsTotais?: number;
    };
    armadura?: {
      nome?: string;
      descricao?: string;
    };
    acessorios?: string;
  };
  info_combate?: Record<string, unknown>;
  reservas?: {
    vida?: {
      atual?: number;
      maximo?: number;
      dado?: string;
    };
    mana?: {
      atual?: number;
      maximo?: number;
      dado?: string;
    };
    vigor?: {
      atual?: number;
      maximo?: number;
      dado?: string;
    };
  };
};

export default function FichaPersonagem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [personagem, setPersonagem] = useState<PersonagemDetalhe | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [mostrar, setMostrar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dano, setDano] = useState<string>('0');
  const [mana, setMana] = useState<string>('0');
  const [vigor, setVigor] = useState<string>('0');
  
  // 1. Cálculo em tempo real para a interface
  const vidaAtual = personagem?.reservas?.vida?.atual ?? 0;
  const vidaCalculada = vidaAtual - (parseInt(dano) || 0);
  const vidaFinal = vidaCalculada < 0 ? 0 : vidaCalculada;
  const manaAtual = personagem?.reservas?.mana?.atual ?? 0;
  const manaCalculada = manaAtual - (parseInt(mana) || 0);
  const manaFinal = manaCalculada < 0 ? 0 : manaCalculada;
  const vigorAtual = personagem?.reservas?.vigor?.atual ?? 0;
  const vigorCalculado = vigorAtual - (parseInt(vigor) || 0);
  const vigorFinal = vigorCalculado < 0 ? 0 : vigorCalculado;


  const salvarAlteracoes = async () => {
    if (!personagem) return;
    setLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:8000/personagem/atualizar/${personagem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(personagem),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Erro ao salvar alterações');
      }

      const data = await response.json();
      setPersonagem(data);
      alert('Alterações salvas com sucesso!');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Falha ao salvar alterações';
      console.error('Erro ao salvar alterações:', error);
      setErro(message);
    } finally {
      setLoading(false);
    }
  };

  const atualizarReservas = async () => {
    if (parseInt(dano) <= 0) return; // Não faz nada se o dano for zero ou negativo

    try {
      const response = await fetch(`http://127.0.0.1:8000/personagem/atualizar/${personagem?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ ...personagem, reservas: { ...personagem?.reservas, vida: { ...personagem?.reservas?.vida, atual: vidaFinal } } }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Erro ao atualizar personagem');
      }

      const data = await response.json();
      setPersonagem(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Falha ao aplicar dano';
      console.error('Erro ao aplicar dano:', error);
      setErro(message);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    const fetchPersonagem = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://127.0.0.1:8000/personagem/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.detail || 'Erro ao carregar ficha');
        }

        const data = await response.json();
        setPersonagem(data);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Falha ao carregar a ficha';
        console.error('Erro ao carregar ficha:', error);
        setErro(message);
      }
    };

    if (id) {
      fetchPersonagem();
    }
  }, [id]);

  return (
    <div style={{ padding: '20px', maxWidth: '680px', margin: '0 auto', color: '#eee', backgroundColor: '#222', borderRadius: '8px' }}>
      <button onClick={() => navigate('/dashboard')} style={{ ...btnStyle, marginBottom: '20px' }}>
        Voltar
      </button>
      <div> 
        <h1>{personagem?.nome_personagem}
          <span style={{marginLeft:'20px', fontSize:'20px'}}>[ {personagem?.nivel_personagem ? personagem?.nivel_personagem : '1'} ]</span>
        </h1>
        <div>
          <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px', lineHeight: '1.5'}}>
            <span style={{ whiteSpace: 'nowrap' }}><strong style={{maxWidth: '35%'}}>Raça:</strong> {personagem?.raca_personagem || 'Não informado'}</span>
            <span style={{ whiteSpace: 'nowrap' }}><strong style={{maxWidth: '35%'}}>Antecedente:</strong> {personagem?.antecedente || 'Não informado'}</span>
            <span style={{ whiteSpace: 'nowrap' }}><strong style={{maxWidth: '35%'}}>Tendência:</strong> {personagem?.tendencia || 'Não informado'}</span>
          </div>
          <div style={{margin: '15px', display: 'flex', flexWrap: 'wrap', gap: '10px', lineHeight: '1.5'}}>
            <strong style={{maxWidth: '35%'}}>Sexo:</strong> {personagem?.sexo_personagem || 'Não informado'}
            <strong style={{maxWidth: '35%'}}>Idade:</strong> {personagem?.idade_personagem ?? 'Não informado'}
            <strong style={{maxWidth: '35%'}}>Altura:</strong> {personagem?.altura_personagem || 'Não informado'}<label> m</label>
            <strong style={{maxWidth: '35%'}}>Peso:</strong> {personagem?.peso_personagem || 'Não informado'}<label> Kg</label>
          </div>
        </div> 
        <hr style={{ marginTop: '20px', marginBottom: '15px', borderColor: '#666' }} /> 
        <div style={{gap:'10px'}}> {/* Pontos de Evolução */}
          <strong style={{maxWidth:'50%'}}>Pontos de Experiência:</strong>
            <input type="number" value={personagem?.pontos_experiencia || 0} onChange={e => setPersonagem({...personagem!, pontos_experiencia: parseInt(e.target.value) || 0})} style={{marginLeft: '5px', width: '70px', padding: '4px'}}/> 
          <strong style={{maxWidth:'50%', marginLeft: '10px'}}>Pontos de Mérito:</strong>
            <input type="number" value={personagem?.pontos_merito || 0} onChange={e => setPersonagem({...personagem!, pontos_merito: parseInt(e.target.value) || 0})} style={{marginLeft: '10px', width: '70px', padding: '4px'}}/><br style={{marginBottom: '10px'}} />
          <div style={{display: 'flex', gap:'10px', alignItems: 'center'}}>
            <strong style={{minWidth: '100px'}}>Rank Militar:</strong>
              <label style={{minWidth: '100px'}}>{personagem?.patente?.toString() || 'Não informado'}</label>
              <input type="checkbox" onClick={() => setMostrar(!mostrar)} />
              {mostrar && (
                <div style={{ display: 'flex', alignItems: 'center'}}>
                  <label style={{fontWeight: 'bold', fontSize: '20px',  color: 'rgb(113, 255, 85)'}}>Promoção de Rank Militar Disponível!!!</label>
                  <button style={{...btnStyle, marginLeft: '20px'}} onClick={() => alert('Função de promoção ainda não implementada')}>Promover</button>
                </div>
              )}
          </div>
        </div>
        <div> {/* Dinheiro */}
          <h3 style={{marginTop: '10px'}}>Recursos</h3>
          <strong style={{marginLeft: '20px', marginRight: '10px', minWidth:'50%'}}>Ouro:</strong>
            <input type="number" value={personagem?.algibeira?.ouro || 0} onChange={e => setPersonagem({...personagem!, algibeira: {...personagem?.algibeira, ouro: parseInt(e.target.value) || 0}})} style={{ width: '15%', padding: '4px'}}/>
            <strong style={{marginLeft: '10px', marginRight: '10px', minWidth:'50%'}}>Prata:</strong>
            <input type="number" value={personagem?.algibeira?.prata || 0} onChange={e => setPersonagem({...personagem!, algibeira: {...personagem?.algibeira, prata: parseInt(e.target.value) || 0}})} style={{ width: '15%', padding: '4px'}}/>
            <strong style={{marginLeft: '10px', marginRight: '10px', minWidth:'50%'}}>Cobre:</strong>
            <input type="number" value={personagem?.algibeira?.cobre || 0} onChange={e => setPersonagem({...personagem!, algibeira: {...personagem?.algibeira, cobre: parseInt(e.target.value) || 0}})} style={{marginRight: '10px', width: '15%', padding: '4px'}}/>
        </div> 
        <hr style={{ marginTop: '20px', borderColor: '#666' }} /> 
      </div>

      <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start' }}> 
        <div style={{flex:'0 1 auto', minWidth: '35%'}}>
          <h2>Atributos</h2>
          <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
            <div about='Força' style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
              <strong style={{width:'75%'}}>Força:</strong>
                <input type="number" value={personagem?.atributos?.forca || 10} onChange={e => setPersonagem({...personagem!, atributos: {...(personagem?.atributos || {}), forca: parseInt(e.target.value) || 10}})} style={{ width: '30%', padding: '4px'}}/>
            </div>
            <div about='Destreza' style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
              <strong style={{width:'75%'}}>Destreza:</strong>
                <input type="number" value={personagem?.atributos?.destreza || 10} onChange={e => setPersonagem({...personagem!, atributos: {...(personagem?.atributos || {}), destreza: parseInt(e.target.value) || 10}})} style={{ width: '30%', padding: '4px'}}/>
            </div>
            <div about='Constituição' style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
              <strong style={{width:'75%'}}>Constituição:</strong>
                <input type="number" value={personagem?.atributos?.constituicao || 10} onChange={e => setPersonagem({...personagem!, atributos: {...(personagem?.atributos || {}), constituicao: parseInt(e.target.value) || 10}})} style={{ width: '30%', padding: '4px'}}/>
            </div>
            <div about='Inteligência' style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
              <strong style={{width:'75%'}}>Inteligência:</strong>
                <input type="number" value={personagem?.atributos?.inteligencia || 10} onChange={e => setPersonagem({...personagem!, atributos: {...(personagem?.atributos || {}), inteligencia: parseInt(e.target.value) || 10}})} style={{ width: '30%', padding: '4px'}}/>
            </div>
            <div about='Sabedoria' style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
              <strong style={{width:'75%'}}>Sabedoria:</strong>
                <input type="number" value={personagem?.atributos?.sabedoria || 10} onChange={e => setPersonagem({...personagem!, atributos: {...(personagem?.atributos || {}), sabedoria: parseInt(e.target.value) || 10}})} style={{ width: '30%', padding: '4px'}}/>
            </div>
            <div about='Carisma' style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
              <strong style={{width:'75%'}}>Carisma:</strong>
                <input type="number" value={personagem?.atributos?.carisma || 10} onChange={e => setPersonagem({...personagem!, atributos: {...(personagem?.atributos || {}), carisma: parseInt(e.target.value) || 10}})} style={{ width: '30%', padding: '4px'}}/>
            </div>
          </div>
        </div>
        <div style={{flex:'1',borderLeft: "1px solid #444", paddingLeft: '20px', minWidth: '65%'}}>
          <h2>Reservas de Energia</h2>          
          <span style={{marginLeft: '20%', fontSize: '12px', color: '#aaa'}}>Atual</span>
          <span style={{marginLeft: '5%', fontSize: '12px', color: '#aaa'}}>Máximo</span>
          <span style={{marginLeft: '7%', fontSize: '12px', color: '#aaa'}}>Dado</span>
          <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
            <div about='Vida' style={{display: 'flex', gap: '5px', alignItems: 'center'}}>
              <strong style={{width: '15%'}}>Vida:</strong>
                <label style={{marginLeft: '5%'}}> {vidaFinal}</label>
                <label style={{marginLeft: '10%'}}>{personagem?.reservas?.vida?.maximo?.toString()}</label>
                <label style={{marginLeft: '10%'}}>{personagem?.reservas?.vida?.dado?.toString()}</label>
            </div>
            <div about='Mana' style={{display: 'flex', gap: '5px', alignItems: 'center'}}>
              <strong style={{width: '15%'}}>Mana:</strong>
                <label style={{marginLeft: '5%'}}>{manaFinal}</label>
                <label style={{marginLeft: '10%'}}>{personagem?.reservas?.mana?.maximo?.toString()}</label>
                <label style={{marginLeft: '10%'}}>{personagem?.reservas?.mana?.dado?.toString()}</label>
            </div>
            <div about='Vigor' style={{display: 'flex', gap: '5px', alignItems: 'center'}}>
              <strong style={{width: '15%'}}>Vigor:</strong>
                <label style={{marginLeft: '5%'}}>{vigorFinal}</label>
                <label style={{marginLeft: '10%'}}>{personagem?.reservas?.vigor?.maximo?.toString()}</label>
                <label style={{marginLeft: '10%'}}>{personagem?.reservas?.vigor?.dado?.toString()}</label>
            </div>
            <div about='Dano' style={{display: 'flex', gap: '5px', alignItems: 'center'}}>
              <Tooltip id="tooltip-dano" place="top" style={{ backgroundColor: '#333', color: '#eee', padding: '8px', borderRadius: '4px', fontSize: '12px', textAlign: 'justify', display: 'block', gap: '5px', maxWidth: '100%', whiteSpace: 'normal',wordWrap: 'break-word', lineHeight: '1.6' }}><span>O campo de dano sofrido acumulado é onde você pode registrar o dano que seu personagem recebeu durante as aventuras. Ele é subtraído da vida atual do personagem para calcular a vida restante. Lembre-se de atualizar esse campo sempre que seu personagem sofrer dano, para garantir que as informações estejam corretas e atualizadas.</span></Tooltip>
              <strong data-tooltip-id='tooltip-dano' style={{width:'15%'}}>Dano Sofrido:</strong>
              <input type='number' value={dano} onBlur={() => atualizarReservas()} onChange={(e) => setDano((e.target.value))} style={{padding:'8px', borderRadius:'4px', border:'1px solid #666', width: '35%', marginLeft: '5%'}}/>
            </div>
            <div about='Uso de Mana' style={{display: 'flex', gap: '5px', alignItems: 'center'}}>
              <Tooltip id="tooltip-uso-mana" place="top" style={{ backgroundColor: '#333', color: '#eee', padding: '8px', borderRadius: '4px', fontSize: '12px', textAlign: 'justify', display: 'block', gap: '5px', maxWidth: '100%', whiteSpace: 'normal',wordWrap: 'break-word', lineHeight: '1.6' }}><span>O campo de uso de mana acumulado é onde você pode registrar a quantidade de mana que seu personagem gastou durante as aventuras. Ele é subtraído da mana atual do personagem para calcular a mana restante. Lembre-se de atualizar esse campo sempre que seu personagem gastar mana, para garantir que as informações estejam corretas e atualizadas.</span></Tooltip>
              <strong data-tooltip-id='tooltip-uso-mana' style={{width:'15%'}}>Uso de Mana:</strong>
              <input type='number' value={mana} onBlur={() => atualizarReservas()} onChange={(e) => setMana((e.target.value))} style={{padding:'8px', borderRadius:'4px', border:'1px solid #666', width: '35%', marginLeft: '5%'}}/>
            </div>
            <div about='Uso de Vigor' style={{display: 'flex', gap: '5px', alignItems: 'center'}}>
              <Tooltip id="tooltip-uso-vigor" place="top" style={{ backgroundColor: '#333', color: '#eee', padding: '8px', borderRadius: '4px', fontSize: '12px', textAlign: 'justify', display: 'block', gap: '5px', maxWidth: '100%', whiteSpace: 'normal',wordWrap: 'break-word', lineHeight: '1.6' }}><span>O campo de uso de vigor acumulado é onde você pode registrar a quantidade de vigor que seu personagem gastou durante as aventuras. Ele é subtraído do vigor atual do personagem para calcular o vigor restante. Lembre-se de atualizar esse campo sempre que seu personagem gastar vigor, para garantir que as informações estejam corretas e atualizadas.</span></Tooltip>
              <strong data-tooltip-id='tooltip-uso-vigor' style={{width:'15%'}}>Uso de Vigor:</strong>
              <input type='number' value={vigor} onBlur={() => atualizarReservas()} onChange={(e) => setVigor((e.target.value))} style={{padding:'8px', borderRadius:'4px', border:'1px solid #666', width: '35%', marginLeft: '5%'}}/>
            </div>
          </div>
        </div>
      </div>
      <hr style={{ marginTop: '20px', borderColor: '#666' }} /> 
      <div>
        <h2>Equipamentos</h2>
        <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
          <div about='Mochila' style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
            <Tooltip id="tooltip-mochila" place="top" style={{ backgroundColor: '#333', color: '#eee', padding: '8px', borderRadius: '4px', fontSize: '12px', textAlign: 'justify', display: 'block', gap: '5px', maxWidth: '100%', whiteSpace: 'normal',wordWrap: 'break-word', lineHeight: '1.6' }}>
              <span>A mochila é onde o personagem guarda seus itens. Ela tem um número limitado de slots, e cada item ocupa um ou mais slots dependendo do seu tamanho e peso. Gerenciar a mochila é crucial para garantir que o personagem possa carregar os itens necessários para suas aventuras, como armas, armaduras, poções e outros equipamentos essenciais. Itens não equipados ocupam automaticamente slots na mochila. Formula para calcular os slots totais da mochila: <br />
                <b>Mochila + Modificador de FOR + Modificador de CON = Slots Totais da Mochila.</b>
              </span>
            </Tooltip>
            <strong data-tooltip-id='tooltip-mochila'>Mochila:</strong>
            <span>{personagem?.equipamentos?.mochila?.descricao || "Básica"}</span>
            <span>{personagem?.equipamentos?.mochila?.slotsOcupados || 0}</span><span> de </span>
            <span>{personagem?.equipamentos?.mochila?.slotsTotais || 20}</span><strong> Slots.</strong>
            <button style={{...btnEquipStyle}} onClick={() => alert('Função ainda não implementada')}>Gerenciar Mochila</button>
          </div>
          <div about='Armadura' style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
            <Tooltip id="tooltip-armadura" place="top" style={{ backgroundColor: '#333', color: '#eee', padding: '8px', borderRadius: '4px', fontSize: '12px', textAlign: 'justify', display: 'block', gap: '5px', maxWidth: '100%', whiteSpace: 'normal',wordWrap: 'break-word', lineHeight: '1.6' }}>
              <span>A armadura é um equipamento defensivo que o personagem pode usar para reduzir o dano recebido em combate. Existem vários tipos de armaduras, cada uma com suas próprias características e requisitos. A escolha da armadura pode afetar a mobilidade do personagem, sua capacidade de se esconder e até mesmo suas habilidades de ataque. Gerenciar a armadura é essencial para garantir a sobrevivência do personagem em batalhas perigosas.</span>
            </Tooltip>
            <strong data-tooltip-id='tooltip-armadura'>Armadura:</strong>
            <span>{personagem?.equipamentos?.armadura?.nome || "Nenhuma armadura equipada"}</span>
            <span>{personagem?.equipamentos?.armadura?.descricao || ""}</span>
            <button style={{...btnEquipStyle}} onClick={() => alert('Função ainda não implementada')}>Gerenciar Armadura</button>
          </div>
          <div about='Acessórios' style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
            <Tooltip id="tooltip-acessorios" place="top" style={{ backgroundColor: '#333', color: '#eee', padding: '8px', borderRadius: '4px', fontSize: '12px', textAlign: 'justify', display: 'block', gap: '5px', maxWidth: '100%', whiteSpace: 'normal',wordWrap: 'break-word', lineHeight: '1.6' }}>
              <span>Acessórios são itens que o personagem pode usar para obter benefícios adicionais, como anéis, amuletos, capas e outros itens mágicos ou mundanos. Eles podem fornecer bônus em atributos, resistências, habilidades especiais ou outras vantagens. Gerenciar os acessórios é importante para maximizar o potencial do personagem e se preparar para os desafios que ele enfrentará em suas aventuras.</span>
            </Tooltip>
            <strong data-tooltip-id='tooltip-acessorios'>Acessórios:</strong>
            <span>{personagem?.equipamentos?.acessorios || "Nenhum acessório equipado"}</span>
            <button style={{...btnEquipStyle}} onClick={() => alert('Função ainda não implementada')}>Gerenciar Acessórios</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const btnStyle = { padding: '12px', backgroundColor: '#d4af37', color: '#000', fontWeight: 'bold', cursor: 'pointer', border: 'none', borderRadius: '4px' };
const btnEquipStyle = {padding: '12px', backgroundColor: '#444', color: '#fff', fontWeight: 'bold', cursor: 'pointer', border: 'none', borderRadius: '4px', width: '100px', marginLeft: 'auto'};
