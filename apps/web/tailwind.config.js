const { join } = require('path');
const { createGlobPatternsForDependencies } = require('@nrwl/react/tailwind');

const defaultTheme = require('tailwindcss/defaultTheme');
const path = require('path');
const contentGlob = '**/*!(*.stories|*.spec).{ts,tsx,html}';

console.log(
  path.join(
    path.dirname(require.resolve('react-tailwindcss-datepicker')),
    'dist/index.esm.js'
  )
);

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  future: {
    hoverOnlyWhenSupported: true,
  },
  content: [
    join(__dirname, `src/${contentGlob}`),
    ...createGlobPatternsForDependencies(__dirname, contentGlob),
    path.join(
      path.dirname(require.resolve('react-tailwindcss-datepicker')),
      'index.esm.js'
    ),
  ],
  theme: {
    fontFamily: {
      sans: ['Poppins', ...defaultTheme.fontFamily.sans],
    },
    extend: {
      colors: {
        'primary-blue': '#0a085f',
        'dark-gray': '#1e1e1e',
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('tailwind-scrollbar')],
};
