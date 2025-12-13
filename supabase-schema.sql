-- =====================================================
-- CONTABIO - Script de criação do banco de dados
-- Execute este script no SQL Editor do Supabase
-- =====================================================

-- Tabela de configurações do usuário
CREATE TABLE IF NOT EXISTS configuracoes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  saldo_mensal DECIMAL(10,2) DEFAULT 5500.00,
  sons_habilitados BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(usuario_id)
);

-- Tabela de contas fixas (template)
CREATE TABLE IF NOT EXISTS contas_fixas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nome VARCHAR(255) NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  vencimento INTEGER NOT NULL CHECK (vencimento >= 1 AND vencimento <= 31),
  anotacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de contas parceladas
CREATE TABLE IF NOT EXISTS contas_parceladas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nome VARCHAR(255) NOT NULL,
  valor_parcela DECIMAL(10,2) NOT NULL,
  parcelas_totais INTEGER NOT NULL CHECK (parcelas_totais >= 1),
  parcelas_restantes INTEGER NOT NULL CHECK (parcelas_restantes >= 0),
  vencimento INTEGER NOT NULL CHECK (vencimento >= 1 AND vencimento <= 31),
  anotacoes TEXT,
  arquivada BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de contas do mês (instâncias mensais)
CREATE TABLE IF NOT EXISTS contas_mes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  mes INTEGER NOT NULL CHECK (mes >= 1 AND mes <= 12),
  ano INTEGER NOT NULL CHECK (ano >= 2020),
  nome VARCHAR(255) NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  vencimento INTEGER NOT NULL CHECK (vencimento >= 1 AND vencimento <= 31),
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('fixa', 'parcelada')),
  conta_fixa_id UUID REFERENCES contas_fixas(id) ON DELETE SET NULL,
  conta_parcelada_id UUID REFERENCES contas_parceladas(id) ON DELETE SET NULL,
  pago BOOLEAN DEFAULT false,
  anotacoes TEXT,
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de metas
CREATE TABLE IF NOT EXISTS metas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nome VARCHAR(255) NOT NULL,
  valor_alvo DECIMAL(10,2) NOT NULL,
  valor_atual DECIMAL(10,2) DEFAULT 0,
  data_limite DATE,
  concluida BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de poupança
CREATE TABLE IF NOT EXISTS poupanca (
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
  mes INTEGER NOT NULL CHECK (mes >= 1 AND mes <= 12),
  ano INTEGER NOT NULL CHECK (ano >= 2020),
  saldo_inicial DECIMAL(10,2),
  total_pago DECIMAL(10,2),
  total_pendente DECIMAL(10,2),
  guardou_dinheiro BOOLEAN DEFAULT false,
  valor_guardado DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(usuario_id, mes, ano)
);

-- =====================================================
-- POLÍTICAS DE SEGURANÇA (Row Level Security)
-- =====================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE configuracoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE contas_fixas ENABLE ROW LEVEL SECURITY;
ALTER TABLE contas_parceladas ENABLE ROW LEVEL SECURITY;
ALTER TABLE contas_mes ENABLE ROW LEVEL SECURITY;
ALTER TABLE metas ENABLE ROW LEVEL SECURITY;
ALTER TABLE poupanca ENABLE ROW LEVEL SECURITY;
ALTER TABLE historico_mensal ENABLE ROW LEVEL SECURITY;

-- Políticas para configuracoes
CREATE POLICY "Usuarios podem ver suas próprias configurações"
  ON configuracoes FOR SELECT
  USING (auth.uid() = usuario_id);

CREATE POLICY "Usuarios podem criar suas próprias configurações"
  ON configuracoes FOR INSERT
  WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Usuarios podem atualizar suas próprias configurações"
  ON configuracoes FOR UPDATE
  USING (auth.uid() = usuario_id);

-- Políticas para contas_fixas
CREATE POLICY "Usuarios podem ver suas contas fixas"
  ON contas_fixas FOR SELECT
  USING (auth.uid() = usuario_id);

CREATE POLICY "Usuarios podem criar contas fixas"
  ON contas_fixas FOR INSERT
  WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Usuarios podem atualizar suas contas fixas"
  ON contas_fixas FOR UPDATE
  USING (auth.uid() = usuario_id);

CREATE POLICY "Usuarios podem deletar suas contas fixas"
  ON contas_fixas FOR DELETE
  USING (auth.uid() = usuario_id);

-- Políticas para contas_parceladas
CREATE POLICY "Usuarios podem ver suas contas parceladas"
  ON contas_parceladas FOR SELECT
  USING (auth.uid() = usuario_id);

CREATE POLICY "Usuarios podem criar contas parceladas"
  ON contas_parceladas FOR INSERT
  WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Usuarios podem atualizar suas contas parceladas"
  ON contas_parceladas FOR UPDATE
  USING (auth.uid() = usuario_id);

CREATE POLICY "Usuarios podem deletar suas contas parceladas"
  ON contas_parceladas FOR DELETE
  USING (auth.uid() = usuario_id);

-- Políticas para contas_mes
CREATE POLICY "Usuarios podem ver suas contas do mês"
  ON contas_mes FOR SELECT
  USING (auth.uid() = usuario_id);

CREATE POLICY "Usuarios podem criar contas do mês"
  ON contas_mes FOR INSERT
  WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Usuarios podem atualizar suas contas do mês"
  ON contas_mes FOR UPDATE
  USING (auth.uid() = usuario_id);

CREATE POLICY "Usuarios podem deletar suas contas do mês"
  ON contas_mes FOR DELETE
  USING (auth.uid() = usuario_id);

-- Políticas para metas
CREATE POLICY "Usuarios podem ver suas metas"
  ON metas FOR SELECT
  USING (auth.uid() = usuario_id);

CREATE POLICY "Usuarios podem criar metas"
  ON metas FOR INSERT
  WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Usuarios podem atualizar suas metas"
  ON metas FOR UPDATE
  USING (auth.uid() = usuario_id);

CREATE POLICY "Usuarios podem deletar suas metas"
  ON metas FOR DELETE
  USING (auth.uid() = usuario_id);

-- Políticas para poupanca
CREATE POLICY "Usuarios podem ver sua poupança"
  ON poupanca FOR SELECT
  USING (auth.uid() = usuario_id);

CREATE POLICY "Usuarios podem adicionar à poupança"
  ON poupanca FOR INSERT
  WITH CHECK (auth.uid() = usuario_id);

-- Políticas para historico_mensal
CREATE POLICY "Usuarios podem ver seu histórico"
  ON historico_mensal FOR SELECT
  USING (auth.uid() = usuario_id);

CREATE POLICY "Usuarios podem criar histórico"
  ON historico_mensal FOR INSERT
  WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Usuarios podem atualizar seu histórico"
  ON historico_mensal FOR UPDATE
  USING (auth.uid() = usuario_id);

-- =====================================================
-- ÍNDICES PARA PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_contas_fixas_usuario ON contas_fixas(usuario_id);
CREATE INDEX IF NOT EXISTS idx_contas_parceladas_usuario ON contas_parceladas(usuario_id);
CREATE INDEX IF NOT EXISTS idx_contas_mes_usuario_periodo ON contas_mes(usuario_id, mes, ano);
CREATE INDEX IF NOT EXISTS idx_metas_usuario ON metas(usuario_id);
CREATE INDEX IF NOT EXISTS idx_poupanca_usuario ON poupanca(usuario_id);
CREATE INDEX IF NOT EXISTS idx_historico_usuario_periodo ON historico_mensal(usuario_id, mes, ano);

-- =====================================================
-- FIM DO SCRIPT
-- =====================================================
