/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#FFFFFF',
        foreground: '#0F172A',
        primary: {
          DEFAULT: '#F97316',
          foreground: '#FFFFFF',
          hover: '#EA580C',
          light: '#FFF7ED',
        },
        card: {
          DEFAULT: '#FFFFFF',
          border: '#E2E8F0',
        },
        safari: {
          dark: '#0F172A',
          card: '#FFFFFF',
          gold: '#F97316',
          sand: '#FFF7ED',
          amber: '#F97316',
          muted: '#475569',
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
        'hero-gradient': 'linear-gradient(to bottom, rgba(15,23,42,0.4) 0%, rgba(15,23,42,0.85) 100%)',
      }
    },
  },
  plugins: [],
};
