/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue, js, ts, jsx, tsx}"],
  theme: {
    extend: {
      colors: {
        "pomogoat-primary": "#F32529",
        "pomogoat-secondary": '#003228'
      }
    },
    fontFamily: {
      Jost: ["Jost, sans-serif"]
    },
    container: {
      padding: "2rem",
      center: true
    }
  },
  plugins: [],
}
