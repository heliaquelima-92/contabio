import { motion } from 'framer-motion'
import { useDados } from '../hooks/useDados'
import { formatarMoeda } from '../lib/utils'
import { som } from '../lib/sons'

export default function Sidebar({ abaAtiva, onMudarAba }) {
  const { cofrinho, saldoAtual } = useDados()

  const itens = [
    { id: 'home', icone: '🏠', label: 'Início', desc: 'Painel principal' },
    { id: 'gastos', icone: '💸', label: 'Gastos', desc: 'Despesas avulsas' },
    { id: 'relatorios', icone: '📊', label: 'Relatórios', desc: 'Análise financeira' },
    { id: 'config', icone: '⚙️', label: 'Configurações', desc: 'Contas e cartões' },
  ]

  const handleClick = (id) => {
    som.tocar('clique')
    onMudarAba(id)
  }

  return (
    <aside className="w-64 bg-moncash-dark border-r border-moncash-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-moncash-border">
        <img 
          src="https://i.imgur.com/igiIEnb.png" 
          alt="Moncash" 
          className="h-8"
        />
        <p className="text-xs text-moncash-text-muted mt-1">Controle Financeiro</p>
      </div>

      {/* Cards de resumo */}
      <div className="p-4 space-y-3">
        <div className="bg-gradient-to-br from-moncash-lime/20 to-moncash-lime/5 rounded-xl p-4 border border-moncash-lime/20">
          <p className="text-xs text-moncash-text-muted">Saldo Disponível</p>
          <p className={`text-xl font-bold tabular-nums ${saldoAtual >= 0 ? 'text-moncash-lime' : 'text-moncash-error'}`}>
            {formatarMoeda(saldoAtual)}
          </p>
        </div>

        <div className="bg-moncash-card rounded-xl p-4 border border-moncash-border">
          <div className="flex items-center gap-2 mb-1">
            <span>🐷</span>
            <p className="text-xs text-moncash-text-muted">Cofrinho</p>
          </div>
          <p className="text-lg font-bold text-white tabular-nums">
            {formatarMoeda(cofrinho?.total || 0)}
          </p>
          {cofrinho?.meta > 0 && (
            <div className="mt-2">
              <div className="h-1.5 bg-moncash-border rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full" 
                  style={{ width: `${Math.min((cofrinho.total / cofrinho.meta) * 100, 100)}%` }} 
                />
              </div>
              <p className="text-[10px] text-moncash-text-muted mt-1">
                Meta: {formatarMoeda(cofrinho.meta)}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4">
        <p className="text-[10px] font-semibold text-moncash-text-muted uppercase tracking-wider mb-3 px-3">
          Menu
        </p>
        <ul className="space-y-1">
          {itens.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => handleClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-left
                  ${abaAtiva === item.id 
                    ? 'bg-moncash-lime text-moncash-dark' 
                    : 'text-moncash-text-muted hover:bg-moncash-card hover:text-white'}`}
              >
                <span className="text-xl">{item.icone}</span>
                <div>
                  <p className={`font-medium text-sm ${abaAtiva === item.id ? 'text-moncash-dark' : ''}`}>
                    {item.label}
                  </p>
                  <p className={`text-[10px] ${abaAtiva === item.id ? 'text-moncash-dark/70' : 'text-moncash-text-muted'}`}>
                    {item.desc}
                  </p>
                </div>
                {abaAtiva === item.id && (
                  <motion.div 
                    layoutId="sidebar-indicator"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-moncash-dark"
                  />
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-moncash-border">
        <a
          href="https://livepix.gg/moncash"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-3 rounded-xl bg-gradient-to-r from-pink-500/20 to-purple-500/20 
                    border border-pink-500/30 hover:border-pink-500/50 transition-all group"
        >
          <span className="text-xl">💜</span>
          <div>
            <p className="font-medium text-sm text-white group-hover:text-pink-300 transition-colors">
              Apoiar o projeto
            </p>
            <p className="text-[10px] text-moncash-text-muted">
              Fazer uma doação
            </p>
          </div>
        </a>
      </div>
    </aside>
  )
}
