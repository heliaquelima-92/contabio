import { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from './hooks/useAuth'
import { DadosProvider } from './hooks/useDados'
import Login from './pages/Login'
import Home from './pages/Home'
import Gastos from './pages/Gastos'
import Relatorios from './pages/Relatorios'
import Configuracoes from './pages/Configuracoes'
import Header from './components/Header'
import BottomNav from './components/BottomNav'
import ModalDoacao from './components/ModalDoacao'

function AppContent() {
  const { usuario, carregando } = useAuth()
  const [abaAtiva, setAbaAtiva] = useState('home')
  const [modalDoacaoAberto, setModalDoacaoAberto] = useState(false)

  // Mostrar modal de doação ao entrar
  useEffect(() => {
    if (usuario && !carregando) {
      // Pequeno delay para melhor UX
      const timer = setTimeout(() => {
        setModalDoacaoAberto(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [usuario, carregando])

  if (carregando) {
    return (
      <div className="min-h-screen bg-moncash-dark flex items-center justify-center">
        <div className="text-center">
          <img src="https://i.imgur.com/igiIEnb.png" alt="Moncash" className="h-10 mx-auto mb-4" />
          <div className="w-8 h-8 border-2 border-moncash-lime/30 border-t-moncash-lime rounded-full animate-spin mx-auto" />
        </div>
      </div>
    )
  }

  if (!usuario) {
    return <Login />
  }

  const renderPagina = () => {
    switch (abaAtiva) {
      case 'home':
        return <Home />
      case 'gastos':
        return <Gastos />
      case 'relatorios':
        return <Relatorios />
      case 'config':
        return <Configuracoes />
      default:
        return <Home />
    }
  }

  return (
    <DadosProvider>
      <div className="min-h-screen bg-moncash-dark">
        <Header />
        
        <main className="pb-nav">
          {renderPagina()}
        </main>
        
        <BottomNav abaAtiva={abaAtiva} onMudarAba={setAbaAtiva} />
        
        {/* Modal de Doação - aparece sempre */}
        <ModalDoacao
          aberto={modalDoacaoAberto}
          onFechar={() => setModalDoacaoAberto(false)}
          linkPix="https://livepix.gg/moncash"
        />
      </div>
    </DadosProvider>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
