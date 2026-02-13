import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import ToasterProvider from '@/components/ToasterProvider'
import ErrorBoundary from '@/components/ErrorBoundary'
import PerformanceMonitor from '@/components/PerformanceMonitor'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
})

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
  preload: true,
})

export const metadata: Metadata = {
  title: 'Veliora TechWorks - Building Intelligent Digital Solutions',
  description: 'Professional technology solutions company specializing in web development, mobile apps, and digital transformation.',
  keywords: 'web development, mobile apps, digital solutions, technology, software development',
  authors: [{ name: 'Veliora TechWorks' }],
  creator: 'Veliora TechWorks',
  publisher: 'Veliora TechWorks',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/Favicon.jpg'
  },
  manifest: '/manifest.json',
  openGraph: {
    title: 'Veliora TechWorks - Building Intelligent Digital Solutions',
    description: 'Professional technology solutions company specializing in web development, mobile apps, and digital transformation.',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://dpd4keszz.cloudinary.com" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="shortcut icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ecc94b" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased`} suppressHydrationWarning>
        <ErrorBoundary>
          <PerformanceMonitor />
          <ToasterProvider />
          {children}
        </ErrorBoundary>
      </body>
    </html>
  )
}