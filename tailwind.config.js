/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'brand-bg': '#0F0C1A',
        'brand-card': '#161326',
        'brand-purple': '#7C3AED',
        'brand-indigo': '#4F46E5',
        'brand-orange': '#FF8A00'
      }
    }
  },
  plugins: []
};
