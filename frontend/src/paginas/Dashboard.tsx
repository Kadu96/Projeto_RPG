import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type Personagem = { id: number; nome_personagem: string };

export default function Dashboard() {
    const navigate = useNavigate();
    const [personagensDisponiveis, setPersonagensDisponiveis] = useState<Personagem[]>([]);
    useEffect(() => {
        // Função para buscar os personagens na API
        const buscarPersonagens = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch("http://127.0.0.1:8000/personagens", {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Falha ao carregar personagens");
                }

                const data = await response.json();
                setPersonagensDisponiveis(data);
            } catch (error) {
                console.error("Erro ao carregar personagens:", error);
            }
        };
    buscarPersonagens();
    }, []); // O array vazio [] garante que isso só rode UMA vez ao carregar a página

    const handleNovoChar = () => {
        navigate('/criar');
    };

    const handleOpenFicha = (id: number) => {
        navigate(`/personagem/${id}`);
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', color: '#eee', backgroundColor: '#222', borderRadius: '8px' }}>
            <h1>Dashboard</h1>
            <h2>Seus Personagens</h2>
            <ul style={{ ...inputStyle, listStyle: 'none', padding: 0 }}>
                {personagensDisponiveis.length === 0 ? (
                    <li style={{ color: '#ccc', padding: '10px 0' }}>Nenhum personagem encontrado.</li>
                ) : (
                    personagensDisponiveis.map((personagem) => (
                        <li
                            key={personagem.id}
                            onClick={() => handleOpenFicha(personagem.id)}
                            style={{
                                padding: '12px',
                                marginBottom: '10px',
                                borderRadius: '6px',
                                backgroundColor: '#2a2a2a',
                                cursor: 'pointer',
                                border: '1px solid #444',
                            }}
                        >
                            {personagem.nome_personagem}
                        </li>
                    ))
                )}
            </ul>

            <button onClick={handleNovoChar} style={btnStyle}>Novo</button>
        </div>
    );
}

// Estilos básicos para não ficar feio
const inputStyle = { width: '100%', padding: '8px', marginTop: '5px', borderRadius: '4px', border: 'none' };
const btnStyle = { padding: '12px', backgroundColor: '#d4af37', color: '#000', fontWeight: 'bold', cursor: 'pointer', border: 'none', borderRadius: '4px', marginTop: '20px' };