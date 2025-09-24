import { useEffect, useState } from 'react'
import api from '../../api/axios'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { Table } from '../../components/ui/Table'
import type { Assignment, AssignmentSubmission } from '../../types'
import { Modal } from '../../components/ui/Modal'
import toast from 'react-hot-toast'
import { getErrorMessage } from '../../utils/errors'

export default function ManageAssignments() {
  const [title, setTitle] = useState('')
  const [subject, setSubject] = useState('')
  const [description, setDescription] = useState('')
  const [resourceUrl, setResourceUrl] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [list, setList] = useState<Assignment[]>([])
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([])
  const [open, setOpen] = useState(false)
  const [activeId, setActiveId] = useState<number | null>(null)
  const [grading, setGrading] = useState<Record<number, { grade: string; feedback: string }>>({})

  const load = () => api.get<Assignment[]>('/api/assignments/my').then(r => setList(r.data))
  useEffect(() => { load() }, [])

  const create = async () => {
    const data = new FormData()
    data.append('data', new Blob([JSON.stringify({ title, subject, description, resourceUrl, dueDate: dueDate ? `${dueDate}T00:00:00` : null })], { type: 'application/json' }))
    if (file) data.append('file', file)
    try {
      await api.post('/api/assignments', data)
      toast.success('Created')
      setTitle(''); setSubject(''); setDescription(''); setResourceUrl(''); setDueDate(''); setFile(null)
      load()
    } catch (e: unknown) {
      toast.error(getErrorMessage(e))
    }
  }

  const viewSubmissions = async (id: number) => {
    try {
      const r = await api.get<AssignmentSubmission[]>(`/api/assignments/${id}/submissions`)
      setActiveId(id); setSubmissions(r.data); setOpen(true)
    } catch (e: unknown) {
      toast.error(getErrorMessage(e))
    }
  }

  const grade = async (sid: number) => {
    const g = grading[sid]
    if (!g?.grade) return toast.error('Enter grade')
    try {
      await api.post(`/api/assignments/submissions/${sid}/grade`, null, { params: { grade: g.grade, feedback: g.feedback || '' } })
      toast.success('Graded')
      if (activeId) viewSubmissions(activeId)
    } catch (e: unknown) {
      toast.error(getErrorMessage(e))
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Card title="New Assignment">
        <div className="space-y-2">
          <Input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
          <Input placeholder="Subject" value={subject} onChange={e=>setSubject(e.target.value)} />
          <Input placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />
          <Input placeholder="Resource URL (optional)" value={resourceUrl} onChange={e=>setResourceUrl(e.target.value)} />
          <Input placeholder="Due Date (YYYY-MM-DD)" value={dueDate} onChange={e=>setDueDate(e.target.value)} />
          <input type="file" onChange={e=>setFile(e.target.files?.[0] || null)} />
          <Button onClick={create}>Create</Button>
        </div>
      </Card>
      <Card title="My Assignments">
        <ul className="space-y-2">
          {list.map(a => <li key={a.id} className="rounded border p-2">
            <div className="font-medium">{a.title}</div>
            <div className="text-xs text-gray-500">Subject: {a.subject}</div>
            <div className="mt-2">
              <Button variant="secondary" onClick={() => viewSubmissions(a.id)}>View Submissions</Button>
            </div>
          </li>)}
        </ul>
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="Submissions">
        <Table headers={['Student', 'Submitted At', 'Status', 'Grade', 'Actions']}>
          {submissions.map(s => (
            <tr key={s.id}>
              <td className="p-3">{s.student?.user?.fullName || s.student?.id}</td>
              <td className="p-3">{s.submittedAt ? new Date(s.submittedAt).toLocaleString() : '—'}</td>
              <td className="p-3">{s.status || '—'}</td>
              <td className="p-3">
                <div className="flex gap-2">
                  <Input placeholder="Grade" value={grading[s.id]?.grade || ''} onChange={e => setGrading(p => ({ ...p, [s.id]: { ...p[s.id], grade: e.target.value } }))} />
                  <Input placeholder="Feedback" value={grading[s.id]?.feedback || ''} onChange={e => setGrading(p => ({ ...p, [s.id]: { ...p[s.id], feedback: e.target.value } }))} />
                </div>
              </td>
              <td className="p-3">
                <Button onClick={() => grade(s.id)}>Save</Button>
              </td>
            </tr>
          ))}
        </Table>
      </Modal>
    </div>
  )
}