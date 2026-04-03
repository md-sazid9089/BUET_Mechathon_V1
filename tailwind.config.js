/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          900: '#0a0e27',
          800: '#0f1a3e',
          700: '#141f55',
          600: '#1a2568',
        },
        debris: {
          danger: '#ef4444',
          warning: '#f59e0b',
          info: '#3b82f6',
          success: '#10b981',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
