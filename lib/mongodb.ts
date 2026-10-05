import mongoose from 'mongoose'

function getMongoUri() {
  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error('MONGODB_URI is not configured')
  return uri
}

type MongooseCache = {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

const globalWithMongoose = globalThis as typeof globalThis & {
  mongooseCache?: MongooseCache
}

const cached = globalWithMongoose.mongooseCache ?? { conn: null, promise: null }
globalWithMongoose.mongooseCache = cached

export async function connectToDatabase() {
  if (cached.conn) return cached.conn
  if (!cached.promise) cached.promise = mongoose.connect(getMongoUri(), { dbName: 'ayurveda' })
  try {
    cached.conn = await cached.promise
  } catch (error) {
    cached.promise = null
    throw error
  }
  return cached.conn
}
