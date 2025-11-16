/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    // lichen
    "bg-lichen-100",
    "bg-lichen-500",
    "text-moss-500",
    // sun
    "bg-sun-100",
    "bg-sun-500",
    "text-sun-900",
    // nectar
    "bg-nectar-100",
    "bg-nectar-300",
    "text-nectar-900",
    // iris
    "bg-iris-100",
    "bg-iris-500",
    "text-iris-900",
    // any borders you use
    "border-moss-500",
    "border-sun-900",
    "border-nectar-900",
    "border-iris-900",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Modern Era', 'system-ui', '-apple-system', 'sans-serif'],
        mori: ['PP Mori', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        lichen: {
          "100": "#F4FCE9",
          "500": "#CDF3A3",
        },
        moss: {
          "100": "#F2FBF8",
          "500": "#1F504A",
          "900": "#0C2725",
        },
        sand: "#FBF9F6",
        
        nectar: {
          "100": "#FDF5F3",
          "300": "#FFAA99",
          "500": "#EF7E5F",
          "900": "#933A21"
        },
        moon: {
          "300": "#ECEDED",
        },
        iris: {
          "100": "#F5F4FE",
          "500": "#9F93F2",
          "900": "#4D2CAB"
        },
        sun: {
          "100": "#FDFBE9",
          "500": "#F9EE8F",
          "900": "#725F00"
        }
      }
    },
  },
  plugins: [
    function ({ addVariant }) {
      addVariant("child", "& > *");
      addVariant("child-hover", "& > *:hover");
    },
  ],
}
