# Prévia v2 do site público

Fonte da prévia de alta fidelidade publicada em 11/10/2026 no canvas
<https://claude.ai/artifact/RawRVHps5SxpiXeVtFQ7sx>. **Não é o site**: é o
material de referência (tokens, tipografia, moldes e textos) para a Sessão 1,
que constrói o site de verdade em Astro.

## O que tem aqui

- `parts/site.css`: a folha de estilo única da prévia. Tokens do portal
  (navy, dourado, marfim, areia), Playfair Display + Inter (decisão nº 6,
  opção A), escala tipográfica, componentes e os pontos de quebra por
  container query (1080, 860 e 480 px).
- `parts/header.html` e `parts/footer.html`: cabeçalho e rodapé comuns,
  com a faixa de contato.
- `parts/inicio.html`, `area.html`, `escritorio.html`, `situacao.html`,
  `resposta.html`: as cinco páginas. O texto do escritório é o aprovado em
  18/07/2026 (`QuemSomos.tsx` do CRM); os textos de situação e resposta são
  exemplos sem revisão do advogado.
- `build.py`: monta os artboards do canvas (`project/*.dc.html` +
  `canvas.json`) e as cópias locais (`local/*.html`) a partir das mesmas
  partes. `qa.js` renderiza as cópias locais no Chromium, mede alturas e
  estouro horizontal e confere as fontes.
- `assets.json`: os três uploads do canvas (foto, monograma, logo branca).
  `qa/heights.json`: as alturas medidas, que viram o tamanho das pranchas.

## Para reconstruir

1. Fontes: `npm pack @fontsource-variable/playfair-display@5.3.0
   @fontsource-variable/inter@5.3.0` e copiar os quatro `latin-wght-*.woff2`
   para `fonts/`.
2. Imagens em `local/assets/`: `leilson-520.webp` (blob
   `51ff7100…` do histórico do CRM, commit `70e861d`), `logo-v-dourada.png` e
   `logo-h-branca.png` (reduções de `design/identidade-visual/` do CRM).
3. `python3 build.py local` e `node qa.js local qa`.
4. `python3 build.py canvas assets.json qa/heights.json` gera `project/`.

## Provisório nesta prévia

Foto (a atual do CRM), logo (PNG), números (os da página atual, a confirmar
na ficha), endereço e horário (fora, vão para a ficha).
