import { Navigation } from '@/components/layout/navigation'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Loan Management System',
  description: 'Comprehensive loan management application for lenders',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased bg-gray-50`}>
        <div className="min-h-screen">
          <Navigation />
          <main className="container mx-auto px-4 py-8">{children}</main>
        </div>
        <Toaster />
      </body>
    </html>
  )
}
