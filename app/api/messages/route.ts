import { connectToDatabase } from '@/lib/mongodb'
import { MessageModel, type MessageRecord } from '@/lib/message-model'

const jsonHeaders = { 'Cache-Control': 'no-store' }

function response(data: unknown, init?: ResponseInit) {
  return Response.json(data, { ...init, headers: { ...jsonHeaders, ...init?.headers } })
}

function serialize(message: MessageRecord) {
  return {
    id: message.id,
    date: message.date,
    name: message.name,
    email: message.email,
    phone: message.phone,
    order: message.order,
    topic: message.topic,
    message: message.message,
    read: message.read,
    starred: message.starred,
    archived: message.archived,
  }
}

export async function GET() {
  await connectToDatabase()
  const messages = await MessageModel.find().sort({ date: -1 }).lean<MessageRecord[]>()
  return response(messages.map(serialize))
}

export async function POST(request: Request) {
  const body = await request.json() as Partial<MessageRecord>
  const required = ['name', 'email', 'topic', 'message'] as const
  if (required.some((field) => typeof body[field] !== 'string' || !body[field]?.trim())) {
    return response({ error: 'Name, email, topic, and message are required' }, { status: 400 })
  }

  await connectToDatabase()
  const message: MessageRecord = {
    id: `M${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    date: new Date().toISOString(),
    name: body.name!.trim(),
    email: body.email!.trim().toLowerCase(),
    phone: typeof body.phone === 'string' ? body.phone.trim() : '',
    order: typeof body.order === 'string' ? body.order.trim() : '',
    topic: body.topic!.trim(),
    message: body.message!.trim(),
    read: false,
    starred: false,
    archived: false,
  }
  const created = await MessageModel.create(message)
  return response(serialize(created.toObject() as MessageRecord), { status: 201 })
}

export async function PATCH(request: Request) {
  const body = await request.json() as { id?: string; patch?: Partial<MessageRecord> }
  if (!body.id || !body.patch || typeof body.patch !== 'object') {
    return response({ error: 'Message id and patch are required' }, { status: 400 })
  }

  const patch: Partial<MessageRecord> = {}
  for (const field of ['read', 'starred', 'archived'] as const) {
    if (typeof body.patch[field] === 'boolean') patch[field] = body.patch[field]
  }
  if (!Object.keys(patch).length) return response({ error: 'No supported fields to update' }, { status: 400 })

  await connectToDatabase()
  const updated = await MessageModel.findOneAndUpdate({ id: body.id }, patch, { new: true }).lean<MessageRecord | null>()
  if (!updated) return response({ error: 'Message not found' }, { status: 404 })
  return response(serialize(updated))
}

export async function DELETE(request: Request) {
  const body = await request.json() as { id?: string }
  if (!body.id) return response({ error: 'Message id is required' }, { status: 400 })

  await connectToDatabase()
  const deleted = await MessageModel.findOneAndDelete({ id: body.id })
  if (!deleted) return response({ error: 'Message not found' }, { status: 404 })
  return response({ id: body.id })
}
