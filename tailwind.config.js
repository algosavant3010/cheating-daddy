/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark': {
          50: '#f5f5f5',
          100: '#e5e5e7',
          200: '#d1d1d6',
          300: '#a1a1a6',
          400: '#767680',
          500: '#515156',
          600: '#424246',
          700: '#313135',
          800: '#1c1c1f',
          900: '#0a0a0a',
        },
      },
      backgroundColor: {
        'overlay': 'rgba(0, 0, 0, 0.8)',
        'overlay-light': 'rgba(0, 0, 0, 0.5)',
      },
      borderColor: {
        'dim': 'rgba(255, 255, 255, 0.2)',
      },
      textColor: {
        'muted': 'rgba(255, 255, 255, 0.6)',
        'secondary': 'rgba(255, 255, 255, 0.7)',
      },
    },
  },
  plugins: [],
}
