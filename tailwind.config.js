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
        dark: "#080d2b",
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
      backgroundImage: {
        universe: "url('/src/assets/images/home/dark-background.jpg')",
        "blur-gradient":
          "linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.1) 20%, rgba(255,255,255,0.2) 30%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0.7) 75%, white 100%)",
        "lecture-universe": "url('/src/assets/images/lecture-video-generator/universe-lecture.jpg')",
      },
      keyframes: {
        "text-reveal": {
          "0%": {
            transform: "translate(0, 100%)",
          },
          "100%": {
            transform: "translate(0, 0)",
          },
        },
        slidein: {
          from: {
            opacity: "0",
            transform: "translateY(-10px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
      },
      animation: {
        "text-reveal": "text-reveal 1.5s cubic-bezier(0.77, 0, 0.175, 1) 0.5s",
        slidein: "slidein 1s ease 300ms",
        // slidein: "slidein 1s ease var(--slidein-delay, 0) forwards",
        slidein300: "slidein 1s ease 300ms forwards",
        slidein500: "slidein 1s ease 500ms forwards",
        slidein700: "slidein 1s ease 700ms forwards",
      },
    },
  },
  plugins: [flowbite.plugin()],
};
