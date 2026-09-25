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
        background: '#F8FAFC',
        surface: {
          DEFAULT: '#FFFFFF',
          soft: '#F1F5F9',
          card: '#FFFFFF',
          border: '#E2E8F0',
        },
        slate: {
          950: '#0B0F17',
          900: '#0F172A',
          800: '#1E293B',
          700: '#334155',
          600: '#475569',
          500: '#64748B',
          400: '#94A3B8',
          300: '#CBD5E1',
          200: '#E2E8F0',
          100: '#F1F5F9',
          50: '#F8FAFC',
        },
        primary: {
          DEFAULT: '#2563EB',
          hover: '#1D4ED8',
          light: '#EFF6FF',
          dark: '#1E40AF',
        },
        secondary: {
          DEFAULT: '#0EA5E9',
          hover: '#0284C7',
          light: '#F0F9FF',
        },
        accent: {
          blue: '#2563EB',
          sky: '#0EA5E9',
          emerald: '#16A34A',
          amber: '#D97706',
          rose: '#E11D48',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04)',
        'subtle': '0 2px 8px -2px rgba(15, 23, 42, 0.06)',
      },
      borderRadius: {
        'card': '16px',
        'button': '10px',
      }
    },
  },
  plugins: [],
}
