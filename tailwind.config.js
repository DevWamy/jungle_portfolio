// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 10px 3px rgba(147,197,253,0.5)' },
          '50%': { boxShadow: '0 0 15px 6px rgba(147,197,253,0.9)' },
        },
      },
      animation: {
        pulseGlow: 'pulseGlow 2s ease-in-out infinite',
      },
      backgroundImage: {
    day: 'linear-gradient(to bottom, #87ceeb, #fef6e4)',     // bleu ciel → jaune clair
    night: 'linear-gradient(to bottom, #0f172a, #1e293b)',   // bleu nuit → gris sombre
  },
    },
  },
  plugins: [],
}
