import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { validarEmail, validarSenha } from '../lib/utils'
import { som } from '../lib/sons'

export default function Login() {
  const { entrar, registrar } = useAuth()
  const [modo, setModo] = useState('login') // 'login' ou 'registro'
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [nome, setNome] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [sucesso, setSucesso] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErro('')
    setSucesso('')

    // Validações
    if (!validarEmail(email)) {
      setErro('Email inválido')
      som.tocar('erro')
      return
    }

    if (!validarSenha(senha)) {
      setErro('A senha deve ter no mínimo 6 caracteres')
      som.tocar('erro')
      return
    }

    if (modo === 'registro' && !nome.trim()) {
      setErro('Digite seu nome')
      som.tocar('erro')
      return
    }

    setCarregando(true)

    try {
      if (modo === 'login') {
        await entrar(email, senha)
        som.tocar('sucesso')
      } else {
        await registrar(email, senha, nome)
        som.tocar('sucesso')
        setSucesso('Conta criada! Verifique seu email para confirmar.')
        setModo('login')
      }
    } catch (error) {
      console.error('Erro:', error)
      som.tocar('erro')
      if (error.message.includes('Invalid login')) {
        setErro('Email ou senha incorretos')
      } else if (error.message.includes('already registered')) {
        setErro('Este email já está cadastrado')
      } else {
        setErro('Erro ao processar. Tente novamente.')
      }
    } finally {
      setCarregando(false)
    }
  }

  const alternarModo = () => {
    setModo(modo === 'login' ? 'registro' : 'login')
    setErro('')
    setSucesso('')
    som.tocar('clique')
  }

  return (
    <div className="min-h-screen bg-contabio-dark flex flex-col items-center justify-center p-4">
      {/* Background com gradiente sutil */}
      <div className="fixed inset-0 bg-gradient-to-br from-contabio-dark via-contabio-darker to-contabio-dark opacity-50" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-contabio-green/5 via-transparent to-transparent" />
      
      {/* Logo */}
      <div className="relative z-10 mb-8 animate-fade-in">
        <h1 className="font-montserrat font-bold text-5xl md:text-6xl text-white tracking-tight">
          CONTABIO
        </h1>
        <div className="h-1 w-16 bg-gradient-to-r from-contabio-green to-transparent mt-2 rounded-full" />
      </div>

      {/* Card de Login */}
      <div className="relative z-10 w-full max-w-md animate-slide-up">
        <div className="glass-card p-8">
          <h2 className="text-2xl font-semibold text-white mb-6 text-center">
            {modo === 'login' ? 'Entrar' : 'Criar conta'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {modo === 'registro' && (
              <div>
                <label className="label-text">Nome</label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Seu nome"
                  className="input-field"
                  disabled={carregando}
                />
              </div>
            )}

            <div>
              <label className="label-text">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="input-field"
                disabled={carregando}
              />
            </div>

            <div>
              <label className="label-text">Senha</label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                className="input-field"
                disabled={carregando}
              />
            </div>

            {erro && (
              <div className="bg-contabio-red/10 border border-contabio-red/30 rounded-xl p-3 animate-fade-in">
                <p className="text-contabio-red text-sm text-center">{erro}</p>
              </div>
            )}

            {sucesso && (
              <div className="bg-contabio-green/10 border border-contabio-green/30 rounded-xl p-3 animate-fade-in">
                <p className="text-contabio-green text-sm text-center">{sucesso}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={carregando}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {carregando ? (
                <>
                  <div className="loading-spinner" />
                  <span>Aguarde...</span>
                </>
              ) : (
                <span>{modo === 'login' ? 'Entrar' : 'Criar conta'}</span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={alternarModo}
              className="text-contabio-text-muted hover:text-white transition-colors text-sm"
            >
              {modo === 'login' 
                ? 'Não tem conta? Criar agora' 
                : 'Já tem conta? Entrar'}
            </button>
          </div>
        </div>
      </div>

      {/* Rodapé */}
      <div className="relative z-10 mt-8 text-contabio-text-muted text-sm animate-fade-in">
        <p>Organize suas finanças com simplicidade</p>
      </div>
    </div>
  )
}
