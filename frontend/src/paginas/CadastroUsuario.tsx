import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CadastroUsuario({ setToken }: { setToken: (token: string) => void }) {
    const navigate = useNavigate();
    const [login, setLogin] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    const handleCadastro = async () => {
        if (!login || !email || !senha) {
            return alert("Preencha todos os campos");
        }

        const response = await fetch("http://127.0.0.1:8000/usuario/cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, email, senha })
        });

        const data = await response.json();
        if (response.ok && data.access_token) {
        localStorage.setItem("token", data.access_token);
        setToken(data.access_token);
        navigate('/dashboard'); // Redireciona para o dashboard após cadastro
        } else {
        alert("Erro: " + (data.detail || data.erro || "Falha no cadastro"));
        }  
    };

    return (
        <div style={{ padding: '40px', textAlign: 'center' }}>
            <h1>RPG Manager</h1>
            <input placeholder="Login" onChange={e => setLogin(e.target.value)} />
            <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
            <input type="password" placeholder="Senha" onChange={e => setSenha(e.target.value)} />
            <br /><button onClick={handleCadastro} style={{ marginLeft: '10px' }}>Cadastrar</button>
        </div>
    );
}