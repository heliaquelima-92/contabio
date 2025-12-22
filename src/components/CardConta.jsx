import { useState } from 'react'
import { motion } from 'framer-motion'
import { formatarMoeda } from '../lib/utils'
import { som } from '../lib/sons'

export default function CardConta({ 
  conta, 
  onMarcarPago, 
  onAbrirDetalhes,
  index = 0
}) {
  const [confirmando, setConfirmando] = useState(false)

  const handleMarcarPago = () => {
    if (conta.pago) {
      onMarcarPago(conta.id, false)
      som.tocar('clique')
    } else {
      setConfirmando(true)
    }
  }

  const confirmarPagamento = () => {
    onMarcarPago(conta.id, true)
    som.tocar('moeda')
    setConfirmando(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`card p-4 card-hover ${conta.pago ? 'opacity-60' : ''}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {/* Badge de tipo */}
          <span className={`badge ${conta.tipo === 'fixa' ? 'badge-lime' : 'bg-purple-500/20 text-purple-400'}`}>
            {conta.tipo === 'fixa' ? 'FIXA' : 'PARCELA'}
          </span>
          
          {/* Indicador de anotação */}
          {conta.anotacoes && (
            <span className="text-xs">📝</span>
          )}
        </div>

        {/* Botão de detalhes */}
        <button
          onClick={() => onAbrirDetalhes(conta)}
          className="w-8 h-8 rounded-full bg-moncash-card flex items-center justify-center
                    hover:bg-moncash-card-hover transition-colors"
        >
          <svg className="w-4 h-4 text-moncash-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>

      {/* Nome e Valor */}
      <div className="mb-3">
        <h3 className={`font-semibold text-white mb-1 ${conta.pago ? 'line-through text-moncash-text-muted' : ''}`}>
          {conta.nome}
        </h3>
        {conta.valor ? (
          <p className={`text-2xl font-bold tabular-nums ${conta.pago ? 'text-moncash-success' : 'text-white'}`}>
            {formatarMoeda(conta.valor)}
          </p>
        ) : (
          <p className="text-sm text-moncash-text-muted italic">Valor a definir</p>
        )}
      </div>

      {/* Vencimento */}
      <div className="flex items-center gap-2 mb-4 text-xs text-moncash-text-muted">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span>Vence dia {conta.vencimento}</span>
      </div>

      {/* Botão de Pagar */}
      {confirmando ? (
        <div className="flex gap-2">
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={confirmarPagamento}
            className="flex-1 bg-moncash-lime text-moncash-dark text-sm font-semibold py-2.5 rounded-xl"
          >
            ✓ Confirmar
          </motion.button>
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => setConfirmando(false)}
            className="flex-1 bg-moncash-card text-moncash-text-muted text-sm font-medium py-2.5 rounded-xl"
          >
            Cancelar
          </motion.button>
        </div>
      ) : (
        <button
          onClick={handleMarcarPago}
          className={`
            w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-300
            flex items-center justify-center gap-2
            ${conta.pago 
              ? 'bg-moncash-success/20 text-moncash-success border border-moncash-success/30' 
              : 'bg-moncash-card hover:bg-moncash-lime hover:text-moncash-dark text-white'}
          `}
        >
          {conta.pago ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Pago
            </>
          ) : (
            'Marcar como pago'
          )}
        </button>
      )}
    </motion.div>
  )
}
