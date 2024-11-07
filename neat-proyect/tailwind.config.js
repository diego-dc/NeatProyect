/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}", // Añade tus archivos Angular aquí
  ],
  theme: {
    extend: {
      colors: {
        "primary-color": "var(--primary-color)",
        "text-color": "var(--text-color)",
        "primary-100": "var(--primary-100)",
        "background-color": "var(--background-color)",

        "feedback-green": "var(--feedback-green)",
        "feedback-red": "var(--feedback-red)",
        "feedback-yellow": "var(--feedback-yellow)",
      },
    },
  },
  plugins: [],
};
