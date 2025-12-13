import { useState } from 'react'
import { formatarMoeda } from '../lib/utils'
import { som } from '../lib/sons'

export default function CardConta({ 
  conta, 
  onMarcarPago, 
  onAbrirAnotacoes,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  isDragging
}) {
  const [confirmando, setConfirmando] = useState(false)

  const handleMarcarPago = () => {
    if (conta.pago) {
      // Desmarcar como pago
      onMarcarPago(conta.id, false)
      som.tocar('clique')
    } else {
      // Marcar como pago
      setConfirmando(true)
    }
  }

  const confirmarPagamento = () => {
    onMarcarPago(conta.id, true)
    som.tocar('moeda')
    setConfirmando(false)
  }

  const cancelarConfirmacao = () => {
    setConfirmando(false)
    som.tocar('clique')
  }

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, conta)}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, conta)}
      className={`
        card-conta
        ${isDragging ? 'dragging' : ''}
        ${conta.pago ? 'opacity-60' : ''}
        transition-all duration-300
      `}
    >
      {/* Indicador de tipo */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {/* Badge de tipo */}
          <span className={`
            text-[10px] px-2 py-0.5 rounded-full font-medium
            ${conta.tipo === 'fixa' 
              ? 'bg-contabio-accent/20 text-contabio-accent' 
              : 'bg-purple-500/20 text-purple-400'}
          `}>
            {conta.tipo === 'fixa' ? 'FIXA' : 'PARCELA'}
          </span>
          
          {/* Indicador de anotação */}
          {conta.anotacoes && (
            <span className="text-contabio-yellow text-xs">📝</span>
          )}
        </div>

        {/* Botão de anotações */}
        <button
          onClick={() => {
            onAbrirAnotacoes(conta)
            som.tocar('clique')
          }}
          className="p-1.5 rounded-lg hover:bg-contabio-card-hover transition-colors"
          title="Anotações"
        >
          <svg className="w-4 h-4 text-contabio-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
      </div>

      {/* Nome e Valor */}
      <div className="mb-3">
        <h3 className={`font-medium text-white mb-1 ${conta.pago ? 'line-through text-contabio-text-muted' : ''}`}>
          {conta.nome}
        </h3>
        <p className={`text-xl font-bold ${conta.pago ? 'text-contabio-green' : 'text-white'}`}>
          {formatarMoeda(conta.valor)}
        </p>
      </div>

      {/* Vencimento */}
      <div className="flex items-center gap-2 mb-4 text-sm text-contabio-text-muted">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span>Venc: dia {conta.vencimento}</span>
      </div>

      {/* Botão de Pagar / Status */}
      {confirmando ? (
        <div className="flex gap-2 animate-fade-in">
          <button
            onClick={confirmarPagamento}
            className="flex-1 bg-contabio-green hover:bg-contabio-green-soft text-white text-sm font-medium py-2 px-3 rounded-xl transition-colors"
          >
            ✓ Confirmar
          </button>
          <button
            onClick={cancelarConfirmacao}
            className="flex-1 bg-contabio-card-hover text-contabio-text-muted text-sm font-medium py-2 px-3 rounded-xl transition-colors"
          >
            Cancelar
          </button>
        </div>
      ) : (
        <button
          onClick={handleMarcarPago}
          className={`
            w-full py-2.5 px-4 rounded-xl text-sm font-medium transition-all duration-300
            flex items-center justify-center gap-2
            ${conta.pago 
              ? 'bg-contabio-green/20 text-contabio-green border border-contabio-green/30 hover:bg-contabio-green/30' 
              : 'bg-contabio-card-hover text-white hover:bg-contabio-green hover:text-white'}
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
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Marcar como pago
            </>
          )}
        </button>
      )}
    </div>
  )
}
