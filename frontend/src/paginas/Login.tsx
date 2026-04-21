import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login({ setToken }: { setToken: (t: string) => void }) {
  const navigate = useNavigate();
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const handleLogin = async (e: React.ChangeEvent) => {
    e.preventDefault();
    setCarregando(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/usuario/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          login_or_email: login, 
          user_pass: senha 
        })
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.access_token);
        setToken(data.access_token);
        navigate('/dashboard');
        // window.location.href = "/dashboard";
      } else {
        alert("Erro: " + (data.erro || "Falha no login"));
      }
    } catch (error) {
      alert("Erro ao conectar com o servidor." + error);
    } finally {
      setCarregando(false)
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl">
        <h1 className="text-3xl font-black text-white mb-2 text-center tracking-tight">BEM-VINDO 
          <span className="text-violet-400"><br/>AVENTUREIRO</span>
        </h1>
        <p className="text-slate-400 text-center mb-8 text-sm">Insira suas credenciais para continuar</p>
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
              <label className="text-xs font-bold uppercase text-slate-500 ml-1">Login ou E-mail</label>
              <input 
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition-all"
                  placeholder="seu_login ou e-mail" 
                  onChange={e => setLogin(e.target.value)} 
              />
          </div>
          <div className="relative">
            <label className="text-xs font-bold uppercase text-slate-500 ml-1">Senha</label>
            <div className="relative">
              <input 
                  type={mostrarSenha ? "text" : "password"}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition-all"
                  placeholder="••••••••"
                  onChange={e => setSenha(e.target.value)} 
              />
              <button 
                  type="button" // Importante ser type="button" para não submeter o form
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-violet-400 transition-colors"
              >
                  {mostrarSenha ? "Ocultar" : "Mostrar"} 
              </button>
            </div>
          </div>
          <button 
              type="submit"
              disabled={carregando}
              className={`w-full py-4 ${carregando ? 'bg-slate-700' : 'bg-violet-600 hover:bg-violet-500'} text-white font-black uppercase tracking-widest rounded-lg transition-all transform active:scale-[0.98] mt-4`}
          >
              {carregando ? "Autenticando..." : "Entrar na Taverna"}
          </button>
        </form>
        <p className="text-center mt-6 text-sm text-slate-500">
          Ainda não tem conta? <button onClick={() => navigate('/cadastro')} className="text-violet-400 hover:underline">Registrar-se</button>
        </p>
      </div>
    </div>
  );
}