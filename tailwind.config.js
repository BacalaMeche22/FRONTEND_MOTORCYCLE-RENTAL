/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/**/*.{html,ts}", 
  ],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },
    colors: {
      'blue': '#171b64',
      'blue-2': '	#0000FF',
      'blue-3': '	#143A57',
      'white': '#FFFFFF',
      'purple': '#7e5bef',
      'pink': '#ff49db',
      'orange': '#ff7849',
      'red': '#FF0000',
      'light-red': '#FF9C73',
      'green': '#13ce66',
      'yellow': '#ffc82c',
      'gray-dark': '#273444',
      'gray': '#8492a6',
      'gray-light': '#d3dce6',
      'black': '#000000',
    },
    fontFamily: {
      sans: ['Graphik', 'sans-serif'],
      serif: ['Merriweather', 'serif'],
    },
    extend: {
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      fontSize: {
        'xs': '.75rem',      // Extra small text size
        'sm': '.875rem',     // Small text size
        'base': '1rem',      // Default text size
        'lg': '1.125rem',    // Large text size
        'xl': '1.25rem',     // Extra large text size
        '2xl': '1.5rem',     // 2x Extra large text size
        '3xl': '1.875rem',   // 3x Extra large text size
        '4xl': '2.25rem',    // 4x Extra large text size
        '5xl': '3rem',       // 5x Extra large text size
      }
    }
  }
}
