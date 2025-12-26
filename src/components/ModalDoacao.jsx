import { motion, AnimatePresence } from 'framer-motion'
import { som } from '../lib/sons'

export default function ModalDoacao({ aberto, onFechar, linkPix }) {
  const handleDoar = () => {
    som.tocar('clique')
    // Abre o link do LivePix em nova aba
    window.open(linkPix || 'https://livepix.gg/moncash', '_blank')
  }

  const handleFechar = () => {
    som.tocar('clique')
    onFechar()
  }

  return (
    <AnimatePresence>
      {aberto && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Overlay com gradiente */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-b from-moncash-dark via-black/95 to-moncash-dark"
          />
          
          {/* Efeito de brilho */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] 
                          bg-moncash-lime/10 rounded-full blur-[100px]" />
          </div>
          
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="relative w-full max-w-sm text-center"
          >
            {/* Logo */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              <img 
                src="https://i.imgur.com/igiIEnb.png" 
                alt="Moncash" 
                className="h-12 mx-auto"
              />
            </motion.div>

            {/* Ícone de coração */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', damping: 10 }}
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-moncash-lime/20 
                        flex items-center justify-center"
            >
              <span className="text-4xl">💚</span>
            </motion.div>

            {/* Título */}
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold text-white mb-3"
            >
              Moncash é grátis!
            </motion.h2>

            {/* Descrição */}
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-moncash-text-muted mb-8 leading-relaxed"
            >
              Ajude a manter esse projeto no ar com uma doação via PIX. 
              <span className="text-moncash-lime"> Qualquer valor ajuda!</span> 🙏
            </motion.p>

            {/* Botão de doar */}
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDoar}
              className="w-full btn-primary text-lg py-4 mb-4 flex items-center justify-center gap-3"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9.5 4c-1.55 0-2.98.57-4.08 1.52L2 2.5v6h6L5.22 5.72C6.1 5.27 7.27 5 8.5 5c3.58 0 6.5 2.92 6.5 6.5S12.08 18 8.5 18c-2.83 0-5.23-1.82-6.11-4.35l-1.89.63C1.62 17.85 4.79 21 8.5 21c4.69 0 8.5-3.81 8.5-8.5S13.19 4 8.5 4z"/>
              </svg>
              Doar via PIX
            </motion.button>

            {/* Botão de fechar */}
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              onClick={handleFechar}
              className="text-moncash-text-muted hover:text-white transition-colors py-2"
            >
              Agora não
            </motion.button>

            {/* Mensagem de agradecimento */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-8 text-xs text-moncash-text-muted/60"
            >
              Obrigado por usar o Moncash! ✨
            </motion.p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
