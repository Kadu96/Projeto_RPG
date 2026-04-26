import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../shared';

interface UserRegisterData {
    user_name: string;
    user_login: string;
    user_pass: string;
    user_email: string;
};

export default function CadastroUsuario() {
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState<UserRegisterData>({
        user_name: "",
        user_login: "",
        user_pass: "",
        user_email: ""
    });
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [mostrarSenha, setMostrarSenha] = useState(false);

    const handleCadastro = async (e: React.ChangeEvent) => {
        e.preventDefault();

        // Validação de Confirmação
        if (usuario.user_pass !== confirmarSenha) {
            return alert("As senhas não coincidem!");
        }

        if (!usuario.user_email || !usuario.user_login || !usuario.user_name || !usuario.user_pass) {
            return alert("Preencha todos os campos");
        }

        try {
            const response = await fetch(`${API_BASE_URL}/usuario/cadastro`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(usuario)
            });

            const data = await response.json();
            if (response.ok) {
                alert("Usuário Cadastrado com Sucesso!! Seja Bem-Vindo!!!");
                navigate('/login'); // Redireciona para o dashboard após cadastro
            } else {
            alert("Erro: " + (data.detail || data.erro || "Falha no cadastro"));
            }  
        } catch (error){
            alert ("Erro ao conectar com o servidor. " + error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center ">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl">
                <h1 className="text-3xl font-black text-white mb-2 text-center tracking-tight">
                    RPG <span className="text-violet-400">MANAGER</span>
                </h1>
                <p className="text-slate-400 text-center mb-8 text-sm">Inicie a sua conta de aventureiro</p>

                <form onSubmit={handleCadastro} className="space-y-5">
                    <div>
                        <label className="label-rpg">Nome de Exibição</label>
                        <input 
                            className="input-rpg"
                            placeholder="Ex: Arwen Evenstar" 
                            onChange={e => setUsuario({...usuario, user_name: e.target.value})} 
                        />
                    </div>

                    <div>
                        <label className="label-rpg">Login de Acesso</label>
                        <input 
                            className="input-rpg"
                            placeholder="login_unico" 
                            onChange={e => setUsuario({...usuario, user_login: e.target.value})} 
                        />
                    </div>

                    <div>
                        <label className="label-rpg">E-mail</label>
                        <input 
                            type="email"
                            className="input-rpg"
                            placeholder="seu@email.com" 
                            onChange={e => setUsuario({...usuario, user_email: e.target.value})} 
                        />
                    </div>

                    {/* Campo de Senha com Olhinho */}
                    <div className="relative">
                        <label className="label-rpg">Senha</label>
                        <div className="relative">
                            <input 
                                type={mostrarSenha ? "text" : "password"}
                                maxLength={32} minLength={8} 
                                className="input-rpg pr-12"
                                placeholder="••••••••" 
                                onChange={e => setUsuario({...usuario, user_pass: e.target.value})} 
                            />
                            {/* Botão do Olhinho */}
                            <button 
                                type="button" // Importante ser type="button" para não submeter o form
                                onClick={() => setMostrarSenha(!mostrarSenha)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-violet-400 transition-colors"
                            >
                                {mostrarSenha ? "Ocultar" : "Mostrar"} 
                                {/* Aqui você pode trocar o texto por ícones <Eye /> e <EyeOff /> */}
                            </button>
                        </div>
                    </div>

                    {/* Campo de Confirmação */}
                    <div className="relative">
                        <label className="label-rpg">Senha</label>
                        <div className="relative">
                            <input 
                                type={mostrarSenha ? "text" : "password"} 
                                maxLength={32} minLength={8} 
                                className="input-rpg pr-12"
                                placeholder="••••••••" 
                                onChange={e => setConfirmarSenha(e.target.value)} 
                            />
                            {/* Botão do Olhinho */}
                            <button 
                                type="button" // Importante ser type="button" para não submeter o form
                                onClick={() => setMostrarSenha(!mostrarSenha)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-violet-400 transition-colors"
                            >
                                {mostrarSenha ? "Ocultar" : "Mostrar"} 
                                {/* Aqui você pode trocar o texto por ícones <Eye /> e <EyeOff /> */}
                            </button>
                        </div>
                    </div>

                    <button 
                        type="submit"
                        className="w-full py-4 bg-violet-600 hover:bg-violet-500 text-white font-black uppercase tracking-widest rounded-lg transition-all transform active:scale-[0.98] mt-4 shadow-lg shadow-violet-900/30"
                    >
                        Criar Conta
                    </button>
                </form>
                
                <p className="text-center mt-6 text-sm text-slate-500">
                    Já possui conta? <button onClick={() => navigate('/login')} className="text-violet-400 hover:underline">Entrar</button>
                </p>
            </div>
        </div>
    );
}