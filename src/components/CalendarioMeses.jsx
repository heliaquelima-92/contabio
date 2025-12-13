import { useRef, useEffect } from 'react'
import { mesCurto, obterMesAnoAtual } from '../lib/utils'
import { som } from '../lib/sons'

export default function CalendarioMeses({ mesAtual, anoAtual, onMudarMes }) {
  const scrollRef = useRef(null)
  const { mes: mesHoje, ano: anoHoje } = obterMesAnoAtual()

  const meses = Array.from({ length: 12 }, (_, i) => i + 1)

  useEffect(() => {
    // Scroll automático para o mês atual
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
    <div className="glass-card p-4 animate-slide-down">
      {/* Seletor de Ano */}
      <div className="flex items-center justify-center gap-4 mb-4">
        <button
          onClick={handleAnoAnterior}
          className="p-2 rounded-lg hover:bg-contabio-card-hover transition-colors"
        >
          <svg className="w-5 h-5 text-contabio-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <span className="font-montserrat font-bold text-2xl text-white min-w-[80px] text-center">
          {anoAtual}
        </span>
        
        <button
          onClick={handleProximoAno}
          className="p-2 rounded-lg hover:bg-contabio-card-hover transition-colors"
        >
          <svg className="w-5 h-5 text-contabio-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Lista de Meses */}
      <div 
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {meses.map((mes) => {
          const ehAtual = mes === mesAtual && anoAtual === anoHoje
          const ehSelecionado = mes === mesAtual
          const ehMesHoje = mes === mesHoje && anoAtual === anoHoje

          return (
            <button
              key={mes}
              data-mes={mes}
              onClick={() => handleMudarMes(mes)}
              className={`
                mes-item relative
                ${ehSelecionado ? 'mes-item-active' : 'mes-item-inactive'}
              `}
            >
              {mesCurto(mes)}
              
              {/* Indicador de mês atual */}
              {ehMesHoje && !ehSelecionado && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-contabio-green rounded-full" />
              )}
            </button>
          )
        })}
      </div>

      {/* Indicador de dia de referência */}
      <div className="mt-3 text-center">
        <span className="text-xs text-contabio-text-muted">
          Dia de referência: <span className="text-white font-medium">10</span>
        </span>
      </div>
    </div>
  )
}
