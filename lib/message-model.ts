import mongoose, { Schema } from 'mongoose'

export type MessageRecord = {
  id: string
  date: string
  name: string
  email: string
  phone: string
  order: string
  topic: string
  message: string
  read: boolean
  starred: boolean
  archived: boolean
}

const messageSchema = new Schema<MessageRecord>(
  {
    id: { type: String, required: true, unique: true, index: true },
    date: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, default: '' },
    order: { type: String, default: '' },
    topic: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    read: { type: Boolean, default: false },
    starred: { type: Boolean, default: false },
    archived: { type: Boolean, default: false },
  },
  { versionKey: false },
)

export const MessageModel = mongoose.models.Message || mongoose.model<MessageRecord>('Message', messageSchema)
