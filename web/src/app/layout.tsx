import type { Metadata } from 'next'
import './globals.css'
import { ReactQueryProvider } from './providers'
import Navbar from '../components/common/Navbar'
import Footer from '@/components/common/Footer'
import { Inter } from 'next/font/google'
import { createClient } from '@/utils/supabase/server'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'OneShoe',
  description: 'E‑commerce school project',
  icons: { icon: '/favicon.ico' }
}

// Force le rendu dynamique pour lire les cookies Supabase à chaque requête
export const dynamic = 'force-dynamic'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isLoggedIn = !!user
  // Admin: on conserve seulement l'override dev pour l'instant
  const isAdmin = process.env.ADMIN_DEV_OVERRIDE === '1'
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
