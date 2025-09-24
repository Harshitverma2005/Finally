import { useCallback, useEffect, useState } from 'react'
import api from '../../api/axios'
import { Card } from '../../components/ui/Card'
import { Table } from '../../components/ui/Table'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import type { Page, StudentProfile } from '../../types'
import { Modal } from '../../components/ui/Modal'
import toast from 'react-hot-toast'
import { getErrorMessage } from '../../utils/errors'

export default function Students() {
  const [page, setPage] = useState<Page<StudentProfile>>({ content: [], totalElements: 0, totalPages: 0, number: 0, size: 20 })
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)

  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [password, setPassword] = useState('')
  const [enrollmentNo, setEnrollmentNo] = useState('')
  const [department, setDepartment] = useState('')
  const [batch, setBatch] = useState('')

  const load = useCallback((p = 0, query = q) => {
    api.get<Page<StudentProfile>>('/api/students', { params: { page: p, size: 10, q: query || undefined } })
      .then(r => setPage(r.data))
  }, [q])

  useEffect(() => { load(0) }, [load])

  const addStudent = async () => {
    try {
      await api.post('/api/auth/register/student', { email, fullName, password, enrollmentNo, department, batch })
      toast.success('Student created')
      setOpen(false)
      setEmail(''); setFullName(''); setPassword(''); setEnrollmentNo(''); setDepartment(''); setBatch('')
      load(0)
    } catch (e: unknown) {
      toast.error(getErrorMessage(e))
    }
  }

  return (
    <Card title="Students">
      <div className="mb-2 flex flex-wrap gap-2">
        <Input placeholder="Search name/email/enrollment" value={q} onChange={e=>setQ(e.target.value)} />
        <Button variant="secondary" onClick={() => load(0, q)}>Search</Button>
        <Button onClick={() => setOpen(true)}>Add Student</Button>
      </div>
      <Table headers={['Name','Email','Enrollment','Department','Batch']}>
        {page.content.map(s => (
          <tr key={s.id}>
            <td className="p-3">{s.fullName}</td>
            <td className="p-3">{s.email}</td>
            <td className="p-3">{s.enrollmentNo}</td>
            <td className="p-3">{s.department || '—'}</td>
            <td className="p-3">{s.batch || '—'}</td>
          </tr>
        ))}
      </Table>
      <div className="mt-3 flex items-center gap-2">
        <Button variant="secondary" disabled={page.number <= 0} onClick={() => load(page.number - 1, q)}>Prev</Button>
        <div className="text-xs text-gray-500 dark:text-gray-300">Page {page.number + 1} of {page.totalPages}</div>
        <Button variant="secondary" disabled={page.number + 1 >= page.totalPages} onClick={() => load(page.number + 1, q)}>Next</Button>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Add Student" footer={<Button onClick={addStudent}>Save</Button>}>
        <div className="grid grid-cols-1 gap-2">
          <Input placeholder="Full Name" value={fullName} onChange={e=>setFullName(e.target.value)} />
          <Input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <Input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          <Input placeholder="Enrollment No" value={enrollmentNo} onChange={e=>setEnrollmentNo(e.target.value)} />
          <Input placeholder="Department" value={department} onChange={e=>setDepartment(e.target.value)} />
          <Input placeholder="Batch" value={batch} onChange={e=>setBatch(e.target.value)} />
        </div>
      </Modal>
    </Card>
  )
}