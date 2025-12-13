import { AuthProvider, useAuth } from './hooks/useAuth'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

function AppContent() {
  const { usuario, carregando } = useAuth()

  if (carregando) {
    return (
      <div className="min-h-screen bg-contabio-dark flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-montserrat font-bold text-4xl text-white mb-4">CONTABIO</h1>
          <div className="loading-spinner mx-auto" />
        </div>
      </div>
    )
  }

  return usuario ? <Dashboard /> : <Login />
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
