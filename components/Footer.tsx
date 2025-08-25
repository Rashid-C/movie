export default function Footer() {
  return (
    <footer className='bg-white border-top border-secondary mt-auto'>
      <div className='container-custom py-4'>
        <div className='d-flex flex-column flex-md-row justify-content-between align-items-center'>
          <div className='d-flex align-items-center mb-3 mb-md-0'>
            <div
              className='gradient-primary rounded-lg d-flex align-items-center justify-content-center me-3'
              style={{ width: '32px', height: '32px' }}
            >
              <span className='text-white small fw-bold'>M</span>
            </div>
            <span className='text-dark fw-semibold'>MovieApp</span>
          </div>
          <div className='d-flex align-items-center gap-4'>
            <a
              href='https://www.omdbapi.com/'
              target='_blank'
              rel='noreferrer'
              className='text-muted text-decoration-none small'
            >
              Powered by OMDb API
            </a>
            <span className='text-muted small'>
              © 2025 MovieApp. All rights reserved.
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
