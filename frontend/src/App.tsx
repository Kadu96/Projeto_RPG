import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './paginas/Login';
import Dashboard from './paginas/Dashboard';
import CriarPersonagem from './paginas/CriarPersonagem';
import CadastroUsuario from './paginas/CadastroUsuario';
import FichaPersonagem from './paginas/FichaPersonagem';

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

  useEffect(() => {
    const handleStorage = () => setToken(localStorage.getItem("token"));
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <Router>
      {/* Container Principal com Tailwind para garantir o fundo em todas as páginas */}
      <div className="min-h-screen bg-slate-950 text-slate-200">
        <Routes>
          {/* --- ROTAS PÚBLICAS --- */}
          {/* Se logado, manda pro dashboard. Se não, mostra Login */}
          {/* <Route path="/login" element={!token ? <Login /> : <Navigate to="/dashboard" />} /> */}
          <Route path="/login" element={!token ? <Login setToken={setToken} /> : <Navigate to="/dashboard" />} />

          {/* Cadastro deve ser acessível para quem NÃO está logado */}
          <Route path="/cadastro" element={!token ? <CadastroUsuario /> : <Navigate to="/dashboard" />} />

          {/* --- ROTAS PROTEGIDAS --- */}
          <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/criar" element={token ? <CriarPersonagem /> : <Navigate to="/login" />} />
          <Route path="/personagens/:uuid" element={token ? <FichaPersonagem /> : <Navigate to="/login" />} />

          {/* Rota Raiz: Decide para onde ir baseado no login */}
          <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
          
          {/* Fallback: Se digitar qualquer coisa errada, volta pro início */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;