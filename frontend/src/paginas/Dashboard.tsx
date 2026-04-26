import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL, getAuthHeaders, handleAuthError } from "../shared";

type Personagem = {
  character_uuid?: string;
  character_name?: string;
  character_details?: {
    nivel?: number;
    titulos?: {
      nome: string;
      principal: boolean;
      is_enabled: boolean;
    }[];
  };
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [personagensDisponiveis, setPersonagensDisponiveis] = useState<
    Personagem[]
  >([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    // Função para buscar os personagens na API
    const buscarPersonagens = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/personagens`, {
          method: "GET",
          headers: getAuthHeaders(),
        });

        if (response.ok) {
          const data = await response.json();
          setPersonagensDisponiveis(data);
        } else {
          handleAuthError(response.status);
        }
      } catch (error) {
        console.error("Erro ao carregar personagens:", error);
      } finally {
        setCarregando(false);
      }
    };
    buscarPersonagens();
  }, []); // O array vazio [] garante que isso só rode UMA vez ao carregar a página

  return (
    <div className="space-y-4 ">
      {/* Cabeçalho do Dashboard */}
      <div className="flex justify-between items-end border-b border-slate-800 pb-6 px-6 py-2">
        <div>
          <h1 className="titulo-pagina">
            MEUS <span className="text-violet-400">PERSONAGENS</span>
          </h1>
          <p className="text-slate-400">
            Gerencie seus heróis e suas jornadas.
          </p>
        </div>
        <button
          onClick={() => navigate("/criar")}
          className="bg-violet-600 hover:bg-violet-500 text-white px-6 py-3 rounded-lg font-bold transition-all transform active:scale-95 shadow-lg shadow-violet-900/30"
        >
          Novo
        </button>
      </div>

      {/* Lista de Personagens */}
      <div className="px-6">
        {carregando ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
          </div>
        ) : personagensDisponiveis.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {personagensDisponiveis.map((p) => (
              <div
                key={p.character_uuid}
                onClick={() => navigate(`/personagens/${p.character_uuid}`)}
                className="group bg-slate-900 border border-slate-800 p-6 rounded-xl hover:border-violet-500/50 cursor-pointer transition-all hover:shadow-2xl hover:shadow-violet-900/10"
              >
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-xl font-bold text-white group-hover:text-violet-400 transition-colors">
                    {p.character_name}
                  </h3>
                  <span className="bg-slate-800 text-violet-400 text-xs font-black px-2 py-1 rounded">
                    {p.character_details?.nivel}
                  </span>
                </div>
                <div className="flex justify-between items-start mb-4">
                  {p.character_details?.titulos?.map((titulo, index) =>
                    titulo.principal ? (
                      <span key={index}>{titulo.nome}</span>
                    ) : (
                      ""
                    ),
                  )}
                </div>
                <div className="text-sm text-slate-500 italic">
                  Clique para abrir a ficha completa
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-20 bg-slate-900/50 border-2 border-dashed border-slate-800 rounded-2xl px-6">
            <p className="text-slate-500 mb-4">
              Você ainda não possui personagens cadastrados.
            </p>
            <button
              onClick={() => navigate("/criar")}
              className="text-violet-400 font-bold hover:underline"
            >
              Que tal começar um agora?
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
