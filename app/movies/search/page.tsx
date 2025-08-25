'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface Movie {
  title: string
  year: string
  poster: string
  imdbID: string
}

export default function SearchPage() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.replace('/login')
    }
  }, [router])

  const searchMovies = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    setError(null)
    setMovies([])

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(
        `/api/movies/search?title=${encodeURIComponent(query.trim())}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Search failed')
      }

      if (data.error) {
        setError(data.error)
      } else {
        setMovies(data.results || [])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed')
    } finally {
      setLoading(false)
    }
  }

  const saveMovie = async (movie: Movie) => {
    setSaving(movie.imdbID)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/movies/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(movie),
      })

      if (!response.ok) {
        throw new Error('Failed to save movie')
      }

      const button = document.getElementById(`save-${movie.imdbID}`)
      if (button) {
        button.textContent = '✓ Saved!'
        button.className = 'btn-custom-primary w-100 py-2 small'
        setTimeout(() => {
          button.textContent = 'Save'
          button.className = 'btn-custom-primary w-100 py-2 small'
        }, 2000)
      }
    } catch (err) {
      console.error('Failed to save movie:', err)
      const button = document.getElementById(`save-${movie.imdbID}`)
      if (button) {
        button.textContent = 'Error'
        button.className = 'btn-custom-secondary w-100 py-2 small'
        setTimeout(() => {
          button.textContent = 'Save'
          button.className = 'btn-custom-primary w-100 py-2 small'
        }, 2000)
      }
    } finally {
      setSaving(null)
    }
  }

  return (
    <div className='container-custom py-4'>
      <div className='text-center mb-5'>
        <h1 className='fs-1 fw-bold text-dark mb-3'>🔍 Search Movies</h1>
        <p className='fs-5 text-muted mx-auto' style={{ maxWidth: '500px' }}>
          Find your favorite movies and save them to your collection
        </p>
      </div>

      <div className='mx-auto mb-5' style={{ maxWidth: '600px' }}>
        <form onSubmit={searchMovies} className='d-flex gap-3'>
          <input
            type='text'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Enter movie title...'
            className='form-control-custom flex-fill fs-5'
            disabled={loading}
          />
          <button
            type='submit'
            disabled={loading || !query.trim()}
            className='btn-custom-primary px-4 py-3'
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>

      {error && (
        <div className='mx-auto mb-4' style={{ maxWidth: '600px' }}>
          <div className='bg-danger bg-opacity-10 border border-danger rounded-lg p-3'>
            <p className='text-danger text-center mb-0'>{error}</p>
          </div>
        </div>
      )}

      {movies.length > 0 && (
        <div className='mb-4'>
          <h2 className='fs-2 fw-bold text-dark mb-4 text-center'>
            Found {movies.length} movie{movies.length !== 1 ? 's' : ''}
          </h2>
          <div className='row-custom'>
            {movies.map((movie) => (
              <div
                key={movie.imdbID}
                className='col-custom-6 col-custom-4 col-custom-3 mb-4'
              >
                <div className='card-custom h-100'>
                  <div
                    className='position-relative'
                    style={{
                      height: '256px',
                      backgroundColor: 'var(--border-color)',
                    }}
                  >
                    {movie.poster !== 'N/A' ? (
                      <Image
                        src={movie.poster}
                        alt={movie.title}
                        fill
                        className='object-cover'
                        sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw'
                      />
                    ) : (
                      <div className='d-flex align-items-center justify-content-center h-100'>
                        <span className='text-muted fs-1'>🎬</span>
                      </div>
                    )}
                  </div>
                  <div className='card-body'>
                    <h3
                      className='fw-semibold text-dark mb-1'
                      title={movie.title}
                      style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {movie.title}
                    </h3>
                    <p className='text-muted small mb-3'>{movie.year}</p>
                    <button
                      id={`save-${movie.imdbID}`}
                      onClick={() => saveMovie(movie)}
                      disabled={saving === movie.imdbID}
                      className='btn-custom-primary w-100 py-2 small'
                    >
                      {saving === movie.imdbID ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && !error && movies.length === 0 && query && (
        <div className='text-center py-5'>
          <div className='fs-1 mb-3'>🔍</div>
          <h3 className='fs-4 fw-semibold text-dark mb-2'>No movies found</h3>
          <p className='text-muted'>Try searching with a different title</p>
        </div>
      )}

      {!loading && !error && movies.length === 0 && !query && (
        <div className='text-center py-5'>
          <div className='fs-1 mb-3'>🎬</div>
          <h3 className='fs-4 fw-semibold text-dark mb-2'>Start searching</h3>
          <p className='text-muted'>
            Enter a movie title above to find your favorite films
          </p>
        </div>
      )}
    </div>
  )
}
