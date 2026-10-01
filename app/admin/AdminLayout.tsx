'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { Icon } from '@iconify/react'
import { useRouter } from 'next/navigation'
import { auth, ADMIN_EMAIL } from '@/lib/auth'
import { store, useStore, type Order, type Message } from '@/lib/store'
import { type Tab, type Range, OrderDrawer, TAB_PATH } from './ui'

const NAV: { id: Tab; label: string; icon: string }[] = [
  { id: 'overview', label: 'Overview', icon: 'solar:widget-5-linear' },
  { id: 'orders', label: 'Orders', icon: 'solar:box-linear' },
  { id: 'messages', label: 'Messages', icon: 'solar:chat-round-line-linear' },
]

type Ctx = { orders: Order[]; messages: Message[]; range: Range; query: string; openOrder: (o: Order) => void }

export default function AdminLayout({ tab, children }: { tab: Tab; children: (ctx: Ctx) => ReactNode }) {
  const router = useRouter()
  const [authed, setAuthed] = useState(false)
  const [checked, setChecked] = useState(false)
  useEffect(() => { setAuthed(auth.isAuthed()); setChecked(true) }, [])
  useEffect(() => { if (checked && !authed) router.replace('/') }, [checked, authed, router])
  return checked && authed ? <Dashboard tab={tab}>{children}</Dashboard> : null
}

function Dashboard({ tab, children }: { tab: Tab; children: (ctx: Ctx) => ReactNode }) {
  const router = useRouter()
  const { orders, messages } = useStore()
  const [range, setRange] = useState<Range>(30)
  const [query, setQuery] = useState('')
  const [openId, setOpenId] = useState<string | null>(null)
  const [nav, setNav] = useState(false)

  useEffect(() => { document.title = 'Admin — yubhi ayurveda' }, [])
  
  const openOrder = orders.find((o) => o.id === openId) ?? null
  const unread = messages.filter((m) => !m.read && !m.archived).length
  const pending = orders.filter((o) => o.status === 'Pending').length
  const title = tab === 'password' ? 'Change password' : NAV.find((n) => n.id === tab)!.label
  const go = (t: Tab) => { setNav(false); router.push(TAB_PATH[t]) }

  return (
    <div className="min-h-screen bg-cream-soft text-ink">
      {/* sidebar */}
      <div onClick={() => setNav(false)} className={`fixed inset-0 z-30 bg-ink/40 lg:hidden ${nav ? '' : 'hidden'}`} />
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-[248px] flex-col bg-footer text-white transition-transform lg:translate-x-0 ${nav ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="px-6 pb-6 pt-7">
          <p className="font-serif-display text-[24px] italic">yubhi ayurveda</p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-white/45">Admin console</p>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {NAV.map((n) => {
            const badge = n.id === 'messages' ? unread : n.id === 'orders' ? pending : 0
            return (
              <button key={n.id} onClick={() => go(n.id)} className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-[14px] transition-colors ${tab === n.id ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}>
                <Icon icon={n.icon} className="size-5" />
                {n.label}
                {badge > 0 && <span className="ml-auto rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold text-footer">{badge}</span>}
              </button>
            )
          })}
        </nav>
        <div className="space-y-1 border-t border-white/10 p-3">
          <button onClick={() => router.push('/')} className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13px] text-white/60 hover:bg-white/5 hover:text-white"><Icon icon="solar:shop-2-linear" className="size-5" />View store</button>
          <button onClick={() => go('password')} className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13px] transition-colors ${tab === 'password' ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}><Icon icon="solar:lock-password-linear" className="size-5" />Change password</button>
          <div className="mt-2 flex items-center gap-3 rounded-xl bg-white/5 px-3.5 py-3">
            <span className="grid size-8 place-items-center rounded-full bg-accent text-[12px] font-semibold text-footer">A</span>
            <div className="min-w-0 flex-1 text-[12px]"><p className="text-white">Admin</p><p className="truncate text-white/45">{ADMIN_EMAIL}</p></div>
            <button onClick={() => { auth.logout(); router.push('/') }} title="Log out" aria-label="Log out" className="grid size-8 shrink-0 place-items-center rounded-full text-white/55 hover:bg-white/10 hover:text-white"><Icon icon="solar:logout-2-linear" className="size-[18px]" /></button>
          </div>
        </div>
      </aside>

      <div className="min-w-0 overflow-x-clip lg:pl-[248px]">
        <header className="sticky top-0 z-20 border-b border-ink/8 bg-cream-soft/90 backdrop-blur">
          <div className="flex items-center gap-2 px-3 py-3 sm:gap-3 md:px-8 md:py-4">
            <button onClick={() => setNav(true)} className="grid size-10 place-items-center rounded-full hover:bg-cream lg:hidden" aria-label="Menu"><Icon icon="solar:hamburger-menu-linear" className="size-6" /></button>
            <div className="min-w-0">
              <h1 className="truncate font-serif-display text-[22px] leading-tight md:text-[30px]">{title}</h1>
              <p className="hidden text-[12px] text-ink/55 sm:block">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
            <div className="ml-auto flex shrink-0 items-center gap-2">
              {tab !== 'overview' && (
                <label className="relative hidden md:block">
                  <Icon icon="solar:magnifier-linear" className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink/45" />
                  <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={`Search ${title.toLowerCase()}…`} className="h-10 w-[260px] rounded-full border border-ink/12 bg-white pl-10 pr-4 text-[13px] outline-none focus:border-ink" />
                </label>
              )}
              {tab === 'overview' && (
                <div className="flex rounded-full border border-ink/12 bg-white p-1">
                  {([7, 30, 90] as Range[]).map((r) => (
                    <button key={r} onClick={() => setRange(r)} className={`rounded-full px-2.5 py-1.5 text-[12px] sm:px-3 ${range === r ? 'bg-ink text-white' : 'text-ink/70'}`}>{r}d</button>
                  ))}
                </div>
              )}
              <button onClick={() => go('messages')} className="relative grid size-10 place-items-center rounded-full border border-ink/12 bg-white" aria-label="Notifications">
                <Icon icon="solar:bell-linear" className="size-5" />
                {unread + pending > 0 && <span className="absolute right-2 top-2 size-2 rounded-full bg-accent" />}
              </button>
            </div>
          </div>
          {tab !== 'overview' && (
            <div className="px-4 pb-3 md:hidden">
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={`Search ${title.toLowerCase()}…`} className="h-10 w-full rounded-full border border-ink/12 bg-white px-4 text-[13px] outline-none focus:border-ink" />
            </div>
          )}
        </header>

        <main className="min-w-0 px-3 py-5 sm:px-4 md:px-8 md:py-8">
          {children({ orders, messages, range, query, openOrder: (o) => setOpenId(o.id) })}
        </main>
      </div>

      <OrderDrawer order={openOrder} onClose={() => setOpenId(null)} />
    </div>
  )
}

