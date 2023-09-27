/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/preline/dist/*.js",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0f172a",
      },
    },
  },
  // eslint-disable-next-line no-undef
  plugins: [require("preline/plugin")],
};
