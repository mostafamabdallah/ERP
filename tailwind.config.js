/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./contexts/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Light mode
        primary: "#542582",
        background: "#fafafa",
        secondaryBackground: "white",
        tittle: "#161616",
        border: "#e0e0e0",
        gray1: "#6f6f6f",
        gray2: "#c7c7c7",
        danger: "#da1e27",
        success: "#27783f",
        secondary: "#fcd401",
        // Dark mode — Neon Nocturne palette
        surface: "#1c0324",
        "surface-low": "#23062c",
        "surface-mid": "#2b0b34",
        "surface-high": "#32103d",
        "surface-highest": "#3a1646",
        "on-surface": "#fcdbff",
        "on-surface-variant": "#c39fc9",
        "outline-dark": "#5a3d61",
        "primary-dark": "#d09afa",
      },
    },
  },
  plugins: [],
};
