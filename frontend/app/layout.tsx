import type { Metadata, Viewport } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import RegisterSW from '@/components/RegisterSW'

const geist = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SomaliNimo',
  description: 'Learn Somali with flashcards and quizzes',
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  themeColor: '#4f46e5',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="so" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full bg-gray-50">
        {children}
        <RegisterSW />
      </body>
    </html>
  )
}
