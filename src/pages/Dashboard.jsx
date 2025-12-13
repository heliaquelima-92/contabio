import { useState, useEffect } from 'react'
import { useContas } from '../hooks/useContas'
import Header from '../components/Header'
import CalendarioMeses from '../components/CalendarioMeses'
import Totalizador from '../components/Totalizador'
import ListaContas from '../components/ListaContas'
import BotoesAcao from '../components/BotoesAcao'
import ModalNovaConta from '../components/ModalNovaConta'
import ModalAnotacoes from '../components/ModalAnotacoes'
import ModalConfiguracoes from '../components/ModalConfiguracoes'
import { nomeMes } from '../lib/utils'

export default function Dashboard() {
  const {
    contasMes,
    contasFixas,
    contasParceladas,
    configuracoes,
    carregando,
    mesAtual,
    anoAtual,
    saldoInicial,
    saldoAtual,
    totalPagar,
    totalPago,
    progresso,
    todasPagas,
    adicionarContaFixa,
    adicionarContaParcelada,
    marcarComoPago,
    atualizarOrdem,
    atualizarAnotacoes,
    mudarMes,
    gerarContasMes,
    salvarConfiguracoes,
    carregarDados
  } = useContas()

  // Estados dos modais
  const [modalNovaContaAberto, setModalNovaContaAberto] = useState(false)
  const [tipoNovaConta, setTipoNovaConta] = useState('fixa')
  const [modalAnotacoesAberto, setModalAnotacoesAberto] = useState(false)
  const [contaSelecionada, setContaSelecionada] = useState(null)
  const [modalConfiguracoesAberto, setModalConfiguracoesAberto] = useState(false)

  // Gerar contas do mês se necessário
  useEffect(() => {
    if (!carregando && contasMes.length === 0 && (contasFixas.length > 0 || contasParceladas.length > 0)) {
      gerarContasMes()
    }
  }, [carregando, contasMes.length, contasFixas.length, contasParceladas.length, gerarContasMes])

  const handleNovaContaFixa = () => {
    setTipoNovaConta('fixa')
    setModalNovaContaAberto(true)
  }

  const handleNovaContaParcelada = () => {
    setTipoNovaConta('parcelada')
    setModalNovaContaAberto(true)
  }

  const handleSalvarNovaConta = async (dados) => {
    if (tipoNovaConta === 'fixa') {
      await adicionarContaFixa(dados)
    } else {
      await adicionarContaParcelada(dados)
    }
    // Recarregar dados para atualizar as contas do mês
    await carregarDados()
  }

  const handleAbrirAnotacoes = (conta) => {
    setContaSelecionada(conta)
    setModalAnotacoesAberto(true)
  }

  if (carregando) {
    return (
      <div className="min-h-screen bg-contabio-dark flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4 w-12 h-12" />
          <p className="text-contabio-text-muted">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-contabio-dark">
      <Header onAbrirConfiguracoes={() => setModalConfiguracoesAberto(true)} />

      <main className="max-w-7xl mx-auto px-4 py-6 pb-24 space-y-6">
        {/* Calendário de Meses */}
        <CalendarioMeses
          mesAtual={mesAtual}
          anoAtual={anoAtual}
          onMudarMes={mudarMes}
        />

        {/* Título do Mês */}
        <div className="text-center">
          <h2 className="text-2xl font-montserrat font-bold text-white">
            {nomeMes(mesAtual)} {anoAtual}
          </h2>
        </div>

        {/* Totalizador */}
        <Totalizador
          saldoInicial={saldoInicial}
          saldoAtual={saldoAtual}
          totalPagar={totalPagar}
          totalPago={totalPago}
          progresso={progresso}
          todasPagas={todasPagas}
        />

        {/* Lista de Contas */}
        <ListaContas
          contasMes={contasMes}
          onMarcarPago={marcarComoPago}
          onAtualizarOrdem={atualizarOrdem}
          onAbrirAnotacoes={handleAbrirAnotacoes}
          todasPagas={todasPagas}
        />
      </main>

      {/* Botões de Ação */}
      <BotoesAcao
        onNovaContaFixa={handleNovaContaFixa}
        onNovaContaParcelada={handleNovaContaParcelada}
      />

      {/* Modal Nova Conta */}
      <ModalNovaConta
        aberto={modalNovaContaAberto}
        onFechar={() => setModalNovaContaAberto(false)}
        onSalvar={handleSalvarNovaConta}
        tipo={tipoNovaConta}
      />

      {/* Modal Anotações */}
      <ModalAnotacoes
        aberto={modalAnotacoesAberto}
        onFechar={() => {
          setModalAnotacoesAberto(false)
          setContaSelecionada(null)
        }}
        conta={contaSelecionada}
        onSalvar={atualizarAnotacoes}
      />

      {/* Modal Configurações */}
      <ModalConfiguracoes
        aberto={modalConfiguracoesAberto}
        onFechar={() => setModalConfiguracoesAberto(false)}
        configuracoes={configuracoes}
        onSalvar={salvarConfiguracoes}
      />
    </div>
  )
}
