
"use client"

import { useRouter } from 'next/navigation'
import { useCart } from '@/components/CartDrawer'
import { type Product } from '@/lib/products'

export default function ProductCard({ p, returnTo }: { p: Product; returnTo?: string }) {
  const router = useRouter()
  const { add } = useCart()

  // Use the explicit slug so product URLs remain consistent.
  const href = `/product?slug=${encodeURIComponent(p.slug)}${returnTo ? `&from=${encodeURIComponent(returnTo)}` : ''}`

  const open = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    router.push(href)
  }

  const addToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()

    add({
      title: p.title,
      price: p.price,
      old: p.old,
      img: p.img,
      category: p.category,
    })
  }

  return (
    <div className="group flex h-full w-full flex-col">
      <div className="relative overflow-hidden rounded-2xl bg-cream-soft">
        <div className="absolute left-3 top-3 z-10 flex flex-col gap-1.5">
          {p.newBadge && (
            <span className="rounded-full bg-white/90 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.1em] text-ink">
              New
            </span>
          )}

          {p.off && (
            <span className="rounded-full bg-green-soft px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-green-dark">
              {p.off}
            </span>
          )}

          {p.freeGift && (
            <span className="rounded-full bg-white/90 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.1em] text-ink">
              Free Gift
            </span>
          )}
        </div>

        <a href={href} onClick={open} aria-label={p.title}>
          <img
            src={p.img}
            alt={p.title}
            loading="lazy"
            className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        </a>

        <div className="pointer-events-none absolute inset-x-3 bottom-3 hidden translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 md:block">
          <button
            onClick={addToCart}
            className="pointer-events-auto w-full rounded-full bg-ink py-3 text-center text-[11px] font-semibold uppercase tracking-[0.15em] text-white"
          >
            Add to cart
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-1 flex-col">
        <h3 className="text-[15px] font-medium leading-snug text-ink">
          <a
            href={href}
            onClick={open}
            className="hover:text-green"
          >
            {p.title}
          </a>
        </h3>

      <p className="mt-1 truncate text-[12px] leading-snug text-ink/55">
  {p.desc}
</p>

        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-[15px] font-medium text-ink">
            {p.price}
          </span>

          {p.old && (
            <span className="text-[12px] text-ink/40 line-through">
              {p.old}
            </span>
          )}
        </div>

        <button
  onClick={addToCart}
  className="mt-auto w-full rounded-full bg-ink py-3 text-center text-[11px] font-semibold uppercase tracking-[0.15em] text-white md:hidden"
>
  Add to cart
</button>
      </div>
    </div>
  )
}
