import { useCart } from '@/components/CartDrawer'
import type { Product } from '@/lib/products'

function Stars({ value = '4.9' }: { value?: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-[11px] text-ink/70">
      <span className="tracking-[-1px] text-[#e7c200]">★★★★★</span>
      <span>{value}</span>
    </span>
  )
}

export default function ProductCard({ p }: { p: Product }) {
  const { add } = useCart()
  return (
    <div className="group flex w-full flex-col">
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
        <img
          src={p.img}
          alt={p.title}
          loading="lazy"
          className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
        <div className="pointer-events-none absolute inset-x-3 bottom-3 hidden translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 md:block">
          <button
            onClick={() => add({ title: p.title, price: p.price, old: p.old, img: p.img })}
            className="pointer-events-auto w-full rounded-full bg-ink py-3 text-center text-[11px] font-semibold uppercase tracking-[0.15em] text-white"
          >
            Add to cart
          </button>
        </div>
      </div>
      <div className="mt-3 flex flex-col">
        <h3 className="text-[15px] font-medium leading-snug text-ink">{p.title}</h3>
        <p className="mt-1 text-[12px] leading-snug text-ink/55">{p.desc}</p>
        {p.rating && (
          <div className="mt-1.5">
            <Stars value={p.rating} />
          </div>
        )}
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-[15px] font-medium text-ink">{p.price}</span>
          {p.old && <span className="text-[12px] text-ink/40 line-through">{p.old}</span>}
        </div>
        <button
          onClick={() => add({ title: p.title, price: p.price, old: p.old, img: p.img })}
          className="mt-3 w-full rounded-full bg-ink py-3 text-center text-[11px] font-semibold uppercase tracking-[0.15em] text-white md:hidden"
        >
          Add to cart
        </button>
      </div>
    </div>
  )
}
