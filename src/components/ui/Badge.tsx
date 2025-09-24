import React from 'react'
import clsx from 'clsx'

export const Badge: React.FC<{ children: React.ReactNode; color?: 'green' | 'red' | 'gray' | 'blue' }> = ({ children, color = 'gray' }) => {
  const map = {
    green: 'bg-emerald-100 text-emerald-700',
    red: 'bg-rose-100 text-rose-700',
    gray: 'bg-gray-100 text-gray-700',
    blue: 'bg-sky-100 text-sky-700',
  }
  return <span className={clsx('px-2 py-0.5 rounded text-xs font-medium', map[color])}>{children}</span>
}