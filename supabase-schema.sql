-- =====================================================
-- MONCASH v2.0 - Script do Banco de Dados
-- Execute no SQL Editor do Supabase
-- =====================================================

-- Tabela de configurações
CREATE TABLE IF NOT EXISTS configuracoes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  saldo_mensal DECIMAL(10,2) DEFAULT 5500.00,
  dia_referencia INTEGER DEFAULT 10,
  sons_habilitados BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(usuario_id)
);

-- Tabela de contas fixas
CREATE TABLE IF NOT EXISTS contas_fixas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nome VARCHAR(255) NOT NULL,
  valor DECIMAL(10,2) DEFAULT 0,
  vencimento INTEGER DEFAULT 10,
  valor_fixo BOOLEAN DEFAULT false,
  anotacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de contas parceladas
CREATE TABLE IF NOT EXISTS contas_parceladas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nome VARCHAR(255) NOT NULL,
  valor_parcela DECIMAL(10,2) NOT NULL,
  parcelas_totais INTEGER NOT NULL,
  parcelas_restantes INTEGER NOT NULL,
  vencimento INTEGER DEFAULT 10,
  anotacoes TEXT,
  arquivada BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de cartões
CREATE TABLE IF NOT EXISTS cartoes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nome VARCHAR(255) NOT NULL,
  bandeira VARCHAR(50),
  limite DECIMAL(10,2) DEFAULT 0,
  vencimento INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de contas do mês
CREATE TABLE IF NOT EXISTS contas_mes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  mes INTEGER NOT NULL,
  ano INTEGER NOT NULL,
  nome VARCHAR(255) NOT NULL,
  valor DECIMAL(10,2),
  vencimento INTEGER DEFAULT 10,
  tipo VARCHAR(20) DEFAULT 'fixa',
  conta_fixa_id UUID REFERENCES contas_fixas(id) ON DELETE SET NULL,
  conta_parcelada_id UUID REFERENCES contas_parceladas(id) ON DELETE SET NULL,
  pago BOOLEAN DEFAULT false,
  anotacoes TEXT,
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de gastos avulsos
CREATE TABLE IF NOT EXISTS gastos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  descricao VARCHAR(255) NOT NULL,
  categoria VARCHAR(50) DEFAULT 'outros',
  data DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de cofrinho
CREATE TABLE IF NOT EXISTS cofrinho (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  total DECIMAL(10,2) DEFAULT 0,
  meta DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(usuario_id)
);

-- Tabela de histórico do cofrinho
CREATE TABLE IF NOT EXISTS cofrinho_historico (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  descricao VARCHAR(255),
  data DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de histórico mensal
CREATE TABLE IF NOT EXISTS historico_mensal (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  mes INTEGER NOT NULL,
  ano INTEGER NOT NULL,
  saldo_inicial DECIMAL(10,2),
  total_pago DECIMAL(10,2),
  total_gastos DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(usuario_id, mes, ano)
);

-- =====================================================
-- HABILITAR RLS
-- =====================================================

ALTER TABLE configuracoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE contas_fixas ENABLE ROW LEVEL SECURITY;
ALTER TABLE contas_parceladas ENABLE ROW LEVEL SECURITY;
ALTER TABLE cartoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE contas_mes ENABLE ROW LEVEL SECURITY;
ALTER TABLE gastos ENABLE ROW LEVEL SECURITY;
ALTER TABLE cofrinho ENABLE ROW LEVEL SECURITY;
ALTER TABLE cofrinho_historico ENABLE ROW LEVEL SECURITY;
ALTER TABLE historico_mensal ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- POLÍTICAS DE SEGURANÇA
-- =====================================================

-- Configurações
CREATE POLICY "config_select" ON configuracoes FOR SELECT USING (auth.uid() = usuario_id);
CREATE POLICY "config_insert" ON configuracoes FOR INSERT WITH CHECK (auth.uid() = usuario_id);
CREATE POLICY "config_update" ON configuracoes FOR UPDATE USING (auth.uid() = usuario_id);

-- Contas Fixas
CREATE POLICY "fixas_select" ON contas_fixas FOR SELECT USING (auth.uid() = usuario_id);
CREATE POLICY "fixas_insert" ON contas_fixas FOR INSERT WITH CHECK (auth.uid() = usuario_id);
CREATE POLICY "fixas_update" ON contas_fixas FOR UPDATE USING (auth.uid() = usuario_id);
CREATE POLICY "fixas_delete" ON contas_fixas FOR DELETE USING (auth.uid() = usuario_id);

-- Contas Parceladas
CREATE POLICY "parc_select" ON contas_parceladas FOR SELECT USING (auth.uid() = usuario_id);
CREATE POLICY "parc_insert" ON contas_parceladas FOR INSERT WITH CHECK (auth.uid() = usuario_id);
CREATE POLICY "parc_update" ON contas_parceladas FOR UPDATE USING (auth.uid() = usuario_id);
CREATE POLICY "parc_delete" ON contas_parceladas FOR DELETE USING (auth.uid() = usuario_id);

-- Cartões
CREATE POLICY "cart_select" ON cartoes FOR SELECT USING (auth.uid() = usuario_id);
CREATE POLICY "cart_insert" ON cartoes FOR INSERT WITH CHECK (auth.uid() = usuario_id);
CREATE POLICY "cart_update" ON cartoes FOR UPDATE USING (auth.uid() = usuario_id);
CREATE POLICY "cart_delete" ON cartoes FOR DELETE USING (auth.uid() = usuario_id);

-- Contas do Mês
CREATE POLICY "mes_select" ON contas_mes FOR SELECT USING (auth.uid() = usuario_id);
CREATE POLICY "mes_insert" ON contas_mes FOR INSERT WITH CHECK (auth.uid() = usuario_id);
CREATE POLICY "mes_update" ON contas_mes FOR UPDATE USING (auth.uid() = usuario_id);
CREATE POLICY "mes_delete" ON contas_mes FOR DELETE USING (auth.uid() = usuario_id);

-- Gastos
CREATE POLICY "gastos_select" ON gastos FOR SELECT USING (auth.uid() = usuario_id);
CREATE POLICY "gastos_insert" ON gastos FOR INSERT WITH CHECK (auth.uid() = usuario_id);
CREATE POLICY "gastos_delete" ON gastos FOR DELETE USING (auth.uid() = usuario_id);

-- Cofrinho
CREATE POLICY "cof_select" ON cofrinho FOR SELECT USING (auth.uid() = usuario_id);
CREATE POLICY "cof_insert" ON cofrinho FOR INSERT WITH CHECK (auth.uid() = usuario_id);
CREATE POLICY "cof_update" ON cofrinho FOR UPDATE USING (auth.uid() = usuario_id);

-- Cofrinho Histórico
CREATE POLICY "cofh_select" ON cofrinho_historico FOR SELECT USING (auth.uid() = usuario_id);
CREATE POLICY "cofh_insert" ON cofrinho_historico FOR INSERT WITH CHECK (auth.uid() = usuario_id);

-- Histórico Mensal
CREATE POLICY "hist_select" ON historico_mensal FOR SELECT USING (auth.uid() = usuario_id);
CREATE POLICY "hist_insert" ON historico_mensal FOR INSERT WITH CHECK (auth.uid() = usuario_id);
CREATE POLICY "hist_update" ON historico_mensal FOR UPDATE USING (auth.uid() = usuario_id);

-- =====================================================
-- ÍNDICES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_fixas_user ON contas_fixas(usuario_id);
CREATE INDEX IF NOT EXISTS idx_parc_user ON contas_parceladas(usuario_id);
CREATE INDEX IF NOT EXISTS idx_cart_user ON cartoes(usuario_id);
CREATE INDEX IF NOT EXISTS idx_mes_user ON contas_mes(usuario_id, mes, ano);
CREATE INDEX IF NOT EXISTS idx_gastos_user ON gastos(usuario_id, data);
CREATE INDEX IF NOT EXISTS idx_hist_user ON historico_mensal(usuario_id, ano);

-- FIM
