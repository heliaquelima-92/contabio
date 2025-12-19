import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Modal({ aberto, onFechar, titulo, children, tamanho = 'md' }) {
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

  const tamanhos = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full mx-4'
  }

  return (
    <AnimatePresence>
      {aberto && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onFechar}
          />
          
          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`relative w-full ${tamanhos[tamanho]} bg-moncash-dark border border-moncash-border 
                       rounded-t-3xl sm:rounded-2xl max-h-[90vh] overflow-hidden`}
          >
            {/* Header */}
            <div className="sticky top-0 bg-moncash-dark border-b border-moncash-border px-5 py-4 flex items-center justify-between">
              {/* Drag indicator (mobile) */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-moncash-border rounded-full sm:hidden" />
              
              <h2 className="text-lg font-semibold text-white">{titulo}</h2>
              
              <button
                onClick={onFechar}
                className="w-8 h-8 rounded-full bg-moncash-card flex items-center justify-center 
                          hover:bg-moncash-card-hover transition-colors"
              >
                <svg className="w-4 h-4 text-moncash-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-5 overflow-y-auto max-h-[calc(90vh-80px)]">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
