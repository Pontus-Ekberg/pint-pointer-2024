/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      sm: "320px",
      // => @media (min-width: 640px) { ... }

      md: "768px",
      // => @media (min-width: 768px) { ... }

      lg: "1024px",
      // => @media (min-width: 1024px) { ... }
    },
    extend: {
      zIndex: {
        60: "60",
      },
      fontFamily: {
        barrio: ["Barrio", "sans-serif"],
        rock: ["'Rock 3D'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
