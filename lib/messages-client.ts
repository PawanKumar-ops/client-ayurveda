import type { MessageRecord } from '@/lib/message-model'

export const messagesQueryKey = ['messages'] as const

async function request<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const result = await fetch(input, init)
  const body = await result.json() as T & { error?: string }
  if (!result.ok) throw new Error(body.error || `Message request failed (${result.status})`)
  return body
}

export function fetchMessages() {
  return request<MessageRecord[]>('/api/messages')
}

export function updateMessage(id: string, patch: Partial<MessageRecord>) {
  return request<MessageRecord>('/api/messages', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, patch }),
  })
}

export function deleteMessage(id: string) {
  return request<{ id: string }>('/api/messages', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  })
}
