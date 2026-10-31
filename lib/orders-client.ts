import type { Order, OrderStatus } from '@/lib/order-types'

export const ordersQueryKey = ['orders'] as const

async function request<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, { ...init, headers: { 'Content-Type': 'application/json', ...init?.headers } })
  const body = (await res.json().catch(() => ({}))) as T & { error?: string }
  if (!res.ok) throw new Error(body.error || `Request failed (${res.status})`)
  return body
}

export const fetchOrders = () => request<Order[]>('/api/orders')

export const updateOrder = (id: string, patch: { status?: OrderStatus; notes?: string }) =>
  request<Order>(`/api/orders/${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify(patch) })

export const deleteOrder = (id: string) => request<{ id: string }>(`/api/orders/${encodeURIComponent(id)}`, { method: 'DELETE' })

export type PlaceOrderInput = {
  customer: { firstname: string; lastname: string; email: string; phone: string }
  address: { address1: string; address2: string; city: string; state: string; postalcode: string }
  items: { title: string; qty: number }[]
}
export const placeOrder = (input: PlaceOrderInput) =>
  request<{ order: Order; emailSent: boolean }>('/api/orders', { method: 'POST', body: JSON.stringify(input) })

export const trackOrder = (id: string, contact: string) =>
  request<Order>('/api/orders/track', { method: 'POST', body: JSON.stringify({ id, contact }) })

export const cancelTrackedOrder = (id: string, contact: string, reason: string) =>
  request<Order>('/api/orders/track/cancel', { method: 'POST', body: JSON.stringify({ id, contact, reason }) })
