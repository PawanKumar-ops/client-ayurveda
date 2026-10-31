'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createPortal } from 'react-dom'
import { Icon } from '@iconify/react'
import { signIn } from 'next-auth/react'

export default function AdminLogin({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const first = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) return
    setEmail(''); setPassword(''); setError(''); setShow(false)
    const t = setTimeout(() => first.current?.focus(), 60)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { clearTimeout(t); window.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  if (!open) return null

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    const res = await signIn('credentials', { email, password, redirect: false })
    setBusy(false)
    if (res?.ok) { onClose(); router.push('/admin') }
    else setError('Incorrect email or password.')
  }

  const field = 'h-12 w-full rounded-xl border border-ink/15 bg-white px-4 text-[14px] text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-ink'

  return createPortal(
    <div className="fixed inset-0 z-[100] grid place-items-center p-4">
      <div onClick={onClose} className="absolute inset-0 animate-[fadeIn_.25s_ease] bg-ink/50 backdrop-blur-sm" />
      <form onSubmit={submit} role="dialog" aria-modal="true" aria-labelledby="admin-login-title" className="relative w-full max-w-[400px] animate-[fadeIn_.3s_ease] overflow-hidden rounded-3xl bg-cream-soft shadow-2xl">
        <div className="relative bg-footer px-7 pb-7 pt-8 text-white">
          <button type="button" onClick={onClose} aria-label="Close" className="absolute right-4 top-4 grid size-9 place-items-center rounded-full text-white/60 hover:bg-white/10 hover:text-white">
            <Icon icon="solar:close-circle-linear" className="size-5" />
          </button>
          <span className="grid size-11 place-items-center rounded-2xl bg-white/10"><Icon icon="solar:shield-keyhole-linear" className="size-6 text-accent" /></span>
          <h2 id="admin-login-title" className="font-serif-display mt-5 text-[28px] leading-tight">Admin sign in</h2>
          <p className="mt-1 text-[13px] text-white/55">Restricted area — authorised staff only.</p>
        </div>
        <div className="space-y-4 px-7 py-7">
          <label className="block">
            <span className="mb-1.5 block text-[12px] uppercase tracking-[0.12em] text-ink/55">Email</span>
            <input ref={first} type="email" autoComplete="username" required value={email} onChange={(e) => { setEmail(e.target.value); setError('') }} placeholder="you@company.com" className={field} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[12px] uppercase tracking-[0.12em] text-ink/55">Password</span>
            <span className="relative block">
              <input type={show ? 'text' : 'password'} autoComplete="current-password" required value={password} onChange={(e) => { setPassword(e.target.value); setError('') }} placeholder="••••••" className={`${field} pr-12`} />
              <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? 'Hide password' : 'Show password'} className="absolute right-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full text-ink/50 hover:text-ink">
                <Icon icon={show ? 'solar:eye-closed-linear' : 'solar:eye-linear'} className="size-5" />
              </button>
            </span>
          </label>
          {error && <p role="alert" className="flex items-center gap-2 rounded-xl bg-[#f5e1de] px-3.5 py-2.5 text-[13px] text-[#9b3a2e]"><Icon icon="solar:danger-circle-linear" className="size-4 shrink-0" />{error}</p>}
          <button type="submit" disabled={busy} className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink text-[13px] uppercase tracking-[0.16em] text-white transition-colors hover:bg-green-dark disabled:opacity-60">
            {busy ? 'Signing in…' : 'Sign in'} <Icon icon="solar:arrow-right-linear" className="size-4" />
          </button>
        </div>
      </form>
    </div>,
    document.body,
  )
}
