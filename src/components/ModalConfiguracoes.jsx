import { useState, useEffect } from 'react'
import Modal from './Modal'
import { som } from '../lib/sons'

export default function ModalConfiguracoes({ aberto, onFechar, configuracoes, onSalvar }) {
  const [saldoMensal, setSaldoMensal] = useState('')
  const [sonsHabilitados, setSonsHabilitados] = useState(true)
  const [salvando, setSalvando] = useState(false)

  useEffect(() => {
    if (configuracoes) {
      setSaldoMensal(configuracoes.saldo_mensal?.toString() || '5500')
      setSonsHabilitados(configuracoes.sons_habilitados !== false)
    }
  }, [configuracoes])

  const handleSalvar = async () => {
    const saldoNum = parseFloat(saldoMensal.replace(',', '.'))
    if (isNaN(saldoNum) || saldoNum < 0) {
      som.tocar('erro')
      return
    }

    setSalvando(true)
    try {
      await onSalvar({
        saldo_mensal: saldoNum,
        sons_habilitados: sonsHabilitados
      })
      
      // Atualizar estado global dos sons
      if (sonsHabilitados) {
        som.habilitado = true
        som.tocar('sucesso')
      } else {
        som.habilitado = false
      }
      
      onFechar()
    } catch (error) {
      console.error('Erro ao salvar configurações:', error)
      som.tocar('erro')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <Modal aberto={aberto} onFechar={onFechar} titulo="Configurações">
      <div className="space-y-6">
        {/* Saldo Mensal */}
        <div>
          <label className="label-text">Saldo mensal inicial</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-contabio-text-muted">
              R$
            </span>
            <input
              type="text"
              value={saldoMensal}
              onChange={(e) => setSaldoMensal(e.target.value)}
              placeholder="5500,00"
              className="input-field pl-12"
            />
          </div>
          <p className="text-xs text-contabio-text-muted mt-2">
            Este valor será usado como saldo inicial todo mês.
          </p>
        </div>

        {/* Sons */}
        <div>
          <label className="label-text">Sons do sistema</label>
          <button
            onClick={() => {
              setSonsHabilitados(!sonsHabilitados)
              som.tocar('clique')
            }}
            className={`
              w-full p-4 rounded-xl border transition-all duration-300 flex items-center justify-between
              ${sonsHabilitados 
                ? 'bg-contabio-green/10 border-contabio-green/30' 
                : 'bg-contabio-card border-contabio-border'}
            `}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{sonsHabilitados ? '🔊' : '🔇'}</span>
              <div className="text-left">
                <p className="font-medium text-white">
                  {sonsHabilitados ? 'Sons ativados' : 'Sons desativados'}
                </p>
                <p className="text-xs text-contabio-text-muted">
                  Sons de moeda, cliques e notificações
                </p>
              </div>
            </div>
            <div className={`
              w-12 h-7 rounded-full transition-colors duration-300 relative
              ${sonsHabilitados ? 'bg-contabio-green' : 'bg-contabio-border'}
            `}>
              <div className={`
                absolute top-1 w-5 h-5 rounded-full bg-white transition-transform duration-300
                ${sonsHabilitados ? 'translate-x-6' : 'translate-x-1'}
              `} />
            </div>
          </button>
        </div>

        {/* Info */}
        <div className="bg-contabio-darker/50 rounded-xl p-4">
          <h4 className="text-sm font-medium text-white mb-2">ℹ️ Sobre o CONTABIO</h4>
          <p className="text-xs text-contabio-text-muted leading-relaxed">
            Sistema de contabilidade pessoal criado para ajudar você a organizar suas finanças 
            de forma simples e intuitiva. Todo mês começa com um novo ciclo financeiro.
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
