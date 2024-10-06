/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        primary: '#00337C',
        secondary: '#03C988',
        alternate: '#1C82AD',

        'primary-dark': '#002a63',
        'secondary-dark': '#02a76b',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '2%': { transform: 'rotate(-1deg)' },
          '3.5%': { transform: 'rotate(3deg)' },
          '5%': { transform: 'rotate(0deg)' },
        },
      },
      animation: {
        wiggle: 'wiggle 6.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
