import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login({ setToken }: { setToken: (token: string) => void }) {
  const navigate = useNavigate();
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");

  const handleLogin = async () => {
    const response = await fetch("http://127.0.0.1:8000/usuario/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login, senha })
    });

    const data = await response.json();
    if (data.access_token) {
      localStorage.setItem("token", data.access_token);
      setToken(data.access_token);
    } else {
      alert("Erro: " + (data.erro || "Falha no login"));
    }
  };

  const handleNovoUsuario = () => {
    navigate('/cadastro-usuario');
  };

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>RPG Manager</h1>
      <input placeholder="Login" onChange={e => setLogin(e.target.value)} />
      <input type="password" placeholder="Senha" onChange={e => setSenha(e.target.value)} />
      <br /><button onClick={handleLogin} style={{ marginTop: '10px', marginLeft: '10px' }}>Entrar</button>
      <br /><button onClick={handleNovoUsuario} style={{ marginLeft: '10px' }}>Cadastrar</button>
    </div>
  );
}