import { useState } from 'react'
import api from '../../api/axios'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import toast from 'react-hot-toast'
import { getErrorMessage } from '../../utils/errors'

export default function ManageNotes() {
  const [title, setTitle] = useState('')
  const [subject, setSubject] = useState('')
  const [description, setDescription] = useState('')
  const [link, setLink] = useState('')
  const [file, setFile] = useState<File | null>(null)

  const create = async () => {
    const data = new FormData()
    data.append('data', new Blob([JSON.stringify({ title, subject, description, link })], { type: 'application/json' }))
    if (file) data.append('file', file)
    try {
      await api.post('/api/notes', data)
      toast.success('Uploaded')
      setTitle(''); setSubject(''); setDescription(''); setLink(''); setFile(null)
    } catch (e: unknown) {
      toast.error(getErrorMessage(e))
    }
  }

  return (
    <Card title="Upload Notes">
      <div className="space-y-2">
        <Input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
        <Input placeholder="Subject" value={subject} onChange={e=>setSubject(e.target.value)} />
        <Input placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />
        <Input placeholder="Link (optional)" value={link} onChange={e=>setLink(e.target.value)} />
        <input type="file" onChange={e=>setFile(e.target.files?.[0] || null)} />
        <Button onClick={create}>Upload</Button>
      </div>
    </Card>
  )
}