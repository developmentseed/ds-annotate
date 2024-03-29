module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        "dark": "#081a51",
        "light-white": "rbga(255,255,255,0.18)",
        "orange-ds": "#CF3F02",
      },
      fontSize: {
        'xxs': '0.625rem',
      },
      fontFamily: {
        sans: ['Open Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}