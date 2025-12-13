import { useState, useEffect, useCallback } from 'react'
import { db } from '../lib/supabase'
import { useAuth } from './useAuth'
import { obterMesAnoAtual } from '../lib/utils'

export function useContas() {
  const { usuario } = useAuth()
  const [contasMes, setContasMes] = useState([])
  const [contasFixas, setContasFixas] = useState([])
  const [contasParceladas, setContasParceladas] = useState([])
  const [configuracoes, setConfiguracoes] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [mesAtual, setMesAtual] = useState(obterMesAnoAtual().mes)
  const [anoAtual, setAnoAtual] = useState(obterMesAnoAtual().ano)

  // Carregar configurações do usuário
  const carregarConfiguracoes = useCallback(async () => {
    if (!usuario) return
    try {
      const config = await db.obterConfiguracoes(usuario.id)
      if (config) {
        setConfiguracoes(config)
      } else {
        // Criar configurações padrão
        const configPadrao = {
          usuario_id: usuario.id,
          saldo_mensal: 5500,
          sons_habilitados: true
        }
        const novaConfig = await db.salvarConfiguracoes(configPadrao)
        setConfiguracoes(novaConfig)
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error)
    }
  }, [usuario])

  // Carregar contas fixas
  const carregarContasFixas = useCallback(async () => {
    if (!usuario) return
    try {
      const contas = await db.listarContasFixas(usuario.id)
      setContasFixas(contas || [])
    } catch (error) {
      console.error('Erro ao carregar contas fixas:', error)
    }
  }, [usuario])

  // Carregar contas parceladas
  const carregarContasParceladas = useCallback(async () => {
    if (!usuario) return
    try {
      const contas = await db.listarContasParceladas(usuario.id)
      setContasParceladas(contas || [])
    } catch (error) {
      console.error('Erro ao carregar contas parceladas:', error)
    }
  }, [usuario])

  // Carregar contas do mês
  const carregarContasMes = useCallback(async () => {
    if (!usuario) return
    try {
      const contas = await db.listarContasMes(usuario.id, mesAtual, anoAtual)
      setContasMes(contas || [])
    } catch (error) {
      console.error('Erro ao carregar contas do mês:', error)
    }
  }, [usuario, mesAtual, anoAtual])

  // Gerar contas do mês a partir das fixas e parceladas
  const gerarContasMes = useCallback(async () => {
    if (!usuario || contasMes.length > 0) return

    try {
      const novasContas = []

      // Adicionar contas fixas
      for (const fixa of contasFixas) {
        novasContas.push({
          usuario_id: usuario.id,
          mes: mesAtual,
          ano: anoAtual,
          nome: fixa.nome,
          valor: fixa.valor,
          vencimento: fixa.vencimento,
          tipo: 'fixa',
          conta_fixa_id: fixa.id,
          pago: false,
          anotacoes: fixa.anotacoes,
          ordem: novasContas.length
        })
      }

      // Adicionar parcelas do mês
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

      // Salvar todas as contas
      for (const conta of novasContas) {
        await db.criarContaMes(conta)
      }

      await carregarContasMes()
    } catch (error) {
      console.error('Erro ao gerar contas do mês:', error)
    }
  }, [usuario, mesAtual, anoAtual, contasFixas, contasParceladas, contasMes.length, carregarContasMes])

  // Carregar todos os dados
  const carregarDados = useCallback(async () => {
    setCarregando(true)
    await carregarConfiguracoes()
    await carregarContasFixas()
    await carregarContasParceladas()
    await carregarContasMes()
    setCarregando(false)
  }, [carregarConfiguracoes, carregarContasFixas, carregarContasParceladas, carregarContasMes])

  useEffect(() => {
    if (usuario) {
      carregarDados()
    }
  }, [usuario, carregarDados])

  // Adicionar conta fixa
  const adicionarContaFixa = async (conta) => {
    const novaConta = await db.criarContaFixa({
      ...conta,
      usuario_id: usuario.id
    })
    setContasFixas(prev => [...prev, novaConta])
    return novaConta
  }

  // Atualizar conta fixa
  const atualizarContaFixa = async (id, atualizacoes) => {
    const contaAtualizada = await db.atualizarContaFixa(id, atualizacoes)
    setContasFixas(prev => prev.map(c => c.id === id ? contaAtualizada : c))
    return contaAtualizada
  }

  // Deletar conta fixa
  const deletarContaFixa = async (id) => {
    await db.deletarContaFixa(id)
    setContasFixas(prev => prev.filter(c => c.id !== id))
  }

  // Adicionar conta parcelada
  const adicionarContaParcelada = async (conta) => {
    const novaConta = await db.criarContaParcelada({
      ...conta,
      usuario_id: usuario.id,
      arquivada: false
    })
    setContasParceladas(prev => [...prev, novaConta])
    return novaConta
  }

  // Marcar conta do mês como paga
  const marcarComoPago = async (id, pago = true) => {
    const contaAtualizada = await db.atualizarContaMes(id, { pago })
    setContasMes(prev => prev.map(c => c.id === id ? contaAtualizada : c))

    // Se for parcelada e foi paga, atualizar parcelas restantes
    const conta = contasMes.find(c => c.id === id)
    if (conta?.tipo === 'parcelada' && conta.conta_parcelada_id && pago) {
      const parcelada = contasParceladas.find(p => p.id === conta.conta_parcelada_id)
      if (parcelada) {
        const novasParcelas = parcelada.parcelas_restantes - 1
        await db.atualizarContaParcelada(parcelada.id, {
          parcelas_restantes: novasParcelas,
          arquivada: novasParcelas <= 0
        })
        if (novasParcelas <= 0) {
          setContasParceladas(prev => prev.filter(p => p.id !== parcelada.id))
        } else {
          setContasParceladas(prev => prev.map(p => 
            p.id === parcelada.id ? { ...p, parcelas_restantes: novasParcelas } : p
          ))
        }
      }
    }

    return contaAtualizada
  }

  // Atualizar ordem das contas (drag and drop)
  const atualizarOrdem = async (contasReordenadas) => {
    setContasMes(contasReordenadas)
    for (let i = 0; i < contasReordenadas.length; i++) {
      await db.atualizarContaMes(contasReordenadas[i].id, { ordem: i })
    }
  }

  // Atualizar anotações de uma conta do mês
  const atualizarAnotacoes = async (id, anotacoes) => {
    const contaAtualizada = await db.atualizarContaMes(id, { anotacoes })
    setContasMes(prev => prev.map(c => c.id === id ? contaAtualizada : c))

    // Se for conta fixa, atualizar também a conta fixa original
    const conta = contasMes.find(c => c.id === id)
    if (conta?.tipo === 'fixa' && conta.conta_fixa_id) {
      await db.atualizarContaFixa(conta.conta_fixa_id, { anotacoes })
      setContasFixas(prev => prev.map(c => 
        c.id === conta.conta_fixa_id ? { ...c, anotacoes } : c
      ))
    }

    return contaAtualizada
  }

  // Mudar mês
  const mudarMes = (novoMes, novoAno) => {
    setMesAtual(novoMes)
    setAnoAtual(novoAno)
  }

  // Calcular totais
  const calcularTotais = () => {
    const saldoInicial = configuracoes?.saldo_mensal || 5500
    const totalPagar = contasMes.filter(c => !c.pago).reduce((acc, c) => acc + (c.valor || 0), 0)
    const totalPago = contasMes.filter(c => c.pago).reduce((acc, c) => acc + (c.valor || 0), 0)
    const saldoAtual = saldoInicial - totalPago
    const progresso = contasMes.length > 0 
      ? Math.round((contasMes.filter(c => c.pago).length / contasMes.length) * 100)
      : 0

    return {
      saldoInicial,
      saldoAtual,
      totalPagar,
      totalPago,
      progresso,
      todasPagas: contasMes.length > 0 && contasMes.every(c => c.pago)
    }
  }

  // Salvar configurações
  const salvarConfiguracoes = async (novasConfigs) => {
    const configAtualizada = await db.salvarConfiguracoes({
      ...configuracoes,
      ...novasConfigs,
      usuario_id: usuario.id
    })
    setConfiguracoes(configAtualizada)
    return configAtualizada
  }

  return {
    // Estado
    contasMes,
    contasFixas,
    contasParceladas,
    configuracoes,
    carregando,
    mesAtual,
    anoAtual,
    
    // Ações
    adicionarContaFixa,
    atualizarContaFixa,
    deletarContaFixa,
    adicionarContaParcelada,
    marcarComoPago,
    atualizarOrdem,
    atualizarAnotacoes,
    mudarMes,
    gerarContasMes,
    salvarConfiguracoes,
    carregarDados,
    
    // Calculados
    ...calcularTotais()
  }
}
