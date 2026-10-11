// Coleções de conteúdo (spec v2, §5). Esquema preliminar da Sessão 1: cobre o
// que os cinco moldes leem. A Sessão 2 completa o esquema e acrescenta o
// verificador do §6 (contagem de palavras, órfãs, dados pessoais etc.).
//
// Pergunta prevista x resposta escrita: as listas de perguntas (etapas,
// vizinhas, destaques) aceitam uma pergunta ainda sem página. Ela aparece como
// texto, marcada "em preparação". Quando a resposta for escrita, o item ganha
// o `slug` e vira link. Um `slug` que não corresponde a nenhuma resposta é
// erro de referência (verificador, Sessão 2).
import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const status = z.enum(['rascunho', 'revisao', 'publicado']);

const revisao = {
  status,
  revisado_por: reference('pessoas'),
  revisado_em: z.coerce.date().optional(),
  publicado_em: z.coerce.date().optional(),
  alteracoes: z.array(z.object({ data: z.coerce.date(), nota: z.string() })).default([]),
  /** Texto de exemplo da prévia, ainda não escrito pelo escritório. */
  exemplo: z.boolean().default(false),
};

const pergunta = z.object({
  pergunta: z.string(),
  slug: z.string().optional(),
});

const baseLegal = z.object({
  norma: z.string(),
  dispositivo: z.string(),
  url: z.url(),
});

const respostas = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/respostas' }),
  schema: z.object({
    id: z.string().regex(/^R-\d{4}$/),
    pergunta: z.string(),
    resposta_direta: z.string(),
    /** Cada item: "**Condição.** Explicação." O trecho em negrito abre a linha. */
    depende_de: z.array(z.string()).min(2).max(5),
    situacoes: z.array(reference('situacoes')).min(1),
    etapa: z.string().optional(),
    termos: z.array(z.string()).default([]),
    base_legal: z.array(baseLegal).min(1),
    vizinhas: z.array(pergunta).default([]),
    ambito: z.enum(['nacional', 'rondonia']).default('nacional'),
    origem_pauta: z.enum(['atendimento', 'redes', 'busca', 'escritorio']),
    leitura_minutos: z.number().int().positive().optional(),
    ...revisao,
  }),
});

const situacoes = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/situacoes' }),
  schema: z.object({
    id: z.string().regex(/^S-\d{2}$/),
    titulo: z.string(),
    resumo: z.string(),
    ordem: z.number().int(),
    areas: z.array(reference('areas')).min(1),
    etapas: z.array(z.object({
      slug: z.string(),
      titulo: z.string(),
      texto: z.string(),
      respostas: z.array(pergunta).default([]),
      liga_documentos: z.boolean().default(false),
    })).min(1),
    bifurcacoes: z.array(z.object({
      titulo: z.string(),
      texto: z.string(),
      pergunta,
    })).default([]),
    documentos: z.array(z.string()).default([]),
    emergencia: z.boolean().default(false),
    ...revisao,
  }),
});

const areas = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/areas' }),
  schema: z.object({
    id: z.string().regex(/^A-\d{2}$/),
    titulo: z.string(),
    /** Como a área aparece no meio de uma frase ("sobre pensão"). */
    nome_curto: z.string().optional(),
    resumo: z.string(),
    ordem: z.number().int(),
    inclui: z.array(z.string()).min(1),
    frentes: z.object({
      titulo: z.string(),
      texto: z.string(),
      itens: z.array(z.object({ titulo: z.string(), texto: z.string() })).length(3),
    }),
    respostas_destaque: z.array(pergunta.extend({ situacao: z.string() })).max(6).default([]),
    faq: z.array(z.object({ pergunta: z.string(), resposta: z.string() })).min(3).max(6),
    termos: z.array(z.string()).default([]),
    ...revisao,
  }),
});

const pessoas = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pessoas' }),
  schema: z.object({
    nome: z.string(),
    oab: z.string(),
    funcao: z.string(),
    bio: z.string(),
    foto: z.string(),
    perfis: z.array(z.url()).default([]),
  }),
});

export const collections = { respostas, situacoes, areas, pessoas };
