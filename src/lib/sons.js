// Sistema de sons do CONTABIO
// Sons sutis para feedback do usuário

class SomManager {
  constructor() {
    this.audioContext = null
    this.habilitado = true
  }

  init() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
    }
  }

  // Gera um som sintético
  tocar(tipo) {
    if (!this.habilitado) return
    
    try {
      this.init()
      
      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(this.audioContext.destination)
      
      const agora = this.audioContext.currentTime
      
      switch (tipo) {
        case 'moeda':
          // Som de moeda caindo (estilo PicPay)
          oscillator.type = 'sine'
          oscillator.frequency.setValueAtTime(1200, agora)
          oscillator.frequency.exponentialRampToValueAtTime(800, agora + 0.1)
          oscillator.frequency.exponentialRampToValueAtTime(1000, agora + 0.15)
          gainNode.gain.setValueAtTime(0.15, agora)
          gainNode.gain.exponentialRampToValueAtTime(0.01, agora + 0.2)
          oscillator.start(agora)
          oscillator.stop(agora + 0.2)
          break
          
        case 'sucesso':
          // Som de sucesso/parabéns
          oscillator.type = 'sine'
          oscillator.frequency.setValueAtTime(523.25, agora) // C5
          oscillator.frequency.setValueAtTime(659.25, agora + 0.1) // E5
          oscillator.frequency.setValueAtTime(783.99, agora + 0.2) // G5
          gainNode.gain.setValueAtTime(0.12, agora)
          gainNode.gain.exponentialRampToValueAtTime(0.01, agora + 0.4)
          oscillator.start(agora)
          oscillator.stop(agora + 0.4)
          break
          
        case 'clique':
          // Som de clique suave
          oscillator.type = 'sine'
          oscillator.frequency.setValueAtTime(600, agora)
          gainNode.gain.setValueAtTime(0.08, agora)
          gainNode.gain.exponentialRampToValueAtTime(0.01, agora + 0.05)
          oscillator.start(agora)
          oscillator.stop(agora + 0.05)
          break
          
        case 'soltar':
          // Som ao soltar card
          oscillator.type = 'sine'
          oscillator.frequency.setValueAtTime(400, agora)
          oscillator.frequency.exponentialRampToValueAtTime(300, agora + 0.08)
          gainNode.gain.setValueAtTime(0.06, agora)
          gainNode.gain.exponentialRampToValueAtTime(0.01, agora + 0.1)
          oscillator.start(agora)
          oscillator.stop(agora + 0.1)
          break
          
        case 'erro':
          // Som de erro suave
          oscillator.type = 'sine'
          oscillator.frequency.setValueAtTime(200, agora)
          oscillator.frequency.setValueAtTime(150, agora + 0.1)
          gainNode.gain.setValueAtTime(0.1, agora)
          gainNode.gain.exponentialRampToValueAtTime(0.01, agora + 0.15)
          oscillator.start(agora)
          oscillator.stop(agora + 0.15)
          break
          
        case 'notificacao':
          // Som de notificação
          oscillator.type = 'sine'
          oscillator.frequency.setValueAtTime(880, agora)
          oscillator.frequency.setValueAtTime(1100, agora + 0.1)
          gainNode.gain.setValueAtTime(0.1, agora)
          gainNode.gain.exponentialRampToValueAtTime(0.01, agora + 0.2)
          oscillator.start(agora)
          oscillator.stop(agora + 0.2)
          break
          
        default:
          break
      }
    } catch (e) {
      console.log('Som não disponível:', e)
    }
  }

  alternar() {
    this.habilitado = !this.habilitado
    return this.habilitado
  }

  estaHabilitado() {
    return this.habilitado
  }
}

export const som = new SomManager()
