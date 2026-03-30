import type { Config } from 'tailwindcss'

const config: Omit<Config, 'content'> = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Semantic colors using CSS variables from globals.css
        background: 'hsl(var(--background) / <alpha-value>)',
        foreground: 'hsl(var(--foreground) / <alpha-value>)',
        card: 'hsl(var(--card) / <alpha-value>)',
        'card-foreground': 'hsl(var(--card-foreground) / <alpha-value>)',
        popover: 'hsl(var(--popover) / <alpha-value>)',
        'popover-foreground': 'hsl(var(--popover-foreground) / <alpha-value>)',
        primary: 'hsl(var(--primary) / <alpha-value>)',
        'primary-foreground': 'hsl(var(--primary-foreground) / <alpha-value>)',
        secondary: 'hsl(var(--secondary) / <alpha-value>)',
        'secondary-foreground': 'hsl(var(--secondary-foreground) / <alpha-value>)',
        muted: 'hsl(var(--muted) / <alpha-value>)',
        'muted-foreground': 'hsl(var(--muted-foreground) / <alpha-value>)',
        accent: 'hsl(var(--accent) / <alpha-value>)',
        'accent-foreground': 'hsl(var(--accent-foreground) / <alpha-value>)',
        destructive: 'hsl(var(--destructive) / <alpha-value>)',
        'destructive-foreground': 'hsl(var(--destructive-foreground) / <alpha-value>)',
        border: 'hsl(var(--border) / <alpha-value>)',
        input: 'hsl(var(--input) / <alpha-value>)',
        ring: 'hsl(var(--ring) / <alpha-value>)',

        // Brand colors
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

        // Sidebar colors
        sidebar: 'hsl(var(--sidebar-bg) / <alpha-value>)',
        'sidebar-foreground': 'hsl(var(--sidebar-foreground) / <alpha-value>)',
        'sidebar-border': 'hsl(var(--sidebar-border) / <alpha-value>)',
        'sidebar-active-bg': 'hsl(var(--sidebar-active-bg) / <alpha-value>)',
      },

      fontFamily: {
        sans: ['var(--font-sans)', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Playfair Display', 'serif'],
      },

      boxShadow: {
        soft: '0 1px 3px rgba(0,0,0,0.04)',
        md: '0 4px 12px rgba(0,0,0,0.06)',
        lg: '0 20px 60px rgba(0,0,0,0.1)',
        'card': '0 1px 3px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 16px rgba(0,0,0,0.08)',
        'blue-glow': '0 4px 14px rgba(54, 85, 232, 0.25)',
        'glass': '0 8px 32px rgba(31, 34, 42, 0.12)',
        'glass-lg': '0 20px 60px rgba(31, 34, 42, 0.15)',
      },

      backgroundImage: {
        'hero-gradient':
          'linear-gradient(135deg, #f8f9fb 0%, #ffffff 100%)',
      },

      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.25, 1, 0.5, 1)',
      },
      transitionDuration: {
        '900': '900ms',
        '1100': '1100ms',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
      },

      animation: {
        'fade-up': 'fade-up 0.6s ease-out forwards',
        float: 'float 6s ease-in-out infinite',
      },

      screens: {
        xs: '475px',
      },
    },
  },
  plugins: [],
}

export default config