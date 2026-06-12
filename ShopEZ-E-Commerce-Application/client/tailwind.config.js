/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17231d",
        cream: "#f6f1e7",
        forest: "#1f4d3b",
        moss: "#46735e",
        coral: "#ed775f"
      },
      fontFamily: {
        display: ["Georgia", "serif"],
        sans: ["Inter", "ui-sans-serif", "system-ui"]
      },
      boxShadow: {
        soft: "0 18px 50px rgba(31, 77, 59, 0.12)"
      }
    }
  },
  plugins: []
};
