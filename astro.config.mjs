// Site público da Sales Dourado Advogados (spec v2, §9.1).
// Saída estática: ler não exige JavaScript (P6). Cada rota vira uma pasta com
// index.html, e toda URL termina em barra, como no mapa do site (§2.2).
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://salesdouradoadvogados.com.br',
  output: 'static',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  integrations: [mdx()],
});
