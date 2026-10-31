import { allProducts } from '@/lib/products'
import { publicImageSrc } from '@/lib/order-types'

export const SHIPPING_FEE = 199
export const FREE_SHIPPING_AT = 999
export const SHIPPING_METHOD = 'Standard'

const toNum = (s?: string) => Number((s ?? '').replace(/[^\d.]/g, '')) || 0
const catalog = new Map(allProducts.map((p) => [p.title, p]))

/** Prices are always taken from the catalog on the server, never from the client. */
export function priceCart(items: { title: string; qty: number }[]) {
  const lines = items.map((i) => {
    const p = catalog.get(i.title)
    if (!p) throw new Error(`"${i.title}" is no longer available.`)
    return { title: p.title, img: publicImageSrc(p.img), price: toNum(p.price), qty: i.qty }
  })
  const subtotal = lines.reduce((a, l) => a + l.price * l.qty, 0)
  const shipping = subtotal >= FREE_SHIPPING_AT ? 0 : SHIPPING_FEE
  return { lines, subtotal, shipping, discount: 0, total: subtotal + shipping }
}
