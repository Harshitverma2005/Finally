import { useEffect, useState } from 'react'
import api from '../../api/axios'
import { Card } from '../../components/ui/Card'
import type { Announcement, Page } from '../../types'
import { Button } from '../../components/ui/Button'

export default function Announcements() {
  const [page, setPage] = useState<Page<Announcement>>({ content: [], totalElements: 0, totalPages: 0, number: 0, size: 20 })
  const load = (p = 0) => api.get<Page<Announcement>>('/api/announcements', { params: { page: p, size: 6 } }).then(r => setPage(r.data))
  useEffect(() => { load(0) }, [])
  return (
    <div className="space-y-3">
      <div className="grid gap-3 md:grid-cols-2">
        {page.content.map(a => (
          <Card key={a.id} title={a.title}>
            <div className="text-sm text-gray-600">{a.message}</div>
          </Card>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <Button variant="secondary" disabled={page.number <= 0} onClick={() => load(page.number - 1)}>Prev</Button>
        <div className="text-xs text-gray-500">Page {page.number + 1} of {page.totalPages}</div>
        <Button variant="secondary" disabled={page.number + 1 >= page.totalPages} onClick={() => load(page.number + 1)}>Next</Button>
      </div>
    </div>
  )
}