import { useEffect, useState } from 'react'
import api from '../../api/axios'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import type { Note } from '../../types'

export default function Notes() {
  const [list, setList] = useState<Note[]>([])
  const load = () => api.get<Note[]>('/api/notes').then(r => setList(r.data))
  useEffect(() => { load() }, [])
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {list.map(n => (
        <Card key={n.id} title={n.title} subtitle={n.subject}>
          <div className="text-sm text-gray-600">{n.description}</div>
          <div className="mt-3 flex gap-2">
            {n.link && <a className="text-sky-600 text-sm underline" href={n.link} target="_blank">Open Link</a>}
            {n.filePath && <a href={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/notes/${n.id}/download`}><Button>Download</Button></a>}
          </div>
        </Card>
      ))}
    </div>
  )
}