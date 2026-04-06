/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#d4a853',
        dark: '#1a1a1a',
        gray: {
          100: '#f8f8f8',
          200: '#eeeeee',
          300: '#dddddd',
          400: '#cccccc',
          500: '#999999',
          600: '#666666',
          700: '#333333',
          800: '#222222',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
