import { connectToDatabase } from '@/lib/mongodb'
import { OrderModel, contactMatches, publicOrder } from '@/lib/order-model'
import { TRACKING_ID_PATTERN, normalizeTrackingId } from '@/lib/order-types'

const NOT_FOUND = 'We couldn’t find an order matching those details. Check the tracking ID and contact info, or reach our care team.'

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { id?: string; contact?: string }
  const id = normalizeTrackingId(String(body.id ?? ''))
  const contact = String(body.contact ?? '')
  if (!TRACKING_ID_PATTERN.test(id) || !contact.trim()) return Response.json({ error: NOT_FOUND }, { status: 404 })

  await connectToDatabase()
  const doc = await OrderModel.findOne({ trackingId: id }).lean()
  // Same response for "no order" and "wrong contact" so IDs can't be probed.
  if (!doc || !contactMatches(doc, contact)) return Response.json({ error: NOT_FOUND }, { status: 404 })
  return Response.json(publicOrder(doc), { headers: { 'Cache-Control': 'no-store' } })
}
