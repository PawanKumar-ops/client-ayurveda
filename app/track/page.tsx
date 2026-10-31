"use client"

import { useEffect, useState } from 'react'
import { Icon } from '@iconify/react'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CartDrawer from '@/components/CartDrawer'
import CancelOrderModal from '@/components/CancelOrderModal'
import { TRACKING_ID_PATTERN, normalizeTrackingId as normId, publicImageSrc, type Order, type OrderStatus } from '@/lib/order-types'
import { trackOrder } from '@/lib/orders-client'
import Link from 'next/link'

const RECENT_KEY = 'yubhi-track-recent'
const inr = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN')
const day = (d: Date) => d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })
const stamp = (d: Date) => d.toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })
const addDays = (d: Date, n: number) => new Date(+d + n * 864e5)
const STEPS: { s: OrderStatus; label: string; icon: string; note: string }[] = [
  { s: 'Pending', label: 'Order placed', icon: 'solar:bag-check-linear', note: 'We have received your order.' },
  { s: 'Confirmed', label: 'Confirmed', icon: 'solar:clipboard-check-linear', note: 'Your order is confirmed and being packed.' },
  { s: 'Shipped', label: 'Shipped', icon: 'solar:delivery-linear', note: 'Handed to our courier partner.' },
  { s: 'Delivered', label: 'Delivered', icon: 'solar:home-smile-linear', note: 'Delivered — enjoy your ritual.' },
]

function timeline(o: Order) {
  const placed = new Date(o.date)
  const express = o.method === 'Express'
  const at = [placed, addDays(placed, 0.4), addDays(placed, express ? 0.8 : 1.5), addDays(placed, express ? 2 : 5)]
  const reached = o.status === 'Cancelled' ? 0 : STEPS.findIndex((x) => x.s === o.status)
  return { at, reached, eta: addDays(placed, express ? 2 : 6), etaFrom: addDays(placed, express ? 1 : 4) }
}

export default function TrackPage() {
  const [id, setId] = useState('')
  const [contact, setContact] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [order, setOrder] = useState<Order | null>(null)
  const [trackedContact, setTrackedContact] = useState('')
  const [recent, setRecent] = useState<string[]>([])
  const [hydrated, setHydrated] = useState(false)

  // Browser-only URL and local storage state must be loaded after hydration.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setHydrated(true)
    setId(normId(new URLSearchParams(window.location.search).get('id') ?? ''))
    try {
      const saved = JSON.parse(window.localStorage.getItem(RECENT_KEY) ?? '[]')
      if (Array.isArray(saved)) setRecent(saved.filter((value): value is string => typeof value === 'string'))
    } catch (error) {
      console.error('Unable to load recently tracked orders', error)
    }
  }, [])
  /* eslint-enable react-hooks/set-state-in-effect */
  const [copied, setCopied] = useState(false)
  useEffect(() => { document.title = 'Track your order — yubhi ayurveda' }, [])

  const lookup = async (e: React.FormEvent) => {
    e.preventDefault()
    const key = normId(id)
    const c = contact.trim()
    if (!TRACKING_ID_PATTERN.test(key)) return setError('Tracking IDs look like YAK7M2Q9X4PD — please check your confirmation email.')
    if (!c) return setError('Enter the email or mobile number used at checkout.')
    setError('')
    setLoading(true)
    try {
      const o = await trackOrder(key, c)
      setOrder(o)
      setTrackedContact(c)
      history.replaceState(null, '', `/track?id=${o.id}`)
      const next = [o.id, ...recent.filter((r) => r !== o.id)].slice(0, 3)
      setRecent(next)
      localStorage.setItem(RECENT_KEY, JSON.stringify(next))
    } catch (err) {
      setOrder(null)
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const reset = () => { setOrder(null); setContact(''); setTrackedContact(''); history.replaceState(null, '', '/track') }
  const copy = () => { navigator.clipboard?.writeText(order!.id); setCopied(true); setTimeout(() => setCopied(false), 1500) }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="bg-cream print:hidden">
        <div className="mx-auto max-w-[1440px] px-5 py-12 md:px-10 md:py-16">
          <nav className="text-[12px] uppercase tracking-[0.14em] text-ink/60">
            <Link href="/" className="hover:text-ink">Home</Link>
            <span className="mx-2">/</span><span className="text-ink">Track order</span>
          </nav>
          <div className="mt-5 grid items-end gap-6 md:grid-cols-[1.2fr_1fr]">
            <h1 className="font-serif-display text-[40px] leading-[1.05] text-ink md:text-[60px]">
              Where&apos;s my <em className="text-green">order?</em>
            </h1>
            <p className="max-w-[440px] text-[15px] leading-relaxed text-ink/70 md:justify-self-end">
              Enter your order ID and the email or mobile number you used at checkout to see live status, delivery estimate and details.
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-[1440px] px-5 py-10 md:px-10 md:py-14">
        {!order ? (
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-16">
            <form onSubmit={lookup} noValidate className="max-w-[640px]">
              <div className="space-y-4">
                <label className="block">
                  <span className="mb-2 block text-[12px] uppercase tracking-[0.14em] text-ink/60">Tracking ID *</span>
                  <span className="relative block">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[15px] text-ink/40">#</span>
                    <input value={id} onChange={(e) => { setId(e.target.value); setError('') }} placeholder="YAK7M2Q9X4PD" autoComplete="off" spellCheck={false}
                      className="h-14 w-full border border-ink/25 bg-white pl-8 pr-4 text-[15px] uppercase tracking-wide text-ink outline-none transition-colors placeholder:normal-case placeholder:text-ink/35 focus:border-ink" />
                  </span>
                </label>
                <label className="block">
                  <span className="mb-2 block text-[12px] uppercase tracking-[0.14em] text-ink/60">Email or mobile number *</span>
                  <input value={contact} onChange={(e) => { setContact(e.target.value); setError('') }} placeholder="you@example.com or 98XXXXXXXX" autoComplete="email"
                    className="h-14 w-full border border-ink/25 bg-white px-4 text-[15px] text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-ink" />
                </label>
              </div>
              {error && (
                <p role="alert" className="mt-4 flex items-start gap-2 bg-[#f5e1de] px-4 py-3 text-[13px] leading-relaxed text-[#9b3a2e]">
                  <Icon icon="solar:danger-circle-linear" className="mt-0.5 size-4 shrink-0" />{error}
                </p>
              )}
              <button disabled={loading} className="mt-6 flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-green text-[13px] font-medium uppercase tracking-[0.16em] text-white transition-colors hover:bg-green-dark disabled:opacity-70 sm:w-auto sm:px-12">
                {loading ? <><Icon icon="solar:refresh-linear" className="size-4 animate-spin" />Looking up…</> : <>Track order<Icon icon="solar:arrow-right-linear" className="size-4" /></>}
              </button>

              {hydrated && recent.length > 0 && (
                <div className="mt-10">
                  <p className="text-[12px] uppercase tracking-[0.14em] text-ink/60">Recently tracked</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {recent.map((r) => (
                      <button key={r} type="button" onClick={() => { setId(r); setError('') }} className="flex items-center gap-1.5 rounded-full border border-ink/15 px-4 py-2 text-[13px] text-ink hover:border-ink">
                        <Icon icon="solar:history-linear" className="size-4 text-ink/50" />#{r}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </form>

            <aside className="space-y-[3px]">
              {[
                { i: 'solar:letter-linear', t: 'Find your tracking ID', d: 'It’s in your order confirmation email, starting with “YA”.' },
                { i: 'solar:shield-check-linear', t: 'Your details stay private', d: 'We ask for your email or phone so only you can view the order.' },
                { i: 'solar:wallet-money-linear', t: 'Cash on delivery', d: 'Keep the exact amount or UPI ready when your parcel arrives.' },
              ].map((x) => (
                <div key={x.t} className="flex gap-4 bg-cream-soft p-6">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-green-soft text-green"><Icon icon={x.i} className="size-5" /></span>
                  <div><p className="text-[15px] font-medium text-ink">{x.t}</p><p className="mt-1 text-[13px] leading-relaxed text-ink/65">{x.d}</p></div>
                </div>
              ))}
              <Link href="/contact" className="flex items-center justify-between bg-green p-6 text-white transition-colors hover:bg-green-dark">
                <span><span className="block text-[11px] uppercase tracking-[0.14em] text-white/70">Need help?</span><span className="mt-1 block text-[16px]">Contact our care team</span></span>
                <Icon icon="solar:arrow-right-linear" className="size-5" />
              </Link>
            </aside>
          </div>
        ) : (
          <OrderResult order={order} contact={trackedContact} onUpdate={setOrder} copied={copied} copy={copy} reset={reset} />
        )}
      </main>

      <Footer />
      <CartDrawer />
    </div>
  )
}

function OrderResult({ order: o, contact, onUpdate, copied, copy, reset }: { order: Order; contact: string; onUpdate: (o: Order) => void; copied: boolean; copy: () => void; reset: () => void }) {
  const { at, reached, eta, etaFrom } = timeline(o)
  const cancelled = o.status === 'Cancelled'
  const delivered = o.status === 'Delivered'
  const canCancel = o.status === 'Pending' || o.status === 'Confirmed'
  const count = o.items.reduce((a, i) => a + i.qty, 0)
  const progress = cancelled ? 0 : reached / (STEPS.length - 1)
  const [cancelOpen, setCancelOpen] = useState(false)

  return (
    <div className="animate-[fadeIn_.4s_ease]">
      <div className="flex flex-wrap items-center gap-3 print:hidden">
        <button onClick={reset} className="flex items-center gap-1.5 text-[13px] uppercase tracking-[0.14em] text-ink/70 hover:text-ink">
          <Icon icon="solar:arrow-left-linear" className="size-4" />Track another order
        </button>
        <div className="ml-auto flex gap-2">
          <button onClick={() => window.print()} className="flex h-10 items-center gap-1.5 rounded-full border border-ink/20 px-4 text-[12px] uppercase tracking-[0.12em] text-ink hover:border-ink">
            <Icon icon="solar:printer-linear" className="size-4" />Print
          </button>
          <Link href="/contact" className="flex h-10 items-center gap-1.5 rounded-full border border-ink/20 px-4 text-[12px] uppercase tracking-[0.12em] text-ink hover:border-ink">
            <Icon icon="solar:chat-round-line-linear" className="size-4" />Get help
          </Link>
        </div>
      </div>

      {/* status hero */}
      <section className={`mt-6 p-6 md:p-10 ${cancelled ? 'bg-[#f5e1de]' : 'bg-cream'}`}>
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <button onClick={copy} className="flex items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-ink/60 hover:text-ink">
              Order #{o.id}
              <Icon icon={copied ? 'solar:check-read-linear' : 'solar:copy-linear'} className="size-4" />
              {copied && <span className="normal-case tracking-normal text-green">Copied</span>}
            </button>
            <h2 className="font-serif-display mt-3 text-[32px] leading-tight text-ink md:text-[44px]">
              {cancelled ? 'This order was cancelled' : delivered ? <>Delivered on <em className="text-green">{day(at[3])}</em></> : <>Arriving <em className="text-green">{day(etaFrom)} – {day(eta)}</em></>}
            </h2>
            <p className="mt-2 text-[14px] text-ink/65">Placed {stamp(new Date(o.date))} · {count} item{count > 1 ? 's' : ''} · {o.method} delivery</p>
          </div>
          {!cancelled && (
            <div className="bg-white px-5 py-4 sm:text-right">
              <p className="text-[11px] uppercase tracking-[0.14em] text-ink/55">{delivered ? 'Paid on delivery' : 'Amount to pay'}</p>
              <p className="font-serif-display mt-1 text-[28px] leading-none text-ink">{inr(o.total)}</p>
              <p className="mt-1 text-[12px] text-ink/55">Cash / UPI on delivery</p>
            </div>
          )}
        </div>

        {!cancelled && (
          <ol className="relative mt-10 grid grid-cols-1 gap-6 sm:grid-cols-4 sm:gap-0">
            <span className="absolute left-5 top-5 hidden h-[2px] w-[calc(75%)] bg-ink/10 sm:block" />
            <span className="absolute left-5 top-5 hidden h-[2px] bg-green transition-all duration-700 sm:block" style={{ width: `${progress * 75}%` }} />
            <span className="absolute bottom-5 left-[19px] top-5 w-[2px] bg-ink/10 sm:hidden" />
            {STEPS.map((st, i) => {
              const done = i <= reached
              const current = i === reached && !delivered
              return (
                <li key={st.s} className="relative flex gap-4 sm:flex-col sm:gap-3">
                  <span className={`relative z-10 grid size-10 shrink-0 place-items-center rounded-full ring-4 ring-cream ${done ? 'bg-green text-white' : 'bg-white text-ink/35'}`}>
                    {current && <span className="absolute inset-0 animate-ping rounded-full bg-green/30" />}
                    <Icon icon={done && !current && i !== 3 ? 'solar:check-read-linear' : st.icon} className="relative size-5" />
                  </span>
                  <div className="sm:pr-4">
                    <p className={`text-[15px] font-medium ${done ? 'text-ink' : 'text-ink/45'}`}>{st.label}</p>
                    <p className="mt-0.5 text-[12px] text-ink/55">{done ? stamp(at[i]) : i === 3 ? `Expected by ${day(eta)}` : 'Up next'}</p>
                    {i === reached && <p className="mt-1 text-[13px] text-ink/70">{st.note}</p>}
                  </div>
                </li>
              )
            })}
          </ol>
        )}
        {cancelled && (
          <p className="mt-4 max-w-[560px] text-[14px] leading-relaxed text-[#7a2e24]">
            No payment was collected. If you didn’t request this cancellation or want to re-order, our care team is happy to help.
          </p>
        )}
      </section>

      <div className="mt-[3px] grid gap-[3px] lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <section className="bg-cream-soft p-6 md:p-8">
          <h3 className="text-[12px] uppercase tracking-[0.14em] text-ink/60">Items in this order</h3>
          <ul className="mt-5 divide-y divide-ink/10">
            {o.items.map((it) => (
              <li key={it.title} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                <Image src={publicImageSrc(it.img)} alt="" width={80} height={80} className="size-16 shrink-0 bg-white object-cover md:size-20" />
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-[14px] font-medium text-ink">{it.title}</p>
                  <p className="mt-1 text-[13px] text-ink/55">Qty {it.qty} · {inr(it.price)}</p>
                </div>
                <p className="shrink-0 text-[14px] tabular-nums text-ink">{inr(it.price * it.qty)}</p>
              </li>
            ))}
          </ul>
          <dl className="mt-6 space-y-2 border-t border-ink/10 pt-5 text-[14px]">
            <div className="flex justify-between text-ink/70"><dt>Subtotal</dt><dd className="tabular-nums">{inr(o.subtotal)}</dd></div>
            {o.discount > 0 && <div className="flex justify-between text-green"><dt>Discount{o.code && ` (${o.code})`}</dt><dd className="tabular-nums">−{inr(o.discount)}</dd></div>}
            <div className="flex justify-between text-ink/70"><dt>Shipping · {o.method}</dt><dd className="tabular-nums">{o.shipping ? inr(o.shipping) : 'Free'}</dd></div>
            <div className="flex justify-between pt-2 text-[16px] font-medium text-ink"><dt>Total</dt><dd className="tabular-nums">{inr(o.total)}</dd></div>
          </dl>
        </section>

        <div className="grid gap-[3px]">
          <section className="bg-cream-soft p-6 md:p-8">
            <h3 className="text-[12px] uppercase tracking-[0.14em] text-ink/60">{o.pickup ? 'Pickup from' : 'Delivering to'}</h3>
            <p className="mt-3 text-[15px] font-medium text-ink">{o.customer.name}</p>
            <p className="mt-1 text-[14px] leading-relaxed text-ink/70">{o.address}<br />{o.city}, {o.state} {o.postalcode}</p>
            <p className="mt-2 text-[13px] text-ink/55">+91 ••••••{o.customer.phone.slice(-4)}</p>
          </section>
          <section className="bg-cream-soft p-6 md:p-8">
            <h3 className="text-[12px] uppercase tracking-[0.14em] text-ink/60">Payment</h3>
            <p className="mt-3 flex items-center gap-2 text-[15px] text-ink"><Icon icon="solar:hand-money-linear" className="size-5 text-green" />Cash on Delivery</p>
            <p className="mt-1 text-[13px] text-ink/55">{delivered ? 'Payment received. Thank you!' : cancelled ? 'Nothing to pay.' : 'Pay by cash or UPI to the courier.'}</p>
          </section>
          <section className="bg-cream-soft p-6 md:p-8 print:hidden">
            <h3 className="text-[12px] uppercase tracking-[0.14em] text-ink/60">Manage order</h3>
            <div className="mt-4 flex flex-col gap-2">
              {canCancel && (
                <button
                  onClick={() => setCancelOpen(true)}
                  className="flex h-11 items-center justify-center gap-2 rounded-full border border-[#9b3a2e]/40 text-[12px] uppercase tracking-[0.14em] text-[#9b3a2e] hover:bg-[#f5e1de]"
                >
                  <Icon icon="solar:close-circle-linear" className="size-4" />Cancel order
                </button>
              )}
              {delivered && (
                <Link href="/contact" className="flex h-11 items-center justify-center gap-2 rounded-full border border-ink/20 text-[12px] uppercase tracking-[0.14em] text-ink hover:border-ink">
                  <Icon icon="solar:restart-linear" className="size-4" />Request a return
                </Link>
              )}
              <Link href="/shop" className="flex h-11 items-center justify-center rounded-full bg-green text-[12px] uppercase tracking-[0.14em] text-white hover:bg-green-dark">
                Continue shopping
              </Link>
            </div>
            {canCancel && <p className="mt-3 text-[12px] text-ink/50">Orders can be cancelled until they are shipped.</p>}
          </section>
        </div>
      </div>
      <CancelOrderModal order={o} contact={contact} open={cancelOpen} onClose={() => setCancelOpen(false)} onCancelled={onUpdate} />
    </div>
  )
}
