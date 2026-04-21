import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type CharacterForm = {
  character_name: string;
  race_id: number;           // FK para a tabela de Raças
  background_id: number;    // FK para a tabela de Antecedentes
  // O restante vai para o campo JSONB no backend
  character_info: {
    sexo: string;
    idade: string;
    altura: string;
    peso: string;
    tendencia: string;
  };
};

type Raca = { race_id: number; race_name: string };
type Antecedente = { background_id: number; background_name: string };

export default function CriarPersonagem() {
  const navigate = useNavigate();
  const [ficha, setFicha] = useState<CharacterForm>({
    character_name: "",
    race_id: 0,
    background_id: 0,
    character_info: {
        sexo: "",
        idade: "",
        altura: "",
        peso: "",
        tendencia: ""
    }
  });

  const [racasDisponiveis, setRacasDisponiveis] = useState<Raca[]>([]);
  const [antecedentesDisponiveis, setAntecedentesDisponiveis] = useState<Antecedente[]>([]);

  const tendencias = [
    "Leal e Bom",
    "Neutro e Bom",
    "Caótico e Bom",
    "Leal e Neutro",
    "Neutro Verdadeiro",
    "Caótico e Neutro",
    "Leal e Mau",
    "Neutro e Mau",
    "Caótico e Mau",
  ];

  useEffect(() => {
    const carregarDadosIniciais = async () => {
      try {
        const [resRacas, resAntecedentes] = await Promise.all([
          fetch("http://127.0.0.1:8000/racas"),
          fetch("http://127.0.0.1:8000/antecedentes"),
        ]);

        setRacasDisponiveis(await resRacas.json());
        setAntecedentesDisponiveis(await resAntecedentes.json());
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    };
    carregarDadosIniciais();
  }, []);

  // Função genérica para atualizar qualquer campo
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFicha(prev => ({ ...prev, [name]: value } as CharacterForm));
  };

  const handleChangeInfo = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFicha(prev => ({
        ...prev,
        character_info: {
            ...prev.character_info,
            [name]: value
        }
    }));
  };

  const handleSalvar = async (e: React.ChangeEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://127.0.0.1:8000/personagens/salvar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Enviamos o "crachá" de login
        },
        body: JSON.stringify(ficha),
      });

      if (response.ok) {
        alert("Personagem criado com sucesso!");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl">
        <h1 className="text-3xl font-black text-white mb-8 tracking-tighter uppercase">
          Novo <span className="text-violet-400">Personagem</span>
        </h1>
        <form onSubmit={handleSalvar} className="space-y-6">
          <div>
            <label className="text-xs font-bold uppercase text-slate-500 ml-1">
              Nome do Personagem
            </label>
            <input
              name="character_name"
              value={ficha.character_name}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-violet-500 outline-none transition-all"
              placeholder="Ex: Valerius"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold uppercase text-slate-500 ml-1">
                Raça
              </label>
              <select
                name="race_id"
                value={ficha.race_id}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-violet-500 outline-none"
              >
                <option value="">Selecione...</option>
                {racasDisponiveis.map((r) => (
                  <option key={r.race_id} value={r.race_id}>
                    {r.race_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sexo */}
            <div>
              <label className="text-xs font-bold uppercase text-slate-500 ml-1">
                Sexo
              </label>
              <select
                name="sexo"
                value={ficha.character_info.sexo}
                onChange={handleChangeInfo}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-violet-500 outline-none"
              >
                <option value="">Selecione...</option>
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
                <option value="Outro">Outro</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold uppercase text-slate-500 ml-1">
                Idade
              </label>
              <input
                type="number"
                name="idade"
                value={ficha.character_info.idade}
                onChange={handleChangeInfo}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-slate-500 ml-1">
                Altura
              </label>
              <input
                name="altura"
                value={ficha.character_info.altura}
                onChange={handleChangeInfo}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white"
                placeholder="1.80m"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-slate-500 ml-1">
                Peso
              </label>
              <input
                name="peso"
                value={ficha.character_info.peso}
                onChange={handleChangeInfo}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white"
                placeholder="75kg"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold uppercase text-slate-500 ml-1">
                Antecedente
              </label>
              <select
                name="background_id"
                value={ficha.background_id}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white"
              >
                <option value="">Selecione...</option>
                {antecedentesDisponiveis.map((a) => (
                  <option key={a.background_id} value={a.background_id}>
                    {a.background_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-slate-500 ml-1">
                Tendência
              </label>
              <select
                name="tendencia"
                value={ficha.character_info.tendencia}
                onChange={handleChangeInfo}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white"
              >
                <option value="">Selecione...</option>
                {tendencias.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-lg transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-[2] py-4 bg-violet-600 hover:bg-violet-500 text-white font-black uppercase tracking-widest rounded-lg shadow-lg shadow-violet-900/30 transition-all transform active:scale-[0.98]"
            >
              Criar Ficha
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
