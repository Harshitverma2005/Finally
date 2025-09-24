import { useEffect, useState } from 'react'
import api from '../../api/axios'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import toast from 'react-hot-toast'
import { getErrorMessage } from '../../utils/errors'

type G = { id: number; title: string; description: string; status: string }

export default function ManageGrievances() {
  const [list, setList] = useState<G[]>([])
  const [resolution, setResolution] = useState<Record<number, string>>({})

  const load = () => api.get<G[]>('/api/grievances/pending').then(r => setList(r.data))
  useEffect(() => { load() }, [])

  const resolve = async (id: number, status: string) => {
    try {
      await api.post(`/api/grievances/${id}/resolve`, { status, resolutionNotes: resolution[id] || '' })
      toast.success('Updated'); load()
    } catch (e: unknown) {
      toast.error(getErrorMessage(e))
    }
  }

  return (
    <div className="grid gap-3">
      {list.map(g => <Card key={g.id} title={g.title}>
        <div className="text-sm text-gray-600">{g.description}</div>
        <div className="mt-2 flex gap-2">
          <Input placeholder="Notes" value={resolution[g.id] || ''} onChange={e => setResolution(p => ({ ...p, [g.id]: e.target.value }))} />
          <Button onClick={() => resolve(g.id, 'IN_PROGRESS')}>In Progress</Button>
          <Button onClick={() => resolve(g.id, 'RESOLVED')}>Resolve</Button>
        </div>
      </Card>)}
    </div>
  )
}