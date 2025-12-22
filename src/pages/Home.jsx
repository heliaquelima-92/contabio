import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useDados } from '../hooks/useDados'
import CalendarioMeses from '../components/CalendarioMeses'
import Modal from '../components/Modal'
import { formatarMoeda, nomeMes, CATEGORIAS_GASTO, obterCategoria } from '../lib/utils'
import { som } from '../lib/sons'

export default function Home() {
  const {
    configuracoes, contasFixas, contasParceladas, cartoes, contasMes, gastos, cofrinho,
    mesAtual, anoAtual, saldoInicial, saldoAtual, progresso,
    mudarMes, marcarComoPago, adicionarGasto, adicionarAoCofrinho, gerarContasMes, atualizarContaMes
  } = useDados()

  const [modalGastoAberto, setModalGastoAberto] = useState(false)
  const [modalLancamentoAberto, setModalLancamentoAberto] = useState(false)
  const [modalCofrinhoAberto, setModalCofrinhoAberto] = useState(false)
  const [modalValorAberto, setModalValorAberto] = useState(false)
  const [contaSelecionada, setContaSelecionada] = useState(null)

  useEffect(() => {
    if (configuracoes && contasFixas && contasParceladas && cartoes) {
      if (contasMes.length === 0) gerarContasMes()
    }
  }, [mesAtual, anoAtual, configuracoes, contasFixas?.length, contasParceladas?.length, cartoes?.length])

  const contasFixasMes = contasMes.filter(c => c.tipo === 'fixa')
  const contasParceladasMes = contasMes.filter(c => c.tipo === 'parcelada')
  const faturasMes = contasMes.filter(c => c.tipo === 'cartao')

  const gastosDoMes = gastos.filter(g => {
    const d = new Date(g.data)
    return d.getMonth() + 1 === mesAtual && d.getFullYear() === anoAtual
  })
  const totalGastosDoMes = gastosDoMes.reduce((acc, g) => acc + g.valor, 0)

  const handleMarcarPago = async (conta) => {
    if (conta.pago) {
      await marcarComoPago(conta.id, false)
      som.tocar('clique')
    } else {
      await marcarComoPago(conta.id, true)
      som.tocar('moeda')
    }
  }

  const handleAbrirValor = (conta) => {
    setContaSelecionada(conta)
    setModalValorAberto(true)
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Calendário */}
      <CalendarioMeses mesAtual={mesAtual} anoAtual={anoAtual} onMudarMes={mudarMes} />

      {/* Header do Mês */}
      <div className="text-center px-4 md:px-0">
        <h1 className="text-2xl md:text-3xl font-bold text-white">{nomeMes(mesAtual)} {anoAtual}</h1>
        {configuracoes && (
          <p className="text-xs text-moncash-text-muted mt-1">Dia de referência: {configuracoes.dia_referencia}</p>
        )}
      </div>

      {/* Desktop: Grid Layout */}
      <div className="hidden md:grid md:grid-cols-3 gap-6">
        {/* Coluna 1: Saldo + Ações */}
        <div className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-5">
            <p className="text-xs text-moncash-text-muted mb-1">Saldo Disponível</p>
            <p className={`text-3xl font-bold tabular-nums ${saldoAtual >= 0 ? 'text-moncash-lime' : 'text-moncash-error'}`}>
              {formatarMoeda(saldoAtual)}
            </p>
            <p className="text-sm text-moncash-text-muted mt-2">Inicial: {formatarMoeda(saldoInicial)}</p>
            <div className="h-2 bg-moncash-border rounded-full overflow-hidden mt-3">
              <motion.div initial={{ width: 0 }} animate={{ width: `${progresso}%` }}
                className={`h-full rounded-full ${progresso >= 70 ? 'bg-moncash-lime' : progresso >= 40 ? 'bg-moncash-warning' : 'bg-moncash-error'}`} />
            </div>
            <p className="text-xs text-moncash-text-muted mt-2 text-center">{progresso}% das contas pagas</p>
          </motion.div>

          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setModalGastoAberto(true)} className="card p-4 hover:border-moncash-lime/50 transition-all text-center">
              <span className="text-2xl block mb-2">💸</span>
              <p className="font-semibold text-white text-sm">Informar Gasto</p>
            </button>
            <button onClick={() => setModalLancamentoAberto(true)} className="card p-4 hover:border-moncash-lime/50 transition-all text-center">
              <span className="text-2xl block mb-2">💰</span>
              <p className="font-semibold text-white text-sm">Lançamento</p>
            </button>
          </div>

          {/* Cofrinho Desktop */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card p-4">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">🐷</span>
              <div>
                <p className="text-xs text-moncash-text-muted">Cofrinho</p>
                <p className="font-bold text-white text-lg tabular-nums">{formatarMoeda(cofrinho?.total || 0)}</p>
              </div>
            </div>
            {cofrinho?.meta > 0 && (
              <div className="h-2 bg-moncash-border rounded-full overflow-hidden mb-2">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min((cofrinho.total / cofrinho.meta) * 100, 100)}%` }} />
              </div>
            )}
            <button onClick={() => setModalCofrinhoAberto(true)} className="btn-primary w-full py-2 text-sm">Adicionar</button>
          </motion.div>
        </div>

        {/* Coluna 2: Contas Fixas + Parceladas */}
        <div className="space-y-4">
          <SecaoContasDesktop titulo="🔄 Contas Fixas" contas={contasFixasMes} onMarcarPago={handleMarcarPago} onAbrirValor={handleAbrirValor} corBadge="lime" />
          <SecaoContasDesktop titulo="📦 Parceladas" contas={contasParceladasMes} onMarcarPago={handleMarcarPago} onAbrirValor={handleAbrirValor} corBadge="purple" />
        </div>

        {/* Coluna 3: Cartões + Gastos */}
        <div className="space-y-4">
          <SecaoContasDesktop titulo="💳 Faturas" contas={faturasMes} onMarcarPago={handleMarcarPago} onAbrirValor={handleAbrirValor} corBadge="warning" />
          
          {/* Gastos Desktop */}
          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-moncash-text-muted uppercase">💸 Gastos do Mês</h3>
              <span className="text-sm font-bold text-moncash-warning">{formatarMoeda(totalGastosDoMes)}</span>
            </div>
            {gastosDoMes.length === 0 ? (
              <p className="text-center text-moncash-text-muted text-sm py-4">Nenhum gasto</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {gastosDoMes.slice(0, 5).map((gasto) => {
                  const cat = obterCategoria(gasto.categoria)
                  return (
                    <div key={gasto.id} className="flex items-center gap-2 p-2 bg-moncash-darker rounded-lg">
                      <span>{cat.icone}</span>
                      <p className="text-sm text-white flex-1 truncate">{gasto.descricao}</p>
                      <p className="text-sm font-bold text-moncash-warning">{formatarMoeda(gasto.valor)}</p>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile: Layout Original */}
      <div className="md:hidden space-y-4">
        {/* Totalizador Mobile */}
        <div className="px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs text-moncash-text-muted">Saldo Disponível</p>
                <p className={`text-2xl font-bold tabular-nums ${saldoAtual >= 0 ? 'text-moncash-lime' : 'text-moncash-error'}`}>
                  {formatarMoeda(saldoAtual)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-moncash-text-muted">Inicial</p>
                <p className="text-lg font-semibold text-white tabular-nums">{formatarMoeda(saldoInicial)}</p>
              </div>
            </div>
            <div className="h-2 bg-moncash-border rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${progresso}%` }}
                className={`h-full rounded-full ${progresso >= 70 ? 'bg-moncash-lime' : progresso >= 40 ? 'bg-moncash-warning' : 'bg-moncash-error'}`} />
            </div>
            <p className="text-xs text-moncash-text-muted mt-2 text-center">{progresso}% das contas pagas</p>
          </motion.div>
        </div>

        {/* Botões Mobile */}
        <div className="px-4 grid grid-cols-2 gap-3">
          <button onClick={() => setModalGastoAberto(true)} className="card p-4 flex items-center gap-3 hover:border-moncash-lime/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-moncash-warning/20 flex items-center justify-center"><span className="text-lg">💸</span></div>
            <div className="text-left">
              <p className="font-semibold text-white text-sm">Informar Gasto</p>
              <p className="text-xs text-moncash-text-muted">Registrar despesa</p>
            </div>
          </button>
          <button onClick={() => setModalLancamentoAberto(true)} className="card p-4 flex items-center gap-3 hover:border-moncash-lime/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-moncash-lime/20 flex items-center justify-center"><span className="text-lg">💰</span></div>
            <div className="text-left">
              <p className="font-semibold text-white text-sm">Lançamento</p>
              <p className="text-xs text-moncash-text-muted">Renda extra</p>
            </div>
          </button>
        </div>

        <SecaoContas titulo="🔄 Contas Fixas" contas={contasFixasMes} onMarcarPago={handleMarcarPago} onAbrirValor={handleAbrirValor} corBadge="lime" mensagemVazia="Nenhuma conta fixa" />
        <SecaoContas titulo="📦 Parceladas" contas={contasParceladasMes} onMarcarPago={handleMarcarPago} onAbrirValor={handleAbrirValor} corBadge="purple" mensagemVazia="Nenhuma parcelada" />
        <SecaoContas titulo="💳 Faturas dos Cartões" contas={faturasMes} onMarcarPago={handleMarcarPago} onAbrirValor={handleAbrirValor} corBadge="warning" mensagemVazia="Nenhum cartão" />

        {/* Cofrinho Mobile */}
        <div className="px-4">
          <h2 className="text-sm font-semibold text-moncash-text-muted uppercase tracking-wider mb-2">🐷 Cofrinho</h2>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center"><span className="text-2xl">🐷</span></div>
                <div>
                  <p className="font-bold text-white text-lg tabular-nums">{formatarMoeda(cofrinho?.total || 0)}</p>
                  {cofrinho?.meta > 0 && <p className="text-xs text-moncash-text-muted">Meta: {formatarMoeda(cofrinho.meta)}</p>}
                </div>
              </div>
              <button onClick={() => setModalCofrinhoAberto(true)} className="btn-primary py-2 px-4 text-sm">Adicionar</button>
            </div>
          </motion.div>
        </div>

        {/* Gastos Mobile */}
        <div className="px-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-moncash-text-muted uppercase tracking-wider">💸 Gastos do Mês</h2>
            <span className="text-sm font-bold text-moncash-warning tabular-nums">{formatarMoeda(totalGastosDoMes)}</span>
          </div>
          {gastosDoMes.length === 0 ? (
            <div className="card p-6 text-center"><span className="text-3xl block mb-2">📋</span><p className="text-moncash-text-muted text-sm">Nenhum gasto</p></div>
          ) : (
            <div className="space-y-2">
              {gastosDoMes.slice(0, 5).map((gasto) => {
                const cat = obterCategoria(gasto.categoria)
                return (
                  <div key={gasto.id} className="card p-3 flex items-center gap-3">
                    <span className="text-lg">{cat.icone}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{gasto.descricao}</p>
                      <p className="text-xs text-moncash-text-muted">{cat.nome}</p>
                    </div>
                    <p className="font-bold text-moncash-warning tabular-nums">{formatarMoeda(gasto.valor)}</p>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modais */}
      <ModalNovoGasto aberto={modalGastoAberto} onFechar={() => setModalGastoAberto(false)} onSalvar={adicionarGasto} mesAtual={mesAtual} anoAtual={anoAtual} />
      <ModalLancamento aberto={modalLancamentoAberto} onFechar={() => setModalLancamentoAberto(false)} />
      <ModalAdicionarCofrinho aberto={modalCofrinhoAberto} onFechar={() => setModalCofrinhoAberto(false)} onAdicionar={adicionarAoCofrinho} />
      <ModalDefinirValor aberto={modalValorAberto} onFechar={() => { setModalValorAberto(false); setContaSelecionada(null) }} conta={contaSelecionada} onSalvar={atualizarContaMes} />
    </div>
  )
}

// Seção de Contas Mobile
function SecaoContas({ titulo, contas, onMarcarPago, onAbrirValor, corBadge, mensagemVazia }) {
  const cores = { lime: 'bg-moncash-lime/20 text-moncash-lime', purple: 'bg-purple-500/20 text-purple-400', warning: 'bg-moncash-warning/20 text-moncash-warning' }
  return (
    <div className="px-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-semibold text-moncash-text-muted uppercase tracking-wider">{titulo}</h2>
        <span className="text-xs text-moncash-text-muted">{contas.length} itens</span>
      </div>
      {contas.length === 0 ? (
        <div className="card p-6 text-center"><p className="text-moncash-text-muted text-sm">{mensagemVazia}</p></div>
      ) : (
        <div className="space-y-2">
          {contas.map((conta, i) => (
            <motion.div key={conta.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className={`card p-4 ${conta.pago ? 'opacity-60' : ''}`}>
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cores[corBadge]}`}>
                    {conta.tipo === 'fixa' ? 'FIXA' : conta.tipo === 'parcelada' ? 'PARCELA' : 'FATURA'}
                  </span>
                  <p className={`font-medium text-white mt-1 ${conta.pago ? 'line-through text-moncash-text-muted' : ''}`}>{conta.nome}</p>
                  <p className="text-xs text-moncash-text-muted">Vence dia {conta.vencimento}</p>
                </div>
                <div className="flex items-center gap-2">
                  {conta.valor ? (
                    <button onClick={() => onAbrirValor(conta)} className="text-right">
                      <p className={`text-lg font-bold tabular-nums ${conta.pago ? 'text-moncash-success' : 'text-white'}`}>{formatarMoeda(conta.valor)}</p>
                    </button>
                  ) : (
                    <button onClick={() => onAbrirValor(conta)} className="px-3 py-1 bg-moncash-card rounded-lg text-xs text-moncash-lime border border-moncash-lime/30">Definir valor</button>
                  )}
                  <button onClick={() => onMarcarPago(conta)} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${conta.pago ? 'bg-moncash-success/20 text-moncash-success' : 'bg-moncash-card hover:bg-moncash-lime hover:text-moncash-dark text-white'}`}>
                    {conta.pago ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> : '+'}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

// Seção de Contas Desktop (mais compacta)
function SecaoContasDesktop({ titulo, contas, onMarcarPago, onAbrirValor, corBadge }) {
  const cores = { lime: 'bg-moncash-lime/20 text-moncash-lime', purple: 'bg-purple-500/20 text-purple-400', warning: 'bg-moncash-warning/20 text-moncash-warning' }
  return (
    <div className="card p-4">
      <h3 className="text-sm font-semibold text-moncash-text-muted uppercase mb-3">{titulo}</h3>
      {contas.length === 0 ? (
        <p className="text-center text-moncash-text-muted text-sm py-4">Nenhuma conta</p>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {contas.map((conta) => (
            <div key={conta.id} className={`p-3 bg-moncash-darker rounded-xl ${conta.pago ? 'opacity-60' : ''}`}>
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className={`font-medium text-white text-sm ${conta.pago ? 'line-through' : ''}`}>{conta.nome}</p>
                  <p className="text-xs text-moncash-text-muted">Vence dia {conta.vencimento}</p>
                </div>
                <div className="flex items-center gap-2">
                  {conta.valor ? (
                    <p className={`font-bold tabular-nums ${conta.pago ? 'text-moncash-success' : 'text-white'}`}>{formatarMoeda(conta.valor)}</p>
                  ) : (
                    <button onClick={() => onAbrirValor(conta)} className="text-xs text-moncash-lime">Definir</button>
                  )}
                  <button onClick={() => onMarcarPago(conta)} className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${conta.pago ? 'bg-moncash-success/20 text-moncash-success' : 'bg-moncash-card hover:bg-moncash-lime hover:text-moncash-dark'}`}>
                    {conta.pago ? '✓' : '+'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Modal Novo Gasto
function ModalNovoGasto({ aberto, onFechar, onSalvar, mesAtual, anoAtual }) {
  const [valor, setValor] = useState('')
  const [descricao, setDescricao] = useState('')
  const [categoria, setCategoria] = useState('outros')
  const [salvando, setSalvando] = useState(false)

  const handleSalvar = async () => {
    const valorNum = parseFloat(valor.replace(',', '.'))
    if (isNaN(valorNum) || valorNum <= 0 || !descricao.trim()) { som.tocar('erro'); return }
    setSalvando(true)
    try {
      const dataGasto = new Date(anoAtual, mesAtual - 1, new Date().getDate())
      await onSalvar({ valor: valorNum, descricao: descricao.trim(), categoria, data: dataGasto.toISOString().split('T')[0] })
      som.tocar('sucesso')
      setValor(''); setDescricao(''); setCategoria('outros')
      onFechar()
    } catch (error) { som.tocar('erro') } finally { setSalvando(false) }
  }

  return (
    <Modal aberto={aberto} onFechar={onFechar} titulo="Informar Gasto">
      <div className="space-y-4">
        <div>
          <label className="input-label">Valor *</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-moncash-text-muted">R$</span>
            <input type="text" value={valor} onChange={(e) => setValor(e.target.value)} placeholder="0,00" className="input-field pl-12 text-xl font-bold" inputMode="decimal" autoFocus />
          </div>
        </div>
        <div>
          <label className="input-label">Descrição *</label>
          <input type="text" value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Ex: Almoço, Gasolina..." className="input-field" />
        </div>
        <div>
          <label className="input-label">Categoria</label>
          <div className="grid grid-cols-3 gap-2">
            {CATEGORIAS_GASTO.map((cat) => (
              <button key={cat.id} onClick={() => setCategoria(cat.id)} className={`p-2 rounded-xl border-2 transition-all text-center ${categoria === cat.id ? 'border-moncash-lime bg-moncash-lime/10' : 'border-moncash-border bg-moncash-card'}`}>
                <span className="text-lg block">{cat.icone}</span>
                <span className="text-[10px] text-moncash-text-muted">{cat.nome}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button onClick={onFechar} className="btn-secondary flex-1">Cancelar</button>
          <button onClick={handleSalvar} disabled={salvando} className="btn-primary flex-1">{salvando ? 'Salvando...' : 'Salvar'}</button>
        </div>
      </div>
    </Modal>
  )
}

// Modal Lançamento
function ModalLancamento({ aberto, onFechar }) {
  const { salvarConfiguracoes, configuracoes } = useDados()
  const [valor, setValor] = useState('')
  const [salvando, setSalvando] = useState(false)

  const handleSalvar = async () => {
    const valorNum = parseFloat(valor.replace(',', '.'))
    if (isNaN(valorNum) || valorNum <= 0) { som.tocar('erro'); return }
    setSalvando(true)
    try {
      const novoSaldo = (configuracoes?.saldo_mensal || 0) + valorNum
      await salvarConfiguracoes({ saldo_mensal: novoSaldo })
      som.tocar('moeda')
      setValor('')
      onFechar()
    } catch (error) { som.tocar('erro') } finally { setSalvando(false) }
  }

  return (
    <Modal aberto={aberto} onFechar={onFechar} titulo="Adicionar Lançamento">
      <div className="space-y-4">
        <p className="text-sm text-moncash-text-muted">Registre uma renda extra. O valor será adicionado ao saldo mensal.</p>
        <div>
          <label className="input-label">Valor *</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-moncash-text-muted">R$</span>
            <input type="text" value={valor} onChange={(e) => setValor(e.target.value)} placeholder="0,00" className="input-field pl-12 text-xl font-bold" inputMode="decimal" autoFocus />
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button onClick={onFechar} className="btn-secondary flex-1">Cancelar</button>
          <button onClick={handleSalvar} disabled={salvando} className="btn-primary flex-1">{salvando ? 'Salvando...' : 'Adicionar'}</button>
        </div>
      </div>
    </Modal>
  )
}

// Modal Cofrinho
function ModalAdicionarCofrinho({ aberto, onFechar, onAdicionar }) {
  const [valor, setValor] = useState('')
  const [salvando, setSalvando] = useState(false)

  const handleSalvar = async () => {
    const valorNum = parseFloat(valor.replace(',', '.'))
    if (isNaN(valorNum) || valorNum <= 0) { som.tocar('erro'); return }
    setSalvando(true)
    try {
      await onAdicionar(valorNum, 'Depósito')
      som.tocar('moeda')
      setValor('')
      onFechar()
    } catch (error) { som.tocar('erro') } finally { setSalvando(false) }
  }

  return (
    <Modal aberto={aberto} onFechar={onFechar} titulo="Adicionar ao Cofrinho">
      <div className="space-y-4">
        <div className="text-center py-4"><span className="text-5xl">🐷</span></div>
        <div>
          <label className="input-label">Valor</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-moncash-text-muted">R$</span>
            <input type="text" value={valor} onChange={(e) => setValor(e.target.value)} placeholder="0,00" className="input-field pl-12 text-xl font-bold" inputMode="decimal" autoFocus />
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={onFechar} className="btn-secondary flex-1">Cancelar</button>
          <button onClick={handleSalvar} disabled={salvando} className="btn-primary flex-1">{salvando ? 'Salvando...' : 'Adicionar'}</button>
        </div>
      </div>
    </Modal>
  )
}

// Modal Definir Valor
function ModalDefinirValor({ aberto, onFechar, conta, onSalvar }) {
  const [valor, setValor] = useState('')
  const [salvando, setSalvando] = useState(false)

  useEffect(() => { if (conta) setValor(conta.valor?.toString() || '') }, [conta])

  const handleSalvar = async () => {
    const valorNum = parseFloat(valor.replace(',', '.'))
    if (isNaN(valorNum) || valorNum < 0) { som.tocar('erro'); return }
    setSalvando(true)
    try {
      await onSalvar(conta.id, { valor: valorNum })
      som.tocar('sucesso')
      onFechar()
    } catch (error) { som.tocar('erro') } finally { setSalvando(false) }
  }

  if (!conta) return null
  return (
    <Modal aberto={aberto} onFechar={onFechar} titulo="Definir Valor">
      <div className="space-y-4">
        <div className="bg-moncash-card rounded-xl p-4">
          <p className="font-semibold text-white">{conta.nome}</p>
          <p className="text-xs text-moncash-text-muted">Vence dia {conta.vencimento}</p>
        </div>
        <div>
          <label className="input-label">Valor da conta</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-moncash-text-muted">R$</span>
            <input type="text" value={valor} onChange={(e) => setValor(e.target.value)} placeholder="0,00" className="input-field pl-12 text-xl font-bold" inputMode="decimal" autoFocus />
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={onFechar} className="btn-secondary flex-1">Cancelar</button>
          <button onClick={handleSalvar} disabled={salvando} className="btn-primary flex-1">{salvando ? 'Salvando...' : 'Salvar'}</button>
        </div>
      </div>
    </Modal>
  )
}
