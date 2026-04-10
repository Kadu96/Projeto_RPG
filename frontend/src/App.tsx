import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Login from './paginas/Login';
import Dashboard from './paginas/Dashboard';
import CriarPersonagem from './paginas/CriarPersonagem';
import CadastroUsuario from './paginas/CadastroUsuario';

function App() {
  // Estado simples de autenticação (depois moveremos para algo mais robusto)
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

  return (
    <Router>
      <Routes>
        <Route path="/" element={!token ? <Login setToken={setToken} /> : <Navigate to="/dashboard" />} />
        
        {/* Rotas Protegidas */}
        <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/" />} />
        <Route path="/criar" element={token ? <CriarPersonagem /> : <Navigate to="/" />} />
        <Route path="/cadastro-usuario" element={<CadastroUsuario setToken={setToken} />} />
      </Routes>
    </Router>
  );
}

export default App;