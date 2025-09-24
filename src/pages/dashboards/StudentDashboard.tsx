import { useEffect, useState } from 'react'
import api from '../../api/axios'
import { Card } from '../../components/ui/Card'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, LineChart, Line } from 'recharts'
import { Button } from '../../components/ui/Button'
import type { Mark, Assignment, StudentProfile } from '../../types'
import { pct } from '../../utils/format'

type StudentDashboardData = {
  attendancePercentage: number
  averageScore: number
  recentAssignments: { id: number; title: string; dueDate?: string }[]
  announcements: { id: number; title: string; message: string }[]
}

export default function StudentDashboard() {
  const [dash, setDash] = useState<StudentDashboardData | null>(null)
  const [marks, setMarks] = useState<Mark[]>([])
  const [student, setStudent] = useState<StudentProfile | null>(null)

  useEffect(() => {
    api.get<StudentDashboardData>('/api/dashboard/student').then(r => setDash(r.data))
    api.get<Mark[]>('/api/marks/my').then(r => setMarks(r.data))
    api.get<StudentProfile>('/api/students/me').then(r => setStudent(r.data))
  }, [])

  const attendance = [
    { name: 'Present', value: dash?.attendancePercentage || 0 },
    { name: 'Absent', value: 100 - (dash?.attendancePercentage || 0) }
  ]

  const grouped: Record<string, { subject: string; pct: number; count: number }> = {}
  for (const m of marks) {
    const key = m.subject
    if (!grouped[key]) grouped[key] = { subject: m.subject, pct: 0, count: 0 }
    grouped[key].pct += (m.score / m.maxScore) * 100
    grouped[key].count += 1
  }
  const marksBySubject = Object.values(grouped).map(v => ({
    subject: v.subject,
    pct: Math.round((v.pct / v.count) * 100) / 100
  }))

  const trendMap: Record<string, { date: string; total: number; count: number }> = {}
  for (const m of marks) {
    const key = m.date || 'N/A'
    const p = (m.score / m.maxScore) * 100
    if (!trendMap[key]) trendMap[key] = { date: key, total: 0, count: 0 }
    trendMap[key].total += p
    trendMap[key].count += 1
  }
  const trend = Object.values(trendMap)
    .map(v => ({ date: v.date, avg: +(v.total / v.count).toFixed(2) }))
    .sort((a, b) => (a.date || '').localeCompare(b.date || ''))

  const downloadReport = () => {
    if (!student) return
    const url = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/reports/students/${student.id}`
    window.open(url, '_blank')
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card title="Attendance">
        <div className="h-64">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={attendance} dataKey="value" nameKey="name" outerRadius={100} label>
                <Cell fill="#10b981" /><Cell fill="#ef4444" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="text-sm text-gray-500 mt-2 dark:text-gray-300">Attendance: {dash ? pct(dash.attendancePercentage) : '—'}</div>
        </div>
      </Card>

      <Card title="Average Marks">
        <div className="h-64">
          <ResponsiveContainer>
            <BarChart data={marksBySubject}>
              <XAxis dataKey="subject" /><YAxis domain={[0, 100]} /><Tooltip />
              <Bar dataKey="pct" fill="#0ea5e9" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="text-sm text-gray-500 mt-2 dark:text-gray-300">Overall Avg: {dash ? pct(dash.averageScore) : '—'}</div>
        </div>
      </Card>

      <Card title="Performance Trend (Avg % by Date)" className="md:col-span-2">
        <div className="h-72">
          <ResponsiveContainer>
            <LineChart data={trend}>
              <XAxis dataKey="date" /><YAxis domain={[0, 100]} /><Tooltip />
              <Line type="monotone" dataKey="avg" stroke="#22c55e" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card title="Recent Assignments">
        <ul className="space-y-2">
          {dash?.recentAssignments?.map((a: Assignment) => (
            <li key={a.id} className="rounded border p-2">
              <div className="font-medium">{a.title}</div>
              <div className="text-xs text-gray-500 dark:text-gray-300">Due: {a.dueDate || 'N/A'}</div>
            </li>
          ))}
        </ul>
      </Card>

      <Card title="Announcements">
        <ul className="space-y-2">
          {dash?.announcements?.map((an) => (
            <li key={an.id} className="rounded border p-2">
              <div className="font-medium">{an.title}</div>
              <div className="text-xs text-gray-500 dark:text-gray-300">{an.message}</div>
            </li>
          ))}
        </ul>
      </Card>

      <div className="md:col-span-2">
        <Button onClick={downloadReport}>Download Performance PDF</Button>
      </div>
    </div>
  )
}