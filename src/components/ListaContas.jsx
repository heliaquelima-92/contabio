import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import CardConta from './CardConta'
import { gerarConfetes, MENSAGENS_PARABENS } from '../lib/utils'
import { som } from '../lib/sons'

export default function ListaContas({ 
  contasMes, 
  onMarcarPago, 
  onAbrirDetalhes,
  todasPagas
}) {
  const [mostrarParabens, setMostrarParabens] = useState(false)
  const [abaAtiva, setAbaAtiva] = useState('pendentes')

  const contasPendentes = contasMes.filter(c => !c.pago)
  const contasPagas = contasMes.filter(c => c.pago)

  const handleMarcarPago = async (id, pago) => {
    await onMarcarPago(id, pago)
    
    // Verificar se todas foram pagas
    const contasApos = contasMes.map(c => c.id === id ? { ...c, pago } : c)
    if (pago && contasApos.every(c => c.pago)) {
      setMostrarParabens(true)
      som.tocar('sucesso')
      gerarConfetes()
      setTimeout(() => setMostrarParabens(false), 5000)
    }
  }

  const tabs = [
    { id: 'pendentes', label: 'A Pagar', count: contasPendentes.length, cor: 'text-moncash-error' },
    { id: 'pagas', label: 'Pagas', count: contasPagas.length, cor: 'text-moncash-success' }
  ]

  return (
    <div className="px-4">
      {/* Mensagem de Parabéns */}
      <AnimatePresence>
        {mostrarParabens && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="card p-6 text-center mb-4 bg-gradient-to-r from-moncash-lime/20 to-moncash-success/20 border-moncash-lime/30"
          >
            <span className="text-4xl mb-3 block">🎉</span>
            <h3 className="text-xl font-bold text-white mb-2">Parabéns!</h3>
            <p className="text-moncash-text-secondary">
              {MENSAGENS_PARABENS[Math.floor(Math.random() * MENSAGENS_PARABENS.length)]}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 bg-moncash-card rounded-xl p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setAbaAtiva(tab.id)
              som.tocar('clique')
            }}
            className={`
              flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-300
              flex items-center justify-center gap-2
              ${abaAtiva === tab.id 
                ? 'bg-moncash-lime text-moncash-dark' 
                : 'text-moncash-text-muted hover:text-white'}
            `}
          >
            {tab.label}
            <span className={`
              text-xs px-1.5 py-0.5 rounded-full
              ${abaAtiva === tab.id 
                ? 'bg-moncash-dark/20 text-moncash-dark' 
                : 'bg-moncash-card text-moncash-text-muted'}
            `}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Lista de Cards */}
      <AnimatePresence mode="wait">
        {abaAtiva === 'pendentes' ? (
          <motion.div
            key="pendentes"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            {contasPendentes.length === 0 ? (
              <div className="card p-8 text-center">
                <span className="text-4xl mb-3 block">✨</span>
                <p className="text-moncash-text-muted">Nenhuma conta pendente!</p>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {contasPendentes.map((conta, index) => (
                  <CardConta
                    key={conta.id}
                    conta={conta}
                    index={index}
                    onMarcarPago={handleMarcarPago}
                    onAbrirDetalhes={onAbrirDetalhes}
                  />
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="pagas"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {contasPagas.length === 0 ? (
              <div className="card p-8 text-center">
                <span className="text-4xl mb-3 block">📋</span>
                <p className="text-moncash-text-muted">Nenhuma conta paga ainda</p>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {contasPagas.map((conta, index) => (
                  <CardConta
                    key={conta.id}
                    conta={conta}
                    index={index}
                    onMarcarPago={handleMarcarPago}
                    onAbrirDetalhes={onAbrirDetalhes}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Estado vazio */}
      {contasMes.length === 0 && (
        <div className="card p-12 text-center">
          <span className="text-6xl mb-4 block">📋</span>
          <h3 className="text-xl font-semibold text-white mb-2">Nenhuma conta neste mês</h3>
          <p className="text-moncash-text-muted">
            Adicione suas contas fixas nas configurações para começar
          </p>
        </div>
      )}
    </div>
  )
}
