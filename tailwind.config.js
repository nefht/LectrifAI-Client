const flowbite = require("flowbite-react/tailwind");

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}", flowbite.content()],
  darkMode: "selector",
  theme: {
    extend: {
      fontFamily: {
        magehand: ["Magehand"],
        degular: ["Degular", "sans-serif"],
      },
      fontSize: {
        ssm: "14px",
        sm: "15px",
      },
      colors: {
        primary: "#6E52EE",
        header: "#F2EDFF",
        background: "#E5DBFF",
        norm: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
          950: "#172554",
        },
      },
      maxWidth: {
        header: "95%",
      },
      maxHeight: {
        "full-screen": "calc(100vh - 4rem)",
      },
      height: {
        "full-screen": "calc(100vh - 4rem)",
      },
    },
  },
  plugins: [flowbite.plugin()],
};
