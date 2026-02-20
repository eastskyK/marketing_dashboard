/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './code.html'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#C70851',
        secondary: '#0F172A',
        accent: '#8B5CF6',
        'bg-main': '#E8F1F5',
        'card-bg': '#FFFFFF',
        'text-main': '#1E293B',
        'text-sub': '#64748B',
        success: '#10B981',
        danger: '#EF4444'
      },
      borderRadius: {
        DEFAULT: '0.75rem',
        xl: '1rem',
        '2xl': '1.5rem'
      },
      boxShadow: {
        soft: '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        float: '0 10px 30px -5px rgba(0, 0, 0, 0.15)'
      }
    }
  },
  plugins: []
};
