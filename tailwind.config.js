/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gfit: {
          orange: '#FF8A00',
          orangeHover: '#FFA02E',
          glow: 'rgba(255, 138, 0, 0.45)',
          bgStart: '#1C1836',
          bgMid: '#0E0C1B',
          bgEnd: '#08070F',
          card: '#181528',
        },
        macro: {
          protein: '#22C55E',
          proteinAlt: '#FACC15',
          carbs: '#818CF8',
          fat: '#FB923C',
        }
      }
    },
  },
  plugins: [],
}
