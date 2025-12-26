// Sistema de Sons do Moncash

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

  tocar(tipo) {
    if (!this.habilitado) return
    
    try {
      this.init()
      
      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(this.audioContext.destination)
      
      const now = this.audioContext.currentTime
      
      switch (tipo) {
        case 'moeda':
          oscillator.type = 'sine'
          oscillator.frequency.setValueAtTime(1200, now)
          oscillator.frequency.exponentialRampToValueAtTime(800, now + 0.1)
          oscillator.frequency.exponentialRampToValueAtTime(1000, now + 0.15)
          gainNode.gain.setValueAtTime(0.12, now)
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2)
          oscillator.start(now)
          oscillator.stop(now + 0.2)
          break
          
        case 'sucesso':
          oscillator.type = 'sine'
          oscillator.frequency.setValueAtTime(523, now)
          oscillator.frequency.setValueAtTime(659, now + 0.1)
          oscillator.frequency.setValueAtTime(784, now + 0.2)
          gainNode.gain.setValueAtTime(0.1, now)
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4)
          oscillator.start(now)
          oscillator.stop(now + 0.4)
          break
          
        case 'clique':
          oscillator.type = 'sine'
          oscillator.frequency.setValueAtTime(800, now)
          gainNode.gain.setValueAtTime(0.06, now)
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.04)
          oscillator.start(now)
          oscillator.stop(now + 0.04)
          break
          
        case 'erro':
          oscillator.type = 'sine'
          oscillator.frequency.setValueAtTime(200, now)
          oscillator.frequency.setValueAtTime(150, now + 0.1)
          gainNode.gain.setValueAtTime(0.08, now)
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15)
          oscillator.start(now)
          oscillator.stop(now + 0.15)
          break
          
        case 'notificacao':
          oscillator.type = 'sine'
          oscillator.frequency.setValueAtTime(880, now)
          oscillator.frequency.setValueAtTime(1100, now + 0.08)
          gainNode.gain.setValueAtTime(0.08, now)
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15)
          oscillator.start(now)
          oscillator.stop(now + 0.15)
          break
          
        default:
          break
      }
    } catch (e) {
      // Som não disponível
    }
  }

  alternar() {
    this.habilitado = !this.habilitado
    return this.habilitado
  }
}

export const som = new SomManager()
