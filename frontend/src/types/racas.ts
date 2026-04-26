export type EfeitoTipo = 'RECURSO_POR_NIVEL' | 'SOMA_STATUS' | 'MULTIPLICADOR_STATUS' | 'SELECAO_DE_MAGIA';
export type AtributoTag = 'forca' | 'destreza' | 'constituicao' | 'inteligencia' | 'sabedoria' | 'carisma';

export interface EfeitoAtivo {
  tipo: EfeitoTipo;
  alvo: 'vida' | 'mana' | 'vigor' | 'deslocamento' | 'ca' | 'lista_magias';
  valor: number;
}

export interface RacaData {
  nome: string;
  idioma: string[];
  maestria: { tipo: string; valor: number; maestria: string; selecionavel: boolean }[];
  recursos: { valor: number; reserva: 'vida' | 'mana' | 'vigor' }[];
  bonus_attr: { valor: number; atributo: AtributoTag }[];
  deslocamento: string;
  caracteristicas: {
    nome: string;
    descricao: string;
    efeito?: EfeitoAtivo; // Opcional, nem toda característica mexe em números
  }[];
}