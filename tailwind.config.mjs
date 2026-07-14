/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-brand-primary)',
        secondary: 'var(--color-brand-secondary)',
        accent: 'var(--color-accent)',
        'accent-soft': 'var(--color-accent-soft)',
        canvas: 'var(--color-bg-canvas)',
        subtle: 'var(--color-bg-subtle)',
        surface: 'var(--color-bg-surface)',
        ink: 'var(--color-bg-inverse)',
        inverse: 'var(--color-text-inverse)',
        muted: 'var(--color-text-muted)',
        default: 'var(--color-border-default)',
        strong: 'var(--color-border-strong)',
        link: 'var(--color-link)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        error: 'var(--color-error)',
        disabled: 'var(--color-disabled)',
      },
      fontFamily: {
        brand: ['"Playfair Display"', 'Georgia', 'serif'],
        heading: ['"Yu Mincho"', '"Hiragino Mincho ProN"', '"Noto Serif JP"', 'Georgia', 'serif'],
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', '"Hiragino Sans"', '"Yu Gothic"', 'Meiryo', 'sans-serif'],
      },
      fontSize: {
        h1: ['clamp(3rem, 8vw, 5.5rem)', { lineHeight: '0.98' }],
        h2: ['clamp(2rem, 4vw, 3.5rem)', { lineHeight: '1.2' }],
        h3: ['clamp(1.375rem, 2vw, 1.75rem)', { lineHeight: '1.3' }],
      },
      maxWidth: {
        content: 'var(--content-width)',
        narrow: 'var(--content-width-narrow)',
        wide: 'var(--content-width-wide)',
      },
      spacing: {
        gutter: 'clamp(1.25rem, 4vw, 2.5rem)',
        section: 'var(--section-space)',
        18: '4.5rem',
      },
      borderRadius: {
        sm: '.25rem',
        md: '.5rem',
        lg: '.75rem',
      },
      boxShadow: {
        sm: '0 1px 2px rgb(30 15 7 / 0.08)',
        md: '0 12px 32px rgb(30 15 7 / 0.12)',
      },
      letterSpacing: {
        label: '.12em',
      },
      transitionDuration: {
        fast: 'var(--motion-fast)',
        base: 'var(--motion-base)',
        slow: 'var(--motion-slow)',
      },
      transitionTimingFunction: {
        standard: 'var(--ease-standard)',
      },
    },
  },
  plugins: [],
};
