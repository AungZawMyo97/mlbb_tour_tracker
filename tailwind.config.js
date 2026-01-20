/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "esports-cyan": "#00BCD4",
        "esports-gold": "#D4AF37",
        "esports-magenta": "#FF006E",
        "esports-blue": "#0080FF",
        "esports-lime": "#39FF14",
        "esports-orange": "#FF8C42",
        "esports-purple": "#B100FF",
        "bg-dark": "#0a0e17",
        "bg-card": "#131a2a",
        "bg-header": "#0f1420",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
