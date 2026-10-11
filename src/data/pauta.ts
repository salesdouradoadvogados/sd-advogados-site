// Pauta-semente das situações (Anexo A da spec), na ordem do Início.
//
// Serve só às prévias: mostra a forma final da lista enquanto as situações
// ainda não foram escritas. Uma situação da pauta só vira link quando existe
// o arquivo dela em src/content/situacoes/ com o mesmo slug. As áreas dizem
// em que página de Área ela aparece (provisório, até a situação existir). Em produção, a
// lista sai das situações publicadas e esta pauta deixa de ser usada
// (Sessão 2). A pauta definitiva é do Leilson (trilho de conteúdo).

export interface ItemDaPauta {
  slug: string;
  titulo: string;
  /** Uma linha, na voz do escritório, abaixo do título na lista. */
  tema: string;
  /** Slugs das áreas (site.config.ts) em que a situação aparece. */
  areas: string[];
}

export const pautaDeSituacoes: ItemDaPauta[] = [
  { slug: 'ele-parou-de-pagar-a-pensao', titulo: 'Ele parou de pagar a pensão', tema: 'Cobrança, protesto e prisão civil', areas: ['pensao-alimenticia'] },
  { slug: 'nunca-pedi-pensao-e-quero-pedir', titulo: 'Nunca pedi pensão e quero pedir', tema: 'Como pedir e a partir de quando vale', areas: ['pensao-alimenticia'] },
  { slug: 'a-pensao-nao-cobre-os-gastos', titulo: 'A pensão não cobre os gastos', tema: 'Revisão do valor e despesas extras', areas: ['pensao-alimenticia'] },
  { slug: 'ele-quer-diminuir-a-pensao', titulo: 'Ele quer diminuir a pensão', tema: 'O que ele precisa provar', areas: ['pensao-alimenticia'] },
  { slug: 'ele-esconde-o-que-ganha', titulo: 'Ele esconde o que ganha', tema: 'Como a renda dele é apurada', areas: ['pensao-alimenticia'] },
  { slug: 'quero-me-separar', titulo: 'Quero me separar', tema: 'Divórcio com ou sem acordo', areas: ['divorcio'] },
  { slug: 'ele-ameaca-tirar-a-guarda', titulo: 'Ele ameaça tirar a guarda de mim', tema: 'O que a guarda decide e o que não decide', areas: ['guarda'] },
  { slug: 'ele-nao-cumpre-as-visitas', titulo: 'Ele não cumpre as visitas', tema: 'Convivência combinada e descumprida', areas: ['visitas-e-convivencia'] },
  { slug: 'estou-gravida-e-ele-sumiu', titulo: 'Estou grávida e ele sumiu', tema: 'Alimentos na gravidez e reconhecimento', areas: ['pensao-alimenticia'] },
  { slug: 'quero-me-mudar-de-cidade', titulo: 'Quero me mudar de cidade com meu filho', tema: 'Autorização para mudar de estado', areas: ['mudanca-de-estado', 'guarda'] },
  { slug: 'vivemos-juntos-sem-casar', titulo: 'Vivemos juntos sem casar', tema: 'União estável: direitos e partilha', areas: ['divorcio'] },
  { slug: 'tenho-medo-dele', titulo: 'Tenho medo dele', tema: 'Medida protetiva e os primeiros passos', areas: ['divorcio', 'guarda'] },
];

// Teses de exemplo do "Além do post" no Início. Os posts entram na Sessão 3.
export const postsDeExemplo = [
  { formato: 'Carrossel', tese: 'Guarda compartilhada não quer dizer metade do tempo com cada um.' },
  { formato: 'Reels', tese: 'Acordo de pensão feito sem a Justiça é mais difícil de cobrar.' },
  { formato: 'Imagem', tese: 'Quem recebe a pensão é a criança, mesmo que o dinheiro passe pela mãe.' },
];
