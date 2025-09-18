import type { Metadata } from 'next'
import './globals.css'
import { ReactQueryProvider } from './providers'
import Navbar from '@/components/common/Navbar'
import Footer from '@/components/common/Footer'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'OneShoe',
  description: 'E‑commerce school project',
  icons: { icon: '/icon.png' }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${inter.className} antialiased bg-zinc-50 text-zinc-900`}>
        <ReactQueryProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ReactQueryProvider>
      </body>
    </html>
  )
}
