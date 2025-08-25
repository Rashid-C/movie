import { NextRequest, NextResponse } from 'next/server'
import { getUserIdFromRequest } from '@/lib/auth'

type OmdbSearchItem = {
  Title: string
  Year: string
  Poster: string
  imdbID: string
}

type OmdbSearchResponse = {
  Search?: OmdbSearchItem[]
  Response: 'True' | 'False'
  Error?: string
}

export async function GET(req: NextRequest) {
  const userId = getUserIdFromRequest(req)
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const title = searchParams.get('title')
  if (!title || title.trim().length === 0) {
    return NextResponse.json(
      { error: 'Please enter a movie title' },
      { status: 400 }
    )
  }

  const apiKey = process.env.OMDB_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'OMDB_API_KEY not configured' },
      { status: 500 }
    )
  }

  try {
    const searchTerm = title.trim()
    const omdbUrl = `https://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(
      searchTerm
    )}&type=movie`

    const res = await fetch(omdbUrl, {
      cache: 'no-store',
      headers: {
        Accept: 'application/json',
      },
    })

    if (!res.ok) {
      return NextResponse.json(
        {
          error: `OMDb API error: ${res.status} ${res.statusText}`,
        },
        { status: 502 }
      )
    }

    const data: OmdbSearchResponse = await res.json()

    if (data.Response === 'False') {
      const errorMessage = data.Error || 'No movies found'
      return NextResponse.json({
        results: [],
        error: errorMessage,
      })
    }

    if (!data.Search || data.Search.length === 0) {
      return NextResponse.json({
        results: [],
        error: 'No movies found for this search term',
      })
    }

    const results = data.Search.map((m) => ({
      title: m.Title,
      year: m.Year,
      poster: m.Poster,
      imdbID: m.imdbID,
    }))

    return NextResponse.json({ results })
  } catch (e) {
    console.error('OMDb API error:', e)
    return NextResponse.json(
      {
        error: 'Failed to fetch from OMDb API. Please try again.',
      },
      { status: 502 }
    )
  }
}
