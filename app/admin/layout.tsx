import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { ADMIN_EMAIL } from '@/lib/admin-email'

export default async function AdminRouteLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions)
  if (session?.user?.email !== ADMIN_EMAIL) redirect('/')
  return children
}
