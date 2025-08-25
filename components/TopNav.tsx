'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function TopNav() {
  const [isAuthed, setIsAuthed] = useState(false)

  const checkAuth = () => {
    const hasToken = !!localStorage.getItem('token')
    setIsAuthed(hasToken)
  }

  useEffect(() => {
    checkAuth()

    const onStorage = () => checkAuth()
    window.addEventListener('storage', onStorage)

    const onAuthChange = () => checkAuth()
    window.addEventListener('authChange', onAuthChange)

    const interval = setInterval(checkAuth, 1000)

    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('authChange', onAuthChange)
      clearInterval(interval)
    }
  }, [])

  const logout = () => {
    localStorage.removeItem('token')
    setIsAuthed(false)
    window.dispatchEvent(new Event('authChange'))
    window.location.href = '/'
  }

  return (
    <header className='navbar-custom'>
      <div className='container-custom'>
        <div className='d-flex justify-content-between align-items-center py-3'>
          <Link
            href='/'
            className='d-flex align-items-center text-decoration-none'
          >
            <div
              className='gradient-primary rounded-lg d-flex align-items-center justify-content-center me-3'
              style={{ width: '40px', height: '40px' }}
            >
              <span className='text-white fw-bold fs-4'>M</span>
            </div>
            <h1 className='navbar-brand-custom mb-0'>MovieApp</h1>
          </Link>

          <nav className='d-flex align-items-center'>
            {isAuthed ? (
              <>
                <Link href='/movies/search' className='nav-link-custom me-3'>
                  🔍 Search
                </Link>
                <Link href='/movies/saved' className='nav-link-custom me-3'>
                  💾 Saved
                </Link>
                <button
                  onClick={logout}
                  className='nav-link-custom text-danger border-0 bg-transparent'
                  style={{ cursor: 'pointer' }}
                >
                  🚪 Logout
                </button>
              </>
            ) : (
              <>
                <Link href='/login' className='nav-link-custom me-3'>
                  Login
                </Link>
                <Link href='/register' className='btn-custom-primary'>
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
