import { createContext, useContext, useEffect, useState } from 'react'
import api from '../api/axios'
import type { AuthUser } from '../types'

type AuthCtx = {
  user: AuthUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const Ctx = createContext<AuthCtx | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchMe = async () => {
    try {
      const r = await api.get<AuthUser>('/api/auth/me')
      setUser(r.data)
    } catch {
      // not logged in; ignore
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (localStorage.getItem('token')) fetchMe()
    else setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const res = await api.post('/api/auth/login', { email, password })
    localStorage.setItem('token', res.data.token)
    setUser(res.data.user)
  }

  const logout = () => { localStorage.removeItem('token'); setUser(null) }

  return <Ctx.Provider value={{ user, loading, login, logout }}>{children}</Ctx.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}