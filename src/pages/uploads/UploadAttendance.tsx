import { useRef, useState } from 'react'
import api from '../../api/axios'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import toast from 'react-hot-toast'
import Papa from 'papaparse'
import { getErrorMessage } from '../../utils/errors'

type Row = { studentId: string; subject: string; date: string; present: string }

export default function UploadAttendance() {
  const [rows, setRows] = useState<Row[]>([{ studentId: '', subject: '', date: '', present: 'true' }])
  const fileRef = useRef<HTMLInputElement>(null)

  const add = () => setRows([...rows, { studentId: '', subject: '', date: '', present: 'true' }])
  const update = (i: number, k: keyof Row, v: string) => setRows(rows.map((r, idx) => idx===i ? {...r, [k]: v} : r))
  const submit = async () => {
    try {
      const payload = rows
        .filter(r => r.studentId && r.subject && r.date)
        .map(r => ({...r, studentId: Number(r.studentId), present: r.present.toLowerCase() === 'true'}))
      if (!payload.length) return toast.error('Nothing to upload')
      await api.post('/api/attendance/bulk', payload)
      toast.success('Uploaded')
    } catch (e: unknown) {
      toast.error(getErrorMessage(e))
    }
  }

  const importCsv = (file: File) => {
    Papa.parse<Row>(file, {
      header: true, skipEmptyLines: true,
      complete: (res) => {
        const incoming = res.data.map(d => ({
          studentId: String(d.studentId || '').trim(),
          subject: String(d.subject || '').trim(),
          date: String(d.date || '').trim(),
          present: String(d.present || 'true').trim()
        }))
        setRows(prev => [...prev, ...incoming])
        toast.success(`Imported ${incoming.length} rows`)
      },
      error: () => toast.error('CSV parse failed')
    })
  }

  const onPickCsv = () => fileRef.current?.click()

  const downloadTemplate = () => {
    const headers = 'studentId,subject,date,present\n'
    const sample = '1,Math,2025-01-10,true\n'
    const blob = new Blob([headers + sample], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'attendance_template.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Card title="Upload Attendance (Bulk)">
      <div className="flex flex-wrap gap-2 mb-3">
        <Button variant="secondary" onClick={downloadTemplate}>Download CSV Template</Button>
        <Button variant="secondary" onClick={onPickCsv}>Import CSV</Button>
        <input type="file" ref={fileRef} accept=".csv,text/csv" className="hidden" onChange={e => {
          const f = e.target.files?.[0]; if (f) importCsv(f); e.currentTarget.value = ''
        }} />
      </div>
      <div className="space-y-2">
        {rows.map((r, i) => <div key={i} className="grid md:grid-cols-4 gap-2">
          <Input placeholder="Student ID" value={r.studentId} onChange={e=>update(i,'studentId',e.target.value)} />
          <Input placeholder="Subject" value={r.subject} onChange={e=>update(i,'subject',e.target.value)} />
          <Input placeholder="Date (YYYY-MM-DD)" value={r.date} onChange={e=>update(i,'date',e.target.value)} />
          <Input placeholder="Present (true/false)" value={r.present} onChange={e=>update(i,'present',e.target.value)} />
        </div>)}
        <div className="flex gap-2">
          <Button onClick={add}>Add Row</Button>
          <Button onClick={submit}>Submit</Button>
        </div>
      </div>
    </Card>
  )
}