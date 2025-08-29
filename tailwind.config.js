// tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    // here we extend the default tailwind theme
    extend: {
      colors: {
        // you can define your own color palette here
        'primary': {
          DEFAULT: '#4f46e5', // a nice indigo
          'light': '#6366f1',
          'dark': '#4338ca',
        },
        'secondary': '#1f2937', // a cool gray
        'light': '#f9fafb', // a very light gray for backgrounds
        'accent': '#10b981', // a teal/emerald for highlights
      },
    },
  },
  plugins: [],
}