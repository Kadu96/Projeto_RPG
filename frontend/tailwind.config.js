// tailwind.config.js
export default {
  content: [
    "./index.html", 
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'rpg-dark': '#0f172a',
        mistic: {
          light: '#a78bfa', // violet-400
          DEFAULT: '#8b5cf6', // violet-500
          dark: '#6d28d9', // violet-700
        },
        'vida': '#dc2626',
        'mana': '#2563eb',
        'vigor': '#16a34a',
      },
      fontFamily: {
        'rpg': ['Inter', 'sans-serif'], // Ou uma fonte medieval que você goste
      }
    },
  },
  plugins: [],
}