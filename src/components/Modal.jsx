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
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
            onClick={onFechar}
          />
          
          {/* Modal Content - SEMPRE CENTRALIZADO */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`relative w-full ${tamanhos[tamanho]} bg-moncash-dark border border-moncash-border 
                       rounded-2xl max-h-[85vh] overflow-hidden shadow-2xl`}
          >
            {/* Header */}
            <div className="sticky top-0 bg-moncash-dark border-b border-moncash-border px-5 py-4 flex items-center justify-between z-10">
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
            <div className="p-5 overflow-y-auto max-h-[calc(85vh-70px)]">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
