/**
 * Configurações e Utilitários Compartilhados do Frontend
 */

export const API_BASE_URL = "http://127.0.0.1:8000";

export const getAuthHeaders = () => {
  const token = sessionStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const handleAuthError = (status: number) => {
  if (status === 401) {
    sessionStorage.removeItem("token");
    window.location.href = "/login";
    return true;
  }
  return false;
};

export const calcularModificador = (valor: number = 10) => Math.floor((valor - 10) / 2);

export const MAPEAMENTO_RANKS: Record<number, string> = {
  1: 'Recrutado',
  2: 'Vigilante',
  3: 'Guardião',
  4: 'Pretor',
  5: 'Arconte',
  6: 'Exarca',
  7: 'Primarca',
};
