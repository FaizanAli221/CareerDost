/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F6F5F1',
        ink: '#1B1B17',
        inksoft: '#5B5B54',
        line: '#DEDBD1',
        green: {
          DEFAULT: '#0B3D2E',
          dark: '#082A20',
          light: '#E7EFE9',
        },
        gold: {
          DEFAULT: '#A97A1F',
          light: '#F3E8D2',
        },
        brick: {
          DEFAULT: '#9A3324',
          light: '#F5E4DF',
        },
        slate: {
          DEFAULT: '#33475B',
          light: '#E7ECF1',
        },
      },
      fontFamily: {
        serif: ['"Newsreader"', 'Georgia', 'serif'],
        sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        content: '1120px',
      },
    },
  },
  plugins: [],
}
