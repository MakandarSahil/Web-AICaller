import type { Config } from 'tailwindcss'
import sharedConfig from '@aicaller/config/tailwind'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  presets: [sharedConfig],
  plugins: [require('tailwindcss-animate')],
}

export default config