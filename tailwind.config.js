module.exports = {
  purge: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
};
