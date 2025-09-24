import { useEffect, useState } from 'react'
import api from '../../api/axios'
import { Card } from '../../components/ui/Card'

type TeacherDashboardData = {
  studentCount: number
  pendingGrievances: number
  assignmentsPosted: number
}

export default function TeacherDashboard() {
  const [data, setData] = useState<TeacherDashboardData | null>(null)
  useEffect(() => { api.get<TeacherDashboardData>('/api/dashboard/teacher').then(r => setData(r.data)) }, [])
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card title="Total Students"><div className="text-3xl font-bold">{data?.studentCount || 0}</div></Card>
      <Card title="Pending Grievances"><div className="text-3xl font-bold">{data?.pendingGrievances || 0}</div></Card>
      <Card title="Assignments Posted"><div className="text-3xl font-bold">{data?.assignmentsPosted || 0}</div></Card>
    </div>
  )
}