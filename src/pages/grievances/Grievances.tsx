import { useEffect, useState } from 'react'
import api from '../../api/axios'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import toast from 'react-hot-toast'
import { getErrorMessage } from '../../utils/errors'

type G = { id: number; title: string; description: string; status: string }

export default function Grievances() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [list, setList] = useState<G[]>([])
  const load = () => api.get<G[]>('/api/grievances/my').then(r => setList(r.data))
  useEffect(() => { load() }, [])
  const submit = async () => {
    try {
      await api.post('/api/grievances', { title, description })
      toast.success('Submitted'); setTitle(''); setDescription(''); load()
    } catch (e: unknown) {
      toast.error(getErrorMessage(e))
    }
  }
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Card title="New Grievance">
        <div className="space-y-2">
          <Input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
          <Input placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />
          <Button onClick={submit}>Submit</Button>
        </div>
      </Card>
      <Card title="My Grievances">
        <ul className="space-y-2">
          {list.map(g => <li key={g.id} className="border rounded p-2">
            <div className="font-medium">{g.title} <span className="text-xs text-gray-500">({g.status})</span></div>
            <div className="text-xs text-gray-500">{g.description}</div>
          </li>)}
        </ul>
      </Card>
    </div>
  )
}