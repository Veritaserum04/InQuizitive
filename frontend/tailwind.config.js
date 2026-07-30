/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        tealPrimary: "#0d9488",
        tealLight: "#99f6e4",
        tealDark: "#115e59",
      },
    },
  },
  plugins: [],
  extend: {
  rotate: {
    'y-180': '180deg',
  },
  transform: ['responsive'],
}

};

