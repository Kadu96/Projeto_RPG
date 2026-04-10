import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

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
};

export default function FichaPersonagem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [personagem, setPersonagem] = useState<PersonagemDetalhe | null>(null);
  const [erro, setErro] = useState<string | null>(null);

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

      {erro ? (
        <div style={{ color: '#f55' }}>{erro}</div>
      ) : personagem ? (
        <div>
          <h1>{personagem.nome_personagem}</h1>
          <div style={{ display: 'grid', gap: '12px', marginTop: '20px' }}>
            <div>
              <strong>Raça:</strong> {personagem.raca_personagem || 'Não informado'}
            </div>
            <div>
              <strong>Sexo:</strong> {personagem.sexo_personagem || 'Não informado'}
            </div>
            <div>
              <strong>Idade:</strong> {personagem.idade_personagem ?? 'Não informado'}
            </div>
            <div>
              <strong>Altura:</strong> {personagem.altura_personagem || 'Não informado'}
            </div>
            <div>
              <strong>Peso:</strong> {personagem.peso_personagem || 'Não informado'}
            </div>
            <div>
              <strong>Antecedente:</strong> {personagem.antecedente || 'Não informado'}
            </div>
            <div>
              <strong>Tendência:</strong> {personagem.tendencia || 'Não informado'}
            </div>
          </div>
        </div>
      ) : (
        <div>Carregando ficha...</div>
      )}
    </div>
  );
}

const btnStyle = { padding: '12px', backgroundColor: '#d4af37', color: '#000', fontWeight: 'bold', cursor: 'pointer', border: 'none', borderRadius: '4px' };
