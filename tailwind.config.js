/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        'fluid-h1': 'clamp(2.5rem, 5vw + 1rem, 5rem)',
        'fluid-h2': 'clamp(2rem, 4vw + 1rem, 4.5rem)',
        'fluid-h3': 'clamp(1.5rem, 3vw + 1rem, 2.5rem)',
        'fluid-p': 'clamp(0.875rem, 1.5vw + 0.5rem, 1.125rem)',
      }
    },
  },
  plugins: [],
}
