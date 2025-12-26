import { useState } from 'react'
import Modal from './Modal'
import { CATEGORIAS_GASTO } from '../lib/utils'
import { som } from '../lib/sons'

export default function ModalNovoGasto({ aberto, onFechar, onSalvar }) {
  const [valor, setValor] = useState('')
  const [descricao, setDescricao] = useState('')
  const [categoria, setCategoria] = useState('outros')
  const [data, setData] = useState(new Date().toISOString().split('T')[0])
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')

  const limpar = () => {
    setValor('')
    setDescricao('')
    setCategoria('outros')
    setData(new Date().toISOString().split('T')[0])
    setErro('')
  }

  const handleFechar = () => {
    limpar()
    onFechar()
  }

  const handleSalvar = async () => {
    setErro('')

    const valorNum = parseFloat(valor.replace(',', '.'))
    if (isNaN(valorNum) || valorNum <= 0) {
      setErro('Digite um valor válido')
      som.tocar('erro')
      return
    }

    if (!descricao.trim()) {
      setErro('Digite uma descrição')
      som.tocar('erro')
      return
    }

    setSalvando(true)
    try {
      await onSalvar({
        valor: valorNum,
        descricao: descricao.trim(),
        categoria,
        data
      })
      som.tocar('sucesso')
      limpar()
      onFechar()
    } catch (error) {
      setErro('Erro ao salvar. Tente novamente.')
      som.tocar('erro')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <Modal aberto={aberto} onFechar={handleFechar} titulo="Novo Gasto">
      <div className="space-y-5">
        {/* Valor */}
        <div>
          <label className="input-label">Valor *</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-moncash-text-muted font-medium">
              R$
            </span>
            <input
              type="text"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              placeholder="0,00"
              className="input-field pl-12 text-xl font-bold"
              inputMode="decimal"
            />
          </div>
        </div>

        {/* Descrição */}
        <div>
          <label className="input-label">Descrição *</label>
          <input
            type="text"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Ex: Almoço no shopping"
            className="input-field"
          />
        </div>

        {/* Categoria */}
        <div>
          <label className="input-label">Categoria</label>
          <div className="grid grid-cols-3 gap-2">
            {CATEGORIAS_GASTO.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setCategoria(cat.id)
                  som.tocar('clique')
                }}
                className={`
                  p-3 rounded-xl border-2 transition-all duration-200 text-center
                  ${categoria === cat.id 
                    ? 'border-moncash-lime bg-moncash-lime/10' 
                    : 'border-moncash-border bg-moncash-card hover:border-moncash-border-light'}
                `}
              >
                <span className="text-xl block mb-1">{cat.icone}</span>
                <span className="text-xs text-moncash-text-muted">{cat.nome}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Data */}
        <div>
          <label className="input-label">Data</label>
          <input
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            className="input-field"
          />
        </div>

        {/* Erro */}
        {erro && (
          <div className="bg-moncash-error/10 border border-moncash-error/30 rounded-xl p-3">
            <p className="text-moncash-error text-sm text-center">{erro}</p>
          </div>
        )}

        {/* Botões */}
        <div className="flex gap-3 pt-2">
          <button onClick={handleFechar} className="btn-secondary flex-1">
            Cancelar
          </button>
          <button
            onClick={handleSalvar}
            disabled={salvando}
            className="btn-primary flex-1 flex items-center justify-center gap-2"
          >
            {salvando ? (
              <div className="w-5 h-5 border-2 border-moncash-dark/30 border-t-moncash-dark rounded-full animate-spin" />
            ) : (
              'Salvar'
            )}
          </button>
        </div>
      </div>
    </Modal>
  )
}
