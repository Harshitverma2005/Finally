import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { motion } from 'framer-motion'
import { getErrorMessage } from '../utils/errors'

export default function Login() {
  const { login } = useAuth()
  const [email, setEmail] = useState('student1@portal.com')
  const [password, setPassword] = useState('password')
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(email, password)
      toast.success('Welcome!')
      nav('/')
    } catch (e: unknown) {
      toast.error(getErrorMessage(e))
    } finally { setLoading(false) }
  }

  return (
    <div className="grid min-h-screen place-items-center p-4">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="glass w-full max-w-md rounded-xl p-6">
        <div className="mb-4 text-2xl font-bold">Sign in</div>
        <form onSubmit={onSubmit} className="space-y-3">
          <Input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <Input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          <Button className="w-full" loading={loading}>Sign in</Button>
        </form>
        <div className="mt-3 text-xs text-gray-500">Tip: Try student1@portal.com / password or teacher1@portal.com / password</div>
      </motion.div>
    </div>
  )
}