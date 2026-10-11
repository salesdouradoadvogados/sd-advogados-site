// Tokens portados do portal (sd-advogados-portal-cliente@f05cb6e,
// tailwind.config.ts), como pede o §4 da spec. Só o que o site usa: sem
// sidebar, sem gráficos, sem tema escuro (o site segue o lado da cliente, que
// é sempre claro). As duas adições do site, `ink-secondary` e `gold-ink`, estão
// explicadas em src/styles/global.css e no §4.8 da spec.
import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,ts,md,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'Times New Roman', 'serif'],
      },
      colors: {
        border: 'hsl(var(--border))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        gold: {
          DEFAULT: 'hsl(var(--gold))',
          light: 'hsl(var(--gold-light))',
          dark: 'hsl(var(--gold-dark))',
          ink: 'hsl(var(--gold-ink))',
        },
        navy: {
          DEFAULT: 'hsl(var(--navy))',
          light: 'hsl(var(--navy-light))',
          dark: 'hsl(var(--navy-dark))',
          ink: 'hsl(var(--navy-ink))',
        },
        ivory: 'hsl(var(--ivory))',
        sand: 'hsl(var(--sand))',
        ink: {
          secondary: 'hsl(var(--ink-secondary))',
        },
      },
      maxWidth: {
        site: '76rem',
      },
    },
  },
  plugins: [typography],
};
