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
import Sidebar from './components/Sidebar'
import ModalDoacao from './components/ModalDoacao'

function AppContent() {
  const { usuario, carregando } = useAuth()
  const [abaAtiva, setAbaAtiva] = useState('home')
  const [modalDoacaoAberto, setModalDoacaoAberto] = useState(false)

  useEffect(() => {
    if (usuario && !carregando) {
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
      case 'home': return <Home />
      case 'gastos': return <Gastos />
      case 'relatorios': return <Relatorios />
      case 'config': return <Configuracoes />
      default: return <Home />
    }
  }

  return (
    <DadosProvider>
      {/* Layout Desktop */}
      <div className="hidden md:flex min-h-screen bg-moncash-darker">
        <Sidebar abaAtiva={abaAtiva} onMudarAba={setAbaAtiva} />
        <div className="flex-1 flex flex-col min-h-screen">
          <Header desktop />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-6xl mx-auto">
              {renderPagina()}
            </div>
          </main>
        </div>
      </div>

      {/* Layout Mobile */}
      <div className="md:hidden min-h-screen bg-moncash-dark">
        <Header />
        <main className="pb-nav">
          {renderPagina()}
        </main>
        <BottomNav abaAtiva={abaAtiva} onMudarAba={setAbaAtiva} />
      </div>

      <ModalDoacao
        aberto={modalDoacaoAberto}
        onFechar={() => setModalDoacaoAberto(false)}
        linkPix="https://livepix.gg/moncash"
      />
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
