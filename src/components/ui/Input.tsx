import React from 'react'
import clsx from 'clsx'

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={clsx('w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-200', className)}
      {...props}
    />
  )
)
Input.displayName = 'Input'