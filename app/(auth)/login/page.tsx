'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      router.replace('/movies/search')
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password: password.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      localStorage.setItem('token', data.token)
      // Dispatch custom event to notify TopNav about auth change
      window.dispatchEvent(new Event('authChange'))
      router.replace('/movies/search')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className='d-flex align-items-center justify-content-center py-5'
      style={{ minHeight: '100vh' }}
    >
      <div className='mx-auto' style={{ maxWidth: '400px', width: '100%' }}>
        <div className='text-center mb-4'>
          <div
            className='gradient-primary rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3'
            style={{ width: '64px', height: '64px' }}
          >
            <span className='text-white fs-2'>🔐</span>
          </div>
          <h2 className='fs-1 fw-bold text-dark mb-2'>Welcome back</h2>
          <p className='text-muted'>Sign in to your account to continue</p>
        </div>

        <div className='card-custom p-4'>
          <form onSubmit={handleSubmit}>
            <div className='mb-3'>
              <label htmlFor='email' className='form-label fw-medium text-dark'>
                Email address
              </label>
              <input
                id='email'
                name='email'
                type='email'
                autoComplete='email'
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='form-control-custom'
                placeholder='Enter your email'
                disabled={loading}
              />
            </div>

            <div className='mb-3'>
              <label
                htmlFor='password'
                className='form-label fw-medium text-dark'
              >
                Password
              </label>
              <input
                id='password'
                name='password'
                type='password'
                autoComplete='current-password'
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='form-control-custom'
                placeholder='Enter your password'
                disabled={loading}
              />
            </div>

            {error && (
              <div className='bg-danger bg-opacity-10 border border-danger rounded-lg p-3 mb-3'>
                <p className='text-danger small mb-0'>{error}</p>
              </div>
            )}

            <button
              type='submit'
              disabled={loading}
              className='btn-custom-primary w-100 py-3'
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className='text-center mt-4'>
            <p className='text-muted small mb-0'>
              Don&apos;t have an account?{' '}
              <Link
                href='/register'
                className='text-primary fw-medium text-decoration-none'
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
