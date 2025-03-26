import { light } from "@cloudinary/url-gen/qualifiers/fontWeight";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#F8AF24",
        background: "#F5F5F5",
        "bg-dark": "#F5F5F5",
        "border-lgiht": "#ccc",
        dark: {
          100: "#000000",
          200: "#2b2b2b",
          300: "#353535",
          400: "#494949",
          500: "#747474",
          600: "#9b9b9b",
          700: "#b2b2b2",
          800: "#cccccc",
          900: "#e6e6e6",
          1000: "#ffffff",
        },
        light: {
          100: "#ffffff",
          200: "#e6e6e6",
          300: "#cccccc",
          400: "#b2b2b2",
          500: "#9b9b9b",
          600: "#747474",
          700: "#494949",
          800: "#353535",
          900: "#2b2b2b",
          1000: "#000000",
        },
        "border-dark": "#353535",
        "text-white": "#fffff",
        "text-black": "#00000",
      },
      fontFamily: {
        jersey15: ['"Jersey 15"', "sans-serif"],
        jersey25: ['"Jersey 25"', "sans-serif"],
        kanit: ['"Kanit"', "sans-serif"],
        montserrat: ['"Montserrat"', "sans-serif"],
        nunito: ['"Nunito"', "sans-serif"],
      },
      screens: {
        pc: { min: "1025px" },
        tl: { max: "1024px", min: "641px" },
        mb: { max: "640px" },
      },
    },
  },
  plugins: [],
};
