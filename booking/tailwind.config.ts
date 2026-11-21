import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'white-page': '#FBFDFF',
        mist: '#EFF4F8',
        card: '#FFFFFF',
        'sky-ink': '#1F5FA8',
        'sky-deep': '#174A85',
        'sky-mist': '#E3EFFA',
        slate: '#5A6B7A',
        citrus: '#F2A93B',
        'citrus-deep': '#D98F1F',
        good: '#2E9E6B',
        rule: '#DDE6EC',
      },
      fontFamily: {
        display: ['Poppins', 'system-ui', 'sans-serif'],
        sans: ['Plus Jakarta Sans Variable', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '16px',
      },
      maxWidth: {
        container: '1140px',
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
        io: 'cubic-bezier(0.65, 0, 0.35, 1)',
      },
    },
  },
  plugins: [],
} satisfies Config
