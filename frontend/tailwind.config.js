/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        garuda: {
          dark: '#0B0F19',
          card: '#131B2E',
          border: '#1E293B',
          primary: '#2563EB',
          accent: '#06B6D4',
          emerald: '#10B981',
          danger: '#EF4444',
          warning: '#F59E0B'
        }
      }
    },
  },
  plugins: [],
}
