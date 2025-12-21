import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import { som } from '../lib/sons'
import { obterSaudacao } from '../lib/utils'

export default function Header() {
  const { usuario, sair } = useAuth()
  const [menuAberto, setMenuAberto] = useState(false)

  const nomeUsuario = usuario?.user_metadata?.nome || usuario?.email?.split('@')[0] || 'Usuário'
  const primeiraLetra = nomeUsuario.charAt(0).toUpperCase()

  const handleSair = async () => {
    som.tocar('clique')
    await sair()
  }

  return (
    <header className="sticky top-0 z-40 bg-moncash-dark/90 backdrop-blur-xl safe-top">
      <div className="px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <img 
            src="https://i.imgur.com/igiIEnb.png" 
            alt="Moncash" 
            className="h-7"
          />
        </motion.div>

        {/* Saudação e Avatar */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="text-right hidden sm:block">
            <p className="text-xs text-moncash-text-muted">{obterSaudacao()}</p>
            <p className="text-sm font-medium text-white">{nomeUsuario}</p>
          </div>

          {/* Avatar / Menu */}
          <div className="relative">
            <button
              onClick={() => {
                setMenuAberto(!menuAberto)
                som.tocar('clique')
              }}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-moncash-lime to-moncash-lime-dark
                        flex items-center justify-center text-moncash-dark font-bold text-sm
                        transition-transform hover:scale-105 active:scale-95"
            >
              {primeiraLetra}
            </button>

            {/* Dropdown */}
            <AnimatePresence>
              {menuAberto && (
                <>
                  <div 
                    className="fixed inset-0 z-40"
                    onClick={() => setMenuAberto(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute right-0 mt-2 w-48 card p-2 z-50"
                  >
                    <div className="px-3 py-2 border-b border-moncash-border mb-2">
                      <p className="text-sm font-medium text-white">{nomeUsuario}</p>
                      <p className="text-xs text-moncash-text-muted truncate">{usuario?.email}</p>
                    </div>
                    
                    <button
                      onClick={handleSair}
                      className="w-full px-3 py-2 text-left text-sm text-moncash-error 
                                hover:bg-moncash-error/10 rounded-lg transition-colors
                                flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sair
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </header>
  )
}
