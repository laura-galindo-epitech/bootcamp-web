import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import { ReactQueryProvider } from './providers'
import Navbar from '../components/common/Navbar'
import Footer from '@/components/common/Footer'
import { Inter } from 'next/font/google'
import { createClient } from '@/utils/supabase/server'
import CookieBanner from '@/components/CookieBanner'

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
    <html lang="fr" suppressHydrationWarning>
      <head>
        {/* Set initial theme before paint to avoid flash and ensure toggle works reliably */}
        <Script id="theme-init" strategy="beforeInteractive">{`
          (function(){
            try {
              var stored = localStorage.getItem('theme');
              var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
              var useDark = stored ? stored === 'dark' : prefersDark;
              var root = document.documentElement;
              if (useDark) root.classList.add('dark'); else root.classList.remove('dark');
            } catch(e) {}
          })();
        `}</Script>
      </head>
      <body className={`${inter.className} antialiased bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 min-h-screen flex flex-col`}>
        <ReactQueryProvider>
          <Navbar isAdmin={!!isAdmin} isLoggedIn={isLoggedIn} />
          <main className="flex-1">{children}</main>
          <Footer />
        </ReactQueryProvider>
        <CookieBanner />
      </body>
    </html>
  )
}
