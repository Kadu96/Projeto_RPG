import { type RacaData } from '../types/racas';

export const RACAS_DATA: Record<string, RacaData> = {
  'anao-colina': {
    nome: 'Anão da Colina',
    idioma: ['Comum', 'Anão'],
    maestria: [
      { tipo: 'arma', valor: 2, maestria: 'Machados', selecionavel: false },
      { tipo: 'arma', valor: 2, maestria: 'Martelos', selecionavel: false },
      { tipo: 'ferramenta', valor: 2, maestria: 'Ferramentas de Artesão', selecionavel: true },
    ],
    recursos: [
      { valor: 10, reserva: 'vida' },
      { valor: 8, reserva: 'mana' },
      { valor: 10, reserva: 'vigor' },
    ],
    bonus_attr: [
      { valor: 2, atributo: 'forca' },
      { valor: 1, atributo: 'sabedoria' },
    ],
    deslocamento: '7.5',
    caracteristicas: [
      {
        nome: 'Tenacidade Anã',
        descricao:
          'Seu máximo de pontos de vida aumenta em 1, e aumenta em 1 a cada nível que você ganha.',
        efeito: { tipo: 'RECURSO_POR_NIVEL', alvo: 'vida', valor: 1 }
      },
      { nome: 'Visão no Escuro', descricao: 'Enxerga 18m no escuro.' },
    ],
  },
  'anao-montanha': {
    nome: 'Anão da Montanha',
    idioma: ['Comum', 'Anão'],
    maestria: [
      { tipo: 'arma', valor: 2, maestria: 'Machados', selecionavel: false },
      { tipo: 'arma', valor: 2, maestria: 'Martelos', selecionavel: false },
      { tipo: 'armadura', valor: 2, maestria: 'Armaduras Leves', selecionavel: false },
      { tipo: 'armadura', valor: 2, maestria: 'Armaduras Médias', selecionavel: false },
    ],
    recursos: [
      { valor: 10, reserva: 'vida' },
      { valor: 8, reserva: 'mana' },
      { valor: 10, reserva: 'vigor' },
    ],
    bonus_attr: [
      { valor: 2, atributo: 'constituicao' },
      { valor: 2, atributo: 'forca' },
    ],
    deslocamento: '7.5',
    caracteristicas: [
      {
        nome: 'Resiliência Anã',
        descricao: 'Vantagem em salvaguardas contra veneno e resistência a dano de veneno.',
      },
    ],
  },
  'elfo-alto': {
    nome: 'Alto Elfo',
    idioma: ['Comum', 'Élfico', 'Adicional'],
    maestria: [
      { tipo: 'arma', valor: 2, maestria: 'Espadas', selecionavel: false },
      { tipo: 'arma', valor: 2, maestria: 'Arcos', selecionavel: false },
      { tipo: 'pericia', valor: 2, maestria: 'Percepção', selecionavel: false },
    ],
    recursos: [
      { valor: 8, reserva: 'vida' },
      { valor: 12, reserva: 'mana' },
      { valor: 10, reserva: 'vigor' },
    ],
    bonus_attr: [
      { valor: 2, atributo: 'destreza' },
      { valor: 1, atributo: 'inteligencia' },
    ],
    deslocamento: '9',
    caracteristicas: [
      {
        nome: 'Ancestralidade Feérica',
        descricao: 'Vantagem contra ser encantado e imune a dormir por magia.',
      },
      { 
        nome: 'Truque', 
        descricao: 'Você conhece um truque da lista de magias.',
        efeito: { tipo: 'SELECAO_DE_MAGIA', alvo: 'lista_magias', valor: 1 }
      },
    ],
  },
  'elfo-floresta': {
    nome: 'Elfo da Floresta',
    idioma: ['Comum', 'Élfico'],
    maestria: [
        { tipo: 'arma', valor: 2, maestria: 'Espadas', selecionavel: false },
        { tipo: 'arma', valor: 2, maestria: 'Arcos', selecionavel: false }
    ],
    recursos: [
      { valor: 8, reserva: 'vida' },
      { valor: 10, reserva: 'mana' },
      { valor: 12, reserva: 'vigor' },
    ],
    bonus_attr: [
      { valor: 2, atributo: 'destreza' },
      { valor: 1, atributo: 'sabedoria' },
    ],
    deslocamento: '10.5',
    caracteristicas: [
      { 
        nome: 'Pés Ligeiros', 
        descricao: 'Seu deslocamento base aumenta para 10,5 metros.'
      },
    ],
  },
  drow: {
    nome: 'Elfo Negro (Drow)',
    idioma: ['Comum', 'Élfico'],
    maestria: [
        { tipo: 'arma', valor: 2, maestria: 'Rapieras', selecionavel: false },
        { tipo: 'arma', valor: 2, maestria: 'Bestas', selecionavel: false }
    ],
    recursos: [
      { valor: 8, reserva: 'vida' },
      { valor: 12, reserva: 'mana' },
      { valor: 10, reserva: 'vigor' },
    ],
    bonus_attr: [
      { valor: 2, atributo: 'destreza' },
      { valor: 1, atributo: 'carisma' },
    ],
    deslocamento: '9',
    caracteristicas: [
      { nome: 'Visão no Escuro Superior', descricao: 'Enxerga 36m no escuro.' },
      { nome: 'Sensibilidade à Luz Solar', descricao: 'Desvantagem em ataques na luz do dia.' },
    ],
  },
  humano: {
    nome: 'Humano',
    idioma: ['Comum', 'Adicional'],
    maestria: [],
    recursos: [
      { valor: 10, reserva: 'vida' },
      { valor: 10, reserva: 'mana' },
      { valor: 10, reserva: 'vigor' },
    ],
    bonus_attr: [
      { valor: 1, atributo: 'forca' },
      { valor: 1, atributo: 'destreza' },
      { valor: 1, atributo: 'constituicao' },
      { valor: 1, atributo: 'inteligencia' },
      { valor: 1, atributo: 'sabedoria' },
      { valor: 1, atributo: 'carisma' },
    ],
    deslocamento: '9',
    caracteristicas: [],
  },
  halfling: {
    nome: 'Halfling',
    idioma: ['Comum', 'Halfling'],
    maestria: [],
    recursos: [
      { valor: 8, reserva: 'vida' },
      { valor: 8, reserva: 'mana' },
      { valor: 12, reserva: 'vigor' },
    ],
    bonus_attr: [{ valor: 2, atributo: 'destreza' }],
    deslocamento: '7.5',
    caracteristicas: [
      { nome: 'Sortudo', descricao: 'Ao rolar 1 em um d20, você pode rolar novamente.' },
    ],
  },
  dragonborn: {
    nome: 'Draconato',
    idioma: ['Comum', 'Dracônico'],
    maestria: [],
    recursos: [
      { valor: 12, reserva: 'vida' },
      { valor: 8, reserva: 'mana' },
      { valor: 10, reserva: 'vigor' },
    ],
    bonus_attr: [
      { valor: 2, atributo: 'forca' },
      { valor: 1, atributo: 'carisma' },
    ],
    deslocamento: '9',
    caracteristicas: [
      {
        nome: 'Ancestralidade Dracônica',
        descricao: 'Sopro elemental e resistência baseada na cor do dragão.',
      },
    ],
  },
  'meio-orc': {
    nome: 'Meio-Orc',
    idioma: ['Comum', 'Orc'],
    maestria: [{ tipo: 'pericia', valor: 2, maestria: 'Intimidação', selecionavel: false }],
    recursos: [
      { valor: 12, reserva: 'vida' },
      { valor: 6, reserva: 'mana' },
      { valor: 12, reserva: 'vigor' },
    ],
    bonus_attr: [
      { valor: 2, atributo: 'forca' },
      { valor: 1, atributo: 'constituicao' },
    ],
    deslocamento: '9',
    caracteristicas: [
      {
        nome: 'Resistência Implacável',
        descricao: 'Quando cai a 0 PV, pode voltar com 1 PV uma vez por descanso longo.',
      },
    ],
  },
  tiefling: {
    nome: 'Tiefling',
    idioma: ['Comum', 'Infernal'],
    maestria: [],
    recursos: [
      { valor: 8, reserva: 'vida' },
      { valor: 14, reserva: 'mana' },
      { valor: 8, reserva: 'vigor' },
    ],
    bonus_attr: [
      { valor: 1, atributo: 'inteligencia' },
      { valor: 2, atributo: 'carisma' },
    ],
    deslocamento: '9',
    caracteristicas: [
      { nome: 'Resistência Infernal', descricao: 'Resistência a dano de Fogo.' },
      { 
        nome: 'Legado Infernal', 
        descricao: 'Conhece truques e magias sombrias.',
        efeito: { tipo: 'SELECAO_DE_MAGIA', alvo: 'lista_magias', valor: 3} 
      },
    ],
  },
  gnomo: {
    nome: 'Gnomo',
    idioma: ['Comum', 'Gnômico'],
    maestria: [],
    recursos: [
      { valor: 8, reserva: 'vida' },
      { valor: 14, reserva: 'mana' },
      { valor: 8, reserva: 'vigor' },
    ],
    bonus_attr: [{ valor: 2, atributo: 'inteligencia' }],
    deslocamento: '7.5',
    caracteristicas: [
      {
        nome: 'Esperteza Gnômica',
        descricao: 'Vantagem em salvaguardas de inteligencia, sabedoria e carisma contra magia.',
      },
    ],
  },
};
