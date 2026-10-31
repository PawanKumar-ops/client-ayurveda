import { NextResponse, type NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { ADMIN_EMAIL } from '@/lib/admin-email'

// Every /admin route requires a valid NextAuth admin session.
export async function proxy(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  if (token?.email !== ADMIN_EMAIL) return NextResponse.redirect(new URL('/', request.url))
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
}
