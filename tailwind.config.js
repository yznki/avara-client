const config = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'sans-serif'],
        heading: ['var(--font-heading)', 'sans-serif'],
      },
      colors: {
        primary: {
          100: '#d4e3ff',
          200: '#9abcf5',
          300: '#0b5af5',
          400: '#003ed4',
          500: '#002a9f',
        },
        secondary: {
          100: '#d7e0fa',
          200: '#9eaff2',
          300: '#0c2985',
          400: '#001e69',
          500: '#00154b',
        },
        tertiary: {
          100: '#e6f0ff',
          200: '#c5dbfc',
          300: '#a1c3f5',
          400: '#75a9ef',
          500: '#619cf3',
        },
        accent: {
          100: '#d8fdfa',
          200: '#a7f9ef',
          300: '#04bfae',
          400: '#029b8e',
          500: '#01776f',
        },
        neutralDark: {
          100: '#a3a3a3',
          200: '#555',
          300: '#333',
          400: '#1e1e1e',
          500: '#111',
        },
        neutralLight: {
          100: '#ffffff',
          200: '#f9f9f9',
          300: '#f2f2f2',
          400: '#ebebeb',
          500: '#e5e5e5',
        },
        info: {
          100: '#e6f1ff',
          200: '#9fd3ff',
          300: '#4094ff',
          400: '#0567da',
          500: '#004ab3',
        },
        warning: {
          100: '#fff6e5',
          200: '#ffd677',
          300: '#f8aa2d',
          400: '#c87900',
          500: '#a15800',
        },
        error: {
          100: '#ffe8e8',
          200: '#ffa0a0',
          300: '#ef4444',
          400: '#d72626',
          500: '#b91c1c',
        },
        success: {
          100: '#e1ffec',
          200: '#a4f7c7',
          300: '#28c76f',
          400: '#1da95d',
          500: '#148849',
        },
      },
      borderRadius: {
        sm: 'calc(var(--radius) - 4px)',
        md: 'calc(var(--radius) - 2px)',
        lg: 'var(--radius)',
        xl: 'calc(var(--radius) + 4px)',
      },
    },
  },
  plugins: [typography],
};

export default config;
