'use client'

import { useEffect, useMemo, useState } from 'react'
import { Icon } from '@iconify/react'
import { pageRange } from '@/lib/pagination'
import { store, ORDER_STATUSES, type Order, type OrderStatus } from '@/lib/store'
import { fmtDate, download, Card, OrdersTable } from '../ui'
import AdminLayout from '../AdminLayout'

function OrdersView({ orders, openOrder, query }: { orders: Order[]; openOrder: (o: Order) => void; query: string }) {
  const [status, setStatus] = useState<OrderStatus | 'All'>('All')
  const [sort, setSort] = useState<'new' | 'old' | 'high' | 'low'>('new')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const PER = 10
  const list = useMemo(() => {
    const q = query.toLowerCase()
    const l = orders.filter((o) => (status === 'All' || o.status === status) && (!q || `${o.id} ${o.customer.name} ${o.customer.email} ${o.customer.phone} ${o.city}`.toLowerCase().includes(q)))
    l.sort((a, b) => sort === 'new' ? b.date.localeCompare(a.date) : sort === 'old' ? a.date.localeCompare(b.date) : sort === 'high' ? b.total - a.total : a.total - b.total)
    return l
  }, [orders, status, sort, query])
  useEffect(() => setPage(1), [status, sort, query])
  const pages = Math.max(1, Math.ceil(list.length / PER))
  const shown = list.slice((page - 1) * PER, page * PER)
  const exportCsv = (rows: Order[]) =>
    download(`orders-${new Date().toISOString().slice(0, 10)}.csv`, [
      ['Order', 'Date', 'Customer', 'Email', 'Phone', 'City', 'State', 'Items', 'Subtotal', 'Discount', 'Shipping', 'Total', 'Status', 'Payment'],
      ...rows.map((o) => [o.id, fmtDate(o.date), o.customer.name, o.customer.email, o.customer.phone, o.city, o.state, o.items.map((i) => `${i.title} x${i.qty}`).join('; '), o.subtotal, o.discount, o.shipping, o.total, o.status, o.payment]),
    ])

  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {(['All', ...ORDER_STATUSES] as const).map((s) => {
            const n = s === 'All' ? orders.length : orders.filter((o) => o.status === s).length
            return (
              <button key={s} onClick={() => setStatus(s)} className={`rounded-full px-3.5 py-1.5 text-[12px] transition-colors ${status === s ? 'bg-ink text-white' : 'bg-cream-soft text-ink hover:bg-cream'}`}>
                {s} <span className={status === s ? 'text-white/60' : 'text-ink/45'}>{n}</span>
              </button>
            )
          })}
        </div>
        <div className="flex items-center gap-2">
          <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className="h-9 rounded-full border border-ink/15 bg-white px-3 text-[12px] text-ink outline-none">
            <option value="new">Newest first</option><option value="old">Oldest first</option><option value="high">Highest value</option><option value="low">Lowest value</option>
          </select>
          <button onClick={() => exportCsv(list)} className="flex h-9 items-center gap-1.5 rounded-full border border-ink/15 px-3.5 text-[12px] text-ink hover:border-ink"><Icon icon="solar:download-minimalistic-linear" className="size-4" />Export</button>
        </div>
      </div>

      {selected.size > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-[12px] text-white">
          <span className="mr-2">{selected.size} selected</span>
          {(['Confirmed', 'Shipped', 'Delivered', 'Cancelled'] as OrderStatus[]).map((s) => (
            <button key={s} onClick={() => { selected.forEach((id) => store.updateOrder(id, { status: s })); setSelected(new Set()) }} className="rounded-full bg-white/10 px-3 py-1 hover:bg-white/20">Mark {s.toLowerCase()}</button>
          ))}
          <button onClick={() => exportCsv(orders.filter((o) => selected.has(o.id)))} className="rounded-full bg-white/10 px-3 py-1 hover:bg-white/20">Export</button>
          <button onClick={() => setSelected(new Set())} className="ml-auto text-white/60 hover:text-white">Clear</button>
        </div>
      )}

      <div className="mt-5">
        <OrdersTable orders={shown} openOrder={openOrder} selected={selected} setSelected={setSelected} />
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-[12px] text-ink/60">
        <span>Showing {list.length ? (page - 1) * PER + 1 : 0}–{Math.min(page * PER, list.length)} of {list.length}</span>
        <div className="flex items-center gap-1">
          <button disabled={page === 1} onClick={() => setPage(page - 1)} className="grid size-8 place-items-center rounded-full border border-ink/15 disabled:opacity-30"><Icon icon="solar:alt-arrow-left-linear" /></button>
          {pageRange(page, pages).map((n) => (
            <button key={n} onClick={() => setPage(n)} className={`size-8 rounded-full ${n === page ? 'bg-ink text-white' : 'hover:bg-cream'}`}>{n}</button>
          ))}
          <button disabled={page === pages} onClick={() => setPage(page + 1)} className="grid size-8 place-items-center rounded-full border border-ink/15 disabled:opacity-30"><Icon icon="solar:alt-arrow-right-linear" /></button>
        </div>
      </div>
    </Card>
  )
}



export default function AdminOrdersPage() {
  return <AdminLayout tab="orders">{({ orders, openOrder, query }) => <OrdersView orders={orders} openOrder={openOrder} query={query} />}</AdminLayout>
}
