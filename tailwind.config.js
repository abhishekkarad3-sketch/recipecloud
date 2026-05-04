/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
  "./app/**/*.{js,ts,jsx,tsx}",
  "./components/**/*.{js,ts,jsx,tsx}",
  "./src/**/*.{js,ts,jsx,tsx,mdx}"
],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#4CAF50', dark: '#2E7D32', light: '#A5D6A7' },
        accent: '#8BC34A',
        bg: '#F1F8F4',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      animation: {
        'fade-up': 'fadeSlideUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        float: 'float 3s ease-in-out infinite',
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
};
