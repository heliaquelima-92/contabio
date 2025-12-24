import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import { validarEmail, validarSenha } from '../lib/utils'
import { som } from '../lib/sons'

export default function Login() {
  const { entrar, registrar } = useAuth()
  const [modo, setModo] = useState('login')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [nome, setNome] = useState('')
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [carregando, setCarregando] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErro('')
    setSucesso('')

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
        setSucesso('Conta criada! Verifique seu email.')
        setModo('login')
      }
    } catch (error) {
      som.tocar('erro')
      if (error.message.includes('Invalid login')) {
        setErro('Email ou senha incorretos')
      } else if (error.message.includes('already registered')) {
        setErro('Este email já está cadastrado')
      } else if (error.message.includes('Email not confirmed')) {
        setErro('Confirme seu email para entrar')
      } else {
        setErro('Erro ao processar. Tente novamente.')
      }
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="min-h-screen bg-moncash-dark flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-moncash-lime/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-moncash-lime/3 rounded-full blur-[100px]" />
      </div>
      
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 mb-10"
      >
        <img 
          src="https://i.imgur.com/igiIEnb.png" 
          alt="Moncash" 
          className="h-12 mx-auto"
        />
        <p className="text-moncash-text-muted text-sm mt-3 text-center">
          Seu controle financeiro inteligente
        </p>
      </motion.div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative z-10 w-full max-w-sm"
      >
        <div className="card p-6">
          <h2 className="text-xl font-bold text-white mb-6 text-center">
            {modo === 'login' ? 'Entrar' : 'Criar conta'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {modo === 'registro' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
              >
                <label className="input-label">Nome</label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Seu nome"
                  className="input-field"
                  disabled={carregando}
                />
              </motion.div>
            )}

            <div>
              <label className="input-label">Email</label>
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
              <label className="input-label">Senha</label>
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
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-moncash-error/10 border border-moncash-error/30 rounded-xl p-3"
              >
                <p className="text-moncash-error text-sm text-center">{erro}</p>
              </motion.div>
            )}

            {sucesso && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-moncash-success/10 border border-moncash-success/30 rounded-xl p-3"
              >
                <p className="text-moncash-success text-sm text-center">{sucesso}</p>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={carregando}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {carregando ? (
                <div className="w-5 h-5 border-2 border-moncash-dark/30 border-t-moncash-dark rounded-full animate-spin" />
              ) : (
                modo === 'login' ? 'Entrar' : 'Criar conta'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setModo(modo === 'login' ? 'registro' : 'login')
                setErro('')
                setSucesso('')
                som.tocar('clique')
              }}
              className="text-moncash-text-muted hover:text-moncash-lime transition-colors text-sm"
            >
              {modo === 'login' ? 'Não tem conta? Criar agora' : 'Já tem conta? Entrar'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
