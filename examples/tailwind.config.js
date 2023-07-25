/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["index.html"],
  plugins: [require('tailwindcss-oklch')({
    contrastThreshold: .6,
  })],
  theme: {
    extend: {
      colors: {
        primary: `oklch(var(--color-primary-l) var(--color-primary-c) var(--color-primary-h) / <alpha-value>)`,
        body: `oklch(var(--color-body-l) var(--color-body-c) var(--color-body-h) / <alpha-value>)`,
      },
    },
  },
}

