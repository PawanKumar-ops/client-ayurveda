import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { ADMIN_EMAIL } from '@/lib/admin-email'
import { verifyAdmin } from '@/lib/admin-model'
import { AUTH_SECRET } from '@/lib/auth-secret'

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },
  secret: AUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'Admin',
      credentials: { email: { type: 'email' }, password: { type: 'password' } },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null
        if (!(await verifyAdmin(credentials.email, credentials.password))) return null
        return { id: 'admin', email: ADMIN_EMAIL, name: 'Admin' }
      },
    }),
  ],
}
