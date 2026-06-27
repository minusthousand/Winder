/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        jakarta: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        brand: {
          orange: '#FF7854',
          pink: '#FD267A',
          deep: '#C9268E',
        },
      },
      keyframes: {
        mwPop: {
          '0%': { transform: 'scale(.7)', opacity: '0' },
          '55%': { transform: 'scale(1.06)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        mwSheet: {
          from: { transform: 'translateY(100%)' },
          to: { transform: 'translateY(0)' },
        },
        mwHeartBurst: {
          '0%': { transform: 'scale(0) rotate(-25deg)', opacity: '0' },
          '50%': { transform: 'scale(1.25) rotate(8deg)' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
        mwFade: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
      animation: {
        mwPop: 'mwPop .5s forwards',
        mwSheet: 'mwSheet .32s cubic-bezier(.2,.8,.25,1)',
        mwFade: 'mwFade .22s',
        mwHeartBurst: 'mwHeartBurst .7s forwards',
      },
    },
  },
  plugins: [],
};
