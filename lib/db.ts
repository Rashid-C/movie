import mongoose from 'mongoose'

declare global {
  var _mongooseConnection:
    | { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null }
    | undefined
}

let cached = global._mongooseConnection
if (!cached) {
  cached = global._mongooseConnection = { conn: null, promise: null }
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached!.conn) {
    return cached!.conn
  }
  if (!cached!.promise) {
    const mongoUri = process.env.MONGODB_URI
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in environment variables')
    }
    cached!.promise = mongoose.connect(mongoUri, {
      dbName: process.env.MONGODB_DB_NAME || undefined,
      bufferCommands: false,
    })
  }
  cached!.conn = await cached!.promise
  return cached!.conn
}
