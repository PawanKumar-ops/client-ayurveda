import { connectToDatabase } from '@/lib/mongodb'
import { OrderModel, contactMatches, publicOrder } from '@/lib/order-model'
import { normalizeTrackingId } from '@/lib/order-types'

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { id?: string; contact?: string; reason?: string }
  const id = normalizeTrackingId(String(body.id ?? ''))
  const reason = String(body.reason ?? '').trim().slice(0, 500)
  if (!reason) return Response.json({ error: 'Please choose a reason.' }, { status: 400 })

  await connectToDatabase()
  const doc = await OrderModel.findOne({ trackingId: id })
  if (!doc || !contactMatches(doc, String(body.contact ?? ''))) return Response.json({ error: 'Order not found.' }, { status: 404 })
  if (doc.status !== 'Pending' && doc.status !== 'Confirmed') {
    return Response.json({ error: 'This order can no longer be cancelled.' }, { status: 409 })
  }
  doc.status = 'Cancelled'
  doc.notes = (doc.notes ? doc.notes + '\n' : '') + `Cancelled by customer via order tracking — ${reason}.`
  await doc.save()
  return Response.json(publicOrder(doc.toObject()), { headers: { 'Cache-Control': 'no-store' } })
}
