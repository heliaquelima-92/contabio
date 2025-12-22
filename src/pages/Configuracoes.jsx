import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useDados } from '../hooks/useDados'
import Modal from '../components/Modal'
import { formatarMoeda } from '../lib/utils'
import { som } from '../lib/sons'

export default function Configuracoes() {
  const { 
    configuracoes, 
    contasFixas, 
    contasParceladas,
    cartoes,
    cofrinho,
    salvarConfiguracoes,
    adicionarContaFixa,
    deletarContaFixa,
    adicionarContaParcelada,
    deletarContaParcelada,
    adicionarCartao,
    deletarCartao,
    adicionarAoCofrinho,
    atualizarMetaCofrinho
  } = useDados()

  const [modalAberto, setModalAberto] = useState(null)
  const [salvando, setSalvando] = useState(false)
  const [saldoMensal, setSaldoMensal] = useState('')
  const [diaReferencia, setDiaReferencia] = useState('')

  useEffect(() => {
    if (configuracoes) {
      setSaldoMensal(configuracoes.saldo_mensal?.toString() || '5500')
      setDiaReferencia(configuracoes.dia_referencia?.toString() || '10')
    }
  }, [configuracoes])

  const handleSalvarConfig = async () => {
    setSalvando(true)
    try {
      await salvarConfiguracoes({
        saldo_mensal: parseFloat(saldoMensal) || 5500,
        dia_referencia: parseInt(diaReferencia) || 10
      })
      som.tocar('sucesso')
    } catch (error) {
      console.error('Erro ao salvar:', error)
      som.tocar('erro')
    } finally {
      setSalvando(false)
    }
  }

  const MenuItem = ({ icone, titulo, subtitulo, onClick, cor = 'lime' }) => (
    <button
      onClick={() => { som.tocar('clique'); onClick() }}
      className="w-full card p-4 flex items-center gap-4 card-hover text-left"
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0
                      ${cor === 'lime' ? 'bg-moncash-lime/20' : cor === 'purple' ? 'bg-purple-500/20' : cor === 'warning' ? 'bg-moncash-warning/20' : 'bg-blue-500/20'}`}>
        <span className="text-xl">{icone}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-white">{titulo}</p>
        <p className="text-xs text-moncash-text-muted truncate">{subtitulo}</p>
      </div>
      <svg className="w-5 h-5 text-moncash-text-muted shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </button>
  )

  return (
    <div className="px-4 space-y-5 pb-4">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h1 className="text-2xl font-bold text-white mb-1">Configurações</h1>
        <p className="text-moncash-text-muted text-sm">Personalize seu Moncash</p>
      </motion.div>

      {/* Configurações Gerais */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-5 space-y-4">
        <h3 className="text-sm font-semibold text-moncash-text-muted uppercase tracking-wider">Configurações Gerais</h3>
        
        <div>
          <label className="input-label">Saldo Mensal Inicial</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-moncash-text-muted">R$</span>
            <input 
              type="text" 
              value={saldoMensal} 
              onChange={(e) => setSaldoMensal(e.target.value)} 
              className="input-field pl-12" 
              inputMode="decimal"
            />
          </div>
        </div>
        
        <div>
          <label className="input-label">Dia de Referência (dia do pagamento)</label>
          <input 
            type="number" 
            value={diaReferencia} 
            onChange={(e) => setDiaReferencia(e.target.value)} 
            min="1" 
            max="31" 
            className="input-field" 
          />
          <p className="text-xs text-moncash-text-muted mt-1">O dia que você recebe seu salário</p>
        </div>
        
        <button onClick={handleSalvarConfig} disabled={salvando} className="btn-primary w-full">
          {salvando ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </motion.div>

      {/* Gerenciadores */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-3">
        <h3 className="text-sm font-semibold text-moncash-text-muted uppercase tracking-wider px-1">Gerenciadores</h3>
        
        <MenuItem 
          icone="🔄" 
          titulo="Contas Fixas" 
          subtitulo={`${contasFixas?.length || 0} contas cadastradas`} 
          onClick={() => setModalAberto('fixas')} 
        />
        
        <MenuItem 
          icone="📦" 
          titulo="Contas Parceladas" 
          subtitulo={`${contasParceladas?.length || 0} parcelamentos ativos`} 
          onClick={() => setModalAberto('parceladas')} 
          cor="purple" 
        />
        
        <MenuItem 
          icone="💳" 
          titulo="Cartões de Crédito" 
          subtitulo={`${cartoes?.length || 0} cartões cadastrados`} 
          onClick={() => setModalAberto('cartoes')} 
          cor="warning" 
        />
        
        <MenuItem 
          icone="🐷" 
          titulo="Cofrinho" 
          subtitulo={`Saldo: ${formatarMoeda(cofrinho?.total || 0)}`} 
          onClick={() => setModalAberto('cofrinho')} 
          cor="blue"
        />
      </motion.div>

      {/* Modais */}
      <ModalContasFixas
        aberto={modalAberto === 'fixas'}
        onFechar={() => setModalAberto(null)}
        contasFixas={contasFixas || []}
        onAdicionar={adicionarContaFixa}
        onDeletar={deletarContaFixa}
      />

      <ModalContasParceladas
        aberto={modalAberto === 'parceladas'}
        onFechar={() => setModalAberto(null)}
        contasParceladas={contasParceladas || []}
        onAdicionar={adicionarContaParcelada}
        onDeletar={deletarContaParcelada}
      />

      <ModalCartoes
        aberto={modalAberto === 'cartoes'}
        onFechar={() => setModalAberto(null)}
        cartoes={cartoes || []}
        onAdicionar={adicionarCartao}
        onDeletar={deletarCartao}
      />

      <ModalCofrinho
        aberto={modalAberto === 'cofrinho'}
        onFechar={() => setModalAberto(null)}
        cofrinho={cofrinho}
        onAdicionar={adicionarAoCofrinho}
        onAtualizarMeta={atualizarMetaCofrinho}
      />
    </div>
  )
}

// ==================== MODAL CONTAS FIXAS ====================
function ModalContasFixas({ aberto, onFechar, contasFixas, onAdicionar, onDeletar }) {
  const [mostrarForm, setMostrarForm] = useState(false)
  const [nome, setNome] = useState('')
  const [vencimento, setVencimento] = useState('10')
  const [valorFixo, setValorFixo] = useState(false)
  const [valor, setValor] = useState('')
  const [salvando, setSalvando] = useState(false)

  const limparForm = () => {
    setNome('')
    setVencimento('10')
    setValorFixo(false)
    setValor('')
    setMostrarForm(false)
  }

  const handleSalvar = async () => {
    if (!nome.trim()) {
      som.tocar('erro')
      return
    }

    setSalvando(true)
    try {
      await onAdicionar({
        nome: nome.trim(),
        valor: valorFixo ? (parseFloat(valor.replace(',', '.')) || 0) : 0,
        vencimento: parseInt(vencimento) || 10,
        valor_fixo: valorFixo
      })
      som.tocar('sucesso')
      limparForm()
    } catch (error) {
      console.error('Erro ao adicionar:', error)
      som.tocar('erro')
    } finally {
      setSalvando(false)
    }
  }

  const handleDeletar = async (id) => {
    if (confirm('Tem certeza que deseja deletar esta conta?')) {
      try {
        await onDeletar(id)
        som.tocar('clique')
      } catch (error) {
        console.error('Erro ao deletar:', error)
        som.tocar('erro')
      }
    }
  }

  return (
    <Modal aberto={aberto} onFechar={onFechar} titulo="Contas Fixas" tamanho="lg">
      <div className="space-y-4">
        {/* Botão Adicionar ou Formulário */}
        {!mostrarForm ? (
          <button 
            onClick={() => setMostrarForm(true)} 
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Adicionar Conta Fixa
          </button>
        ) : (
          <div className="bg-moncash-darker border border-moncash-border rounded-xl p-4 space-y-4">
            <div>
              <label className="input-label">Nome da Conta *</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Aluguel, Energia, Internet..."
                className="input-field"
                autoFocus
              />
            </div>

            <div>
              <label className="input-label">Dia do Vencimento</label>
              <input
                type="number"
                value={vencimento}
                onChange={(e) => setVencimento(e.target.value)}
                min="1"
                max="31"
                className="input-field"
              />
            </div>

            <label className="flex items-center gap-3 cursor-pointer p-3 bg-moncash-card rounded-xl">
              <input
                type="checkbox"
                checked={valorFixo}
                onChange={(e) => setValorFixo(e.target.checked)}
                className="w-5 h-5 rounded border-moncash-border accent-moncash-lime"
              />
              <div>
                <span className="text-sm font-medium text-white">Valor fixo todo mês</span>
                <p className="text-xs text-moncash-text-muted">Marque se o valor não muda (ex: aluguel, plano de saúde)</p>
              </div>
            </label>

            {valorFixo && (
              <div>
                <label className="input-label">Valor</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-moncash-text-muted">R$</span>
                  <input
                    type="text"
                    value={valor}
                    onChange={(e) => setValor(e.target.value)}
                    placeholder="0,00"
                    className="input-field pl-12"
                    inputMode="decimal"
                  />
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button onClick={limparForm} className="btn-secondary flex-1">
                Cancelar
              </button>
              <button 
                onClick={handleSalvar} 
                disabled={salvando || !nome.trim()}
                className="btn-primary flex-1"
              >
                {salvando ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        )}

        {/* Lista de Contas */}
        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {contasFixas.length === 0 ? (
            <div className="text-center py-8 text-moncash-text-muted">
              <span className="text-4xl block mb-2">📋</span>
              Nenhuma conta fixa cadastrada
            </div>
          ) : (
            contasFixas.map((conta) => (
              <div key={conta.id} className="card p-4 flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate">{conta.nome}</p>
                  <p className="text-xs text-moncash-text-muted">
                    {conta.valor_fixo ? formatarMoeda(conta.valor) : 'Valor variável'} • Vence dia {conta.vencimento}
                  </p>
                </div>
                <button
                  onClick={() => handleDeletar(conta.id)}
                  className="w-10 h-10 rounded-xl bg-moncash-error/10 flex items-center justify-center hover:bg-moncash-error/20 transition-colors shrink-0 ml-3"
                >
                  <svg className="w-5 h-5 text-moncash-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </Modal>
  )
}

// ==================== MODAL CONTAS PARCELADAS ====================
function ModalContasParceladas({ aberto, onFechar, contasParceladas, onAdicionar, onDeletar }) {
  const [mostrarForm, setMostrarForm] = useState(false)
  const [nome, setNome] = useState('')
  const [valorParcela, setValorParcela] = useState('')
  const [parcelas, setParcelas] = useState('12')
  const [vencimento, setVencimento] = useState('10')
  const [salvando, setSalvando] = useState(false)

  const limparForm = () => {
    setNome('')
    setValorParcela('')
    setParcelas('12')
    setVencimento('10')
    setMostrarForm(false)
  }

  const handleSalvar = async () => {
    if (!nome.trim()) {
      som.tocar('erro')
      return
    }

    setSalvando(true)
    try {
      await onAdicionar({
        nome: nome.trim(),
        valor_parcela: parseFloat(valorParcela.replace(',', '.')) || 0,
        parcelas_totais: parseInt(parcelas) || 1,
        parcelas_restantes: parseInt(parcelas) || 1,
        vencimento: parseInt(vencimento) || 10
      })
      som.tocar('sucesso')
      limparForm()
    } catch (error) {
      console.error('Erro ao adicionar:', error)
      som.tocar('erro')
    } finally {
      setSalvando(false)
    }
  }

  const handleDeletar = async (id) => {
    if (confirm('Tem certeza que deseja deletar esta conta parcelada?')) {
      try {
        await onDeletar(id)
        som.tocar('clique')
      } catch (error) {
        console.error('Erro ao deletar:', error)
        som.tocar('erro')
      }
    }
  }

  return (
    <Modal aberto={aberto} onFechar={onFechar} titulo="Contas Parceladas" tamanho="lg">
      <div className="space-y-4">
        {!mostrarForm ? (
          <button 
            onClick={() => setMostrarForm(true)} 
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Adicionar Parcelada
          </button>
        ) : (
          <div className="bg-moncash-darker border border-moncash-border rounded-xl p-4 space-y-4">
            <div>
              <label className="input-label">Nome *</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Geladeira, Celular..."
                className="input-field"
                autoFocus
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="input-label">Valor da Parcela</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-moncash-text-muted text-sm">R$</span>
                  <input
                    type="text"
                    value={valorParcela}
                    onChange={(e) => setValorParcela(e.target.value)}
                    placeholder="0,00"
                    className="input-field pl-10"
                    inputMode="decimal"
                  />
                </div>
              </div>
              <div>
                <label className="input-label">Parcelas</label>
                <input
                  type="number"
                  value={parcelas}
                  onChange={(e) => setParcelas(e.target.value)}
                  min="1"
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="input-label">Dia do Vencimento</label>
              <input
                type="number"
                value={vencimento}
                onChange={(e) => setVencimento(e.target.value)}
                min="1"
                max="31"
                className="input-field"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={limparForm} className="btn-secondary flex-1">Cancelar</button>
              <button 
                onClick={handleSalvar} 
                disabled={salvando || !nome.trim()}
                className="btn-primary flex-1"
              >
                {salvando ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        )}

        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {contasParceladas.length === 0 ? (
            <div className="text-center py-8 text-moncash-text-muted">
              <span className="text-4xl block mb-2">📦</span>
              Nenhuma conta parcelada
            </div>
          ) : (
            contasParceladas.map((conta) => (
              <div key={conta.id} className="card p-4 flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate">{conta.nome}</p>
                  <p className="text-xs text-moncash-text-muted">
                    {formatarMoeda(conta.valor_parcela)} • {conta.parcelas_restantes}/{conta.parcelas_totais} restantes
                  </p>
                </div>
                <button
                  onClick={() => handleDeletar(conta.id)}
                  className="w-10 h-10 rounded-xl bg-moncash-error/10 flex items-center justify-center hover:bg-moncash-error/20 transition-colors shrink-0 ml-3"
                >
                  <svg className="w-5 h-5 text-moncash-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </Modal>
  )
}

// ==================== MODAL CARTÕES ====================
function ModalCartoes({ aberto, onFechar, cartoes, onAdicionar, onDeletar }) {
  const [mostrarForm, setMostrarForm] = useState(false)
  const [nome, setNome] = useState('')
  const [limite, setLimite] = useState('')
  const [salvando, setSalvando] = useState(false)

  const limparForm = () => {
    setNome('')
    setLimite('')
    setMostrarForm(false)
  }

  const handleSalvar = async () => {
    if (!nome.trim()) {
      som.tocar('erro')
      return
    }

    setSalvando(true)
    try {
      await onAdicionar({
        nome: nome.trim(),
        bandeira: 'credito',
        limite: parseFloat(limite.replace(',', '.')) || 0,
        vencimento: 10
      })
      som.tocar('sucesso')
      limparForm()
    } catch (error) {
      console.error('Erro ao adicionar:', error)
      som.tocar('erro')
    } finally {
      setSalvando(false)
    }
  }

  const handleDeletar = async (id) => {
    if (confirm('Tem certeza que deseja deletar este cartão?')) {
      try {
        await onDeletar(id)
        som.tocar('clique')
      } catch (error) {
        console.error('Erro ao deletar:', error)
        som.tocar('erro')
      }
    }
  }

  return (
    <Modal aberto={aberto} onFechar={onFechar} titulo="Cartões de Crédito" tamanho="lg">
      <div className="space-y-4">
        {!mostrarForm ? (
          <button 
            onClick={() => setMostrarForm(true)} 
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Adicionar Cartão
          </button>
        ) : (
          <div className="bg-moncash-darker border border-moncash-border rounded-xl p-4 space-y-4">
            <div>
              <label className="input-label">Nome do Cartão *</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Nubank, Bradesco, Inter..."
                className="input-field"
                autoFocus
              />
            </div>

            <div>
              <label className="input-label">Função</label>
              <div className="input-field bg-moncash-card text-moncash-text-muted cursor-not-allowed">
                Crédito
              </div>
              <p className="text-xs text-moncash-text-muted mt-1">Outras funções em breve</p>
            </div>

            <div>
              <label className="input-label">Limite</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-moncash-text-muted">R$</span>
                <input
                  type="text"
                  value={limite}
                  onChange={(e) => setLimite(e.target.value)}
                  placeholder="0,00"
                  className="input-field pl-12"
                  inputMode="decimal"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={limparForm} className="btn-secondary flex-1">Cancelar</button>
              <button 
                onClick={handleSalvar} 
                disabled={salvando || !nome.trim()}
                className="btn-primary flex-1"
              >
                {salvando ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        )}

        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {cartoes.length === 0 ? (
            <div className="text-center py-8 text-moncash-text-muted">
              <span className="text-4xl block mb-2">💳</span>
              Nenhum cartão cadastrado
            </div>
          ) : (
            cartoes.map((cartao) => (
              <div key={cartao.id} className="card p-4 flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-moncash-warning to-orange-600 flex items-center justify-center shrink-0">
                    <span className="text-lg">💳</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-white truncate">{cartao.nome}</p>
                    <p className="text-xs text-moncash-text-muted">
                      Crédito • Limite: {formatarMoeda(cartao.limite || 0)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeletar(cartao.id)}
                  className="w-10 h-10 rounded-xl bg-moncash-error/10 flex items-center justify-center hover:bg-moncash-error/20 transition-colors shrink-0 ml-3"
                >
                  <svg className="w-5 h-5 text-moncash-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </Modal>
  )
}

// ==================== MODAL COFRINHO ====================
function ModalCofrinho({ aberto, onFechar, cofrinho, onAdicionar, onAtualizarMeta }) {
  const [valor, setValor] = useState('')
  const [meta, setMeta] = useState('')
  const [salvando, setSalvando] = useState(false)

  useEffect(() => {
    if (cofrinho) {
      setMeta(cofrinho.meta?.toString() || '0')
    }
  }, [cofrinho])

  const total = cofrinho?.total || 0
  const metaValor = cofrinho?.meta || 0
  const progresso = metaValor > 0 ? Math.min((total / metaValor) * 100, 100) : 0

  const handleAdicionar = async () => {
    const v = parseFloat(valor.replace(',', '.'))
    if (isNaN(v) || v <= 0) {
      som.tocar('erro')
      return
    }

    setSalvando(true)
    try {
      await onAdicionar(v, 'Depósito')
      setValor('')
      som.tocar('moeda')
    } catch (error) {
      console.error('Erro:', error)
      som.tocar('erro')
    } finally {
      setSalvando(false)
    }
  }

  const handleSalvarMeta = async () => {
    try {
      await onAtualizarMeta(parseFloat(meta.replace(',', '.')) || 0)
      som.tocar('sucesso')
    } catch (error) {
      console.error('Erro:', error)
      som.tocar('erro')
    }
  }

  return (
    <Modal aberto={aberto} onFechar={onFechar} titulo="Cofrinho">
      <div className="space-y-6">
        {/* Saldo */}
        <div className="text-center py-6 bg-moncash-darker rounded-xl">
          <span className="text-6xl mb-4 block">🐷</span>
          <p className="text-sm text-moncash-text-muted mb-1">Saldo do Cofrinho</p>
          <p className="text-4xl font-bold text-moncash-lime tabular-nums">{formatarMoeda(total)}</p>
        </div>

        {/* Progresso da Meta */}
        {metaValor > 0 && (
          <div className="bg-moncash-card rounded-xl p-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-moncash-text-muted">Meta: {formatarMoeda(metaValor)}</span>
              <span className="text-moncash-lime font-semibold">{progresso.toFixed(0)}%</span>
            </div>
            <div className="h-3 bg-moncash-border rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-moncash-lime to-green-400 rounded-full transition-all duration-500" 
                style={{ width: `${progresso}%` }} 
              />
            </div>
          </div>
        )}

        {/* Adicionar */}
        <div>
          <label className="input-label">Adicionar ao Cofrinho</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-moncash-text-muted">R$</span>
              <input
                type="text"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                placeholder="0,00"
                className="input-field pl-12"
                inputMode="decimal"
              />
            </div>
            <button 
              onClick={handleAdicionar} 
              disabled={salvando}
              className="btn-primary px-6"
            >
              +
            </button>
          </div>
        </div>

        {/* Meta */}
        <div>
          <label className="input-label">Definir Meta</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-moncash-text-muted">R$</span>
              <input
                type="text"
                value={meta}
                onChange={(e) => setMeta(e.target.value)}
                placeholder="0,00"
                className="input-field pl-12"
                inputMode="decimal"
              />
            </div>
            <button onClick={handleSalvarMeta} className="btn-secondary px-6">
              Salvar
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
