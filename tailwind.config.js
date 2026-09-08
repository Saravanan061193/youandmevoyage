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
        background: '#0e0c0a',
        foreground: '#f5f0eb',
        primary: {
          DEFAULT: '#d4a373',
          foreground: '#0e0c0a',
          hover: '#c68b59',
          light: '#e7c590',
        },
        card: {
          DEFAULT: 'rgba(28, 25, 23, 0.75)',
          border: 'rgba(212, 163, 115, 0.15)',
        },
        safari: {
          dark: '#12100e',
          card: '#1a1715',
          gold: '#d4a373',
          sand: '#faedcd',
          amber: '#c68b59',
          muted: '#a89f91',
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #d4a373 0%, #c68b59 100%)',
        'hero-gradient': 'linear-gradient(to bottom, rgba(14,12,10,0.4) 0%, rgba(14,12,10,0.85) 100%)',
      }
    },
  },
  plugins: [],
};
