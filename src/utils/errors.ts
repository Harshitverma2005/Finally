import { isAxiosError } from 'axios'

interface ApiError {
  error?: string
  message?: string
}

export function getErrorMessage(err: unknown): string {
  if (isAxiosError(err)) {
    const data = err.response?.data as ApiError | undefined
    return data?.error || data?.message || err.message
  }
  if (err instanceof Error) return err.message
  return 'Unexpected error'
}