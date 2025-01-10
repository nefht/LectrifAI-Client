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
