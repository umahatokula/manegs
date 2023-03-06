/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'vote': {
          50: '#eceffc',
          100: '#c9cce8',
          200: '#a5a8d7',
          300: '#8286c7',
          400: '#5f5fb7',
          500: '#47459d',
          600: '#3a367a',
          700: '#2b2658',
          800: '#1a1736',
          900: '#080716',
        }
      }
    },
  },
  plugins: [],
}
