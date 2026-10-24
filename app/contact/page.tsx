'use client'

import { useEffect, useState } from 'react'
import { Icon } from '@iconify/react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CartDrawer from '@/components/CartDrawer'
import { lifestyleShots } from '@/lib/products'

const TOPICS = ['Order & delivery', 'Returns', 'Product advice', 'Wholesale', 'Press', 'Other']

const CHANNELS = [
  { icon: 'solar:letter-linear', label: 'Write to us', value: 'care@yubhiayurveda.com', href: 'mailto:care@indewild.com', note: 'Replies within 24 hours' },
  { icon: 'solar:phone-linear', label: 'Call us', value: '+91 80 4718 2200', href: 'tel:+918047182200', note: 'Mon – Sat, 10am – 7pm IST' },
  { icon: 'ic:baseline-whatsapp', label: 'WhatsApp', value: '+91 98450 12345', href: 'https://wa.me/919845012345', note: 'Quickest for order updates' },
]

const STORES = [
  { city: 'Mumbai', name: 'Bandra West', addr: '24 Pali Hill Road, Bandra West, Mumbai 400050', hours: 'Daily, 11am – 9pm' },
  { city: 'Bengaluru', name: 'Indiranagar', addr: '100 Feet Road, HAL 2nd Stage, Bengaluru 560038', hours: 'Daily, 11am – 9pm' },
]

const FAQS = [
  { q: 'Where is my order?', a: 'Once dispatched, you will receive a tracking link over SMS and email. Standard orders arrive in 4–6 business days, express in 1–2.' },
  { q: 'Do you offer Cash on Delivery?', a: 'Yes — every order across India is Cash on Delivery, with no additional fee. You can pay in cash or UPI at the door.' },
  { q: 'What is your return policy?', a: 'Unopened products can be returned within 7 days of delivery. If something arrived damaged, write to us with a photo and we will replace it.' },
  { q: 'Are your products safe for sensitive skin?', a: 'Our formulas are rooted in Ayurveda, free of parabens and sulphates, and dermatologically tested. Patch testing is always recommended.' },
]

type Form = { name: string; email: string; phone: string; order: string; message: string }
const EMPTY: Form = { name: '', email: '', phone: '', order: '', message: '' }

function validate(f: Form) {
  const e: Partial<Record<keyof Form, string>> = {}
  if (!f.name.trim()) e.name = 'Please enter your name'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email)) e.email = 'Please enter a valid email address'
  if (f.phone && !/^[6-9]\d{9}$/.test(f.phone)) e.phone = 'Please enter a valid 10-digit mobile number'
  if (f.message.trim().length < 10) e.message = 'Please tell us a little more (at least 10 characters)'
  return e
}

function Field({
  id, label, value, onChange, error, type = 'text', required, textarea, inputMode, maxLength,
}: {
  id: keyof Form; label: string; value: string; onChange: (v: string) => void; error?: string; type?: string
  required?: boolean; textarea?: boolean; inputMode?: 'tel' | 'email'; maxLength?: number
}) {
  const cls = `peer w-full border bg-white px-4 text-[15px] text-ink outline-none transition-colors focus:border-ink ${error ? 'border-[#b3261e]' : 'border-ink/25'}`
  return (
    <div>
      <div className="relative">
        {textarea ? (
          <textarea id={id} rows={6} placeholder=" " value={value} maxLength={1000} onChange={(e) => onChange(e.target.value)} className={`${cls} resize-none pb-3 pt-7`} />
        ) : (
          <input id={id} type={type} placeholder=" " value={value} inputMode={inputMode} maxLength={maxLength} onChange={(e) => onChange(e.target.value)} className={`${cls} h-14 pb-2 pt-6`} />
        )}
        <label
          htmlFor={id}
          className={`pointer-events-none absolute left-4 text-[15px] text-ink/55 transition-all peer-focus:top-4 peer-focus:text-[11px] peer-[:not(:placeholder-shown)]:top-4 peer-[:not(:placeholder-shown)]:text-[11px] ${textarea ? 'top-5' : 'top-1/2 -translate-y-1/2 peer-focus:translate-y-[-50%]'}`}
        >
          {label} {required && '*'}
        </label>
      </div>
      {error && <p className="mt-1.5 text-[12px] text-[#b3261e]">{error}</p>}
    </div>
  )
}

export default function ContactPage() {
  const router = useRouter()
  const [topic, setTopic] = useState(TOPICS[0])
  const [form, setForm] = useState<Form>(EMPTY)
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({})
  const [tried, setTried] = useState(false)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [faq, setFaq] = useState<number | null>(0)

  useEffect(() => {
    document.title = 'Contact — yubhi ayurveda'
  }, [])

  const set = (k: keyof Form) => (v: string) => {
    const next = { ...form, [k]: v }
    setForm(next)
    if (tried) setErrors(validate(next))
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setTried(true)
    const errs = validate(form)
    setErrors(errs)
    if (Object.keys(errs).length) return document.getElementById(Object.keys(errs)[0])?.focus()
    setSending(true)
    try {
      const result = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, topic }),
      })
      if (!result.ok) {
        const body = await result.json() as { error?: string }
        throw new Error(body.error || `Unable to send message (${result.status})`)
      }
      setSending(false)
      setSent(true)
    } catch (error) {
      setSending(false)
      console.error('Unable to save contact message', error)
      window.alert('We could not send your message. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* banner */}
      <section className="bg-cream">
        <div className="mx-auto max-w-[1440px] px-5 py-12 md:px-10 md:py-16">
          <nav className="text-[12px] uppercase tracking-[0.14em] text-ink/60">
            <a href="/" onClick={(e) => { e.preventDefault(); router.push('/') }} className="hover:text-ink">Home</a>
            <span className="mx-2">/</span>
            <span className="text-ink">Contact</span>
          </nav>
          <div className="mt-5 grid items-end gap-6 md:grid-cols-[1.2fr_1fr]">
            <h1 className="font-serif-display text-[40px] leading-[1.05] text-ink md:text-[60px]">
              We'd love to <em className="text-green">hear from you</em>
            </h1>
            <p className="max-w-[440px] text-[15px] leading-relaxed text-ink/70 md:justify-self-end">
              A question about a ritual, an order on its way, or simply which oil suits your hair — our care team reads every message.
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-[1440px] px-5 md:px-10">
        {/* channels */}
        <section className="-mt-px grid gap-[3px] pt-10 sm:grid-cols-3 md:pt-14">
          {CHANNELS.map((c) => (
            <a key={c.label} href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="group flex items-start gap-4 bg-cream-soft p-6 transition-colors hover:bg-cream md:p-8">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-green-soft text-green transition-colors group-hover:bg-green group-hover:text-white">
                <Icon icon={c.icon} className="size-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-[11px] uppercase tracking-[0.14em] text-ink/60">{c.label}</span>
                <span className="mt-1.5 block truncate text-[17px] font-medium text-ink">{c.value}</span>
                <span className="mt-1 block text-[13px] text-ink/60">{c.note}</span>
              </span>
            </a>
          ))}
        </section>

        {/* form + image */}
        <section className="grid gap-10 py-14 md:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-20">
          <div className="relative hidden overflow-hidden lg:block">
            <img src={lifestyleShots[0].img} alt="" className="absolute inset-0 size-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-10 text-white">
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/70">The indē wild promise</p>
              <p className="font-serif-display mt-3 text-[30px] italic leading-tight">Rooted in Ayurveda, answered by real people.</p>
            </div>
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-accent">Send a message</p>
            <h2 className="font-serif-display mt-2 text-[32px] text-ink md:text-[40px]">How can we help?</h2>

            {sent ? (
              <div className="mt-8 bg-cream-soft p-8 md:p-10">
                <span className="grid size-14 place-items-center rounded-full bg-green-soft">
                  <Icon icon="solar:check-circle-bold" className="size-8 text-green" />
                </span>
                <h3 className="font-serif-display mt-5 text-[26px] text-ink">Thank you, {form.name.split(' ')[0]}.</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink/70">
                  Your message about <strong className="font-medium text-ink">{topic.toLowerCase()}</strong> has reached our care team. We'll reply to {form.email} within 24 hours.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <button onClick={() => { setSent(false); setForm(EMPTY); setTried(false) }} className="h-12 rounded-full border border-ink px-8 text-[11px] uppercase tracking-[0.14em] text-ink hover:bg-ink hover:text-white">
                    Send another
                  </button>
                  <button onClick={() => router.push('/shop')} className="h-12 rounded-full bg-ink px-8 text-[11px] uppercase tracking-[0.14em] text-white hover:bg-green-dark">
                    Continue shopping
                  </button>
                </div>
              </div>
            ) : (
              <form noValidate onSubmit={submit} className="mt-8">
                <p className="text-[13px] font-medium text-ink">Topic</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {TOPICS.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTopic(t)}
                      aria-pressed={topic === t}
                      className={`rounded-full border px-4 py-2 text-[13px] transition-colors ${topic === t ? 'border-ink bg-ink text-white' : 'border-ink/25 text-ink hover:border-ink'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <Field id="name" label="Full name" required value={form.name} onChange={set('name')} error={errors.name} />
                  <Field id="email" label="Email address" type="email" inputMode="email" required value={form.email} onChange={set('email')} error={errors.email} />
                  <Field id="phone" label="Phone (optional)" type="tel" inputMode="tel" maxLength={10} value={form.phone} onChange={(v) => set('phone')(v.replace(/\D/g, ''))} error={errors.phone} />
                  <Field id="order" label="Order number (optional)" value={form.order} onChange={(v) => set('order')(v.toUpperCase())} />
                  <div className="sm:col-span-2">
                    <Field id="message" label="Your message" textarea required value={form.message} onChange={set('message')} error={errors.message} />
                    <p className="mt-1 text-right text-[11px] text-ink/45">{form.message.length}/1000</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-[12px] text-ink/55">By sending, you agree to our Privacy Policy.</p>
                  <button
                    type="submit"
                    disabled={sending}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink px-10 text-[11px] uppercase tracking-[0.14em] text-white transition-colors hover:bg-green-dark disabled:opacity-60 sm:w-auto"
                  >
                    {sending ? <Icon icon="svg-spinners:ring-resize" className="size-4" /> : <Icon icon="solar:plain-2-linear" className="size-4" />}
                    {sending ? 'Sending…' : 'Send message'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>

        {/* stores */}
        <section className="border-t border-ink/10 py-14 md:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-serif-display text-[30px] text-ink md:text-[40px]">Visit our stores</h2>
            <p className="text-[14px] text-ink/60">Try every ritual in person, with a consultation on us.</p>
          </div>
          <div className="mt-8 grid gap-[3px] md:grid-cols-2">
            {STORES.map((s) => (
              <div key={s.name} className="flex flex-col bg-cream-soft p-6 md:p-8">
                <span className="text-[11px] uppercase tracking-[0.18em] text-accent">{s.city}</span>
                <h3 className="font-serif-display mt-2 text-[24px] text-ink">{s.name}</h3>
                <p className="mt-3 flex gap-2 text-[14px] text-ink/75"><Icon icon="solar:map-point-linear" className="mt-0.5 size-4 shrink-0" />{s.addr}</p>
                <p className="mt-2 flex gap-2 text-[14px] text-ink/75"><Icon icon="solar:clock-circle-linear" className="mt-0.5 size-4 shrink-0" />{s.hours}</p>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(s.addr)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex w-fit items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-ink underline underline-offset-4 hover:text-green"
                >
                  Get directions <Icon icon="solar:arrow-right-up-linear" className="size-4" />
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* faq */}
        <section className="grid gap-8 border-t border-ink/10 py-14 md:py-20 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
          <div>
            <h2 className="font-serif-display text-[30px] text-ink md:text-[40px]">Before you write</h2>
            <p className="mt-3 max-w-[360px] text-[15px] text-ink/65">Answers to what we're asked most often.</p>
          </div>
          <ul className="border-t border-ink/15">
            {FAQS.map((f, i) => (
              <li key={f.q} className="border-b border-ink/15">
                <button onClick={() => setFaq(faq === i ? null : i)} aria-expanded={faq === i} className="flex w-full items-center justify-between gap-4 py-5 text-left">
                  <span className="text-[16px] font-medium text-ink">{f.q}</span>
                  <Icon icon="solar:add-linear" className={`size-5 shrink-0 text-ink transition-transform duration-300 ${faq === i ? 'rotate-45' : ''}`} />
                </button>
                <div className={`grid transition-all duration-300 ${faq === i ? 'grid-rows-[1fr] pb-5' : 'grid-rows-[0fr]'}`}>
                  <p className="overflow-hidden text-[15px] leading-relaxed text-ink/70">{f.a}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <Footer />
      <CartDrawer />
    </div>
  )
}
