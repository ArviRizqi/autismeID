import type { Config } from 'tailwindcss'

/**
 * Semua warna menunjuk ke CSS variable di src/styles/theme.css,
 * sehingga "mode tenang" cukup mengganti nilai variable, bukan class.
 */
const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: 'var(--color-primary)', deep: 'var(--color-primary-deep)' },
        accent: 'var(--color-accent)',
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        tint: 'var(--color-tint)',
        ink: {
          DEFAULT: 'var(--color-text)',
          2: 'var(--color-text-2)',
          3: 'var(--color-text-3)',
        },
        'on-deep': 'var(--color-on-deep-muted)',
        line: {
          DEFAULT: 'var(--color-border)',
          soft: 'var(--color-border-soft)',
          dashed: 'var(--color-border-dashed)',
          input: 'var(--color-border-input)',
          footer: 'var(--color-footer-line)',
        },
        ok: { bg: 'var(--status-ok-bg)', text: 'var(--status-ok-text)' },
        warn: { bg: 'var(--status-warn-bg)', text: 'var(--status-warn-text)' },
        danger: { bg: 'var(--status-danger-bg)', text: 'var(--status-danger-text)' },
        neutral: { bg: 'var(--status-neutral-bg)', text: 'var(--status-neutral-text)' },
        emergency: { bg: 'var(--status-emergency-bg)', border: 'var(--status-emergency-border)' },
        notice: { bg: 'var(--status-notice-bg)', border: 'var(--status-notice-border)' },
        risk: { low: 'var(--risk-low)', mid: 'var(--risk-mid)', high: 'var(--risk-high)' },
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'Times New Roman', 'serif'],
        body: ['"Public Sans"', 'system-ui', '-apple-system', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      // Satuan rem supaya ikut membesar saat pengguna memilih A+ / A++
      fontSize: {
        hero: ['clamp(2.25rem, 5vw, 3.625rem)', { lineHeight: '1.08', letterSpacing: '-0.02em' }],
        h1: ['clamp(2rem, 4.5vw, 3rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        h2: ['clamp(1.75rem, 3.4vw, 2.5rem)', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
        h3: ['1.375rem', { lineHeight: '1.25' }],
        h4: ['1.25rem', { lineHeight: '1.25' }],
        lead: ['1.1875rem', { lineHeight: '1.6' }],
        body: ['1.0625rem', { lineHeight: '1.6' }],
        small: ['0.9375rem', { lineHeight: '1.55' }],
        caption: ['0.875rem', { lineHeight: '1.5' }],
        stat: ['3rem', { lineHeight: '1.1' }],
      },
      spacing: {
        gutter: 'clamp(1rem, 4vw, 2rem)',
        section: '5rem',
        touch: '2.75rem',
      },
      minHeight: { touch: '2.75rem', field: '3.25rem' },
      minWidth: { touch: '2.75rem' },
      maxWidth: { site: '75rem', reading: '45rem' },
      borderRadius: {
        sm: '0.625rem',
        md: '0.75rem',
        lg: '1rem',
        xl: '1.25rem',
      },
    },
  },
  plugins: [],
}

export default config
