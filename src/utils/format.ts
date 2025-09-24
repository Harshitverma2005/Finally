export const formatDate = (d?: string | null) => d ? new Date(d).toLocaleDateString() : '—'
export const pct = (n: number) => `${n.toFixed(2)}%`