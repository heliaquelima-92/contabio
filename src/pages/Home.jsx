import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDados } from '../hooks/useDados'
import CalendarioMeses from '../components/CalendarioMeses'
import Modal from '../components/Modal'
import { formatarMoeda, nomeMes, CATEGORIAS_GASTO, obterCategoria } from '../lib/utils'
import { som } from '../lib/sons'

export default function Home() {
  const {
    configuracoes,
    contasFixas,
    contasParceladas,
    cartoes,
    contasMes,
    gastos,
    cofrinho,
    mesAtual,
    anoAtual,
    saldoInicial,
    saldoAtual,
    totalPago,
    totalPendente,
    totalGastos,
    progresso,
    mudarMes,
    marcarComoPago,
    adicionarGasto,
    adicionarAoCofrinho,
    gerarContasMes,
    atualizarContaMes
  } = useDados()

  const [modalGastoAberto, setModalGastoAberto] = useState(false)
  const [modalLancamentoAberto, setModalLancamentoAberto] = useState(false)
  const [modalCofrinhoAberto, setModalCofrinhoAberto] = useState(false)
  const [modalValorAberto, setModalValorAberto] = useState(false)
  const [contaSelecionada, setContaSelecionada] = useState(null)

  // Gerar contas do mês quando necessário
  useEffect(() => {
    if (configuracoes && contasFixas && contasParceladas && cartoes) {
      if (contasMes.length === 0) {
        gerarContasMes()
      }
    }
  }, [mesAtual, anoAtual, configuracoes, contasFixas?.length, contasParceladas?.length, cartoes?.length])

  // Separar contas por tipo
  const contasFixasMes = contasMes.filter(c => c.tipo === 'fixa')
  const contasParceladasMes = contasMes.filter(c => c.tipo === 'parcelada')
  const faturasMes = contasMes.filter(c => c.tipo === 'cartao')

  // Calcular total de gastos do mês atual
  const gastosDoMes = gastos.filter(g => {
    const dataGasto = new Date(g.data)
    return dataGasto.getMonth() + 1 === mesAtual && dataGasto.getFullYear() === anoAtual
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
    <div className="space-y-4 pb-4">
      {/* Calendário */}
      <CalendarioMeses
        mesAtual={mesAtual}
        anoAtual={anoAtual}
        onMudarMes={mudarMes}
      />

      {/* Header do Mês */}
      <div className="text-center px-4">
        <h1 className="text-2xl font-bold text-white">{nomeMes(mesAtual)} {anoAtual}</h1>
        {configuracoes && (
          <p className="text-xs text-moncash-text-muted mt-1">
            Dia de referência: {configuracoes.dia_referencia}
          </p>
        )}
      </div>

      {/* Totalizador Compacto */}
      <div className="px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-4"
        >
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
          
          {/* Barra de Progresso */}
          <div className="h-2 bg-moncash-border rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progresso}%` }}
              className={`h-full rounded-full ${progresso >= 70 ? 'bg-moncash-lime' : progresso >= 40 ? 'bg-moncash-warning' : 'bg-moncash-error'}`}
            />
          </div>
          <p className="text-xs text-moncash-text-muted mt-2 text-center">{progresso}% das contas pagas</p>
        </motion.div>
      </div>

      {/* Botões de Ação */}
      <div className="px-4 grid grid-cols-2 gap-3">
        <button
          onClick={() => setModalGastoAberto(true)}
          className="card p-4 flex items-center gap-3 hover:border-moncash-lime/50 transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-moncash-warning/20 flex items-center justify-center">
            <span className="text-lg">💸</span>
          </div>
          <div className="text-left">
            <p className="font-semibold text-white text-sm">Informar Gasto</p>
            <p className="text-xs text-moncash-text-muted">Registrar despesa</p>
          </div>
        </button>

        <button
          onClick={() => setModalLancamentoAberto(true)}
          className="card p-4 flex items-center gap-3 hover:border-moncash-lime/50 transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-moncash-lime/20 flex items-center justify-center">
            <span className="text-lg">💰</span>
          </div>
          <div className="text-left">
            <p className="font-semibold text-white text-sm">Lançamento</p>
            <p className="text-xs text-moncash-text-muted">Renda extra</p>
          </div>
        </button>
      </div>

      {/* CONTAS FIXAS */}
      <SecaoContas
        titulo="🔄 Contas Fixas"
        contas={contasFixasMes}
        onMarcarPago={handleMarcarPago}
        onAbrirValor={handleAbrirValor}
        corBadge="lime"
        mensagemVazia="Nenhuma conta fixa cadastrada"
      />

      {/* CONTAS PARCELADAS */}
      <SecaoContas
        titulo="📦 Parceladas"
        contas={contasParceladasMes}
        onMarcarPago={handleMarcarPago}
        onAbrirValor={handleAbrirValor}
        corBadge="purple"
        mensagemVazia="Nenhuma conta parcelada"
      />

      {/* FATURAS DE CARTÃO */}
      <SecaoContas
        titulo="💳 Faturas dos Cartões"
        contas={faturasMes}
        onMarcarPago={handleMarcarPago}
        onAbrirValor={handleAbrirValor}
        corBadge="warning"
        mensagemVazia="Nenhum cartão cadastrado"
      />

      {/* COFRINHO */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-moncash-text-muted uppercase tracking-wider">🐷 Cofrinho</h2>
        </div>
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <span className="text-2xl">🐷</span>
              </div>
              <div>
                <p className="font-bold text-white text-lg tabular-nums">{formatarMoeda(cofrinho?.total || 0)}</p>
                {cofrinho?.meta > 0 && (
                  <p className="text-xs text-moncash-text-muted">
                    Meta: {formatarMoeda(cofrinho.meta)} ({Math.round((cofrinho.total / cofrinho.meta) * 100)}%)
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() => setModalCofrinhoAberto(true)}
              className="btn-primary py-2 px-4 text-sm"
            >
              Adicionar
            </button>
          </div>
          {cofrinho?.meta > 0 && (
            <div className="mt-3 h-2 bg-moncash-border rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 rounded-full" 
                style={{ width: `${Math.min((cofrinho.total / cofrinho.meta) * 100, 100)}%` }} 
              />
            </div>
          )}
        </motion.div>
      </div>

      {/* GASTOS DO MÊS */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-moncash-text-muted uppercase tracking-wider">💸 Gastos do Mês</h2>
          <span className="text-sm font-bold text-moncash-warning tabular-nums">{formatarMoeda(totalGastosDoMes)}</span>
        </div>
        
        {gastosDoMes.length === 0 ? (
          <div className="card p-6 text-center">
            <span className="text-3xl block mb-2">📋</span>
            <p className="text-moncash-text-muted text-sm">Nenhum gasto registrado</p>
          </div>
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
            {gastosDoMes.length > 5 && (
              <p className="text-center text-xs text-moncash-text-muted py-2">
                +{gastosDoMes.length - 5} gastos • Veja todos em "Gastos"
              </p>
            )}
          </div>
        )}
      </div>

      {/* Modais */}
      <ModalNovoGasto
        aberto={modalGastoAberto}
        onFechar={() => setModalGastoAberto(false)}
        onSalvar={adicionarGasto}
        mesAtual={mesAtual}
        anoAtual={anoAtual}
      />

      <ModalLancamento
        aberto={modalLancamentoAberto}
        onFechar={() => setModalLancamentoAberto(false)}
      />

      <ModalAdicionarCofrinho
        aberto={modalCofrinhoAberto}
        onFechar={() => setModalCofrinhoAberto(false)}
        onAdicionar={adicionarAoCofrinho}
      />

      <ModalDefinirValor
        aberto={modalValorAberto}
        onFechar={() => { setModalValorAberto(false); setContaSelecionada(null) }}
        conta={contaSelecionada}
        onSalvar={atualizarContaMes}
      />
    </div>
  )
}

// Componente de Seção de Contas
function SecaoContas({ titulo, contas, onMarcarPago, onAbrirValor, corBadge, mensagemVazia }) {
  const cores = {
    lime: 'bg-moncash-lime/20 text-moncash-lime',
    purple: 'bg-purple-500/20 text-purple-400',
    warning: 'bg-moncash-warning/20 text-moncash-warning'
  }

  return (
    <div className="px-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-semibold text-moncash-text-muted uppercase tracking-wider">{titulo}</h2>
        <span className="text-xs text-moncash-text-muted">{contas.length} itens</span>
      </div>
      
      {contas.length === 0 ? (
        <div className="card p-6 text-center">
          <p className="text-moncash-text-muted text-sm">{mensagemVazia}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {contas.map((conta, index) => (
            <motion.div
              key={conta.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`card p-4 ${conta.pago ? 'opacity-60' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cores[corBadge]}`}>
                      {conta.tipo === 'fixa' ? 'FIXA' : conta.tipo === 'parcelada' ? 'PARCELA' : 'FATURA'}
                    </span>
                  </div>
                  <p className={`font-medium text-white ${conta.pago ? 'line-through text-moncash-text-muted' : ''}`}>
                    {conta.nome}
                  </p>
                  <p className="text-xs text-moncash-text-muted">Vence dia {conta.vencimento}</p>
                </div>
                
                <div className="flex items-center gap-2">
                  {/* Valor ou Botão para definir */}
                  {conta.valor ? (
                    <button 
                      onClick={() => onAbrirValor(conta)}
                      className="text-right"
                    >
                      <p className={`text-lg font-bold tabular-nums ${conta.pago ? 'text-moncash-success' : 'text-white'}`}>
                        {formatarMoeda(conta.valor)}
                      </p>
                    </button>
                  ) : (
                    <button
                      onClick={() => onAbrirValor(conta)}
                      className="px-3 py-1 bg-moncash-card rounded-lg text-xs text-moncash-lime border border-moncash-lime/30"
                    >
                      Definir valor
                    </button>
                  )}
                  
                  {/* Botão Pagar */}
                  <button
                    onClick={() => onMarcarPago(conta)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all
                      ${conta.pago 
                        ? 'bg-moncash-success/20 text-moncash-success' 
                        : 'bg-moncash-card hover:bg-moncash-lime hover:text-moncash-dark text-white'}`}
                  >
                    {conta.pago ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    )}
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

// Modal Novo Gasto
function ModalNovoGasto({ aberto, onFechar, onSalvar, mesAtual, anoAtual }) {
  const [valor, setValor] = useState('')
  const [descricao, setDescricao] = useState('')
  const [categoria, setCategoria] = useState('outros')
  const [salvando, setSalvando] = useState(false)

  const limpar = () => {
    setValor('')
    setDescricao('')
    setCategoria('outros')
  }

  const handleSalvar = async () => {
    const valorNum = parseFloat(valor.replace(',', '.'))
    if (isNaN(valorNum) || valorNum <= 0 || !descricao.trim()) {
      som.tocar('erro')
      return
    }

    setSalvando(true)
    try {
      // Data do mês/ano atual selecionado
      const dataGasto = new Date(anoAtual, mesAtual - 1, new Date().getDate())
      await onSalvar({
        valor: valorNum,
        descricao: descricao.trim(),
        categoria,
        data: dataGasto.toISOString().split('T')[0]
      })
      som.tocar('sucesso')
      limpar()
      onFechar()
    } catch (error) {
      console.error('Erro:', error)
      som.tocar('erro')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <Modal aberto={aberto} onFechar={onFechar} titulo="Informar Gasto">
      <div className="space-y-4">
        <div>
          <label className="input-label">Valor *</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-moncash-text-muted">R$</span>
            <input
              type="text"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              placeholder="0,00"
              className="input-field pl-12 text-xl font-bold"
              inputMode="decimal"
              autoFocus
            />
          </div>
        </div>

        <div>
          <label className="input-label">Descrição *</label>
          <input
            type="text"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Ex: Almoço, Gasolina, Mercado..."
            className="input-field"
          />
        </div>

        <div>
          <label className="input-label">Categoria</label>
          <div className="grid grid-cols-3 gap-2">
            {CATEGORIAS_GASTO.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoria(cat.id)}
                className={`p-2 rounded-xl border-2 transition-all text-center
                  ${categoria === cat.id 
                    ? 'border-moncash-lime bg-moncash-lime/10' 
                    : 'border-moncash-border bg-moncash-card'}`}
              >
                <span className="text-lg block">{cat.icone}</span>
                <span className="text-[10px] text-moncash-text-muted">{cat.nome}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button onClick={onFechar} className="btn-secondary flex-1">Cancelar</button>
          <button onClick={handleSalvar} disabled={salvando} className="btn-primary flex-1">
            {salvando ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>
    </Modal>
  )
}

// Modal Lançamento (Renda Extra)
function ModalLancamento({ aberto, onFechar }) {
  const { salvarConfiguracoes, configuracoes } = useDados()
  const [valor, setValor] = useState('')
  const [descricao, setDescricao] = useState('')
  const [salvando, setSalvando] = useState(false)

  const handleSalvar = async () => {
    const valorNum = parseFloat(valor.replace(',', '.'))
    if (isNaN(valorNum) || valorNum <= 0) {
      som.tocar('erro')
      return
    }

    setSalvando(true)
    try {
      // Adicionar ao saldo mensal
      const novoSaldo = (configuracoes?.saldo_mensal || 0) + valorNum
      await salvarConfiguracoes({ saldo_mensal: novoSaldo })
      som.tocar('moeda')
      setValor('')
      setDescricao('')
      onFechar()
    } catch (error) {
      console.error('Erro:', error)
      som.tocar('erro')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <Modal aberto={aberto} onFechar={onFechar} titulo="Adicionar Lançamento">
      <div className="space-y-4">
        <p className="text-sm text-moncash-text-muted">
          Registre uma renda extra (freela, venda, etc). O valor será adicionado ao seu saldo mensal.
        </p>

        <div>
          <label className="input-label">Valor *</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-moncash-text-muted">R$</span>
            <input
              type="text"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              placeholder="0,00"
              className="input-field pl-12 text-xl font-bold"
              inputMode="decimal"
              autoFocus
            />
          </div>
        </div>

        <div>
          <label className="input-label">Descrição (opcional)</label>
          <input
            type="text"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Ex: Freela de design, Venda de produto..."
            className="input-field"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button onClick={onFechar} className="btn-secondary flex-1">Cancelar</button>
          <button onClick={handleSalvar} disabled={salvando} className="btn-primary flex-1">
            {salvando ? 'Salvando...' : 'Adicionar'}
          </button>
        </div>
      </div>
    </Modal>
  )
}

// Modal Adicionar ao Cofrinho
function ModalAdicionarCofrinho({ aberto, onFechar, onAdicionar }) {
  const [valor, setValor] = useState('')
  const [salvando, setSalvando] = useState(false)

  const handleSalvar = async () => {
    const valorNum = parseFloat(valor.replace(',', '.'))
    if (isNaN(valorNum) || valorNum <= 0) {
      som.tocar('erro')
      return
    }

    setSalvando(true)
    try {
      await onAdicionar(valorNum, 'Depósito')
      som.tocar('moeda')
      setValor('')
      onFechar()
    } catch (error) {
      console.error('Erro:', error)
      som.tocar('erro')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <Modal aberto={aberto} onFechar={onFechar} titulo="Adicionar ao Cofrinho">
      <div className="space-y-4">
        <div className="text-center py-4">
          <span className="text-5xl">🐷</span>
        </div>

        <div>
          <label className="input-label">Valor</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-moncash-text-muted">R$</span>
            <input
              type="text"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              placeholder="0,00"
              className="input-field pl-12 text-xl font-bold"
              inputMode="decimal"
              autoFocus
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={onFechar} className="btn-secondary flex-1">Cancelar</button>
          <button onClick={handleSalvar} disabled={salvando} className="btn-primary flex-1">
            {salvando ? 'Salvando...' : 'Adicionar'}
          </button>
        </div>
      </div>
    </Modal>
  )
}

// Modal Definir Valor da Conta
function ModalDefinirValor({ aberto, onFechar, conta, onSalvar }) {
  const [valor, setValor] = useState('')
  const [salvando, setSalvando] = useState(false)

  useEffect(() => {
    if (conta) {
      setValor(conta.valor?.toString() || '')
    }
  }, [conta])

  const handleSalvar = async () => {
    const valorNum = parseFloat(valor.replace(',', '.'))
    if (isNaN(valorNum) || valorNum < 0) {
      som.tocar('erro')
      return
    }

    setSalvando(true)
    try {
      await onSalvar(conta.id, { valor: valorNum })
      som.tocar('sucesso')
      onFechar()
    } catch (error) {
      console.error('Erro:', error)
      som.tocar('erro')
    } finally {
      setSalvando(false)
    }
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
            <input
              type="text"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              placeholder="0,00"
              className="input-field pl-12 text-xl font-bold"
              inputMode="decimal"
              autoFocus
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={onFechar} className="btn-secondary flex-1">Cancelar</button>
          <button onClick={handleSalvar} disabled={salvando} className="btn-primary flex-1">
            {salvando ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
