export type Role = 'ADMIN' | 'TEACHER' | 'STUDENT'

export type AuthUser = {
  id: number
  email: string
  fullName: string
  role: Role
}

export type Page<T> = {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}

export type UserBrief = { id: number; email?: string; fullName?: string; role?: Role }
export type StudentBrief = { id: number; user?: UserBrief }
export type TeacherBrief = { id: number; user?: UserBrief }

export type Assignment = {
  id: number
  title: string
  description?: string
  subject?: string
  dueDate?: string
  createdBy?: TeacherBrief
  resourceUrl?: string
  filePath?: string
}

export type AssignmentSubmission = {
  id: number
  assignment: Assignment
  student: StudentBrief
  submittedAt?: string
  filePath?: string
  status?: string
  grade?: string
  feedback?: string
}

export type Note = {
  id: number
  title: string
  description?: string
  subject?: string
  link?: string
  filePath?: string
}

export type Announcement = {
  id: number
  title: string
  message: string
  audience: string
}

export type Mark = {
  id: number
  subject: string
  examType?: string
  score: number
  maxScore: number
  date?: string
}

export type Attendance = {
  id: number
  subject: string
  date: string
  present: boolean
}

export type StudentProfile = {
  id: number
  userId: number
  fullName: string
  email: string
  enrollmentNo: string
  department?: string
  batch?: string
  createdAt?: string
}

export type TeacherProfile = {
  id: number
  userId: number
  fullName: string
  email: string
  employeeId: string
  department?: string
  designation?: string
}