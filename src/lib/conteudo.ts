// Leitura das coleções e as regras que os moldes compartilham.
import { getCollection, type CollectionEntry } from 'astro:content';

/**
 * Sessão 1: todo build é prévia. Prévia constrói rascunhos, mostra a faixa de
 * "texto de exemplo" e responde noindex. O modo de produção (só `publicado`,
 * recusa de fato não confirmado) chega com o verificador, na Sessão 2.
 */
export const emPrevia = true;

/** A prévia responde noindex. Para medir o Lighthouse localmente como a página
 *  de produção será medida (a nota de SEO cai com noindex), o build aceita
 *  SITE_MEDIR_INDEXAVEL=1. Nunca é usado no deploy. */
const env = (globalThis as { process?: { env: Record<string, string | undefined> } }).process?.env ?? {};
export const indexavel = !emPrevia || env.SITE_MEDIR_INDEXAVEL === '1';

type ComRevisao = { data: { status: 'rascunho' | 'revisao' | 'publicado' } };

/** O que entra no build: em prévia, tudo; em produção, só o publicado. */
export function visivel(e: ComRevisao): boolean {
  return emPrevia || e.data.status === 'publicado';
}

export async function respostas() {
  return (await getCollection('respostas', visivel)).sort((a, b) => a.data.id.localeCompare(b.data.id));
}
export async function situacoes() {
  return (await getCollection('situacoes', visivel)).sort((a, b) => a.data.ordem - b.data.ordem);
}
export async function areas() {
  return (await getCollection('areas', visivel)).sort((a, b) => a.data.ordem - b.data.ordem);
}

export const url = {
  inicio: '/',
  situacoes: '/#situacoes',
  areas: '/#areas',
  /** O índice /respostas/ é da Sessão 3. Até lá, "Respostas" leva à busca. */
  respostas: '/#busca',
  atendimento: '/#atendimento',
  escritorio: '/escritorio/',
  ficha: '/escritorio/#ficha',
  conversar: '#conversar',
  situacao: (slug: string) => `/situacoes/${slug}/`,
  resposta: (slug: string) => `/respostas/${slug}/`,
  area: (slug: string) => `/areas/${slug}/`,
};

/** "11/10/2026", no fuso do escritório. */
export function dataCurta(d: Date): string {
  return d.toLocaleDateString('pt-BR', { timeZone: 'America/Porto_Velho', day: '2-digit', month: '2-digit', year: 'numeric' });
}

/** A linha de revisão que a página mostra. Sem data, diz que está pendente: o
 *  site nunca escreve "Revisado em" sem a revisão ter acontecido. */
export function revisao(e: { data: { revisado_em?: Date; status: string } }): { feita: boolean; texto: string } {
  if (e.data.revisado_em && e.data.status !== 'rascunho') {
    return { feita: true, texto: dataCurta(e.data.revisado_em) };
  }
  return { feita: false, texto: 'pendente' };
}

const numeros = ['zero', 'uma', 'duas', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove', 'dez'];
/** "cinco etapas", por extenso até dez. */
export function etapasPorExtenso(n: number): string {
  const palavra = n <= 10 ? numeros[n] : String(n);
  return `${palavra} ${n === 1 ? 'etapa' : 'etapas'}`;
}

/** Remove a marcação de negrito de "**Condição.** Explicação." e devolve as
 *  duas partes, para a lista "Depende de". */
export function partirCondicao(item: string): { condicao: string; explicacao: string } {
  const m = item.match(/^\*\*(.+?)\*\*\s*(.*)$/s);
  return m ? { condicao: m[1], explicacao: m[2] } : { condicao: '', explicacao: item };
}

export type Resposta = CollectionEntry<'respostas'>;
export type Situacao = CollectionEntry<'situacoes'>;
export type Area = CollectionEntry<'areas'>;
