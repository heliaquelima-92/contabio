import { formatarMoeda, calcularPorcentagem } from '../lib/utils'

export default function Totalizador({ 
  saldoInicial, 
  saldoAtual, 
  totalPagar, 
  totalPago, 
  progresso,
  todasPagas 
}) {
  // Determinar cor do status
  const corProgresso = () => {
    if (progresso >= 70) return 'bg-contabio-green'
    if (progresso >= 40) return 'bg-contabio-yellow'
    return 'bg-contabio-red'
  }

  const corTextoProgresso = () => {
    if (progresso >= 70) return 'text-contabio-green'
    if (progresso >= 40) return 'text-contabio-yellow'
    return 'text-contabio-red'
  }

  return (
    <div className="glass-card p-5 animate-slide-up">
      {/* Grid de valores */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        {/* Saldo Inicial */}
        <div className="text-center p-3 rounded-xl bg-contabio-darker/50">
          <p className="text-xs text-contabio-text-muted mb-1">Saldo Inicial</p>
          <p className="text-lg font-semibold text-white">{formatarMoeda(saldoInicial)}</p>
        </div>

        {/* Saldo Atual */}
        <div className="text-center p-3 rounded-xl bg-contabio-darker/50">
          <p className="text-xs text-contabio-text-muted mb-1">Saldo Atual</p>
          <p className={`text-lg font-semibold ${saldoAtual >= 0 ? 'text-contabio-green' : 'text-contabio-red'}`}>
            {formatarMoeda(saldoAtual)}
          </p>
        </div>

        {/* Total a Pagar */}
        <div className="text-center p-3 rounded-xl bg-contabio-darker/50">
          <p className="text-xs text-contabio-text-muted mb-1">A Pagar</p>
          <p className="text-lg font-semibold text-contabio-red">{formatarMoeda(totalPagar)}</p>
        </div>

        {/* Total Pago */}
        <div className="text-center p-3 rounded-xl bg-contabio-darker/50">
          <p className="text-xs text-contabio-text-muted mb-1">Pago</p>
          <p className="text-lg font-semibold text-contabio-green">{formatarMoeda(totalPago)}</p>
        </div>
      </div>

      {/* Barra de Progresso */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-contabio-text-muted">Progresso do mês</span>
          <span className={`text-sm font-semibold ${corTextoProgresso()}`}>
            {progresso}%
          </span>
        </div>
        
        <div className="h-3 bg-contabio-darker rounded-full overflow-hidden">
          <div 
            className={`h-full ${corProgresso()} transition-all duration-500 ease-out rounded-full`}
            style={{ width: `${progresso}%` }}
          />
        </div>

        {/* Status textual */}
        <div className="text-center pt-2">
          {todasPagas ? (
            <span className="text-contabio-green text-sm font-medium animate-pulse-soft">
              🎉 Todas as contas pagas!
            </span>
          ) : progresso >= 70 ? (
            <span className="text-contabio-green text-sm">
              ✓ Situação financeira saudável
            </span>
          ) : progresso >= 40 ? (
            <span className="text-contabio-yellow text-sm">
              ⚠ Atenção com os gastos
            </span>
          ) : (
            <span className="text-contabio-red text-sm">
              ⚠ Muitas contas pendentes
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
