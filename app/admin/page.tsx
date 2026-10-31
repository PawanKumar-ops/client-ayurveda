'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Icon } from '@iconify/react'
import type { Order } from '@/lib/order-types'
import type { MessageRecord as Message } from '@/lib/message-model'
import { ago, initials, type Range, Card, Stat, Empty, OrdersTable, TAB_PATH } from './ui'
import AdminLayout from './AdminLayout'

function Overview({ orders, messages, range, openOrder }: { orders: Order[]; messages: Message[]; range: Range; openOrder: (o: Order) => void;  }) {
  const router = useRouter()
  const now = Date.now()
  const inRange = (o: Order, from: number, to: number) => { const t = +new Date(o.date); return t >= from && t < to }
  const cur = orders.filter((o) => inRange(o, now - range * 864e5, now + 1) && o.status !== 'Cancelled')
  const prev = orders.filter((o) => inRange(o, now - 2 * range * 864e5, now - range * 864e5) && o.status !== 'Cancelled')
  const pct = (a: number, b: number) => (b ? ((a - b) / b) * 100 : NaN)
  const customers = new Set(cur.map((o) => o.customer.email)).size
  const prevCustomers = new Set(prev.map((o) => o.customer.email)).size
  const spark = useMemo(() => Array.from({ length: 12 }, (_, i) => {
    const key = new Date(now - (11 - i) * 864e5).toDateString()
    return orders.filter((o) => new Date(o.date).toDateString() === key && o.status !== 'Cancelled').length
  }), [orders])
  const pending = orders.filter((o) => o.status === 'Pending')
  const unread = messages.filter((m) => !m.read && !m.archived)

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <Stat label="Orders" value={String(cur.length)} delta={pct(cur.length, prev.length)} icon="solar:box-linear" spark={spark} />
        <Stat label="Customers" value={String(customers)} delta={pct(customers, prevCustomers)} icon="solar:users-group-rounded-linear" />
      </div>

      {(pending.length > 0 || unread.length > 0) && (
        <div className="grid gap-3 md:grid-cols-2">
          {pending.length > 0 && (
            <button onClick={() => router.push(TAB_PATH.orders)} className="flex items-center gap-4 rounded-2xl bg-[#f6ecd6] px-5 py-4 text-left text-[#6f5419] transition-transform hover:-translate-y-0.5">
              <Icon icon="solar:bell-bing-linear" className="size-6 shrink-0" />
              <span className="flex-1 text-[14px]"><strong className="font-semibold">{pending.length} orders</strong> awaiting confirmation</span>
              <Icon icon="solar:arrow-right-linear" className="size-5" />
            </button>
          )}
          {unread.length > 0 && (
            <button onClick={() => router.push(TAB_PATH.messages)} className="flex items-center gap-4 rounded-2xl bg-green-soft px-5 py-4 text-left text-green-dark transition-transform hover:-translate-y-0.5">
              <Icon icon="solar:letter-unread-linear" className="size-6 shrink-0" />
              <span className="flex-1 text-[14px]"><strong className="font-semibold">{unread.length} unread</strong> customer messages</span>
              <Icon icon="solar:arrow-right-linear" className="size-5" />
            </button>
          )}
        </div>
      )}

      <div className="grid gap-5">
        <Card title="Latest messages" action={<button onClick={() => router.push(TAB_PATH.messages)} className="text-[12px] text-green underline underline-offset-4">View all</button>}>
          {messages.length ? (
            <ul className="space-y-4">
              {messages.filter((m) => !m.archived).slice(0, 4).map((m) => (
                <li key={m.id} className="flex gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-cream text-[12px] font-medium text-ink">{initials(m.name)}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`truncate text-[13px] ${m.read ? 'text-ink/70' : 'font-semibold text-ink'}`}>{m.name}</span>
                      <span className="shrink-0 text-[11px] text-ink/45">{ago(m.date)}</span>
                    </div>
                    <p className="truncate text-[12px] text-ink/55">{m.message}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : <Empty icon="solar:inbox-linear" text="No messages yet" />}
        </Card>
      </div>

      <Card title="Recent orders" action={<button onClick={() => router.push(TAB_PATH.orders)} className="text-[12px] text-green underline underline-offset-4">View all</button>}>
        <OrdersTable orders={orders.slice(0, 6)} openOrder={openOrder} compact />
      </Card>
    </div>
  )
}



export default function AdminOverviewPage() {
  return <AdminLayout tab="overview">{({ orders, messages, range, openOrder }) => <Overview orders={orders} messages={messages} range={range} openOrder={openOrder} />}</AdminLayout>
}
