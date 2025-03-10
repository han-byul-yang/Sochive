/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "tab-inactive": "#B7B7B7",
        "tab-active": "#A888B5",
        key: "#3D3D3D",
        font: "#1E201E",
        bg: "#fcfcfc",
      },
      fontFamily: {
        sans: ["Delius-Swash-Caps", "sans-serif"],
        dohyeon: ["DoHyeon", "sans-serif"],
        gaegu: ["Gaegu", "sans-serif"],
        lora: ["Lora", "sans-serif"],
        noto: ["Noto-Serif", "sans-serif"],
        "noto-bold": ["Noto-Serif-Bold", "sans-serif"],
      },
    },
  },
  plugins: [],
};
