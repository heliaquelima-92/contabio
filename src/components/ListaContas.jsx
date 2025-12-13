import { useState } from 'react'
import CardConta from './CardConta'
import { som } from '../lib/sons'
import { gerarConfetes, mensagensMotivacionais } from '../lib/utils'

export default function ListaContas({ 
  contasMes, 
  onMarcarPago, 
  onAtualizarOrdem,
  onAbrirAnotacoes,
  todasPagas
}) {
  const [draggedItem, setDraggedItem] = useState(null)
  const [mostrarParabens, setMostrarParabens] = useState(false)

  const contasPendentes = contasMes.filter(c => !c.pago)
  const contasPagas = contasMes.filter(c => c.pago)

  const handleDragStart = (e, conta) => {
    setDraggedItem(conta)
    e.dataTransfer.effectAllowed = 'move'
    som.tocar('clique')
  }

  const handleDragEnd = () => {
    setDraggedItem(null)
    som.tocar('soltar')
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e, targetConta) => {
    e.preventDefault()
    if (!draggedItem || draggedItem.id === targetConta.id) return

    const newOrder = [...contasMes]
    const draggedIndex = newOrder.findIndex(c => c.id === draggedItem.id)
    const targetIndex = newOrder.findIndex(c => c.id === targetConta.id)

    newOrder.splice(draggedIndex, 1)
    newOrder.splice(targetIndex, 0, draggedItem)

    onAtualizarOrdem(newOrder)
  }

  const handleMarcarPago = async (id, pago) => {
    await onMarcarPago(id, pago)
    
    // Verificar se todas as contas foram pagas
    const contasAposPagamento = contasMes.map(c => 
      c.id === id ? { ...c, pago } : c
    )
    
    if (pago && contasAposPagamento.every(c => c.pago)) {
      // Mostrar parabéns!
      setMostrarParabens(true)
      som.tocar('sucesso')
      gerarConfetes()
      
      setTimeout(() => {
        setMostrarParabens(false)
      }, 5000)
    }
  }

  return (
    <div className="space-y-6">
      {/* Mensagem de Parabéns */}
      {mostrarParabens && (
        <div className="glass-card p-6 text-center animate-bounce-soft bg-gradient-to-r from-contabio-green/20 to-contabio-accent/20 border-contabio-green/30">
          <span className="text-4xl mb-3 block">🎉</span>
          <h3 className="text-xl font-bold text-white mb-2">Parabéns!</h3>
          <p className="text-contabio-text-muted">
            {mensagensMotivacionais[Math.floor(Math.random() * mensagensMotivacionais.length)]}
          </p>
        </div>
      )}

      {/* Seção A PAGAR */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-contabio-red animate-pulse" />
            A Pagar
            <span className="text-sm font-normal text-contabio-text-muted">
              ({contasPendentes.length})
            </span>
          </h2>
        </div>

        {contasPendentes.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <span className="text-4xl mb-3 block">✨</span>
            <p className="text-contabio-text-muted">
              Nenhuma conta pendente!
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {contasPendentes.map((conta) => (
              <CardConta
                key={conta.id}
                conta={conta}
                onMarcarPago={handleMarcarPago}
                onAbrirAnotacoes={onAbrirAnotacoes}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                isDragging={draggedItem?.id === conta.id}
              />
            ))}
          </div>
        )}
      </div>

      {/* Seção PAGAS */}
      {contasPagas.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-contabio-green" />
              Pagas
              <span className="text-sm font-normal text-contabio-text-muted">
                ({contasPagas.length})
              </span>
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {contasPagas.map((conta) => (
              <CardConta
                key={conta.id}
                conta={conta}
                onMarcarPago={handleMarcarPago}
                onAbrirAnotacoes={onAbrirAnotacoes}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                isDragging={draggedItem?.id === conta.id}
              />
            ))}
          </div>
        </div>
      )}

      {/* Estado vazio total */}
      {contasMes.length === 0 && (
        <div className="glass-card p-12 text-center">
          <span className="text-6xl mb-4 block">📋</span>
          <h3 className="text-xl font-semibold text-white mb-2">
            Nenhuma conta neste mês
          </h3>
          <p className="text-contabio-text-muted mb-4">
            Adicione suas contas fixas e parceladas para começar a organizar suas finanças.
          </p>
        </div>
      )}
    </div>
  )
}
