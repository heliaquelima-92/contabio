import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { mesCurto, obterMesAnoAtual } from '../lib/utils'
import { som } from '../lib/sons'

export default function CalendarioMeses({ mesAtual, anoAtual, onMudarMes }) {
  const scrollRef = useRef(null)
  const { mes: mesHoje, ano: anoHoje } = obterMesAnoAtual()
  const meses = Array.from({ length: 12 }, (_, i) => i + 1)

  useEffect(() => {
    if (scrollRef.current) {
      const mesElement = scrollRef.current.querySelector(`[data-mes="${mesAtual}"]`)
      if (mesElement) {
        mesElement.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
      }
    }
  }, [mesAtual])

  const handleMudarMes = (mes) => {
    som.tocar('clique')
    onMudarMes(mes, anoAtual)
  }

  const handleAnoAnterior = () => {
    som.tocar('clique')
    onMudarMes(mesAtual, anoAtual - 1)
  }

  const handleProximoAno = () => {
    som.tocar('clique')
    onMudarMes(mesAtual, anoAtual + 1)
  }

  return (
    <div className="px-4">
      {/* Seletor de Ano */}
      <div className="flex items-center justify-center gap-6 mb-4">
        <button
          onClick={handleAnoAnterior}
          className="w-8 h-8 rounded-full bg-moncash-card flex items-center justify-center
                    hover:bg-moncash-card-hover transition-colors"
        >
          <svg className="w-4 h-4 text-moncash-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <motion.span 
          key={anoAtual}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-poppins font-bold text-2xl text-white min-w-[80px] text-center"
        >
          {anoAtual}
        </motion.span>
        
        <button
          onClick={handleProximoAno}
          className="w-8 h-8 rounded-full bg-moncash-card flex items-center justify-center
                    hover:bg-moncash-card-hover transition-colors"
        >
          <svg className="w-4 h-4 text-moncash-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Lista de Meses */}
      <div 
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4"
      >
        {meses.map((mes) => {
          const ehSelecionado = mes === mesAtual
          const ehMesHoje = mes === mesHoje && anoAtual === anoHoje

          return (
            <motion.button
              key={mes}
              data-mes={mes}
              onClick={() => handleMudarMes(mes)}
              whileTap={{ scale: 0.95 }}
              className={`
                relative px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 whitespace-nowrap
                ${ehSelecionado 
                  ? 'bg-moncash-lime text-moncash-dark shadow-lime' 
                  : 'bg-moncash-card text-moncash-text-muted hover:bg-moncash-card-hover hover:text-white'}
              `}
            >
              {mesCurto(mes)}
              
              {/* Indicador de mês atual */}
              {ehMesHoje && !ehSelecionado && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-moncash-lime rounded-full" />
              )}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
