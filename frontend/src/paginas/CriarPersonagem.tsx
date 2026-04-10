import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CriarPersonagem() {
    const navigate = useNavigate();
    const [ficha, setFicha] = useState({
        nome: "",
        sexo: "",
        raca: "",
        idade: "",
        altura: "",
        peso: "",
        antecedente: "",
        tendencia: ""
    });
    const [racasDisponiveis, setRacasDisponiveis] = useState<{id: number, nome: string}[]>([]);
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

    const [tendenciasDisponiveis, setTendenciasDisponiveis] = useState<{id: number, nome: string}[]>([]);
    useEffect(() => {
        // Função para buscar as raças na API
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

    
    const [antecedentesDisponiveis, setAntecedentesDisponiveis] = useState<{id: number, nome: string}[]>([]);
    useEffect(() => {
        // Função para buscar as raças na API
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
        setFicha(prev => ({ ...prev, [name]: value }));
    };

    const handleSalvar = async () => {
    const token = localStorage.getItem("token");
    
    try {
      const response = await fetch("http://127.0.0.1:8000/save-character", {
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
          <input name="nome_personagem" value={ficha.nome} onChange={handleChange} style={inputStyle} />
        </label>

        <label>
          Sexo:
          <select name="sexo_personagem" value={ficha.sexo} onChange={handleChange} style={inputStyle}>
            <option value="Masculino">Masculino</option>
            <option value="Feminino">Feminino</option>
            <option value="Outro">Outro</option>
          </select>
        </label>

        <label>
          Raça:
          <select name="raca_personagem" value={ficha.raca} onChange={handleChange} style={inputStyle}>
            <option value="">Selecione uma raça...</option>
                {racasDisponiveis.map((raca) => (
                <option key={raca.id} value={raca.nome}>
                    {raca.nome}
                </option>
                ))}
          </select>
        </label>

        <div style={{ display: 'flex', gap: '10px' }}>
          <label>Idade: <input type="number" name="idade_personagem" onChange={handleChange} style={inputStyle} /></label>
          <label>Altura: <input name="altura_personagem" placeholder="ex: 1.80m" onChange={handleChange} style={inputStyle} /></label>
          <label>Peso: <input name="peso_personagem" placeholder="ex: 70kg" onChange={handleChange} style={inputStyle} /></label>
        </div>

        <label>
          Antecedente:
          <select name="antecedente" value={ficha.antecedente} onChange={handleChange}
          style={inputStyle}>
            <option value="">Selecione um antecedente...</option>
                {antecedentesDisponiveis.map((antecedente) => (
                <option key={antecedente.id} value={antecedente.nome}>
                    {antecedente.nome}
                </option>
                ))}
          </select>
        </label>

        <label>
          Tendência:
          <select name="tendencia" value={ficha.tendencia} onChange={handleChange} style={inputStyle}>
            <option value="">Selecione uma tendência... </option>
                {tendenciasDisponiveis.map((tendencia) => (
                <option key={tendencia.id} value={tendencia.nome}>
                    {tendencia.nome}
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