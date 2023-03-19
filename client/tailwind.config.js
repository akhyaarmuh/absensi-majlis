/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      screens: {
        tablet: '640px',
        laptop: '1024px',
        desktop: '1280px',
      },
      colors: {
        primary: '#287bff',
        // primary: '#2ec4b6',
        seasalt: '#f9fafb',
        frenchgray: '#d1d5db',
        stategray: '#6b7280',
        charcoal: '#374151',
        gunmetal: '#1f2937',
        richblack: '#111827',
      },
    },
  },
  plugins: [require('tailwindcss')],
};
