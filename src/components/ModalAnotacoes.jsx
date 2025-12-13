import { useState, useEffect } from 'react'
import Modal from './Modal'
import { som } from '../lib/sons'

export default function ModalAnotacoes({ aberto, onFechar, conta, onSalvar }) {
  const [anotacoes, setAnotacoes] = useState('')
  const [salvando, setSalvando] = useState(false)

  useEffect(() => {
    if (conta) {
      setAnotacoes(conta.anotacoes || '')
    }
  }, [conta])

  const handleSalvar = async () => {
    setSalvando(true)
    try {
      await onSalvar(conta.id, anotacoes)
      som.tocar('sucesso')
      onFechar()
    } catch (error) {
      console.error('Erro ao salvar anotações:', error)
      som.tocar('erro')
    } finally {
      setSalvando(false)
    }
  }

  if (!conta) return null

  return (
    <Modal aberto={aberto} onFechar={onFechar} titulo="Anotações">
      <div className="space-y-4">
        {/* Info da conta */}
        <div className="bg-contabio-darker/50 rounded-xl p-3">
          <p className="text-sm text-contabio-text-muted">Conta</p>
          <p className="font-medium text-white">{conta.nome}</p>
        </div>

        {/* Campo de anotação */}
        <div>
          <label className="label-text">
            Suas anotações
          </label>
          <textarea
            value={anotacoes}
            onChange={(e) => setAnotacoes(e.target.value)}
            placeholder="Ex: Chave PIX do locatário, código da conta, dados bancários..."
            className="input-field min-h-[150px] resize-none"
            rows={5}
          />
          <p className="text-xs text-contabio-text-muted mt-2">
            💡 Essas anotações serão salvas e aparecerão nos próximos meses automaticamente.
          </p>
        </div>

        {/* Botões */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={onFechar}
            className="btn-secondary flex-1"
          >
            Cancelar
          </button>
          <button
            onClick={handleSalvar}
            disabled={salvando}
            className="btn-primary flex-1 flex items-center justify-center gap-2"
          >
            {salvando ? (
              <>
                <div className="loading-spinner" />
                Salvando...
              </>
            ) : (
              'Salvar'
            )}
          </button>
        </div>
      </div>
    </Modal>
  )
}
