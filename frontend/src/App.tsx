import { useState } from 'react'

// Definimos o formato dos nossos atributos
interface Attributes {
  forca: number;
  destreza: number;
  constituicao: number;
  inteligencia: number;
  sabedoria:number;
  carisma:number;
}

function App() {
  // Estado para os atributos
  const [attributes, setAttributes] = useState<Attributes>({
    forca: 10,
    destreza: 10,
    constituicao: 10,
    inteligencia: 10,
    sabedoria: 10,
    carisma: 10
  });  
  const [charName, setCharName] = useState<string>("Novo Viajante");

  // Função para aumentar um atributo
  const handleIncrease = (attr: keyof Attributes) => {
    setAttributes(prev => ({
      ...prev,
      [attr]: prev[attr] + 1
    }));
  };

  // Função para diminuir um atributo
  const handleDecrease = (attr: keyof Attributes) => {
    setAttributes(prev => ({
      ...prev,
      [attr]: prev[attr] - 1
    }));
  };
  // Função para simular o salvamento da ficha
  const handleSave = async () => {
    // Criamos o objeto que representa a ficha completa
    const characterData = {
      name: charName,
      attributes: attributes,
      level: 1, // Nível inicial
    };

    try {
      const response = await fetch('http://localhost:8000/save-character', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(characterData)
      });
      if (response.ok) {
        const result = await response.json();
        alert(`Ficha salva com sucesso! Servidor respondeu: ${result.data_received}`);
      } else {
        alert('Erro ao salvar a ficha. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao enviar dados para o backend:', error);
      alert('Erro ao salvar a ficha. Tente novamente.');
    }

  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', color: '#333' }}>
      <h1>Ficha de Personagem (Classless)</h1>
      <hr />

      <div style={{marginTop: '10px'}}>
              <h2>Identidade e Legado</h2>
              <div>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Nome do Personagem:
        </label>
        <input 
          type="text" 
          value={charName} 
          onChange={(e) => setCharName(e.target.value)}
          style={{
            padding: '8px',
            fontSize: '1rem',
            borderRadius: '4px',
            border: '1px solid #ccc',
            width: '100%',
            maxWidth: '300px'
          }}
        />
        <p>Explorando como: <em>{charName}</em></p>
      </div>
        <p><strong>Nome:</strong> [Digite o nome do personagem]</p>
        <p><strong>Raça:</strong> [Digite a raça do personagem]</p>
        <p><strong>Idade:</strong> [Digite a idade do personagem]</p>
        <p><strong>Sexo:</strong> [Digite o sexo do personagem]</p>
        <p><strong>Origem:</strong> [Digite a origem do personagem]</p>
      </div>
      <hr />

      <div style={{ marginTop: '20px' }}>
        <h2>Atributos</h2>
        {Object.entries(attributes).map(([key, value]) => (
          <div key={key} style={{ marginBottom: '10px', fontSize: '1.2rem' }}>
            <span style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>
              {key}
            </span>
            <button style={{margin:"0 2px", fontSize: '0.6rem'}} onClick={() => handleIncrease(key as keyof Attributes)}>
              +
            </button>
            <button style={{margin:"0 2px", fontSize: '0.6rem'}} onClick={() => handleDecrease(key as keyof Attributes)}>
              -
            </button> <br /> 
            <span style={{ margin: '0 10px' }}>{value}</span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '30px', padding: '15px', background: '#f4f4f4', borderRadius: '8px' }}>
        <h3>Resumo de Combate</h3>
        <p><strong>Bônus de Iniciativa:</strong> {Math.floor((attributes.destreza - 10) / 2)}</p>
        <p><strong>Pontos de Vida Sugeridos:</strong> {10 + Math.floor((attributes.constituicao - 10) / 2)}</p>
      </div>

      <button 
        onClick={handleSave}
        style={{
          marginTop: '30px',
          padding: '12px 24px',
          backgroundColor: '#2e7d32',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '1rem',
          fontWeight: 'bold'
        }}
      >
        Salvar Ficha no Banco
      </button>
    </div>
  )
}

export default App