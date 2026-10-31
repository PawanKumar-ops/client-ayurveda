import mongoose, { Schema } from 'mongoose'
import { randomInt } from 'node:crypto'
import { ORDER_STATUSES, type Order } from '@/lib/order-types'

type OrderDoc = Omit<Order, 'id' | 'date'> & { trackingId: string; createdAt: Date; updatedAt: Date }

const itemSchema = new Schema(
  { title: { type: String, required: true }, img: { type: String, default: '' }, price: { type: Number, required: true, min: 0 }, qty: { type: Number, required: true, min: 1 } },
  { _id: false },
)

const orderSchema = new Schema<OrderDoc>(
  {
    trackingId: { type: String, required: true, unique: true, index: true },
    customer: {
      name: { type: String, required: true, trim: true },
      email: { type: String, required: true, trim: true, lowercase: true, index: true },
      phone: { type: String, required: true, trim: true },
    },
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    postalcode: { type: String, required: true, trim: true },
    pickup: { type: Boolean, default: false },
    method: { type: String, required: true },
    items: { type: [itemSchema], required: true, validate: (v: unknown[]) => v.length > 0 },
    subtotal: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    shipping: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
    code: { type: String, default: null },
    payment: { type: String, default: 'Cash on Delivery' },
    status: { type: String, enum: ORDER_STATUSES, default: 'Pending', index: true },
    notes: { type: String, default: '' },
  },
  { versionKey: false, timestamps: true },
)

export const OrderModel = (mongoose.models.Order as mongoose.Model<OrderDoc>) || mongoose.model<OrderDoc>('Order', orderSchema)

// Unambiguous characters (no 0/O, 1/I/L) so IDs are easy to read from an email.
const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
export function generateTrackingId() {
  let id = 'YA'
  for (let i = 0; i < 10; i++) id += ALPHABET[randomInt(ALPHABET.length)]
  return id
}

export function serializeOrder(doc: OrderDoc): Order {
  return {
    id: doc.trackingId,
    date: new Date(doc.createdAt).toISOString(),
    customer: { name: doc.customer.name, email: doc.customer.email, phone: doc.customer.phone },
    address: doc.address,
    city: doc.city,
    state: doc.state,
    postalcode: doc.postalcode,
    pickup: doc.pickup,
    method: doc.method,
    items: doc.items.map((i) => ({ title: i.title, img: i.img, price: i.price, qty: i.qty })),
    subtotal: doc.subtotal,
    discount: doc.discount,
    shipping: doc.shipping,
    total: doc.total,
    code: doc.code ?? null,
    payment: 'Cash on Delivery',
    status: doc.status,
    notes: doc.notes,
  }
}

/** Customer-facing view: hides internal staff notes and most of the contact details. */
export function publicOrder(doc: OrderDoc): Order {
  const o = serializeOrder(doc)
  return { ...o, notes: '', customer: { name: o.customer.name, email: '', phone: o.customer.phone.slice(-4) } }
}

/** Order lookups on the tracking page require the matching email or phone. */
export function contactMatches(doc: OrderDoc, contact: string) {
  const c = contact.trim().toLowerCase().replace(/\s/g, '')
  if (!c) return false
  const phone = c.replace(/\D/g, '').replace(/^91(?=\d{10}$)/, '')
  return doc.customer.email === c || (phone.length === 10 && doc.customer.phone === phone)
}
