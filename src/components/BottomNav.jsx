import { motion } from 'framer-motion'
import { som } from '../lib/sons'

const tabs = [
  { id: 'home', label: 'Home', icone: 'home' },
  { id: 'gastos', label: 'Gastos', icone: 'gastos' },
  { id: 'relatorios', label: 'Relatórios', icone: 'relatorios' },
  { id: 'config', label: 'Config', icone: 'config' }
]

const Icone = ({ nome, ativo }) => {
  const cor = ativo ? '#D5FF40' : '#888888'
  
  switch (nome) {
    case 'home':
      return (
        <svg className="w-6 h-6" fill="none" stroke={cor} viewBox="0 0 24 24" strokeWidth={ativo ? 2.5 : 2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    case 'gastos':
      return (
        <svg className="w-6 h-6" fill="none" stroke={cor} viewBox="0 0 24 24" strokeWidth={ativo ? 2.5 : 2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    case 'relatorios':
      return (
        <svg className="w-6 h-6" fill="none" stroke={cor} viewBox="0 0 24 24" strokeWidth={ativo ? 2.5 : 2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    case 'config':
      return (
        <svg className="w-6 h-6" fill="none" stroke={cor} viewBox="0 0 24 24" strokeWidth={ativo ? 2.5 : 2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    default:
      return null
  }
}

export default function BottomNav({ abaAtiva, onMudarAba }) {
  const handleClick = (id) => {
    som.tocar('clique')
    onMudarAba(id)
  }

  return (
    <nav className="bottom-nav">
      <div className="flex items-center justify-around px-2 py-1">
        {tabs.map((tab) => {
          const ativo = abaAtiva === tab.id
          
          return (
            <button
              key={tab.id}
              onClick={() => handleClick(tab.id)}
              className={`bottom-nav-item relative flex-1 ${ativo ? 'active' : ''}`}
            >
              {/* Indicador ativo */}
              {ativo && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -top-1 left-1/2 -translate-x-1/2 w-12 h-1 bg-moncash-lime rounded-full"
                  transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                />
              )}
              
              <motion.div
                animate={{ scale: ativo ? 1.1 : 1 }}
                transition={{ type: 'spring', damping: 15 }}
              >
                <Icone nome={tab.icone} ativo={ativo} />
              </motion.div>
              
              <span className={`text-[10px] mt-1 font-medium ${ativo ? 'text-moncash-lime' : 'text-moncash-text-muted'}`}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
