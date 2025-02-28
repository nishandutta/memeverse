/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        redDark: '#8B0000', // Custom dark red color
        blueDark: '#1E3A8A', // Custom blue for dark mode
        pinkLight: '#F9A8D4', // Custom pink for light mode
      },
    },
  },
  plugins: [],
}
