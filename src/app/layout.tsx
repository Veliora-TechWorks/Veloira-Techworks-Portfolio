import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  title: 'Veliora TechWorks - Intelligent Digital Solutions',
  description: 'Veliora TechWorks builds intelligent, scalable digital solutions that empower businesses to grow and lead with confidence.',
  keywords: ['technology', 'software development', 'web development', 'mobile apps', 'SaaS', 'database solutions'],
  authors: [{ name: 'Veliora TechWorks' }],
  creator: 'Veliora TechWorks',
  publisher: 'Veliora TechWorks',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://veliora-techworks.com',
    title: 'Veliora TechWorks - Intelligent Digital Solutions',
    description: 'Building intelligent, scalable digital solutions that empower businesses to grow and lead with confidence.',
    siteName: 'Veliora TechWorks',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Veliora TechWorks - Intelligent Digital Solutions',
    description: 'Building intelligent, scalable digital solutions that empower businesses to grow and lead with confidence.',
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
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="antialiased">
        {children}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1f2937',
              color: '#fff',
            },
          }}
        />
      </body>
    </html>
  )
}