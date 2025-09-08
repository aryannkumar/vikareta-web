import type { Metadata } from 'next';
import { Inter, Lexend, Poppins } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { VikaretaAuthProvider } from '@/lib/auth/vikareta';
import { ToastProvider } from '@/components/ui/toast-provider';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import Entrance from '@/components/Animated';
import MotionBoot from '@/components/motion/MotionBoot';

// Premium font combinations for B2B design
const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const lexend = Lexend({ 
  subsets: ['latin'],
  variable: '--font-lexend',
  display: 'swap',
});

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Vikareta - Premium B2B Marketplace',
  description: 'Connect, Trade, and Grow with Vikareta - Your trusted B2B marketplace for premium business solutions',
  keywords: 'B2B, marketplace, wholesale, suppliers, buyers, trade, premium, business solutions',
  authors: [{ name: 'Vikareta Team' }],
  icons: {
    icon: '/img/logo.png',
    shortcut: '/img/logo.png',
    apple: '/img/logo.png',
  },
  openGraph: {
    title: 'Vikareta - Premium B2B Marketplace',
    description: 'Connect, Trade, and Grow with Vikareta',
    url: 'https://vikareta.com',
    siteName: 'Vikareta',
    images: [
      {
        url: '/img/logo.png',
        width: 800,
        height: 600,
        alt: 'Vikareta Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vikareta - Premium B2B Marketplace',
    description: 'Connect, Trade, and Grow with Vikareta',
    images: ['/img/logo.png'],
  },
};

export const viewport = 'width=device-width, initial-scale=1, maximum-scale=5';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${lexend.variable} ${poppins.variable}`}>
      <head>
        {/* Google site verification (set value via env or replace placeholder) */}
        {process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && (
          <meta
            name="google-site-verification"
            content={process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION}
          />
        )}
      </head>
            <body className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 font-inter antialiased">
        <MotionBoot />
        <ThemeProvider
          defaultTheme="light"
          storageKey="vikareta-theme"
        >
          <VikaretaAuthProvider>
            <ToastProvider>
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1">
                  <Entrance>
                    {children}
                  </Entrance>
                </main>
                <Footer />
              </div>
            </ToastProvider>
          </VikaretaAuthProvider>
        </ThemeProvider>
        {/* Google Identity Services */}
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="beforeInteractive"
        />
        
        {/* Cashfree SDK */}
        <Script
          src="https://sdk.cashfree.com/js/v3/cashfree.js"
          strategy="beforeInteractive"
        />
        
        <ThemeProvider
          defaultTheme="system"
          storageKey="vikareta-theme"
        >
          <ToastProvider>
            <VikaretaAuthProvider>
              <div className="min-h-screen flex flex-col relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-slate-500/5 pointer-events-none"></div>
                
                <MotionBoot />
                <Header />
                <main className="flex-1 relative z-10">
                  <Entrance>
                    {children}
                  </Entrance>
                </main>
                <Footer />
              </div>
            </VikaretaAuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}