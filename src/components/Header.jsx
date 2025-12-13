import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { som } from '../lib/sons'
import { obterSaudacao } from '../lib/utils'

export default function Header({ onAbrirConfiguracoes }) {
  const { usuario, sair } = useAuth()
  const [menuAberto, setMenuAberto] = useState(false)

  const handleSair = async () => {
    som.tocar('clique')
    await sair()
  }

  const nomeUsuario = usuario?.user_metadata?.nome || usuario?.email?.split('@')[0] || 'Usuário'

  return (
    <header className="sticky top-0 z-50 bg-contabio-dark/80 backdrop-blur-xl border-b border-contabio-border/50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <h1 className="font-montserrat font-bold text-2xl text-white tracking-tight">
              CONTABIO
            </h1>
          </div>

          {/* Saudação e Menu */}
          <div className="flex items-center gap-4">
            <span className="hidden sm:block text-contabio-text-muted text-sm">
              {obterSaudacao()}, <span className="text-white">{nomeUsuario}</span>
            </span>

            {/* Botão do Menu */}
            <div className="relative">
              <button
                onClick={() => {
                  setMenuAberto(!menuAberto)
                  som.tocar('clique')
                }}
                className="w-10 h-10 rounded-full bg-contabio-card border border-contabio-border flex items-center justify-center hover:bg-contabio-card-hover transition-colors"
              >
                <svg 
                  className="w-5 h-5 text-contabio-text-muted" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4 6h16M4 12h16M4 18h16" 
                  />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {menuAberto && (
                <>
                  <div 
                    className="fixed inset-0 z-40"
                    onClick={() => setMenuAberto(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 glass-card py-2 z-50 animate-scale-in">
                    <button
                      onClick={() => {
                        onAbrirConfiguracoes()
                        setMenuAberto(false)
                        som.tocar('clique')
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-contabio-text-muted hover:text-white hover:bg-contabio-card-hover transition-colors flex items-center gap-3"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Configurações
                    </button>
                    
                    <hr className="my-2 border-contabio-border/50" />
                    
                    <button
                      onClick={handleSair}
                      className="w-full px-4 py-2 text-left text-sm text-contabio-red hover:bg-contabio-card-hover transition-colors flex items-center gap-3"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sair
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
