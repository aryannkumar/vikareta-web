import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { SSOAuthProvider } from '@/lib/auth/use-sso-auth';
import { ToastProvider } from '@/components/ui/toast-provider';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Vikareta - B2B Marketplace',
  description: 'Connect, Trade, and Grow with Vikareta - Your trusted B2B marketplace',
  keywords: 'B2B, marketplace, wholesale, suppliers, buyers, trade',
  authors: [{ name: 'Vikareta Team' }],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-white dark:bg-gray-900 text-gray-900 dark:text-white`}>
        <ThemeProvider
          defaultTheme="system"
          storageKey="vikareta-theme"
        >
          <ToastProvider>
            <SSOAuthProvider>
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1">
                  {children}
                </main>
                <Footer />
              </div>
            </SSOAuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}