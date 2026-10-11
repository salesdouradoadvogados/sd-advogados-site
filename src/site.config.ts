// Fonte única dos fatos do escritório (spec v2, P11 e §5.6). Toda página e,
// a partir da Sessão 2, todo dado estruturado lê daqui. Nenhum fato do
// escritório pode ser escrito direto numa página.
//
// Quem preenche é o Leilson, na Sessão 3. Até lá, cada valor provisório leva
// `confirmado: false` e a origem ao lado. O build de produção (Sessão 2) vai
// recusar qualquer valor não confirmado. A LP antiga não é fonte (L4): o que
// saiu de lá está marcado como tal e só vale depois que o Leilson conferir.

export interface Fato<T = string> {
  valor: T;
  confirmado: boolean;
  /** De onde o valor provisório saiu, para o Leilson conferir. */
  origem?: string;
}

export interface Numero {
  valor: string;
  rotulo: string;
  fonte: string | null;
  data: string | null;
  confirmado: boolean;
}

export interface AreaResumo {
  slug: string;
  titulo: string;
  /** Uma frase para o cartão do Início. */
  resumo: string;
}

export const site = {
  nomeCanonico: 'Sales Dourado Advogados',
  nomesAlternativos: ['SD Advogados'],
  url: 'https://salesdouradoadvogados.com.br',
  descricaoCurta: 'Direito de família, dedicado à mulher. Presencial em Ji-Paraná (RO) e online em todo o Brasil.',

  razaoSocial: {
    valor: 'Sales Dourado Advogados Sociedade Individual de Advocacia',
    confirmado: false,
    origem: 'Rodapé da LP antiga (não é fonte, L4); conferir no cartão CNPJ.',
  } satisfies Fato,
  cnpj: {
    valor: '60.415.489/0001-94',
    confirmado: false,
    origem: 'Rodapé da LP antiga (não é fonte, L4); conferir no cartão CNPJ.',
  } satisfies Fato,

  responsavel: {
    nome: 'Leilson Sales Dourado',
    oab: { valor: 'OAB/RO 8970', confirmado: false, origem: 'Assinatura padrão das peças do escritório.' } satisfies Fato,
    desde: { valor: '2017', confirmado: true, origem: 'Texto aprovado do "Quem Somos" (18/07/2026).' } satisfies Fato,
    slug: 'leilson-sales-dourado',
  },

  atendimento: {
    cidade: 'Ji-Paraná',
    uf: 'RO',
    modalidades: 'Presencial em Ji-Paraná (RO) e online em todo o Brasil',
    endereco: null as string | null,
    horario: null as string | null,
  },

  canais: {
    formularioUrl: 'https://atendimento.salesdouradoadvogados.com.br/formulario',
    /** Só aparece no site quando o Leilson informar (decisão em aberto nº 9). */
    whatsapp: null as string | null,
    instagram: null as string | null,
  },

  // L10: só entram números verificáveis, com fonte e data. Os dois primeiros
  // são os da prévia aprovada, tirados da LP antiga, e não têm fonte: não vão
  // ao ar assim. "7 anos" ainda precisa da redação certa (a LP falava em
  // "quase 7 anos como assistente de Promotoria").
  numeros: [
    { valor: '10 mil+', rotulo: 'processos de Direito de Família acompanhados', fonte: null, data: null, confirmado: false },
    { valor: '7 anos', rotulo: 'no Ministério Público, antes de advogar só para mães', fonte: null, data: null, confirmado: false },
    { valor: '2017', rotulo: 'ano em que o advogado responsável passou a atuar', fonte: 'Texto aprovado do "Quem Somos" (18/07/2026)', data: '2026-07-18', confirmado: true },
  ] satisfies Numero[],

  // L8: as seis áreas com página própria. A ordem é a do Início.
  areas: [
    { slug: 'divorcio', titulo: 'Divórcio', resumo: 'Consensual ou litigioso, no cartório ou na Justiça, com a partilha e a guarda tratadas junto.' },
    { slug: 'guarda', titulo: 'Guarda', resumo: 'Compartilhada ou unilateral: o que cada uma decide sobre a vida dos filhos e o que não muda com ela.' },
    { slug: 'visitas-e-convivencia', titulo: 'Visitas e convivência', resumo: 'O regime de convivência, o descumprimento e as mudanças que a vida pede com o tempo.' },
    { slug: 'pensao-alimenticia', titulo: 'Pensão alimentícia', resumo: 'Pedido, revisão e cobrança, inclusive os meios que a lei dá para fazer o pagamento acontecer.' },
    { slug: 'viagem-ao-exterior', titulo: 'Autorização para viagem ao exterior', resumo: 'Quando a autorização do outro genitor é exigida e o que fazer quando ele se recusa a dar.' },
    { slug: 'mudanca-de-estado', titulo: 'Autorização para mudança de estado', resumo: 'Mudar de cidade ou de estado com a criança sem perder a guarda nem descumprir o que foi combinado.' },
  ] satisfies AreaResumo[],
} as const;

export type Site = typeof site;
