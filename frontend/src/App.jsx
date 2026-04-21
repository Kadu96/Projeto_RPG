import React from 'react';

const Layout = ({ children }) => {
  return (
    // bg-slate-950: Fundo quase preto (estética RPG)
    // min-h-screen: Garante que o fundo ocupe toda a altura da tela
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-violet-500/30">
      
      {/* Barra Superior (Opcional, mas útil para o Login/User) */}
      <nav className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md flex items-center px-6 justify-between sticky top-0 z-50">
        <h1 className="text-xl font-black tracking-tighter text-violet-400 uppercase">
          RPG <span className="text-slate-100">Classless</span>
        </h1>
        <div className="flex gap-4">
          {/* Espaço para o nome do usuário ou botão de sair no futuro */}
        </div>
      </nav>

      {/* Conteúdo Dinâmico (onde as camadas vão entrar) */}
      <main className="container mx-auto p-6">
        {children}
      </main>

    </div>
  );
};

export default Layout;