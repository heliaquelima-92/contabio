import { useEffect } from 'react'

export default function Modal({ aberto, onFechar, titulo, children }) {
  // Fechar com ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onFechar()
    }
    
    if (aberto) {
      document.addEventListener('keydown', handleEsc)
      document.body.style.overflow = 'hidden'
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = 'unset'
    }
  }, [aberto, onFechar])

  if (!aberto) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm modal-overlay"
        onClick={onFechar}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-md glass-card p-6 modal-content max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-semibold text-white">{titulo}</h2>
          <button
            onClick={onFechar}
            className="p-2 rounded-lg hover:bg-contabio-card-hover transition-colors"
          >
            <svg className="w-5 h-5 text-contabio-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        {children}
      </div>
    </div>
  )
}
