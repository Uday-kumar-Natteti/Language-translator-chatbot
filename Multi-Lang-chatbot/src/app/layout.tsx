import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Multilingual Chatbot - Break Language Barriers',
  description: 'AI-powered multilingual chatbot that translates messages in real-time. Chat with anyone from any country without language barriers. Supports multiple languages for smooth global communication.',
  keywords: 'multilingual, chatbot, translation, AI, languages, communication, global chat',
  authors: [{ name: 'Multilingual Chatbot Team' }],
  openGraph: {
    title: 'Multilingual Chatbot - Global Communication Made Easy',
    description: 'Break language barriers with our AI-powered multilingual chatbot. Instant translation and smooth conversations across languages.',
    type: 'website',
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
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🌍</text></svg>" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}