/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      width: {
        7.5: '1.875rem', // 30
        12.5: '3.125rem', // 50
        15: '3.75rem', // 60
        18: '4.5rem', // 72
        25: '6.25rem', // 100
        30: '7.5rem', // 120
      },
      height: {
        7.5: '1.875rem',
        12.5: '3.125rem',
        15: '3.75rem',
        18: '4.5rem',
        25: '6.25rem',
        30: '7.5rem',
      },
      margin: {
        7.5: '1.875rem',
        12.5: '3.125rem',
        15: '3.75rem',
        18: '4.5rem',
        25: '6.25rem',
        30: '7.5rem',
      },
      padding: {
        7.5: '1.875rem',
        12.5: '3.125rem',
        15: '3.75rem',
        18: '4.5rem',
        25: '6.25rem',
        30: '7.5rem',
      },
      gap: {
        7.5: '1.875rem',
        12.5: '3.125rem',
        15: '3.75rem',
        18: '4.5rem',
        25: '6.25rem',
        30: '7.5rem',
      },
      lineHeight: {
        1: '1em',
        1.1: '1.1em',
        1.2: '1.2em',
        1.3: '1.3em',
        1.4: '1.4em',
        1.5: '1.5em',
        1.6: '1.6em',
        1.8: '1.8em',
        2: '2em',
      },
      borderColor: {
        DEFAULT: '#dcdfe6',
        light: '#e4e7ed',
      },
    },
  },
  plugins: [],
}
