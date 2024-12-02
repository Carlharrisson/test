/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        white: "#FFFFFF",
        "light-gray": "#E5E5E5",
        "mid-gray": "#808080",
        charcoal: "#363636",
        black: "#000000",
        "warm-light": "#F5F4F1",
        "warm-shadow": "#4A4846",
      },
      fontFamily: {
        space: ['"Space Grotesk"', "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
    },
  },
};
