import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


type CharacterForm = {
    nome_personagem: string;
    sexo_personagem: string;
    raca_personagem: string;
    idade_personagem: string;
    altura_personagem: string;
    peso_personagem: string;
    antecedente: string;
    tendencia: string;
};

type Raca = { id: number; nome_raca: string };
type Antecedente = { id: number; nome_antecedente: string };
type Tendencia = { id: number; nome_tendencia: string };

export default function CriarPersonagem() {
    const navigate = useNavigate();
    const [ficha, setFicha] = useState<CharacterForm>({
        nome_personagem: "",
        sexo_personagem: "",
        raca_personagem: "",
        idade_personagem: "",
        altura_personagem: "",
        peso_personagem: "",
        antecedente: "",
        tendencia: ""
    });
    const [racasDisponiveis, setRacasDisponiveis] = useState<Raca[]>([]);
    useEffect(() => {
        // Função para buscar as raças na API
        const buscarRacas = async () => {
            try {
            const response = await fetch("http://127.0.0.1:8000/racas");
            const data = await response.json();
            setRacasDisponiveis(data);
            } catch (error) {
            console.error("Erro ao carregar raças:", error);
            }
        };
    buscarRacas();
    }, []); // O array vazio [] garante que isso só rode UMA vez ao carregar a página           

    const [tendenciasDisponiveis, setTendenciasDisponiveis] = useState<Tendencia[]>([]);
    useEffect(() => {
        // Função para buscar as tendências na API
        const buscarTendencias = async () => {
            try {
            const response = await fetch("http://127.0.0.1:8000/tendencias");
            const data = await response.json();
            setTendenciasDisponiveis(data);
            } catch (error) {
            console.error("Erro ao carregar tendências:", error);
            }
        };

    buscarTendencias();
    }, []); // O array vazio [] garante que isso só rode UMA vez ao carregar a página

    
    const [antecedentesDisponiveis, setAntecedentesDisponiveis] = useState<Antecedente[]>([]);
    useEffect(() => {
        // Função para buscar os antecedentes na API
        const buscarAntecedentes = async () => {
            try {
            const response = await fetch("http://127.0.0.1:8000/antecedentes");
            const data = await response.json();
            setAntecedentesDisponiveis(data);
            } catch (error) {
            console.error("Erro ao carregar antecedentes:", error);
            }
        };
        buscarAntecedentes();
    }, []); // O array vazio [] garante que isso só rode UMA vez ao carregar a página

    // Função genérica para atualizar qualquer campo
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFicha(prev => ({ ...prev, [name]: value } as CharacterForm));
    };

    const handleSalvar = async () => {
      const token = localStorage.getItem("token");
      
      try {
        const response = await fetch("http://127.0.0.1:8000/personagem/salvar", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` // Enviamos o "crachá" de login
          },
          body: JSON.stringify(ficha),
        });

        if (response.ok) {
          alert("Personagem criado com sucesso!");
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Erro ao salvar:", error);
      }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', color: '#eee', backgroundColor: '#222', borderRadius: '8px' }}>
      <h1>Novo Personagem</h1>
      
      <div style={{ display: 'grid', gap: '15px' }}>
        <label>
          Nome:
          <input name="nome_personagem" value={ficha.nome_personagem} onChange={handleChange} style={inputStyle} />
        </label>

        <label>
          Sexo:
          <select name="sexo_personagem" value={ficha.sexo_personagem} onChange={handleChange} style={inputStyle}>
            <option value="">Selecione um sexo...</option>
            <option value="Masculino">Masculino</option>
            <option value="Feminino">Feminino</option>
            <option value="Outro">Outro</option>
          </select>
        </label>

        <label>
          Raça:
          <select name="raca_personagem" value={ficha.raca_personagem} onChange={handleChange} style={inputStyle}>
            <option value="">Selecione uma raça...</option>
                {racasDisponiveis.map((raca) => (
                <option key={raca.id} value={raca.nome_raca}>
                    {raca.nome_raca}
                </option>
                ))}
          </select>
        </label>

        <div style={{ display: 'flex', gap: '10px' }}>
          <label>Idade: <input type="number" name="idade_personagem" value={ficha.idade_personagem} onChange={handleChange} style={inputStyle} /></label>
          <label>Altura: <input name="altura_personagem" value={ficha.altura_personagem} placeholder="ex: 1.80m" onChange={handleChange} style={inputStyle} /></label>
          <label>Peso: <input name="peso_personagem" value={ficha.peso_personagem} placeholder="ex: 70kg" onChange={handleChange} style={inputStyle} /></label>
        </div>

        <label>
          Antecedente:
          <select name="antecedente" value={ficha.antecedente} onChange={handleChange}
          style={inputStyle}>
            <option value="">Selecione um antecedente...</option>
                {antecedentesDisponiveis.map((antecedente) => (
                <option key={antecedente.id} value={antecedente.nome_antecedente}>
                    {antecedente.nome_antecedente}
                </option>
                ))}
          </select>
        </label>

        <label>
          Tendência:
          <select name="tendencia" value={ficha.tendencia} onChange={handleChange} style={inputStyle}>
            <option value="">Selecione uma tendência... </option>
                {tendenciasDisponiveis.map((tendencia) => (
                <option key={tendencia.id} value={tendencia.nome_tendencia}>
                    {tendencia.nome_tendencia}
                </option>
                ))}
          </select>
        </label>

        <button onClick={handleSalvar} style={btnStyle}>Criar Ficha</button>
      </div>
    </div>
  );
}

// Estilos básicos para não ficar feio
const inputStyle = { width: '100%', padding: '8px', marginTop: '5px', borderRadius: '4px', border: 'none' };
const btnStyle = { padding: '12px', backgroundColor: '#d4af37', color: '#000', fontWeight: 'bold', cursor: 'pointer', border: 'none', borderRadius: '4px', marginTop: '20px' };