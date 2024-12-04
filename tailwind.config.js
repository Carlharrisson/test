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
      backgroundImage: {
        "topo-grid": `radial-gradient(circle at 1px 1px, #E5E5E5 1px, transparent 0)`,
      },
      backgroundSize: {
        "grid-8": "8px 8px",
      },
      animation: {
        "grid-float": "gridFloat 20s linear infinite",
      },
      keyframes: {
        gridFloat: {
          "0%, 100%": { backgroundPosition: "0 0" },
          "50%": { backgroundPosition: "4px 4px" },
        },
      },
    },
  },
  plugins: [],
};
