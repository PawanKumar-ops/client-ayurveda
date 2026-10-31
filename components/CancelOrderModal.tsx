import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Icon } from '@iconify/react'
import type { Order } from '@/lib/order-types'
import { cancelTrackedOrder } from '@/lib/orders-client'

const inr = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN')

const REASONS = [
  { r: 'Ordered by mistake', i: 'solar:undo-left-round-linear' },
  { r: 'Found a better price', i: 'solar:tag-price-linear' },
  { r: 'Delivery takes too long', i: 'solar:clock-circle-linear' },
  { r: 'Change items or address', i: 'solar:pen-new-square-linear' },
  { r: 'Other', i: 'solar:menu-dots-linear' },
]

export default function CancelOrderModal({ order: o, contact, open, onClose, onCancelled }: {
  order: Order; contact: string; open: boolean; onClose: () => void; onCancelled: (o: Order) => void
}) {
  const [reason, setReason] = useState('')
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return
    setReason('')
    setNote('')
    setError('')
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  if (!open) return null

  const count = o.items.reduce((a, i) => a + i.qty, 0)
  const valid = reason && (reason !== 'Other' || note.trim().length > 2)
  const confirmCancel = async () => {
    setBusy(true)
    setError('')
    const why = reason === 'Other' ? note.trim() : reason + (note.trim() ? ` (${note.trim()})` : '')
    try {
      onCancelled(await cancelTrackedOrder(o.id, contact, why))
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not cancel the order.')
    } finally {
      setBusy(false)
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby="cancel-title">
      <div onClick={() => !busy && onClose()} className="absolute inset-0 animate-[fadeIn_.25s_ease] bg-[#162b21]/60 backdrop-blur-[2px]" />

      <div className="relative flex max-h-[94dvh] w-full animate-[sheetUp_.35s_cubic-bezier(.2,.8,.2,1)] flex-col overflow-hidden rounded-t-[28px] bg-white shadow-[0_-20px_60px_-20px_rgba(22,43,33,0.4)] sm:max-w-[520px] sm:animate-[fadeIn_.25s_ease] sm:rounded-[28px]">
        {/* header */}
        <div className="relative bg-cream px-6 pb-6 pt-3 sm:px-8 sm:pt-8">
          <span className="mx-auto mb-5 block h-1 w-10 rounded-full bg-ink/20 sm:hidden" />
          <button onClick={onClose} disabled={busy} aria-label="Close" className="absolute right-4 top-4 grid size-9 place-items-center rounded-full bg-white/70 text-ink/60 transition-colors hover:bg-white hover:text-ink sm:right-5 sm:top-5">
            <Icon icon="solar:close-linear" className="size-5" />
          </button>
          <p className="text-[11px] uppercase tracking-[0.18em] text-ink/55">Order #{o.id}</p>
          <h2 id="cancel-title" className="font-serif-display mt-2 pr-10 text-[30px] leading-[1.1] text-ink">
            Cancel this <em className="text-[#9b3a2e]">order?</em>
          </h2>

          <div className="mt-5 flex items-center gap-4 rounded-2xl bg-white p-3 pr-4">
            <div className="flex shrink-0 -space-x-3">
              {o.items.slice(0, 3).map((it) => (
                <img key={it.title} src={it.img} alt="" className="size-12 rounded-xl border-2 border-white bg-cream-soft object-cover" />
              ))}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[14px] font-medium text-ink">{o.items[0].title}{o.items.length > 1 && ` + ${o.items.length - 1} more`}</p>
              <p className="text-[12px] text-ink/55">{count} item{count > 1 ? 's' : ''} · Cash on Delivery</p>
            </div>
            <p className="font-serif-display shrink-0 text-[20px] text-ink">{inr(o.total)}</p>
          </div>
        </div>

        {/* body */}
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-8">
          <p className="text-[13px] font-medium text-ink">Why are you cancelling?</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {REASONS.map(({ r, i }) => {
              const on = reason === r
              return (
                <button key={r} type="button" onClick={() => setReason(r)} aria-pressed={on}
                  className={`flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[13px] transition-all ${on ? 'border-ink bg-ink text-white' : 'border-ink/15 text-ink/80 hover:border-ink/40 hover:text-ink'}`}>
                  <Icon icon={on ? 'solar:check-circle-bold' : i} className="size-4" />{r}
                </button>
              )
            })}
          </div>

          {reason && (
            <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} maxLength={240} autoFocus={reason === 'Other'}
              placeholder={reason === 'Other' ? 'Tell us a little more…' : 'Anything else? (optional)'}
              className="mt-4 w-full animate-[fadeIn_.25s_ease] resize-none rounded-2xl border border-ink/15 bg-cream-soft/60 px-4 py-3 text-[14px] text-ink outline-none transition-colors placeholder:text-ink/40 focus:border-ink focus:bg-white" />
          )}

          <ul className="mt-5 space-y-2.5 text-[13px] text-ink/65">
            <li className="flex gap-2.5"><Icon icon="solar:shield-check-linear" className="mt-px size-[18px] shrink-0 text-green" />Nothing is charged — it’s Cash on Delivery.</li>
            <li className="flex gap-2.5"><Icon icon="solar:danger-triangle-linear" className="mt-px size-[18px] shrink-0 text-accent" />This can’t be undone. You can always place a new order.</li>
          </ul>
        </div>

        {/* footer */}
        {error && <p role="alert" className="mx-6 mb-2 rounded-xl bg-[#f5e1de] px-3.5 py-2.5 text-[13px] text-[#9b3a2e] sm:mx-8">{error}</p>}
        <div className="grid grid-cols-2 gap-2.5 border-t border-ink/8 px-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4 sm:px-8 sm:pb-6">
          <button onClick={onClose} disabled={busy} className="h-12 rounded-full bg-green text-[12px] font-medium uppercase tracking-[0.14em] text-white transition-colors hover:bg-green-dark">
            Keep order
          </button>
          <button onClick={confirmCancel} disabled={!valid || busy}
            className="flex h-12 items-center justify-center gap-2 rounded-full border border-[#9b3a2e]/50 text-[12px] font-medium uppercase tracking-[0.14em] text-[#9b3a2e] transition-colors enabled:hover:bg-[#9b3a2e] enabled:hover:text-white disabled:border-ink/10 disabled:text-ink/30">
            {busy ? <><Icon icon="solar:refresh-linear" className="size-4 animate-spin" />Cancelling</> : 'Cancel order'}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
