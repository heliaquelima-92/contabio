import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useDados } from '../hooks/useDados'
import CalendarioMeses from '../components/CalendarioMeses'
import Totalizador from '../components/Totalizador'
import Alertas from '../components/Alertas'
import BotaoInformarGasto from '../components/BotaoInformarGasto'
import ListaContas from '../components/ListaContas'
import ModalNovoGasto from '../components/ModalNovoGasto'
import { nomeMes, gerarAlertas } from '../lib/utils'

export default function Home() {
  const {
    contasMes,
    gastos,
    configuracoes,
    mesAtual,
    anoAtual,
    saldoInicial,
    saldoAtual,
    totalPago,
    totalPendente,
    totalGastos,
    progresso,
    todasPagas,
    mudarMes,
    marcarComoPago,
    adicionarGasto,
    gerarContasMes
  } = useDados()

  const [modalGastoAberto, setModalGastoAberto] = useState(false)
  const [modalDetalheAberto, setModalDetalheAberto] = useState(false)
  const [contaSelecionada, setContaSelecionada] = useState(null)

  // Gerar contas do mês se necessário
  useEffect(() => {
    if (contasMes.length === 0 && configuracoes) {
      gerarContasMes()
    }
  }, [mesAtual, anoAtual, configuracoes])

  // Gerar alertas
  const alertas = gerarAlertas({ contasMes, gastos, configuracoes })

  const handleAbrirDetalhes = (conta) => {
    setContaSelecionada(conta)
    setModalDetalheAberto(true)
  }

  return (
    <div className="space-y-5 pb-4">
      {/* Calendário */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <CalendarioMeses
          mesAtual={mesAtual}
          anoAtual={anoAtual}
          onMudarMes={mudarMes}
        />
      </motion.div>

      {/* Título do mês */}
      <div className="text-center px-4">
        <h1 className="text-2xl font-bold text-white">
          {nomeMes(mesAtual)}
        </h1>
        {configuracoes && (
          <p className="text-xs text-moncash-text-muted mt-1">
            Dia de referência: {configuracoes.dia_referencia}
          </p>
        )}
      </div>

      {/* Totalizador */}
      <Totalizador
        saldoInicial={saldoInicial}
        saldoAtual={saldoAtual}
        totalPago={totalPago}
        totalPendente={totalPendente}
        totalGastos={totalGastos}
        progresso={progresso}
        todasPagas={todasPagas}
      />

      {/* Alertas */}
      <Alertas alertas={alertas} />

      {/* Botão Informar Gasto */}
      <BotaoInformarGasto onClick={() => setModalGastoAberto(true)} />

      {/* Lista de Contas */}
      <ListaContas
        contasMes={contasMes}
        onMarcarPago={marcarComoPago}
        onAbrirDetalhes={handleAbrirDetalhes}
        todasPagas={todasPagas}
      />

      {/* Modal Novo Gasto */}
      <ModalNovoGasto
        aberto={modalGastoAberto}
        onFechar={() => setModalGastoAberto(false)}
        onSalvar={adicionarGasto}
      />
    </div>
  )
}
