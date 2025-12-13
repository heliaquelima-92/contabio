import { createContext, useContext, useEffect, useState } from 'react'
import { auth } from '../lib/supabase'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    // Verificar usuário atual
    const verificarUsuario = async () => {
      try {
        const user = await auth.obterUsuario()
        setUsuario(user)
      } catch (error) {
        console.error('Erro ao verificar usuário:', error)
      } finally {
        setCarregando(false)
      }
    }

    verificarUsuario()

    // Escutar mudanças de autenticação
    const { data: { subscription } } = auth.onAuthStateChange((event, session) => {
      setUsuario(session?.user ?? null)
      setCarregando(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const entrar = async (email, senha) => {
    const data = await auth.entrar(email, senha)
    setUsuario(data.user)
    return data
  }

  const registrar = async (email, senha, nome) => {
    const data = await auth.registrar(email, senha, nome)
    return data
  }

  const sair = async () => {
    await auth.sair()
    setUsuario(null)
  }

  const value = {
    usuario,
    carregando,
    entrar,
    registrar,
    sair,
    estaLogado: !!usuario
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider')
  }
  return context
}
