'use client'
import { useEffect } from 'react'

interface ToastProps {
  message: string
  type: 'success' | 'error'
  isVisible: boolean
  onClose: () => void
}

export default function Toast({
  message,
  type,
  isVisible,
  onClose,
}: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose()
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])

  if (!isVisible) return null

  const bgColor = type === 'success' ? 'bg-success' : 'bg-danger'
  const icon = type === 'success' ? '✅' : '❌'
  const borderColor = type === 'success' ? 'border-success' : 'border-danger'

  return (
    <div
      className='position-fixed'
      style={{ top: '1.5rem', right: '1.5rem', zIndex: 1050 }}
    >
      <div
        className={`${bgColor} border ${borderColor} text-white px-4 py-3 rounded-3 shadow-lg d-flex align-items-center gap-3`}
        style={{
          minWidth: '280px',
          maxWidth: '400px',
          backdropFilter: 'blur(8px)',
        }}
      >
        <span className='fs-4'>{icon}</span>
        <span className='small fw-medium flex-fill'>{message}</span>
        <button
          onClick={onClose}
          className='text-white border-0 bg-transparent'
          style={{ opacity: 0.7, cursor: 'pointer' }}
        >
          ✕
        </button>
      </div>
    </div>
  )
}
