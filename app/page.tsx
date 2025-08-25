'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Home() {
  const [isAuthed, setIsAuthed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const checkAuth = () => {
    const hasToken = !!localStorage.getItem('token')
    setIsAuthed(hasToken)
    setIsLoading(false)
  }

  useEffect(() => {
    checkAuth()

    const onStorage = () => checkAuth()
    window.addEventListener('storage', onStorage)

    const onAuthChange = () => checkAuth()
    window.addEventListener('authChange', onAuthChange)

    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('authChange', onAuthChange)
    }
  }, [])

  if (isLoading) {
    return (
      <div
        className='d-flex align-items-center justify-content-center'
        style={{ minHeight: '100vh' }}
      >
        <div className='text-center'>
          <div className='spinner mx-auto mb-3'></div>
          <p className='text-muted'>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      {isAuthed ? (
        <div className='container-custom py-5'>
          <div className='text-center'>
            <div className='mx-auto' style={{ maxWidth: '768px' }}>
              <div className='mb-5'>
                <div
                  className='bg-success rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4'
                  style={{
                    width: '80px',
                    height: '80px',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  }}
                >
                  <span className='fs-1'>🎬</span>
                </div>
                <h2 className='fs-1 fw-bold text-dark mb-3'>Welcome back!</h2>
                <p className='fs-5 text-muted mb-5'>
                  Ready to discover your next favorite movie?
                </p>
              </div>

              <div className='row-custom'>
                <div className='col-custom-6 mb-4'>
                  <Link
                    href='/movies/search'
                    className='card-custom d-block text-decoration-none'
                  >
                    <div className='card-body text-center'>
                      <div
                        className='bg-primary rounded-lg d-flex align-items-center justify-content-center mx-auto mb-3'
                        style={{
                          width: '48px',
                          height: '48px',
                          backgroundColor: 'rgba(37, 99, 235, 0.1)',
                        }}
                      >
                        <span className='fs-2'>🔍</span>
                      </div>
                      <h3 className='fs-4 fw-semibold text-dark mb-2'>
                        Search Movies
                      </h3>
                      <p className='text-muted mb-0'>
                        Find movies by title, year, and more
                      </p>
                    </div>
                  </Link>
                </div>

                <div className='col-custom-6 mb-4'>
                  <Link
                    href='/movies/saved'
                    className='card-custom d-block text-decoration-none'
                  >
                    <div className='card-body text-center'>
                      <div
                        className='bg-info rounded-lg d-flex align-items-center justify-content-center mx-auto mb-3'
                        style={{
                          width: '48px',
                          height: '48px',
                          backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        }}
                      >
                        <span className='fs-2'>💾</span>
                      </div>
                      <h3 className='fs-4 fw-semibold text-dark mb-2'>
                        My Collection
                      </h3>
                      <p className='text-muted mb-0'>View your saved movies</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className='container-custom py-5'>
          <div className='mb-5'>
            <section className='text-center py-5'>
              <div className='mx-auto' style={{ maxWidth: '768px' }}>
                <div className='mb-5'>
                  <div
                    className='gradient-primary rounded-circle d-flex align-items-center justify-content-center mx-auto mb-5'
                    style={{ width: '96px', height: '96px' }}
                  >
                    <span className='fs-1 text-white'>🎬</span>
                  </div>
                  <h1 className='display-4 fw-bold text-dark mb-4'>
                    Discover Amazing Movies
                  </h1>
                  <p
                    className='fs-5 text-muted mx-auto mb-5'
                    style={{ maxWidth: '600px' }}
                  >
                    Search, explore, and save your favorite movies with our
                    comprehensive movie database powered by OMDb API.
                  </p>
                </div>

                <div className='d-flex flex-column flex-sm-row gap-3 justify-content-center'>
                  <Link
                    href='/register'
                    className='btn-custom-primary fs-5 px-4 py-3 shadow-lg'
                  >
                    Get Started Free
                  </Link>
                  <Link
                    href='/login'
                    className='btn-custom-outline fs-5 px-4 py-3 shadow-lg'
                  >
                    Sign In
                  </Link>
                </div>
              </div>
            </section>

            <section className='py-5 bg-white rounded-xl shadow-sm'>
              <div className='container-custom'>
                <div className='text-center mb-5'>
                  <h2 className='fs-2 fw-bold text-dark mb-3'>
                    Why Choose MovieApp?
                  </h2>
                  <p
                    className='fs-5 text-muted mx-auto'
                    style={{ maxWidth: '500px' }}
                  >
                    Everything you need to discover and organize your movie
                    collection
                  </p>
                </div>

                <div className='row-custom'>
                  <div className='col-custom-4 text-center p-4'>
                    <div
                      className='bg-primary rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3'
                      style={{
                        width: '64px',
                        height: '64px',
                        backgroundColor: 'rgba(37, 99, 235, 0.1)',
                      }}
                    >
                      <span className='fs-2'>🔍</span>
                    </div>
                    <h3 className='fs-5 fw-semibold text-dark mb-3'>
                      Smart Search
                    </h3>
                    <p className='text-muted'>
                      Find movies instantly with our powerful search engine.
                      Search by title, year, and more.
                    </p>
                  </div>

                  <div className='col-custom-4 text-center p-4'>
                    <div
                      className='bg-info rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3'
                      style={{
                        width: '64px',
                        height: '64px',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                      }}
                    >
                      <span className='fs-2'>💾</span>
                    </div>
                    <h3 className='fs-5 fw-semibold text-dark mb-3'>
                      Save Favorites
                    </h3>
                    <p className='text-muted'>
                      Build your personal movie collection. Save and organize
                      your favorite films.
                    </p>
                  </div>

                  <div className='col-custom-4 text-center p-4'>
                    <div
                      className='bg-success rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3'
                      style={{
                        width: '64px',
                        height: '64px',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                      }}
                    >
                      <span className='fs-2'>📱</span>
                    </div>
                    <h3 className='fs-5 fw-semibold text-dark mb-3'>
                      Mobile Ready
                    </h3>
                    <p className='text-muted'>
                      Perfect experience on all devices. Responsive design that
                      works everywhere.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className='text-center py-5'>
              <div className='mx-auto' style={{ maxWidth: '600px' }}>
                <h2 className='fs-2 fw-bold text-dark mb-3'>Ready to Start?</h2>
                <p className='fs-5 text-muted mb-4'>
                  Join thousands of movie enthusiasts and start building your
                  collection today.
                </p>
                <Link
                  href='/register'
                  className='btn-custom-primary fs-5 px-4 py-3 shadow-lg gradient-primary'
                >
                  Create Your Account
                </Link>
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  )
}
