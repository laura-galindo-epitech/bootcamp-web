import type { Metadata } from 'next'
import './globals.css'
import { ReactQueryProvider } from './providers'
import Navbar from '../components/common/Navbar'
import Footer from '@/components/common/Footer'
import { Inter } from 'next/font/google'
import { auth } from '../../auth'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'OneShoe',
  description: 'E‑commerce school project',
  icons: { icon: '/favicon.ico' }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  const isAdmin = (session?.user && (session.user as any).role === 'admin') || process.env.ADMIN_DEV_OVERRIDE === '1'
  const isLoggedIn = !!session?.user
  return (
    <html lang="fr">
      <body className={`${inter.className} antialiased bg-zinc-50 text-zinc-900 min-h-screen flex flex-col`}>
        <ReactQueryProvider>
          <Navbar isAdmin={!!isAdmin} isLoggedIn={isLoggedIn} />
          <main className="flex-1">{children}</main>
          <Footer />
        </ReactQueryProvider>
      </body>
    </html>
  )
}
