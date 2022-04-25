module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        '4xl': '4.5rem'
      },
      animation: {
        spinner: 'spin 6s ease-out infinite alternate',
        wiggle: 'wiggle 1s ease-in-out infinite',
        scan: 'scan 1s ease-in-out infinite alternate',
      },
      keyframes: {
        scan: {
          '0%': { top: '-50%', bottom: 'auto' },
          '100%': { top: '110%', bottom: 'auto' },
        },
        // wiggle: {
        //   '0%, 100%': { transform: 'rotate(-3deg)' },
        //   '50%': { transform: 'rotate(3deg)' },
        // },
      }
    },
  },
  plugins: [],
}
