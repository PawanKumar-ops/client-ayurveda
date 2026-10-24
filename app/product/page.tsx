"use client"

import { Suspense, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Icon } from '@iconify/react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CartDrawer, { useCart } from '@/components/CartDrawer'
import ProductCard from '@/components/ProductCard'
import {
  allProducts,
  findProduct,
  lifestyleShots,
  productDetails,
  slugify,
} from '@/lib/products'

const toNum = (s: string) => Number(s.replace(/[^\d.]/g, '')) || 0
const inr = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN')

function ProductDetail() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const slug = searchParams.get('slug') || ''
  const link = (to: string) => (e: React.MouseEvent) => { e.preventDefault(); router.push(to) }
  const p = findProduct(slug)
  const { add } = useCart()
  const [active, setActive] = useState(0)
  const [more, setMore] = useState(false)
  const [qty, setQty] = useState(1)
  const [gift, setGift] = useState(false)
  const [openInfo, setOpenInfo] = useState<number | null>(null)
  const [infoOpen, setInfoOpen] = useState(false)
  const touchX = useRef(0)

  if (!p) {
    return (
      <div className="min-h-screen bg-white text-ink">
        <Header />
        <main className="px-4 py-32 text-center">
          <h1 className="font-serif-display text-4xl font-light">Product not found</h1>
          <a href="/shop" onClick={link('/shop')} className="mt-6 inline-block text-[13px] font-medium text-accent underline underline-offset-4">Back to all products</a>
        </main>
        <Footer />
        <CartDrawer />
      </div>
    )
  }

  const d = productDetails(p)
  const images = p.images?.length
  ? p.images
  : [p.img]
  const go = (dir: number) => setActive((a) => (a + dir + images.length) % images.length)
  const save =
  p.old && toNum(p.old) > toNum(p.price)
    ? Math.round((1 - toNum(p.price) / toNum(p.old)) * 100)
    : 0
  const recs = (() => {
    const seen = new Set<string>([p.title])
    const list: typeof allProducts = []
    for (const x of allProducts) {
      if (x.category === p.category && !seen.has(x.title)) {
        seen.add(x.title)
        list.push(x)
        if (list.length === 4) return list
      }
    }
    for (const x of allProducts) {
      if (!seen.has(x.title)) {
        seen.add(x.title)
        list.push(x)
        if (list.length === 4) return list
      }
    }
    return list
  })()
  const topRated = (() => {
    const seen = new Set<string>([p.title])
    const list: typeof allProducts = []
    for (const x of allProducts) {
      if (!seen.has(x.title)) {
        seen.add(x.title)
        list.push(x)
        if (list.length === 4) break
      }
    }
    return list
  })()
  const addToCart = () => {
    for (let i = 0; i < qty; i++) add({ title: p.title, price: p.price, old: p.old, img: p.img, category: p.category })
    if (gift) add({ title: 'Festive Giftbox', price: '₹299', img: allProducts[0].img })
  }

  return (
    <div className="min-h-screen bg-white text-ink">
      <Header />
      <main className="mx-auto max-w-[1400px] px-4 pb-16 pt-4 md:px-14">
        {/* breadcrumb */}
        <nav className="flex items-center gap-2 text-[13px] text-ink/80">
          <a href="/shop" onClick={link('/shop')} className="hover:text-accent">All Products</a>
          <span className="h-1 w-1 rounded-full bg-ink/40" />
          <span>{p.category}</span>
        </nav>

        <div className="mt-4 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_minmax(0,480px)] lg:gap-14">
          {/* gallery — pinned while the details scroll */}
          <div className="flex flex-col gap-5 lg:sticky lg:top-24 lg:self-start">
            <div className="flex flex-col-reverse gap-3">
              <div className="no-scrollbar flex justify-center gap-3 overflow-x-auto p-1">
                {images.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    aria-label={`View image ${i + 1}`}
                    aria-current={i === active}
                    className={`aspect-square w-[72px] shrink-0 overflow-hidden rounded-xl bg-cream-soft ring-offset-2 transition-all duration-300 md:w-[72px] ${i === active ? 'ring-2 ring-accent' : 'opacity-55 hover:opacity-100'
                      }`}
                  >
                    <img src={src} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
              <div
                className="group/main relative mx-auto aspect-square w-full overflow-hidden rounded-2xl bg-cream-soft ring-1 ring-ink/5 lg:max-w-[700px]"
                onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
                onTouchEnd={(e) => {
                  const dx = e.changedTouches[0].clientX - touchX.current
                  if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1)
                }}
              >
                {images.map((src, i) => (
                  <img
                    key={src}
                    src={src}
                    alt={i === active ? p.title : ''}
                    aria-hidden={i !== active}
                    className={`absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${i === active ? 'scale-100 opacity-100' : 'scale-[1.04] opacity-0'
                      }`}
                  />
                ))}

                {/* soft vignette so controls read on any photo */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink/25 to-transparent" />

                {save > 0 && (
                  <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-green-dark backdrop-blur">
                    {save}% Off
                  </span>
                )}

                {(['prev', 'next'] as const).map((dir) => (
                  <button
                    key={dir}
                    onClick={() => go(dir === 'prev' ? -1 : 1)}
                    aria-label={dir === 'prev' ? 'Previous image' : 'Next image'}
                    className={`absolute top-1/2 flex h-10 w-10 -translate-y-1/2
                         items-center justify-center
                         rounded-full bg-white/90
                         text-ink shadow-[0_4px_18px_rgba(0,0,0,0.12)]
                         backdrop-blur-sm
                         transition-all duration-300
                         hover:bg-white
                          md:opacity-0 md:group-hover/main:opacity-100
                        ${dir === 'prev'
                        ? 'left-4 md:-translate-x-2 md:group-hover/main:translate-x-0'
                        : 'right-4 md:translate-x-2 md:group-hover/main:translate-x-0'
                      }`}
                  >
                    <Icon icon={dir === 'prev' ? 'solar:arrow-left-linear' : 'solar:arrow-right-linear'} width="20" className="drop-shadow" />
                  </button>
                ))}

                {/* progress bars */}
                <div className="absolute inset-x-0 bottom-4 flex justify-center gap-1.5">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActive(i)}
                      aria-label={`Go to image ${i + 1}`}
                      className={`h-[3px] rounded-full transition-all duration-500 ${i === active ? 'w-8 bg-white' : 'w-4 bg-white/50 hover:bg-white/80'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* info */}
          <div>
            <h1 className="text-[30px] font-light leading-[1.1] md:text-[36px]">{p.title}</h1>
            <p className="mt-2 text-[16px] italic text-ink/85">{p.desc}</p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="text-[20px] font-medium text-green">{p.price}</span>
              {p.old && <span className="text-[18px] text-ink/50 line-through">MRP {p.old}</span>}
              {save > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-[12px] font-semibold text-white">
                  <Icon icon="solar:tag-bold" width="12" /> SAVE {save}%
                </span>
              )}
            </div>
            <p className="text-[13px] text-ink/70">(inclusive of all taxes)</p>


            <div className="mt-5 text-[15px] leading-[1.6] text-ink/80">
              {more ? (
  <>
    <p>{d.about}</p>

    {d.benefits.length > 0 && (
      <ul className="mt-3 list-disc space-y-1 pl-5">
        {d.benefits.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
    )}
  </>
) : (
  <p>
    {d.about.length > 200
      ? `${d.about.slice(0, 200)}…`
      : d.about}
  </p>
)}
              <button onClick={() => setMore(!more)} className="mt-1 font-medium text-accent underline underline-offset-2">
                {more ? 'Read Less' : 'Read More'}
              </button>
            </div>

            <p className="mt-8 text-[15px] font-semibold">Size: <span className="ml-1">{d.size}</span></p>
            <button className="mt-3 rounded-full border border-accent bg-cream-soft px-6 py-2.5 text-[13px] font-semibold uppercase">
              {d.size}
            </button>

            <div className="mt-4 flex gap-2.5">
              <label className="relative">
                <span className="sr-only">Quantity</span>
                <select
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  className="h-[38px] w-[102px] appearance-none rounded-full border border-accent/60 bg-white pl-3 text-[14px] outline-none"
                >
                  {Array.from({ length: 10 }, (_, i) => <option key={i} value={i + 1}>{i + 1}</option>)}
                </select>
                <Icon icon="solar:alt-arrow-down-linear" width="14" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
              </label>
              <button onClick={addToCart} className="h-[38px] flex-1 rounded-full bg-green text-[13px] font-medium uppercase tracking-[0.15em] text-white transition-colors hover:bg-green-dark">
                Add to cart
              </button>
            </div>

            {/* add-ons */}
            <h4 className="mt-6 text-[15px] font-semibold">Add-ons</h4>
            <label className="mt-2 flex cursor-pointer items-center gap-4 rounded-md border border-ink/15 p-3">
              <input type="checkbox" checked={gift} onChange={(e) => setGift(e.target.checked)} className="h-4 w-4 accent-green" />
              <img src={allProducts[0].img} alt="Festive Giftbox" className="h-[88px] w-[88px] rounded object-cover" />
              <span className="text-[13px]">
                <span className="text-[14px] font-semibold">Festive Giftbox</span>{' '}
                <span className="ml-1 text-[11px] underline">*T&amp;C</span>
                <span className="mt-0.5 block">₹299</span>
                <span className="block text-ink/75">Fits up to 3 products from your order (picked at random if you order more)</span>
              </span>
            </label>


            {/* you may also like */}
            {recs.length > 0 && (
              <div className="mt-6">
                <p className="text-[13px] font-semibold uppercase tracking-[0.1em]">You may also like</p>
                <div className="no-scrollbar mt-2 flex snap-x gap-3 overflow-x-auto">
                  {recs.map((r) => (
                    <div key={r.title} className="flex w-[85%] shrink-0 snap-start items-center gap-3 rounded-md border border-ink/10 p-2 sm:w-[48%]">
                      <a href={`/product?slug=${slugify(r.title)}`} onClick={link(`/product?slug=${slugify(r.title)}`)} className="flex min-w-0 flex-1 items-center gap-3">
                        <img src={r.img} alt={r.title} className="h-14 w-14 shrink-0 rounded object-cover" />
                        <span className="min-w-0">
                          <span className="block truncate text-[13px] font-medium">{r.title}</span>
                          <span className="text-[12px]">{r.price} {r.old && <span className="text-ink/45 line-through">{r.old}</span>}</span>
                        </span>
                      </a>
                      <button onClick={() => add({ title: r.title, price: r.price, old: r.old, img: r.img, category: r.category })} className="rounded-full border border-green px-3 py-1 text-[11px] font-semibold text-green hover:bg-green hover:text-white">
                        Add
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* real user results */}
            <h3 className="mt-8 text-[14px] font-semibold uppercase tracking-[0.1em]">Real User Results</h3>
            <ul className="mt-3 grid grid-cols-2 gap-2">
              {d.userResults.map((r) => (
                <li key={r} className="flex items-center gap-2 rounded-md bg-cream-soft px-3 py-2.5 text-[13px]">
                  <Icon icon="solar:check-circle-bold" width="18" className="shrink-0 text-green" /> {r}
                </li>
              ))}
            </ul>

          </div>
        </div>

        {/* Other Top Rated Products */}
        <section className="mt-20 border-t border-ink/10 pt-16 md:mt-24 md:pt-20">
          <div className="mb-10 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#9b7b4f]">
              LOVED BY OUR COMMUNITY
            </p>
            <h2 className="mt-2 font-serif-display text-3xl font-light md:text-4xl">
              Other Top Rated Products
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {topRated.map((prod) => (
              <ProductCard key={prod.title} p={prod} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
      <CartDrawer />
    </div>
  )
}

export default function ProductPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <ProductDetail />
    </Suspense>
  )
}
