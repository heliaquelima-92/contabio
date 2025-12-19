import { useState } from 'react'
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
  const [saldoMensal, setSaldoMensal] = useState(configuracoes?.saldo_mensal?.toString() || '5500')
  const [diaReferencia, setDiaReferencia] = useState(configuracoes?.dia_referencia?.toString() || '10')

  const handleSalvarConfig = async () => {
    setSalvando(true)
    try {
      await salvarConfiguracoes({
        saldo_mensal: parseFloat(saldoMensal) || 5500,
        dia_referencia: parseInt(diaReferencia) || 10
      })
      som.tocar('sucesso')
    } catch (error) {
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
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center
                      ${cor === 'lime' ? 'bg-moncash-lime/20' : cor === 'purple' ? 'bg-purple-500/20' : 'bg-moncash-warning/20'}`}>
        <span className="text-xl">{icone}</span>
      </div>
      <div className="flex-1">
        <p className="font-semibold text-white">{titulo}</p>
        <p className="text-xs text-moncash-text-muted">{subtitulo}</p>
      </div>
      <svg className="w-5 h-5 text-moncash-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-5 space-y-4">
        <h3 className="text-sm font-semibold text-moncash-text-muted uppercase tracking-wider">Configurações Gerais</h3>
        <div>
          <label className="input-label">Saldo Mensal Inicial</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-moncash-text-muted">R$</span>
            <input type="text" value={saldoMensal} onChange={(e) => setSaldoMensal(e.target.value)} className="input-field pl-12" />
          </div>
        </div>
        <div>
          <label className="input-label">Dia de Referência</label>
          <input type="number" value={diaReferencia} onChange={(e) => setDiaReferencia(e.target.value)} min="1" max="31" className="input-field" />
          <p className="text-xs text-moncash-text-muted mt-1">O dia que você recebe seu salário</p>
        </div>
        <button onClick={handleSalvarConfig} disabled={salvando} className="btn-primary w-full">
          {salvando ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-3">
        <h3 className="text-sm font-semibold text-moncash-text-muted uppercase tracking-wider px-1">Gerenciadores</h3>
        <MenuItem icone="🔄" titulo="Contas Fixas" subtitulo={`${contasFixas.length} contas`} onClick={() => setModalAberto('fixas')} />
        <MenuItem icone="📦" titulo="Contas Parceladas" subtitulo={`${contasParceladas.length} parcelamentos`} onClick={() => setModalAberto('parceladas')} cor="purple" />
        <MenuItem icone="💳" titulo="Cartões" subtitulo={`${cartoes.length} cartões`} onClick={() => setModalAberto('cartoes')} cor="warning" />
        <MenuItem icone="🐷" titulo="Cofrinho" subtitulo={formatarMoeda(cofrinho?.total || 0)} onClick={() => setModalAberto('cofrinho')} />
      </motion.div>

      <ModalFixas aberto={modalAberto === 'fixas'} onFechar={() => setModalAberto(null)} dados={contasFixas} onAdd={adicionarContaFixa} onDel={deletarContaFixa} />
      <ModalParceladas aberto={modalAberto === 'parceladas'} onFechar={() => setModalAberto(null)} dados={contasParceladas} onAdd={adicionarContaParcelada} onDel={deletarContaParcelada} />
      <ModalCartoes aberto={modalAberto === 'cartoes'} onFechar={() => setModalAberto(null)} dados={cartoes} onAdd={adicionarCartao} onDel={deletarCartao} />
      <ModalCofrinho aberto={modalAberto === 'cofrinho'} onFechar={() => setModalAberto(null)} cofrinho={cofrinho} onAdd={adicionarAoCofrinho} onMeta={atualizarMetaCofrinho} />
    </div>
  )
}

function ModalFixas({ aberto, onFechar, dados, onAdd, onDel }) {
  const [add, setAdd] = useState(false)
  const [nome, setNome] = useState('')
  const [valor, setValor] = useState('')
  const [venc, setVenc] = useState('10')
  const [fixo, setFixo] = useState(false)

  const salvar = async () => {
    if (!nome.trim()) return
    await onAdd({ nome: nome.trim(), valor: parseFloat(valor) || 0, vencimento: parseInt(venc) || 10, valor_fixo: fixo })
    setNome(''); setValor(''); setVenc('10'); setFixo(false); setAdd(false)
    som.tocar('sucesso')
  }

  return (
    <Modal aberto={aberto} onFechar={onFechar} titulo="Contas Fixas" tamanho="lg">
      <div className="space-y-4">
        {!add ? (
          <button onClick={() => setAdd(true)} className="btn-primary w-full">+ Adicionar</button>
        ) : (
          <div className="card p-4 space-y-3 bg-moncash-darker">
            <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome" className="input-field" />
            <div className="grid grid-cols-2 gap-3">
              <input type="text" value={valor} onChange={(e) => setValor(e.target.value)} placeholder="Valor" className="input-field" />
              <input type="number" value={venc} onChange={(e) => setVenc(e.target.value)} placeholder="Dia" className="input-field" />
            </div>
            <label className="flex items-center gap-3"><input type="checkbox" checked={fixo} onChange={(e) => setFixo(e.target.checked)} className="w-5 h-5" /><span className="text-sm text-moncash-text-secondary">Valor fixo</span></label>
            <div className="flex gap-2"><button onClick={() => setAdd(false)} className="btn-secondary flex-1">Cancelar</button><button onClick={salvar} className="btn-primary flex-1">Salvar</button></div>
          </div>
        )}
        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {dados.map((c) => (
            <div key={c.id} className="card p-4 flex items-center justify-between">
              <div><p className="font-medium text-white">{c.nome}</p><p className="text-xs text-moncash-text-muted">{c.valor_fixo ? formatarMoeda(c.valor) : 'Variável'} • Dia {c.vencimento}</p></div>
              <button onClick={() => { if (confirm('Deletar?')) { onDel(c.id); som.tocar('clique') } }} className="w-8 h-8 rounded-full bg-moncash-error/10 flex items-center justify-center"><svg className="w-4 h-4 text-moncash-error" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
          ))}
          {dados.length === 0 && <p className="text-center text-moncash-text-muted py-8">Nenhuma</p>}
        </div>
      </div>
    </Modal>
  )
}

function ModalParceladas({ aberto, onFechar, dados, onAdd, onDel }) {
  const [add, setAdd] = useState(false)
  const [nome, setNome] = useState('')
  const [valor, setValor] = useState('')
  const [parc, setParc] = useState('12')
  const [venc, setVenc] = useState('10')

  const salvar = async () => {
    if (!nome.trim()) return
    await onAdd({ nome: nome.trim(), valor_parcela: parseFloat(valor) || 0, parcelas_totais: parseInt(parc) || 1, parcelas_restantes: parseInt(parc) || 1, vencimento: parseInt(venc) || 10 })
    setNome(''); setValor(''); setParc('12'); setAdd(false)
    som.tocar('sucesso')
  }

  return (
    <Modal aberto={aberto} onFechar={onFechar} titulo="Parceladas" tamanho="lg">
      <div className="space-y-4">
        {!add ? (
          <button onClick={() => setAdd(true)} className="btn-primary w-full">+ Adicionar</button>
        ) : (
          <div className="card p-4 space-y-3 bg-moncash-darker">
            <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome" className="input-field" />
            <div className="grid grid-cols-3 gap-2">
              <input type="text" value={valor} onChange={(e) => setValor(e.target.value)} placeholder="Valor" className="input-field" />
              <input type="number" value={parc} onChange={(e) => setParc(e.target.value)} placeholder="Parc." className="input-field" />
              <input type="number" value={venc} onChange={(e) => setVenc(e.target.value)} placeholder="Dia" className="input-field" />
            </div>
            <div className="flex gap-2"><button onClick={() => setAdd(false)} className="btn-secondary flex-1">Cancelar</button><button onClick={salvar} className="btn-primary flex-1">Salvar</button></div>
          </div>
        )}
        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {dados.map((c) => (
            <div key={c.id} className="card p-4 flex items-center justify-between">
              <div><p className="font-medium text-white">{c.nome}</p><p className="text-xs text-moncash-text-muted">{formatarMoeda(c.valor_parcela)} • {c.parcelas_restantes}/{c.parcelas_totais}</p></div>
              <button onClick={() => { if (confirm('Deletar?')) { onDel(c.id); som.tocar('clique') } }} className="w-8 h-8 rounded-full bg-moncash-error/10 flex items-center justify-center"><svg className="w-4 h-4 text-moncash-error" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
          ))}
          {dados.length === 0 && <p className="text-center text-moncash-text-muted py-8">Nenhuma</p>}
        </div>
      </div>
    </Modal>
  )
}

function ModalCartoes({ aberto, onFechar, dados, onAdd, onDel }) {
  const [nome, setNome] = useState('')
  const salvar = async () => { if (!nome.trim()) return; await onAdd({ nome: nome.trim() }); setNome(''); som.tocar('sucesso') }

  return (
    <Modal aberto={aberto} onFechar={onFechar} titulo="Cartões">
      <div className="space-y-4">
        <div className="flex gap-2">
          <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome do cartão" className="input-field flex-1" />
          <button onClick={salvar} className="btn-primary px-6">+</button>
        </div>
        <div className="space-y-2">
          {dados.map((c) => (
            <div key={c.id} className="card p-4 flex items-center justify-between">
              <div className="flex items-center gap-3"><span className="text-2xl">💳</span><p className="font-medium text-white">{c.nome}</p></div>
              <button onClick={() => { if (confirm('Deletar?')) { onDel(c.id); som.tocar('clique') } }} className="w-8 h-8 rounded-full bg-moncash-error/10 flex items-center justify-center"><svg className="w-4 h-4 text-moncash-error" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
          ))}
          {dados.length === 0 && <p className="text-center text-moncash-text-muted py-8">Nenhum</p>}
        </div>
      </div>
    </Modal>
  )
}

function ModalCofrinho({ aberto, onFechar, cofrinho, onAdd, onMeta }) {
  const [valor, setValor] = useState('')
  const [meta, setMeta] = useState(cofrinho?.meta?.toString() || '0')
  const total = cofrinho?.total || 0
  const metaV = cofrinho?.meta || 0
  const prog = metaV > 0 ? (total / metaV) * 100 : 0

  const adicionar = async () => { const v = parseFloat(valor); if (isNaN(v) || v <= 0) return; await onAdd(v, 'Depósito'); setValor(''); som.tocar('moeda') }
  const salvarMeta = async () => { await onMeta(parseFloat(meta) || 0); som.tocar('sucesso') }

  return (
    <Modal aberto={aberto} onFechar={onFechar} titulo="Cofrinho">
      <div className="space-y-5">
        <div className="text-center py-6">
          <span className="text-5xl mb-4 block">🐷</span>
          <p className="text-sm text-moncash-text-muted mb-1">Saldo</p>
          <p className="text-3xl font-bold text-moncash-lime tabular-nums">{formatarMoeda(total)}</p>
        </div>
        {metaV > 0 && (
          <div>
            <div className="flex justify-between text-sm mb-2"><span className="text-moncash-text-muted">Meta: {formatarMoeda(metaV)}</span><span className="text-moncash-lime">{prog.toFixed(0)}%</span></div>
            <div className="h-2 bg-moncash-border rounded-full overflow-hidden"><div className="h-full bg-moncash-lime rounded-full" style={{ width: `${Math.min(prog, 100)}%` }} /></div>
          </div>
        )}
        <div><label className="input-label">Adicionar</label><div className="flex gap-2"><input type="text" value={valor} onChange={(e) => setValor(e.target.value)} placeholder="R$ 0,00" className="input-field flex-1" /><button onClick={adicionar} className="btn-primary px-6">+</button></div></div>
        <div><label className="input-label">Meta</label><div className="flex gap-2"><input type="text" value={meta} onChange={(e) => setMeta(e.target.value)} placeholder="R$ 0,00" className="input-field flex-1" /><button onClick={salvarMeta} className="btn-secondary px-6">Salvar</button></div></div>
      </div>
    </Modal>
  )
}
