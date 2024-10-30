/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'deep-blue': '#1E3A8A',
        'vibrant-teal': '#14B8A6',
        'soft-gray': '#F3F4F6',
        'slate-gray': '#6B7280',
        'accent-orange': '#F97316',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['var(--font-geist-mono)'],
      },
      borderRadius: {
        DEFAULT: '8px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}