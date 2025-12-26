import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDados } from '../hooks/useDados'
import ModalNovoGasto from '../components/ModalNovoGasto'
import { formatarMoeda, formatarData, obterCategoria, CATEGORIAS_GASTO } from '../lib/utils'
import { som } from '../lib/sons'

export default function Gastos() {
  const { gastos, totalGastos, adicionarGasto, deletarGasto } = useDados()
  const [modalAberto, setModalAberto] = useState(false)
  const [filtroCategoria, setFiltroCategoria] = useState('todos')

  // Filtrar gastos
  const gastosFiltrados = filtroCategoria === 'todos' 
    ? gastos 
    : gastos.filter(g => g.categoria === filtroCategoria)

  // Agrupar por categoria
  const gastosPorCategoria = CATEGORIAS_GASTO.map(cat => ({
    ...cat,
    total: gastos.filter(g => g.categoria === cat.id).reduce((acc, g) => acc + g.valor, 0),
    quantidade: gastos.filter(g => g.categoria === cat.id).length
  })).filter(cat => cat.total > 0).sort((a, b) => b.total - a.total)

  const handleDeletar = async (id) => {
    if (confirm('Deletar este gasto?')) {
      await deletarGasto(id)
      som.tocar('clique')
    }
  }

  return (
    <div className="px-4 space-y-5 pb-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-2xl font-bold text-white mb-1">Gastos Avulsos</h1>
        <p className="text-moncash-text-muted text-sm">Controle seus gastos do período</p>
      </motion.div>

      {/* Total */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card p-5 text-center"
      >
        <p className="text-sm text-moncash-text-muted mb-1">Total de Gastos</p>
        <p className="text-3xl font-bold text-moncash-warning tabular-nums">
          {formatarMoeda(totalGastos)}
        </p>
        <p className="text-xs text-moncash-text-muted mt-2">
          {gastos.length} {gastos.length === 1 ? 'lançamento' : 'lançamentos'}
        </p>
      </motion.div>

      {/* Botão Adicionar */}
      <button
        onClick={() => setModalAberto(true)}
        className="btn-primary w-full flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Informar Gasto
      </button>

      {/* Gastos por Categoria */}
      {gastosPorCategoria.length > 0 && (
        <div className="card p-4">
          <h3 className="text-sm font-semibold text-white mb-3">Por Categoria</h3>
          <div className="space-y-3">
            {gastosPorCategoria.map((cat) => {
              const porcentagem = totalGastos > 0 ? (cat.total / totalGastos) * 100 : 0
              return (
                <div key={cat.id} className="flex items-center gap-3">
                  <span className="text-xl w-8">{cat.icone}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-moncash-text-secondary">{cat.nome}</span>
                      <span className="text-sm font-semibold text-white tabular-nums">
                        {formatarMoeda(cat.total)}
                      </span>
                    </div>
                    <div className="h-1.5 bg-moncash-border rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${porcentagem}%` }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: cat.cor }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Filtro */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4">
        <button
          onClick={() => setFiltroCategoria('todos')}
          className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all
            ${filtroCategoria === 'todos' 
              ? 'bg-moncash-lime text-moncash-dark' 
              : 'bg-moncash-card text-moncash-text-muted'}`}
        >
          Todos
        </button>
        {CATEGORIAS_GASTO.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFiltroCategoria(cat.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all
              flex items-center gap-2
              ${filtroCategoria === cat.id 
                ? 'bg-moncash-lime text-moncash-dark' 
                : 'bg-moncash-card text-moncash-text-muted'}`}
          >
            <span>{cat.icone}</span>
            {cat.nome}
          </button>
        ))}
      </div>

      {/* Lista de Gastos */}
      <AnimatePresence mode="popLayout">
        {gastosFiltrados.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card p-8 text-center"
          >
            <span className="text-4xl mb-3 block">💸</span>
            <p className="text-moncash-text-muted">Nenhum gasto registrado</p>
          </motion.div>
        ) : (
          <div className="space-y-2">
            {gastosFiltrados.map((gasto, index) => {
              const categoria = obterCategoria(gasto.categoria)
              return (
                <motion.div
                  key={gasto.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.03 }}
                  className="card p-4 flex items-center gap-4"
                >
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                    style={{ backgroundColor: `${categoria.cor}20` }}
                  >
                    {categoria.icone}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white truncate">{gasto.descricao}</p>
                    <p className="text-xs text-moncash-text-muted">{formatarData(gasto.data)}</p>
                  </div>
                  
                  <p className="font-bold text-white tabular-nums">
                    {formatarMoeda(gasto.valor)}
                  </p>
                  
                  <button
                    onClick={() => handleDeletar(gasto.id)}
                    className="w-8 h-8 rounded-full bg-moncash-error/10 flex items-center justify-center
                              hover:bg-moncash-error/20 transition-colors"
                  >
                    <svg className="w-4 h-4 text-moncash-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </motion.div>
              )
            })}
          </div>
        )}
      </AnimatePresence>

      {/* Modal */}
      <ModalNovoGasto
        aberto={modalAberto}
        onFechar={() => setModalAberto(false)}
        onSalvar={adicionarGasto}
      />
    </div>
  )
}
