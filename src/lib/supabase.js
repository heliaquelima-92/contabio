import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Variáveis de ambiente do Supabase não configuradas!')
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')

// Autenticação
export const auth = {
  async registrar(email, senha, nome) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: senha,
      options: { data: { nome } }
    })
    if (error) throw error
    return data
  },

  async entrar(email, senha) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: senha
    })
    if (error) throw error
    return data
  },

  async sair() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async obterUsuario() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  },

  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback)
  }
}

// Banco de dados
export const db = {
  // Configurações
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

  // Contas Fixas
  async listarContasFixas(usuarioId) {
    const { data, error } = await supabase
      .from('contas_fixas')
      .select('*')
      .eq('usuario_id', usuarioId)
      .order('nome')
    if (error) throw error
    return data || []
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

  async atualizarContaFixa(id, dados) {
    const { data, error } = await supabase
      .from('contas_fixas')
      .update(dados)
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

  // Contas Parceladas
  async listarContasParceladas(usuarioId) {
    const { data, error } = await supabase
      .from('contas_parceladas')
      .select('*')
      .eq('usuario_id', usuarioId)
      .eq('arquivada', false)
      .order('nome')
    if (error) throw error
    return data || []
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

  async atualizarContaParcelada(id, dados) {
    const { data, error } = await supabase
      .from('contas_parceladas')
      .update(dados)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async deletarContaParcelada(id) {
    const { error } = await supabase
      .from('contas_parceladas')
      .delete()
      .eq('id', id)
    if (error) throw error
  },

  // Cartões de Crédito
  async listarCartoes(usuarioId) {
    const { data, error } = await supabase
      .from('cartoes')
      .select('*')
      .eq('usuario_id', usuarioId)
      .order('nome')
    if (error) throw error
    return data || []
  },

  async criarCartao(cartao) {
    const { data, error } = await supabase
      .from('cartoes')
      .insert(cartao)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async atualizarCartao(id, dados) {
    const { data, error } = await supabase
      .from('cartoes')
      .update(dados)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async deletarCartao(id) {
    const { error } = await supabase
      .from('cartoes')
      .delete()
      .eq('id', id)
    if (error) throw error
  },

  // Contas do Mês
  async listarContasMes(usuarioId, mes, ano) {
    const { data, error } = await supabase
      .from('contas_mes')
      .select('*')
      .eq('usuario_id', usuarioId)
      .eq('mes', mes)
      .eq('ano', ano)
      .order('ordem')
    if (error) throw error
    return data || []
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

  async atualizarContaMes(id, dados) {
    const { data, error } = await supabase
      .from('contas_mes')
      .update(dados)
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

  // Gastos Avulsos
  async listarGastos(usuarioId, dataInicio, dataFim) {
    const { data, error } = await supabase
      .from('gastos')
      .select('*')
      .eq('usuario_id', usuarioId)
      .gte('data', dataInicio)
      .lte('data', dataFim)
      .order('data', { ascending: false })
    if (error) throw error
    return data || []
  },

  async criarGasto(gasto) {
    const { data, error } = await supabase
      .from('gastos')
      .insert(gasto)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async deletarGasto(id) {
    const { error } = await supabase
      .from('gastos')
      .delete()
      .eq('id', id)
    if (error) throw error
  },

  // Cofrinho
  async obterCofrinho(usuarioId) {
    const { data, error } = await supabase
      .from('cofrinho')
      .select('*')
      .eq('usuario_id', usuarioId)
      .single()
    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  async salvarCofrinho(dados) {
    const { data, error } = await supabase
      .from('cofrinho')
      .upsert(dados)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async listarHistoricoCofrinho(usuarioId) {
    const { data, error } = await supabase
      .from('cofrinho_historico')
      .select('*')
      .eq('usuario_id', usuarioId)
      .order('data', { ascending: false })
    if (error) throw error
    return data || []
  },

  async adicionarAoCofrinho(entrada) {
    const { data, error } = await supabase
      .from('cofrinho_historico')
      .insert(entrada)
      .select()
      .single()
    if (error) throw error
    return data
  },

  // Histórico Mensal (para relatórios)
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
  },

  // Listar todos os históricos do ano
  async listarHistoricoAno(usuarioId, ano) {
    const { data, error } = await supabase
      .from('historico_mensal')
      .select('*')
      .eq('usuario_id', usuarioId)
      .eq('ano', ano)
      .order('mes')
    if (error) throw error
    return data || []
  }
}
