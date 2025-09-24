import React from 'react'
import clsx from 'clsx'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  loading?: boolean
}

export const Button: React.FC<Props> = ({ className, variant = 'primary', loading, children, ...props }) => {
  const base = 'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-all'
  const variants = {
    primary: 'bg-primary text-white hover:bg-sky-600 shadow',
    secondary: 'bg-white text-gray-800 border hover:bg-gray-50',
    ghost: 'bg-transparent hover:bg-black/5',
    danger: 'bg-rose-500 text-white hover:bg-rose-600'
  } as const
  return (
    <button
      className={clsx(base, variants[variant], loading && 'opacity-60 cursor-not-allowed', className)}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>}
      {children}
    </button>
  )
}