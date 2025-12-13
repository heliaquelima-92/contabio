import { useState } from 'react'
import { som } from '../lib/sons'

export default function BotoesAcao({ onNovaContaFixa, onNovaContaParcelada }) {
  const [menuAberto, setMenuAberto] = useState(false)

  const handleClick = (acao) => {
    som.tocar('clique')
    setMenuAberto(false)
    acao()
  }

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Menu de opções */}
      {menuAberto && (
        <>
          <div 
            className="fixed inset-0"
            onClick={() => setMenuAberto(false)}
          />
          <div className="absolute bottom-16 right-0 space-y-2 animate-slide-up">
            <button
              onClick={() => handleClick(onNovaContaFixa)}
              className="flex items-center gap-3 bg-contabio-card border border-contabio-border rounded-xl px-4 py-3 hover:bg-contabio-card-hover transition-colors whitespace-nowrap"
            >
              <span className="w-8 h-8 rounded-full bg-contabio-accent/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-contabio-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </span>
              <span className="text-white font-medium">Conta Fixa</span>
            </button>

            <button
              onClick={() => handleClick(onNovaContaParcelada)}
              className="flex items-center gap-3 bg-contabio-card border border-contabio-border rounded-xl px-4 py-3 hover:bg-contabio-card-hover transition-colors whitespace-nowrap"
            >
              <span className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </span>
              <span className="text-white font-medium">Conta Parcelada</span>
            </button>
          </div>
        </>
      )}

      {/* Botão principal */}
      <button
        onClick={() => {
          setMenuAberto(!menuAberto)
          som.tocar('clique')
        }}
        className={`
          w-14 h-14 rounded-full bg-contabio-green hover:bg-contabio-green-soft 
          flex items-center justify-center shadow-lg shadow-contabio-green/30
          transition-all duration-300 transform hover:scale-105
          ${menuAberto ? 'rotate-45' : ''}
        `}
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  )
}
