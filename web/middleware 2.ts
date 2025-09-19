import NextAuth from 'next-auth'
import { authConfig } from './auth.config 2'

export default NextAuth(authConfig).auth

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
  runtime: 'nodejs',
}

