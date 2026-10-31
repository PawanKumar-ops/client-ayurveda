import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { setAdminPassword, verifyAdmin } from '@/lib/admin-model'
import { ADMIN_EMAIL } from '@/lib/admin-email'

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (session?.user?.email !== ADMIN_EMAIL) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { current, next } = (await request.json()) as { current?: string; next?: string }
  if (typeof current !== 'string' || typeof next !== 'string' || next.length < 6) {
    return Response.json({ error: 'New password must be at least 6 characters.' }, { status: 400 })
  }
  if (!(await verifyAdmin(ADMIN_EMAIL, current))) {
    return Response.json({ error: 'Current password is incorrect.' }, { status: 400 })
  }
  await setAdminPassword(next)
  return Response.json({ ok: true })
}
