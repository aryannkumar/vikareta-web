/** @type {import('tailwindcss').Config} */
const config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                // Vikareta brand colors
                vikareta: {
                    primary: "hsl(var(--vikareta-primary))",
                    secondary: "hsl(var(--vikareta-secondary))",
                    accent: "hsl(var(--vikareta-accent))",
                    warning: "hsl(var(--vikareta-warning))",
                    error: "hsl(var(--vikareta-error))",
                    success: "hsl(var(--vikareta-success))",
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            fontFamily: {
                sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
                mono: ['var(--font-mono)', 'monospace'],
            },
            boxShadow: {
                soft: 'var(--shadow-soft)',
                medium: 'var(--shadow-medium)',
                hard: 'var(--shadow-hard)',
            },
            animation: {
                'slide-in': 'slide-in 0.3s ease-out',
                'fade-in': 'fadeIn 0.6s ease-out',
                'slide-up': 'slideInUp 0.4s ease-out',
                'slide-in-down': 'slideInDown 0.3s ease-out',
                'slide-in-left': 'slideInLeft 0.4s ease-out',
                'slide-in-right': 'slideInRight 0.4s ease-out',
                'scale-in': 'scaleIn 0.3s ease-out',
                'bounce-in': 'bounceIn 0.6s ease-out',
                'premium-float': 'premiumFloat 3s ease-in-out infinite',
                'premium-glow': 'premiumGlow 2s ease-in-out infinite',
                'premium-pulse': 'premiumPulse 2s ease-in-out infinite',
                'shimmer': 'shimmer 2s infinite',
                'morphing': 'morphing 8s ease-in-out infinite',
                'gradient-shift': 'gradientShift 4s ease infinite',
                'text-glow': 'textGlow 3s ease-in-out infinite',
                'particle-float': 'particleFloat 6s ease-in-out infinite',
            },
            keyframes: {
                'slide-in': {
                    from: { transform: 'translateX(100%)', opacity: '0' },
                    to: { transform: 'translateX(0)', opacity: '1' },
                },
                fadeIn: {
                    from: { opacity: '0', transform: 'translateY(20px)' },
                    to: { opacity: '1', transform: 'translateY(0)' },
                },
                slideInUp: {
                    from: { opacity: '0', transform: 'translateY(100%)' },
                    to: { opacity: '1', transform: 'translateY(0)' },
                },
                slideInDown: {
                    from: { opacity: '0', transform: 'translateY(-100%)' },
                    to: { opacity: '1', transform: 'translateY(0)' },
                },
                slideInLeft: {
                    from: { opacity: '0', transform: 'translateX(-100%)' },
                    to: { opacity: '1', transform: 'translateX(0)' },
                },
                slideInRight: {
                    from: { opacity: '0', transform: 'translateX(100%)' },
                    to: { opacity: '1', transform: 'translateX(0)' },
                },
                scaleIn: {
                    from: { opacity: '0', transform: 'scale(0.9)' },
                    to: { opacity: '1', transform: 'scale(1)' },
                },
                bounceIn: {
                    '0%': { opacity: '0', transform: 'scale(0.3)' },
                    '50%': { opacity: '1', transform: 'scale(1.05)' },
                    '70%': { transform: 'scale(0.9)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                premiumFloat: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                premiumGlow: {
                    '0%, 100%': { boxShadow: '0 0 20px rgba(249, 115, 22, 0.3)' },
                    '50%': { boxShadow: '0 0 40px rgba(249, 115, 22, 0.6)' },
                },
                premiumPulse: {
                    '0%, 100%': { transform: 'scale(1)', opacity: '1' },
                    '50%': { transform: 'scale(1.05)', opacity: '0.8' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
                morphing: {
                    '0%, 100%': { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' },
                    '50%': { borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%' },
                },
                gradientShift: {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                },
                textGlow: {
                    '0%, 100%': { textShadow: '0 0 5px rgba(249, 115, 22, 0.5)' },
                    '50%': { textShadow: '0 0 20px rgba(249, 115, 22, 0.8), 0 0 30px rgba(59, 130, 246, 0.5)' },
                },
                particleFloat: {
                    '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
                    '33%': { transform: 'translateY(-30px) rotate(120deg)' },
                    '66%': { transform: 'translateY(15px) rotate(240deg)' },
                },
            },
        },
    },
    plugins: [],
};

module.exports = config;