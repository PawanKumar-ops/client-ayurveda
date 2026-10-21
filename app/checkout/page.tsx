'use client'

import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Icon } from '@iconify/react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CartDrawer, { useCart, toNum, inr, type CartItem } from '@/components/CartDrawer'
import { store } from '@/lib/store'

const STATES = [
  'Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chandigarh', 'Chhattisgarh',
  'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir',
  'Jharkhand', 'Karnataka', 'Kerala', 'Ladakh', 'Lakshadweep', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya',
  'Mizoram', 'Nagaland', 'Odisha', 'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
]

const METHODS = [
  { id: 'standard', label: 'Standard', note: 'Delivered in 4–6 business days', price: 199 },
] as const

const FREE_SHIPPING_AT = 999
const COD_FEE = 0
const CODES: Record<string, { pct: number; label: string }> = {
  WILD10: { pct: 10, label: '10% off' },
  RITUAL15: { pct: 15, label: '15% off' },
}

type Addr = {
  firstname: string; lastname: string; email: string; phone: string
  address1: string; address2: string; city: string; postalcode: string; state: string; nickname: string
}
const EMPTY: Addr = {
  firstname: '', lastname: '', email: '', phone: '', address1: '', address2: '', city: '', postalcode: '', state: '', nickname: '',
}

function validate(a: Addr) {
  const e: Partial<Record<keyof Addr, string>> = {}
  if (!a.firstname.trim()) e.firstname = 'Please enter first name'
  if (!a.lastname.trim()) e.lastname = 'Please enter last name'
  if (!a.email.trim()) e.email = 'Email address is required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(a.email)) e.email = 'Please use the valid email address format. Example: name@example.com'
  if (!/^[6-9]\d{9}$/.test(a.phone.replace(/\D/g, '').slice(-10)) || a.phone.replace(/\D/g, '').length < 10)
    e.phone = 'Please enter a valid 10-digit mobile number'
  if (!a.address1.trim()) e.address1 = 'Please enter street address'
  if (!a.city.trim()) e.city = 'Please enter the city'
  if (!/^[1-9]\d{5}$/.test(a.postalcode)) e.postalcode = 'Please enter a valid 6-digit PIN code'
  if (!a.state) e.state = 'Please select state'
  return e
}

/* ---------- small pieces ---------- */

function Field({
  label, value, onChange, error, type = 'text', required, inputMode, maxLength, autoComplete, onClear,
}: {
  label: string; value: string; onChange: (v: string) => void; error?: string; type?: string; required?: boolean
  inputMode?: 'numeric' | 'tel' | 'email'; maxLength?: number; autoComplete?: string; onClear?: () => void
}) {
  const id = label.replace(/\W+/g, '-').toLowerCase()
  return (
    <div>
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          placeholder=" "
          inputMode={inputMode}
          maxLength={maxLength}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          onChange={(e) => onChange(e.target.value)}
          className={`peer h-14 w-full border bg-white px-4 pb-2 pt-6 text-[15px] text-ink outline-none transition-colors focus:border-ink ${error ? 'border-[#b3261e]' : 'border-ink/30'
            } ${onClear && value ? 'pr-10' : ''}`}
        />
        <label
          htmlFor={id}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[15px] text-ink/55 transition-all peer-focus:top-4 peer-focus:text-[11px] peer-[:not(:placeholder-shown)]:top-4 peer-[:not(:placeholder-shown)]:text-[11px]"
        >
          {label} {required && '*'}
        </label>
        {onClear && value && (
          <button type="button" aria-label="Clear field" onClick={onClear} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/50 hover:text-ink">
            <Icon icon="solar:close-circle-linear" className="size-5" />
          </button>
        )}
      </div>
      {error && <p className="mt-1.5 text-[12px] text-[#b3261e]">{error}</p>}
    </div>
  )
}

function Radio({ checked }: { checked: boolean }) {
  return (
    <span className={`mt-0.5 grid size-4 shrink-0 place-items-center rounded-full border-[1.5px] ${checked ? 'border-ink' : 'border-ink/70'}`}>
      {checked && <span className="size-2 rounded-full bg-ink" />}
    </span>
  )
}

function Step({
  n, title, active, done, onEdit, summary, children,
}: { n: number; title: string; active: boolean; done: boolean; onEdit?: () => void; summary?: ReactNode; children: ReactNode }) {
  return (
    <section className="bg-cream px-4 py-5 sm:px-5 sm:py-6">
      <header className="flex items-baseline justify-between gap-4">
        <h2 className={`text-[18px] font-medium sm:text-[20px] ${active || done ? 'text-ink' : 'text-ink/40'}`}>
          {title}
          {done && !active && <Icon icon="solar:check-circle-bold" className="ml-2 inline size-5 align-[-3px] text-green" />}
        </h2>
        {done && !active && onEdit ? (
          <button onClick={onEdit} className="text-[14px] text-ink underline underline-offset-4">Edit</button>
        ) : (
          <span className={`shrink-0 text-[14px] ${active ? 'text-ink/80' : 'text-ink/40'}`}>Step {n}/3</span>
        )}
      </header>
      {done && !active && summary && <div className="mt-3 text-[14px] leading-relaxed text-ink/75">{summary}</div>}
      {active && <div className="mt-5">{children}</div>}
    </section>
  )
}

/* ---------- order summary ---------- */

function LineItem({ i, editable }: { i: CartItem; editable: boolean }) {
  const cart = useCart()
  return (
    <li className="flex gap-4 bg-cream px-4 py-5 sm:px-4">
      <div className="size-[88px] shrink-0 overflow-hidden bg-white/60">
        <img src={i.img} alt={i.title} className="size-full object-cover" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <h3 className="text-[14px] font-medium leading-snug text-ink">{i.title}</h3>
        {i.old && <p className="mt-1 truncate text-[12px] text-ink/60">MRP <s>{i.old}</s></p>}
        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          {editable ? (
            <div className="flex items-center gap-3 text-[12px] text-ink">
              <span>Quantity:</span>
              <div className="flex h-7 items-center border border-ink/25">
                <button aria-label="Decrease" onClick={() => cart.setQty(i.title, i.qty - 1)} className="grid h-full w-7 place-items-center hover:bg-ink/5">
                  <Icon icon="solar:minus-linear" className="size-3" />
                </button>
                <span className="w-6 text-center tabular-nums">{i.qty}</span>
                <button aria-label="Increase" onClick={() => cart.setQty(i.title, i.qty + 1)} className="grid h-full w-7 place-items-center hover:bg-ink/5">
                  <Icon icon="solar:add-linear" className="size-3" />
                </button>
              </div>
              <button onClick={() => cart.remove(i.title)} className="text-ink/60 underline underline-offset-2 hover:text-ink">Remove</button>
            </div>
          ) : (
            <span className="text-[12px] text-ink">Quantity: {i.qty}</span>
          )}
          <span className="text-[15px] font-medium tabular-nums text-ink">{inr(toNum(i.price) * i.qty)}</span>
        </div>
      </div>
    </li>
  )
}

type Totals = { subtotal: number; shipping: number; shipLabel: string; discount: number; shipDiscount: number; total: number }

function Summary({
  items, count, totals, code, setCode, applied, applyCode, codeError, editable,
}: {
  items: CartItem[]; count: number; totals: Totals; code: string; setCode: (v: string) => void
  applied: string | null; applyCode: () => void; codeError: string; editable: boolean
}) {
  const [editing, setEditing] = useState(false)
  return (
    <div>
      <div className="flex items-center justify-between bg-cream px-4 py-5">
        <h2 className="text-[18px] font-medium text-ink">My cart ({count} {count === 1 ? 'item' : 'items'})</h2>
        {editable && (
          <button onClick={() => setEditing((v) => !v)} className="text-[14px] font-medium text-ink underline underline-offset-4">
            {editing ? 'Done' : 'Modify cart'}
          </button>
        )}
      </div>
      <ul className="flex max-h-[420px] flex-col gap-[3px] overflow-y-auto border-t border-ink/10 [scrollbar-width:thin]">
        {items.map((i) => <LineItem key={i.title} i={i} editable={editable && editing} />)}
      </ul>

      {editable && (
        <div className="mt-[3px] bg-cream px-4 py-5">
          <label htmlFor="promo" className="text-[13px] font-medium text-ink">Discount code</label>
          <div className="mt-2 flex gap-2">
            <input
              id="promo"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === 'Enter' && applyCode()}
              placeholder="e.g. WILD10"
              className="h-11 min-w-0 flex-1 border border-ink/30 bg-white px-3 text-[14px] uppercase tracking-wide text-ink outline-none placeholder:normal-case placeholder:tracking-normal placeholder:text-ink/40 focus:border-ink"
            />
            <button onClick={applyCode} className="h-11 shrink-0 bg-ink px-5 text-[13px] text-white transition-colors hover:bg-green-dark">
              Apply
            </button>
          </div>
          {codeError && <p className="mt-1.5 text-[12px] text-[#b3261e]">{codeError}</p>}
          {applied && !codeError && (
            <p className="mt-1.5 flex items-center gap-1 text-[12px] text-green">
              <Icon icon="solar:tag-price-linear" className="size-4" /> {applied} applied — {CODES[applied].label}
            </p>
          )}
        </div>
      )}

      <dl className="mt-[3px] space-y-3 bg-cream px-4 py-5 text-[14px] text-ink">
        <div className="flex justify-between"><dt>Subtotal</dt><dd className="tabular-nums">{inr(totals.subtotal)}</dd></div>
        {totals.discount > 0 && (
          <div className="flex justify-between text-green"><dt>Discount ({applied})</dt><dd className="tabular-nums">-{inr(totals.discount)}</dd></div>
        )}
        <div className="flex justify-between">
          <dt>Estimated shipping<span className="mt-0.5 block text-[12px] text-ink/60">{totals.shipLabel}</span></dt>
          <dd className="tabular-nums">{inr(totals.shipping)}</dd>
        </div>
        <div className="flex justify-between"><dt>Estimated tax</dt><dd className="text-ink/70">Inclusive</dd></div>
        {totals.shipDiscount > 0 && (
          <div className="flex justify-between font-medium"><dt>Shipping Discount</dt><dd className="tabular-nums">-{inr(totals.shipDiscount)}</dd></div>
        )}
        <div className="flex justify-between border-t border-ink/10 pt-3 text-[15px] font-semibold"><dt>Total</dt><dd className="tabular-nums">{inr(totals.total)}</dd></div>
      </dl>
    </div>
  )
}

/* ---------- page ---------- */

export default function CheckoutPage() {
  const router = useRouter()
  const cart = useCart()
  const [step, setStep] = useState(1)
  const [maxStep, setMaxStep] = useState(1)
  const [addr, setAddr] = useState<Addr>(EMPTY)
  const [errors, setErrors] = useState<Partial<Record<keyof Addr, string>>>({})
  const [tried, setTried] = useState(false)
  const [save, setSave] = useState(true)
  const [makeDefault, setMakeDefault] = useState(false)
  const [method, setMethod] = useState<(typeof METHODS)[number]['id']>('standard')
  const [code, setCode] = useState('')
  const [applied, setApplied] = useState<string | null>(null)
  const [codeError, setCodeError] = useState('')
  const [agree, setAgree] = useState(false)
  const [placing, setPlacing] = useState(false)
  const [order, setOrder] = useState<null | { id: string; items: CartItem[]; totals: Totals; addr: Addr; count: number }>(null)
  const [summaryOpen, setSummaryOpen] = useState(false)

  useEffect(() => {
    document.title = 'Checkout — indē wild'
  }, [])

  const set = (k: keyof Addr) => (v: string) => {
    const next = { ...addr, [k]: v }
    setAddr(next)
    if (tried) setErrors(validate(next))
  }

  const totals: Totals = useMemo(() => {
    const subtotal = cart.subtotal
    const discount = applied ? Math.round((subtotal * CODES[applied].pct) / 100) : 0
    const m = METHODS.find((x) => x.id === method)!
    const shipping = m.price
    const shipDiscount = method === 'standard' && subtotal - discount >= FREE_SHIPPING_AT ? shipping : 0
    return {
      subtotal, discount, shipping, shipDiscount,
      shipLabel: m.label,
      total: Math.max(0, subtotal - discount + shipping - shipDiscount + COD_FEE),
    }
  }, [cart.subtotal, applied, method])

  const applyCode = () => {
    const c = code.trim()
    if (!c) return setCodeError('Please enter a code')
    if (!CODES[c]) return setCodeError('This code is invalid or has expired')
    setCodeError('')
    setApplied(c)
  }

  const go = (n: number) => {
    setStep(n)
    setMaxStep((m) => Math.max(m, n))
    requestAnimationFrame(() => document.getElementById(`step-${n}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }

  const submitAddress = (e: React.FormEvent) => {
    e.preventDefault()
    setTried(true)
    const errs = validate(addr)
    setErrors(errs)
    if (Object.keys(errs).length) {
      document.getElementById(Object.keys(errs)[0])?.focus()
      return
    }
    go(2)
  }

  const placeOrder = () => {
    if (!agree || placing) return
    setPlacing(true)
    setTimeout(() => {
      const selectedMethod = METHODS.find((option) => option.id === method)!
      const snapshot = { id: 'IW' + Date.now().toString().slice(-8), items: cart.items, totals, addr, count: cart.count }
      store.addOrder({
        id: snapshot.id,
        date: new Date().toISOString(),
        customer: { name: `${addr.firstname} ${addr.lastname}`, email: addr.email, phone: addr.phone },
        address: addr.address1,
        city: addr.city,
        state: addr.state,
        pickup: false,
        method: selectedMethod.label,
        items: cart.items.map((item) => ({ title: item.title, img: item.img, price: toNum(item.price), qty: item.qty })),
        subtotal: totals.subtotal,
        discount: totals.discount,
        shipping: totals.shipping - totals.shipDiscount,
        total: totals.total,
        code: applied,
        payment: 'Cash on Delivery',
        status: 'Pending',
        notes: '',
      })
      cart.items.forEach((i) => cart.remove(i.title))
      setOrder(snapshot)
      setPlacing(false)
      window.scrollTo({ top: 0 })
    }, 900)
  }

  const summaryProps = { code, setCode, applied, applyCode, codeError }

  let body: ReactNode
  if (order) {
    body = (
      <div className="mx-auto max-w-[720px] py-10 text-center sm:py-16">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-green-soft">
          <Icon icon="solar:check-circle-bold" className="size-9 text-green" />
        </span>
        <h1 className="font-serif-display mt-6 text-[32px] text-ink sm:text-[40px]">Thank you, {order.addr.firstname}.</h1>
        <p className="mt-3 text-[15px] text-ink/70">
          Your order <strong className="text-ink">#{order.id}</strong> has been placed. A confirmation has been sent to {order.addr.email}.
        </p>
        <div className="mt-10 grid gap-[3px] text-left sm:grid-cols-2">
          <div className="bg-cream p-5">
            <p className="text-[12px] uppercase tracking-[0.12em] text-ink/60">Delivering to</p>
            <p className="mt-2 text-[14px] leading-relaxed text-ink">
              <>{order.addr.firstname} {order.addr.lastname}<br />{order.addr.address1}{order.addr.address2 && `, ${order.addr.address2}`}<br />{order.addr.city}, {order.addr.state} {order.addr.postalcode}</>
              <br />+91 {order.addr.phone}
            </p>
          </div>
          <div className="bg-cream p-5">
            <p className="text-[12px] uppercase tracking-[0.12em] text-ink/60">Payment</p>
            <p className="mt-2 text-[14px] text-ink">Cash on Delivery</p>
            <p className="mt-1 text-[13px] text-ink/70">Please keep {inr(order.totals.total)} ready at delivery.</p>
          </div>
        </div>
        <ul className="mt-[3px] flex flex-col gap-[3px] text-left">
          {order.items.map((i) => <LineItem key={i.title} i={i} editable={false} />)}
        </ul>
        <div className="mt-[3px] flex justify-between bg-cream px-5 py-4 text-[15px] font-semibold text-ink">
          <span>Total ({order.count} items)</span><span>{inr(order.totals.total)}</span>
        </div>
        <button onClick={() => router.push('/shop')} className="mt-10 h-12 bg-ink px-10 text-[14px] text-white transition-colors hover:bg-green-dark">
          Continue shopping
        </button>
      </div>
    )
  } else if (!cart.items.length) {
    body = (
      <div className="py-16 text-center sm:py-24">
        <Icon icon="solar:bag-3-linear" className="mx-auto size-12 text-ink/40" />
        <h1 className="mt-5 text-[28px] font-medium text-ink sm:text-[32px]">Your cart is empty</h1>
        <p className="mt-2 text-[15px] text-ink/65">Add a ritual or two before checking out.</p>
        <button onClick={() => router.push('/shop')} className="mt-8 h-12 bg-ink px-10 text-[14px] text-white transition-colors hover:bg-green-dark">
          Shop all products
        </button>
      </div>
    )
  } else {
    const m = METHODS.find((x) => x.id === method)!
    body = (
      <>
        <h1 className="text-[30px] font-medium tracking-[-0.01em] text-ink sm:text-[34px]">Checkout</h1>

        {/* mobile summary toggle */}
        <button
          onClick={() => setSummaryOpen((v) => !v)}
          aria-expanded={summaryOpen}
          className="mt-6 flex w-full items-center justify-between bg-cream px-4 py-4 text-[14px] text-ink lg:hidden"
        >
          <span className="flex items-center gap-2 font-medium">
            <Icon icon="solar:bag-3-linear" className="size-5" />
            {summaryOpen ? 'Hide' : 'Show'} order summary
            <Icon icon="solar:alt-arrow-down-linear" className={`size-4 transition-transform ${summaryOpen ? 'rotate-180' : ''}`} />
          </span>
          <span className="font-semibold tabular-nums">{inr(totals.total)}</span>
        </button>
        {summaryOpen && (
          <div className="mt-[3px] lg:hidden">
            <Summary items={cart.items} count={cart.count} totals={totals} editable {...summaryProps} />
          </div>
        )}

        <div className="mt-6 grid gap-8 lg:mt-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,441px)] lg:gap-7 xl:grid-cols-[minmax(0,1fr)_minmax(0,480px)]">
          <div className="flex flex-col gap-2">
            {/* STEP 1 */}
            <div id="step-1" className="scroll-mt-24">
              <Step
                n={1}
                title="Shipping Address"
                active={step === 1}
                done={maxStep > 1}
                onEdit={() => setStep(1)}
                summary={
                  <>
                    {addr.firstname} {addr.lastname} · {addr.email} · +91 {addr.phone}
                    <br />
                    {`${addr.address1}${addr.address2 ? ', ' + addr.address2 : ''}, ${addr.city}, ${addr.state} ${addr.postalcode}`}
                  </>
                }
              >
                <form noValidate onSubmit={submitAddress}>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <Field label="First name" required value={addr.firstname} onChange={set('firstname')} error={errors.firstname} autoComplete="given-name" />
                    <Field label="Last name" required value={addr.lastname} onChange={set('lastname')} error={errors.lastname} autoComplete="family-name" />
                    <Field label="Email address" type="email" inputMode="email" required value={addr.email} onChange={set('email')} error={errors.email} autoComplete="email" />
                    <Field label="Phone number" type="tel" inputMode="tel" maxLength={10} required value={addr.phone} onChange={(v) => set('phone')(v.replace(/\D/g, ''))} error={errors.phone} autoComplete="tel-national" />
                  </div>

                  <div className="mt-6 flex items-center gap-3 border-b border-ink/10 pb-3">
                    <span className="text-[14px] font-medium tracking-wide text-ink">
                      Delivery Address
                    </span>
                    <span className="text-[12px] text-ink/50">
                      Where should we deliver your order?
                    </span>
                  </div>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <Field label="Street address" required value={addr.address1} onChange={set('address1')} onClear={() => set('address1')('')} error={errors.address1} autoComplete="address-line1" />
                      </div>
                      <div className="sm:col-span-2">
                        <Field label="Apt, Suite or Floor (optional)" value={addr.address2} onChange={set('address2')} autoComplete="address-line2" />
                      </div>
                      <Field label="City" required value={addr.city} onChange={set('city')} error={errors.city} autoComplete="address-level2" />
                      <Field label="PIN code" inputMode="numeric" maxLength={6} required value={addr.postalcode} onChange={(v) => set('postalcode')(v.replace(/\D/g, ''))} error={errors.postalcode} autoComplete="postal-code" />
                      <div className="relative">
                        <select disabled className="peer h-14 w-full appearance-none border border-ink/30 bg-white px-4 pb-2 pt-6 text-[15px] text-ink">
                          <option>India</option>
                        </select>
                        <label className="pointer-events-none absolute left-4 top-4 text-[11px] text-ink/55">Country *</label>
                      </div>
                      <div>
                        <div className="relative">
                          <select
                            id="state"
                            value={addr.state}
                            onChange={(e) => set('state')(e.target.value)}
                            aria-invalid={!!errors.state}
                            className={`h-14 w-full appearance-none border bg-white px-4 pb-2 pt-6 text-[15px] text-ink outline-none focus:border-ink ${errors.state ? 'border-[#b3261e]' : 'border-ink/30'}`}
                          >
                            <option value="">Select State</option>
                            {STATES.map((s) => <option key={s}>{s}</option>)}
                          </select>
                          <label htmlFor="state" className="pointer-events-none absolute left-4 top-4 text-[11px] text-ink/55">State *</label>
                          <Icon icon="solar:alt-arrow-down-linear" className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-ink/60" />
                        </div>
                        {errors.state && <p className="mt-1.5 text-[12px] text-[#b3261e]">{errors.state}</p>}
                      </div>
                      <div className="sm:col-span-2">
                        <Field label="Address Nickname (Optional)" value={addr.nickname} onChange={set('nickname')} />
                      </div>
                  </div>

                  <button type="submit" className="mt-6 h-12 w-full bg-ink text-[14px] font-medium text-white transition-colors hover:bg-green-dark sm:w-[240px]">
                    Continue
                  </button>
                </form>
              </Step>
            </div>

            {/* STEP 2 */}
            <div id="step-2" className="scroll-mt-24">
              <Step
                n={2}
                title="Shipping Method"
                active={step === 2}
                done={maxStep > 2}
                onEdit={() => setStep(2)}
                summary={`${m.label} · ${m.note} · ${totals.shipDiscount ? 'Free' : inr(m.price)}`}
              >
                <div className="flex flex-col gap-2">
                  {METHODS.map((o) => {
                    const free = o.id === 'standard' && totals.subtotal - totals.discount >= FREE_SHIPPING_AT
                    return (
                      <button
                        key={o.id}
                        onClick={() => setMethod(o.id)}
                        className={`flex items-start gap-3 border px-4 py-5 text-left transition-colors ${method === o.id ? 'border-ink' : 'border-ink/30 hover:border-ink/60'}`}
                      >
                        <Radio checked={method === o.id} />
                        <span className="flex-1">
                          <span className="block text-[14px] font-medium text-ink">{o.label}</span>
                          <span className="mt-1.5 block text-[14px] text-ink/75">{o.note}</span>
                        </span>
                        <span className="text-[14px] font-medium text-ink">
                          {free ? <><s className="mr-1.5 font-normal text-ink/50">{inr(o.price)}</s>Free</> : inr(o.price)}
                        </span>
                      </button>
                    )
                  })}
                  {totals.subtotal - totals.discount < FREE_SHIPPING_AT && (
                    <p className="text-[13px] text-ink/70">
                      Add {inr(FREE_SHIPPING_AT - (totals.subtotal - totals.discount))} more for free standard shipping.
                    </p>
                  )}
                </div>
                <button onClick={() => go(3)} className="mt-6 h-12 w-full bg-ink text-[14px] font-medium text-white transition-colors hover:bg-green-dark sm:w-[240px]">
                  Continue
                </button>
              </Step>
            </div>

            {/* STEP 3 */}
            <div id="step-3" className="scroll-mt-24">
              <Step n={3} title="Payment Method" active={step === 3} done={false}>
                <div className="flex gap-3 border border-ink px-4 py-5">
                  <Radio checked />
                  <span className="flex-1">
                    <span className="flex items-center justify-between gap-3">
                      <span className="text-[14px] font-medium text-ink">Cash on Delivery</span>
                      <Icon icon="solar:wad-of-money-linear" className="size-6 text-green" />
                    </span>
                    <span className="mt-1.5 block text-[14px] text-ink/75">
                      Pay in cash or UPI when your order arrives. No extra charges.
                    </span>
                  </span>
                </div>
                <label className="mt-5 flex cursor-pointer items-start gap-3 text-[13px] leading-relaxed text-ink">
                  <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5 size-4 shrink-0 accent-[#24382d]" />
                  <span>I agree to the <a className="underline underline-offset-2">Terms of Service</a> and <a className="underline underline-offset-2">Privacy Policy</a>, and confirm I will pay {inr(totals.total)} on delivery.</span>
                </label>
                <button
                  onClick={placeOrder}
                  disabled={!agree || placing}
                  className="mt-6 flex h-12 w-full items-center justify-center gap-2 bg-ink text-[14px] font-medium text-white transition-colors hover:bg-green-dark disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {placing && <Icon icon="svg-spinners:ring-resize" className="size-4" />}
                  {placing ? 'Placing order…' : `Place order · ${inr(totals.total)}`}
                </button>
                <p className="mt-4 flex items-center gap-2 text-[12px] text-ink/60">
                  <Icon icon="solar:shield-check-linear" className="size-4" /> Secure checkout · Easy 7-day returns
                </p>
              </Step>
            </div>
          </div>

          <aside className="hidden lg:block">
            <div className="lg:sticky lg:top-24">
              <Summary items={cart.items} count={cart.count} totals={totals} editable {...summaryProps} />
            </div>
          </aside>
        </div>
      </>
    )
  }

  return (
    <div className="min-h-screen bg-cream-soft">
      <Header />
      <main className="mx-auto max-w-[1200px] px-4 pb-20 pt-8 sm:px-8 sm:pt-10 lg:px-[53px]">{body}</main>
      <Footer />
      <CartDrawer />
    </div>
  )
}
