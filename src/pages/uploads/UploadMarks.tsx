import { useRef, useState } from 'react'
import api from '../../api/axios'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import toast from 'react-hot-toast'
import Papa from 'papaparse'
import { getErrorMessage } from '../../utils/errors'

type Row = { studentId: string; subject: string; examType: string; score: string; maxScore: string; date: string }

export default function UploadMarks() {
  const [rows, setRows] = useState<Row[]>([{ studentId: '', subject: '', examType: '', score: '', maxScore: '', date: '' }])
  const fileRef = useRef<HTMLInputElement>(null)

  const add = () => setRows(r => [...r, { studentId: '', subject: '', examType: '', score: '', maxScore: '', date: '' }])
  const update = (i: number, k: keyof Row, v: string) => setRows(rows.map((r, idx) => idx===i ? {...r, [k]: v} : r))
  const submit = async () => {
    try {
      const payload = rows
        .filter(r => r.studentId && r.subject && r.score && r.maxScore)
        .map(r => ({...r, studentId: Number(r.studentId), score: Number(r.score), maxScore: Number(r.maxScore)}))
      if (!payload.length) return toast.error('Nothing to upload')
      await api.post('/api/marks/bulk', payload)
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
          examType: String((d as Row).examType || '').trim(),
          score: String(d.score || '').trim(),
          maxScore: String((d as Row).maxScore || '').trim(),
          date: String(d.date || '').trim()
        }))
        setRows(prev => [...prev, ...incoming])
        toast.success(`Imported ${incoming.length} rows`)
      },
      error: () => toast.error('CSV parse failed')
    })
  }

  const onPickCsv = () => fileRef.current?.click()

  const downloadTemplate = () => {
    const headers = 'studentId,subject,examType,score,maxScore,date\n'
    const sample = '1,Math,Midterm,78,100,2025-01-10\n'
    const blob = new Blob([headers + sample], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'marks_template.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Card title="Upload Marks (Bulk)">
      <div className="flex flex-wrap gap-2 mb-3">
        <Button variant="secondary" onClick={downloadTemplate}>Download CSV Template</Button>
        <Button variant="secondary" onClick={onPickCsv}>Import CSV</Button>
        <input type="file" ref={fileRef} accept=".csv,text/csv" className="hidden" onChange={e => {
          const f = e.target.files?.[0]; if (f) importCsv(f); e.currentTarget.value = ''
        }} />
      </div>
      <div className="space-y-2">
        {rows.map((r, i) => <div key={i} className="grid md:grid-cols-6 gap-2">
          <Input placeholder="Student ID" value={r.studentId} onChange={e=>update(i,'studentId',e.target.value)} />
          <Input placeholder="Subject" value={r.subject} onChange={e=>update(i,'subject',e.target.value)} />
          <Input placeholder="Exam Type" value={r.examType} onChange={e=>update(i,'examType',e.target.value)} />
          <Input placeholder="Score" value={r.score} onChange={e=>update(i,'score',e.target.value)} />
          <Input placeholder="Max Score" value={r.maxScore} onChange={e=>update(i,'maxScore',e.target.value)} />
          <Input placeholder="Date (YYYY-MM-DD)" value={r.date} onChange={e=>update(i,'date',e.target.value)} />
        </div>)}
        <div className="flex gap-2">
          <Button onClick={add}>Add Row</Button>
          <Button onClick={submit}>Submit</Button>
        </div>
      </div>
    </Card>
  )
}