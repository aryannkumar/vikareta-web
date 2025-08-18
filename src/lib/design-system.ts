// Premium B2B Design System for Vikareta
export const designSystem = {
  colors: {
    primary: {
      50: '#fff7ed',
      100: '#ffedd5',
      200: '#fed7aa',
      300: '#fdba74',
      400: '#fb923c',
      500: '#f97316', // Main orange
      600: '#ea580c',
      700: '#c2410c',
      800: '#9a3412',
      900: '#7c2d12',
      950: '#431407'
    },
    accent: {
      orange: '#f97316',
      gold: '#f59e0b',
      amber: '#fbbf24'
    },
    neutral: {
      50: '#fafaf9',
      100: '#f5f5f4',
      200: '#e7e5e4',
      300: '#d6d3d1',
      400: '#a8a29e',
      500: '#78716c',
      600: '#57534e',
      700: '#44403c',
      800: '#292524',
      900: '#1c1917',
      950: '#0c0a09'
    },
    semantic: {
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6'
    }
  },
  
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      display: ['Lexend', 'Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'monospace']
    },
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.25rem' }],
      base: ['1rem', { lineHeight: '1.5rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      '5xl': ['3rem', { lineHeight: '1' }],
      '6xl': ['3.75rem', { lineHeight: '1' }],
      '7xl': ['4.5rem', { lineHeight: '1' }],
      '8xl': ['6rem', { lineHeight: '1' }],
      '9xl': ['8rem', { lineHeight: '1' }]
    }
  },
  
  spacing: {
    section: {
      xs: '2rem',
      sm: '3rem',
      md: '4rem',
      lg: '6rem',
      xl: '8rem'
    },
    container: {
      padding: '1.5rem',
      maxWidth: '1200px'
    }
  },
  
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    '3xl': '2rem'
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    premium: '0 25px 50px -12px rgba(249, 115, 22, 0.25)'
  },
  
  gradients: {
    primary: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
    subtle: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
    hero: 'linear-gradient(135deg, #f97316 0%, #fb923c 25%, #fdba74 50%, #fed7aa 75%, #fff7ed 100%)',
    card: 'linear-gradient(145deg, #ffffff 0%, #fafaf9 100%)'
  }
};

export const premiumComponents = {
  card: {
    base: "bg-white dark:bg-neutral-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-neutral-200 dark:border-neutral-700",
    premium: "bg-gradient-to-br from-white to-neutral-50 dark:from-neutral-800 dark:to-neutral-900 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-neutral-200 dark:border-neutral-700",
    interactive: "cursor-pointer hover:scale-[1.02] hover:shadow-premium transition-all duration-300"
  },
  
  button: {
    primary: "bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300",
    secondary: "bg-white hover:bg-neutral-50 text-primary-600 font-semibold px-6 py-3 rounded-xl border-2 border-primary-500 hover:border-primary-600 transition-all duration-300",
    ghost: "bg-transparent hover:bg-primary-50 text-primary-600 hover:text-primary-700 font-semibold px-6 py-3 rounded-xl transition-all duration-300"
  },
  
  badge: {
    primary: "bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium",
    success: "bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium",
    premium: "bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium border border-amber-200"
  }
};