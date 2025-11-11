/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lichen: {
          "100": "#F4FCE9",
          "500": "#CDF3A3",
        },
        moss: {
          "900": "#0C2725",
          "100": "#F2FBF8",
          "500": "#1F504A",
          "900": "#000000"
          
        },
        sand: "#FBF9F6",
        
        nectar: {
          "300": "#FFAA99",
          "500": "#EF7E5F",
        },
        moon: {
          "300": "#ECEDED",
        },
        iris: {
          "500": "#9F93F2",
        },
        sun: {
          "500": "#F9EE8F",
        }
      }
    },
  },
  plugins: [],
}
