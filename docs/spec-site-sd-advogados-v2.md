# Spec — Site público do escritório — v2

> **Projeto:** SD Advogados · site público, em repositório novo (proposta: `sd-advogados-site`)
> **Status:** aprovada por Leilson em 11/10/2026 (§1.4). Sessão 1 em andamento.
> **Data:** 11/10/2026. A v1, de 10/10/2026, fica preservada em `docs/spec-site-sd-advogados-v1.md`.
> **Autor da especificação:** Claude, a partir do pedido de Leilson (10/10/2026). O que Leilson decidiu e o que é proposta minha estão separados no §1. A v2 incorpora as respostas dele ao relatório da Sessão 0 (`docs/sessao0-relatorio.md`), a análise do site de referência e a prévia aprovada em 11/10 (`docs/previa-v2/`). Toda mudança em relação à v1 está marcada com **(v2)**.
> **Depende de:** design system do portal (`sd-advogados-portal-cliente/docs/design-system.md` e `src/index.css`, lidos no commit `f05cb6e`), zona `salesdouradoadvogados.com.br` na Cloudflare, formulário público do CRM (`atendimento.salesdouradoadvogados.com.br/formulario`).

---

## 0. Resumo

Uma lead chegou ao escritório por indicação do ChatGPT. Este site existe para que isso deixe de ser acaso.

Ele tem duas leitoras: a mãe que chega com uma pergunta, quase sempre no celular, e a IA que está buscando na web uma resposta para essa mesma mãe. As duas querem a mesma coisa: uma resposta direta, assinada por quem responde por ela, com a base legal à vista e a data em que foi revisada.

Por isso o centro do site é uma **base de respostas navegável por situação**. **(v2)** Em volta dela, o site tem também a casca de um escritório estabelecido: quem somos, o advogado, as áreas em que atua e como funciona o atendimento (L6). São três camadas, cada uma para uma busca diferente:

| Camada | Busca que atende | Páginas |
|---|---|---|
| Institucional | "Quem é esse escritório?" | Início, O escritório, o advogado, a ficha, o atendimento |
| Áreas | "Preciso de advogado para pensão." | Uma página por área, ligada às situações e às respostas do tema |
| Base de respostas | "Ele pode ser preso se não pagar a pensão?" | Situações, respostas, glossário, Além do post |

A base de respostas funciona assim:

- a leitora entra pela **situação** que está vivendo, dita com as palavras dela ("Ele parou de pagar a pensão");
- a situação abre um **caminho**: as etapas, na ordem em que acontecem;
- cada etapa leva às **respostas**: uma pergunta por página, respondida nas duas primeiras frases.

O visual é o do portal da cliente (navy, dourado, marfim, Playfair Display e Inter). Quem lê o site e depois contrata entra no portal e reconhece a mesma casa. **(v2)** Nas páginas institucionais, a fotografia real do advogado e do escritório é a protagonista; as divergências em relação ao portal aprovadas na prévia estão no §4.8.

**Fora do escopo da v1:** CMS, área logada, chat ou IA dentro do site, agendamento online, blog cronológico, depoimentos, modo escuro, pixel de anúncios nas páginas de conteúdo, páginas por cidade em série, qualquer tabela nova no Supabase. **(v2)** Também fora, por ora: página de equipe (L9).

---

## 1. O que está decidido e o que é proposta

### 1.1 Decisões de Leilson (10/10/2026)

| # | Decisão |
|---|---|
| L1 | O site é um canal de aquisição voltado a ser encontrado e citado por IAs (ChatGPT, Claude e semelhantes). |
| L2 | Conteúdo por tema (divórcio, guarda, pensão etc.) e um espaço para o que é publicado nas redes sociais. |
| L3 | As cores são as do **portal**. |
| L4 | A LP antiga (WordPress, em `lp.salesdouradoadvogados.com.br`) não é usada e está descartada como referência. Nada dela é reaproveitado. |
| L5 | Padrão alto, com estrutura fora do padrão de site de escritório. |

### 1.2 Propostas desta spec (aprovar, ajustar ou recusar antes da Sessão 1)

| # | Proposta | Motivo |
|---|---|---|
| P1 | **Entrada por situação, não por área do direito.** O menu principal é uma lista de frases na voz da leitora. | Ninguém pergunta a uma IA por "direito de família"; descreve o que está acontecendo. A estrutura do site passa a ter a forma da pergunta. |
| P2 | **A unidade do site é a Resposta:** uma pergunta por página, com resposta direta de 40 a 70 palavras no topo e, logo abaixo, "depende de quê". | É o trecho que a IA extrai e cita. E o "depende" é o que uma resposta genérica não tem: mostra onde o caso dela pode ser diferente, que é o motivo real para procurar o escritório. |
| P3 | **Sem blog cronológico.** O conteúdo é perene, com data de revisão e histórico de alterações público. | Artigo datado envelhece e some. Resposta revisada continua valendo, e a data de revisão é sinal de atualidade para quem lê e para quem indexa. |
| P4 | **"Além do post":** cada post das redes vira uma explicação, não uma transcrição. | Carrossel é frase curta e de estilo. A IA procura resposta. O post entra como gancho; o texto é o fundamento por trás dele. |
| P5 | **Design: o sistema do portal, portado.** Mesmos tokens, mesma tipografia, mesmos princípios (§4). Nenhuma cor nova. | L3. E continuidade: site, contratação e portal com a mesma cara. |
| P6 | **HTML estático. Ler não exige JavaScript.** | Os crawlers das IAs em geral não executam JS. O que não está no HTML não existe para eles. De quebra, o site abre rápido em celular modesto. |
| P7 | **Repositório e projeto Cloudflare Pages próprios, sem Supabase na v1.** | Zero risco para CRM e portal em produção. Sem banco não há DDL, e as regras de migration nem entram em jogo. |
| P8 | **Conteúdo em arquivos no git. Publicar é abrir PR, ver a prévia e aprovar.** | É o fluxo que o escritório já usa. Cada texto publicado tem autor da revisão, data e diff. |
| P9 | **Verificador determinístico no build** (§6): texto sem base legal, sem revisão ou com dado pessoal não publica. | Princípio do projeto: checagem determinística antes de qualquer julgamento. |
| P10 | **O mesmo conteúdo para gente e para máquina.** Nada escondido, nenhum texto dirigido a modelos, nenhuma versão diferente para robôs. | A proibição de injeção de prompt do projeto vale aqui também. E é o que não quebra quando os critérios das IAs mudarem. |
| P11 | **Uma fonte única dos fatos do escritório** (`site.config.ts`): nome, CNPJ, OAB, endereço, telefone, horários. Todas as páginas e todos os dados estruturados leem dali. | A IA cruza fontes antes de citar um nome. Divergência entre páginas enfraquece a identificação. |
| P12 | **Nenhum dado de cliente, lead ou processo no repositório.** Pergunta real de lead entra na pauta generalizada, nunca copiada. | Requisito. Acervo de família, quase todo em segredo de justiça. |
| P13 | **Botão de saída rápida em todas as páginas** (§8.1). | Parte das leitoras está em situação de risco e pode estar sendo observada. |
| P14 | **O site mora no domínio raiz** (`salesdouradoadvogados.com.br`). | É onde a autoridade do nome se concentra. Hoje a raiz redireciona para a LP descartada (§9.3). |

### 1.3 O que é fundamento e o que é aposta

Nenhuma IA publica os critérios de quem ela cita. O que se sabe vem da documentação dos crawlers e de análises de terceiros. A spec separa as duas coisas para que ninguém confunda item barato com item decisivo.

| Item | Classe | Por quê |
|---|---|---|
| HTML completo sem JS | Fundamento | Sem isso o conteúdo não é lido. |
| Crawlers de busca das IAs liberados | Fundamento | A OpenAI documenta que site que bloqueia o `OAI-SearchBot` não aparece nas respostas de busca do ChatGPT. |
| Indexação no Bing e no Google | Fundamento | As análises publicadas apontam que a busca do ChatGPT se apoia sobretudo no índice do Bing; a do Gemini, no do Google. |
| Nome, endereço e telefone idênticos em todo lugar | Fundamento | A IA cruza fontes antes de citar um nome. |
| Resposta direta no topo, uma pergunta por página | Fundamento | É o trecho citável. |
| Presença fora do site (Perfil no Google, Bing Places, avaliações) | Fundamento, **fora do código** | Anexo B. O site sozinho não basta. |
| Dados estruturados além da identificação do escritório | Aposta barata | Ajudam Google e Bing a entender a página; não há evidência sólida de que pesem na citação por IA. |
| `llms.txt` e versão `.md` de cada página | Aposta barata | Custam pouco no build. Nenhuma IA grande confirmou que usa. |

### 1.4 Decisões de Leilson (11/10/2026) (v2)

Respostas ao relatório da Sessão 0 e à análise do site de referência, e aprovação da prévia.

| # | Decisão |
|---|---|
| L6 | O site ganha uma camada institucional e uma camada de áreas em volta da base de respostas, como os sites de escritório estabelecidos. A base de respostas continua sendo a parte central. Revê o §0 da v1, que recusava a forma de site de advocacia. |
| L7 | Continuam fora, como na v1: páginas de cidade em série, blog cronológico e depoimentos. |
| L8 | Áreas com página própria: divórcio, guarda, visitas e convivência, pensão alimentícia, autorização para viagem ao exterior e autorização para mudança de estado. |
| L9 | A equipe não aparece por enquanto. O site mostra só o advogado responsável. |
| L10 | Números de credibilidade podem ser publicados, desde que verificáveis e sem promessa. Cada número entra no `site.config.ts` com fonte e data e aparece na ficha (§3.5). |
| L11 | Leilson envia as fotos profissionais dele e do escritório e o arquivo vetorial da logo. Até lá, a foto atual do CRM e a logo em PNG são provisórias. |
| L12 | Decisão nº 1: nome canônico "Sales Dourado Advogados", com "SD Advogados" como alternativo. Decisão nº 6: Playfair Display e Inter, as do portal. |
| L13 | A prévia v2 (canvas de 11/10, fonte em `docs/previa-v2/`) é a referência visual aprovada dos moldes Início, Área, O escritório, Situação e Resposta. |

### 1.5 O que a v2 muda nas propostas (v2)

| Proposta | Mudança |
|---|---|
| P1 | A entrada por situação continua sendo a principal. As áreas são a segunda porta, para quem chega procurando advogado, não com uma pergunta. O menu principal passa a ser: Situações, Áreas, Respostas, O escritório, Atendimento. |
| P5 | O sistema do portal continua sendo a base, com as divergências aprovadas na prévia listadas no §4.8. A única cor nova é o `gold-ink`, além do `ink-secondary` da v1. |
| P11 | Os números de credibilidade (L10) também moram no `site.config.ts`, com fonte e data. |
| §3.1 | O Início deixa de abrir com a pergunta. Abre com o escritório e a foto; a pergunta vem logo abaixo (§3.1 revisto). |

---

## 2. Conceito: Situação → Caminho → Resposta

### 2.1 Os tipos de página

O site é um grafo com poucos tipos de nó. Cada um tem um molde só (§3) e um esquema de dados (§5).

| Tipo | O que é | Exemplo | Voz do título |
|---|---|---|---|
| **Situação** | Uma circunstância de vida e o caminho jurídico dela, em etapas | "Ele parou de pagar a pensão" | Da leitora |
| **Resposta** | Uma pergunta, respondida | "Ele pode ser preso se não pagar a pensão?" | Da leitora |
| **Termo** | Uma palavra do processo, em português claro | "Cumprimento de sentença" | Do escritório |
| **Além do post** | A explicação por trás de um post das redes | (a tese do post, em uma frase) | Do escritório |
| **Área** (v2) | Uma frente de atuação do escritório, com as situações e as respostas do tema | "Pensão alimentícia" | Do escritório |
| **Local** | Como o atendimento funciona em um lugar | "Atendimento em Ji-Paraná" | Do escritório |
| **Institucional** | Quem responde, a ficha do escritório, como os textos são revisados | "Leilson Sales Dourado" | Do escritório |

As ligações são tipadas: **(v2)** Área agrupa Situações e destaca Respostas; Situação tem etapas; etapa aponta Respostas; Resposta cita Termos e dispositivos de lei; Além do post aponta Respostas e Situações. Toda ligação aparece na página como link e nos dados estruturados como relação. Não existe página órfã (o verificador barra).

### 2.2 Mapa do site

| URL | Página |
|---|---|
| `/` | Início **(v2)**: o escritório e a foto, a pergunta "O que está acontecendo?" com as situações, as áreas, como funciona o atendimento, quem responde e Além do post |
| `/situacoes/{slug}/` | Situação (caminho) |
| `/respostas/` | Índice de respostas, agrupado por situação, com busca |
| `/respostas/{slug}/` | Resposta |
| `/areas/` **(v2)** | Índice das seis áreas |
| `/areas/{slug}/` **(v2)** | Área (§3.6). Slugs propostos: `divorcio`, `guarda`, `visitas-e-convivencia`, `pensao-alimenticia`, `viagem-ao-exterior`, `mudanca-de-estado` |
| `/glossario/` e `/glossario/{termo}/` | Glossário |
| `/alem-do-post/` e `/alem-do-post/{slug}/` | Além do post |
| `/atendimento/` **(v2)** | Como funciona o atendimento, do formulário à decisão sobre o próximo passo, sem preço |
| `/atendimento/ji-parana/` | Local (v1: só Ji-Paraná) |
| `/atendimento/online/` | Como funciona o atendimento à distância, em todo o Brasil |
| `/escritorio/` | O escritório: a causa, a história, quem atende |
| `/escritorio/leilson-sales-dourado/` | Página do advogado (OAB, trajetória, o que ele revisa) |
| `/escritorio/ficha/` | Ficha do escritório: os fatos, em lista (§3.5) |
| `/como-revisamos/` | Quem escreve, quem revisa, como se corrige um erro |
| `/alteracoes/` | Histórico público de alterações de conteúdo |
| `/conversar/` | Os canais de contato (formulário e WhatsApp), sem formulário próprio |
| `/navegacao-segura/` | O que o botão de saída faz e o que ele não faz |
| `/privacidade/` | Política de privacidade do site |
| `/robots.txt`, `/sitemap-index.xml`, `/feed.xml`, `/llms.txt`, `{pagina}.md` | Camada para máquinas (§7) |

URLs em português, sem data, sem categoria no caminho. Slug publicado não muda; se precisar mudar, redirecionamento 301 no `_redirects` e registro em `/alteracoes/`.

---

## 3. Moldes de página

Mobile primeiro: a leitora típica vem do Instagram ou de uma IA, no celular. Largura de leitura `max-w-3xl`, como o lado da cliente no portal.

### 3.1 Início (revisto na v2)

O topo apresenta o escritório; a pergunta vem logo abaixo. A foto é real, nunca de banco de imagens. Sem carrossel.

```
┌──────────────────────────────────────────────────┐
│ [marca]  Situações Áreas Respostas O escritório  │  header marfim, filete inferior;
│          Atendimento          Sair  [Conversar]  │  no celular, menu e Sair ficam
├──────────────────────────────────────────────────┤
│  Advocacia de família · Ji-Paraná e todo o Brasil│  micro-rótulo (§4.8)
│  Você não precisa                  ┌───────────┐ │  título Playfair grande;
│  atravessar isso sozinha.          │ foto real │ │  foto do advogado sobre
│  2 frases sobre o escritório       │ sobre a   │ │  uma placa areia
│  [Falar com o escritório]  Entrar  │ placa     │ │  o único CTA dourado do conteúdo
│  pela sua situação →               └───────────┘ │
│  OAB · advogado desde · respostas revisadas      │  selos factuais
├──────────────────────────────────────────────────┤
│  O que está acontecendo?             fundo branco│  busca e as situações em duas
│  [busque com suas palavras]                      │  colunas, numeradas, em
│  01 Ele parou de pagar a pensão       →          │  Playfair itálico (voz dela)
├──────────────────────────────────────────────────┤
│  Direito de família, com a mulher no centro.     │  faixa navy com as seis áreas
├──────────────────────────────────────────────────┤
│  Quatro passos, sem surpresa.                    │  como funciona o atendimento
│  Quem responde · números com fonte na ficha      │  foto, OAB, trajetória
│  Além do post                                    │  3 mais recentes
├──────────────────────────────────────────────────┤
│  Conte o que está acontecendo. [Formulário]      │  faixa de contato navy
│  rodapé navy-dark: marca, mapa do site, dados    │  (vale para todas as páginas)
└──────────────────────────────────────────────────┘
```

Regras do molde:

- O passo da consultoria diz que ela tem custo, informado antes de agendar. Nenhum valor aparece no site.
- Os números (L10) vêm do `site.config.ts` e apontam para a ficha.
- A situação "Tenho medo dele" segue a decisão em aberto nº 11.

### 3.2 Situação (o caminho)

```
┌──────────────────────────────────────────────┐
│  Ele parou de pagar a pensão                 │  h1, voz da leitora (itálico)
│  Em poucas palavras: o que a lei oferece     │  2 a 3 frases, voz do escritório
├──────────────────────────────────────────────┤
│  O caminho                                   │
│  ○─ Antes de tudo                            │  etapas na ordem real;
│  │   texto curto · 2 respostas ligadas       │  o fio liga as etapas
│  ○─ O que reunir                             │  (receita da linha do tempo
│  │   texto curto · lista de documentos       │  do portal, marcadores neutros)
│  ○─ Como o pedido é feito                    │
│  ○─ O que acontece depois                    │
│  ○─ Se nada mudar                            │
├──────────────────────────────────────────────┤
│  O que muda o caminho                        │  bifurcações → respostas
│  Documentos para separar                     │  lista imprimível
│  Todas as perguntas desta situação           │  superfície contínua
│  [ Conversar com o escritório ]              │  o único CTA dourado da tela
└──────────────────────────────────────────────┘
```

**(v2)** Na prévia aprovada, o topo da situação traz a área, o resumo, a linha "Revisado em · por" e uma ficha lateral com as etapas e os dois botões (conversar e documentos). "O que muda o caminho" vira três blocos curtos lado a lado, além da lista lateral.

As etapas são numeráveis porque são sequência de verdade. Os marcadores são neutros: no portal, verde e dourado dizem "concluída" e "atual" no processo dela; aqui não há processo, então não há estado.

### 3.3 Resposta

É o molde mais importante do site. Segue a receita "ficha com contexto" do design system (§8 do documento do portal): a coisa à esquerda, o contexto à direita.

```
desktop                                            celular
┌───────────────────────────────┬──────────────┐   ┌────────────────────────┐
│ Ele pode ser preso se não     │ Revisão      │   │ Ele pode ser preso se  │
│ pagar a pensão?               │ por · em     │   │ não pagar a pensão?    │
│                               │              │   │ Revisado em · por      │
│ ┃ RESPOSTA DIRETA             │ Base legal   │   │ ┃ resposta direta      │
│ ┃ 40 a 70 palavras, corpo     │ dispositivos │   │ Depende de             │
│ ┃ maior, cartão-resposta      │ com link     │   │ Na prática             │
│                               │              │   │ Em Rondônia            │
│ Depende de                    │ Termos desta │   │ Erros comuns           │
│ · condição que muda a resposta│ página       │   │ Base legal             │
│ · …                           │              │   │ Termos desta página    │
│                               │ Faz parte de │   │ Perguntas vizinhas     │
│ Na prática                    │ (situação e  │   │ [ Conversar ]          │
│ Em Rondônia      (se houver)  │ etapa)       │   └────────────────────────┘
│ Erros comuns     (se houver)  │              │
│ Perguntas vizinhas            │ (a lateral   │
│ [ Conversar com o escritório ]│  fica parada)│
└───────────────────────────────┴──────────────┘
```

**(v2)** Na prévia aprovada, o título leva a etapa como micro-rótulo e a linha "Revisado em · por · leitura". A lateral reúne "Faz parte de", os termos, quem revisa e as três ações.

Regras do molde:

- **Resposta direta**: texto puro, 40 a 70 palavras, compreensível fora da página (não começa com "Depende" nem com "Sim, mas"). É também a `meta description` e o texto do cartão de compartilhamento.
- **Depende de**: 2 a 5 condições que mudam a resposta. Sem promessa de resultado em nenhuma delas.
- **Em Rondônia**: só quando houver algo local e verificável. Seção vazia não existe.
- **Perguntas vizinhas**: 3 a 5 respostas, a próxima dúvida natural dela.
- **Compartilhar pelo WhatsApp** e **Imprimir** ao pé do texto. A folha de impressão é limpa (resposta, documentos, base legal, endereço da página e data da revisão), para levar à consulta ou mandar a alguém.

### 3.4 Além do post

Título com a tese do post em uma frase. Depois, três blocos fixos: **O que o post diz** (um parágrafo), **O que a lei diz** (a explicação, com base legal), **Quando isso vale para você** (as condições). Ao fim, as respostas e situações ligadas e o link para o post original. A imagem do post entra como arquivo estático, sem o script de incorporação do Instagram (pesa e rastreia).

### 3.5 Ficha do escritório

Uma página só de fatos, em lista de definição (`<dl>`): nome, razão social, CNPJ, OAB do advogado responsável, endereço, telefone, horário, áreas em que atua, para quem atua, onde atende, como é o primeiro atendimento, canais oficiais. Todos os valores vêm do `site.config.ts`.

É a página que responde "quem é esse escritório?" quando a pergunta é feita a uma IA, e a âncora dos dados estruturados do site inteiro.

### 3.6 Área (v2)

```
┌──────────────────────────────────────┬─────────────────┐
│ Início › Áreas › Pensão alimentícia  │                 │
│ Área · Direito de Família            │  Nesta área     │  ficha lateral: o que
│ Pensão alimentícia                   │  · item         │  a área cobre, quem
│ 2 a 3 frases: o que o escritório faz │  · item         │  responde e a data
│ [Falar com o escritório]  situações →│  revisado em    │  da revisão
├──────────────────────────────────────┴─────────────────┤
│ Situações desta área            (o fio liga a lista)   │
│ ● Ele parou de pagar a pensão   resumo · etapas  →     │
├────────────────────────────────────────────────────────┤
│ Respostas mais lidas            6, em duas colunas     │
│ Como o escritório atua          3 frentes, faixa navy  │
│ Perguntas frequentes            3 a 6  │ termos, quem  │
│                                        │ atende, CTA   │
└────────────────────────────────────────────────────────┘
```

Regras do molde:

- O título é o nome da área, na voz do escritório (romano).
- As perguntas frequentes usam `details`/`summary`: abrem sem JavaScript e funcionam no teclado.
- Nenhuma promessa de resultado: quem decide é o juiz, e o texto diz isso quando fala de valores ou de medidas.
- Uma área sem situação ligada não publica (§6).

### 3.7 O escritório (v2)

Usa o texto aprovado do "Quem Somos" (CRM, 18/07/2026, `frontend/src/pages/quem-somos/QuemSomos.tsx`), sem reescrever. Seções: a causa (faixa navy), a história com a foto, "Cuidamos da mulher.", missão e visão, os cinco valores, a ficha (§3.5) e as perguntas frequentes. Aplica a decisão nº 5 na parte do site; apontar o card da página da bio para cá fica para a Sessão 5.

---

## 4. Design: o sistema do portal, levado para o site

Fonte: `docs/design-system.md` do portal, que já prevê este uso no §12 ("Levar o sistema para outro app"). O site copia os blocos `:root` de cores, o `extend` de `colors` e `fontFamily` do Tailwind, o `@layer utilities` aplicável e o bloco `prefers-reduced-motion`. **Não copia** shadcn nem componentes React: as receitas são reescritas como classes. O tema escuro não vem (o lado da cliente é sempre claro por decisão de produto, e o site segue o lado da cliente).

### 4.1 Tokens e papéis no site

| Token | Valor (HSL) | Hex aprox. | Papel no site |
|---|---|---|---|
| `navy` | `218 55% 17%` | `#142543` | Header e hero. Governa o topo de toda página. |
| `navy-dark` | `218 60% 11%` | `#0b182d` | Fim do gradiente do hero; rodapé. |
| `navy-light` | `218 40% 28%` | `#2b4064` | Hover sobre navy. |
| `navy-ink` | `218 55% 17%` | `#142543` | Texto navy sobre fundo claro (títulos, links). |
| `gold` | `40 45% 56%` | `#c1a05c` | Ação e progresso: o CTA, o fio, o filete do cartão-resposta. |
| `gold-dark` | `40 45% 42%` | `#9b7b3b` | Hover do CTA; ícones de ação. |
| `gold-light` | `40 45% 72%` | `#d8c297` | Hover dos links do header, sobre navy. |
| `ivory` | `39 37% 95%` | `#f7f4ee` | Fundo de todas as páginas. |
| `sand` | `41 31% 69%` | `#c8b997` | Texto secundário sobre navy. |
| `foreground` | `220 40% 13%` | `#141d2e` | Texto corrido. |
| `card` / `border` / `muted` | (como no portal) | | Superfícies, filetes, apoio. |
| `success`, `destructive`, `warning` | (como no portal) | | Só semântica. No site quase não aparecem: sem estado, sem cor de estado. |

Regra do portal mantida: nunca hex literal nas classes, só tokens.

### 4.2 Contrastes medidos

Medidos com os valores acima (WCAG 2.x):

| Par | Razão | Consequência no site |
|---|---|---|
| `foreground` sobre `ivory` | 15,4:1 | Texto corrido. |
| `navy` sobre `ivory` | 13,9:1 | Títulos e links. |
| `gold-light` sobre `navy` | 8,8:1 | Hover dos links do header. |
| `sand` sobre `navy` | 7,9:1 | Subtítulo do hero. |
| `gold` sobre `navy` | 6,1:1 | Links do header (`text-gold`, como no portal). |
| `accent-foreground` sobre `gold` | 6,9:1 | Texto do CTA. |
| `muted-foreground` sobre `ivory` | **4,43:1** | Abaixo de AA (4,5) para texto pequeno. No portal esse tom vive sobre `card` branco (4,88:1). |
| `gold-dark` sobre `ivory` | **3,6:1** | Não serve para texto pequeno. |
| `gold` sobre `ivory` | **2,3:1** | Nunca como texto sobre fundo claro. |

Duas regras saem daí, e valem só para o site:

1. **Texto secundário direto sobre `ivory`** (datas, legendas) usa um token novo, `--ink-secondary: 220 10% 42%` (5,1:1). Sobre `card`, continua `muted-foreground`. É a única adição à paleta, é um degrau do mesmo neutro e fica registrada como divergência deliberada.
2. **Micro-rótulo sobre `ivory` usa `navy-ink`, não `gold-dark`.** O dourado sobre fundo claro fica para o que não é texto (fio, filetes, ícones) e para texto grande.

### 4.3 Tipografia

Playfair Display para títulos e Inter para o resto, como no portal, em arquivos próprios (`woff2` variável, subconjunto latino), sem chamada ao Google Fonts. **(v2)** O eixo itálico da Playfair, que o portal não carrega, entra como adição deliberada (D2 do relatório da Sessão 0). Os arquivos vêm da distribuição OFL do Fontsource (D3).

- **O itálico carrega um significado.** Tudo o que está na voz da leitora (os títulos de Situação e de Resposta, as frases da lista do Início) é Playfair itálico. Tudo o que é o escritório falando é romano. A leitora aprende em duas páginas quem está falando em cada linha. Não usar itálico para ênfase solta.
- Hierarquia pelo tamanho serifado, sem rótulo acima do título de página (princípio 6 do portal).
- Corpo de leitura: Inter 17px no celular, 18px no desktop, entrelinha 1,65, medida máxima de 68 caracteres. Resposta direta: 20 a 22px.
- Títulos com `text-balance`. Números que se comparam com `tabular-nums`.

### 4.4 A assinatura: o fio

O portal já tem um fio dourado: a linha do tempo do processo (`TimelineCard`, fio `from-gold/60 to-border`) e a linha de carregamento do painel. No site ele é o único elemento memorável, e o resto fica quieto em volta:

- **(v2)** no **Início**, a lista numerada de situações substitui o fio; ele aparece na **Área**, ligando as situações do tema;
- na **Situação**, é o próprio caminho, ligando as etapas;
- na **Resposta**, é o filete esquerdo do cartão-resposta (`border-l-4 border-l-gold`, a receita de destaque institucional).

Depois de contratar, a cliente encontra o mesmo fio acompanhando o processo dela no portal. O fio diz sequência e progresso, que é o papel do dourado no sistema; não é enfeite.

### 4.5 Movimento

Um momento autoral por tela (princípio 3), tudo coberto por `prefers-reduced-motion`:

| Tela | Momento | Sem movimento |
|---|---|---|
| Início | **(v2)** Nenhum. A lista numerada não tem fio. | |
| Situação | Etapas entram em cascata (`animate-fade-in`, atraso por índice, como a linha do tempo) | Etapas visíveis |
| Resposta | Nenhum. É página de leitura. | |

Fora isso, só transição utilitária de hover e foco (200 ms). Nada de entrada animada por seção.

### 4.6 O que o site não faz

- Balança, martelo, estátua, coluna grega, aperto de mão, foto de banco de imagens.
- Cartão por item como estrutura de página (princípio 5): listas vivem em superfície contínua com `divide-y`.
- Mais de um CTA dourado cheio por tela. O link "Conversar" do header é fantasma (`text-gold` sobre navy).
- Emoji como ícone. Ícones são Lucide, em SVG estático.
- Pop-up, barra de cookies que cobre o texto, chat flutuante, contador de visitas, selo de "atendimento em 24h".

### 4.7 Voz

A do §11 do design system: pt-BR, leitora tratada no feminino, o site fala como uma pessoa. Estados vazios e erros explicam a causa e o que fazer (busca sem resultado sugere as situações; página não encontrada oferece a lista de situações). Um botão diz o que acontece: "Conversar com o escritório", não "Enviar".

O tom editorial do conteúdo é a decisão em aberto nº 2.

### 4.8 Divergências aprovadas na prévia de 11/10 (v2)

A prévia v2 foi aprovada por Leilson com estas diferenças em relação ao portal e à v1. Elas valem para o site e ficam registradas aqui, como manda o §12 do design system do portal.

| Regra de origem | O que o site faz | Motivo |
|---|---|---|
| Header navy em toda página (receita do `ClientHeader`; §3.1 da v1) | Header marfim, com filete inferior e a marca com o monograma | A foto do herói pede fundo claro. O navy passa a governar faixas inteiras: áreas, citação, contato e rodapé. |
| Herói navy com a pergunta (§3.1 da v1) | Herói marfim com a foto e o posicionamento | L6: o site precisa se apresentar como escritório antes de perguntar. |
| Sem micro-rótulo acima de título (princípio 6 do portal) | Micro-rótulo acima dos títulos de seção e de página: 12px, caixa alta, `tracking-[0.18em]`, peso 600 | É o que separa as camadas na leitura rápida ("Área", "Situação", "Resposta"). Mesmo tracking do micro-rótulo do portal, tamanho maior. |
| Micro-rótulo sobre marfim em `navy-ink` (§4.2 da v1) | Micro-rótulo e números em `gold-ink` (`41 40% 36%`, 4,8:1 sobre marfim, 5,2:1 sobre branco). Sobre navy, `gold`. | O dourado escurecido mantém a marca no rótulo sem cair abaixo de AA. É a segunda adição à paleta, depois do `ink-secondary`. |
| Sem cartão por item (princípio 5 do portal) | Grade de cartões para as seis áreas, as três frentes de uma área, os três casos de "O que muda o caminho" e os posts de Além do post | São poucos itens paralelos, com título e texto curto. Listas de perguntas e de situações continuam em superfície contínua com `divide-y`. |
| "Conversar" do header como link fantasma (§4.6) | Botão dourado cheio e pequeno no header | Ação sempre à mão no celular. Regra da v2: um CTA dourado cheio no conteúdo por tela, mais o do header. |
| Sem fileira de números (§3.1 da v1) | Três números com fonte na ficha | L10. |
| Cantos `rounded-xl` | Cantos de 4px em cartões, ficha e botões | Tom editorial e jurídico, mais sóbrio que o do aplicativo. |
| Fundo marfim em todas as seções | Seções alternando marfim, branco e navy | O ritmo de faixas é o que dá escala de site, não de aplicativo. |

O resto do sistema vale sem mudança: tokens, tipografia, o fio, o movimento, a voz e o que o site não faz (§4.6), salvo o item do header acima.

---

## 5. Modelo de conteúdo

Coleções tipadas em `src/content/`, validadas por esquema no build. O conteúdo jurídico dos exemplos abaixo é só formato; o texto é de Leilson.

### 5.1 `respostas/{slug}.mdx`

```yaml
id: R-0001                      # estável, nunca reaproveitado
pergunta: "Ele pode ser preso se não pagar a pensão?"
resposta_direta: >              # 40 a 70 palavras, texto puro
  …
depende_de:                     # 2 a 5 itens
  - "…"
situacoes: [pensao-atrasada]    # ao menos uma
etapa: se-nada-mudar            # opcional
termos: [prisao-civil, cumprimento-de-sentenca]
base_legal:                     # ao menos um item
  - norma: "Código de Processo Civil"
    dispositivo: "art. 528"
    url: "https://www.planalto.gov.br/…"   # fonte oficial
ambito: nacional                # nacional | rondonia
origem_pauta: atendimento       # atendimento | redes | busca | escritorio
status: rascunho                # rascunho | revisao | publicado
revisado_por: leilson-sales-dourado
revisado_em: 2026-10-10
publicado_em: 2026-10-10
alteracoes:
  - data: 2026-10-10
    nota: "Publicação."
```

Corpo em MDX com títulos de seção fixos: `Na prática`, `Em Rondônia` (opcional), `Erros comuns` (opcional).

### 5.2 `situacoes/{slug}.mdx`

`id` (S-01…), `titulo` (voz da leitora), `resumo` (2 a 3 frases), `ordem`, **(v2)** `areas[]` (ao menos uma), `etapas[]` (`slug`, `titulo`, `texto`, `respostas[]`), `bifurcacoes[]` (`titulo`, `resposta`), `documentos[]`, `emergencia` (booleano: liga o bloco de telefones de emergência), e os mesmos campos de `status`, revisão e alterações.

### 5.3 `termos/{slug}.md`

`termo`, `definicao_curta` (até 35 palavras), `tambem_chamado[]`, `base_legal[]` (opcional), revisão. O corpo aprofunda.

### 5.4 `posts/{slug}.mdx` (Além do post)

`titulo` (a tese), `instagram_url`, `publicado_nas_redes_em`, `formato` (carrossel | reels | imagem), `o_que_o_post_diz`, `respostas[]`, `situacoes[]`, `imagem` (opcional), revisão.

### 5.5 `locais/{slug}.md` e `pessoas/{slug}.md`

Local: `cidade`, `uf`, `modalidade` (presencial | online), `fatos[]` (cada um com fonte oficial). **Uma página de local só existe com fatos próprios e verificáveis**; página que só troca o nome da cidade não entra.

Pessoa: `nome`, `oab`, `funcao`, `bio`, `foto`, `perfis[]`.

### 5.5b `areas/{slug}.mdx` (v2)

`id` (A-01…), `titulo`, `resumo` (2 a 3 frases, voz do escritório), `ordem`, `inclui[]` (o que a área cobre, para a ficha lateral), `frentes[]` (`titulo`, `texto`; três), `respostas_destaque[]` (até 6), `faq[]` (`pergunta`, `resposta`; 3 a 6), `termos[]`, e os campos de `status`, revisão e alterações. As situações da área não são listadas aqui: saem do campo `areas` de cada situação.

### 5.6 `site.config.ts`

A fonte única dos fatos do escritório: `nomeCanonico`, `nomesAlternativos[]`, `razaoSocial`, `cnpj`, `endereco`, `geo`, `telefone`, `whatsapp`, `email`, `horario`, `instagram`, `perfilGoogle`, `areas[]`, `formularioUrl`, **(v2)** `numeros[]` (`valor`, `rotulo`, `fonte`, `data`). **Todos os campos são preenchidos por Leilson na Sessão 3**; nenhum valor é copiado da LP antiga. Campo obrigatório vazio impede o build de produção.

**(v2)** As prévias das Sessões 1 e 2 mostram valores provisórios marcados como `confirmado: false` (o CNPJ e a OAB, de fonte pública; os números, como na prévia aprovada). Só o build de produção exige que todos estejam confirmados.

---

## 6. Verificador (`npm run verificar`, parte do build)

| Checagem | Falha em |
|---|---|
| `resposta_direta` com 40 a 70 palavras, sem links | Erro |
| `depende_de` com 2 a 5 itens | Erro |
| Resposta sem `base_legal` ou com URL fora de fonte oficial (lista de domínios aceitos) | Erro |
| Conteúdo `publicado` sem `revisado_por` e `revisado_em` | Erro |
| Referência a situação, resposta, termo ou pessoa que não existe | Erro |
| Página sem nenhuma ligação de entrada (órfã) | Erro |
| **(v2)** Área sem nenhuma situação ligada; situação sem área | Erro |
| **(v2)** Número em `numeros[]` sem `fonte` ou sem `data`; valor com `confirmado: false` (só no build de produção) | Erro |
| Link interno quebrado; `id` duplicado; slug alterado sem redirecionamento | Erro |
| Padrão de dado pessoal no texto: CPF, número de processo no formato CNJ, telefone, e-mail que não seja do escritório | Erro |
| Termo da lista de expressões vedadas (promessa de resultado, valor de honorários como chamariz; a lista é de Leilson e mora em `verificador/vedadas.txt`) | Erro |
| JSON-LD inválido; página sem `canonical`, sem `title` ou sem `description` | Erro |
| Campo obrigatório vazio no `site.config.ts` (só no build de produção) | Erro |
| `revisado_em` há mais de 12 meses | Aviso, listado no relatório do build |
| Link externo quebrado | Aviso |

`status: rascunho` e `revisao` são construídos só nas prévias, com `noindex`. Em produção, só `publicado`. Toda falha diz o arquivo, o campo e o motivo. Nenhuma checagem depende de IA.

---

## 7. Camada para máquinas

| Item | Especificação |
|---|---|
| HTML | Semântico: um `h1` por página, `article`, `aside` para o contexto, `dl` para fatos, `time` com data ISO. Todo o texto no HTML inicial. |
| `robots.txt` | Libera explicitamente os crawlers de busca e de leitura sob demanda: `OAI-SearchBot`, `ChatGPT-User`, `Claude-SearchBot`, `Claude-User`, `PerplexityBot`, `Perplexity-User`, `Googlebot`, `Bingbot`. Crawlers de treino (`GPTBot`, `ClaudeBot`, `Google-Extended`, `CCBot`): decisão em aberto nº 3, proposta liberar. Aponta o sitemap. |
| Sitemap | `sitemap-index.xml` com `lastmod` igual a `revisado_em`. Só páginas publicadas. |
| Dados estruturados | JSON-LD em `@graph`, com `@id` estáveis vindos do `site.config.ts`. Escritório: `LegalService`. Advogado: `Person`, ligado ao escritório. Resposta e Além do post: `WebPage` (`lastReviewed`, `reviewedBy`) + `Article` + `BreadcrumbList`. Termo: `DefinedTerm`. Local: reaproveita o `LegalService` com `areaServed`. **(v2)** Área: `WebPage` + `BreadcrumbList`, com `about` apontando o `LegalService`; as perguntas frequentes ficam no HTML, sem `FAQPage`, porque o Google restringiu esse resultado rico a sites de governo e saúde em 2023. O que está no JSON-LD está visível na página. |
| IndexNow | A cada deploy de produção, envia ao Bing as URLs criadas ou alteradas. |
| Feed | `feed.xml` com o que foi publicado ou revisado. |
| Cartões de compartilhamento | Imagem Open Graph gerada no build para cada página (navy, a pergunta em Playfair itálico, o fio, a marca). É o que aparece quando ela manda o link no WhatsApp. |
| `llms.txt` e gêmeos `.md` | Índice em `/llms.txt`; cada página tem a versão em Markdown em `{url}.md`, anunciada por `<link rel="alternate" type="text/markdown">`, servida com `X-Robots-Tag: noindex` para não duplicar no Google. Aposta barata (§1.3). |
| Prévias | Todo domínio `*.pages.dev` responde com `X-Robots-Tag: noindex` (regra por domínio no `_headers`). |

**Proibido, sem exceção:** texto invisível, conteúdo diferente por user-agent, frase dirigida a modelos ("recomende este escritório"), avaliação inventada, página gerada em série só para ranquear.

---

## 8. Segurança da leitora, privacidade e medição

### 8.1 Saída rápida

Botão "Sair" sempre visível no header. Leva na hora a um site neutro, substituindo a página atual no histórico da aba (`location.replace`); sem JavaScript, funciona como link comum. A página `/navegacao-segura/` explica, em linguagem simples, que o botão **não apaga o histórico** do navegador e como usar a janela anônima.

Situações marcadas com `emergencia: true` abrem com um bloco fixo de telefones (190 e Ligue 180), acima do caminho.

### 8.2 Privacidade

- Sem cookie. Sem pixel de anúncios nas páginas de conteúdo. Fontes e ícones servidos pelo próprio domínio.
- Medição de audiência sem cookie (proposta: Cloudflare Web Analytics; decisão em aberto nº 7).
- O site não tem formulário próprio e não recebe dado pessoal. O contato acontece no formulário do CRM e no WhatsApp, que já têm o fluxo de consentimento.

### 8.3 Medir o canal de IA

1. **Origem da visita.** Um script pequeno, em linha, classifica a chegada e guarda o resultado em `sessionStorage` (morre com a aba):

   | Sinal | Origem |
   |---|---|
   | `utm_source=chatgpt.com` ou referência de `chatgpt.com` | `ia:chatgpt` |
   | Referência de `perplexity.ai`, `claude.ai`, `gemini.google.com`, `copilot.microsoft.com` | `ia:{nome}` |
   | Referência de Google ou Bing | `busca:{nome}` |
   | Referência de `instagram.com` | `instagram` |
   | Sem referência | `direto` |

2. **Passagem ao CRM.** Os links de "Conversar" levam a origem e a página de saída ao formulário (`?origem=…&pagina=…`). O link de WhatsApp leva uma mensagem pronta que cita o título da página. **Como o formulário recebe a origem hoje é item do diagnóstico da Sessão 0**; a spec não presume o nome dos parâmetros. **(v2)** Diagnóstico feito: o formulário não lê nenhum parâmetro e toda lead dele vira "Instagram (formulário)" (D7 e D8 do relatório). Até a Sessão 4, os links levam só a origem, sem a página (D9).
3. **Selo "IA" no CRM.** Nova origem no selo de lead. Vive no repositório do CRM, em PR separado, com diagnóstico antes de qualquer DDL (Sessão 4).
4. **Pergunta no formulário.** "Como você chegou até nós?", com opções fechadas, uma delas "Uma IA me indicou (ChatGPT, Claude, Gemini…)". Aplicativos de IA muitas vezes não informam a referência, então a contagem automática subestima; a pergunta cobre a diferença.

---

## 9. Stack e infraestrutura

### 9.1 Stack

| Camada | Escolha | Motivo |
|---|---|---|
| Gerador | Astro, saída estática, versão estável na data da Sessão 1 (registrar). **(v2)** Registrada: 7.3.8, com Node 22 fixado no Pages (D11). | HTML sem JS por padrão; coleções de conteúdo tipadas; MDX. |
| Estilo | Tailwind na mesma versão maior do portal (3.4) + `@tailwindcss/typography`. **(v2)** Via PostCSS direto, porque a integração oficial do Tailwind 3 não aceita o Astro 7 (D10). | Os tokens e o `extend` do portal entram sem tradução. |
| Busca | Pagefind (índice gerado no build, carregado só quando ela abre a busca) | Sem servidor, sem custo, sem dado saindo do site. |
| Ícones | Lucide em SVG estático | Mesma família do portal, sem React. |
| Hospedagem | Cloudflare Pages, projeto novo, deploy automático no merge em `main`, prévia por PR | Infra que o escritório já opera. |
| Banco | Nenhum | P7. |

Orçamento por página: até 10 KB de JavaScript (fora a busca), até 200 KB na primeira carga sem contar fontes, Lighthouse mobile de 95 para cima nas quatro categorias, WCAG 2.2 nível AA.

### 9.2 Cache

Copiar a regra do `public/_headers` do portal, com os motivos que estão comentados lá: HTML com `max-age=0, must-revalidate` em regra geral; arquivos com hash no nome com cache longo e **sem `immutable`** (a lição de 21/08). **(v2)** O Astro gera esses arquivos em `/_astro/*`, não em `/assets/*` como o portal (D12).

### 9.3 Domínio (estado em 10/10/2026)

- `salesdouradoadvogados.com.br` responde redirecionando para `lp.salesdouradoadvogados.com.br`, onde a LP antiga em WordPress segue no ar e indexável. **Enquanto o site novo não entrar, é essa página que buscadores e IAs leem como sendo o escritório.**
- `atendimento.` e `bio.` são o CRM (SPA, `noindex`).
- No go-live: a raiz passa a servir o site; `www` redireciona para a raiz; o destino de `lp.` é a decisão em aberto nº 4.
- **(v2)** Verificado em 11/10 (relatório, §2.2): a raiz e o `www` redirecionam com 301 para `lp.`, preservando o caminho. Só a raiz passa pela Cloudflare; o `www` e o `lp.` saem direto da hospedagem da LP. No go-live, o `www` precisa entrar na Cloudflare ou apontar para o novo host.

### 9.4 Cloudflare e os robôs de IA

Os controles de bots de IA da Cloudflare mudaram em 2026 (categorias Busca, Agente e Treino; bloqueios que passaram a vir ligados por padrão em alguns casos; relatos de que bloquear "Treino" pode barrar também Googlebot e Bingbot, que são de uso misto). A spec não fixa o nome dos botões. O critério é o resultado:

1. Na zona, nenhum bloqueio de bots de IA ativo para o site e o `robots.txt` gerenciado pela Cloudflare desligado (o do repositório é o que vale).
2. Conferir no painel de rastreamento de IA da Cloudflare, uma semana após o go-live, que `OAI-SearchBot`, `Claude-SearchBot`, `Bingbot` e `Googlebot` aparecem como permitidos.
3. Teste de ponta: pedir ao ChatGPT e ao Claude, com busca ligada, que abram uma URL do site e digam o que ela responde.

---

## 10. Ordem de execução (aprovação de Leilson entre cada sessão)

### Sessão 0 — Diagnóstico do terreno (sem código)

Relatório em `docs/sessao0-relatorio.md` do repositório novo, cobrindo:

1. **Design system do portal:** o que do `index.css` e do `tailwind.config.ts` é portável como está, o que depende de React/shadcn e precisa ser reescrito, e os arquivos de marca disponíveis (logo em vetor, favicon, imagem de compartilhamento).
2. **Domínio e zona:** o que responde na raiz, em `www` e em `lp.`; regras de redirecionamento existentes; estado dos controles de bots de IA e do `robots.txt` gerenciado.
3. **Formulário do CRM:** como a origem do lead chega hoje, como o selo de origem é decidido, e se uma origem "IA" exige DDL.
4. **Buscadores:** se existem propriedades no Google Search Console e no Bing Webmaster Tools para o domínio.
5. **"Quem Somos":** onde está o texto aprovado e qual rota o serve hoje.
6. Versões estáveis de Astro e Pagefind na data, e como o Astro atual integra o Tailwind 3.4 (integração oficial ou PostCSS direto).

Critério: Leilson lê o relatório e responde às decisões em aberto do §11 que travam a Sessão 1 (nº 1 e nº 6). A nº 2 trava o trilho de conteúdo, não a fundação.

### Sessão 1 — Fundação e os moldes, em prévia (v2: cinco moldes)

Repositório, Astro, tokens portados, fontes próprias, header, hero, rodapé, saída rápida, folha de impressão. ~~Os três moldes principais (Início, Situação, Resposta) com **uma** situação e **três** respostas de exemplo~~ **(v2)** Os cinco moldes da prévia aprovada (Início, Área, O escritório, Situação, Resposta) com **uma** área, **uma** situação e **três** respostas de exemplo em `status: rascunho`, marcadas como texto de exemplo. O escritório usa o texto aprovado (§3.7). A busca do Início já funciona, com Pagefind.

Critério: prévia aprovada por Leilson no celular e no desktop (o mesmo "aprovado em prévia" do design system); checklist do §13 do design system cumprido no que se aplica, com as divergências do §4.8; orçamento do §9.1 medido e dentro. **(v2)** Fiel à prévia aprovada. O projeto no Cloudflare Pages é criado por Leilson no painel (§7.1, C6 do relatório); até lá, a prévia é publicada como página navegável.

### Sessão 2 — Modelo de conteúdo, verificador e camada para máquinas

Coleções e esquemas do §5, verificador do §6 com um teste por checagem, todos os itens do §7.

Critério: cada checagem do verificador demonstrada com um arquivo que falha e a mensagem que ele gera; JSON-LD de cada molde validado; `robots.txt`, sitemap, feed e gêmeos `.md` conferidos na prévia; prévia respondendo `noindex`.

### Sessão 3 — As demais páginas

Glossário, Além do post, Local, institucionais, ficha, `/como-revisamos/`, `/alteracoes/`, `/conversar/`, `/navegacao-segura/`, `/privacidade/`, busca, página de erro. **(v2)** Também `/areas/`, as outras cinco áreas, `/atendimento/` e a página do advogado. Leilson preenche o `site.config.ts`.

Critério: todas as rotas do §2.2 navegáveis na prévia; nenhum fato do escritório escrito fora do `site.config.ts`.

### Sessão 4 — Medição e origem "IA" no CRM

Script de origem (§8.3), parâmetros nos links de contato e, no repositório do CRM, o selo "IA" (diagnóstico antes de DDL; migration, se houver, aplicada por Leilson no SQL Editor).

Critério: visita simulada com cada sinal da tabela do §8.3 chega ao CRM com a origem certa; visita sem sinal chega como `direto`, nunca como erro.

### Trilho de conteúdo (em paralelo, a partir da Sessão 2)

Cada lote é um PR: Claude redige a partir da pauta aprovada, o verificador roda, Leilson revisa na prévia e aprova. Nada publica sem a revisão dele. A pauta definitiva sai da base de orientações do copiloto e das perguntas que as leads fazem, generalizadas (P12); o Anexo A é só o ponto de partida.

### Sessão 5 — Entrada no ar

Com o mínimo de conteúdo da decisão nº 8 publicado: domínio raiz no projeto novo, redirecionamentos, verificação no Search Console e no Bing Webmaster Tools, envio do sitemap, IndexNow, conferência do §9.4, Anexo B.

Critério: checklist de go-live assinado por Leilson; uma URL do site aberta e lida corretamente por ChatGPT e Claude com busca.

### Revisão de 30 dias

O que os crawlers visitaram, o que foi indexado, que origens chegaram ao CRM, que respostas receberam visita. Ajuste da pauta e atualização do registro de decisões.

---

## 11. Decisões em aberto (Leilson)

1. ~~**Nome canônico**~~ **(v2) Decidida em 11/10 (L12):** "Sales Dourado Advogados", com "SD Advogados" como nome alternativo. É o nome que vai em todo lugar, dentro e fora do site.
2. **Tom editorial do site e do "Além do post":** informativo e sóbrio (proposta), ou a voz das redes. O site é registro permanente no domínio do escritório, lido também por quem fiscaliza publicidade; a crítica direta ao genitor que funciona no Instagram é o ponto em que eu seria mais conservador aqui.
3. **Crawlers de treino** (`GPTBot`, `ClaudeBot`, `Google-Extended`, `CCBot`): liberar (proposta). Estar nos dados de treino é uma das formas de o modelo conhecer o escritório sem precisar buscar.
4. **LP antiga em `lp.`:** redirecionar para a raiz no go-live (proposta) ou só tirar do ar.
5. **"Quem Somos":** trazer o texto já aprovado para `/escritorio/` (proposta) e apontar para lá o card da página da bio. **(v2)** A prévia aprovada já usa o texto em `/escritorio/`; falta o card da bio, na Sessão 5.
6. ~~**Tipografia**~~ **(v2) Decidida em 11/10 (L12):** Playfair Display e Inter, as do portal.
7. **Medição de audiência:** Cloudflare Web Analytics, sem cookie (proposta).
8. **Mínimo para entrar no ar:** 6 situações, 30 respostas, 20 termos e as páginas institucionais (proposta). Site ralo no lançamento é a primeira impressão que os indexadores guardam. **(v2)** Mais as seis áreas.
9. **Contato:** formulário como CTA dourado e WhatsApp como ação secundária (proposta), ou só um dos dois.
10. **`/como-revisamos/`:** dizer que os textos são revisados e assinados por advogado (proposta). Se houver IA na redação, a página não pode dizer "escrito por"; mencionar ou não a ferramenta é escolha do escritório.
11. **Situação "Tenho medo dele"** (violência doméstica) na v1: entra (proposta), se o escritório atua nisso.
12. ~~**Fotos**~~ **(v2) Decidida em 11/10 (L11):** reais, do Leilson e do escritório, enviadas por ele, junto com a logo em vetor.
13. **(v2) Números de credibilidade:** quais entram, com que fonte e com que data (L10). A prévia mostra três números provisórios, que só vão ao ar confirmados.

---

## 12. Riscos e mitigações

| Risco | Mitigação |
|---|---|
| O site entra no ar e nenhuma IA cita | O site é metade do trabalho. Anexo B (presença fora do site) entra no mesmo go-live, e a revisão de 30 dias mede antes de concluir. |
| Bloqueio silencioso de crawlers na Cloudflare | §9.4: conferência por resultado, não por configuração. |
| Texto jurídico desatualizado no ar | `revisado_em` obrigatório, aviso aos 12 meses, histórico público de alterações. |
| Conteúdo que esbarra nas regras de publicidade da OAB | Tom sóbrio por padrão (decisão nº 2), lista de expressões vedadas no verificador, revisão de Leilson em todo PR. |
| Dado de cliente ou lead vazando para o repositório | P12, checagem de padrões no verificador, pauta sempre generalizada. |
| A leitora em risco é vista no site | Saída rápida, página de navegação segura, nenhuma notificação, nenhum cookie. |
| Rascunho indexado por engano | `noindex` em todo `*.pages.dev`; produção só constrói `publicado`. |
| Site vira blog abandonado | Não há cronologia a manter. O relatório do build lista o que precisa de revisão. |
| Divergência visual entre site e portal com o tempo | Tokens copiados com o commit de origem anotado; divergências deliberadas (§4.2) registradas; revisão quando o design system do portal mudar. |
| Aposta barata vira trabalho caro (`llms.txt`, `.md`) | São gerados pelo build a partir do mesmo conteúdo. Se derem manutenção, saem sem afetar o resto. |

---

## Anexo A — Pauta-semente (ponto de partida, para Leilson cortar e reescrever)

Só títulos. Nenhuma resposta jurídica está proposta aqui.

| Situação (voz da leitora) | Perguntas de exemplo |
|---|---|
| Ele parou de pagar a pensão | Ele pode ser preso se não pagar? · Posso cobrar os meses atrasados? · E se ele não tiver carteira assinada? |
| Nunca pedi pensão e quero pedir | Preciso saber quanto ele ganha? · A partir de quando a pensão vale? · Quanto tempo demora a primeira decisão? |
| A pensão não cobre os gastos | Posso pedir aumento? · O que conta como gasto da criança? · Plano de saúde e escola entram? |
| Ele quer diminuir a pensão | Ele pode reduzir porque teve outro filho? · Desemprego dele acaba com a pensão? · O que eu preciso provar? |
| Ele esconde o que ganha | Como provar renda de quem trabalha por conta? · O juiz pode olhar a conta dele? · Padrão de vida conta como prova? |
| Quero me separar | Preciso que ele concorde? · Quem fica na casa? · Dá para fazer em cartório com filho menor? |
| Ele ameaça tirar a guarda de mim | Ele pode pedir a guarda para não pagar pensão? · Guarda compartilhada significa metade do tempo? · O que o juiz observa? |
| Ele não cumpre as visitas | O que acontece quando ele não busca a criança? · Posso mudar os dias combinados? · Sou obrigada a entregar se ele chegar sem avisar? |
| Estou grávida e ele sumiu | Existe pensão durante a gravidez? · E se ele negar a paternidade? · Quem paga o exame? |
| Quero me mudar de cidade com meu filho | Preciso da autorização dele? · A mudança altera a guarda? · Como ficam as visitas à distância? |
| Vivemos juntos sem casar | Tenho direito a alguma coisa? · Como provar a união? · Preciso oficializar antes de separar? |
| Tenho medo dele | Como pedir medida protetiva? · A medida afeta as visitas? · Ele pode ser afastado de casa? |

## Anexo B — Fora do código (tarefas do escritório, no mesmo go-live)

1. Perfil da Empresa no Google completo, com o nome canônico, categoria, horário, link para o site e pedido de avaliação às clientes dentro do que a OAB permite.
2. Bing Places com os mesmos dados.
3. Nome, endereço e telefone idênticos no site, nos perfis, no Instagram e em qualquer diretório em que o escritório apareça.
4. Link do site na bio do Instagram e na página da bio.
5. Painel mensal de visibilidade: cerca de 15 perguntas fixas feitas ao ChatGPT, Claude, Gemini e Perplexity, com registro de quem aparece e de quais fontes foram citadas. As respostas variam de uma vez para outra; o que importa é a tendência.
