import { useSyncExternalStore } from 'react'
import { allProducts } from '@/lib/products'

export type OrderStatus = 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled'
export const ORDER_STATUSES: OrderStatus[] = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled']

export type OrderItem = { title: string; img: string; price: number; qty: number }
export type Order = {
  id: string
  date: string
  customer: { name: string; email: string; phone: string }
  address: string
  city: string
  state: string
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

export type Message = {
  id: string
  date: string
  name: string
  email: string
  phone: string
  order: string
  topic: string
  message: string
  read: boolean
  starred: boolean
  archived: boolean
}

type State = { orders: Order[]; messages: Message[] }
const KEY = 'yubhi-admin-v2'

/* ---------- demo seed so the dashboard has history ---------- */

function seed(): State {
  const names = [
    ['Aanya Sharma', 'Mumbai', 'Maharashtra'], ['Rohan Mehta', 'Pune', 'Maharashtra'], ['Ishita Rao', 'Bengaluru', 'Karnataka'],
    ['Kabir Singh', 'Delhi', 'Delhi'], ['Meera Iyer', 'Chennai', 'Tamil Nadu'], ['Arjun Nair', 'Kochi', 'Kerala'],
    ['Diya Kapoor', 'Jaipur', 'Rajasthan'], ['Vihaan Gupta', 'Lucknow', 'Uttar Pradesh'], ['Saanvi Reddy', 'Hyderabad', 'Telangana'],
    ['Aarav Joshi', 'Ahmedabad', 'Gujarat'], ['Anika Das', 'Kolkata', 'West Bengal'], ['Neel Banerjee', 'Kolkata', 'West Bengal'],
    ['Tara Menon', 'Bengaluru', 'Karnataka'], ['Kiara Shah', 'Mumbai', 'Maharashtra'],
  ]
  const products = allProducts.filter((p, i, a) => a.findIndex((x) => x.title === p.title) === i)
  let r = 7
  const rnd = () => ((r = (r * 9301 + 49297) % 233280) / 233280)
  const orders: Order[] = []
  for (let i = 0; i < 260; i++) {
    const [name, city, state] = names[Math.floor(rnd() * names.length)]
    const n = 1 + Math.floor(rnd() * 3)
    const items: OrderItem[] = []
    for (let k = 0; k < n; k++) {
      const p = products[Math.floor(rnd() * products.length)]
      if (items.some((x) => x.title === p.title)) continue
      items.push({ title: p.title, img: p.img, price: Number(p.price.replace(/[^\d.]/g, '')) || 0, qty: 1 + Math.floor(rnd() * 2) })
    }
    const subtotal = items.reduce((a, x) => a + x.price * x.qty, 0)
    const express = rnd() > 0.75
    const shipping = express ? 149 : subtotal >= 999 ? 0 : 79
    const discount = rnd() > 0.8 ? Math.round(subtotal * 0.1) : 0
    const daysAgo = Math.floor(Math.pow(rnd(), 1.15) * 180)
    const d = new Date(Date.now() - daysAgo * 864e5 - Math.floor(rnd() * 864e5 * 0.9))
    const status: OrderStatus =
      daysAgo < 1 ? 'Pending' : daysAgo < 3 ? (rnd() > 0.5 ? 'Confirmed' : 'Pending') : daysAgo < 7 ? 'Shipped' : rnd() > 0.1 ? 'Delivered' : 'Cancelled'
    orders.push({
      id: 'IW' + String(40211000 + i * 37),
      date: d.toISOString(),
      customer: { name, email: name.toLowerCase().replace(' ', '.') + '@gmail.com', phone: '9' + String(800000000 + Math.floor(rnd() * 99999999)) },
      address: `${10 + Math.floor(rnd() * 200)}, ${['MG Road', 'Park Street', 'Linking Road', 'Anna Salai', 'Residency Road'][i % 5]}`,
      city, state, pickup: false, method: express ? 'Express' : 'Standard', items, subtotal, discount, shipping,
      total: subtotal - discount + shipping, code: discount ? 'WILD10' : null, payment: 'Cash on Delivery', status, notes: '',
    })
  }
  orders.sort((a, b) => b.date.localeCompare(a.date))
  const topics = ['Order & delivery', 'Returns', 'Product advice', 'Wholesale', 'Press']
  const texts = [
    'Hi, my order has not been dispatched yet. Could you share an update on the delivery date?',
    'The bottle cap arrived cracked. Can I get a replacement? Attaching my order number.',
    'Which oil would you recommend for dry, frizzy hair? I have a sensitive scalp.',
    'We run a boutique salon in Goa and would love to stock your range. Please share wholesale terms.',
    'I am writing a feature on Ayurvedic brands for a lifestyle magazine — could we set up a call?',
    'Is the Champi oil safe to use during pregnancy?',
  ]
  const messages: Message[] = texts.map((t, i) => {
    const [name] = names[(i * 3) % names.length]
    return {
      id: 'M' + (1000 + i), date: new Date(Date.now() - i * 864e5 * 1.7 - 36e5 * (i + 2)).toISOString(),
      name, email: name.toLowerCase().replace(' ', '.') + '@gmail.com', phone: '', order: i < 2 ? orders[i + 3]?.id ?? '' : '',
      topic: topics[i % topics.length], message: t, read: i > 2, starred: i === 3, archived: false,
    }
  })
  return { orders, messages }
}

function load(): State {
  try {
    const raw = typeof window === 'undefined' ? null : localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return seed()
}

let state: State = load()
const subs = new Set<() => void>()
const commit = (next: State) => {
  state = next
  try { if (typeof window !== 'undefined') localStorage.setItem(KEY, JSON.stringify(state)) } catch {}
  subs.forEach((f) => f())
}

export function useStore() {
  return useSyncExternalStore((f) => (subs.add(f), () => subs.delete(f)), () => state)
}

export const store = {
  addOrder: (o: Order) => commit({ ...state, orders: [o, ...state.orders] }),
  updateOrder: (id: string, patch: Partial<Order>) =>
    commit({ ...state, orders: state.orders.map((o) => (o.id === id ? { ...o, ...patch } : o)) }),
  deleteOrder: (id: string) => commit({ ...state, orders: state.orders.filter((o) => o.id !== id) }),
  addMessage: (m: Omit<Message, 'id' | 'date' | 'read' | 'starred' | 'archived'>) =>
    commit({
      ...state,
      messages: [{ ...m, id: 'M' + Date.now(), date: new Date().toISOString(), read: false, starred: false, archived: false }, ...state.messages],
    }),
  updateMessage: (id: string, patch: Partial<Message>) =>
    commit({ ...state, messages: state.messages.map((m) => (m.id === id ? { ...m, ...patch } : m)) }),
  deleteMessage: (id: string) => commit({ ...state, messages: state.messages.filter((m) => m.id !== id) }),
  reset: () => commit(seed()),
}
