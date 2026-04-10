import { useState } from 'react';

export default function Login({ setToken }: { setToken: (token: string) => void }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleLogin = async () => {
    const response = await fetch("http://127.0.0.1:8000/usuario/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "ignorado_pelo_back", email, senha })
    });

    const data = await response.json();
    if (data.access_token) {
      localStorage.setItem("token", data.access_token);
      setToken(data.access_token);
    } else {
      alert("Erro: " + (data.erro || "Falha no login"));
    }
  };

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>RPG Manager</h1>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Senha" onChange={e => setSenha(e.target.value)} />
      <button onClick={handleLogin}>Entrar</button>
    </div>
  );
}