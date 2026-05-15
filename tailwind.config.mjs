/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        brand: {
          pink:    '#DA1B5C',
          'pink-700': '#B41349',
          indigo:  '#3F2DD6',
          cream:   '#FFF0F1',
          blush:   '#FFE0E2',
          ink:     '#1F0E2E',
          mute:    '#6B496F',
          surface: '#FFFFFF',
          stroke:  '#FFC9CD',
        },
        success: '#0A9F56',
        danger:  '#D8334D',
      },
      fontFamily: {
        display: ['"Onest Variable"', 'system-ui', 'sans-serif'],
        body:    ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['3.5rem', { lineHeight: '1.05', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-lg': ['2.5rem', { lineHeight: '1.1',  letterSpacing: '-0.015em', fontWeight: '700' }],
        'h2':         ['1.75rem', { lineHeight: '1.25', fontWeight: '600' }],
        'h3':         ['1.375rem', { lineHeight: '1.3',  fontWeight: '600' }],
        'body':       ['1.0625rem', { lineHeight: '1.55' }],
        'caption':    ['0.875rem', { lineHeight: '1.4' }],
      },
      borderRadius: {
        card: '20px',
        pill: '999px',
      },
      boxShadow: {
        card:    '0 1px 2px rgba(31,14,46,.04), 0 8px 24px rgba(218,27,92,.08)',
        lifted:  '0 2px 6px rgba(31,14,46,.06), 0 24px 48px rgba(218,27,92,.12)',
      },
      maxWidth: {
        page: '1200px',
      },
    },
  },
  plugins: [],
};
