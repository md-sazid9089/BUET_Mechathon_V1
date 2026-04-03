/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Space-Tech Color System
        astronaut: {
          950: '#020617',
          900: '#0B0F1A',
          800: '#111827',
          700: '#1A2238',
          600: '#2A3558',
          500: '#3B4563',
        },
        neon: {
          blue: '#3B82F6',
          cyan: '#06B6D4',
          purple: '#8B5CF6',
          pink: '#EC4899',
        },
        status: {
          success: '#22C55E',
          warning: '#F59E0B',
          danger: '#EF4444',
          info: '#3B82F6',
        },
        // Legacy space colors (deprecated in favor of astronaut)
        space: {
          900: '#0B0F1A',
          800: '#111827',
          700: '#1A2238',
          600: '#2A3558',
        },
        debris: {
          danger: '#EF4444',
          warning: '#F59E0B',
          info: '#3B82F6',
          success: '#22C55E',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        // Glow effects
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.3)',
        'glow-blue-lg': '0 0 40px rgba(59, 130, 246, 0.2)',
        'glow-cyan': '0 0 20px rgba(6, 182, 212, 0.3)',
        'glow-purple': '0 0 20px rgba(139, 92, 246, 0.3)',
        'glow-red': '0 0 20px rgba(239, 68, 68, 0.3)',
        // Card shadows
        'card': '0 4px 12px rgba(0, 0, 0, 0.3)',
        'card-lg': '0 8px 24px rgba(0, 0, 0, 0.4)',
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [],
}
