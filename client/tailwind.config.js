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
        background: '#0B0F17',
        surface: '#131A29',
        'surface-card': '#1A2337',
        'surface-border': '#25334D',
        primary: {
          DEFAULT: '#38BDF8',
          hover: '#0EA5E9',
          glow: 'rgba(56, 189, 248, 0.25)'
        },
        accent: {
          coral: '#FB7185',
          emerald: '#34D399',
          amber: '#FBBF24',
          violet: '#A78BFA'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-primary': '0 0 25px -5px rgba(56, 189, 248, 0.3)',
        'glow-emerald': '0 0 25px -5px rgba(52, 211, 153, 0.3)',
        'glow-coral': '0 0 25px -5px rgba(251, 113, 133, 0.3)'
      }
    },
  },
  plugins: [],
}
