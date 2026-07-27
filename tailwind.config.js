/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        sans: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      colors: {
        emerald: {
          25: '#f2fbf7',
          50: '#e9faf1',
          100: '#cff3df',
          150: '#b7ecce',
          200: '#8fe0b7',
          300: '#5fce9b',
          400: '#33ba81',
          500: '#18a06a',
          600: '#0f8557',
          700: '#0c6a46',
          800: '#0a5238',
          900: '#083f2c'
        },
        graphite: {
          50: '#f5f6f7',
          100: '#e8eaec',
          200: '#c9ced3',
          300: '#a0a8b0',
          400: '#727d87',
          500: '#525c66',
          600: '#3d454d',
          700: '#2c3238',
          800: '#1c2024',
          900: '#101316',
          950: '#0a0c0e'
        }
      },
      backgroundImage: {
        'mesh-light': 'radial-gradient(at 0% 0%, rgba(24,160,106,0.12) 0px, transparent 50%), radial-gradient(at 98% 10%, rgba(51,186,129,0.10) 0px, transparent 50%), radial-gradient(at 50% 100%, rgba(15,133,87,0.08) 0px, transparent 50%)',
        'mesh-dark': 'radial-gradient(at 0% 0%, rgba(24,160,106,0.18) 0px, transparent 50%), radial-gradient(at 98% 10%, rgba(51,186,129,0.12) 0px, transparent 50%), radial-gradient(at 50% 100%, rgba(10,82,56,0.25) 0px, transparent 50%)'
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(16, 19, 22, 0.08)',
        'glass-lg': '0 20px 60px -10px rgba(16, 19, 22, 0.18)',
        glow: '0 0 0 1px rgba(24,160,106,0.15), 0 8px 24px -4px rgba(24,160,106,0.25)'
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem'
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' }
        },
        floaty: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' }
        }
      },
      animation: {
        shimmer: 'shimmer 2s infinite linear',
        floaty: 'floaty 6s ease-in-out infinite'
      }
    }
  },
  plugins: []
}
