import { useState, useEffect, useCallback, createContext, useContext } from 'react'
import { db } from '../lib/supabase'
import { useAuth } from './useAuth'
import { obterMesAnoAtual, calcularPeriodo } from '../lib/utils'

const DadosContext = createContext({})

export function DadosProvider({ children }) {
  const { usuario } = useAuth()
  const [carregando, setCarregando] = useState(true)
  
  // Estados principais
  const [configuracoes, setConfiguracoes] = useState(null)
  const [contasFixas, setContasFixas] = useState([])
  const [contasParceladas, setContasParceladas] = useState([])
  const [cartoes, setCartoes] = useState([])
  const [contasMes, setContasMes] = useState([])
  const [gastos, setGastos] = useState([])
  const [cofrinho, setCofrinho] = useState(null)
  const [cofrinhoHistorico, setCofrinhoHistorico] = useState([])
  
  // Período atual
  const { mes: mesHoje, ano: anoHoje } = obterMesAnoAtual()
  const [mesAtual, setMesAtual] = useState(mesHoje)
  const [anoAtual, setAnoAtual] = useState(anoHoje)

  // Carregar configurações
  const carregarConfiguracoes = useCallback(async () => {
    if (!usuario) return null
    try {
      let config = await db.obterConfiguracoes(usuario.id)
      if (!config) {
        config = await db.salvarConfiguracoes({
          usuario_id: usuario.id,
          saldo_mensal: 5500,
          dia_referencia: 10,
          sons_habilitados: true
        })
      }
      setConfiguracoes(config)
      return config
    } catch (error) {
      console.error('Erro ao carregar configurações:', error)
      return null
    }
  }, [usuario])

  // Carregar contas fixas
  const carregarContasFixas = useCallback(async () => {
    if (!usuario) return
    try {
      const data = await db.listarContasFixas(usuario.id)
      setContasFixas(data)
    } catch (error) {
      console.error('Erro ao carregar contas fixas:', error)
    }
  }, [usuario])

  // Carregar contas parceladas
  const carregarContasParceladas = useCallback(async () => {
    if (!usuario) return
    try {
      const data = await db.listarContasParceladas(usuario.id)
      setContasParceladas(data)
    } catch (error) {
      console.error('Erro ao carregar contas parceladas:', error)
    }
  }, [usuario])

  // Carregar cartões
  const carregarCartoes = useCallback(async () => {
    if (!usuario) return
    try {
      const data = await db.listarCartoes(usuario.id)
      setCartoes(data)
    } catch (error) {
      console.error('Erro ao carregar cartões:', error)
    }
  }, [usuario])

  // Carregar contas do mês
  const carregarContasMes = useCallback(async () => {
    if (!usuario) return
    try {
      const data = await db.listarContasMes(usuario.id, mesAtual, anoAtual)
      setContasMes(data)
    } catch (error) {
      console.error('Erro ao carregar contas do mês:', error)
    }
  }, [usuario, mesAtual, anoAtual])

  // Carregar gastos
  const carregarGastos = useCallback(async () => {
    if (!usuario || !configuracoes) return
    try {
      const { dataInicio, dataFim } = calcularPeriodo(configuracoes.dia_referencia)
      const data = await db.listarGastos(usuario.id, dataInicio, dataFim)
      setGastos(data)
    } catch (error) {
      console.error('Erro ao carregar gastos:', error)
    }
  }, [usuario, configuracoes])

  // Carregar cofrinho
  const carregarCofrinho = useCallback(async () => {
    if (!usuario) return
    try {
      const data = await db.obterCofrinho(usuario.id)
      setCofrinho(data)
      const historico = await db.listarHistoricoCofrinho(usuario.id)
      setCofrinhoHistorico(historico)
    } catch (error) {
      console.error('Erro ao carregar cofrinho:', error)
    }
  }, [usuario])

  // Carregar todos os dados
  const carregarTudo = useCallback(async () => {
    if (!usuario) return
    setCarregando(true)
    try {
      const config = await carregarConfiguracoes()
      await Promise.all([
        carregarContasFixas(),
        carregarContasParceladas(),
        carregarCartoes(),
        carregarContasMes(),
        carregarCofrinho()
      ])
      if (config) {
        const { dataInicio, dataFim } = calcularPeriodo(config.dia_referencia)
        const gastosData = await db.listarGastos(usuario.id, dataInicio, dataFim)
        setGastos(gastosData)
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setCarregando(false)
    }
  }, [usuario, carregarConfiguracoes, carregarContasFixas, carregarContasParceladas, carregarCartoes, carregarContasMes, carregarCofrinho])

  useEffect(() => {
    if (usuario) {
      carregarTudo()
    }
  }, [usuario])

  useEffect(() => {
    if (usuario && configuracoes) {
      carregarContasMes()
      carregarGastos()
    }
  }, [mesAtual, anoAtual])

  // === AÇÕES ===

  // Salvar configurações
  const salvarConfiguracoes = async (novasConfig) => {
    const config = await db.salvarConfiguracoes({
      ...configuracoes,
      ...novasConfig,
      usuario_id: usuario.id
    })
    setConfiguracoes(config)
    return config
  }

  // Contas Fixas
  const adicionarContaFixa = async (conta) => {
    const nova = await db.criarContaFixa({ ...conta, usuario_id: usuario.id })
    setContasFixas(prev => [...prev, nova])
    return nova
  }

  const atualizarContaFixa = async (id, dados) => {
    const atualizada = await db.atualizarContaFixa(id, dados)
    setContasFixas(prev => prev.map(c => c.id === id ? atualizada : c))
    return atualizada
  }

  const deletarContaFixa = async (id) => {
    await db.deletarContaFixa(id)
    setContasFixas(prev => prev.filter(c => c.id !== id))
  }

  // Contas Parceladas
  const adicionarContaParcelada = async (conta) => {
    const nova = await db.criarContaParcelada({ 
      ...conta, 
      usuario_id: usuario.id,
      arquivada: false 
    })
    setContasParceladas(prev => [...prev, nova])
    return nova
  }

  const atualizarContaParcelada = async (id, dados) => {
    const atualizada = await db.atualizarContaParcelada(id, dados)
    if (atualizada.arquivada) {
      setContasParceladas(prev => prev.filter(c => c.id !== id))
    } else {
      setContasParceladas(prev => prev.map(c => c.id === id ? atualizada : c))
    }
    return atualizada
  }

  const deletarContaParcelada = async (id) => {
    await db.deletarContaParcelada(id)
    setContasParceladas(prev => prev.filter(c => c.id !== id))
  }

  // Cartões
  const adicionarCartao = async (cartao) => {
    const novo = await db.criarCartao({ ...cartao, usuario_id: usuario.id })
    setCartoes(prev => [...prev, novo])
    return novo
  }

  const atualizarCartao = async (id, dados) => {
    const atualizado = await db.atualizarCartao(id, dados)
    setCartoes(prev => prev.map(c => c.id === id ? atualizado : c))
    return atualizado
  }

  const deletarCartao = async (id) => {
    await db.deletarCartao(id)
    setCartoes(prev => prev.filter(c => c.id !== id))
  }

  // Contas do Mês
  const adicionarContaMes = async (conta) => {
    const nova = await db.criarContaMes({
      ...conta,
      usuario_id: usuario.id,
      mes: mesAtual,
      ano: anoAtual
    })
    setContasMes(prev => [...prev, nova])
    return nova
  }

  const atualizarContaMes = async (id, dados) => {
    const atualizada = await db.atualizarContaMes(id, dados)
    setContasMes(prev => prev.map(c => c.id === id ? atualizada : c))
    return atualizada
  }

  const marcarComoPago = async (id, pago = true) => {
    const conta = contasMes.find(c => c.id === id)
    const atualizada = await db.atualizarContaMes(id, { pago })
    setContasMes(prev => prev.map(c => c.id === id ? atualizada : c))
    
    // Se for parcelada, atualizar parcelas restantes
    if (pago && conta?.tipo === 'parcelada' && conta.conta_parcelada_id) {
      const parcelada = contasParceladas.find(p => p.id === conta.conta_parcelada_id)
      if (parcelada) {
        const novasParcelas = parcelada.parcelas_restantes - 1
        await atualizarContaParcelada(parcelada.id, {
          parcelas_restantes: novasParcelas,
          arquivada: novasParcelas <= 0
        })
      }
    }
    
    return atualizada
  }

  // Gastos
  const adicionarGasto = async (gasto) => {
    const novo = await db.criarGasto({ ...gasto, usuario_id: usuario.id })
    setGastos(prev => [novo, ...prev])
    return novo
  }

  const deletarGasto = async (id) => {
    await db.deletarGasto(id)
    setGastos(prev => prev.filter(g => g.id !== id))
  }

  // Cofrinho
  const adicionarAoCofrinho = async (valor, descricao) => {
    const entrada = await db.adicionarAoCofrinho({
      usuario_id: usuario.id,
      valor,
      descricao,
      data: new Date().toISOString().split('T')[0]
    })
    setCofrinhoHistorico(prev => [entrada, ...prev])
    
    const novoTotal = (cofrinho?.total || 0) + valor
    const cofrinhoAtualizado = await db.salvarCofrinho({
      usuario_id: usuario.id,
      total: novoTotal,
      meta: cofrinho?.meta || 0
    })
    setCofrinho(cofrinhoAtualizado)
    
    return entrada
  }

  const atualizarMetaCofrinho = async (meta) => {
    const atualizado = await db.salvarCofrinho({
      usuario_id: usuario.id,
      total: cofrinho?.total || 0,
      meta
    })
    setCofrinho(atualizado)
    return atualizado
  }

  // Mudar mês
  const mudarMes = (novoMes, novoAno) => {
    setMesAtual(novoMes)
    setAnoAtual(novoAno)
  }

  // Gerar contas do mês
  const gerarContasMes = async () => {
    if (contasMes.length > 0) return
    
    const novasContas = []
    
    // Contas fixas
    for (const fixa of contasFixas) {
      novasContas.push({
        usuario_id: usuario.id,
        mes: mesAtual,
        ano: anoAtual,
        nome: fixa.nome,
        valor: fixa.valor_fixo ? fixa.valor : null,
        vencimento: fixa.vencimento,
        tipo: 'fixa',
        conta_fixa_id: fixa.id,
        pago: false,
        anotacoes: fixa.anotacoes,
        ordem: novasContas.length
      })
    }
    
    // Parcelas
    for (const parcelada of contasParceladas) {
      if (parcelada.parcelas_restantes > 0) {
        const parcelaAtual = parcelada.parcelas_totais - parcelada.parcelas_restantes + 1
        novasContas.push({
          usuario_id: usuario.id,
          mes: mesAtual,
          ano: anoAtual,
          nome: `${parcelada.nome} (${parcelaAtual}/${parcelada.parcelas_totais})`,
          valor: parcelada.valor_parcela,
          vencimento: parcelada.vencimento,
          tipo: 'parcelada',
          conta_parcelada_id: parcelada.id,
          pago: false,
          anotacoes: parcelada.anotacoes,
          ordem: novasContas.length
        })
      }
    }
    
    for (const conta of novasContas) {
      await db.criarContaMes(conta)
    }
    
    await carregarContasMes()
  }

  // Calcular totais
  const calcularTotais = () => {
    const saldoInicial = configuracoes?.saldo_mensal || 5500
    const totalContas = contasMes.reduce((acc, c) => acc + (c.valor || 0), 0)
    const totalPago = contasMes.filter(c => c.pago).reduce((acc, c) => acc + (c.valor || 0), 0)
    const totalPendente = contasMes.filter(c => !c.pago).reduce((acc, c) => acc + (c.valor || 0), 0)
    const totalGastos = gastos.reduce((acc, g) => acc + g.valor, 0)
    const saldoAtual = saldoInicial - totalPago - totalGastos
    const progresso = contasMes.length > 0 
      ? Math.round((contasMes.filter(c => c.pago).length / contasMes.length) * 100)
      : 0
    
    return {
      saldoInicial,
      saldoAtual,
      totalContas,
      totalPago,
      totalPendente,
      totalGastos,
      progresso,
      todasPagas: contasMes.length > 0 && contasMes.every(c => c.pago)
    }
  }

  const value = {
    // Estado
    carregando,
    configuracoes,
    contasFixas,
    contasParceladas,
    cartoes,
    contasMes,
    gastos,
    cofrinho,
    cofrinhoHistorico,
    mesAtual,
    anoAtual,
    
    // Ações
    salvarConfiguracoes,
    adicionarContaFixa,
    atualizarContaFixa,
    deletarContaFixa,
    adicionarContaParcelada,
    atualizarContaParcelada,
    deletarContaParcelada,
    adicionarCartao,
    atualizarCartao,
    deletarCartao,
    adicionarContaMes,
    atualizarContaMes,
    marcarComoPago,
    adicionarGasto,
    deletarGasto,
    adicionarAoCofrinho,
    atualizarMetaCofrinho,
    mudarMes,
    gerarContasMes,
    carregarTudo,
    
    // Calculados
    ...calcularTotais()
  }

  return (
    <DadosContext.Provider value={value}>
      {children}
    </DadosContext.Provider>
  )
}

export function useDados() {
  const context = useContext(DadosContext)
  if (!context) {
    throw new Error('useDados deve ser usado dentro de DadosProvider')
  }
  return context
}
