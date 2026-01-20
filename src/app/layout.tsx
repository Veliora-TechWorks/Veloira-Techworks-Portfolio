import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
})

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins'
})

export const metadata: Metadata = {
  title: 'Veliora TechWorks - Building Intelligent Digital Solutions',
  description: 'Professional technology solutions company specializing in web development, mobile apps, and digital transformation.',
  keywords: 'web development, mobile apps, digital solutions, technology, software development',
  authors: [{ name: 'Veliora TechWorks' }],
  creator: 'Veliora TechWorks',
  publisher: 'Veliora TechWorks',
  icons: {
    icon: '/Favicon.jpg',
    shortcut: '/Favicon.jpg',
    apple: '/Favicon.jpg'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/Favicon.jpg" type="image/jpeg" />
        <link rel="shortcut icon" href="/Favicon.jpg" type="image/jpeg" />
      </head>
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased`}>
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  )
}