import { createHash } from 'node:crypto'

// NextAuth refuses to run in production without a secret. Prefer NEXTAUTH_SECRET; otherwise derive a
// stable server-only secret from MONGODB_URI (already required and private) so deployments still work.
export const AUTH_SECRET =
  process.env.NEXTAUTH_SECRET ||
  process.env.AUTH_SECRET ||
  (process.env.MONGODB_URI
    ? createHash('sha256').update(`nextauth:${process.env.MONGODB_URI}`).digest('hex')
    : undefined)
