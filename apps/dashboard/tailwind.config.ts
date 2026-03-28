import type { Config } from 'tailwindcss'
import sharedConfig from '@aicaller/config/tailwind'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  presets: [sharedConfig],
  plugins: [require('tailwindcss-animate')],
}

export default config