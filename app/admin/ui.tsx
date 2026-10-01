'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { Icon } from '@iconify/react'
import { store, ORDER_STATUSES, type Order, type OrderStatus } from '@/lib/store'

export const inr = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN')
export const fmtDate = (s: string) => new Date(s).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
export const fmtTime = (s: string) => new Date(s).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })
export const ago = (s: string) => {
  const m = Math.floor((Date.now() - +new Date(s)) / 6e4)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  if (m < 1440) return `${Math.floor(m / 60)}h ago`
  return `${Math.floor(m / 1440)}d ago`
}
export const initials = (n: string) => n.split(' ').map((x) => x[0]).slice(0, 2).join('').toUpperCase()

export const STATUS_STYLE: Record<OrderStatus, string> = {
  Pending: 'bg-[#f6ecd6] text-[#8a6a22]',
  Confirmed: 'bg-[#e3ebf3] text-[#2f5575]',
  Shipped: 'bg-[#ece6f3] text-[#5b4480]',
  Delivered: 'bg-green-soft text-green-dark',
  Cancelled: 'bg-[#f5e1de] text-[#9b3a2e]',
}
export const STATUS_DOT: Record<OrderStatus, string> = {
  Pending: '#c79a3a', Confirmed: '#4f7ca3', Shipped: '#7d63a6', Delivered: '#315c45', Cancelled: '#b85445',
}

export type Tab = 'overview' | 'orders' | 'messages' | 'password'
export const TAB_PATH: Record<Tab, string> = { overview: '/admin', orders: '/admin/orders', messages: '/admin/messages', password: '/admin/password' }
export type Range = 7 | 30 | 90

export function download(name: string, rows: (string | number)[][]) {
  const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
  a.download = name
  a.click()
}

/* ---------- primitives ---------- */

export function Badge({ s }: { s: OrderStatus }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${STATUS_STYLE[s]}`}>
      <span className="size-1.5 rounded-full" style={{ background: STATUS_DOT[s] }} />
      {s}
    </span>
  )
}

export function Card({ title, action, children, className = '' }: { title?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`min-w-0 rounded-2xl border border-ink/8 bg-white p-4 sm:p-5 md:p-6 ${className}`}>
      {title && (
        <header className="mb-5 flex items-center justify-between gap-3">
          <h3 className="text-[15px] font-medium text-ink">{title}</h3>
          {action}
        </header>
      )}
      {children}
    </section>
  )
}

export function Stat({ label, value, delta, icon, spark }: { label: string; value: string; delta?: number; icon: string; spark?: number[] }) {
  const max = Math.max(1, ...(spark ?? [1]))
  return (
    <div className="relative min-w-0 overflow-hidden rounded-2xl border border-ink/8 bg-white p-4 sm:p-5">
      <div className="flex items-start justify-between">
        <span className="grid size-10 place-items-center rounded-xl bg-cream text-green">
          <Icon icon={icon} className="size-5" />
        </span>
        {delta !== undefined && Number.isFinite(delta) && (
          <span className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-medium ${delta >= 0 ? 'bg-green-soft text-green-dark' : 'bg-[#f5e1de] text-[#9b3a2e]'}`}>
            <Icon icon={delta >= 0 ? 'solar:arrow-right-up-linear' : 'solar:arrow-right-down-linear'} className="size-3" />
            {Math.abs(delta).toFixed(0)}%
          </span>
        )}
      </div>
      <p className="mt-4 truncate text-[11px] uppercase tracking-[0.12em] text-ink/55 sm:text-[12px]">{label}</p>
      <p className="font-serif-display mt-1 truncate text-[22px] leading-none sm:text-[30px] text-ink tabular-nums">{value}</p>
      {spark && (
        <div className="mt-4 flex h-8 items-end gap-[3px]">
          {spark.map((v, i) => (
            <span key={i} className="flex-1 rounded-sm bg-green/15" style={{ height: `${Math.max(8, (v / max) * 100)}%` }}>
              <span className="block size-full rounded-sm bg-green" style={{ opacity: i === spark.length - 1 ? 1 : 0.35 }} />
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export function Empty({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex flex-col items-center py-14 text-center text-ink/50">
      <Icon icon={icon} className="size-10" />
      <p className="mt-3 text-[14px]">{text}</p>
    </div>
  )
}

/* ---------- charts ---------- */

export function RevenueChart({ days }: { days: { label: string; revenue: number; orders: number }[] }) {
  const [hover, setHover] = useState<number | null>(null)
  const max = Math.max(1, ...days.map((d) => d.revenue))
  const W = 100, H = 100
  const pts = days.map((d, i) => [(i / Math.max(1, days.length - 1)) * W, H - (d.revenue / max) * 88 - 4] as const)
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0]},${p[1]}`).join(' ')
  const area = `${line} L${W},${H} L0,${H} Z`
  const h = hover !== null ? days[hover] : null
  return (
    <div>
      <div className="relative h-[240px]" onMouseLeave={() => setHover(null)}>
        <div className="absolute inset-0 flex flex-col justify-between">
          {[0, 1, 2, 3].map((i) => <div key={i} className="border-t border-dashed border-ink/8" />)}
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="absolute inset-0 size-full overflow-visible">
          <defs>
            <linearGradient id="rev" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#315c45" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#315c45" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={area} fill="url(#rev)" />
          <path d={line} fill="none" stroke="#315c45" strokeWidth="1.6" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
        </svg>
        <div className="absolute inset-0 flex">
          {days.map((_, i) => <div key={i} className="flex-1" onMouseEnter={() => setHover(i)} />)}
        </div>
        {hover !== null && (
          <>
            <div className="pointer-events-none absolute inset-y-0 w-px bg-ink/20" style={{ left: `${(pts[hover][0] / W) * 100}%` }} />
            <div
              className="pointer-events-none absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-green shadow"
              style={{ left: `${(pts[hover][0] / W) * 100}%`, top: `${(pts[hover][1] / H) * 100}%` }}
            />
            <div
              className="pointer-events-none absolute top-0 z-10 -translate-x-1/2 rounded-lg bg-ink px-3 py-2 text-[12px] text-white shadow-lg"
              style={{ left: `clamp(60px, ${(pts[hover][0] / W) * 100}%, calc(100% - 60px))` }}
            >
              <p className="text-white/60">{h!.label}</p>
              <p className="font-medium">{inr(h!.revenue)} · {h!.orders} orders</p>
            </div>
          </>
        )}
      </div>
      <div className="mt-3 flex justify-between text-[11px] text-ink/45">
        {days.filter((_, i) => i % Math.ceil((days.length - 1) / 5) === 0 || i === days.length - 1).slice(-6).map((d, i) => (
          <span key={d.label} className={i % 2 ? 'hidden sm:inline' : ''}>{d.label}</span>
        ))}
      </div>
    </div>
  )
}

export function Donut({ data }: { data: { label: OrderStatus; value: number }[] }) {
  const total = data.reduce((a, d) => a + d.value, 0) || 1
  let acc = 0
  const R = 42, C = 2 * Math.PI * R
  return (
    <div className="flex items-center gap-6">
      <div className="relative size-[140px] shrink-0">
        <svg viewBox="0 0 100 100" className="size-full -rotate-90">
          <circle cx="50" cy="50" r={R} fill="none" stroke="#f1eee4" strokeWidth="12" />
          {data.map((d) => {
            const len = (d.value / total) * C
            const el = <circle key={d.label} cx="50" cy="50" r={R} fill="none" stroke={STATUS_DOT[d.label]} strokeWidth="12" strokeDasharray={`${Math.max(0, len - 1.5)} ${C}`} strokeDashoffset={-acc} />
            acc += len
            return el
          })}
        </svg>
        <div className="absolute inset-0 grid place-items-center text-center">
          <div>
            <p className="font-serif-display text-[26px] leading-none text-ink">{total}</p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-ink/50">orders</p>
          </div>
        </div>
      </div>
      <ul className="flex-1 space-y-2.5 text-[13px]">
        {data.map((d) => (
          <li key={d.label} className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-ink/75"><span className="size-2 rounded-full" style={{ background: STATUS_DOT[d.label] }} />{d.label}</span>
            <span className="tabular-nums text-ink">{d.value} <span className="text-ink/40">· {Math.round((d.value / total) * 100)}%</span></span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ---------- order drawer ---------- */

export function OrderDrawer({ order, onClose }: { order: Order | null; onClose: () => void }) {
  const [notes, setNotes] = useState('')
  useEffect(() => setNotes(order?.notes ?? ''), [order?.id])
  const o = order
  const steps: OrderStatus[] = ['Pending', 'Confirmed', 'Shipped', 'Delivered']
  const idx = o ? steps.indexOf(o.status) : -1
  return (
    <>
      <div onClick={onClose} className={`fixed inset-0 z-40 bg-ink/30 transition-opacity ${o ? 'opacity-100' : 'pointer-events-none opacity-0'}`} />
      <aside className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-[480px] flex-col bg-white shadow-2xl transition-transform duration-300 ${o ? 'translate-x-0' : 'translate-x-full'}`}>
        {o && (
          <>
            <header className="flex items-start justify-between border-b border-ink/10 px-6 py-5">
              <div>
                <p className="text-[12px] uppercase tracking-[0.14em] text-ink/50">Order</p>
                <h3 className="font-serif-display mt-1 text-[26px] text-ink">#{o.id}</h3>
                <p className="mt-1 text-[13px] text-ink/60">{fmtDate(o.date)} at {fmtTime(o.date)}</p>
              </div>
              <button onClick={onClose} aria-label="Close" className="grid size-9 place-items-center rounded-full hover:bg-cream"><Icon icon="solar:close-circle-linear" className="size-6" /></button>
            </header>
            <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
              {/* timeline */}
              {o.status === 'Cancelled' ? (
                <div className="rounded-xl bg-[#f5e1de] px-4 py-3 text-[13px] text-[#9b3a2e]">This order was cancelled.</div>
              ) : (
                <ol className="flex items-center">
                  {steps.map((s, i) => (
                    <li key={s} className="flex flex-1 flex-col items-center gap-2 text-center last:flex-none">
                      <div className="flex w-full items-center">
                        <span className={`grid size-7 shrink-0 place-items-center rounded-full text-[11px] ${i <= idx ? 'bg-green text-white' : 'bg-cream text-ink/40'}`}>
                          {i < idx ? <Icon icon="solar:check-read-linear" className="size-4" /> : i + 1}
                        </span>
                        {i < steps.length - 1 && <span className={`h-[2px] flex-1 ${i < idx ? 'bg-green' : 'bg-cream'}`} />}
                      </div>
                      <span className={`-ml-4 self-start text-[11px] ${i <= idx ? 'text-ink' : 'text-ink/40'}`}>{s}</span>
                    </li>
                  ))}
                </ol>
              )}

              <div>
                <label className="text-[12px] uppercase tracking-[0.12em] text-ink/50">Update status</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {ORDER_STATUSES.map((s) => (
                    <button key={s} onClick={() => store.updateOrder(o.id, { status: s })} className={`rounded-full border px-3 py-1.5 text-[12px] transition-colors ${o.status === s ? 'border-ink bg-ink text-white' : 'border-ink/15 text-ink hover:border-ink/40'}`}>{s}</button>
                  ))}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-cream-soft p-4">
                  <p className="text-[11px] uppercase tracking-[0.12em] text-ink/50">Customer</p>
                  <p className="mt-2 text-[14px] font-medium text-ink">{o.customer.name}</p>
                  <a href={`mailto:${o.customer.email}`} className="mt-1 block truncate text-[13px] text-ink/70 hover:text-green">{o.customer.email}</a>
                  <a href={`tel:+91${o.customer.phone}`} className="mt-0.5 block text-[13px] text-ink/70 hover:text-green">+91 {o.customer.phone}</a>
                </div>
                <div className="rounded-xl bg-cream-soft p-4">
                  <p className="text-[11px] uppercase tracking-[0.12em] text-ink/50">{o.pickup ? 'Pickup' : 'Ship to'}</p>
                  <p className="mt-2 text-[13px] leading-relaxed text-ink">{o.address}<br />{o.city}{o.state && `, ${o.state}`}</p>
                  <p className="mt-1 text-[12px] text-ink/55">{o.method} · {o.payment}</p>
                </div>
              </div>

              <div>
                <p className="text-[12px] uppercase tracking-[0.12em] text-ink/50">Items ({o.items.reduce((a, i) => a + i.qty, 0)})</p>
                <ul className="mt-3 divide-y divide-ink/8">
                  {o.items.map((i) => (
                    <li key={i.title} className="flex items-center gap-3 py-3">
                      <img src={i.img} alt="" className="size-12 rounded-lg bg-cream object-cover" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-medium text-ink">{i.title}</p>
                        <p className="text-[12px] text-ink/55">{inr(i.price)} × {i.qty}</p>
                      </div>
                      <span className="text-[13px] tabular-nums text-ink">{inr(i.price * i.qty)}</span>
                    </li>
                  ))}
                </ul>
                <dl className="mt-2 space-y-1.5 border-t border-ink/10 pt-3 text-[13px] text-ink/75">
                  <div className="flex justify-between"><dt>Subtotal</dt><dd>{inr(o.subtotal)}</dd></div>
                  {o.discount > 0 && <div className="flex justify-between text-green"><dt>Discount {o.code && `(${o.code})`}</dt><dd>-{inr(o.discount)}</dd></div>}
                  <div className="flex justify-between"><dt>Shipping</dt><dd>{o.shipping ? inr(o.shipping) : 'Free'}</dd></div>
                  <div className="flex justify-between pt-1 text-[15px] font-semibold text-ink"><dt>Total (COD)</dt><dd>{inr(o.total)}</dd></div>
                </dl>
              </div>

              <div>
                <label htmlFor="notes" className="text-[12px] uppercase tracking-[0.12em] text-ink/50">Internal notes</label>
                <textarea id="notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} onBlur={() => store.updateOrder(o.id, { notes })} placeholder="Add a note for your team…" className="mt-2 w-full resize-none rounded-xl border border-ink/15 bg-white p-3 text-[13px] outline-none focus:border-ink" />
              </div>
            </div>
            <footer className="flex gap-2 border-t border-ink/10 px-6 py-4">
              <button onClick={() => window.print()} className="flex h-11 flex-1 items-center justify-center gap-2 rounded-full border border-ink/20 text-[13px] text-ink hover:border-ink"><Icon icon="solar:printer-linear" className="size-4" />Print invoice</button>
              <button
                onClick={() => { if (confirm(`Delete order #${o.id}?`)) { store.deleteOrder(o.id); onClose() } }}
                className="grid size-11 place-items-center rounded-full border border-ink/20 text-[#9b3a2e] hover:border-[#9b3a2e]"
                aria-label="Delete order"
              >
                <Icon icon="solar:trash-bin-trash-linear" className="size-4" />
              </button>
            </footer>
          </>
        )}
      </aside>
    </>
  )
}

/* ---------- views ---------- */


export function OrdersTable({ orders, openOrder, compact, selected, setSelected }: {
  orders: Order[]; openOrder: (o: Order) => void; compact?: boolean; selected?: Set<string>; setSelected?: (s: Set<string>) => void
}) {
  if (!orders.length) return <Empty icon="solar:box-minimalistic-linear" text="No orders match your filters" />
  const allSel = !!selected && orders.every((o) => selected.has(o.id))
  return (
    <div className="-mx-5 overflow-x-auto md:-mx-6">
      <table className="w-full min-w-[760px] text-left text-[13px]">
        <thead>
          <tr className="border-y border-ink/8 bg-cream-soft/60 text-[11px] uppercase tracking-[0.1em] text-ink/50">
            {!compact && setSelected && (
              <th className="w-10 py-3 pl-5 md:pl-6">
                <input type="checkbox" checked={allSel} onChange={() => setSelected(allSel ? new Set() : new Set(orders.map((o) => o.id)))} className="size-4 accent-[#24382d]" />
              </th>
            )}
            <th className={`py-3 font-medium ${compact || !setSelected ? 'pl-5 md:pl-6' : ''}`}>Order</th>
            <th className="py-3 font-medium">Customer</th>
            <th className="py-3 font-medium">Date</th>
            <th className="py-3 font-medium">Items</th>
            <th className="py-3 font-medium">Status</th>
            <th className="py-3 font-medium">Payment</th>
            <th className="py-3 pr-5 text-right font-medium md:pr-6">Total</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} onClick={() => openOrder(o)} className="cursor-pointer border-b border-ink/6 transition-colors last:border-0 hover:bg-cream-soft">
              {!compact && setSelected && selected && (
                <td className="py-3.5 pl-5 md:pl-6" onClick={(e) => e.stopPropagation()}>
                  <input type="checkbox" checked={selected.has(o.id)} onChange={() => { const n = new Set(selected); n.has(o.id) ? n.delete(o.id) : n.add(o.id); setSelected(n) }} className="size-4 accent-[#24382d]" />
                </td>
              )}
              <td className={`py-3.5 font-medium text-ink ${compact || !setSelected ? 'pl-5 md:pl-6' : ''}`}>#{o.id}</td>
              <td className="py-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-cream text-[11px] font-medium text-ink">{initials(o.customer.name)}</span>
                  <div className="min-w-0">
                    <p className="truncate text-ink">{o.customer.name}</p>
                    <p className="truncate text-[11px] text-ink/50">{o.city}</p>
                  </div>
                </div>
              </td>
              <td className="py-3.5 text-ink/70">{fmtDate(o.date)}<span className="block text-[11px] text-ink/45">{fmtTime(o.date)}</span></td>
              <td className="py-3.5">
                <div className="flex -space-x-2">
                  {o.items.slice(0, 3).map((i) => <img key={i.title} src={i.img} alt="" className="size-7 rounded-full border-2 border-white bg-cream object-cover" />)}
                  {o.items.length > 3 && <span className="grid size-7 place-items-center rounded-full border-2 border-white bg-cream text-[10px]">+{o.items.length - 3}</span>}
                </div>
              </td>
              <td className="py-3.5"><Badge s={o.status} /></td>
              <td className="py-3.5 text-ink/70">COD</td>
              <td className="py-3.5 pr-5 text-right font-medium tabular-nums text-ink md:pr-6">{inr(o.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

