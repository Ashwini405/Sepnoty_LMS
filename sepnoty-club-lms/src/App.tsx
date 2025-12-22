
import { useState, useEffect, createContext, useContext } from 'react'
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sun, Moon, Menu, X, BookOpen, GraduationCap, Award,
  Clock, ChevronRight, LogOut, User,
  Bell, Search, Settings, Home, Sparkles, Zap,
  FileText, Briefcase, CreditCard, CheckCircle, Target
} from 'lucide-react'

import AuthForm from './components/AuthForm'
import Dashboard from './components/Dashboard'
import CourseDetail from './components/CourseDetail'
import AIAssistant from './components/AIAssistant'
import Assignments from './components/Assignments'
import ResumeBuilder from './components/ResumeBuilder'
import InterviewPrep from './components/InterviewPrep'

/* ================== API BASE ================== */
const API_URL = import.meta.env.VITE_API_URL

/* ================== TYPES ================== */
interface UserType {
  id: string
  email: string
  name: string
}

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning'
  read: boolean
  createdAt: string
}

interface Enrollment {
  id: string
  courseId: string | number
  progress: number
  enrolledAt: string
}

interface AuthContextType {
  user: UserType | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
  notifications: Notification[]
  markNotificationRead: (id: string) => void
  clearNotifications: () => void
  enrollments: Enrollment[]
  enrollInCourse: (courseId: string | number) => Promise<boolean>
  updateProgress: (courseId: string | number, progress: number) => void
  isEnrolled: (courseId: string | number) => boolean
  getProgress: (courseId: string | number) => number
  addNotification: (n: Omit<Notification, 'id' | 'read' | 'createdAt'>) => void
}

/* ================== CONTEXT ================== */
const AuthContext = createContext<AuthContextType | null>(null)

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside provider')
  return ctx
}

/* ================== PROVIDER ================== */
function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('sepnoty_user') || 'null'))
    setNotifications(JSON.parse(localStorage.getItem('sepnoty_notifications') || '[]'))
    setEnrollments(JSON.parse(localStorage.getItem('sepnoty_enrollments') || '[]'))
    setIsLoading(false)
  }, [])

  useEffect(() => {
    localStorage.setItem('sepnoty_notifications', JSON.stringify(notifications))
  }, [notifications])

  useEffect(() => {
    localStorage.setItem('sepnoty_enrollments', JSON.stringify(enrollments))
  }, [enrollments])

  const addNotification = (n: Omit<Notification, 'id' | 'read' | 'createdAt'>) => {
    setNotifications(prev => [{
      ...n,
      id: Date.now().toString(),
      read: false,
      createdAt: new Date().toISOString()
    }, ...prev])
  }

  const markNotificationRead = (id: string) =>
    setNotifications(n => n.map(x => x.id === id ? { ...x, read: true } : x))

  const clearNotifications = () => setNotifications([])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setUser(data.user)
      localStorage.setItem('sepnoty_user', JSON.stringify(data.user))
      addNotification({ title: 'Welcome Back!', message: `Hi ${data.user.name}`, type: 'info' })
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setUser(data.user)
      localStorage.setItem('sepnoty_user', JSON.stringify(data.user))
      addNotification({ title: 'Account Created', message: 'Welcome to Sepnoty!', type: 'success' })
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('sepnoty_user')
  }

  const enrollInCourse = async (courseId: string | number) => {
    if (isEnrolled(courseId)) return true
    setEnrollments(e => [...e, {
      id: Date.now().toString(),
      courseId,
      progress: 0,
      enrolledAt: new Date().toISOString()
    }])
    await fetch(`${API_URL}/api/courses/${courseId}/enroll`, { method: 'POST' })
    addNotification({ title: 'Enrolled', message: 'Course added', type: 'success' })
    return true
  }

  const updateProgress = (courseId: string | number, progress: number) =>
    setEnrollments(e => e.map(x => x.courseId === courseId ? { ...x, progress } : x))

  const isEnrolled = (courseId: string | number) =>
    enrollments.some(e => String(e.courseId) === String(courseId))

  const getProgress = (courseId: string | number) =>
    enrollments.find(e => String(e.courseId) === String(courseId))?.progress || 0

  return (
    <AuthContext.Provider value={{
      user, login, register, logout, isLoading,
      notifications, markNotificationRead, clearNotifications,
      enrollments, enrollInCourse, updateProgress,
      isEnrolled, getProgress, addNotification
    }}>
      {children}
    </AuthContext.Provider>
  )
}

/* ================== ROUTE GUARD ================== */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  if (isLoading) return <div className="h-screen flex items-center justify-center">Loading...</div>
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

/* ================== ROUTES ================== */
function AppContent() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/login" element={<AuthForm />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/course/:id" element={<ProtectedRoute><CourseDetail /></ProtectedRoute>} />
        <Route path="/ai" element={<ProtectedRoute><AIAssistant /></ProtectedRoute>} />
        <Route path="/assignments" element={<ProtectedRoute><Assignments /></ProtectedRoute>} />
        <Route path="/resume" element={<ProtectedRoute><ResumeBuilder /></ProtectedRoute>} />
        <Route path="/interview" element={<ProtectedRoute><InterviewPrep /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </HashRouter>
  )
}
