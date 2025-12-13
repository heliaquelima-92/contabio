import { useState } from 'react'
import Modal from './Modal'
import { som } from '../lib/sons'

export default function ModalNovaConta({ aberto, onFechar, onSalvar, tipo = 'fixa' }) {
  const [nome, setNome] = useState('')
  const [valor, setValor] = useState('')
  const [vencimento, setVencimento] = useState('10')
  const [parcelasTotais, setParcelasTotais] = useState('1')
  const [anotacoes, setAnotacoes] = useState('')
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')

  const limparFormulario = () => {
    setNome('')
    setValor('')
    setVencimento('10')
    setParcelasTotais('1')
    setAnotacoes('')
    setErro('')
  }

  const handleFechar = () => {
    limparFormulario()
    onFechar()
  }

  const handleSalvar = async () => {
    setErro('')

    // Validações
    if (!nome.trim()) {
      setErro('Digite o nome da conta')
      som.tocar('erro')
      return
    }

    const valorNum = parseFloat(valor.replace(',', '.'))
    if (isNaN(valorNum) || valorNum <= 0) {
      setErro('Digite um valor válido')
      som.tocar('erro')
      return
    }

    const vencimentoNum = parseInt(vencimento)
    if (isNaN(vencimentoNum) || vencimentoNum < 1 || vencimentoNum > 31) {
      setErro('Dia de vencimento inválido')
      som.tocar('erro')
      return
    }

    setSalvando(true)

    try {
      if (tipo === 'fixa') {
        await onSalvar({
          nome: nome.trim(),
          valor: valorNum,
          vencimento: vencimentoNum,
          anotacoes: anotacoes.trim()
        })
      } else {
        const parcelas = parseInt(parcelasTotais)
        if (isNaN(parcelas) || parcelas < 1) {
          setErro('Número de parcelas inválido')
          som.tocar('erro')
          setSalvando(false)
          return
        }

        await onSalvar({
          nome: nome.trim(),
          valor_parcela: valorNum,
          parcelas_totais: parcelas,
          parcelas_restantes: parcelas,
          vencimento: vencimentoNum,
          anotacoes: anotacoes.trim()
        })
      }

      som.tocar('sucesso')
      limparFormulario()
      onFechar()
    } catch (error) {
      console.error('Erro ao salvar:', error)
      setErro('Erro ao salvar. Tente novamente.')
      som.tocar('erro')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <Modal 
      aberto={aberto} 
      onFechar={handleFechar} 
      titulo={tipo === 'fixa' ? 'Nova Conta Fixa' : 'Nova Conta Parcelada'}
    >
      <div className="space-y-4">
        {/* Nome */}
        <div>
          <label className="label-text">Nome da conta *</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex: Aluguel, Energia, Mercado..."
            className="input-field"
          />
        </div>

        {/* Valor */}
        <div>
          <label className="label-text">
            {tipo === 'fixa' ? 'Valor *' : 'Valor da parcela *'}
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-contabio-text-muted">
              R$
            </span>
            <input
              type="text"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              placeholder="0,00"
              className="input-field pl-12"
            />
          </div>
        </div>

        {/* Parcelas (apenas para parceladas) */}
        {tipo === 'parcelada' && (
          <div>
            <label className="label-text">Número de parcelas *</label>
            <input
              type="number"
              value={parcelasTotais}
              onChange={(e) => setParcelasTotais(e.target.value)}
              min="1"
              max="48"
              className="input-field"
            />
          </div>
        )}

        {/* Vencimento */}
        <div>
          <label className="label-text">Dia do vencimento *</label>
          <input
            type="number"
            value={vencimento}
            onChange={(e) => setVencimento(e.target.value)}
            min="1"
            max="31"
            className="input-field"
          />
        </div>

        {/* Anotações */}
        <div>
          <label className="label-text">Anotações (opcional)</label>
          <textarea
            value={anotacoes}
            onChange={(e) => setAnotacoes(e.target.value)}
            placeholder="Ex: Chave PIX, código da conta, observações..."
            className="input-field min-h-[80px] resize-none"
            rows={3}
          />
        </div>

        {/* Erro */}
        {erro && (
          <div className="bg-contabio-red/10 border border-contabio-red/30 rounded-xl p-3 animate-fade-in">
            <p className="text-contabio-red text-sm text-center">{erro}</p>
          </div>
        )}

        {/* Botões */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={handleFechar}
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
