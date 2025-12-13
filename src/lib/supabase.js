import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Variáveis de ambiente do Supabase não configuradas!')
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')

// Funções auxiliares para autenticação
export const auth = {
  // Registrar novo usuário
  async registrar(email, senha, nome) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: senha,
      options: {
        data: {
          nome: nome
        }
      }
    })
    if (error) throw error
    return data
  },

  // Login
  async entrar(email, senha) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: senha
    })
    if (error) throw error
    return data
  },

  // Logout
  async sair() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  // Obter usuário atual
  async obterUsuario() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  },

  // Escutar mudanças de autenticação
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback)
  }
}

// Funções do banco de dados
export const db = {
  // === CONTAS FIXAS ===
  async listarContasFixas(usuarioId) {
    const { data, error } = await supabase
      .from('contas_fixas')
      .select('*')
      .eq('usuario_id', usuarioId)
      .order('nome')
    if (error) throw error
    return data
  },

  async criarContaFixa(conta) {
    const { data, error } = await supabase
      .from('contas_fixas')
      .insert(conta)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async atualizarContaFixa(id, atualizacoes) {
    const { data, error } = await supabase
      .from('contas_fixas')
      .update(atualizacoes)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async deletarContaFixa(id) {
    const { error } = await supabase
      .from('contas_fixas')
      .delete()
      .eq('id', id)
    if (error) throw error
  },

  // === CONTAS PARCELADAS ===
  async listarContasParceladas(usuarioId) {
    const { data, error } = await supabase
      .from('contas_parceladas')
      .select('*')
      .eq('usuario_id', usuarioId)
      .eq('arquivada', false)
      .order('nome')
    if (error) throw error
    return data
  },

  async criarContaParcelada(conta) {
    const { data, error } = await supabase
      .from('contas_parceladas')
      .insert(conta)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async atualizarContaParcelada(id, atualizacoes) {
    const { data, error } = await supabase
      .from('contas_parceladas')
      .update(atualizacoes)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  // === CONTAS DO MÊS ===
  async listarContasMes(usuarioId, mes, ano) {
    const { data, error } = await supabase
      .from('contas_mes')
      .select('*')
      .eq('usuario_id', usuarioId)
      .eq('mes', mes)
      .eq('ano', ano)
      .order('ordem')
    if (error) throw error
    return data
  },

  async criarContaMes(conta) {
    const { data, error } = await supabase
      .from('contas_mes')
      .insert(conta)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async atualizarContaMes(id, atualizacoes) {
    const { data, error } = await supabase
      .from('contas_mes')
      .update(atualizacoes)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async deletarContaMes(id) {
    const { error } = await supabase
      .from('contas_mes')
      .delete()
      .eq('id', id)
    if (error) throw error
  },

  // === CONFIGURAÇÕES DO USUÁRIO ===
  async obterConfiguracoes(usuarioId) {
    const { data, error } = await supabase
      .from('configuracoes')
      .select('*')
      .eq('usuario_id', usuarioId)
      .single()
    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  async salvarConfiguracoes(config) {
    const { data, error } = await supabase
      .from('configuracoes')
      .upsert(config)
      .select()
      .single()
    if (error) throw error
    return data
  },

  // === METAS ===
  async listarMetas(usuarioId) {
    const { data, error } = await supabase
      .from('metas')
      .select('*')
      .eq('usuario_id', usuarioId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  },

  async criarMeta(meta) {
    const { data, error } = await supabase
      .from('metas')
      .insert(meta)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async atualizarMeta(id, atualizacoes) {
    const { data, error } = await supabase
      .from('metas')
      .update(atualizacoes)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async deletarMeta(id) {
    const { error } = await supabase
      .from('metas')
      .delete()
      .eq('id', id)
    if (error) throw error
  },

  // === POUPANÇA ===
  async listarPoupanca(usuarioId) {
    const { data, error } = await supabase
      .from('poupanca')
      .select('*')
      .eq('usuario_id', usuarioId)
      .order('data', { ascending: false })
    if (error) throw error
    return data
  },

  async adicionarPoupanca(entrada) {
    const { data, error } = await supabase
      .from('poupanca')
      .insert(entrada)
      .select()
      .single()
    if (error) throw error
    return data
  },

  // === HISTÓRICO ===
  async obterHistoricoMes(usuarioId, mes, ano) {
    const { data, error } = await supabase
      .from('historico_mensal')
      .select('*')
      .eq('usuario_id', usuarioId)
      .eq('mes', mes)
      .eq('ano', ano)
      .single()
    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  async salvarHistoricoMes(historico) {
    const { data, error } = await supabase
      .from('historico_mensal')
      .upsert(historico)
      .select()
      .single()
    if (error) throw error
    return data
  }
}
