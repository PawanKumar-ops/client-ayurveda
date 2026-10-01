import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { allProducts, slugify } from '@/lib/products'

const KEYWORDS = [
  'heroes', 'heat hair', 'hair oil', 'hair mask', 'hair serum', 'scalp serum', 'shampoo', 'conditioner',
  'body lotion', 'body wash', 'perfume mist', 'moisturiser', 'sunscreen', 'face wash', 'lip balm',
  'wellness', 'rituals', 'gift set', 'bundle', 'champi', 'rosemary', 'kumkumadi', 'ashwagandha',
]

function Highlight({ text, q }: { text: string; q: string }) {
  const i = text.toLowerCase().indexOf(q.toLowerCase())
  if (!q || i < 0) return <span>{text}</span>
  return (
    <span aria-label={text}>
      {text.slice(0, i)}
      <mark className="bg-ink italic text-white">{text.slice(i, i + q.length)}</mark>
      <span>{text.slice(i + q.length)}</span>
    </span>
  )
}

export default function SearchPopdown({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter()
  const [q, setQ] = useState('')
  const input = useRef<HTMLInputElement>(null)
  const term = q.trim()

  useEffect(() => {
    if (!open) return
    const t = setTimeout(() => input.current?.focus(), 50)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      clearTimeout(t)
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  const { suggestions, products } = useMemo(() => {
    const n = term.toLowerCase()
    if (!n) return { suggestions: [], products: [] }
    const words = new Set<string>(KEYWORDS)
    allProducts.forEach((p) => words.add(p.category.toLowerCase()))
    return {
      suggestions: [...words].filter((w) => w.split(' ').some((x) => x.startsWith(n)) || w.startsWith(n)).slice(0, 4),
      products: allProducts
        .filter((p, i, a) => a.findIndex((x) => x.title === p.title) === i)
        .filter((p) => `${p.title} ${p.desc} ${p.category}`.toLowerCase().includes(n))
        .slice(0, 4),
    }
  }, [term])

  const go = (to: string) => {
    onClose()
    setQ('')
    router.push(to)
  }
  const searchFor = (s: string) => go(`/shop?q=${encodeURIComponent(s)}`)

  return (
    <>
      {/* backdrop */}
      <div
        onClick={onClose}
        className={`absolute inset-x-0 top-0 h-[100dvh] z-[55] bg-ink/30 transition-opacity duration-300 ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
      />
      <div
        role="dialog"
        aria-label="Search"
        className={`absolute inset-x-0 top-0 z-[60] max-h-[100dvh] overflow-y-auto bg-white shadow-[0_20px_40px_-20px_rgba(36,56,45,0.25)] transition-all duration-300 ${
          open ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-3 opacity-0'
        }`}
      >
        <div className="mx-auto max-w-[1500px] px-5 md:px-[12.7%]">
          <form
            role="search"
            onSubmit={(e) => {
              e.preventDefault()
              if (term) searchFor(term)
            }}
            className="flex h-[72px] items-center gap-4 md:h-[104px] md:gap-7"
          >
            <button type="submit" aria-label="Search" className="shrink-0 text-ink">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="29" viewBox="0 0 22 23" fill="none">
                <path d="M9.18182 18.1525C13.7005 18.1525 17.3636 14.4461 17.3636 9.87411C17.3636 5.30207 13.7005 1.5957 9.18182 1.5957C4.66312 1.5957 1 5.30207 1 9.87411C1 14.4461 4.66312 18.1525 9.18182 18.1525Z" stroke="currentColor" strokeWidth="1.26316" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M21.0004 21.6386L14.6367 16.4102" stroke="currentColor" strokeWidth="1.26316" strokeLinecap="square" strokeLinejoin="round" />
              </svg>
            </button>
            <label htmlFor="SearchInput--desktop" className="sr-only">Search</label>
            <input
              ref={input}
              id="SearchInput--desktop"
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search"
              role="combobox"
              aria-expanded={!!term}
              aria-controls="predictive-search-results"
              autoComplete="off"
              spellCheck={false}
              className="min-w-0 flex-1 bg-transparent text-[18px] text-ink outline-none placeholder:text-ink/40 [&::-webkit-search-cancel-button]:hidden"
            />
            {q && (
              <button type="reset" onClick={() => { setQ(''); input.current?.focus() }} className="shrink-0 text-[13px] uppercase tracking-[0.18em] text-ink hover:opacity-60">
                Clear
              </button>
            )}
            <button type="button" title="Close" onClick={onClose} className="-mr-1 shrink-0 p-1 text-ink hover:opacity-60 md:ml-20">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="size-7" fill="none">
                <path d="M6.758 17.243 12.001 12m5.243-5.243L12 12m0 0L6.758 6.757M12.001 12l5.243 5.243" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </form>

          {term && (
            <div id="predictive-search-results" role="listbox" className="animate-[fadeIn_.5s_ease] pb-6 md:pb-6">
              {suggestions.length || products.length ? (
                <div className="grid gap-8 md:grid-cols-[minmax(0,340px)_minmax(0,1fr)] md:gap-10">
                  {suggestions.length > 0 && (
                    <div>
                      <p className="border-b border-ink/10 pb-4 text-[18px] text-ink">Suggestions</p>
                      <div className="mt-6 flex flex-col gap-5">
                        {suggestions.map((s) => (
                          <button key={s} role="option" aria-selected={false} onClick={() => searchFor(s)} className="w-fit text-left text-[18px] text-ink hover:opacity-70">
                            <Highlight text={s} q={term} />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {products.length > 0 && (
                    <div className={suggestions.length ? '' : 'md:col-span-2'}>
                      <p id="predictive-search-products" className="border-b border-ink/10 pb-4 text-[18px] text-ink">Products</p>
                      <div role="listbox" aria-labelledby="predictive-search-products" className="mt-6 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 md:gap-x-10">
                        {products.map((p) => (
                          <a
                            key={p.title}
                            role="option"
                            aria-selected={false}
                            href={`/product/${slugify(p.title)}`}
                            onClick={(e) => { e.preventDefault(); go(`/product/${slugify(p.title)}`) }}
                            className="group block max-w-[225px]"
                          >
                            <div className="aspect-square overflow-hidden rounded-[10px] bg-cream-soft">
                              <img src={p.img} alt={p.title} className="size-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            </div>
                            <p className="mt-4 line-clamp-2 text-[14px] font-medium leading-snug text-ink">{p.title}</p>
                            <span className="mt-1 flex flex-wrap items-baseline gap-2 text-[13px] font-medium text-ink">
                              {p.price}
                              {p.old && <s className="text-[12px] font-normal text-ink/50">{p.old}</s>}
                            </span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="py-6 text-[16px] text-ink/65">No results found for “{term}”. Try another search.</p>
              )}

              <button
                onClick={() => searchFor(term)}
                className="mt-14 inline-flex h-[47px] items-center gap-2 rounded-full border border-ink px-5 text-[15px] uppercase tracking-[0.16em] text-ink transition-colors hover:bg-ink hover:text-white"
              >
                Search for "{term}"
                <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" fill="none">
                  <path d="m9 6 6 6-6 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
