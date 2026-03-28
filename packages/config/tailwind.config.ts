import type { Config } from 'tailwindcss'

const config: Omit<Config, 'content'> = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#3655E8',
          light: '#5b7cf7',
          dark: '#2a45c9',
          50: '#eef1fd',
          100: '#dce3fb',
          200: '#b9c7f7',
          400: '#4b6beb',
          500: '#3655E8',
          600: '#2a45c9',
          700: '#1f35aa',
        },

        background: {
          DEFAULT: '#ffffff',
          subtle: '#f8f9fb',
          muted: '#f0f2f5',
        },

        content: {
          DEFAULT: '#1e1e1e',
          secondary: '#4b5563',
          tertiary: '#9ca3af',
          inverse: '#ffffff',
        },

        border: '#e8eaef',
      },

      fontFamily: {
        sans: ['var(--font-sans)', 'Inter', 'system-ui', 'sans-serif'],
      },

      boxShadow: {
        soft: '0 1px 3px rgba(0,0,0,0.04)',
        md: '0 4px 12px rgba(0,0,0,0.06)',
        lg: '0 20px 60px rgba(0,0,0,0.1)',
        'card': '0 1px 3px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 16px rgba(0,0,0,0.08)',
        'blue-glow': '0 4px 14px rgba(54, 85, 232, 0.25)',
      },

      backgroundImage: {
        'hero-gradient':
          'linear-gradient(135deg, #f8f9fb 0%, #ffffff 100%)',
      },

      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },

      animation: {
        'fade-up': 'fade-up 0.6s ease-out forwards',
      },

      screens: {
        xs: '475px',
      },
    },
  },
  plugins: [],
}

export default config