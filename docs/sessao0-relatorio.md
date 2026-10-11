# Sessão 0 — Diagnóstico do terreno

> **Projeto:** site público do escritório (`sd-advogados-site`)
> **Spec de referência:** `spec-site-sd-advogados-v1.md` (10/10/2026), §10, Sessão 0
> **Data:** 10/10/2026 · **Revisão:** 11/10/2026, seção 2 refeita depois que o domínio foi liberado para o ambiente
> **Autor:** Claude, sessão de diagnóstico, sem código
> **Commits lidos:** portal `sd-advogados-portal-cliente@f05cb6e` (o mesmo que a spec cita) · CRM `sd-advogados-ia@e61c273`
> **Estado:** aguardando leitura do Leilson. As decisões nº 1 e nº 6 travam a Sessão 1.

## Como ler este relatório

Cada afirmação traz a origem. Três marcas aparecem ao longo do texto:

- **Verificado**: li no código ou medi.
- **Fonte secundária**: veio de trecho de busca na web; não abri a página original, porque o ambiente bloqueou.
- **Não verificado**: não consegui conferir; está dito por quê e o que falta.

Regras desta sessão, cumpridas: nenhum código do site, nenhuma dependência instalada, nada alterado no portal nem no CRM. Não abri migrations, seeds, `seed-data/` nem as pastas de diagnóstico. Em um ponto (§3.3) listei só os **nomes** dos arquivos de migration, sem abrir nenhum. Nenhum dado de cliente, lead ou processo entra aqui.

Limite do ambiente: em 10/10 a política de rede desta sessão bloqueou o domínio do escritório, os resolvedores de DNS públicos e as páginas de documentação (Astro, Cloudflare). O registro do npm ficou acessível. Em 11/10 o domínio foi liberado e a seção 2 foi refeita por HTTPS. Seguem sem verificação os registros DNS e o comportamento em `http://`. Parte da seção 5 vem de fonte secundária.

## Resumo

**O que encontrei**

- O design system do portal porta bem para um site estático: tokens, `extend` do Tailwind e bloco de movimento reduzido entram quase sem mudança. Todos os valores de cor e os contrastes da spec conferem.
- Não existe logo em vetor em nenhum dos dois repositórios, só PNG. A imagem de compartilhamento do portal é um print da tela de login.
- O portal não carrega a Playfair itálica, que a spec usa como sinal da voz da leitora.
- O formulário do CRM não lê nenhum parâmetro de URL. A origem é decidida pelo canal de entrada, e toda lead do formulário vira "Instagram (formulário)". Uma origem "IA" exige mudança de banco: valor novo num enum e alteração da RPC de envio.
- O "Quem Somos" aprovado (18/07/2026) está em `QuemSomos.tsx`, no CRM, servido em `atendimento.salesdouradoadvogados.com.br/quem-somos`, numa SPA com `noindex`. Hoje nenhum buscador nem IA enxerga esse texto.
- Astro estável: 7.3.8. Pagefind: 1.5.2. A integração oficial do Tailwind 3 (`@astrojs/tailwind`) está descontinuada e não aceita Astro 6 nem 7. Com Tailwind 3.4, o caminho é PostCSS direto, a validar no primeiro build da Sessão 1.
- A raiz e o `www` redirecionam com 301 para `lp.`, preservando o caminho (verificado em 11/10). A raiz passa pela Cloudflare; o `www` e o `lp.` são servidos direto pela hospedagem, sem Cloudflare. A LP é WordPress com Elementor, uma página só, indexável e sem meta description. Confere com o §9.3 da spec.

**O que não consegui verificar**

- Os registros DNS (tipo, destino, nuvem laranja ou cinza) e o comportamento em `http://`. Ficam para o painel da Cloudflare (§7.1, C1 e C2).

**O que precisa de resposta**

- Decisões nº 1 (nome canônico) e nº 6 (tipografia), que travam a Sessão 1 (§7.4).
- Os itens do painel da Cloudflare, do Search Console e do Bing (§7.1 a §7.3).
- O arquivo original da logo, o uso da foto que já existe e se a spec pode ser versionada neste repositório (§7.5).

## 1. Design system do portal

**Commit lido:** `f05cb6e7eb3e` (merge da PR #247, 10/10/2026, 12:11 -0400), o mesmo que a spec cita. Arquivos: `docs/design-system.md`, `src/index.css`, `tailwind.config.ts`, `index.html`, `public/_headers`, `package.json` e `package-lock.json`, `src/components/client/`, `src/components/ui/button.tsx`, `src/components/TimelineCard.tsx`.

As referências da spec ao documento conferem: §8 (ficha com contexto), §11 (voz), §12 (levar para outro app), §13 (checklist) e os princípios 3, 5 e 6.

### 1.1 Portável como está

| O quê | Onde | Observação |
|---|---|---|
| Tokens do tema claro (bloco `:root`) | `src/index.css`, linhas 8–136 | HSL, como a spec lista no §4.1. Entram: `background`, `foreground`, `card`, `card-foreground`, `primary`, `primary-foreground`, `muted`, `muted-foreground`, `accent`, `accent-foreground`, `border`, `input`, `ring`, `radius`, `gold`/`-light`/`-dark`, `navy`/`-light`/`-dark`/`-ink`, `ivory`, `sand`, `success`/`-foreground`/`-soft`, `destructive`/`-foreground`, `warning`/`-strong`/`-soft`/`-border`. Ficam de fora: `sidebar-*`, `chart-*` e `nivel-*` (só admin), `popover` e `secondary` (shadcn). |
| `extend.colors` e `extend.fontFamily` | `tailwind.config.ts`, linhas 16–94 | Mesma API no Tailwind 3. Tirar as chaves dos tokens que ficam de fora. |
| `borderRadius` via `--radius` | `tailwind.config.ts`, linhas 95–99 | Portável. |
| `@layer base`: borda padrão, `::selection` dourado, `:focus-visible` com `ring`, barra de rolagem, `.tabular`, `h1`–`h6` em Playfair | `src/index.css`, linhas 216–325 | Portável. No `body`, trocar `bg-background` por `bg-ivory` (a cliente sempre vê `ivory`; no portal cada tela aplica a classe). O estilo do seletor de data não serve: o site não tem formulário. |
| `.animate-fade-in` e o keyframe `fade-in` | `src/index.css`, linhas 328–330 e 759–768 | Portável. Está duplicado (também no `extend.animation` do config): manter um só. |
| `.scrollbar-none`, `.btn-soft-gold`, `.titulo-secao` | `src/index.css`, linhas 381–395 e 483–494 | Portáveis, se usados. `.btn-soft-gold` serve para a ação secundária (WhatsApp, decisão nº 9). |
| Bloco `prefers-reduced-motion` | `src/index.css`, linhas 772–788 | Portável. Reduzir às classes usadas e acrescentar a animação nova do fio (§4.5 da spec). |
| Receita do fio | `TimelineCard.tsx:35` (`bg-gradient-to-b from-gold/60 to-border`) e `.linha-carregamento*` (`index.css`, linhas 355–379) | Classes puras. A cascata usa `animationDelay` por índice em estilo inline; no Astro o atraso sai pronto no HTML do build, sem JavaScript. |
| Regra de cache | `public/_headers` | Confere com o §9.2 da spec: catch-all com `max-age=0, must-revalidate`; arquivos com hash por um ano, sem `immutable`, com o motivo de 21/08 comentado. O caminho precisa de ajuste (§5, D12). |
| Método para medir o runtime do Pages | `scripts/verificar-pages.sh` | Mede `_headers` no runtime real do Pages (wrangler), em vez de deduzir da documentação. Reaproveitável na Sessão 2. |

### 1.2 Não serve ao site

Bloco `.dark` (o site não tem tema escuro); `.pill*`, `.medalhao`, `.rolagem-discreta`, `.animate-badge-pop`, `.animate-entrada-pagina` e `.animate-slide-down` (vocabulário de painel); arrasto (`.vaga-de-arrasto`, `.clone-de-arrasto*`, `@keyframes pegar-card`); folha do editor (`.folha-documento*`, `.doc-*`); impressão amarrada à raiz do React (`body > #root`, `.impressao-raiz`); plugin `tailwindcss-animate` e keyframes `accordion-*` (dependem do Radix); `darkMode: ["class"]`. O `content` do config aponta para `.ts`/`.tsx` e precisa listar `.astro`, `.md` e `.mdx`.

### 1.3 Depende de React ou shadcn: reescrever como classe ou componente Astro

| Receita | No portal | O que muda no site |
|---|---|---|
| Header (`ClientHeader`) | `src/components/client/client-header.tsx` (React, `react-router`, `Button` do shadcn, `lucide-react`, `logo.png`) | Vira componente Astro com as mesmas classes: `bg-primary text-gold px-4 sm:px-6 py-4 flex items-center justify-between gap-2`; links fantasma `text-gold hover:text-gold-light hover:bg-navy-light gap-1 px-2`; `min-w-0` no bloco da marca. O design system manda não copiar o header; no site a cópia é inevitável (D5). |
| Hero (`ClientHero`) | `src/components/client/client-hero.tsx` | Classes portáveis: `bg-gradient-to-b from-navy to-navy-dark`, `pb-16` com sobreposição, título `font-serif text-2xl sm:text-3xl font-semibold leading-tight text-balance`, subtítulo `text-sand text-sm`. |
| Rodapé (`ClientFooter`) | mesmo arquivo do header | Reescrever. O portal usa `text-xs text-muted-foreground` sobre `ivory`: 4,46:1, abaixo do AA. O site deve usar o `--ink-secondary` do §4.2 da spec. |
| Botões (`buttonVariants`) | `src/components/ui/button.tsx` (CVA) | Reescrever como classes (`.btn`, `.btn-cta`), mantendo a elevação de hover. |
| Ficha com contexto (§8 do documento) | receita de modal do admin (`DialogContent`; `ContextoCompacto` em React no celular) | Vira layout de página: `grid md:grid-cols-[minmax(0,1fr)_292px]` com `aside` parado por `position: sticky`; no celular, bloco compacto no topo. |
| Ícones | `lucide-react` 0.462.0 | Lucide estático (`lucide-static` ou `@lucide/astro`, §5). |
| Fontes | `@import` do Google Fonts no `index.css`: Inter 300–700 e Playfair Display 400–700, **sem itálico** | Arquivos próprios em woff2, com o eixo itálico da Playfair (D2, D3). |
| `@tailwindcss/typography` | instalado (0.5.16), mas **não habilitado** no `tailwind.config.ts` | Nada a portar: o `prose` do site é configurado do zero sobre os tokens. |

### 1.4 Arquivos de marca

| Arquivo | Repositório | Formato | Serve para o site? |
|---|---|---|---|
| `src/assets/logo.png` | portal | PNG 1853×1920, 101 KB, fundo transparente: monograma circular dourado (SD, com "SALES DOURADO / ADVOGADOS" em volta) | Só como referência. É raster e pesa 101 KB para aparecer com 40 px no header. |
| `public/favicon.svg` | portal | SVG vetorial: o "S" da Playfair em path, que troca de tom por `prefers-color-scheme` | Sim, com título próprio (hoje diz "Portal SD"). Decidir entre S, D ou monograma. |
| `public/favicon.ico`, `public/apple-touch-icon.png` (180×180, fundo navy), `public/safari-pinned-tab.svg` | portal | ICO com 3 tamanhos; PNG; SVG | Sim, com a mesma decisão. |
| `public/og-image.png` | portal | PNG 1920×1080: print da tela de login do portal | Não. O site gera um cartão por página (§7 da spec). |
| `public/placeholder.svg` | portal | marcador padrão do shadcn/Lovable | Não é marca. |
| `design/identidade-visual/*.png` | CRM | logos horizontal e vertical (branca e dourada), monograma circular (branco e dourado), padrão; PNG de 3014 a 7829 px de largura, de ~170 a ~690 KB | Boa resolução, mas raster. |
| `frontend/public/favicon.svg` | CRM | SVG: o "D" da Playfair 900 | Referência. |
| `frontend/src/assets/leilson-bio.webp` | CRM | foto real do Leilson, WebP, ~19 KB, usada na bio e no "Quem Somos" | Talvez (decisão nº 12; pergunta no §7.5). |

**Conclusão:** não existe logo em vetor (SVG, AI, PDF ou EPS) nos dois repositórios. Os únicos vetores são favicons de uma letra. O header e o cartão de compartilhamento pedem a marca em vetor (D4).

**Duas identidades no terreno.** O `design/identidade-visual/README.md` do CRM (v1.1, junho/2026) se declara "referência canônica de design para toda a plataforma" e usa Cormorant Garamond + Raleway, navy `#1B2B4A` e dourado `#B8A06E`. O portal usa Playfair Display + Inter, navy `#142543` e dourado `#c1a05c`. O §12 do design system do portal diz que são sistemas separados de propósito e que misturá-los exige decisão explícita de unificação de marca. Isso pesa na decisão nº 6 (§7.4) e no D6.

### 1.5 Contrastes da spec, recalculados

Converti os tokens HSL do `index.css` para RGB de 8 bits e recalculei as razões de contraste WCAG 2.x. Todos os hex aproximados do §4.1 da spec conferem.

| Par | Spec | Recalculado |
|---|---|---|
| `foreground` sobre `ivory` | 15,4:1 | 15,37:1 |
| `navy` sobre `ivory` | 13,9:1 | 13,91:1 |
| `gold-light` sobre `navy` | 8,8:1 | 8,79:1 |
| `sand` sobre `navy` | 7,9:1 | 7,88:1 |
| `gold` sobre `navy` | 6,1:1 | 6,14:1 |
| `accent-foreground` sobre `gold` | 6,9:1 | 6,90:1 |
| `muted-foreground` sobre `ivory` | 4,43:1 | **4,46:1**, abaixo de 4,5 nos dois cálculos; a regra da spec se mantém |
| `muted-foreground` sobre `card` | 4,88:1 | 4,89:1 |
| `gold-dark` sobre `ivory` | 3,6:1 | 3,62:1 |
| `gold` sobre `ivory` | 2,3:1 | 2,26:1 |
| `ink-secondary` proposto (`220 10% 42%`) sobre `ivory` | 5,1:1 | 5,12:1 (5,62:1 sobre `card`) |

A diferença entre 4,43 e 4,46 vem do arredondamento (com ou sem passagem por 8 bits). Não muda nenhuma conclusão.

**Observação fora do escopo do site (nada foi alterado):** o `public/_headers` do CRM ainda usa `immutable` em `/assets/*` e `/fonts/*`, com o mesmo fallback de SPA que causou o incidente de 21/08 no portal.

## 2. Domínio

### 2.1 O que rodei

Em 10/10 o ambiente bloqueava o domínio, e esta seção ficou sem verificação. Em 11/10 o domínio foi liberado. Às 13:46 UTC rodei os mesmos comandos que esta seção propunha, com `curl` 8.5.0 no Linux do ambiente, sem seguir redirecionamentos.

### 2.2 Resultado (verificado)

| Endereço | Primeiro salto | Quem responde | Observação |
|---|---|---|---|
| `https://salesdouradoadvogados.com.br/` | `301` para `https://lp.salesdouradoadvogados.com.br/` | Cloudflare (`server: cloudflare`, `cf-ray`) | Preserva o caminho: `/qualquer-coisa` vai para `lp.` com o mesmo caminho. |
| `https://www.salesdouradoadvogados.com.br/` | `301` para `https://lp.salesdouradoadvogados.com.br/` | LiteSpeed, sem `cf-ray` | Preserva o caminho. Não passa pela Cloudflare. Sem `x-redirect-by`. |
| `https://lp.salesdouradoadvogados.com.br/` | `200` | LiteSpeed (`x-litespeed-cache: hit`), sem `cf-ray` | WordPress 7.1.3, Elementor 3.29 e Site Kit 1.153. |

O destino final da raiz e do `www` é `lp.`, em `200`, com um redirecionamento só.

- **robots.txt:** os da raiz e do `www` redirecionam para o de `lp.`, que é o padrão do WordPress. Ele bloqueia só `/wp-admin/` e aponta o sitemap `wp-sitemap.xml`. Não há bloco "Cloudflare Managed" nem `Disallow` para robôs de IA.
- **Indexação da LP:** o meta robots é `max-image-preview:large`, sem `noindex` e sem `x-robots-tag`. O `canonical` aponta para ela mesma. O sitemap lista uma URL só, a home. Não há meta description, e todo o texto abaixo do `h1` está marcado como `h2`.
- **Robôs de IA (indicativo):** em `lp.`, `OAI-SearchBot`, `GPTBot`, `ClaudeBot` e `PerplexityBot` receberam `200`. Na raiz, os quatro receberam o mesmo `301` do navegador. Uma tentativa do `GPTBot` na raiz voltou `403` e não se repetiu em três novas tentativas; não registro como bloqueio. O user-agent sozinho não prova que o robô verdadeiro passa, porque a Cloudflare também identifica por IP e assinatura.
- **Consequência:** hoje a única página que buscadores e IAs leem como sendo o escritório é a LP de uma página, como diz o §9.3. Os controles de bots da Cloudflare só alcançam a raiz, porque `www` e `lp.` estão fora dela.

### 2.3 O que segue sem verificação

- **Registros DNS:** tipo, destino e nuvem de cada nome. O ambiente não resolve DNS, e os resolvedores públicos por HTTPS seguem bloqueados. Fica para o painel (§7.1, C1).
- **Quem emite o 301 da raiz:** com a Cloudflare na frente, o cabeçalho `server` diz `cloudflare` tanto para uma regra dela quanto para um redirecionamento da origem. Fica para o painel (§7.1, C2).
- **`http://` (porta 80):** sem proxy, o ambiente não resolve o nome. Forçando pelo túnel do proxy, as respostas vieram com `server: envoy`, sinal de um intermediário no caminho. Não uso essas respostas como evidência.

### 2.4 O que o código mostra

- O CRM serve `atendimento.` e `bio.` com um único `index.html`, que traz `<meta name="robots" content="noindex" />` (`sd-advogados-ia/frontend/index.html:7`). Vale para todas as rotas, inclusive `/formulario` e `/quem-somos`. Confere com o §9.3 da spec.
- O mesmo deploy do CRM também responde em `calcpensao.` (calculadora), e o portal em `portal.` (é o endereço da `og:image` dele). A spec não cita esses dois subdomínios.

## 3. Formulário do CRM

**Commit lido:** `e61c273` (merge da PR #329, 10/10/2026). Arquivos: `frontend/src/App.tsx`, `frontend/src/pages/formulario/DynamicForm.tsx`, `frontend/src/lib/queries/formDef.ts`, `frontend/src/lib/pixel.ts`, `frontend/index.html`, `frontend/src/components/ui/SourceBadge.tsx`, `frontend/src/lib/labels.ts`, `supabase/functions/form-submit/index.ts`, `supabase/README.md`, `docs/schema-para-ia.md` e o registro de decisões do `CLAUDE.md` (por busca dirigida; o arquivo tem 524 KB).

### 3.1 Como a origem chega hoje ao formulário: não chega

- **Rotas públicas** (`App.tsx`, função `pickPage()`, por `window.location.pathname`): `/` e `/formulario` abrem o formulário `qualificacao`; `/f/{slug}` abre outro formulário publicado. No host `bio.`, qualquer caminho abre a bio.
- **Nenhum parâmetro de URL é aceito.** Nem `DynamicForm.tsx`, nem `formDef.ts`, nem os scripts em linha do `index.html` leem `location.search`, `URLSearchParams`, `document.referrer` ou `utm_*`. O formulário só conhece o slug.
- **O envio não carrega origem.** `DynamicForm` chama `submitDynamicForm(version_id, answers)`, que vai à Edge Function `form-submit`, que chama a RPC `submit_form(p_payload, p_ip, p_user_agent, p_policy_version, p_consent_text, p_form_version_id, p_qualified)` (`form-submit/index.ts`, linhas 160–173). O `p_payload` é montado campo a campo, sem origem. As respostas completas seguem em `answers`, que vai para o `raw_data` da submissão.
- **Meta Pixel no formulário.** `pixel.ts` carrega o Pixel quando a variável `VITE_META_PIXEL_ID` está definida no build. `DynamicForm` registra `PageView`, `ViewContent`, `Lead`, `CompleteRegistration` e os eventos próprios da definição. Não verifiquei se a variável está definida em produção.

### 3.2 Como o selo de origem é decidido

- Coluna `leads.source`, do tipo enum `public.lead_source`, com cinco valores: `instagram_form`, `pension_calculator`, `direct_contact`, `referral`, `advertisement`. Default: `direct_contact`. Fontes: `docs/schema-para-ia.md` (introspecção de 23/07/2026, feita depois de 40 migrations) e os rótulos do frontend em `e61c273`, que conhecem os mesmos cinco valores.
- A regra é **pelo canal de entrada**, registrada no `CLAUDE.md` do CRM em 12/07/2026: formulário → `instagram_form`; lead que começa pelo WhatsApp → `direct_contact`; calculadora → `pension_calculator`; indicação e anúncio são marcados à mão (RPC `update_lead_source`, sem nota). Um trigger BEFORE INSERT anota a origem nas notas só nas detecções automáticas. Na calculadora, a deduplicação por telefone não sobrescreve a origem de quem já veio por outro canal.
- O selo (`SourceBadge.tsx`) traduz o valor em rótulo (`SOURCE_LABEL`, em `labels.ts`), cor (`--source-*`, claro e escuro) e ícone. Valor desconhecido aparece como círculo genérico, com o nome cru.
- **Consequência:** hoje, toda lead que chega pelo formulário, venha de onde vier (Instagram, site, IA), recebe o selo "Instagram (formulário)".
- **Limite:** não li o corpo da `submit_form` nem o do trigger, porque estão em migrations. A atribuição de `instagram_form` vem do registro de decisões (que diz "validado: 7 cenários em Postgres real") e do schema documentado.

### 3.3 Uma origem "IA" exige mudança de banco? Sim

O selo lê um enum, e valor novo em enum é DDL. O valor sozinho não basta: a RPC precisa saber quando usá-lo. O que muda, sem escrever a migration:

1. **Valor novo no enum `public.lead_source`** (nome a decidir; por exemplo, `ai_assistant`), em migration própria e isolada. O valor acrescentado com `ALTER TYPE … ADD VALUE` não pode ser usado na mesma transação em que nasce; o CRM registrou essa lição na migration 0038, com o enum `kanban_panel`.
2. **A `submit_form` passa a receber a origem** (parâmetro novo ou campo do payload, de uma lista fechada validada no servidor) e a usá-la no INSERT da lead. É `CREATE OR REPLACE FUNCTION`, em migration nova. Sem isso, o item 1 não muda nada: o formulário continua gravando `instagram_form`.
3. **Trigger de nota de origem:** conferir se ele trata o valor novo como detecção automática. Não verifiquei a regra atual (está em migration).
4. **Fora do banco**, no mesmo PR do CRM: o formulário passa a ler `?origem=` da URL (hoje não lê nada); a Edge Function `form-submit` valida e repassa; `labels.ts` (`SOURCE_LABEL`, `SOURCE_ORDER`); `SourceBadge.tsx` (ícone e token `--source-*`, claro e escuro); o seletor de origem do dashboard.

Pontos para a Sessão 4 decidir (não são verificação):

- **Lead do site sem sinal de IA** continuaria como `instagram_form`. Vale decidir junto se entra também uma origem "Site".
- **O detalhe** (`ia:chatgpt`, `busca:google`, `pagina=…`) não cabe no enum sem multiplicar valores. Pode ir para o `raw_data` da submissão (JSON, sem DDL), mas a Edge Function monta o payload campo a campo e precisa ser alterada para levá-lo.
- **Privacidade:** se o link levar `pagina=/situacoes/…` até o formulário com o Meta Pixel ativo, o endereço com o tema da situação acompanha os eventos enviados à Meta (pelo funcionamento padrão do Pixel, o endereço completo da página vai em cada evento). Para as leitoras do P13, considerar passar só a origem, sem a página.
- **Deduplicação:** há uma migration cujo nome indica mescla de formulário sem sobrescrever (`20260908000189_form_merge_sem_sobrescrever.sql`). Vi só o nome; não sei como ela trata a origem.
- **A pergunta "Como você chegou até nós?"** (§8.3, item 4 da spec) pode ser criada no editor de formulários do painel, sem código e sem DDL. A resposta fica no `raw_data` e não alimenta o selo sem mudança na RPC.
- **Convenção da casa:** desde as migrations 0059 e 0086, o CRM usa `text` + `check` em listas que crescem, justamente para não depender de `ALTER TYPE`. O `lead_source` é anterior a isso. Converter está fora do escopo; acrescentar um valor é a menor mudança.

**Como conferi que o enum não mudou depois da 0019:** listei os nomes dos arquivos de `supabase/migrations/` que contêm "source", "origem", "canal", "submit" ou "form" (de 235 migrations). Os nomes posteriores à 0019 tratam de dashboard por origem (0031, 0091) e do motor de formulários; nenhum sugere alteração do enum. Não abri nenhum desses arquivos.

## 4. "Quem Somos"

- **Onde está o texto aprovado:** dentro do componente `sd-advogados-ia/frontend/src/pages/quem-somos/QuemSomos.tsx` (321 linhas; estilo em `quem-somos.css`), no commit `e61c273`. É a única cópia no repositório; não existe versão em Markdown ou em documento.
- **Aprovação:** registro de decisões do `CLAUDE.md` do CRM, 18/07/2026: "conteúdo final aprovado pelo escritório em 8 seções" (causa, história, como trabalhamos, missão e visão, 5 valores, FAQ com 9 perguntas, chamada final para o formulário).
- **Sem alteração desde a aprovação:** o único commit que tocou o arquivo é `1adcab3` (PR #73, 18/07/2026). Conferi o histórico da `main` até 26/04/2026.
- **Rota que serve hoje:** `/quem-somos` no domínio `atendimento.salesdouradoadvogados.com.br` (`App.tsx`, `pickPage()`). O card "Quem Somos" da bio aponta para lá (`Bio.tsx:21`). O comentário em `Bio.tsx:79` ainda diz "página a criar — link placeholder", mas a página existe.
- **Nenhum buscador enxerga esse texto:** é SPA sem pré-renderização (`vite.config.ts` só tem o plugin do React), o texto é montado por JavaScript, e o `index.html` do CRM tem `noindex` em todas as rotas. Verificado no código, não ao vivo (§2).
- **Foto:** a página usa `leilson-bio.webp`, a mesma da bio, "até a foto dedicada ser fornecida" (registro de 18/07).
- **Visual:** identidade do CRM (navy fixo, Cormorant Garamond e Raleway). No site, o texto seria recomposto no sistema do portal.

Para a decisão nº 5: levar o texto para `/escritorio/` é copiar o conteúdo do JSX para MDX e passar pela revisão. Depois do go-live falta decidir o destino de `/quem-somos` no CRM (por exemplo, 301 para `/escritorio/`) e o link do card da bio.

## 5. Stack

Versões consultadas no registro do npm em 10/10/2026 (fonte primária, acessível deste ambiente).

| Pacote | Versão estável | O que importa |
|---|---|---|
| `astro` | **7.3.8** (7.0.0 saiu em 22/06/2026; 6.0.0, em 10/03/2026) | Exige Node ≥ 22.12.0. Usa Vite ^8.3.1. |
| `pagefind` | **1.5.2** | A 1.5.0 trocou a interface padrão (`pagefind-ui.js`) pela "Component UI" (fonte secundária: documentação do Pagefind, via busca). O índice vai para `pagefind/`. |
| `tailwindcss`, linha 3 | **3.4.19** (marcador `v3-lts`; a mais recente é a 4.3.3) | O portal usa 3.4.17. |
| `@tailwindcss/typography` | 0.5.20 | Aceita `tailwindcss >= 3.0.0`. Compatível. |
| `@astrojs/tailwind` | 6.0.2 (última publicação em 18/09/2025) | **Descontinuada** (README no npm). Declara `astro ^3 \|\| ^4 \|\| ^5`: **não aceita Astro 6 nem 7.** |
| `@astrojs/mdx` | 8.0.3 | Exige `astro ^7.2.10` e Node ≥ 22.12.0. |
| `@astrojs/sitemap` | 3.7.4 | — |
| `lucide-static` / `@lucide/astro` | 1.55.0 | `@lucide/astro` aceita Astro 4 a 7. |
| `@fontsource-variable/inter` / `@fontsource-variable/playfair-display` | 5.3.0 | Opção para woff2 próprios (licença OFL). Não confirmei se o pacote da Playfair traz o itálico. |

**Como o Astro atual integra o Tailwind 3.4**

- A integração oficial (`@astrojs/tailwind`) está descontinuada e só declara suporte até o Astro 5. Com Astro 7, só instala forçando a resolução de dependências. Não recomendo.
- O caminho oficial hoje é o Tailwind 4, pelo plugin `@tailwindcss/vite` (README da integração; documentação do Astro, via busca).
- Para manter o Tailwind 3.4, sobra o **PostCSS direto**: `postcss.config.mjs` com `tailwindcss` e `autoprefixer`, como o portal já faz, apoiado no suporte nativo do Vite a PostCSS. Fontes secundárias dizem que o Vite aplica a configuração de PostCSS sozinho e que o transformador padrão continua sendo o PostCSS, mas **não confirmei isso para o Vite 8**. Primeira tarefa da Sessão 1: um build mínimo com uma classe de token, antes de qualquer molde.

**Incompatibilidades com o §9.1 da spec**

1. "Tailwind 3.4, tokens sem tradução": entra, mas pela via PostCSS, não por integração oficial, e falta validar. Se falhar, a alternativa é Tailwind 4 com `@config` apontando para o config em JS, o que quebra "mesma versão maior do portal" e precisa de aprovação.
2. Node: o Astro 7 exige ≥ 22.12. Projetos novos do Cloudflare Pages usam a imagem de build v3, com Node 22.16.0 (fonte secundária: documentação e changelog da Cloudflare, via busca). Compatível. Mesmo assim, fixar a versão com `.nvmrc` ou `NODE_VERSION`.
3. O Astro 7 mudou o compilador (não corrige mais HTML malformado; o espaço em branco entre elementos em linha passou a seguir a convenção do JSX) e o pipeline de Markdown (plugins remark e rehype precisam de pacote de compatibilidade; o `@astrojs/mdx` 8 declara `@astrojs/markdown-satteri`). Fonte secundária: blog do Astro 7 e guia de atualização, via busca. Num site de muito texto, conferir na prévia o espaço entre links e ênfases.
4. Cache (§9.2): a regra do portal mira `/assets/*`, padrão do Vite; o Astro gera os arquivos com hash em `/_astro/` (fonte secundária; confirmo no primeiro build olhando o `dist/`). Os arquivos do Pagefind sem hash no nome (`/pagefind/`) ficam no catch-all, com revalidação, pelo mesmo motivo do `/ocr/*` do portal.
5. Pagefind 1.5: escolher entre a Component UI nova e a API direta na Sessão 3. O orçamento de JavaScript do §9.1 já exclui a busca.
6. O Cloudflare Pages segue suportado. A Cloudflare concentra investimento em Workers com arquivos estáticos e promete caminho de migração (matriz de compatibilidade oficial, via busca). Nada muda na v1.

**Fontes desta seção**

- Registro do npm (`npm view`), 10/10/2026: versões, `engines`, `peerDependencies` e o README da `@astrojs/tailwind`.
- [Astro 7.0, blog oficial](https://astro.build/blog/astro-7/) e [guia de atualização para o v7](https://docs.astro.build/en/guides/upgrade-to/v7/), via busca.
- [Cloudflare Pages, imagem de build](https://developers.cloudflare.com/pages/configuration/build-image/) e [changelog da imagem v3](https://developers.cloudflare.com/changelog/2025-05-30-pages-build-image-v3), via busca.
- [Workers e Pages, matriz de compatibilidade](https://developers.cloudflare.com/workers/static-assets/compatibility-matrix), via busca.
- [Pagefind, documentação](https://pagefind.app/docs/) e [opções de configuração](https://pagefind.app/docs/config-options/), via busca.
- Transformador CSS padrão do Vite: [referência secundária](https://tessl.io/registry/tessl/npm-vite/files/docs/features/css-processing.md).
- Pasta `_astro`: [fonte secundária](https://nevercodealone.de/frontend-development/astro-static-site-build-dist-folder-output-structure).

## 6. Divergências entre a spec e o terreno

| # | Spec | Terreno | Sugestão |
|---|---|---|---|
| D1 | A spec está em `docs/spec-site-sd-advogados-v1.md` (pedido da sessão). | Este repositório estava vazio, sem nenhum commit. A spec só existe no anexo da conversa. | Versionar a spec num commit separado, com aprovação, para que as referências deste relatório tenham base no repositório. |
| D2 | §4.3: títulos e frases da leitora em Playfair itálico, "como no portal". | O portal carrega a Playfair só em 400–700, romano. Não existe itálico no sistema hoje. | Trazer o eixo itálico como adição deliberada, registrada ao lado do `--ink-secondary`. |
| D3 | §4.3: fontes em arquivos próprios, sem Google Fonts. | O portal usa `@import` do Google Fonts e não tem arquivos de fonte. (O CRM já hospeda as dele.) | Obter woff2 de distribuição OFL (por exemplo, Fontsource), com subconjunto latino, na Sessão 1. |
| D4 | §3.1 e §7: marca no header e no cartão de compartilhamento. | Não há logo em vetor em nenhum repositório. Só PNG; os vetores são favicons de uma letra. | Pedir o arquivo original a quem fez a identidade. Sem ele, vetorizar o PNG, com aprovação do resultado. |
| D5 | §3.1: header na "receita do ClientHeader". | O design system do portal (§5) proíbe copiar o header. No site, sem React, a cópia é inevitável. | Reescrever com as mesmas classes, anotar o commit de origem e testar tela estreita, que foi a falha que gerou a regra. |
| D6 | §0 e P5: "site, contratação e portal com a mesma cara". | Entre o site e o portal, a leitora passa pelo formulário do CRM, que usa outra identidade de propósito (Cormorant e Raleway, outros hex; §12 do design system). | Aceitar na v1 e registrar. Unificar é decisão de marca, fora do site. Pesa na decisão nº 6. |
| D7 | §8.3, item 2: os links levam `?origem=…&pagina=…` ao formulário. | O formulário não lê nenhum parâmetro. A origem é decidida pelo canal, e toda lead do formulário vira `instagram_form`. | Até a Sessão 4, lead vinda do site aparece como "Instagram (formulário)". Decidir se o site entra no ar antes da Sessão 4. |
| D8 | §8.3, item 3: selo "IA", com diagnóstico antes de DDL. | Confirmado: exige DDL (valor no enum e alteração da `submit_form`), além da Edge Function e do frontend do CRM. Leads do site sem sinal de IA também ficariam sem rótulo próprio. | Na Sessão 4, decidir também uma origem "Site". |
| D9 | §8.2: sem pixel; o contato acontece no formulário do CRM. | O formulário carrega o Meta Pixel quando `VITE_META_PIXEL_ID` está definida (produção não verificada). Com `pagina=` no link, o tema da situação iria junto para a Meta, se o Pixel estiver ativo. | Passar só a origem, sem a página. Dizer na `/privacidade/` e na `/navegacao-segura/` que o formulário é outro serviço. |
| D10 | §9.1: Tailwind 3.4, tokens "sem tradução". | A integração oficial do Tailwind 3 não aceita Astro 6 nem 7. | PostCSS direto, validado no primeiro build da Sessão 1. |
| D11 | §9.1: Astro estável na data da Sessão 1. | Hoje é a 7.3.8: Node ≥ 22.12, Vite 8, compilador novo. | Registrar a versão na Sessão 1 e fixar o Node 22 no Pages. |
| D12 | §9.2: copiar a regra do `_headers` do portal. | A regra mira `/assets/*`; o Astro gera `/_astro/*` (a confirmar). | Ajustar o caminho; manter `/pagefind/*` no catch-all. |
| D13 | §4.2: `muted-foreground` sobre `ivory` = 4,43:1. | Recalculado: 4,46:1, abaixo de 4,5 nos dois casos. O `ClientFooter` do portal usa esse par. | A regra não muda. Não copiar o rodapé do portal como está. |
| D14 | §3.3: "ficha com contexto" do §8 do design system. | É receita de modal do admin (lateral parada dentro do modal; componente React no celular). | Adaptar para página: `aside` com `position: sticky`; no celular, bloco compacto no topo. |
| D15 | §9.3: estado do domínio em 10/10/2026. | Verificado em 11/10 (§2.2): a raiz e o `www` redirecionam com 301 para `lp.`, que segue no ar e indexável. O `www` e o `lp.` não passam pela Cloudflare. Pelo código, `atendimento.` e `bio.` têm `noindex`. Existem também `calcpensao.` e `portal.`, que a spec não cita. | Conferir os registros DNS e as regras no painel (§7.1, C1 e C2). No go-live, o `www` precisa entrar na Cloudflare ou apontar para o novo host; do contrário, o redirecionamento dele continua dependendo da hospedagem da LP. |
| D16 | Decisão nº 12: fotos fornecidas pelo Leilson; sem elas, só tipografia. | Já existe uma foto real dele no CRM (`leilson-bio.webp`, ~19 KB). | Perguntar se pode ser usada; a resolução talvez não sirva para a página do advogado. |

## 7. Perguntas para o Leilson

Tudo o que depende de painel. O nome exato dos menus pode variar com o idioma e com mudanças de interface; quando o caminho não bater, procure pelo termo entre aspas.

### 7.1 Cloudflare

| # | Onde olhar | O que anotar |
|---|---|---|
| C1 | dash.cloudflare.com → a conta → zona `salesdouradoadvogados.com.br` → **DNS → Registros** | Para `@` (raiz), `www`, `lp`, `atendimento`, `bio`, `calcpensao` e `portal`: o tipo (A, AAAA, CNAME), o destino e se a nuvem está laranja (passa pela Cloudflare) ou cinza (só DNS). Se existem registros TXT começando com `google-site-verification=` ou `MS=` (sinais de verificação do Search Console e do Bing); basta dizer se existem. |
| C2 | Na mesma zona → **Regras** (procure "Redirect Rules", "Page Rules" e "Bulk Redirects") | Qualquer regra que pegue a raiz ou o `www`: o que ela casa, o destino, o código (301 ou 302) e se preserva o caminho. Se não houver regra, anote isso: aí o redirecionamento sai do servidor da LP. |
| C3 | O registro DNS de `lp` (do C1) | Para onde aponta (a hospedagem do WordPress). Serve para a decisão nº 4. |
| C4 | **Segurança → Bots** (procure "Bloquear bots de IA" ou "Block AI bots", e "Bot Fight Mode") e o item **"AI Crawl Control"** do menu lateral | O plano da zona (Free, Pro...). O estado de cada bloqueio e o escopo, se houver (todas as páginas, só páginas com anúncio, desligado). No AI Crawl Control, como aparecem `OAI-SearchBot`, `ChatGPT-User`, `Claude-SearchBot`, `Claude-User`, `PerplexityBot`, `GPTBot`, `ClaudeBot`, `Google-Extended`, `CCBot`, `Googlebot` e `Bingbot`: permitido ou bloqueado. Segundo o changelog de bots da Cloudflare (via busca, não aberto), domínios novos a partir de 15/09/2026 recebem bloqueio padrão de Treino e Agente em páginas com anúncio; vale ver se aparece algo assim na zona. Hoje esses controles só alcançam a raiz, porque o `www` e o `lp.` não passam pela Cloudflare (§2.2). |
| C5 | Procure **"robots.txt gerenciado"** ("managed robots.txt", "Instruct AI bot traffic with robots.txt") em Bots ou no AI Crawl Control | Ligado ou desligado. A spec quer desligado (§9.4). Em 11/10, o `robots.txt` da raiz redirecionou para o da LP, sem bloco "Cloudflare Managed" (§2.2). Isso não prova que a opção está desligada, porque o redirecionamento acontece antes. |
| C6 | **Workers e Pages** (ou "Compute") → lista de projetos | O nome de cada projeto, os domínios personalizados de cada um, o branch de produção e, em Configurações → Build, a versão da imagem de build e do Node. Se já existe projeto com nome parecido com `sd-advogados-site`. |
| C7 | **Analytics e Logs → Web Analytics** | Se há algum site configurado (decisão nº 7). |

### 7.2 Google Search Console

| # | Onde olhar | O que anotar |
|---|---|---|
| G1 | search.google.com/search-console, entrando com cada conta Google que já cuidou do site ou da LP → seletor de propriedade (canto superior esquerdo) | Cada propriedade com "salesdouradoadvogados" e o tipo: **Domínio** (`salesdouradoadvogados.com.br`) ou **Prefixo do URL** (por exemplo, `https://lp.salesdouradoadvogados.com.br/`). Se não existe nenhuma, anote "nenhuma". |
| G2 | Em cada propriedade → **Configurações → Verificação de propriedade** | O método (registro DNS, arquivo HTML, meta tag, Google Analytics, Tag Manager). Verificação por arquivo ou meta tag na LP cai quando a LP sair do ar; por DNS, não cai. |
| G3 | **Configurações → Usuários e permissões** | Se as contas do escritório são proprietárias. Não precisa anotar e-mails. |
| G4 | **Indexação → Páginas** | Quantas páginas estão indexadas e de qual host (raiz ou `lp.`). |
| G5 | **Indexação → Sitemaps** | Quais sitemaps estão enviados (o WordPress costuma usar `/sitemap_index.xml` ou `/wp-sitemap.xml`). |

### 7.3 Bing Webmaster Tools

| # | Onde olhar | O que anotar |
|---|---|---|
| B1 | bing.com/webmasters, entrando com conta Microsoft, Google ou Facebook → lista de sites | Se aparece `salesdouradoadvogados.com.br` ou `lp.`. Se não aparece nenhum, anote "nenhum"; na Sessão 5 dá para importar do Search Console. |
| B2 | No site → **Configurações → Usuários** (ou a verificação de propriedade) | Como foi verificado: arquivo XML, meta tag, CNAME ou importação do Google. |
| B3 | **Sitemaps** | O que está enviado. |
| B4 | **IndexNow** | Se há chave ou envios registrados. |

### 7.4 Decisões que travam a Sessão 1

**Nº 1, nome canônico.** Proposta da spec: "Sales Dourado Advogados", com "SD Advogados" como nome alternativo. No terreno as duas formas convivem: "Sales Dourado Advogados" no título, no rodapé e no `alt` da logo do portal, e nas páginas públicas do CRM; "SD Advogados" no título do README da identidade visual; "Portal SD" e "CRM Atendimento" nas abas. Responder: confirma a proposta ou ajusta.

**Nº 6, tipografia.** Há duas opções reais:

- **A. Playfair Display + Inter**, as do portal (proposta da spec). Dão continuidade com o portal, que a cliente usa depois de contratar. Exigem acrescentar a Playfair itálica, que o portal não tem.
- **B. Cormorant Garamond + Raleway**, as do README da identidade visual ("referência canônica para toda a plataforma"). Dão continuidade com a logo e com o formulário, que a leitora abre logo depois do site.

A spec (P5 e L3) aponta para A. Responder: A ou B.

### 7.5 Outras perguntas que surgiram

1. **Domínio:** resolvido em 11/10, com o domínio liberado (§2.2). Faltam só os itens de painel C1 e C2.
2. **Logo em vetor:** quem fez a identidade visual tem o arquivo original (AI, SVG, PDF ou EPS) do monograma e da assinatura?
3. **Foto:** a `leilson-bio.webp` do CRM pode ser usada no site, ou virá uma foto dedicada (decisão nº 12)?
4. **Spec no repositório:** a spec pode ser versionada em `docs/` num commit separado (D1)?
