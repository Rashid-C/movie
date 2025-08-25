import { NextRequest, NextResponse } from 'next/server'
import { getUserIdFromRequest } from '@/lib/auth'
import { connectToDatabase } from '@/lib/db'
import { User } from '@/models/User'

export async function POST(req: NextRequest) {
  const userId = getUserIdFromRequest(req)
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { title, year, poster, imdbID } = await req.json()
  if (!title || !year || !poster || !imdbID) {
    return NextResponse.json(
      { error: 'All fields are required' },
      { status: 400 }
    )
  }

  await connectToDatabase()

  await User.updateOne(
    { _id: userId, 'savedMovies.imdbID': { $ne: imdbID } },
    { $push: { savedMovies: { title, year, poster, imdbID } } }
  )

  return NextResponse.json({ message: 'Saved' })
}

export async function DELETE(req: NextRequest) {
  const userId = getUserIdFromRequest(req)
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const imdbID = searchParams.get('imdbID')
  if (!imdbID) {
    return NextResponse.json({ error: 'imdbID is required' }, { status: 400 })
  }

  await connectToDatabase()
  await User.updateOne({ _id: userId }, { $pull: { savedMovies: { imdbID } } })

  return NextResponse.json({ message: 'Deleted' })
}
