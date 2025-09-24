import axios from 'axios'
import toast from 'react-hot-toast'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status
    const msg = err?.response?.data?.error || err?.message || 'Request failed'
    if (status === 401) {
      localStorage.removeItem('token')
      toast.error('Session expired. Please sign in.')
      window.location.href = '/login'
    } else if (status) {
      toast.error(msg)
    }
    return Promise.reject(err)
  }
)

export default api