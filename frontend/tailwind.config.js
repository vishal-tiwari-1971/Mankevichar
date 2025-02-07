/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: { fontFamily: {
      sans: ['Inter', 'Arial', 'sans-serif'],
      serif: ['Georgia', 'Cambria', 'serif'],
      mono: ['Courier New', 'monospace'],
    }},
  },
  darkMode: "class",
  plugins:[require('daisyui'),],
}

