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
        'fluid-h1': 'clamp(3rem, 8vw, 8rem)',
        'fluid-h2': 'clamp(2.5rem, 6vw, 6rem)',
        'fluid-h3': 'clamp(1.5rem, 4vw, 4rem)',
        'fluid-p': 'clamp(0.875rem, 1.5vw, 1.25rem)',
      }
    },
  },
  plugins: [],
}
