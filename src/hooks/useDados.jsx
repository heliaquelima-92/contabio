import { useState, useEffect, useCallback, createContext, useContext } from 'react'
import { db } from '../lib/supabase'
import { useAuth } from './useAuth'
import { obterMesAnoAtual } from '../lib/utils'

const DadosContext = createContext({})

export function DadosProvider({ children }) {
  const { usuario } = useAuth()
  const [carregando, setCarregando] = useState(true)
  
  const [configuracoes, setConfiguracoes] = useState(null)
  const [contasFixas, setContasFixas] = useState([])
  const [contasParceladas, setContasParceladas] = useState([])
  const [cartoes, setCartoes] = useState([])
  const [contasMes, setContasMes] = useState([])
  const [gastos, setGastos] = useState([])
  const [cofrinho, setCofrinho] = useState(null)
  const [cofrinhoHistorico, setCofrinhoHistorico] = useState([])
  
  const { mes: mesHoje, ano: anoHoje } = obterMesAnoAtual()
  const [mesAtual, setMesAtual] = useState(mesHoje)
  const [anoAtual, setAnoAtual] = useState(anoHoje)

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
      console.error('Erro:', error)
      return null
    }
  }, [usuario])

  const carregarContasFixas = useCallback(async () => {
    if (!usuario) return []
    try {
      const data = await db.listarContasFixas(usuario.id)
      // Filtrar apenas contas ativas (ativa !== false)
      const ativas = (data || []).filter(c => c.ativa !== false)
      setContasFixas(ativas)
      return ativas
    } catch (error) {
      console.error('Erro:', error)
      return []
    }
  }, [usuario])

  const carregarContasParceladas = useCallback(async () => {
    if (!usuario) return []
    try {
      const data = await db.listarContasParceladas(usuario.id)
      setContasParceladas(data || [])
      return data || []
    } catch (error) {
      console.error('Erro:', error)
      return []
    }
  }, [usuario])

  const carregarCartoes = useCallback(async () => {
    if (!usuario) return []
    try {
      const data = await db.listarCartoes(usuario.id)
      // Filtrar apenas cartões ativos (ativa !== false)
      const ativos = (data || []).filter(c => c.ativa !== false)
      setCartoes(ativos)
      return ativos
    } catch (error) {
      console.error('Erro:', error)
      return []
    }
  }, [usuario])

  const carregarContasMes = useCallback(async (mes, ano) => {
    if (!usuario) return []
    const m = mes || mesAtual
    const a = ano || anoAtual
    try {
      const data = await db.listarContasMes(usuario.id, m, a)
      setContasMes(data || [])
      return data || []
    } catch (error) {
      console.error('Erro:', error)
      return []
    }
  }, [usuario, mesAtual, anoAtual])

  const carregarGastos = useCallback(async () => {
    if (!usuario) return []
    try {
      const dataInicio = '2020-01-01'
      const dataFim = '2030-12-31'
      const gastosData = await db.listarGastos(usuario.id, dataInicio, dataFim)
      setGastos(gastosData || [])
      return gastosData || []
    } catch (error) {
      console.error('Erro:', error)
      return []
    }
  }, [usuario])

  const carregarCofrinho = useCallback(async () => {
    if (!usuario) return null
    try {
      let data = await db.obterCofrinho(usuario.id)
      if (!data) {
        data = await db.salvarCofrinho({ usuario_id: usuario.id, total: 0, meta: 0 })
      }
      setCofrinho(data)
      const historico = await db.listarHistoricoCofrinho(usuario.id)
      setCofrinhoHistorico(historico || [])
      return data
    } catch (error) {
      console.error('Erro:', error)
      return null
    }
  }, [usuario])

  const carregarTudo = useCallback(async () => {
    if (!usuario) return
    setCarregando(true)
    try {
      await carregarConfiguracoes()
      await carregarContasFixas()
      await carregarContasParceladas()
      await carregarCartoes()
      await carregarContasMes()
      await carregarGastos()
      await carregarCofrinho()
    } catch (error) {
      console.error('Erro:', error)
    } finally {
      setCarregando(false)
    }
  }, [usuario])

  useEffect(() => {
    if (usuario) carregarTudo()
  }, [usuario])

  useEffect(() => {
    if (usuario) carregarContasMes(mesAtual, anoAtual)
  }, [mesAtual, anoAtual, usuario])

  const salvarConfiguracoes = async (novasConfig) => {
    const config = await db.salvarConfiguracoes({ ...configuracoes, ...novasConfig, usuario_id: usuario.id })
    setConfiguracoes(config)
    return config
  }

  // ========== CONTAS FIXAS ==========
  const adicionarContaFixa = async (conta) => {
    // Criar na tabela de modelos
    const nova = await db.criarContaFixa({ ...conta, usuario_id: usuario.id })
    setContasFixas(prev => [...prev, nova])
    
    // TAMBÉM criar no mês atual automaticamente
    const contaMes = await db.criarContaMes({
      usuario_id: usuario.id,
      mes: mesAtual,
      ano: anoAtual,
      nome: nova.nome,
      valor: nova.valor_fixo ? nova.valor : null,
      vencimento: nova.vencimento || 10,
      tipo: 'fixa',
      conta_fixa_id: nova.id,
      pago: false,
      ordem: contasMes.length
    })
    setContasMes(prev => [...prev, contaMes])
    
    return nova
  }

  const atualizarContaFixa = async (id, dados) => {
    const atualizada = await db.atualizarContaFixa(id, dados)
    setContasFixas(prev => prev.map(c => c.id === id ? atualizada : c))
    return atualizada
  }

  const deletarContaFixa = async (id) => {
    // Em vez de deletar, apenas desativa a conta (preserva histórico)
    // A conta não vai mais aparecer nos meses futuros, mas o histórico fica
    const atualizada = await db.atualizarContaFixa(id, { ativa: false })
    setContasFixas(prev => prev.filter(c => c.id !== id))
    // NÃO remove do mês atual - apenas para de gerar nos próximos
  }

  // ========== CONTAS PARCELADAS ==========
  const adicionarContaParcelada = async (conta) => {
    const nova = await db.criarContaParcelada({ ...conta, usuario_id: usuario.id, arquivada: false })
    setContasParceladas(prev => [...prev, nova])
    
    // TAMBÉM criar no mês atual automaticamente
    const parcelaAtual = nova.parcelas_totais - nova.parcelas_restantes + 1
    const contaMes = await db.criarContaMes({
      usuario_id: usuario.id,
      mes: mesAtual,
      ano: anoAtual,
      nome: nova.nome + ' (' + parcelaAtual + '/' + nova.parcelas_totais + ')',
      valor: nova.valor_parcela,
      vencimento: nova.vencimento || 10,
      tipo: 'parcelada',
      conta_parcelada_id: nova.id,
      pago: false,
      ordem: contasMes.length
    })
    setContasMes(prev => [...prev, contaMes])
    
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
    setContasMes(prev => prev.filter(c => c.conta_parcelada_id !== id))
  }

  // ========== CARTÕES ==========
  const adicionarCartao = async (cartao) => {
    const novo = await db.criarCartao({ ...cartao, usuario_id: usuario.id })
    setCartoes(prev => [...prev, novo])
    
    // TAMBÉM criar fatura no mês atual automaticamente
    const contaMes = await db.criarContaMes({
      usuario_id: usuario.id,
      mes: mesAtual,
      ano: anoAtual,
      nome: 'Fatura ' + novo.nome,
      valor: null,
      vencimento: novo.vencimento || 10,
      tipo: 'cartao',
      cartao_id: novo.id,
      pago: false,
      ordem: contasMes.length
    })
    setContasMes(prev => [...prev, contaMes])
    
    return novo
  }

  const atualizarCartao = async (id, dados) => {
    const atualizado = await db.atualizarCartao(id, dados)
    setCartoes(prev => prev.map(c => c.id === id ? atualizado : c))
    return atualizado
  }

  const deletarCartao = async (id) => {
    // Em vez de deletar, apenas desativa o cartão (preserva histórico)
    const atualizado = await db.atualizarCartao(id, { ativa: false })
    setCartoes(prev => prev.filter(c => c.id !== id))
    // NÃO remove do mês atual - apenas para de gerar nos próximos
  }

  // ========== CONTAS DO MÊS ==========
  const adicionarContaMes = async (conta) => {
    const nova = await db.criarContaMes({ ...conta, usuario_id: usuario.id, mes: mesAtual, ano: anoAtual })
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
    
    if (pago && conta?.tipo === 'parcelada' && conta.conta_parcelada_id) {
      const parcelada = contasParceladas.find(p => p.id === conta.conta_parcelada_id)
      if (parcelada && parcelada.parcelas_restantes > 0) {
        const novasParcelas = parcelada.parcelas_restantes - 1
        await atualizarContaParcelada(parcelada.id, { parcelas_restantes: novasParcelas, arquivada: novasParcelas <= 0 })
      }
    }
    return atualizada
  }

  // ========== GASTOS ==========
  const adicionarGasto = async (gasto) => {
    const novo = await db.criarGasto({ ...gasto, usuario_id: usuario.id })
    setGastos(prev => [novo, ...prev])
    return novo
  }

  const deletarGasto = async (id) => {
    await db.deletarGasto(id)
    setGastos(prev => prev.filter(g => g.id !== id))
  }

  // ========== COFRINHO ==========
  const adicionarAoCofrinho = async (valor, descricao) => {
    const entrada = await db.adicionarAoCofrinho({ usuario_id: usuario.id, valor, descricao, data: new Date().toISOString().split('T')[0] })
    setCofrinhoHistorico(prev => [entrada, ...prev])
    const novoTotal = (cofrinho?.total || 0) + valor
    const cofrinhoAtualizado = await db.salvarCofrinho({ usuario_id: usuario.id, total: novoTotal, meta: cofrinho?.meta || 0 })
    setCofrinho(cofrinhoAtualizado)
    return entrada
  }

  const atualizarMetaCofrinho = async (meta) => {
    const atualizado = await db.salvarCofrinho({ usuario_id: usuario.id, total: cofrinho?.total || 0, meta, observacoes: cofrinho?.observacoes || '' })
    setCofrinho(atualizado)
    return atualizado
  }

  const atualizarObservacaoCofrinho = async (observacoes) => {
    const atualizado = await db.salvarCofrinho({ usuario_id: usuario.id, total: cofrinho?.total || 0, meta: cofrinho?.meta || 0, observacoes })
    setCofrinho(atualizado)
    return atualizado
  }

  // ========== NAVEGAÇÃO ==========
  const mudarMes = async (novoMes, novoAno) => {
    setMesAtual(novoMes)
    setAnoAtual(novoAno)
    
    // Carregar contas do novo mês
    const contasExistentes = await db.listarContasMes(usuario.id, novoMes, novoAno)
    
    if (contasExistentes && contasExistentes.length > 0) {
      // Já existem contas nesse mês, apenas carregar
      setContasMes(contasExistentes)
    } else {
      // Não existem contas, gerar novas
      await gerarContasParaMes(novoMes, novoAno)
    }
  }

  // Gerar contas para um mês específico
  const gerarContasParaMes = async (mes, ano) => {
    // Buscar dados ATUALIZADOS do banco (não do state)
    const contasFixasAtuais = await db.listarContasFixas(usuario.id)
    const contasParceladasAtuais = await db.listarContasParceladas(usuario.id)
    const cartoesAtuais = await db.listarCartoes(usuario.id)
    
    const novasContas = []
    
    // Contas fixas - apenas as ATIVAS
    for (const fixa of (contasFixasAtuais || [])) {
      if (fixa.ativa !== false) {
        novasContas.push({
          usuario_id: usuario.id, mes, ano,
          nome: fixa.nome, valor: fixa.valor_fixo ? fixa.valor : null,
          vencimento: fixa.vencimento || 10, tipo: 'fixa',
          conta_fixa_id: fixa.id, pago: false, ordem: novasContas.length
        })
      }
    }
    
    // Parceladas - apenas as que têm parcelas restantes
    for (const parcelada of (contasParceladasAtuais || [])) {
      if (parcelada.parcelas_restantes > 0 && !parcelada.arquivada) {
        // Calcular qual parcela é: total - restantes + 1
        const parcelaAtual = parcelada.parcelas_totais - parcelada.parcelas_restantes + 1
        novasContas.push({
          usuario_id: usuario.id, mes, ano,
          nome: parcelada.nome + ' (' + parcelaAtual + '/' + parcelada.parcelas_totais + ')',
          valor: parcelada.valor_parcela, vencimento: parcelada.vencimento || 10,
          tipo: 'parcelada', conta_parcelada_id: parcelada.id, pago: false, ordem: novasContas.length
        })
      }
    }
    
    // Cartões - apenas os ATIVOS
    for (const cartao of (cartoesAtuais || [])) {
      if (cartao.ativa !== false) {
        novasContas.push({
          usuario_id: usuario.id, mes, ano,
          nome: 'Fatura ' + cartao.nome, valor: null,
          vencimento: cartao.vencimento || 10, tipo: 'cartao',
          cartao_id: cartao.id, pago: false, ordem: novasContas.length
        })
      }
    }
    
    // Criar as contas no banco
    for (const conta of novasContas) {
      try {
        await db.criarContaMes(conta)
      } catch (error) {
        console.error('Erro ao criar conta do mês:', error)
      }
    }
    
    // Recarregar contas do mês
    const contasCriadas = await db.listarContasMes(usuario.id, mes, ano)
    setContasMes(contasCriadas || [])
    
    // Atualizar states com dados frescos
    setContasFixas((contasFixasAtuais || []).filter(c => c.ativa !== false))
    setContasParceladas(contasParceladasAtuais || [])
    setCartoes((cartoesAtuais || []).filter(c => c.ativa !== false))
  }

  // Gerar contas do mês atual (usado no carregamento inicial)
  const gerarContasMes = async () => {
    const contasExistentes = await db.listarContasMes(usuario.id, mesAtual, anoAtual)
    if (contasExistentes && contasExistentes.length > 0) {
      setContasMes(contasExistentes)
      return
    }
    
    await gerarContasParaMes(mesAtual, anoAtual)
  }

  // ========== CÁLCULOS ==========
  const calcularTotais = () => {
    const saldoInicial = configuracoes?.saldo_mensal || 5500
    const totalPago = contasMes.filter(c => c.pago).reduce((acc, c) => acc + (c.valor || 0), 0)
    const totalPendente = contasMes.filter(c => !c.pago).reduce((acc, c) => acc + (c.valor || 0), 0)
    const gastosDoMes = gastos.filter(g => {
      const d = new Date(g.data)
      return d.getMonth() + 1 === mesAtual && d.getFullYear() === anoAtual
    })
    const totalGastos = gastosDoMes.reduce((acc, g) => acc + g.valor, 0)
    const saldoAtual = saldoInicial - totalPago - totalGastos
    const progresso = contasMes.length > 0 ? Math.round((contasMes.filter(c => c.pago).length / contasMes.length) * 100) : 0
    
    return { saldoInicial, saldoAtual, totalPago, totalPendente, totalGastos, progresso, todasPagas: contasMes.length > 0 && contasMes.every(c => c.pago) }
  }

  const value = {
    carregando, configuracoes, contasFixas, contasParceladas, cartoes, contasMes, gastos, cofrinho, cofrinhoHistorico, mesAtual, anoAtual,
    salvarConfiguracoes, adicionarContaFixa, atualizarContaFixa, deletarContaFixa,
    adicionarContaParcelada, atualizarContaParcelada, deletarContaParcelada,
    adicionarCartao, atualizarCartao, deletarCartao,
    adicionarContaMes, atualizarContaMes, marcarComoPago,
    adicionarGasto, deletarGasto, adicionarAoCofrinho, atualizarMetaCofrinho, atualizarObservacaoCofrinho,
    mudarMes, gerarContasMes, carregarTudo, ...calcularTotais()
  }

  return <DadosContext.Provider value={value}>{children}</DadosContext.Provider>
}

export function useDados() {
  const context = useContext(DadosContext)
  if (!context) throw new Error('useDados deve ser usado dentro de DadosProvider')
  return context
}
