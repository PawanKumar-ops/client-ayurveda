'use client'

import { useState } from 'react'
import { Icon } from '@iconify/react'
import { auth, ADMIN_EMAIL } from '@/lib/auth'
import { Card } from '../ui'
import AdminLayout from '../AdminLayout'

function PasswordView() {
  const [f, setF] = useState({ current: '', next: '', confirm: '' })
  const [show, setShow] = useState(false)
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => { setF({ ...f, [k]: e.target.value }); setMsg(null) }
  const checks = [
    { ok: f.next.length >= 6, l: 'At least 6 characters' },
    { ok: !!f.next && f.next !== f.current, l: 'Different from current password' },
    { ok: !!f.next && f.next === f.confirm, l: 'Both new passwords match' },
  ]
  const strength = [f.next.length >= 8, /[A-Z]/.test(f.next) && /[a-z]/.test(f.next), /\d/.test(f.next), /[^A-Za-z0-9]/.test(f.next)].filter(Boolean).length
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!checks.every((c) => c.ok)) return setMsg({ ok: false, text: 'Please meet all the requirements below.' })
    if (!auth.changePassword(f.current, f.next)) return setMsg({ ok: false, text: 'Current password is incorrect.' })
    setF({ current: '', next: '', confirm: '' })
    setMsg({ ok: true, text: 'Password updated. Use it next time you sign in.' })
  }
  const input = 'h-12 w-full rounded-xl border border-ink/15 bg-white px-4 text-[14px] outline-none transition-colors focus:border-ink'
  return (
    <div className="grid max-w-[920px] gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
      <Card title="Update admin password">
        <form onSubmit={submit} className="space-y-4">
          {([['current', 'Current password', 'current-password'], ['next', 'New password', 'new-password'], ['confirm', 'Confirm new password', 'new-password']] as const).map(([k, l, ac]) => (
            <label key={k} className="block">
            <span className="mb-1.5 block text-[12px] uppercase tracking-[0.12em] text-ink/55">{l}</span>
              <input type={show ? 'text' : 'password'} autoComplete={ac} required value={f[k]} onChange={set(k)} className={input} />
            </label>
          ))}
          {f.next && (
            <div>
              <div className="flex gap-1.5">{[0, 1, 2, 3].map((i) => <span key={i} className={`h-1.5 flex-1 rounded-full ${i < strength ? (strength < 2 ? 'bg-[#b85445]' : strength < 4 ? 'bg-accent' : 'bg-green') : 'bg-cream'}`} />)}</div>
              <p className="mt-1.5 text-[12px] text-ink/55">Strength: {['Weak', 'Weak', 'Fair', 'Good', 'Strong'][strength]}</p>
            </div>
          )}
          <label className="flex w-fit cursor-pointer items-center gap-2 text-[13px] text-ink/70">
            <input type="checkbox" checked={show} onChange={(e) => setShow(e.target.checked)} className="size-4 accent-[#24382d]" />Show passwords
          </label>
          {msg && <p role="status" className={`flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-[13px] ${msg.ok ? 'bg-green-soft text-green-dark' : 'bg-[#f5e1de] text-[#9b3a2e]'}`}><Icon icon={msg.ok ? 'solar:check-circle-linear' : 'solar:danger-circle-linear'} className="size-4 shrink-0" />{msg.text}</p>}
          <button type="submit" className="h-11 rounded-full bg-ink px-6 text-[13px] text-white hover:bg-green-dark">Update password</button>
        </form>
      </Card>
      <Card title="Requirements" className="h-fit">
        <ul className="space-y-3">
          {checks.map((c) => (
            <li key={c.l} className={`flex items-center gap-2.5 text-[13px] ${c.ok ? 'text-green-dark' : 'text-ink/55'}`}>
              <Icon icon={c.ok ? 'solar:check-circle-bold' : 'solar:record-linear'} className="size-[18px] shrink-0" />{c.l}
            </li>
          ))}
        </ul>
        <p className="mt-5 border-t border-ink/8 pt-4 text-[12px] leading-relaxed text-ink/50">Sign-in email stays <span className="text-ink">{ADMIN_EMAIL}</span>. The password is stored on this device.</p>
      </Card>
    </div>
  )
}

/* ---------- shell ---------- */



export default function AdminPasswordPage() {
  return <AdminLayout tab="password">{() => <PasswordView />}</AdminLayout>
}
