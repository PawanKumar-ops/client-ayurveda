export type OrderStatus = 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled'
export const ORDER_STATUSES: OrderStatus[] = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled']

export type OrderItem = { title: string; img: string; price: number; qty: number }

export const publicImageSrc = (src: string) => {
  const value = src.trim()
  return value.startsWith('/') || /^https?:\/\//i.test(value) ? value : `/${value}`
}

/** Public order shape shared by the API, admin console and tracking page. `id` is the tracking ID. */
export type Order = {
  id: string
  date: string
  customer: { name: string; email: string; phone: string }
  address: string
  city: string
  state: string
  postalcode: string
  pickup: boolean
  method: string
  items: OrderItem[]
  subtotal: number
  discount: number
  shipping: number
  total: number
  code: string | null
  payment: 'Cash on Delivery'
  status: OrderStatus
  notes: string
}

export const TRACKING_ID_PATTERN = /^YA[A-Z0-9]{10}$/
export const normalizeTrackingId = (s: string) => s.trim().toUpperCase().replace(/^#/, '').replace(/[\s-]/g, '')
