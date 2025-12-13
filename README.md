# 📘 CONTABIO

Sistema de contabilidade pessoal - Organize suas finanças com simplicidade.

![CONTABIO](https://img.shields.io/badge/CONTABIO-v1.0.0-green)

## ✨ Funcionalidades

- 📅 Calendário mensal para navegação entre meses
- 💰 Controle de contas fixas e parceladas
- ✅ Marcar contas como pagas com visual satisfatório
- 📝 Anotações persistentes (chave PIX, dados bancários, etc)
- 📊 Totalizador com progresso visual
- 🎯 Sistema de metas e poupança
- 🔊 Sons de feedback (estilo PicPay)
- 📱 PWA - Instalável em qualquer dispositivo
- 🌙 Design dark mode premium

## 🚀 Como Configurar

### 1. Configurar o Supabase

1. Acesse seu projeto no [Supabase](https://supabase.com)
2. Vá em **SQL Editor**
3. Cole e execute todo o conteúdo do arquivo `supabase-schema.sql`
4. Isso criará todas as tabelas necessárias

### 2. Configurar as Variáveis de Ambiente

1. Copie o arquivo `.env.example` para `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edite o `.env` com suas credenciais do Supabase:
   ```
   VITE_SUPABASE_URL=https://sua-url.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-chave-anon-aqui
   ```

### 3. Instalar Dependências

```bash
npm install
```

### 4. Rodar em Desenvolvimento

```bash
npm run dev
```

O app estará disponível em `http://localhost:3000`

### 5. Build para Produção

```bash
npm run build
```

Os arquivos de produção serão gerados na pasta `dist/`

## 📤 Deploy no Render

### Opção 1: Via GitHub

1. Faça push do código para o GitHub
2. No Render, crie um novo **Web Service**
3. Conecte ao repositório
4. Configure:
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npx serve dist -s`
   - **Environment Variables:** Adicione as variáveis do Supabase

### Opção 2: Via Upload

1. Execute `npm run build`
2. Faça upload da pasta `dist/` como site estático

## 🔧 Variáveis de Ambiente no Render

No painel do Render, adicione estas variáveis:

| Variável | Valor |
|----------|-------|
| `VITE_SUPABASE_URL` | Sua URL do Supabase |
| `VITE_SUPABASE_ANON_KEY` | Sua chave anon do Supabase |

## 📁 Estrutura do Projeto

```
contabio/
├── public/
│   ├── manifest.json    # Configuração PWA
│   └── sw.js            # Service Worker
├── src/
│   ├── components/      # Componentes React
│   ├── hooks/           # Hooks customizados
│   ├── lib/             # Utilitários e configurações
│   ├── pages/           # Páginas da aplicação
│   ├── styles/          # CSS global
│   ├── App.jsx          # Componente principal
│   └── main.jsx         # Entrada da aplicação
├── .env.example         # Exemplo de variáveis de ambiente
├── package.json
├── supabase-schema.sql  # Script do banco de dados
├── tailwind.config.js
└── vite.config.js
```

## 🎨 Paleta de Cores

| Cor | Uso |
|-----|-----|
| `#0a0a0b` | Background principal |
| `#141416` | Cards |
| `#22c55e` | Verde (sucesso/pago) |
| `#ef4444` | Vermelho (pendente/alerta) |
| `#eab308` | Amarelo (atenção) |

## 📱 PWA

O CONTABIO é um Progressive Web App! Para instalar:

- **Android:** Acesse o site > Menu > "Adicionar à tela inicial"
- **iOS:** Acesse o site > Compartilhar > "Adicionar à Tela de Início"
- **Desktop:** Clique no ícone de instalação na barra de endereços

## 🔒 Segurança

- Autenticação via Supabase Auth
- Row Level Security (RLS) habilitado em todas as tabelas
- Cada usuário só acessa seus próprios dados
- Senhas criptografadas

## 📄 Licença

Projeto pessoal - Todos os direitos reservados.

---

Feito com ❤️ para organização financeira pessoal
