/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Sora', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        forest: {
          50: '#f3f9f4',
          100: '#e0f1e4',
          200: '#c2e3ca',
          300: '#94cea3',
          400: '#5fae74',
          500: '#3c8f53',
          600: '#2c7240',
          700: '#245b35',
          800: '#1f482c',
          900: '#1a3c26',
          950: '#0c2113',
        },
        teal: {
          50: '#f0fbfa',
          100: '#d7f5f1',
          200: '#b0eae5',
          300: '#7dd9d3',
          400: '#46bfb9',
          500: '#28a39f',
          600: '#1d8380',
          700: '#1a6867',
          800: '#195454',
          900: '#184645',
        },
        sand: {
          50: '#faf8f3',
          100: '#f3eee0',
          200: '#e7dcc2',
          300: '#d8c49d',
          400: '#c9ab74',
        },
      },
      boxShadow: {
        soft: '0 2px 8px -2px rgba(16, 64, 36, 0.08), 0 8px 24px -8px rgba(16, 64, 36, 0.12)',
        card: '0 1px 3px rgba(16, 64, 36, 0.06), 0 12px 32px -12px rgba(16, 64, 36, 0.18)',
        glow: '0 0 0 3px rgba(60, 143, 83, 0.18)',
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.9)', opacity: '0.7' },
          '100%': { transform: 'scale(1.6)', opacity: '0' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in': 'fade-in 0.5s ease-out both',
        'scale-in': 'scale-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) both',
        'float': 'float 6s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 1.6s ease-out infinite',
        'shimmer': 'shimmer 1.6s linear infinite',
      },
    },
  },
  plugins: [],
};
