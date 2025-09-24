import React from 'react'
import clsx from 'clsx'

export const Card: React.FC<{ title?: string; className?: string; children: React.ReactNode; subtitle?: string }> = ({ title, subtitle, className, children }) => {
  return (
    <div className={clsx('glass rounded-xl p-4', className)}>
      {title && (
        <div className="mb-3">
          <div className="text-sm font-semibold">{title}</div>
          {subtitle && <div className="text-xs text-gray-500">{subtitle}</div>}
        </div>
      )}
      {children}
    </div>
  )
}