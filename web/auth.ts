import NextAuth from 'next-auth';
import { authConfig } from './auth.config_2';
 
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
});
