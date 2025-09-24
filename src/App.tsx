import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { Toaster } from 'react-hot-toast'
import Layout from './components/layout/Layout'
import Login from './pages/Login'
import StudentDashboard from './pages/dashboards/StudentDashboard'
import TeacherDashboard from './pages/dashboards/TeacherDashboard'
import Assignments from './pages/assignments/Assignments'
import ManageAssignments from './pages/assignments/ManageAssignments'
import Notes from './pages/notes/Notes'
import ManageNotes from './pages/notes/ManageNotes'
import Announcements from './pages/announcements/Announcements'
import ManageAnnouncements from './pages/announcements/ManageAnnouncements'
import Grievances from './pages/grievances/Grievances'
import ManageGrievances from './pages/grievances/ManageGrievances'
import UploadMarks from './pages/uploads/UploadMarks'
import UploadAttendance from './pages/uploads/UploadAttendance'
import Students from './pages/admin/Students'
import Teachers from './pages/admin/Teachers'

const Protected: React.FC<{ children: React.ReactNode; roles?: Array<'ADMIN'|'TEACHER'|'STUDENT'> }> = ({ children, roles }) => {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Protected><Layout><Navigate to="/student" /></Layout></Protected>} />
          <Route path="/student" element={<Protected roles={['STUDENT']}><Layout><StudentDashboard /></Layout></Protected>} />
          <Route path="/teacher" element={<Protected roles={['TEACHER','ADMIN']}><Layout><TeacherDashboard /></Layout></Protected>} />
          <Route path="/assignments" element={<Protected roles={['STUDENT']}><Layout><Assignments /></Layout></Protected>} />
          <Route path="/manage/assignments" element={<Protected roles={['TEACHER','ADMIN']}><Layout><ManageAssignments /></Layout></Protected>} />
          <Route path="/notes" element={<Protected><Layout><Notes /></Layout></Protected>} />
          <Route path="/manage/notes" element={<Protected roles={['TEACHER','ADMIN']}><Layout><ManageNotes /></Layout></Protected>} />
          <Route path="/announcements" element={<Protected><Layout><Announcements /></Layout></Protected>} />
          <Route path="/manage/announcements" element={<Protected roles={['TEACHER','ADMIN']}><Layout><ManageAnnouncements /></Layout></Protected>} />
          <Route path="/grievances" element={<Protected roles={['STUDENT']}><Layout><Grievances /></Layout></Protected>} />
          <Route path="/manage/grievances" element={<Protected roles={['TEACHER','ADMIN']}><Layout><ManageGrievances /></Layout></Protected>} />
          <Route path="/manage/marks" element={<Protected roles={['TEACHER','ADMIN']}><Layout><UploadMarks /></Layout></Protected>} />
          <Route path="/manage/attendance" element={<Protected roles={['TEACHER','ADMIN']}><Layout><UploadAttendance /></Layout></Protected>} />
          <Route path="/students" element={<Protected roles={['TEACHER','ADMIN']}><Layout><Students /></Layout></Protected>} />
          <Route path="/teachers" element={<Protected roles={['ADMIN']}><Layout><Teachers /></Layout></Protected>} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  )
}