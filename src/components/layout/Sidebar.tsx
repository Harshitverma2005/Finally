import { NavLink } from 'react-router-dom'
import clsx from 'clsx'
import { useAuth } from '../../context/AuthContext'
import { BookOpen, FileText, Megaphone, Users, UserCog, BarChart3, Upload, ClipboardList } from 'lucide-react'

const Item: React.FC<{ to: string; icon: React.ReactNode; label: string }> = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      clsx('flex items-center gap-2 rounded px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/10',
        isActive && 'bg-black/5 dark:bg-white/10 font-semibold')
    }
  >
    {icon}<span>{label}</span>
  </NavLink>
)

const Sidebar: React.FC = () => {
  const { user } = useAuth()
  const isStudent = user?.role === 'STUDENT'
  const isTeacher = user?.role === 'TEACHER' || user?.role === 'ADMIN'
  const isAdmin = user?.role === 'ADMIN'

  return (
    <aside className="hidden md:flex w-64 flex-col gap-2 p-4">
      <div className="text-lg font-bold tracking-tight">Academic Portal</div>
      <div className="mt-2 flex-1 rounded-xl p-2 glass">
        <div className="space-y-1">
          {isStudent && <>
            <Item to="/student" icon={<BarChart3 size={16} />} label="Dashboard" />
            <Item to="/assignments" icon={<FileText size={16} />} label="Assignments" />
            <Item to="/notes" icon={<BookOpen size={16} />} label="Notes" />
            <Item to="/grievances" icon={<ClipboardList size={16} />} label="Grievances" />
            <Item to="/announcements" icon={<Megaphone size={16} />} label="Announcements" />
          </>}
          {isTeacher && <>
            <Item to="/teacher" icon={<BarChart3 size={16} />} label="Dashboard" />
            <Item to="/manage/assignments" icon={<FileText size={16} />} label="Manage Assignments" />
            <Item to="/manage/notes" icon={<BookOpen size={16} />} label="Upload Notes" />
            <Item to="/manage/marks" icon={<Upload size={16} />} label="Upload Marks" />
            <Item to="/manage/attendance" icon={<Upload size={16} />} label="Upload Attendance" />
            <Item to="/manage/grievances" icon={<ClipboardList size={16} />} label="Grievances" />
            <Item to="/announcements" icon={<Megaphone size={16} />} label="Announcements" />
            <Item to="/students" icon={<Users size={16} />} label="Students" />
          </>}
          {isAdmin && <Item to="/teachers" icon={<UserCog size={16} />} label="Teachers" />}
        </div>
      </div>
      <div className="text-xs text-gray-500 px-2">v1.0.0</div>
    </aside>
  )
}
export default Sidebar