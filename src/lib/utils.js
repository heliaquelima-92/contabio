// Utilitários do Moncash

// Formata valor para moeda brasileira
export function formatarMoeda(valor) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor || 0)
}

// Formata valor curto (sem centavos se inteiro)
export function formatarMoedaCurto(valor) {
  if (valor >= 1000) {
    return `R$ ${(valor / 1000).toFixed(1).replace('.', ',')}k`
  }
  return formatarMoeda(valor)
}

// Formata data para exibição
export function formatarData(data) {
  if (!data) return ''
  const d = new Date(data)
  return d.toLocaleDateString('pt-BR')
}

// Formata data completa
export function formatarDataCompleta(data) {
  if (!data) return ''
  const d = new Date(data)
  return d.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  })
}

// Retorna nome do mês
export function nomeMes(mes) {
  const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril',
    'Maio', 'Junho', 'Julho', 'Agosto',
    'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ]
  return meses[mes - 1] || ''
}

// Retorna abreviação do mês
export function mesCurto(mes) {
  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
  return meses[mes - 1] || ''
}

// Obtém mês e ano atuais
export function obterMesAnoAtual() {
  const agora = new Date()
  return {
    mes: agora.getMonth() + 1,
    ano: agora.getFullYear(),
    dia: agora.getDate()
  }
}

// Calcula período baseado no dia de referência
export function calcularPeriodo(diaReferencia) {
  const hoje = new Date()
  const diaAtual = hoje.getDate()
  const mesAtual = hoje.getMonth() + 1
  const anoAtual = hoje.getFullYear()
  
  let mesInicio, anoInicio, mesFim, anoFim
  
  if (diaAtual >= diaReferencia) {
    // Estamos no período atual
    mesInicio = mesAtual
    anoInicio = anoAtual
    mesFim = mesAtual === 12 ? 1 : mesAtual + 1
    anoFim = mesAtual === 12 ? anoAtual + 1 : anoAtual
  } else {
    // Estamos no período anterior
    mesInicio = mesAtual === 1 ? 12 : mesAtual - 1
    anoInicio = mesAtual === 1 ? anoAtual - 1 : anoAtual
    mesFim = mesAtual
    anoFim = anoAtual
  }
  
  const dataInicio = `${anoInicio}-${String(mesInicio).padStart(2, '0')}-${String(diaReferencia).padStart(2, '0')}`
  const dataFim = `${anoFim}-${String(mesFim).padStart(2, '0')}-${String(diaReferencia - 1).padStart(2, '0')}`
  
  return { dataInicio, dataFim, mesInicio, anoInicio }
}

// Calcula porcentagem
export function calcularPorcentagem(parcial, total) {
  if (!total || total === 0) return 0
  return Math.min(Math.round((parcial / total) * 100), 100)
}

// Valida email
export function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

// Valida senha
export function validarSenha(senha) {
  return senha && senha.length >= 6
}

// Gera confetes
export function gerarConfetes() {
  const cores = ['#D5FF40', '#4ade80', '#fbbf24', '#f87171', '#a855f7', '#3b82f6']
  const container = document.body
  
  for (let i = 0; i < 50; i++) {
    const confete = document.createElement('div')
    confete.className = 'confetti'
    confete.style.left = Math.random() * 100 + 'vw'
    confete.style.background = cores[Math.floor(Math.random() * cores.length)]
    confete.style.animationDelay = Math.random() * 2 + 's'
    confete.style.width = Math.random() * 10 + 5 + 'px'
    confete.style.height = Math.random() * 10 + 5 + 'px'
    confete.style.borderRadius = Math.random() > 0.5 ? '50%' : '0'
    container.appendChild(confete)
    
    setTimeout(() => confete.remove(), 5000)
  }
}

// Categorias de gastos
export const CATEGORIAS_GASTO = [
  { id: 'alimentacao', nome: 'Alimentação', icone: '🍔', cor: '#f97316' },
  { id: 'transporte', nome: 'Transporte', icone: '🚗', cor: '#3b82f6' },
  { id: 'mercado', nome: 'Mercado', icone: '🛒', cor: '#22c55e' },
  { id: 'lazer', nome: 'Lazer', icone: '🎮', cor: '#a855f7' },
  { id: 'saude', nome: 'Saúde', icone: '💊', cor: '#ef4444' },
  { id: 'educacao', nome: 'Educação', icone: '📚', cor: '#06b6d4' },
  { id: 'moradia', nome: 'Moradia', icone: '🏠', cor: '#eab308' },
  { id: 'vestuario', nome: 'Vestuário', icone: '👕', cor: '#ec4899' },
  { id: 'outros', nome: 'Outros', icone: '📦', cor: '#6b7280' }
]

// Obtém categoria por ID
export function obterCategoria(id) {
  return CATEGORIAS_GASTO.find(c => c.id === id) || CATEGORIAS_GASTO[CATEGORIAS_GASTO.length - 1]
}

// Mensagens motivacionais
export const MENSAGENS_PARABENS = [
  '🎉 Parabéns! Você pagou todas as contas!',
  '💪 Excelente! Finanças em dia!',
  '🌟 Incrível! Mais um mês organizado!',
  '🏆 Campeão! Todas quitadas!',
  '✨ Fantástico! Você está no controle!'
]

// Obtém saudação
export function obterSaudacao() {
  const hora = new Date().getHours()
  if (hora < 12) return 'Bom dia'
  if (hora < 18) return 'Boa tarde'
  return 'Boa noite'
}

// Debounce
export function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Gerar alertas inteligentes
export function gerarAlertas(dados) {
  const alertas = []
  const { contasMes, gastos, configuracoes, historicoMesAnterior } = dados
  
  // Alerta de conta que subiu muito
  if (historicoMesAnterior) {
    contasMes.forEach(conta => {
      const contaAnterior = historicoMesAnterior.contas?.find(c => c.nome === conta.nome)
      if (contaAnterior && conta.valor > contaAnterior.valor * 1.3) {
        const aumento = Math.round(((conta.valor - contaAnterior.valor) / contaAnterior.valor) * 100)
        alertas.push({
          tipo: 'warning',
          icone: '⚠️',
          mensagem: `${conta.nome} subiu ${aumento}% esse mês`
        })
      }
    })
  }
  
  // Alerta de gastos avulsos altos
  const totalGastos = gastos.reduce((acc, g) => acc + g.valor, 0)
  const saldo = configuracoes?.saldo_mensal || 5500
  if (totalGastos > saldo * 0.4) {
    alertas.push({
      tipo: 'warning',
      icone: '💸',
      mensagem: `Gastos avulsos já em ${calcularPorcentagem(totalGastos, saldo)}% do salário`
    })
  }
  
  // Alerta de muitas idas ao mercado
  const idasMercado = gastos.filter(g => g.categoria === 'mercado').length
  if (idasMercado > 8) {
    alertas.push({
      tipo: 'info',
      icone: '🛒',
      mensagem: `${idasMercado} idas ao mercado. Considere compra mensal`
    })
  }
  
  // Todas as contas pagas
  const todasPagas = contasMes.length > 0 && contasMes.every(c => c.pago)
  if (todasPagas) {
    alertas.push({
      tipo: 'success',
      icone: '🎉',
      mensagem: 'Todas as contas pagas!'
    })
  }
  
  return alertas
}
