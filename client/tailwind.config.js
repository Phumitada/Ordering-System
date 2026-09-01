/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#A4161A',
          hover: '#B71C1C',
          light: '#FFEBEE',
        },
        secondary: {
          DEFAULT: '#FBC02D',
          hover: '#F9A825',
          light: '#FFFDE7',
        },
        dark: '#374151',
      },
      fontFamily: {
        sans: ['Prompt', 'sans-serif'],
        heading: ['Kanit', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
