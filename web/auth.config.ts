import type { NextAuthConfig } from 'next-auth'
import Google from 'next-auth/providers/google'
import Facebook from 'next-auth/providers/facebook'
import Credentials from 'next-auth/providers/credentials'
 
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')
      const isOnAdmin = nextUrl.pathname.startsWith('/admin')
      const isOnAccount = nextUrl.pathname.startsWith('/account')
      if (isOnAdmin) {
        // Laisse passer; la page /admin fera le garde strict de rôle côté serveur.
        return true
      }
      if (isOnDashboard) return isLoggedIn
      if (isOnAccount) return isLoggedIn
      return true
    },

    // Propager un rôle dans le token/session
    async jwt({ token, user }) {
      // Dev override: si ADMIN_DEV_OVERRIDE=1, tous les utilisateurs connectés deviennent admin
      if (process.env.ADMIN_DEV_OVERRIDE === '1' && user) {
        token.role = 'admin'
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token && 'role' in token) {
        // @ts-expect-error extension custom
        session.user.role = token.role as any
      }
      return session
    },
  },
  // Providers (ID/SECRET inférés via variables AUTH_*)
  providers: [
    Google,
    Facebook,
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mot de passe', type: 'password' },
      },
      async authorize(c) {
        const email = (c?.email as string | undefined)?.trim()
        const password = (c?.password as string | undefined) || ''
        if (!email || !password) return null

        // Mode sécurisé: vérifie des identifiants définis en env (démo/simple)
        if (process.env.AUTH_CREDENTIALS_EMAIL && process.env.AUTH_CREDENTIALS_PASSWORD) {
          if (email === process.env.AUTH_CREDENTIALS_EMAIL && password === process.env.AUTH_CREDENTIALS_PASSWORD) {
            return { id: 'cred-user', name: email.split('@')[0], email }
          }
          return null
        }

        // Option dev (facultative): accepter n'importe quel login en dev si flag activé
        if (process.env.CREDENTIALS_DEV_ACCEPT_ANY === '1') {
          return { id: email, name: email.split('@')[0], email }
        }

        return null
      },
    }),
  ],
} satisfies NextAuthConfig;
