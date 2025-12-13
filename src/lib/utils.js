// Utilitários de formatação e helpers

// Formata valor para moeda brasileira
export function formatarMoeda(valor) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor || 0)
}

// Formata data para exibição
export function formatarData(data) {
  if (!data) return ''
  const d = new Date(data)
  return d.toLocaleDateString('pt-BR')
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
  const meses = [
    'JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN',
    'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'
  ]
  return meses[mes - 1] || ''
}

// Obtém mês e ano atuais
export function obterMesAnoAtual() {
  const agora = new Date()
  return {
    mes: agora.getMonth() + 1,
    ano: agora.getFullYear()
  }
}

// Verifica se é dia de virada (dia 1)
export function ehDiaVirada() {
  return new Date().getDate() === 1
}

// Calcula porcentagem
export function calcularPorcentagem(parcial, total) {
  if (!total || total === 0) return 0
  return Math.round((parcial / total) * 100)
}

// Determina cor do status financeiro
export function corStatus(porcentagem) {
  if (porcentagem >= 70) return 'green'
  if (porcentagem >= 40) return 'yellow'
  return 'red'
}

// Gera ID único
export function gerarId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// Valida email
export function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

// Valida senha (mínimo 6 caracteres)
export function validarSenha(senha) {
  return senha && senha.length >= 6
}

// Debounce para otimização
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

// Gera confetes na tela
export function gerarConfetes() {
  const cores = ['#22c55e', '#3b82f6', '#eab308', '#ef4444', '#a855f7']
  const container = document.body
  
  for (let i = 0; i < 50; i++) {
    const confete = document.createElement('div')
    confete.className = 'confetti'
    confete.style.left = Math.random() * 100 + 'vw'
    confete.style.background = cores[Math.floor(Math.random() * cores.length)]
    confete.style.animationDelay = Math.random() * 2 + 's'
    confete.style.width = Math.random() * 10 + 5 + 'px'
    confete.style.height = Math.random() * 10 + 5 + 'px'
    container.appendChild(confete)
    
    setTimeout(() => {
      confete.remove()
    }, 5000)
  }
}

// Mensagens motivacionais
export const mensagensMotivacionais = [
  '🎉 Parabéns! Você pagou todas as contas deste mês!',
  '💪 Excelente! Suas finanças estão em dia!',
  '🌟 Incrível! Mais um mês organizado!',
  '🏆 Campeão! Todas as contas quitadas!',
  '✨ Fantástico! Você está no controle!'
]

// Mensagens de cobrança suave (estilo Duolingo)
export const mensagensCobranca = [
  {
    titulo: 'Você não guardou nada no mês passado 😢',
    subtitulo: 'O que aconteceu?',
    opcoes: [
      { texto: 'Mês difícil', valor: 'dificil' },
      { texto: 'Não sobrou', valor: 'nao_sobrou' },
      { texto: 'Vou melhorar', valor: 'melhorar' },
      { texto: 'Ignorar', valor: 'ignorar' }
    ]
  }
]

// Obtém saudação baseada na hora
export function obterSaudacao() {
  const hora = new Date().getHours()
  if (hora < 12) return 'Bom dia'
  if (hora < 18) return 'Boa tarde'
  return 'Boa noite'
}
