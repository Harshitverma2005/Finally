import { useEffect, useState } from 'react'
import api from '../../api/axios'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import type { Assignment } from '../../types'
import toast from 'react-hot-toast'
import { getErrorMessage } from '../../utils/errors'

export default function Assignments() {
  const [list, setList] = useState<(Assignment & { _file?: File | null })[]>([])
  const [uploading, setUploading] = useState<number | null>(null)

  const load = () => api.get<Assignment[]>('/api/assignments').then(r => setList(r.data))
  useEffect(() => { load() }, [])

  const submit = async (id: number, file: File | null) => {
    if (!file) return toast.error('Pick a file')
    const form = new FormData()
    form.append('file', file)
    setUploading(id)
    try {
      await api.post(`/api/assignments/${id}/submit`, form, { headers: { 'Content-Type': 'multipart/form-data' } })
      toast.success('Submitted')
    } catch (e: unknown) {
      toast.error(getErrorMessage(e))
    } finally { setUploading(null) }
  }

  return (
    <div className="grid gap-3">
      {list.map(a => (
        <Card key={a.id} title={a.title} subtitle={a.subject || ''}>
          <div className="text-sm text-gray-500">{a.description}</div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {a.resourceUrl && <a className="text-sky-600 text-sm underline" href={a.resourceUrl} target="_blank">Open Resource</a>}
            {a.filePath && <a className="text-sky-600 text-sm underline" href={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/assignments/${a.id}/download`} target="_blank">Download</a>}
          </div>
          <div className="mt-3 flex items-center gap-2">
            <input type="file" onChange={e => (a._file = e.target.files?.[0] || null)} />
            <Button onClick={() => submit(a.id, a._file || null)} loading={uploading === a.id}>Submit</Button>
          </div>
        </Card>
      ))}
    </div>
  )
}