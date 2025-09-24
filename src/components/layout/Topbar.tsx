import { Button } from '../ui/Button'
import { useAuth } from '../../context/AuthContext'
import { Menu, Sun, Moon } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

const Topbar: React.FC<{ onMenu?: () => void }> = ({ onMenu }) => {
  const { user, logout } = useAuth()
  const { theme, toggle } = useTheme()
  const isDark = theme === 'dark'

  return (
    <div className="sticky top-0 z-30 flex h-14 items-center justify-between bg-white/70 backdrop-blur-md shadow-soft px-4 dark:bg-slate-900/70">
      <div className="md:hidden">
        <button onClick={onMenu} className="rounded p-2 hover:bg-black/5 dark:hover:bg-white/10"><Menu size={18} /></button>
      </div>
      <div className="text-sm">Hi, <b>{user?.fullName}</b></div>
      <div className="flex items-center gap-1">
        <Button variant="ghost" onClick={toggle} aria-label="Toggle theme">
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </Button>
        <Button variant="ghost" onClick={logout}>Logout</Button>
      </div>
    </div>
  )
}
export default Topbar