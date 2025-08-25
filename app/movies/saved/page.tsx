'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

interface Movie {
  title: string
  year: string
  poster: string
  imdbID: string
}

export default function SavedPage() {
  const router = useRouter()
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.replace('/login')
      return
    }

    fetchSavedMovies()
  }, [router])

  const fetchSavedMovies = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/movies/list', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch saved movies')
      }

      const data = await response.json()
      setMovies(data.movies || [])
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load saved movies'
      )
    } finally {
      setLoading(false)
    }
  }

  const deleteMovie = async (imdbID: string) => {
    setDeleting(imdbID)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/movies/save?imdbID=${imdbID}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to delete movie')
      }

      setMovies((prev) => prev.filter((movie) => movie.imdbID !== imdbID))
    } catch (err) {
      console.error('Failed to delete movie:', err)

      const button = document.getElementById(`delete-${imdbID}`)
      if (button) {
        button.textContent = 'Error'
        button.className = 'btn-custom-secondary px-3 py-1 small'
        setTimeout(() => {
          button.textContent = 'Delete'
          button.className = 'btn-custom-secondary px-3 py-1 small'
        }, 2000)
      }
    } finally {
      setDeleting(null)
    }
  }

  if (loading) {
    return (
      <div className='container-custom py-4'>
        <div className='text-center'>
          <div className='spinner mx-auto mb-3'></div>
          <p className='text-muted'>Loading your collection...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='container-custom py-4'>
      <div className='text-center mb-5'>
        <h1 className='fs-1 fw-bold text-dark mb-3'>💾 My Collection</h1>
        <p className='fs-5 text-muted mx-auto' style={{ maxWidth: '500px' }}>
          Your saved movies and personal collection
        </p>
      </div>

      {error && (
        <div className='mx-auto mb-4' style={{ maxWidth: '600px' }}>
          <div className='bg-danger bg-opacity-10 border border-danger rounded-lg p-3'>
            <p className='text-danger text-center mb-0'>{error}</p>
          </div>
        </div>
      )}

      {movies.length > 0 ? (
        <div className='mb-4'>
          <div className='d-flex justify-content-between align-items-center mb-4'>
            <h2 className='fs-2 fw-bold text-dark'>
              {movies.length} Saved Movie{movies.length !== 1 ? 's' : ''}
            </h2>
            <Link
              href='/movies/search'
              className='btn-custom-primary px-3 py-2 small'
            >
              🔍 Search More
            </Link>
          </div>

          <div className='row-custom'>
            {movies.map((movie) => (
              <div
                key={movie.imdbID}
                className='col-custom-6 col-custom-4 col-custom-3 mb-4'
              >
                <div className='card-custom h-100 position-relative'>
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
                    <div
                      className='position-absolute'
                      style={{ top: '0.5rem', right: '0.5rem' }}
                    >
                      <button
                        id={`delete-${movie.imdbID}`}
                        onClick={() => deleteMovie(movie.imdbID)}
                        disabled={deleting === movie.imdbID}
                        className='btn-custom-secondary px-3 py-1 small'
                      >
                        {deleting === movie.imdbID ? '...' : 'Delete'}
                      </button>
                    </div>
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
                    <p className='text-muted small mb-0'>{movie.year}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className='text-center py-5'>
          <div className='mx-auto' style={{ maxWidth: '400px' }}>
            <div className='fs-1 mb-4'>💾</div>
            <h3 className='fs-2 fw-bold text-dark mb-3'>
              Your collection is empty
            </h3>
            <p className='text-muted mb-4'>
              Start building your movie collection by searching and saving your
              favorite films
            </p>
            <Link
              href='/movies/search'
              className='btn-custom-primary px-4 py-3'
            >
              🔍 Start Searching
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
