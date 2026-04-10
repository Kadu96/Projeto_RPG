import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const navigate = useNavigate();
    const [personagensDisponiveis, setPersonagensDisponiveis] = useState<{id: number, nome: string}[]>([]);
        useEffect(() => {
            // Função para buscar as raças na API
            const buscarPersonagens = async () => {
                try {
                const response = await fetch("http://127.0.0.1:8000/personagens");
                const data = await response.json();
                setPersonagensDisponiveis(data);
                } catch (error) {
                console.error("Erro ao carregar personagens:", error);
                }
            };
        buscarPersonagens();
        }, []); // O array vazio [] garante que isso só rode UMA vez ao carregar a página  
    const handleNovoChar = () => {
        navigate('/criar-personagem');
    };
    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', color: '#eee', backgroundColor: '#222', borderRadius: '8px' }}>
            <h1>Dashboard</h1>
            <h2>Personagens Disponíveis</h2>
            <ul>
                {personagensDisponiveis.map((personagem) => (
                    <li key={personagem.id}>{personagem.nome}</li>
                ))}
            </ul>

            <button onClick={handleNovoChar} style={btnStyle}>Novo</button>
        </div>
    );
}

const btnStyle = { padding: '12px', backgroundColor: '#d4af37', color: '#000', fontWeight: 'bold', cursor: 'pointer', border: 'none', borderRadius: '4px', marginTop: '20px' };