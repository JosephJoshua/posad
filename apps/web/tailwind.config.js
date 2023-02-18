const { join } = require('path');
const { createGlobPatternsForDependencies } = require('@nrwl/react/tailwind');

const defaultTheme = require('tailwindcss/defaultTheme');
const { default: plugin } = require('tailwindcss');
const contentGlob = '**/*!(*.stories|*.spec).{ts,tsx,html}';

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, `src/${contentGlob}`),
    ...createGlobPatternsForDependencies(__dirname, contentGlob),
  ],
  theme: {
    fontFamily: {
      sans: ['Poppins', ...defaultTheme.fontFamily.sans],
    },
    extend: {
      colors: {
        'primary-blue': '#0a085f',
      },
    },
  },
  plugins: [],
};
