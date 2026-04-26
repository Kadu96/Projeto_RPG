import { type Ferramenta } from '../types/ferramentas';

export const FERRAMENTAS_DATA: Record<string, Ferramenta> = {
  // --- FERRAMENTAS DE ARTESÃO ---
  'alquimista': {
    id: 'alquimista',
    nome: 'Suprimentos de Alquimista',
    categoria: 'Artesão',
    moeda: 'po',
    valor: 50,
    tamanho: 'M',
    descricao: 'Béqueres, pós metálicos e reagentes para criar itens alquímicos.'
  },
  'cervejeiro': {
    id: 'cervejeiro',
    nome: 'Suprimentos de Cervejeiro',
    categoria: 'Artesão',
    moeda: 'po',
    valor: 20,
    tamanho: 'G',
    descricao: 'Barril, lúpulo e instrumentos de fermentação.'
  },
  'caligrafia': {
    id: 'caligrafia',
    nome: 'Suprimentos de Caligrafia',
    categoria: 'Artesão',
    moeda: 'po',
    valor: 10,
    tamanho: 'P',
    descricao: 'Penas especiais, tintas e pergaminhos.'
  },
  'carpinteiro': {
    id: 'carpinteiro',
    nome: 'Ferramentas de Carpinteiro',
    categoria: 'Artesão',
    moeda: 'po',
    valor: 8,
    tamanho: 'M',
    descricao: 'Serras, martelos e plainas para madeira.'
  },
  'cartografo': {
    id: 'cartografo',
    nome: 'Ferramentas de Cartógrafo',
    categoria: 'Artesão',
    moeda: 'po',
    valor: 15,
    tamanho: 'M',
    descricao: 'Bússolas, tintas e pergaminhos para mapeamento.'
  },
  'coureiro': {
    id: 'coureiro',
    nome: 'Ferramentas de Coureiro',
    categoria: 'Artesão',
    moeda: 'po',
    valor: 5,
    tamanho: 'M',
    descricao: 'Facas e furadores para curtir e moldar couro.'
  },
  'ferreiro': {
    id: 'ferreiro',
    nome: 'Ferramentas de Ferreiro',
    categoria: 'Artesão',
    moeda: 'po',
    valor: 20,
    tamanho: 'G',
    descricao: 'Martelos pesados, pinças e carvão.'
  },
  'funileiro': {
    id: 'funileiro',
    nome: 'Ferramentas de Funileiro',
    categoria: 'Artesão',
    moeda: 'po',
    valor: 10,
    tamanho: 'M',
    descricao: 'Pequenas engrenagens e chaves para consertos diversos.'
  },
  'joalheiro': {
    id: 'joalheiro',
    nome: 'Ferramentas de Joalheiro',
    categoria: 'Artesão',
    moeda: 'po',
    valor: 25,
    tamanho: 'P',
    descricao: 'Lentes e pinças delicadas para pedras preciosas.'
  },
  'oleiro': {
    id: 'oleiro',
    nome: 'Ferramentas de Oleiro',
    categoria: 'Artesão',
    moeda: 'po',
    valor: 10,
    tamanho: 'M',
    descricao: 'Instrumentos para moldar argila.'
  },
  'pedreiro': {
    id: 'pedreiro',
    nome: 'Ferramentas de Pedreiro',
    categoria: 'Artesão',
    moeda: 'po',
    valor: 10,
    tamanho: 'G',
    descricao: 'Cinzeis e marretas para esculpir pedra.'
  },
  'pintor': {
    id: 'pintor',
    nome: 'Suprimentos de Pintor',
    categoria: 'Artesão',
    moeda: 'po',
    valor: 10,
    tamanho: 'M',
    descricao: 'Pincéis, paletas e pigmentos.'
  },
  'sapateiro': {
    id: 'sapateiro',
    nome: 'Ferramentas de Sapateiro',
    categoria: 'Artesão',
    moeda: 'po',
    valor: 5,
    tamanho: 'M',
    descricao: 'Moldes e agulhas para fabricar calçados.'
  },
  'tecelao': {
    id: 'tecelao',
    nome: 'Ferramentas de Tecelão',
    categoria: 'Artesão',
    moeda: 'po',
    valor: 1,
    tamanho: 'M',
    descricao: 'Roldanas, agulhas e fios para tecidos.'
  },
  'vidreiro': {
    id: 'vidreiro',
    nome: 'Ferramentas de Vidreiro',
    categoria: 'Artesão',
    moeda: 'po',
    valor: 30,
    tamanho: 'G',
    descricao: 'Canos de sopro e moldes para vidro.'
  },

  // --- KITS DE JOGO ---
  'baralho': {
    id: 'baralho',
    nome: 'Baralho de Cartas',
    categoria: 'Jogo',
    moeda: 'pp',
    valor: 5,
    tamanho: 'P',
    descricao: 'Cartas de baralho comuns.'
  },
  'xadrez_dragao': {
    id: 'xadrez_dragao',
    nome: 'Conjunto de Xadrez de Dragão',
    categoria: 'Jogo',
    moeda: 'po',
    valor: 1,
    tamanho: 'P',
    descricao: 'Jogo de estratégia complexo com peças entalhadas.'
  },
  'dados': {
    id: 'dados',
    nome: 'Conjunto de Dados',
    categoria: 'Jogo',
    moeda: 'pp',
    valor: 1,
    tamanho: 'P',
    descricao: 'Dados de osso, madeira ou marfim.'
  },
  'tres_dragao': {
    id: 'tres_dragao',
    nome: 'Antessala das Três Dragoas',
    categoria: 'Jogo',
    moeda: 'po',
    valor: 1,
    tamanho: 'P',
    descricao: 'Um popular jogo de cartas de apostas.'
  },

  // --- INSTRUMENTOS MUSICAIS ---
  'alaude': {
    id: 'alaude',
    nome: 'Alaúde',
    categoria: 'Musical',
    moeda: 'po',
    valor: 35,
    tamanho: 'M',
    descricao: 'Instrumento de cordas com corpo em formato de pera.'
  },
  'flauta': {
    id: 'flauta',
    nome: 'Flauta',
    categoria: 'Musical',
    moeda: 'po',
    valor: 2,
    tamanho: 'P',
    descricao: 'Instrumento de sopro melódico.'
  },
  'flauta_pan': {
    id: 'flauta_pan',
    nome: 'Flauta de Pan',
    categoria: 'Musical',
    moeda: 'po',
    valor: 12,
    tamanho: 'P',
    descricao: 'Série de tubos de bambu ou madeira.'
  },
  'gaita_fole': {
    id: 'gaita_fole',
    nome: 'Gaita de Fole',
    categoria: 'Musical',
    moeda: 'po',
    valor: 30,
    tamanho: 'M',
    descricao: 'Instrumento de sopro com reserva de ar.'
  },
  'harpa': {
    id: 'harpa',
    nome: 'Harpa',
    categoria: 'Musical',
    moeda: 'po',
    valor: 75,
    tamanho: 'G',
    descricao: 'Instrumento de cordas grande e elegante.'
  },
  'lira': {
    id: 'lira',
    nome: 'Lira',
    categoria: 'Musical',
    moeda: 'po',
    valor: 30,
    tamanho: 'M',
    descricao: 'Instrumento de cordas portátil.'
  },
  'pandeiro': {
    id: 'pandeiro',
    nome: 'Pandeiro',
    categoria: 'Musical',
    moeda: 'po',
    valor: 5,
    tamanho: 'P',
    descricao: 'Instrumento de percussão manual.'
  },
  'tambor': {
    id: 'tambor',
    nome: 'Tambor',
    categoria: 'Musical',
    moeda: 'po',
    valor: 6,
    tamanho: 'M',
    descricao: 'Instrumento rítmico de percussão.'
  },
  'trombeta': {
    id: 'trombeta',
    nome: 'Trombeta',
    categoria: 'Musical',
    moeda: 'po',
    valor: 5,
    tamanho: 'M',
    descricao: 'Instrumento de sopro metálico.'
  },
  'viola': {
    id: 'viola',
    nome: 'Viola',
    categoria: 'Musical',
    moeda: 'po',
    valor: 30,
    tamanho: 'M',
    descricao: 'Instrumento de cordas clássico.'
  },

  // --- OUTROS ---
  'ladrao': {
    id: 'ladrao',
    nome: 'Ferramentas de Ladrão',
    categoria: 'Outros',
    moeda: 'po',
    valor: 25,
    tamanho: 'P',
    descricao: 'Gazuas, limas e espelhos para armadilhas e fechaduras.'
  },
  'disfarce': {
    id: 'disfarce',
    nome: 'Kit de Disfarce',
    categoria: 'Outros',
    moeda: 'po',
    valor: 25,
    tamanho: 'M',
    descricao: 'Maquiagem e próteses para mudar a aparência.'
  },
  'falsificacao': {
    id: 'falsificacao',
    nome: 'Kit de Falsificação',
    categoria: 'Outros',
    moeda: 'po',
    valor: 15,
    tamanho: 'M',
    descricao: 'Tintas e selos para replicar documentos.'
  },
  'herborismo': {
    id: 'herborismo',
    nome: 'Kit de Herborismo',
    categoria: 'Outros',
    moeda: 'po',
    valor: 5,
    tamanho: 'M',
    descricao: 'Equipamento para colher plantas e criar antídotos e poções.'
  },
  'navegacao': {
    id: 'navegacao',
    nome: 'Ferramentas de Navegação',
    categoria: 'Outros',
    moeda: 'po',
    valor: 25,
    tamanho: 'M',
    descricao: 'Instrumentos para orientação em mar ou terra.'
  },
  'venenos': {
    id: 'venenos',
    nome: 'Kit de Envenenador',
    categoria: 'Outros',
    moeda: 'po',
    valor: 50,
    tamanho: 'M',
    descricao: 'Frascos e reagentes tóxicos.'
  }
};