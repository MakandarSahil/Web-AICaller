import type { Config } from 'tailwindcss'

const config: Omit<Config, 'content'> = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        background: {
          DEFAULT:  '#080f09',
          surface:  '#0d1a0e',
          elevated: '#112013',
          overlay:  '#162815',
        },
        content: {
          DEFAULT:   '#f0fdf4',
          secondary: '#9ca3af',
          tertiary:  '#6b7280',
          inverse:   '#080f09',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      boxShadow: {
        'glow-sm': '0 0 10px rgba(16,185,129,0.15)',
        'glow':    '0 0 20px rgba(16,185,129,0.2)',
        'glow-lg': '0 0 40px rgba(16,185,129,0.25)',
        'glass':   'inset 0 1px 0 rgba(255,255,255,0.06), 0 4px 24px rgba(0,0,0,0.4)',
        'glass-lg':'inset 0 1px 0 rgba(255,255,255,0.08), 0 8px 40px rgba(0,0,0,0.5)',
      },
      keyframes: {
        'fade-in': {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-up': {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'glow-pulse': {
          '0%,100%': { boxShadow: '0 0 20px rgba(16,185,129,0.2)' },
          '50%':     { boxShadow: '0 0 40px rgba(16,185,129,0.4)' },
        },
        'float': {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%':     { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        'fade-in':    'fade-in 0.4s ease-out forwards',
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'float':      'float 4s ease-in-out infinite',
      },
      screens: {
        xs: '475px',
      },
    },
  },
  plugins: [],
}

export default config
