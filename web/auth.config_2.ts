import type { NextAuthConfig } from 'next-auth';
 
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')
      const isOnAdmin = nextUrl.pathname.startsWith('/admin')
      if (isOnAdmin) {
        // Laisse passer; la page /admin fera le garde strict de rôle côté serveur.
        return true
      }
      if (isOnDashboard) {
        return isLoggedIn
      }
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
  providers: [],
} satisfies NextAuthConfig;
