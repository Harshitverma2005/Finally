import React from 'react'
import clsx from 'clsx'

export const Table: React.FC<{ headers: string[]; children: React.ReactNode; className?: string }> = ({ headers, children, className }) => (
  <div className={clsx('overflow-x-auto', className)}>
    <table className="min-w-full text-sm border-collapse">
      <thead>
        <tr className="bg-gray-50">
          {headers.map((h) => <th key={h} className="text-left p-3 font-semibold text-gray-600">{h}</th>)}
        </tr>
      </thead>
      <tbody className="divide-y">{children}</tbody>
    </table>
  </div>
)