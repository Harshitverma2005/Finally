import { useCallback, useEffect, useState } from 'react'
import api from '../../api/axios'
import { Card } from '../../components/ui/Card'
import { Table } from '../../components/ui/Table'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import type { Page, TeacherProfile } from '../../types'
import { Modal } from '../../components/ui/Modal'
import toast from 'react-hot-toast'
import { getErrorMessage } from '../../utils/errors'

export default function Teachers() {
  const [page, setPage] = useState<Page<TeacherProfile>>({ content: [], totalElements: 0, totalPages: 0, number: 0, size: 20 })
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)

  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [password, setPassword] = useState('')
  const [employeeId, setEmployeeId] = useState('')
  const [department, setDepartment] = useState('')
  const [designation, setDesignation] = useState('')

  const load = useCallback((p = 0, query = q) => {
    api.get<Page<TeacherProfile>>('/api/teachers', { params: { page: p, size: 10, q: query || undefined } })
      .then(r => setPage(r.data))
  }, [q])

  useEffect(() => { load(0) }, [load])

  const addTeacher = async () => {
    try {
      await api.post('/api/auth/register/teacher', { email, fullName, password, employeeId, department, designation })
      toast.success('Teacher created')
      setOpen(false)
      setEmail(''); setFullName(''); setPassword(''); setEmployeeId(''); setDepartment(''); setDesignation('')
      load(0)
    } catch (e: unknown) {
      toast.error(getErrorMessage(e))
    }
  }

  return (
    <Card title="Teachers">
      <div className="mb-2 flex flex-wrap gap-2">
        <Input placeholder="Search name/email/employeeId" value={q} onChange={e=>setQ(e.target.value)} />
        <Button variant="secondary" onClick={() => load(0, q)}>Search</Button>
        <Button onClick={() => setOpen(true)}>Add Teacher</Button>
      </div>
      <Table headers={['Name','Email','Employee ID','Department','Designation']}>
        {page.content.map(t => (
          <tr key={t.id}>
            <td className="p-3">{t.fullName}</td>
            <td className="p-3">{t.email}</td>
            <td className="p-3">{t.employeeId}</td>
            <td className="p-3">{t.department || '—'}</td>
            <td className="p-3">{t.designation || '—'}</td>
          </tr>
        ))}
      </Table>
      <div className="mt-3 flex items-center gap-2">
        <Button variant="secondary" disabled={page.number <= 0} onClick={() => load(page.number - 1, q)}>Prev</Button>
        <div className="text-xs text-gray-500 dark:text-gray-300">Page {page.number + 1} of {page.totalPages}</div>
        <Button variant="secondary" disabled={page.number + 1 >= page.totalPages} onClick={() => load(page.number + 1, q)}>Next</Button>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Add Teacher" footer={<Button onClick={addTeacher}>Save</Button>}>
        <div className="grid grid-cols-1 gap-2">
          <Input placeholder="Full Name" value={fullName} onChange={e=>setFullName(e.target.value)} />
          <Input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <Input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          <Input placeholder="Employee ID" value={employeeId} onChange={e=>setEmployeeId(e.target.value)} />
          <Input placeholder="Department" value={department} onChange={e=>setDepartment(e.target.value)} />
          <Input placeholder="Designation" value={designation} onChange={e=>setDesignation(e.target.value)} />
        </div>
      </Modal>
    </Card>
  )
}