import { useState } from 'react'
import { motion } from 'framer-motion'
import { useDados } from '../hooks/useDados'
import { formatarMoeda, nomeMes, CATEGORIAS_GASTO, obterCategoria } from '../lib/utils'

export default function Relatorios() {
  const { 
    contasMes, 
    gastos, 
    configuracoes, 
    mesAtual, 
    anoAtual,
    saldoInicial,
    totalPago,
    totalPendente,
    totalGastos
  } = useDados()

  const [abaAtiva, setAbaAtiva] = useState('mensal')

  // Cálculos
  const totalGasto = totalPago + totalGastos
  const sobrou = saldoInicial - totalGasto
  const porcentagemUsada = saldoInicial > 0 ? (totalGasto / saldoInicial) * 100 : 0

  // Gastos por categoria
  const gastosPorCategoria = CATEGORIAS_GASTO.map(cat => ({
    ...cat,
    total: gastos.filter(g => g.categoria === cat.id).reduce((acc, g) => acc + g.valor, 0)
  })).filter(cat => cat.total > 0).sort((a, b) => b.total - a.total)

  // Contas por tipo
  const contasFixas = contasMes.filter(c => c.tipo === 'fixa')
  const contasParceladas = contasMes.filter(c => c.tipo === 'parcelada')
  const totalContasFixas = contasFixas.reduce((acc, c) => acc + (c.valor || 0), 0)
  const totalContasParceladas = contasParceladas.reduce((acc, c) => acc + (c.valor || 0), 0)

  return (
    <div className="px-4 space-y-5 pb-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-2xl font-bold text-white mb-1">Relatórios</h1>
        <p className="text-moncash-text-muted text-sm">Análise das suas finanças</p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 bg-moncash-card rounded-xl p-1">
        {[
          { id: 'mensal', label: 'Mensal' },
          { id: 'anual', label: 'Anual' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setAbaAtiva(tab.id)}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all
              ${abaAtiva === tab.id 
                ? 'bg-moncash-lime text-moncash-dark' 
                : 'text-moncash-text-muted'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {abaAtiva === 'mensal' ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          {/* Resumo do Mês */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-moncash-text-muted mb-4 uppercase tracking-wider">
              Resumo - {nomeMes(mesAtual)} {anoAtual}
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-moncash-text-secondary">Saldo Inicial</span>
                <span className="font-bold text-white tabular-nums">{formatarMoeda(saldoInicial)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-moncash-text-secondary">Contas Pagas</span>
                <span className="font-bold text-moncash-error tabular-nums">- {formatarMoeda(totalPago)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-moncash-text-secondary">Gastos Avulsos</span>
                <span className="font-bold text-moncash-warning tabular-nums">- {formatarMoeda(totalGastos)}</span>
              </div>
              
              <div className="h-px bg-moncash-border" />
              
              <div className="flex justify-between items-center">
                <span className="text-white font-semibold">Sobrou</span>
                <span className={`text-xl font-bold tabular-nums ${sobrou >= 0 ? 'text-moncash-success' : 'text-moncash-error'}`}>
                  {formatarMoeda(sobrou)}
                </span>
              </div>
            </div>
          </div>

          {/* Barra de uso */}
          <div className="card p-5">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-moncash-text-secondary">Uso do saldo</span>
              <span className={`text-sm font-semibold ${porcentagemUsada > 90 ? 'text-moncash-error' : porcentagemUsada > 70 ? 'text-moncash-warning' : 'text-moncash-success'}`}>
                {porcentagemUsada.toFixed(0)}%
              </span>
            </div>
            <div className="h-3 bg-moncash-border rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(porcentagemUsada, 100)}%` }}
                className={`h-full rounded-full ${porcentagemUsada > 90 ? 'bg-moncash-error' : porcentagemUsada > 70 ? 'bg-moncash-warning' : 'bg-moncash-success'}`}
              />
            </div>
          </div>

          {/* Distribuição */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-moncash-text-muted mb-4 uppercase tracking-wider">
              Distribuição dos Gastos
            </h3>
            
            <div className="space-y-3">
              {totalContasFixas > 0 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-moncash-lime" />
                    <span className="text-moncash-text-secondary">Contas Fixas</span>
                  </div>
                  <span className="font-semibold text-white tabular-nums">{formatarMoeda(totalContasFixas)}</span>
                </div>
              )}
              
              {totalContasParceladas > 0 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-purple-500" />
                    <span className="text-moncash-text-secondary">Parceladas</span>
                  </div>
                  <span className="font-semibold text-white tabular-nums">{formatarMoeda(totalContasParceladas)}</span>
                </div>
              )}
              
              {totalGastos > 0 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-moncash-warning" />
                    <span className="text-moncash-text-secondary">Gastos Avulsos</span>
                  </div>
                  <span className="font-semibold text-white tabular-nums">{formatarMoeda(totalGastos)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Gastos por categoria */}
          {gastosPorCategoria.length > 0 && (
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-moncash-text-muted mb-4 uppercase tracking-wider">
                Gastos por Categoria
              </h3>
              
              <div className="space-y-3">
                {gastosPorCategoria.map((cat) => (
                  <div key={cat.id} className="flex items-center gap-3">
                    <span className="text-xl w-8">{cat.icone}</span>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-moncash-text-secondary">{cat.nome}</span>
                        <span className="text-sm font-semibold text-white tabular-nums">
                          {formatarMoeda(cat.total)}
                        </span>
                      </div>
                      <div className="h-1.5 bg-moncash-border rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ 
                            width: `${(cat.total / totalGastos) * 100}%`,
                            backgroundColor: cat.cor 
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card p-8 text-center"
        >
          <span className="text-4xl mb-4 block">📊</span>
          <h3 className="text-lg font-semibold text-white mb-2">Relatório Anual</h3>
          <p className="text-moncash-text-muted text-sm">
            Continue usando o Moncash para ver seus dados anuais
          </p>
        </motion.div>
      )}
    </div>
  )
}
