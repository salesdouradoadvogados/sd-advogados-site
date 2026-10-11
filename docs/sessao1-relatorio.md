# Sessão 1 — relatório

Data: 11/10/2026. Escopo: spec v2, §10, Sessão 1 (fundação e os cinco moldes da
prévia aprovada, em prévia). Nada deste site está no ar.

## 1. O que foi construído

- **Projeto Astro 7.3.8**, saída estática, Tailwind 3.4.19 por PostCSS (D10),
  Pagefind 1.5.2 e ícones Lucide em SVG estático. Versões fixadas no
  `package.json`.
- **Tokens do portal** copiados do `src/index.css` dele, lado claro, mais as
  duas adições do §4.2/§4.8 (`ink-secondary`, `gold-ink`). Nenhuma cor fora
  dos tokens, nem na folha de impressão.
- **Fontes próprias**: Inter e Playfair Display (com o itálico, D2), arquivos
  `woff2` do Fontsource (D3), com pré-carregamento.
- **Moldura**: cabeçalho marfim com saída rápida e menu do celular, faixa de
  contato, rodapé, trilha de navegação, folha de impressão.
- **Moldes**: Início, Área, O escritório, Situação, Resposta e a página de
  erro. Conteúdo: uma área, uma situação e três respostas, todas em
  `status: rascunho` e `exemplo: true`. O escritório usa o texto aprovado do
  "Quem Somos".
- **Busca** do Início com Pagefind: o índice só é baixado quando ela entra no
  campo.

## 2. Critérios da sessão, medidos

Medição local sobre o build de produção. Lighthouse 12.8.2 no perfil móvel
padrão, axe-core 4.14.0 e Playwright 1.56.1, todos em Chromium 141.

**Lighthouse móvel.** A nota de SEO foi medida num build sem `noindex`
(`SITE_MEDIR_INDEXAVEL=1`), porque a prévia responde `noindex` de propósito e
isso derruba a nota. O resto do build é idêntico.

| Página | Desempenho | Acessibilidade | Boas práticas | SEO | LCP | CLS |
|---|---|---|---|---|---|---|
| Início | 99 | 100 | 100 | 100 | 2,3 s | 0 |
| Área | 99 | 100 | 100 | 100 | 2,0 s | 0 |
| O escritório | 99 | 100 | 100 | 100 | 2,1 s | 0 |
| Situação | 99 | 100 | 100 | 100 | 2,0 s | 0 |
| Resposta | 100 | 100 | 100 | 100 | 1,9 s | 0 |
| Erro | 100 | 100 | 100 | 100 | 1,9 s | 0 |

**Orçamento (§9.1).** Primeira carga sem fontes, com compressão gzip:

| Página | JavaScript da página | Primeira carga sem fontes |
|---|---|---|
| Início | 3,5 KB (1,6 KB comprimido) | 59 KB |
| Demais páginas | até 0,5 KB | 13 a 16 KB |

O teto é de 10 KB de JavaScript, fora a busca, e de 200 KB na primeira carga.
A busca, na primeira consulta, baixou 165 KB do Pagefind, sem compressão (medido com a palavra "prisão").

**WCAG 2.2 AA (axe-core).** Zero violações nas seis páginas, em 1440 px e no
celular. O que o axe deixa para revisão manual são contrastes sobre elementos
sobrepostos, todos em pares de tokens já medidos no §4.2 da spec.

**Funcional (20 verificações, todas passaram).** Busca com resultado, sem
resultado, pelo endereço (`?q=`) e limpando com Esc; índice não baixado antes
do uso; saída rápida substituindo a página no histórico, e funcionando como
link comum sem JavaScript; menu do celular e perguntas frequentes abrindo sem
JavaScript; primeiro Tab no "Pular para o conteúdo"; anel de foco visível;
folha de impressão da Resposta e da lista de documentos sem cabeçalho,
contato, rodapé e lateral, com endereço e data de revisão.

**Fidelidade à prévia.** Capturas de todas as páginas em 1440 px e 390 px,
comparadas à prévia aprovada. Nenhum transbordo horizontal e nenhum erro de
console. As alturas ficam próximas das da prévia; O escritório cresce porque
mostra as nove perguntas frequentes, e não quatro.

**Cabeçalhos do Cloudflare (`_headers`).** Conferidos no emulador
(`wrangler pages dev`, 4.149.0). O emulador confirmou que as regras se somam:
os arquivos com hash recebiam dois `Cache-Control` contraditórios. As regras
de cache longo agora removem o valor herdado antes (`! Cache-Control`). O
resultado: HTML com `max-age=0, must-revalidate`; `/_astro/*` e `/fonts/*`
com um ano, sem `immutable`; `*.pages.dev` com `noindex`; domínio próprio sem.

## 3. Onde o site difere da prévia, e por quê

1. **Um CTA dourado cheio no conteúdo.** Na prévia, a Área e a Situação
   tinham um segundo botão dourado na lateral. Ele virou contorno, pela regra
   do §4.8 da spec. A faixa de contato, igual em toda página, conta como parte
   da moldura, como o botão do cabeçalho.
2. **"Em preparação" no que ainda não existe.** Na prévia, todo link levava a
   alguma página. Aqui, situação, área, resposta ou post sem página aparece
   como texto, marcado "em preparação". Nenhum link leva a página inexistente.
3. **Faixa de prévia** no topo de toda página, dizendo que o texto é exemplo e
   que a página não é indexada. Some no build de produção.
4. **"Revisão pendente"** no lugar de "Revisado em 11/10/2026". Nenhum texto
   foi revisado ainda, e o site não escreve uma data de revisão que não
   aconteceu.
5. **Dados "a confirmar".** CNPJ, razão social, OAB, os dois números sem
   fonte e o canal de WhatsApp aparecem com essa marca na ficha. Os números
   do Início levam "fonte a confirmar".
6. **Botão "Falar pelo WhatsApp"** some da faixa de contato até o número
   estar no `site.config.ts` (decisão nº 9).
7. **Links no meio de um texto** ficam sublinhados e o anel de foco usa o
   `gold-ink`. Os dois para passar na WCAG: a cor sozinha não distinguia o
   link, e o dourado puro não chega aos 3:1 que o foco pede.
8. **O escritório** mostra as nove perguntas frequentes do texto aprovado.

## 4. Decisões para o escritório

1. **Texto do "Quem Somos".** A spec manda usar o texto aprovado sem
   reescrever. A prévia trocou "SD Advogados" pelo nome canônico e os
   travessões por vírgula ou dois-pontos, e essas trocas seguem aqui, também
   nas cinco perguntas que a prévia não mostrava. Nenhuma outra palavra mudou.
   Se o escritório preferir o texto exatamente como está no CRM, a troca é
   simples.
2. **Fotos e logo vetorial.** A foto do herói é a provisória da bio
   (520 × 795 px). O Lighthouse aponta 7,5 KB que sobram no celular, na página
   do escritório; a foto definitiva entra já nos tamanhos certos.
3. **Fatos a confirmar** no `site.config.ts`: razão social, CNPJ, OAB, as
   fontes dos números "10 mil+" e "7 anos" (e a redação certa deste) e o
   WhatsApp.

## 5. O que não foi verificado

- Deploy real no Cloudflare Pages: o projeto ainda não existe. Compressão e
  cache foram medidos no emulador e num servidor local sem compressão; o
  Lighthouse aponta a compressão ausente, que o Cloudflare faz.
- iPhone e Android reais. O celular foi emulado no Chromium.
- Leitor de tela real. A estrutura foi conferida pelo axe e pelo teclado.
- Impressão em papel. A folha foi gerada em PDF.

## 6. Prévia navegável

Enquanto o projeto do Cloudflare Pages não existe, o build foi publicado como
página privada: https://claude.ai/artifact/6LWnxZwCososMhNsXzLTcw. Para caber
no visualizador, a cópia publicada troca os caminhos absolutos por relativos e
renomeia a pasta `/_astro/` para `/astro/`. O visualizador não abre a janela
de impressão, então os botões "Imprimir" não fazem nada ali; a busca não foi
conferida dentro dele. As duas funcionam no build, como mostra o §2.
