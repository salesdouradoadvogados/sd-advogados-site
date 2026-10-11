# Site público — Sales Dourado Advogados

Base de respostas de direito de família, navegável por situação, com a casca de
um escritório estabelecido em volta. A especificação é
`docs/spec-site-sd-advogados-v2.md`; o design segue o sistema do portal, com as
divergências registradas no §4.8 da spec.

## Rodar

Node 22.12 ou mais novo (`.nvmrc`).

```sh
npm install
npm run dev      # desenvolvimento, sem a busca (o índice só existe depois do build)
npm run build    # build estático em dist/ + índice do Pagefind em dist/pagefind/
npm run preview  # serve o dist/, com a busca funcionando
npm run check    # verificação de tipos do Astro
```

## Onde fica cada coisa

| Caminho | O que é |
|---|---|
| `src/site.config.ts` | Fonte única dos fatos do escritório. Nenhuma página escreve um fato direto. Valor provisório leva `confirmado: false`. |
| `src/content/` | Respostas, situações, áreas e pessoas. Esquema em `src/content.config.ts`. |
| `src/data/pauta.ts` | Pauta das situações, só para as prévias. |
| `src/styles/global.css` | Tokens do portal e as receitas do site. Nenhuma cor fora dos tokens. |
| `src/pages/` | Início, Área, Situação, Resposta, O escritório e a página de erro. |
| `public/_headers` | Cache e `noindex` das prévias no Cloudflare Pages. |
| `docs/previa-v2/` | Fonte da prévia aprovada em 11/10/2026, referência visual. |

## Estado

Sessão 1 da spec (§10): fundação e os cinco moldes em prévia. Todo build é
prévia: constrói os rascunhos, mostra a faixa de aviso e responde `noindex`. O
modo de produção chega com o verificador, na Sessão 2. O relatório da sessão
está em `docs/sessao1-relatorio.md`.

## Cloudflare Pages

O projeto é criado pelo escritório. Configuração: build `npm run build`, saída
`dist`, variável `NODE_VERSION=22`. Nenhuma variável de ambiente é necessária.
