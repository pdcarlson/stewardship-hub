// tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // this line scans all relevant files in the src folder
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}