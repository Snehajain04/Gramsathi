import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/authContext';
import { Toaster } from 'sonner';

export const viewport: Viewport = {
  themeColor: '#16a34a',
};

export const metadata: Metadata = {
  title: 'GramSathi | AI-Powered Farm Intelligence',
  description: 'GramSathi — Rooted in Innovation, Harvesting Opportunity. AI-Powered Crop Disease & Pest Early Warning System for Indian Farmers. Available in 9 Indian languages with voice advisory.',
  keywords: ['GramSathi', 'crop disease', 'AI farming', 'pest forecast', 'smart agriculture', 'India', 'explainable AI', 'Gemini AI'],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'GramSathi',
  },
  openGraph: {
    title: 'GramSathi — Rooted in Innovation, Harvesting Opportunity',
    description: 'AI crop disease detection for Indian farmers · 9 languages · Explainable AI · Voice Assistant',
    type: 'website',
    locale: 'en_IN',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="font-sans">
      <head>
        {/* PWA manifest */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#16a34a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="GramSathi" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
      </head>
      <body className="antialiased bg-white text-gray-900 min-h-screen">
        <AuthProvider>
          {children}
          <Toaster position="top-right" richColors closeButton toastOptions={{ duration: 4000 }} />
        </AuthProvider>
      </body>
    </html>
  );
}
