import { motion } from 'framer-motion'
import { som } from '../lib/sons'

export default function BotaoInformarGasto({ onClick }) {
  const handleClick = () => {
    som.tocar('clique')
    onClick()
  }

  return (
    <div className="px-4">
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={handleClick}
        className="w-full card p-4 flex items-center justify-between group
                  hover:border-moncash-lime/50 transition-all duration-300"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-moncash-lime/20 flex items-center justify-center
                        group-hover:bg-moncash-lime/30 transition-colors">
            <svg className="w-6 h-6 text-moncash-lime" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <div className="text-left">
            <p className="font-semibold text-white">Informar Gasto</p>
            <p className="text-xs text-moncash-text-muted">Registre seus gastos avulsos</p>
          </div>
        </div>
        
        <svg className="w-5 h-5 text-moncash-text-muted group-hover:text-moncash-lime transition-colors" 
             fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </motion.button>
    </div>
  )
}
