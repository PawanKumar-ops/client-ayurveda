import mongoose, { Schema } from 'mongoose'
import bcrypt from 'bcryptjs'
import { connectToDatabase } from '@/lib/mongodb'
import { ADMIN_EMAIL } from '@/lib/admin-email'

type AdminRecord = { email: string; passwordHash: string }

const adminSchema = new Schema<AdminRecord>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
  },
  { versionKey: false, timestamps: true },
)

export const AdminModel = mongoose.models.Admin || mongoose.model<AdminRecord>('Admin', adminSchema)

// Initial password; saved to the database (as a bcrypt hash) the first time the admin record is needed.
const INITIAL_PASSWORD = '12po09&'

export async function getAdmin() {
  await connectToDatabase()
  const existing = await AdminModel.findOne({ email: ADMIN_EMAIL })
  if (existing) return existing
  return AdminModel.findOneAndUpdate(
    { email: ADMIN_EMAIL },
    { $setOnInsert: { email: ADMIN_EMAIL, passwordHash: await bcrypt.hash(INITIAL_PASSWORD, 12) } },
    { upsert: true, new: true },
  )
}

export async function verifyAdmin(email: string, password: string) {
  if (email.trim().toLowerCase() !== ADMIN_EMAIL) return false
  const admin = await getAdmin()
  return bcrypt.compare(password, admin.passwordHash)
}

export async function setAdminPassword(password: string) {
  await getAdmin()
  await AdminModel.updateOne({ email: ADMIN_EMAIL }, { passwordHash: await bcrypt.hash(password, 12) })
}
