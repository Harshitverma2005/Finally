import { useState } from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import { motion, AnimatePresence } from 'framer-motion'
import { Sidebar as SidebarIcon, BarChart3, FileText, BookOpen, ClipboardList, Megaphone, Users, UserCog, Upload } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import clsx from 'clsx'

const MobileItem: React.FC<{ to: string; icon: React.ReactNode; label: string; onClick: () => void }> = ({ to, icon, label, onClick }) => (
  <NavLink to={to} onClick={onClick} className={({ isActive }) =>
    clsx('flex items-center gap-2 rounded px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/10', isActive && 'bg-black/5 dark:bg-white/10 font-semibold')}>
    {icon}<span>{label}</span>
  </NavLink>
)

export default function Layout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const { user } = useAuth()
  const isStudent = user?.role === 'STUDENT'
  const isTeacher = user?.role === 'TEACHER' || user?.role === 'ADMIN'
  const isAdmin = user?.role === 'ADMIN'

  return (
    <div className="min-h-screen">
      <Topbar onMenu={() => setOpen(true)} />
      <div className="flex">
        <Sidebar />
        <AnimatePresence>
          {open && (
            <motion.aside className="fixed inset-0 z-40 bg-black/30 md:hidden"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}>
              <motion.div className="absolute left-0 top-0 h-full w-72 bg-white p-4 dark:bg-slate-900 dark:text-slate-100"
                initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }} onClick={(e) => e.stopPropagation()}>
                <div className="mb-2 flex items-center gap-2 text-lg font-bold"><SidebarIcon size={18}/> Menu</div>
                <div className="space-y-1">
                  {isStudent && <>
                    <MobileItem to="/student" icon={<BarChart3 size={16} />} label="Dashboard" onClick={()=>setOpen(false)} />
                    <MobileItem to="/assignments" icon={<FileText size={16} />} label="Assignments" onClick={()=>setOpen(false)} />
                    <MobileItem to="/notes" icon={<BookOpen size={16} />} label="Notes" onClick={()=>setOpen(false)} />
                    <MobileItem to="/grievances" icon={<ClipboardList size={16} />} label="Grievances" onClick={()=>setOpen(false)} />
                    <MobileItem to="/announcements" icon={<Megaphone size={16} />} label="Announcements" onClick={()=>setOpen(false)} />
                  </>}
                  {isTeacher && <>
                    <MobileItem to="/teacher" icon={<BarChart3 size={16} />} label="Dashboard" onClick={()=>setOpen(false)} />
                    <MobileItem to="/manage/assignments" icon={<FileText size={16} />} label="Manage Assignments" onClick={()=>setOpen(false)} />
                    <MobileItem to="/manage/notes" icon={<BookOpen size={16} />} label="Upload Notes" onClick={()=>setOpen(false)} />
                    <MobileItem to="/manage/marks" icon={<Upload size={16} />} label="Upload Marks" onClick={()=>setOpen(false)} />
                    <MobileItem to="/manage/attendance" icon={<Upload size={16} />} label="Upload Attendance" onClick={()=>setOpen(false)} />
                    <MobileItem to="/manage/grievances" icon={<ClipboardList size={16} />} label="Grievances" onClick={()=>setOpen(false)} />
                    <MobileItem to="/announcements" icon={<Megaphone size={16} />} label="Announcements" onClick={()=>setOpen(false)} />
                    <MobileItem to="/students" icon={<Users size={16} />} label="Students" onClick={()=>setOpen(false)} />
                  </>}
                  {isAdmin && <MobileItem to="/teachers" icon={<UserCog size={16} />} label="Teachers" onClick={()=>setOpen(false)} />}
                </div>
              </motion.div>
            </motion.aside>
          )}
        </AnimatePresence>
        <main className="flex-1 p-4">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-7xl">
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  )
}