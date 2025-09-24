import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from './Button'

type Props = {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  footer?: React.ReactNode
}
export const Modal: React.FC<Props> = ({ open, onClose, title, children, footer }) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div className="glass w-[90%] max-w-lg rounded-xl p-4"
            initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}>
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold">{title}</div>
              <Button variant="ghost" onClick={onClose}>Close</Button>
            </div>
            <div className="space-y-3">{children}</div>
            {footer && <div className="mt-4 flex justify-end">{footer}</div>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}