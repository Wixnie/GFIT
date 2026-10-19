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
          dark: '#0B101B',
          card: '#141C2E',
          border: '#1E293B',
          accent: '#F59E0B',
        }
      }
    },
  },
  plugins: [],
}
