import { connectToDatabase } from '@/lib/mongodb'
import { OrderModel, serializeOrder } from '@/lib/order-model'
import { ORDER_STATUSES, type OrderStatus } from '@/lib/order-types'
import { isAdmin, unauthorized } from '@/lib/admin-session'

const noStore = { 'Cache-Control': 'no-store' }

export async function PATCH(request: Request, ctx: RouteContext<'/api/orders/[id]'>) {
  if (!(await isAdmin())) return unauthorized()
  const { id } = await ctx.params
  const body = (await request.json().catch(() => ({}))) as { status?: string; notes?: string }
  const patch: { status?: OrderStatus; notes?: string } = {}
  if (typeof body.status === 'string') {
    if (!ORDER_STATUSES.includes(body.status as OrderStatus)) return Response.json({ error: 'Invalid status' }, { status: 400 })
    patch.status = body.status as OrderStatus
  }
  if (typeof body.notes === 'string') patch.notes = body.notes.slice(0, 2000)
  if (!Object.keys(patch).length) return Response.json({ error: 'Nothing to update' }, { status: 400 })

  await connectToDatabase()
  const doc = await OrderModel.findOneAndUpdate({ trackingId: id }, patch, { new: true }).lean()
  if (!doc) return Response.json({ error: 'Order not found' }, { status: 404 })
  return Response.json(serializeOrder(doc), { headers: noStore })
}

export async function DELETE(_request: Request, ctx: RouteContext<'/api/orders/[id]'>) {
  if (!(await isAdmin())) return unauthorized()
  const { id } = await ctx.params
  await connectToDatabase()
  const deleted = await OrderModel.findOneAndDelete({ trackingId: id })
  if (!deleted) return Response.json({ error: 'Order not found' }, { status: 404 })
  return Response.json({ id }, { headers: noStore })
}
