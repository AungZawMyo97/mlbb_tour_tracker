/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cyber-purple': '#A855F7',
        'cyber-blue': '#3B82F6',
        'cyber-pink': '#EC4899',
        'cyber-cyan': '#06B6D4',
        'mlbb-gold': '#FFD700',
        'mlbb-orange': '#FF6B35',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
