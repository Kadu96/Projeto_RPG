export interface Ferramenta {
  id: string;
  nome: string;
  categoria: 'Artesão' | 'Jogo' | 'Musical' | 'Outros';
  moeda: 'po' | 'pp' | 'pe'; // po (ouro), pp (prata), pe (cobre)
  valor: number; // Agora é um número puro
  tamanho: 'P' | 'M' | 'G' | 'EX';
  descricao: string;
}