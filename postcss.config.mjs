// Tailwind 3.4 entra por PostCSS direto: a integração oficial do Tailwind 3
// (@astrojs/tailwind) não aceita o Astro 7 (D10 do relatório da Sessão 0).
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
