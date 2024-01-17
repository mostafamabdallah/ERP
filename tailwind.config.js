/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#542582",
        background: "#fafafa",
        secondaryBackground: "white",
        tittle: "#161616",
        border: "##e0e0e0",
        gray1: "#6f6f6f",
        gray2: "#c7c7c7",
        danger: "#da1e27",
        success: "#27783f",
      },
    },
  },
  plugins: [],
};
