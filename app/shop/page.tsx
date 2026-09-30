"use client"

import { useMemo, useState } from 'react'
import { Icon } from '@iconify/react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import { allProducts as products } from '@/lib/products'
import { useRouter } from 'next/navigation'

const PER_PAGE = 8
const sorts = ['Featured', 'Price: Low to High', 'Price: High to Low', 'A – Z'] as const
const toNum = (s: string) => Number(s.replace(/[^\d.]/g, '')) || 0

export default function ShopPage() {
    const [cat, setCat] = useState('All')
    const [sort, setSort] = useState<(typeof sorts)[number]>('Featured')
    const [page, setPage] = useState(1)
    const router = useRouter()
    const cats = ['All', ...Array.from(new Set(products.map((p) => p.category)))]

    const list = useMemo(() => {
        const l = cat === 'All' ? [...products] : products.filter((p) => p.category === cat)
        if (sort === 'Price: Low to High') l.sort((a, b) => toNum(a.price) - toNum(b.price))
        if (sort === 'Price: High to Low') l.sort((a, b) => toNum(b.price) - toNum(a.price))
        if (sort === 'A – Z') l.sort((a, b) => a.title.localeCompare(b.title))
        return l
    }, [cat, sort])

    const pages = Math.max(1, Math.ceil(list.length / PER_PAGE))
    const cur = Math.min(page, pages)
    const shown = list.slice((cur - 1) * PER_PAGE, cur * PER_PAGE)

    const goTo = (n: number) => {
        setPage(n)
        document.getElementById('shop-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    return (
        <div className="min-h-screen bg-white text-ink">
            <Header />
            <main>
                {/* banner */}
                <section className="bg-cream px-4 py-14 text-center md:py-20">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
                        <button
                            type="button"
                            onClick={() => router.push('/')}
                            className="hover:text-ink"
                        >
                            Home
                        </button> / Shop
                    </p>
                    <h1 className="mt-3 font-serif-display text-4xl font-light md:text-[52px]">All Products</h1>
                    <p className="mx-auto mt-4 max-w-lg text-[14px] leading-relaxed text-ink/70">
                        Simplified Ayurveda for hair, skin and everyday wellness — thoughtfully crafted rituals, all in one place.
                    </p>
                </section>

                <section id="shop-grid" className="mx-auto max-w-[1500px] scroll-mt-24 px-4 py-10 md:px-8 md:py-14">
                    {/* toolbar */}
                    <div className="flex flex-col gap-4 border-b border-ink/10 pb-5 md:flex-row md:items-center md:justify-between">
                        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0">
                            {cats.map((c) => (
                                <button
                                    key={c}
                                    onClick={() => { setCat(c); setPage(1) }}
                                    className={`shrink-0 rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors ${cat === c ? 'border-ink bg-ink text-white' : 'border-ink/20 text-ink hover:border-ink'
                                        }`}
                                >
                                    {c}
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center justify-between gap-4 md:justify-end">
                            <span className="text-[12px] text-ink/55">{list.length} products</span>
                            <label className="relative flex items-center">
                                <span className="sr-only">Sort by</span>
                                <select
                                    value={sort}
                                    onChange={(e) => { setSort(e.target.value as typeof sort); setPage(1) }}
                                    className="appearance-none rounded-full border border-ink/20 bg-white py-2 pl-4 pr-9 text-[12px] font-medium text-ink outline-none focus:border-ink"
                                >
                                    {sorts.map((s) => <option key={s}>{s}</option>)}
                                </select>
                                <Icon icon="solar:alt-arrow-down-linear" width="14" className="pointer-events-none absolute right-3.5" />
                            </label>
                        </div>
                    </div>

                    {/* grid */}
                    <div
                        className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                        style={{ columnGap: 'clamp(20px, 2.5vw, 36px)', rowGap: 'clamp(40px, 4vw, 56px)' }}
                    >
                        {shown.map((p) => (
                            <div key={p.title} className="min-w-0">
                                <ProductCard p={p} />
                            </div>
                        ))}
                    </div>

                    {/* pagination */}
                    {pages > 1 && (
                        <nav aria-label="Pagination" className="mt-14 flex items-center justify-center gap-2">
                            <button
                                onClick={() => goTo(cur - 1)}
                                disabled={cur === 1}
                                aria-label="Previous page"
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/20 text-ink transition-all hover:border-green hover:bg-green hover:text-white disabled:pointer-events-none disabled:opacity-30"
                            >
                                <Icon icon="solar:arrow-left-linear" width="18" />
                            </button>
                            {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                                <button
                                    key={n}
                                    onClick={() => goTo(n)}
                                    aria-current={n === cur ? 'page' : undefined}
                                    className={`h-10 min-w-10 rounded-full px-3 text-[13px] font-medium transition-colors ${n === cur ? 'bg-ink text-white' : 'text-ink hover:bg-cream'
                                        }`}
                                >
                                    {n}
                                </button>
                            ))}
                            <button
                                onClick={() => goTo(cur + 1)}
                                disabled={cur === pages}
                                aria-label="Next page"
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/20 text-ink transition-all hover:border-green hover:bg-green hover:text-white disabled:pointer-events-none disabled:opacity-30"
                            >
                                <Icon icon="solar:arrow-right-linear" width="18" />
                            </button>
                        </nav>
                    )}
                    <p className="mt-4 text-center text-[12px] text-ink/50">
                        Showing {(cur - 1) * PER_PAGE + 1}–{Math.min(cur * PER_PAGE, list.length)} of {list.length}
                    </p>
                </section>
            </main>
            <Footer />
        </div>
    )
}
