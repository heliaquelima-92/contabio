import { motion, AnimatePresence } from 'framer-motion'

export default function Alertas({ alertas }) {
  if (!alertas || alertas.length === 0) return null

  const cores = {
    warning: 'bg-moncash-warning/10 border-moncash-warning/30 text-moncash-warning',
    error: 'bg-moncash-error/10 border-moncash-error/30 text-moncash-error',
    success: 'bg-moncash-success/10 border-moncash-success/30 text-moncash-success',
    info: 'bg-moncash-lime/10 border-moncash-lime/30 text-moncash-lime'
  }

  return (
    <div className="px-4 space-y-2">
      <AnimatePresence>
        {alertas.map((alerta, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${cores[alerta.tipo] || cores.info}`}
          >
            <span className="text-lg">{alerta.icone}</span>
            <span className="text-sm font-medium">{alerta.mensagem}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
