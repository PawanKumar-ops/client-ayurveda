import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { Icon } from '@iconify/react'

export type CartProduct = { title: string; price: string; old?: string; img: string }
export type CartItem = CartProduct & { qty: number }

type CartCtx = {
  items: CartItem[]
  count: number
  subtotal: number
  open: boolean
  setOpen: (v: boolean) => void
  add: (p: CartProduct) => void
  setQty: (title: string, qty: number) => void
  remove: (title: string) => void
}

const Ctx = createContext<CartCtx | null>(null)

export const toNum = (s?: string) => Number((s ?? '').replace(/[^\d.]/g, '')) || 0
export const inr = (n: number) => '₹' + n.toLocaleString('en-IN')

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [open, setOpen] = useState(false)

  const add = (p: CartProduct) => {
    setItems((prev) => {
      const hit = prev.find((i) => i.title === p.title)
      return hit
        ? prev.map((i) => (i.title === p.title ? { ...i, qty: i.qty + 1 } : i))
        : [...prev, { ...p, qty: 1 }]
    })
    setOpen(true)
  }
  const setQty = (title: string, qty: number) =>
    setItems((prev) =>
      qty <= 0 ? prev.filter((i) => i.title !== title) : prev.map((i) => (i.title === title ? { ...i, qty } : i)),
    )
  const remove = (title: string) => setItems((prev) => prev.filter((i) => i.title !== title))

  const count = items.reduce((a, i) => a + i.qty, 0)
  const subtotal = items.reduce((a, i) => a + toNum(i.price) * i.qty, 0)

  return (
    <Ctx.Provider value={{ items, count, subtotal, open, setOpen, add, setQty, remove }}>{children}</Ctx.Provider>
  )
}

export function useCart() {
  const c = useContext(Ctx)
  if (!c) throw new Error('useCart must be used inside CartProvider')
  return c
}


const CDN = 'https://cdn.shopify.com/s/files/1/0638/0634/1341/files/'

type Suggestion = CartProduct & { desc: string }

const suggestions: Suggestion[] = [
  { title: 'After Heat Hair & Body Perfume Mist', desc: 'A warm, lingering scent for hair and skin', price: '₹1,299', img: CDN + 'afterheat_01.jpg' },
  { title: 'AM+PM', desc: 'Your day-to-night hair ritual', price: '₹3,349', old: '₹3,940', img: CDN + 'AM_PM.jpg' },
  { title: 'Chai on Call', desc: 'A cosy duo for lips and body', price: '₹1,230', old: '₹1,448', img: CDN + 'IMG_9691.jpg' },
  { title: 'Champi Bond Repair Conditioner', desc: 'Softens and repairs damaged hair', price: '₹1,092', old: '₹1,150', img: CDN + 'conditioner_01_5085a0eb-f7ff-41ed-b646-f8cc0e3f2102.jpg' },
  { title: 'Champi Bond Repair Duo', desc: 'Shampoo and conditioner for stronger hair', price: '₹1,955', old: '₹2,300', img: CDN + 'ChampiBondRepairDuo_01.jpg' },
  { title: 'Champi Bond Repair Shampoo', desc: 'Gentle cleanse, rebuilt bonds', price: '₹1,092', old: '₹1,150', img: CDN + 'shampoo_01_73335608-8d40-4ffe-bb0d-6f9d39ce6324.jpg' },
  { title: 'Champi Essentials Kit', desc: 'Everything for the perfect champi', price: '₹1,499', old: '₹1,899', img: CDN + 'champiessentials_01.jpg' },
  { title: 'Champi Hair Oil', desc: 'Ayurvedic oil for scalp and roots', price: '₹355', img: CDN + 'Updated_1st_image_2.jpg' },
]

function Stepper({ qty, onChange, title }: { qty: number; onChange: (n: number) => void; title: string }) {
  return (
    <div className="inline-flex h-9 items-center border border-ink/20">
      <button onClick={() => onChange(qty - 1)} aria-label={`Decrease quantity for ${title}`} className="flex h-full w-9 items-center justify-center hover:bg-cream">
        −
      </button>
      <span className="w-6 text-center text-[13px] tabular-nums">{qty}</span>
      <button
        onClick={() => onChange(Math.min(qty + 1, 5))}
        aria-label={`Increase quantity for ${title}`}
        className="flex h-full w-9 items-center justify-center hover:bg-cream"
      >
        +
      </button>
    </div>
  )
}

function SuggestionTile({ p }: { p: Suggestion }) {
  const { add } = useCart()

  return (
    <div className="flex w-[calc((100%-20px)/2.3)] shrink-0 snap-start flex-col sm:w-[calc((100%-24px)/2)]">
      {/* Image */}
      <div className="aspect-square overflow-hidden bg-cream-soft">
        <img
          src={p.img}
          alt={p.title}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Product info */}
      <h3
        className="mt-3 line-clamp-2 min-h-[34px] text-[13px] font-medium leading-[17px] text-ink"
        title={p.title}
      >
        {p.title}
      </h3>

      <p
        className="mt-1 line-clamp-2 min-h-[30px] text-[12px] leading-[15px] text-ink/60"
        title={p.desc}
      >
        {p.desc}
      </p>

      {/* Price */}
      <div className="mt-2 flex h-5 items-baseline gap-2 text-[13px]">
        <span>{p.price}</span>

        {p.old && (
          <s className="text-ink/40">
            {p.old}
          </s>
        )}
      </div>

      {/* Button */}
      <button
        onClick={() => add(p)}
        className="mt-3 h-10 w-full border border-ink text-[12px] tracking-[0.04em] text-ink transition-colors hover:bg-ink hover:text-white"
      >
        Add to cart
      </button>
    </div>
  )
}

export default function CartDrawer() {
  const { items, count, subtotal, open, setOpen, setQty, remove } = useCart()
  const rail = useRef<HTMLDivElement>(null)
  const [page, setPage] = useState(0)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, setOpen])

  const inCart = new Set(items.map((i) => i.title))
  const recs = suggestions.filter((p) => !inCart.has(p.title))
  const pages = Math.max(recs.length - 1, 1)

  const onScroll = () => {
    const el = rail.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setPage(max > 0 ? Math.round((el.scrollLeft / max) * (pages - 1)) : 0)
  }
  const goTo = (i: number) => {
    const el = rail.current
    if (el) el.scrollTo({ left: ((el.scrollWidth - el.clientWidth) * i) / Math.max(pages - 1, 1), behavior: 'smooth' })
  }

  return (
    <div className={`fixed inset-0 z-[100] ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
      <div
        onClick={() => setOpen(false)}
        className={`absolute inset-0 bg-ink/40 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="My cart"
        className={`absolute right-0 top-0 flex h-full w-full max-w-[440px] flex-col bg-cream-soft text-ink shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* header */}
        <div className="flex shrink-0 items-center justify-between px-6 pb-4 pt-6 sm:px-8">
          <h2 className="whitespace-nowrap text-[18px] text-ink">
            My cart <span aria-hidden="true">({count})</span>
          </h2>
          <button onClick={() => setOpen(false)} aria-label="Close minicart" className="-mr-2 p-2 text-ink/70 hover:text-ink">
            <Icon icon="solar:close-linear" width="22" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain">
          {/* items */}
          <div className="px-6 sm:px-8">
            {items.length === 0 ? (
              <p className="border-t border-ink/15 py-10 text-[14px] text-ink/60">Your cart is empty.</p>
            ) : (
              items.map((i) => (
                <div key={i.title} className="border-t border-ink/15 py-6">
                  <div className="flex gap-5">
                    <div className="h-[70px] w-[70px] shrink-0 overflow-hidden bg-cream">
                      <img src={i.img} alt="" className="h-full w-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-[14px] font-medium leading-snug text-green-dark">{i.title}</h3>
                      <div className="mt-4 flex items-center justify-between gap-3">
                        <Stepper qty={i.qty} title={i.title} onChange={(n) => setQty(i.title, n)} />
                        <div className="text-right text-[14px]">
                          {i.old && <s className="mr-2 text-ink/40">{i.old}</s>}
                          {inr(toNum(i.price) * i.qty)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 text-right">
                    <button
                      onClick={() => remove(i.title)}
                      aria-label={`Remove ${i.title}`}
                      className="text-[12px] text-ink/70 underline underline-offset-4 hover:text-ink"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* you may also like */}
          {recs.length > 0 && (
            <section className="mt-2 border-t border-ink/15 bg-cream px-6 pb-8 pt-8 sm:px-8" aria-label="May We Suggest">
              <h2 className="mb-5 text-[16px] text-ink">You May Also Like</h2>
              <div ref={rail} onScroll={onScroll} className="no-scrollbar -mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 sm:mx-0 sm:gap-6 sm:px-0">
                {recs.map((p) => (
                  <SuggestionTile key={p.title} p={p} />
                ))}
              </div>
              <div className="mt-6 hidden justify-center gap-2 sm:flex" role="group" aria-label="Choose slide to display">
                {Array.from({ length: pages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className={`h-[2px] w-6 transition-colors ${i === page ? 'bg-ink' : 'bg-ink/20'}`}
                  />
                ))}
              </div>
            </section>
          )}
        </div>

        {/* footer */}
        <div className="shrink-0 border-t border-ink/15 bg-cream-soft px-6 pb-6 pt-5 sm:px-8">
          <div className="mb-5 flex items-center justify-between text-[14px]">
            <span>
              Subtotal ({count} {count === 1 ? 'item' : 'items'})
            </span>
            <span className="font-medium">{inr(subtotal)}</span>
          </div>
          <div className="flex flex-col gap-3">
            <button className="h-12 w-full bg-green text-[14px] tracking-[0.02em] text-white transition-colors hover:bg-green-dark">
              Go to cart
            </button>
            <button
              onClick={() => setOpen(false)}
              className="h-12 w-full border border-ink/40 text-[14px] tracking-[0.02em] text-ink transition-colors hover:border-ink"
            >
              Continue browsing
            </button>
          </div>
        </div>
      </aside>
    </div>
  )
}
