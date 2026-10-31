import { connectToDatabase } from '@/lib/mongodb'
import { OrderModel, generateTrackingId, serializeOrder } from '@/lib/order-model'
import { priceCart, SHIPPING_METHOD } from '@/lib/pricing'
import { sendOrderConfirmation } from '@/lib/email'
import { isAdmin, unauthorized } from '@/lib/admin-session'

const noStore = { 'Cache-Control': 'no-store' }
const bad = (error: string, status = 400) => Response.json({ error }, { status, headers: noStore })
const str = (v: unknown, max = 200) => (typeof v === 'string' ? v.trim().slice(0, max) : '')

export async function GET() {
  if (!(await isAdmin())) return unauthorized()
  await connectToDatabase()
  const docs = await OrderModel.find().sort({ createdAt: -1 }).lean()
  return Response.json(docs.map(serializeOrder), { headers: noStore })
}

type Body = {
  customer?: { firstname?: string; lastname?: string; email?: string; phone?: string }
  address?: { address1?: string; address2?: string; city?: string; state?: string; postalcode?: string }
  items?: { title?: string; qty?: number }[]
}

export async function POST(request: Request) {
  let body: Body
  try { body = await request.json() } catch { return bad('Invalid request.') }

  const c = body.customer ?? {}
  const a = body.address ?? {}
  const name = `${str(c.firstname, 60)} ${str(c.lastname, 60)}`.trim()
  const email = str(c.email, 254).toLowerCase()
  const phone = str(c.phone, 20).replace(/\D/g, '').slice(-10)
  const address = [str(a.address1), str(a.address2)].filter(Boolean).join(', ')
  const city = str(a.city, 80), state = str(a.state, 80), postalcode = str(a.postalcode, 10)

  if (!str(c.firstname) || !str(c.lastname)) return bad('Please enter your full name.')
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return bad('Please enter a valid email address.')
  if (!/^[6-9]\d{9}$/.test(phone)) return bad('Please enter a valid 10-digit mobile number.')
  if (!str(a.address1) || !city || !state) return bad('Please complete your delivery address.')
  if (!/^\d{6}$/.test(postalcode)) return bad('Please enter a valid 6-digit PIN code.')

  const items = Array.isArray(body.items) ? body.items : []
  if (!items.length || items.length > 50) return bad('Your cart is empty.')
  const parsed = items.map((i) => ({ title: str(i.title), qty: Math.floor(Number(i.qty)) }))
  if (parsed.some((i) => !i.title || !Number.isFinite(i.qty) || i.qty < 1 || i.qty > 20)) return bad('Some cart items are invalid.')

  let priced
  try { priced = priceCart(parsed) } catch (err) { return bad((err as Error).message) }

  try {
    await connectToDatabase()
    let doc
    for (let attempt = 0; !doc; attempt++) {
      try {
        doc = await OrderModel.create({
          trackingId: generateTrackingId(),
          customer: { name, email, phone },
          address, city, state, postalcode,
          pickup: false,
          method: SHIPPING_METHOD,
          items: priced.lines,
          subtotal: priced.subtotal,
          discount: priced.discount,
          shipping: priced.shipping,
          total: priced.total,
          code: null,
          payment: 'Cash on Delivery',
          status: 'Pending',
          notes: '',
        })
      } catch (err) {
        // Retry only on a (very unlikely) tracking ID collision.
        if ((err as { code?: number }).code !== 11000 || attempt >= 4) throw err
      }
    }
    const order = serializeOrder(doc.toObject())
    const emailSent = await sendOrderConfirmation(order, email, new URL(request.url).origin)
    return Response.json({ order, emailSent }, { status: 201, headers: noStore })
  } catch (err) {
    console.error('Order creation failed', err)
    return bad('We could not place your order right now. Please try again in a moment.', 500)
  }
}
