'use client'

import { useState } from 'react'
import { Icon } from '@iconify/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteMessage, messagesQueryKey, updateMessage } from '@/lib/messages-client'
import type { MessageRecord } from '@/lib/message-model'
import { fmtDate, fmtTime, ago, initials, Empty } from '../ui'
import AdminLayout from '../AdminLayout'

function MessagesView({ messages, query }: { messages: MessageRecord[]; query: string }) {
  const [box, setBox] = useState<'inbox' | 'unread' | 'starred' | 'archived'>('inbox')
  const [activeId, setActiveId] = useState<string | null>(null)
  const [reply, setReply] = useState('')
  const queryClient = useQueryClient()
  const messageMutation = useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<MessageRecord> }) => updateMessage(id, patch),
    onSuccess: (updated) => {
      queryClient.setQueryData<MessageRecord[]>(messagesQueryKey, (current) => current?.map((m) => m.id === updated.id ? updated : m) ?? [updated])
    },
    onError: (error) => console.error('Unable to update admin message', error),
  })
  const deleteMutation = useMutation({
    mutationFn: deleteMessage,
    onSuccess: ({ id }) => {
      queryClient.setQueryData<MessageRecord[]>(messagesQueryKey, (current) => current?.filter((m) => m.id !== id) ?? [])
    },
    onError: (error) => console.error('Unable to delete admin message', error),
  })
  const list = messages.filter((m) => {
    const q = query.toLowerCase()
    if (q && !`${m.name} ${m.email} ${m.phone} ${m.topic} ${m.message}`.toLowerCase().includes(q)) return false
    if (box === 'archived') return m.archived
    if (m.archived) return false
    if (box === 'unread') return !m.read
    if (box === 'starred') return m.starred
    return true
  })
  const active = messages.find((m) => m.id === activeId) ?? null
  const open = (m: MessageRecord) => { setActiveId(m.id); setReply(''); if (!m.read) messageMutation.mutate({ id: m.id, patch: { read: true } }) }
  const boxes = [
    { id: 'inbox', label: 'Inbox', icon: 'solar:inbox-linear', n: messages.filter((m) => !m.archived).length },
    { id: 'unread', label: 'Unread', icon: 'solar:letter-unread-linear', n: messages.filter((m) => !m.read && !m.archived).length },
    { id: 'starred', label: 'Starred', icon: 'solar:star-linear', n: messages.filter((m) => m.starred && !m.archived).length },
    { id: 'archived', label: 'Archived', icon: 'solar:archive-linear', n: messages.filter((m) => m.archived).length },
  ] as const

  const TOPIC_STYLE: Record<string, string> = {
    'Order & delivery': 'bg-[#e3ebf3] text-[#2f5575]', Returns: 'bg-[#f5e1de] text-[#9b3a2e]', 'Product advice': 'bg-green-soft text-green-dark',
    Wholesale: 'bg-[#f6ecd6] text-[#8a6a22]', Press: 'bg-[#ece6f3] text-[#5b4480]',
  }
  const topicCls = (t: string) => TOPIC_STYLE[t] ?? 'bg-cream text-ink'
  const quick = ['Thanks for reaching out!', 'Your order is on its way.', 'We have processed your return.']
  const idx = active ? list.findIndex((m) => m.id === active.id) : -1

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {boxes.map((b) => (
          <button key={b.id} onClick={() => { setBox(b.id); setActiveId(null) }} className={`flex items-center gap-3 rounded-2xl border p-3.5 text-left transition-colors ${box === b.id ? 'border-ink bg-ink text-white' : 'border-ink/8 bg-white text-ink hover:border-ink/25'}`}>
            <span className={`grid size-9 shrink-0 place-items-center rounded-xl ${box === b.id ? 'bg-white/10' : 'bg-cream text-green'}`}><Icon icon={b.icon} className="size-[18px]" /></span>
            <span className="min-w-0">
              <span className={`block text-[11px] uppercase tracking-[0.12em] ${box === b.id ? 'text-white/60' : 'text-ink/50'}`}>{b.label}</span>
              <span className="font-serif-display block text-[20px] leading-tight tabular-nums">{b.n}</span>
            </span>
          </button>
        ))}
      </div>

      <div className="grid h-[calc(100dvh-270px)] min-h-[560px] overflow-hidden rounded-2xl border border-ink/8 bg-white lg:grid-cols-[380px_minmax(0,1fr)]">
        <div className={`min-h-0 flex-col border-ink/8 lg:border-r ${active ? 'hidden lg:flex' : 'flex'}`}>
          <div className="flex items-center justify-between border-b border-ink/8 px-5 py-3.5">
            <p className="text-[14px] font-medium text-ink">{boxes.find((b) => b.id === box)!.label}</p>
            <p className="text-[12px] text-ink/45">{list.length} conversation{list.length === 1 ? '' : 's'}</p>
          </div>
          <ul className="min-h-0 flex-1 overflow-y-auto p-2">
            {list.length ? list.map((m) => (
              <li key={m.id}>
                <button onClick={() => open(m)} className={`relative flex w-full gap-3 rounded-xl px-3.5 py-3.5 text-left transition-colors ${activeId === m.id ? 'bg-cream' : 'hover:bg-cream-soft'}`}>
                  {!m.read && <span className="absolute left-1 top-1/2 h-8 w-[3px] -translate-y-1/2 rounded-full bg-accent" />}
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-green-soft text-[12px] font-medium text-green-dark">{initials(m.name)}</span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className={`truncate text-[13px] ${m.read ? 'text-ink/80' : 'font-semibold text-ink'}`}>{m.name}</span>
                      <span className={`shrink-0 text-[11px] ${m.read ? 'text-ink/40' : 'font-medium text-accent'}`}>{ago(m.date)}</span>
                    </span>
                    <span className={`mt-1 line-clamp-2 block text-[12px] leading-relaxed ${m.read ? 'text-ink/55' : 'text-ink/80'}`}>{m.message}</span>
                    <span className="mt-2 flex items-center gap-1.5">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${topicCls(m.topic)}`}>{m.topic}</span>
                      {m.order && <span className="rounded-full bg-cream-soft px-2 py-0.5 text-[10px] text-ink/60">#{m.order}</span>}
                      {m.starred && <Icon icon="solar:star-bold" className="ml-auto size-3.5 text-accent" />}
                    </span>
                  </span>
                </button>
              </li>
            )) : <Empty icon="solar:inbox-linear" text="Nothing here" />}
          </ul>
        </div>

        <div className={`${active ? 'flex' : 'hidden lg:flex'} min-h-0 flex-col`}>
          {active ? (
            <>
              <header className="flex items-center gap-1 border-b border-ink/8 px-3 py-2.5 md:px-5">
                <button onClick={() => setActiveId(null)} className="grid size-9 place-items-center rounded-full hover:bg-cream lg:hidden" aria-label="Back"><Icon icon="solar:alt-arrow-left-linear" className="size-5" /></button>
                <button disabled={idx <= 0} onClick={() => open(list[idx - 1])} aria-label="Previous" className="hidden size-9 place-items-center rounded-full text-ink/70 hover:bg-cream disabled:opacity-30 lg:grid"><Icon icon="solar:alt-arrow-up-linear" className="size-[18px]" /></button>
                <button disabled={idx < 0 || idx >= list.length - 1} onClick={() => open(list[idx + 1])} aria-label="Next" className="hidden size-9 place-items-center rounded-full text-ink/70 hover:bg-cream disabled:opacity-30 lg:grid"><Icon icon="solar:alt-arrow-down-linear" className="size-[18px]" /></button>
                <div className="ml-auto flex gap-1">
                  {[
                    { i: active.starred ? 'solar:star-bold' : 'solar:star-linear', l: 'Star', f: () => messageMutation.mutate({ id: active.id, patch: { starred: !active.starred } }) },
                    { i: 'solar:letter-unread-linear', l: 'Mark unread', f: () => { messageMutation.mutate({ id: active.id, patch: { read: false } }); setActiveId(null) } },
                    { i: active.archived ? 'solar:inbox-out-linear' : 'solar:archive-linear', l: active.archived ? 'Unarchive' : 'Archive', f: () => { messageMutation.mutate({ id: active.id, patch: { archived: !active.archived } }); setActiveId(null) } },
                    { i: 'solar:trash-bin-trash-linear', l: 'Delete', f: () => { if (confirm('Delete this message?')) { deleteMutation.mutate(active.id); setActiveId(null) } } },
                  ].map((b) => (
                    <button key={b.l} title={b.l} aria-label={b.l} onClick={b.f} className={`grid size-9 place-items-center rounded-full hover:bg-cream ${b.l === 'Star' && active.starred ? 'text-accent' : b.l === 'Delete' ? 'text-[#9b3a2e]/80' : 'text-ink/70'}`}>
                      <Icon icon={b.i} className="size-[18px]" />
                    </button>
                  ))}
                </div>
              </header>
              <div className="min-h-0 flex-1 overflow-y-auto bg-cream-soft/50 px-4 py-6 md:px-8">
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${topicCls(active.topic)}`}>{active.topic}</span>
                <h3 className="font-serif-display mt-3 text-[24px] leading-tight text-ink">{active.topic} enquiry from {active.name.split(' ')[0]}</h3>

                <div className="mt-5 flex flex-wrap items-center gap-3 rounded-2xl border border-ink/8 bg-white p-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-green-soft text-[13px] font-medium text-green-dark">{initials(active.name)}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-medium text-ink">{active.name}</p>
                    <p className="truncate text-[12px] text-ink/55">{active.email}</p>
                    <p className="text-[12px] text-ink/55">{active.phone ? `+91 ${active.phone}` : 'No phone number provided'}</p>
                  </div>
                  <div className="flex gap-1.5">
                    <a href={`mailto:${active.email}`} className="flex h-8 items-center gap-1.5 rounded-full border border-ink/12 px-3 text-[12px] text-ink hover:border-ink"><Icon icon="solar:letter-linear" className="size-4" />Email</a>
                    {active.phone && <a href={`tel:+91${active.phone}`} className="flex h-8 items-center gap-1.5 rounded-full border border-ink/12 px-3 text-[12px] text-ink hover:border-ink"><Icon icon="solar:phone-linear" className="size-4" />Call</a>}
                  </div>
                </div>

                <div className="mt-5 flex items-start gap-3">
                  <div className="max-w-[640px] rounded-2xl rounded-tl-md bg-white p-5 shadow-[0_1px_0_rgba(36,56,45,0.06)] ring-1 ring-ink/8">
                    <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-ink/85">{active.message}</p>
                    <p className="mt-3 text-[11px] text-ink/45">{fmtDate(active.date)} · {fmtTime(active.date)}</p>
                  </div>
                </div>
                {active.order && (
                  <p className="mt-4 inline-flex items-center gap-2 rounded-xl border border-ink/8 bg-white px-3.5 py-2 text-[12px] text-ink">
                    <Icon icon="solar:box-linear" className="size-4 text-green" />Related to order <span className="font-medium">#{active.order}</span>
                  </p>
                )}
              </div>
              <div className="border-t border-ink/8 bg-white p-3 md:p-4">
                <div className="mb-2.5 flex gap-1.5 overflow-x-auto">
                  {quick.map((t) => (
                    <button key={t} onClick={() => setReply((r) => (r ? r + ' ' : '') + t)} className="shrink-0 rounded-full border border-ink/10 px-3 py-1 text-[11px] text-ink/75 hover:border-ink/30 hover:text-ink">{t}</button>
                  ))}
                </div>
                <div className="flex items-end gap-2 rounded-2xl border border-ink/15 p-1.5 pl-4 focus-within:border-ink">
                  <textarea value={reply} onChange={(e) => setReply(e.target.value)} rows={2} placeholder={`Reply to ${active.name.split(' ')[0]}…`} className="min-w-0 flex-1 resize-none bg-transparent py-2 text-[14px] outline-none" />
                  <a
                    href={`mailto:${active.email}?subject=${encodeURIComponent('Re: ' + active.topic)}&body=${encodeURIComponent(reply)}`}
                    className="flex h-10 shrink-0 items-center gap-1.5 rounded-xl bg-ink px-4 text-[12px] text-white hover:bg-green-dark"
                  >
                    <Icon icon="solar:plain-2-linear" className="size-4" /><span className="hidden sm:inline">Send</span>
                  </a>
                </div>
              </div>
            </>
          ) : (
            <div className="grid flex-1 place-items-center">
              <div className="flex flex-col items-center text-center">
                <span className="grid size-16 place-items-center rounded-full bg-cream text-green"><Icon icon="solar:letter-opened-linear" className="size-8" /></span>
                <p className="font-serif-display mt-4 text-[20px] text-ink">Select a conversation</p>
                <p className="mt-1 text-[13px] text-ink/50">Pick a message from the list to read and reply.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}



export default function AdminMessagesPage() {
  return <AdminLayout tab="messages">{({ messages, query }) => <MessagesView messages={messages} query={query} />}</AdminLayout>
}
