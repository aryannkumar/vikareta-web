// Premium B2B Design System for Vikareta
export const designSystem = {
  colors: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6', // Main blue
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
      950: '#172554'
    },
    accent: {
      blue: '#3b82f6',
      cyan: '#06b6d4',
      indigo: '#6366f1'
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
  premium: '0 25px 50px -12px rgba(59, 130, 246, 0.25)'
  },
  
  gradients: {
  primary: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
  subtle: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
  hero: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 25%, #93c5fd 50%, #bfdbfe 75%, #dbeafe 100%)',
    card: 'linear-gradient(145deg, #ffffff 0%, #fafaf9 100%)'
  }
};

export const premiumComponents = {
  card: {
    base: "bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-neutral-200",
    premium: "bg-gradient-to-br from-white to-neutral-50 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-neutral-200",
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
  premium: "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium border border-blue-200"
  }
};