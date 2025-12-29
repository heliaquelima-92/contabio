import { motion } from 'framer-motion'
import { formatarMoeda } from '../lib/utils'

export default function Totalizador({ 
  saldoInicial, 
  saldoAtual, 
  totalPago, 
  totalPendente,
  totalGastos,
  progresso,
  todasPagas 
}) {
  return (
    <div className="px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-5 relative overflow-hidden"
      >
        {/* Efeito de gradiente no fundo */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-moncash-lime/5 rounded-full blur-3xl" />
        
        {/* Saldo Disponível */}
        <div className="relative mb-6">
          <p className="text-sm text-moncash-text-muted mb-1">Saldo Disponível</p>
          <motion.p 
            key={saldoAtual}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`value-display-lg tabular-nums ${saldoAtual >= 0 ? 'text-moncash-lime' : 'text-moncash-error'}`}
          >
            {formatarMoeda(saldoAtual)}
          </motion.p>
        </div>

        {/* Barra de Progresso */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-moncash-text-muted">Progresso das contas</span>
            <span className={`text-xs font-semibold ${progresso >= 70 ? 'text-moncash-lime' : progresso >= 40 ? 'text-moncash-warning' : 'text-moncash-error'}`}>
              {progresso}%
            </span>
          </div>
          <div className="progress-bar">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progresso}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className={`progress-bar-fill ${progresso < 40 ? 'from-moncash-error to-moncash-error' : progresso < 70 ? 'from-moncash-warning to-moncash-warning' : ''}`}
            />
          </div>
        </div>

        {/* Grid de valores */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-moncash-darker/50 rounded-xl p-3">
            <p className="text-[10px] text-moncash-text-muted uppercase tracking-wider mb-1">Pago</p>
            <p className="text-lg font-bold text-moncash-success tabular-nums">{formatarMoeda(totalPago)}</p>
          </div>
          
          <div className="bg-moncash-darker/50 rounded-xl p-3">
            <p className="text-[10px] text-moncash-text-muted uppercase tracking-wider mb-1">Pendente</p>
            <p className="text-lg font-bold text-moncash-error tabular-nums">{formatarMoeda(totalPendente)}</p>
          </div>
          
          <div className="bg-moncash-darker/50 rounded-xl p-3">
            <p className="text-[10px] text-moncash-text-muted uppercase tracking-wider mb-1">Gastos</p>
            <p className="text-lg font-bold text-moncash-warning tabular-nums">{formatarMoeda(totalGastos)}</p>
          </div>
          
          <div className="bg-moncash-darker/50 rounded-xl p-3">
            <p className="text-[10px] text-moncash-text-muted uppercase tracking-wider mb-1">Saldo Inicial</p>
            <p className="text-lg font-bold text-white tabular-nums">{formatarMoeda(saldoInicial)}</p>
          </div>
        </div>

        {/* Status */}
        {todasPagas && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-center"
          >
            <span className="text-moncash-lime text-sm font-medium">
              🎉 Todas as contas pagas!
            </span>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
