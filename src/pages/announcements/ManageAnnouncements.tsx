import { useState } from 'react'
import api from '../../api/axios'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import toast from 'react-hot-toast'
import { getErrorMessage } from '../../utils/errors'

export default function ManageAnnouncements() {
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [audience, setAudience] = useState('ALL')

  const create = async () => {
    try {
      await api.post('/api/announcements', { title, message, audience })
      toast.success('Announcement posted')
      setTitle(''); setMessage('')
    } catch (e: unknown) {
      toast.error(getErrorMessage(e))
    }
  }

  return (
    <Card title="New Announcement">
      <div className="space-y-2">
        <Input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
        <Input placeholder="Message" value={message} onChange={e=>setMessage(e.target.value)} />
        <Input placeholder="Audience (ALL/STUDENTS/TEACHERS)" value={audience} onChange={e=>setAudience(e.target.value)} />
        <Button onClick={create}>Post</Button>
      </div>
    </Card>
  )
}