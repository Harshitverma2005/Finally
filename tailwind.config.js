/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0ea5e9",
        dark: "#0b1220"
      },
      boxShadow: {
        soft: "0 10px 30px -10px rgba(0,0,0,.2)"
      }
    }
  },
  plugins: []
}