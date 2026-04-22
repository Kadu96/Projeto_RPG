export const TABELA_XP_NIVEL: Record<number, number> = {
  1: 0,
  2: 300,
  3: 900,
  4: 2700,
  5: 6500,
  6: 14000,
  7: 23000,
  8: 34000,
  9: 48000,
  10: 64000,
  11: 85000,
  12: 100000,
  13: 120000,
  14: 140000,
  15: 165000,
  16: 195000,
  17: 225000,
  18: 265000,
  19: 305000,
  20: 355000
};

export const TABELA_MERITO_NIVEL: Record<number, number> = {
  1: 1500,
  2: 5000,
  3: 12000,
  4: 30000,
  5: 50000,
  6: 100000,
  7: 200000
};  

export function podeSubirDeNivel(nivelAtual: number, xpAtual: number): boolean {
  const proximoNivel = nivelAtual + 1;
  const xpNecessario = TABELA_XP_NIVEL[proximoNivel];
  
  if (!xpNecessario) return false; // Nível máximo atingido
  return xpAtual >= xpNecessario;
}

export function podeSubirDeRank(rankAtual: number, meritoAtual: number): boolean{
  const proximoRank = rankAtual + 1;
  const meritoNecessario = TABELA_MERITO_NIVEL[proximoRank];

  if(!meritoNecessario) return false;
  return meritoAtual >= meritoNecessario;
}