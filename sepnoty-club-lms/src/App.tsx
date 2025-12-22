// import { useState, useEffect, createContext, useContext } from 'react'
// import { HashRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
// import { motion, AnimatePresence } from 'framer-motion'
// import { 
//   Sun, Moon, Menu, X, BookOpen, GraduationCap, Award, 
//   TrendingUp, Clock, Star, ChevronRight, LogOut, User,
//   Bell, Search, Settings, Home, Sparkles, Zap, Target,
//   FileText, Briefcase, CreditCard, CheckCircle
// } from 'lucide-react'
// import AuthForm from './components/AuthForm'
// import Dashboard from './components/Dashboard'
// import CourseCard from './components/CourseCard'
// import CourseDetail from './components/CourseDetail'
// import AIAssistant from './components/AIAssistant'
// import Assignments from './components/Assignments'
// import ResumeBuilder from './components/ResumeBuilder'
// import InterviewPrep from './components/InterviewPrep'

// interface UserType {
//   id: string
//   email: string
//   name: string
//   avatar?: string
// }

// interface Notification {
//   id: string
//   title: string
//   message: string
//   type: 'info' | 'success' | 'warning' | 'course' | 'assignment'
//   read: boolean
//   createdAt: string
// }

// interface Enrollment {
//   id: string
//   courseId: string | number
//   progress: number
//   enrolledAt: string
// }

// interface AuthContextType {
//   user: UserType | null
//   login: (email: string, password: string) => Promise<void>
//   register: (name: string, email: string, password: string) => Promise<void>
//   logout: () => void
//   isLoading: boolean
//   notifications: Notification[]
//   markNotificationRead: (id: string) => void
//   clearNotifications: () => void
//   enrollments: Enrollment[]
//   enrollInCourse: (courseId: string | number, isPaid?: boolean, price?: number) => Promise<boolean>
//   updateProgress: (courseId: string | number, progress: number) => void
//   isEnrolled: (courseId: string | number) => boolean
//   getProgress: (courseId: string | number) => number
//   addNotification: (notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => void
// }

// const AuthContext = createContext<AuthContextType | null>(null)

// export const useAuth = () => {
//   const context = useContext(AuthContext)
//   if (!context) throw new Error('useAuth must be used within AuthProvider')
//   return context
// }

// function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<UserType | null>(null)
//   const [isLoading, setIsLoading] = useState(true)
//   const [notifications, setNotifications] = useState<Notification[]>([])
//   const [enrollments, setEnrollments] = useState<Enrollment[]>([])

//   useEffect(() => {
//     const savedUser = localStorage.getItem('sepnoty_user')
//     const savedNotifications = localStorage.getItem('sepnoty_notifications')
//     const savedEnrollments = localStorage.getItem('sepnoty_enrollments')
    
//     if (savedUser) {
//       setUser(JSON.parse(savedUser))
//     }
//     if (savedNotifications) {
//       setNotifications(JSON.parse(savedNotifications))
//     }
//     if (savedEnrollments) {
//       setEnrollments(JSON.parse(savedEnrollments))
//     }
//     setIsLoading(false)
//   }, [])

//   useEffect(() => {
//     if (notifications.length > 0) {
//       localStorage.setItem('sepnoty_notifications', JSON.stringify(notifications))
//     }
//   }, [notifications])

//   useEffect(() => {
//     if (enrollments.length > 0) {
//       localStorage.setItem('sepnoty_enrollments', JSON.stringify(enrollments))
//     }
//   }, [enrollments])

//   const addNotification = (notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => {
//     const newNotification: Notification = {
//       ...notification,
//       id: Date.now().toString(),
//       read: false,
//       createdAt: new Date().toISOString()
//     }
//     setNotifications(prev => [newNotification, ...prev])
//   }

//   const markNotificationRead = (id: string) => {
//     setNotifications(prev => 
//       prev.map(n => n.id === id ? { ...n, read: true } : n)
//     )
//   }

//   const clearNotifications = () => {
//     setNotifications([])
//     localStorage.removeItem('sepnoty_notifications')
//   }

//   const enrollInCourse = async (courseId: string | number, isPaid = false, price = 0): Promise<boolean> => {
//     if (isEnrolled(courseId)) return true

//     const newEnrollment: Enrollment = {
//       id: Date.now().toString(),
//       courseId,
//       progress: 0,
//       enrolledAt: new Date().toISOString()
//     }

//     setEnrollments(prev => [...prev, newEnrollment])

//     try {
//       await fetch('api/courses/' + courseId + '/enroll', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ userId: user?.id })
//       })
//     } catch (err) {
//       console.error('Enrollment sync error:', err)
//     }

//     addNotification({
//       title: 'Enrollment Successful! 🎉',
//       message: isPaid 
//         ? `You've purchased the course for $${price}. Start learning now!`
//         : 'You\'ve successfully enrolled in a new course. Start learning now!',
//       type: 'success'
//     })

//     return true
//   }

//   const updateProgress = (courseId: string | number, progress: number) => {
//     setEnrollments(prev => 
//       prev.map(e => 
//         e.courseId === courseId ? { ...e, progress: Math.min(100, progress) } : e
//       )
//     )

//     if (progress === 100) {
//       addNotification({
//         title: 'Course Completed! 🏆',
//         message: 'Congratulations! You\'ve completed a course. Check your certificates!',
//         type: 'success'
//       })
//     } else if (progress === 50) {
//       addNotification({
//         title: 'Halfway There! 💪',
//         message: 'You\'re 50% through the course. Keep up the great work!',
//         type: 'info'
//       })
//     }
//   }

//   const isEnrolled = (courseId: string | number) => {
//     return enrollments.some(e => String(e.courseId) === String(courseId))
//   }

//   const getProgress = (courseId: string | number) => {
//     const enrollment = enrollments.find(e => String(e.courseId) === String(courseId))
//     return enrollment?.progress || 0
//   }

//   const login = async (email: string, password: string) => {
//     setIsLoading(true)
//     try {
//       const res = await fetch('api/auth/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password })
//       })
//       const data = await res.json().catch(() => ({}))
//       if (!res.ok) throw new Error(data.error || 'Login failed')
//       setUser(data.user)
//       localStorage.setItem('sepnoty_user', JSON.stringify(data.user))
      
//       addNotification({
//         title: 'Welcome Back! 👋',
//         message: `Good to see you again, ${data.user.name}!`,
//         type: 'info'
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const register = async (name: string, email: string, password: string) => {
//     setIsLoading(true)
//     try {
//       const res = await fetch('api/auth/register', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ name, email, password })
//       })
//       const data = await res.json().catch(() => ({}))
//       if (!res.ok) throw new Error(data.error || 'Registration failed')
//       setUser(data.user)
//       localStorage.setItem('sepnoty_user', JSON.stringify(data.user))
      
//       addNotification({
//         title: 'Welcome to Sepnoty Club! 🎓',
//         message: 'Your account has been created. Explore our courses and start learning!',
//         type: 'success'
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const logout = () => {
//     setUser(null)
//     localStorage.removeItem('sepnoty_user')
//   }

//   return (
//     <AuthContext.Provider value={{ 
//       user, login, register, logout, isLoading,
//       notifications, markNotificationRead, clearNotifications,
//       enrollments, enrollInCourse, updateProgress, isEnrolled, getProgress,
//       addNotification
//     }}>
//       {children}
//     </AuthContext.Provider>
//   )
// }

// function NotificationPanel({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
//   const { notifications, markNotificationRead, clearNotifications } = useAuth()

//   const getIcon = (type: string) => {
//     switch (type) {
//       case 'success': return <CheckCircle className="w-5 h-5 text-success" />
//       case 'warning': return <Bell className="w-5 h-5 text-warning" />
//       case 'course': return <BookOpen className="w-5 h-5 text-primary" />
//       case 'assignment': return <FileText className="w-5 h-5 text-accent" />
//       default: return <Bell className="w-5 h-5 text-primary" />
//     }
//   }

//   if (!isOpen) return null

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: -10, scale: 0.95 }}
//       animate={{ opacity: 1, y: 0, scale: 1 }}
//       exit={{ opacity: 0, y: -10, scale: 0.95 }}
//       className="absolute top-full right-0 mt-2 w-80 md:w-96 bg-surface rounded-2xl shadow-2xl border border-border overflow-hidden z-50"
//     >
//       <div className="p-4 border-b border-border flex items-center justify-between">
//         <h3 className="font-semibold text-foreground">Notifications</h3>
//         {notifications.length > 0 && (
//           <button 
//             onClick={clearNotifications}
//             className="text-xs text-muted hover:text-foreground transition-colors"
//           >
//             Clear all
//           </button>
//         )}
//       </div>
//       <div className="max-h-96 overflow-y-auto">
//         {notifications.length === 0 ? (
//           <div className="p-8 text-center">
//             <Bell className="w-12 h-12 text-muted mx-auto mb-3" />
//             <p className="text-muted">No notifications yet</p>
//           </div>
//         ) : (
//           notifications.map((notification) => (
//             <motion.div
//               key={notification.id}
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               onClick={() => markNotificationRead(notification.id)}
//               className={`p-4 border-b border-border hover:bg-background/50 cursor-pointer transition-colors ${
//                 !notification.read ? 'bg-primary/5' : ''
//               }`}
//             >
//               <div className="flex gap-3">
//                 <div className="flex-shrink-0 mt-1">
//                   {getIcon(notification.type)}
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <p className="font-medium text-foreground text-sm">{notification.title}</p>
//                   <p className="text-xs text-muted mt-1">{notification.message}</p>
//                   <p className="text-xs text-muted mt-2">
//                     {new Date(notification.createdAt).toLocaleDateString()}
//                   </p>
//                 </div>
//                 {!notification.read && (
//                   <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />
//                 )}
//               </div>
//             </motion.div>
//           ))
//         )}
//       </div>
//     </motion.div>
//   )
// }

// function Header({ darkMode, setDarkMode }: { darkMode: boolean; setDarkMode: (v: boolean) => void }) {
//   const { user, logout, notifications } = useAuth()
//   const [menuOpen, setMenuOpen] = useState(false)
//   const [searchOpen, setSearchOpen] = useState(false)
//   const [notificationsOpen, setNotificationsOpen] = useState(false)
//   const navigate = useNavigate()

//   const unreadCount = notifications.filter(n => !n.read).length

//   return (
//     <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border">
//       <div className="max-w-7xl mx-auto px-4 md:px-8">
//         <div className="flex items-center justify-between h-16 md:h-20">
//           <motion.div 
//             className="flex items-center gap-2 cursor-pointer"
//             whileHover={{ scale: 1.02 }}
//             onClick={() => navigate('/')}
//           >
//             <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center">
//               <GraduationCap className="w-6 h-6 text-white" />
//             </div>
//             <span className="text-xl font-bold gradient-text hidden sm:block">Sepnoty Club</span>
//           </motion.div>

//           {user && (
//             <div className="hidden lg:flex items-center gap-1 bg-surface rounded-full px-2 py-1.5">
//               {[
//                 { icon: Home, label: 'Home', path: '/dashboard' },
//                 { icon: BookOpen, label: 'Courses', path: '/courses' },
//                 { icon: FileText, label: 'Assignments', path: '/assignments' },
//                 { icon: Sparkles, label: 'AI Tutor', path: '/ai' },
//                 { icon: Briefcase, label: 'Career', path: '/resume' },
//               ].map((item) => (
//                 <motion.button
//                   key={item.label}
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   onClick={() => navigate(item.path)}
//                   className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-muted hover:text-foreground hover:bg-background transition-all"
//                 >
//                   <item.icon className="w-4 h-4" />
//                   {item.label}
//                 </motion.button>
//               ))}
//             </div>
//           )}

//           <div className="flex items-center gap-2 md:gap-4">
//             {user && (
//               <>
//                 <motion.button
//                   whileHover={{ scale: 1.1 }}
//                   whileTap={{ scale: 0.9 }}
//                   onClick={() => setSearchOpen(!searchOpen)}
//                   className="p-2.5 rounded-xl bg-surface hover:bg-border transition-colors"
//                 >
//                   <Search className="w-5 h-5 text-muted" />
//                 </motion.button>
//                 <div className="relative">
//                   <motion.button
//                     whileHover={{ scale: 1.1 }}
//                     whileTap={{ scale: 0.9 }}
//                     onClick={() => setNotificationsOpen(!notificationsOpen)}
//                     className="p-2.5 rounded-xl bg-surface hover:bg-border transition-colors relative"
//                   >
//                     <Bell className="w-5 h-5 text-muted" />
//                     {unreadCount > 0 && (
//                       <span className="absolute -top-1 -right-1 w-5 h-5 bg-danger rounded-full text-white text-xs flex items-center justify-center font-medium">
//                         {unreadCount > 9 ? '9+' : unreadCount}
//                       </span>
//                     )}
//                   </motion.button>
//                   <AnimatePresence>
//                     {notificationsOpen && (
//                       <NotificationPanel 
//                         isOpen={notificationsOpen} 
//                         onClose={() => setNotificationsOpen(false)} 
//                       />
//                     )}
//                   </AnimatePresence>
//                 </div>
//               </>
//             )}
            
//             <motion.button
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.9 }}
//               onClick={() => setDarkMode(!darkMode)}
//               className="p-2.5 rounded-xl bg-surface hover:bg-border transition-colors"
//             >
//               {darkMode ? <Sun className="w-5 h-5 text-warning" /> : <Moon className="w-5 h-5 text-primary" />}
//             </motion.button>

//             {user ? (
//               <div className="hidden md:flex items-center gap-3">
//                 <motion.div 
//                   whileHover={{ scale: 1.02 }}
//                   className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-surface cursor-pointer"
//                   onClick={() => navigate('/profile')}
//                 >
//                   <div className="w-8 h-8 gradient-bg rounded-full flex items-center justify-center text-white font-semibold text-sm">
//                     {user.name.charAt(0).toUpperCase()}
//                   </div>
//                   <span className="text-sm font-medium text-foreground">{user.name}</span>
//                 </motion.div>
//                 <motion.button
//                   whileHover={{ scale: 1.1 }}
//                   whileTap={{ scale: 0.9 }}
//                   onClick={logout}
//                   className="p-2.5 rounded-xl bg-danger/10 hover:bg-danger/20 text-danger transition-colors"
//                 >
//                   <LogOut className="w-5 h-5" />
//                 </motion.button>
//               </div>
//             ) : (
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => navigate('/login')}
//                 className="hidden md:flex gradient-bg text-white px-6 py-2.5 rounded-xl font-medium shadow-lg shadow-primary/25"
//               >
//                 Get Started
//               </motion.button>
//             )}

//             <motion.button
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.9 }}
//               onClick={() => setMenuOpen(!menuOpen)}
//               className="lg:hidden p-2.5 rounded-xl bg-surface"
//             >
//               {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
//             </motion.button>
//           </div>
//         </div>
//       </div>

//       <AnimatePresence>
//         {menuOpen && (
//           <motion.div
//             initial={{ opacity: 0, height: 0 }}
//             animate={{ opacity: 1, height: 'auto' }}
//             exit={{ opacity: 0, height: 0 }}
//             className="lg:hidden border-t border-border bg-background"
//           >
//             <div className="px-4 py-4 space-y-2">
//               {user ? (
//                 <>
//                   {[
//                     { icon: Home, label: 'Dashboard', path: '/dashboard' },
//                     { icon: BookOpen, label: 'My Courses', path: '/courses' },
//                     { icon: FileText, label: 'Assignments', path: '/assignments' },
//                     { icon: Sparkles, label: 'AI Tutor', path: '/ai' },
//                     { icon: Briefcase, label: 'Resume Builder', path: '/resume' },
//                     { icon: Target, label: 'Interview Prep', path: '/interview' },
//                     { icon: Award, label: 'Certificates', path: '/certificates' },
//                     { icon: User, label: 'Profile', path: '/profile' },
//                     { icon: Settings, label: 'Settings', path: '/settings' },
//                   ].map((item) => (
//                     <motion.button
//                       key={item.label}
//                       whileTap={{ scale: 0.98 }}
//                       onClick={() => { navigate(item.path); setMenuOpen(false); }}
//                       className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-foreground hover:bg-surface transition-colors"
//                     >
//                       <item.icon className="w-5 h-5 text-primary" />
//                       {item.label}
//                     </motion.button>
//                   ))}
//                   <button
//                     onClick={() => { logout(); setMenuOpen(false); }}
//                     className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-danger hover:bg-danger/10 transition-colors"
//                   >
//                     <LogOut className="w-5 h-5" />
//                     Logout
//                   </button>
//                 </>
//               ) : (
//                 <button
//                   onClick={() => { navigate('/login'); setMenuOpen(false); }}
//                   className="w-full gradient-bg text-white py-3 rounded-xl font-medium"
//                 >
//                   Get Started
//                 </button>
//               )}
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       <AnimatePresence>
//         {searchOpen && (
//           <motion.div
//             initial={{ opacity: 0, y: -10 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -10 }}
//             className="absolute top-full left-0 right-0 bg-background border-b border-border p-4"
//           >
//             <div className="max-w-2xl mx-auto">
//               <div className="relative">
//                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
//                 <input
//                   type="text"
//                   placeholder="Search courses, topics, or instructors..."
//                   className="w-full pl-12 pr-4 py-3 bg-surface rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
//                   autoFocus
//                 />
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {notificationsOpen && (
//         <div 
//           className="fixed inset-0 z-40" 
//           onClick={() => setNotificationsOpen(false)}
//         />
//       )}
//     </header>
//   )
// }

// function LandingPage() {
//   const navigate = useNavigate()
//   const { user } = useAuth()

//   const features = [
//     { icon: BookOpen, title: 'Interactive Courses', desc: 'Learn with videos, quizzes, and hands-on projects' },
//     { icon: Sparkles, title: 'AI-Powered Tutor', desc: 'Get instant help from our intelligent AI assistant' },
//     { icon: Target, title: 'Interview Prep', desc: 'Practice with real interview questions & answers' },
//     { icon: Award, title: 'Certificates', desc: 'Earn verified certificates upon completion' },
//     { icon: FileText, title: 'Resume Builder', desc: 'Create professional resumes that stand out' },
//     { icon: CreditCard, title: 'Premium Courses', desc: 'Access expert-led premium content' },
//   ]

//   const stats = [
//     { value: '50K+', label: 'Active Students' },
//     { value: '200+', label: 'Expert Courses' },
//     { value: '95%', label: 'Success Rate' },
//     { value: '24/7', label: 'AI Support' },
//   ]

//   if (user) {
//     return <Navigate to="/dashboard" replace />
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
//         <div className="absolute inset-0 overflow-hidden">
//           <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
//           <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
//         </div>

//         <div className="relative max-w-7xl mx-auto px-4 md:px-8">
//           <div className="text-center max-w-4xl mx-auto">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6 }}
//             >
//               <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
//                 <Sparkles className="w-4 h-4" />
//                 AI-Powered Learning Platform
//               </span>
//             </motion.div>

//             <motion.h1
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6, delay: 0.1 }}
//               className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight mb-6"
//             >
//               Welcome to{' '}
//               <span className="gradient-text">Sepnoty Club</span>
//             </motion.h1>

//             <motion.p
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6, delay: 0.2 }}
//               className="text-lg md:text-xl text-muted max-w-2xl mx-auto mb-10"
//             >
//               Transform your learning journey with personalized courses, AI tutoring, 
//               resume building, and interview prep. Your career success starts here.
//             </motion.p>

//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6, delay: 0.3 }}
//               className="flex flex-col sm:flex-row items-center justify-center gap-4"
//             >
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => navigate('/login')}
//                 className="w-full sm:w-auto gradient-bg text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-xl shadow-primary/30 flex items-center justify-center gap-2"
//               >
//                 Start Learning Free
//                 <ChevronRight className="w-5 h-5" />
//               </motion.button>
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => navigate('/courses')}
//                 className="w-full sm:w-auto px-8 py-4 rounded-2xl font-semibold text-lg bg-surface text-foreground hover:bg-border transition-colors flex items-center justify-center gap-2"
//               >
//                 Browse Courses
//               </motion.button>
//             </motion.div>
//           </div>

//           <motion.div
//             initial={{ opacity: 0, y: 40 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8, delay: 0.5 }}
//             className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
//           >
//             {stats.map((stat, i) => (
//               <div key={i} className="text-center">
//                 <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">{stat.value}</div>
//                 <div className="text-muted">{stat.label}</div>
//               </div>
//             ))}
//           </motion.div>
//         </div>
//       </section>

//       <section className="py-20 md:py-32 bg-surface/50">
//         <div className="max-w-7xl mx-auto px-4 md:px-8">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             className="text-center mb-16"
//           >
//             <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
//               Everything You Need to <span className="gradient-text">Succeed</span>
//             </h2>
//             <p className="text-muted max-w-2xl mx-auto">
//               Our platform combines cutting-edge technology with proven learning methods
//             </p>
//           </motion.div>

//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {features.map((feature, i) => (
//               <motion.div
//                 key={i}
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: i * 0.1 }}
//                 whileHover={{ y: -5 }}
//                 className="bg-background rounded-2xl p-6 shadow-lg shadow-black/5 border border-border hover:border-primary/50 transition-all"
//               >
//                 <div className="w-14 h-14 gradient-bg rounded-xl flex items-center justify-center mb-4">
//                   <feature.icon className="w-7 h-7 text-white" />
//                 </div>
//                 <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
//                 <p className="text-muted">{feature.desc}</p>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       <footer className="py-12 border-t border-border">
//         <div className="max-w-7xl mx-auto px-4 md:px-8">
//           <div className="flex flex-col md:flex-row items-center justify-between gap-6">
//             <div className="flex items-center gap-2">
//               <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center">
//                 <GraduationCap className="w-6 h-6 text-white" />
//               </div>
//               <span className="text-xl font-bold gradient-text">Sepnoty Club</span>
//             </div>
//             <p className="text-muted text-sm">© 2024 Sepnoty Club. All rights reserved.</p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   )
// }

// function CoursesPage() {
//   const navigate = useNavigate()
//   const { isEnrolled, getProgress } = useAuth()
//   const [filter, setFilter] = useState('all')

//   const allCourses = [
//     { id: 1, title: 'Complete Web Development Bootcamp', instructor: 'Dr. Angela Yu', category: 'programming', duration: '40 hours', students: 12500, rating: 4.9, image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400', price: 0, isPaid: false },
//     { id: 2, title: 'UI/UX Design Masterclass', instructor: 'Sarah Johnson', category: 'design', duration: '25 hours', students: 8900, rating: 4.8, image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400', price: 49, isPaid: true },
//     { id: 3, title: 'Data Science with Python', instructor: 'Prof. John Smith', category: 'science', duration: '35 hours', students: 15200, rating: 4.9, image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400', price: 0, isPaid: false },
//     { id: 4, title: 'Business Analytics Pro', instructor: 'Mike Chen', category: 'business', duration: '20 hours', students: 6700, rating: 4.7, image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400', price: 79, isPaid: true },
//     { id: 5, title: 'Spanish for Beginners', instructor: 'Maria Garcia', category: 'languages', duration: '15 hours', students: 9400, rating: 4.8, image: 'https://images.unsplash.com/photo-1489945052260-4f21c52268b9?w=400', price: 0, isPaid: false },
//     { id: 6, title: 'Advanced React & Redux', instructor: 'Dan Miller', category: 'programming', duration: '30 hours', students: 11200, rating: 4.9, image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400', price: 99, isPaid: true },
//     { id: 7, title: 'Machine Learning A-Z', instructor: 'Andrew Ng', category: 'science', duration: '45 hours', students: 25000, rating: 5.0, image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400', price: 129, isPaid: true },
//     { id: 8, title: 'Digital Marketing Mastery', instructor: 'Neil Patel', category: 'business', duration: '28 hours', students: 18300, rating: 4.8, image: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=400', price: 0, isPaid: false },
//   ]

//   const categories = ['all', 'programming', 'design', 'business', 'science', 'languages']

//   const filteredCourses = allCourses.filter(c => filter === 'all' || c.category === filter)
//     .map(c => ({
//       ...c,
//       progress: getProgress(c.id)
//     }))

//   return (
//     <div className="min-h-screen bg-background pt-24 pb-12">
//       <div className="max-w-7xl mx-auto px-4 md:px-8">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="mb-8"
//         >
//           <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
//             Explore <span className="gradient-text">Courses</span>
//           </h1>
//           <p className="text-muted">Discover courses tailored to your interests</p>
//         </motion.div>

//         <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide mb-8">
//           {categories.map((cat) => (
//             <motion.button
//               key={cat}
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={() => setFilter(cat)}
//               className={`px-5 py-2.5 rounded-full font-medium capitalize whitespace-nowrap transition-all ${
//                 filter === cat
//                   ? 'gradient-bg text-white shadow-lg shadow-primary/25'
//                   : 'bg-surface text-muted hover:text-foreground'
//               }`}
//             >
//               {cat}
//             </motion.button>
//           ))}
//         </div>

//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredCourses.map((course, i) => (
//             <CourseCard 
//               key={course.id} 
//               course={course} 
//               index={i}
//               onClick={() => navigate(`/course/${course.id}`)}
//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   )
// }

// function CertificatesPage() {
//   const { user, enrollments } = useAuth()
  
//   const completedCourses = enrollments.filter(e => e.progress === 100)

//   const certificates = completedCourses.map((enrollment, i) => ({
//     id: enrollment.id,
//     course: `Course ${enrollment.courseId}`,
//     completedAt: enrollment.enrolledAt,
//     credential: `CERT-${String(enrollment.courseId).toUpperCase()}-${Date.now()}`
//   }))

//   return (
//     <div className="min-h-screen bg-background pt-24 pb-12">
//       <div className="max-w-7xl mx-auto px-4 md:px-8">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="mb-8"
//         >
//           <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
//             Your <span className="gradient-text">Certificates</span>
//           </h1>
//           <p className="text-muted">Showcase your achievements</p>
//         </motion.div>

//         {certificates.length > 0 ? (
//           <div className="grid md:grid-cols-2 gap-6">
//             {certificates.map((cert, i) => (
//               <motion.div
//                 key={cert.id}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: i * 0.1 }}
//                 className="bg-surface rounded-2xl p-6 border border-border hover:border-primary/50 transition-all"
//               >
//                 <div className="flex items-start justify-between mb-4">
//                   <div className="w-14 h-14 gradient-bg rounded-xl flex items-center justify-center">
//                     <Award className="w-7 h-7 text-white" />
//                   </div>
//                   <span className="px-3 py-1 bg-success/10 text-success text-sm font-medium rounded-full">
//                     Verified
//                   </span>
//                 </div>
//                 <h3 className="text-xl font-semibold text-foreground mb-2">{cert.course}</h3>
//                 <p className="text-muted text-sm mb-4">Completed on {new Date(cert.completedAt).toLocaleDateString()}</p>
//                 <div className="flex items-center justify-between">
//                   <span className="text-xs text-muted font-mono">{cert.credential}</span>
//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     className="px-4 py-2 gradient-bg text-white text-sm font-medium rounded-xl"
//                   >
//                     Download
//                   </motion.button>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         ) : (
//           <div className="text-center py-20">
//             <Award className="w-16 h-16 text-muted mx-auto mb-4" />
//             <h3 className="text-xl font-semibold text-foreground mb-2">No Certificates Yet</h3>
//             <p className="text-muted mb-6">Complete courses to earn certificates</p>
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={() => window.location.hash = '/courses'}
//               className="gradient-bg text-white px-6 py-3 rounded-xl font-medium"
//             >
//               Browse Courses
//             </motion.button>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// function ProfilePage() {
//   const { user, logout, enrollments } = useAuth()
//   const navigate = useNavigate()
  
//   const stats = {
//     coursesEnrolled: enrollments.length,
//     coursesCompleted: enrollments.filter(e => e.progress === 100).length,
//     hoursLearned: enrollments.length * 12,
//     streak: 7
//   }

//   if (!user) {
//     return <Navigate to="/login" replace />
//   }

//   return (
//     <div className="min-h-screen bg-background pt-24 pb-12">
//       <div className="max-w-4xl mx-auto px-4 md:px-8">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="bg-surface rounded-3xl p-8 mb-8"
//         >
//           <div className="flex flex-col md:flex-row items-center gap-6">
//             <div className="w-24 h-24 gradient-bg rounded-full flex items-center justify-center text-white text-3xl font-bold">
//               {user.name.charAt(0).toUpperCase()}
//             </div>
//             <div className="text-center md:text-left">
//               <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1">{user.name}</h1>
//               <p className="text-muted mb-4">{user.email}</p>
//               <div className="flex items-center gap-2 flex-wrap justify-center md:justify-start">
//                 <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
//                   Pro Member
//                 </span>
//                 <span className="px-3 py-1 bg-warning/10 text-warning text-sm font-medium rounded-full flex items-center gap-1">
//                   <Zap className="w-3 h-3" />
//                   {stats.streak} Day Streak
//                 </span>
//               </div>
//             </div>
//           </div>
//         </motion.div>

//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
//           {[
//             { label: 'Enrolled', value: stats.coursesEnrolled, icon: BookOpen },
//             { label: 'Completed', value: stats.coursesCompleted, icon: Award },
//             { label: 'Hours', value: stats.hoursLearned, icon: Clock },
//             { label: 'Streak', value: stats.streak, icon: Zap },
//           ].map((stat, i) => (
//             <motion.div
//               key={i}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: i * 0.1 }}
//               className="bg-surface rounded-2xl p-4 text-center"
//             >
//               <stat.icon className="w-6 h-6 text-primary mx-auto mb-2" />
//               <div className="text-2xl font-bold text-foreground">{stat.value}</div>
//               <div className="text-sm text-muted">{stat.label}</div>
//             </motion.div>
//           ))}
//         </div>

//         <div className="space-y-4">
//           {[
//             { icon: User, label: 'Edit Profile', action: () => {} },
//             { icon: Bell, label: 'Notifications', action: () => {} },
//             { icon: Settings, label: 'Settings', action: () => navigate('/settings') },
//             { icon: LogOut, label: 'Logout', action: logout, danger: true },
//           ].map((item, i) => (
//             <motion.button
//               key={i}
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: i * 0.1 }}
//               onClick={item.action}
//               className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${
//                 item.danger 
//                   ? 'bg-danger/10 text-danger hover:bg-danger/20' 
//                   : 'bg-surface text-foreground hover:bg-border'
//               }`}
//             >
//               <item.icon className="w-5 h-5" />
//               <span className="font-medium">{item.label}</span>
//               <ChevronRight className="w-5 h-5 ml-auto" />
//             </motion.button>
//           ))}
//         </div>
//       </div>
//     </div>
//   )
// }

// function SettingsPage() {
//   const [notifications, setNotifications] = useState(true)
//   const [emailUpdates, setEmailUpdates] = useState(true)

//   return (
//     <div className="min-h-screen bg-background pt-24 pb-12">
//       <div className="max-w-2xl mx-auto px-4 md:px-8">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="mb-8"
//         >
//           <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
//           <p className="text-muted">Manage your preferences</p>
//         </motion.div>

//         <div className="space-y-6">
//           <div className="bg-surface rounded-2xl p-6">
//             <h2 className="text-lg font-semibold text-foreground mb-4">Notifications</h2>
//             <div className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <div className="font-medium text-foreground">Push Notifications</div>
//                   <div className="text-sm text-muted">Receive notifications about your courses</div>
//                 </div>
//                 <button
//                   onClick={() => setNotifications(!notifications)}
//                   className={`w-12 h-7 rounded-full transition-colors ${notifications ? 'bg-primary' : 'bg-border'}`}
//                 >
//                   <div className={`w-5 h-5 bg-white rounded-full transition-transform ${notifications ? 'translate-x-6' : 'translate-x-1'}`} />
//                 </button>
//               </div>
//               <div className="flex items-center justify-between">
//                 <div>
//                   <div className="font-medium text-foreground">Email Updates</div>
//                   <div className="text-sm text-muted">Get weekly progress reports via email</div>
//                 </div>
//                 <button
//                   onClick={() => setEmailUpdates(!emailUpdates)}
//                   className={`w-12 h-7 rounded-full transition-colors ${emailUpdates ? 'bg-primary' : 'bg-border'}`}
//                 >
//                   <div className={`w-5 h-5 bg-white rounded-full transition-transform ${emailUpdates ? 'translate-x-6' : 'translate-x-1'}`} />
//                 </button>
//               </div>
//             </div>
//           </div>

//           <div className="bg-surface rounded-2xl p-6">
//             <h2 className="text-lg font-semibold text-foreground mb-4">Account</h2>
//             <div className="space-y-3">
//               <button className="w-full text-left py-3 px-4 rounded-xl hover:bg-background transition-colors text-foreground">
//                 Change Password
//               </button>
//               <button className="w-full text-left py-3 px-4 rounded-xl hover:bg-background transition-colors text-foreground">
//                 Privacy Settings
//               </button>
//               <button className="w-full text-left py-3 px-4 rounded-xl hover:bg-danger/10 transition-colors text-danger">
//                 Delete Account
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// function ProtectedRoute({ children }: { children: React.ReactNode }) {
//   const { user, isLoading } = useAuth()
  
//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-background">
//         <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
//       </div>
//     )
//   }
  
//   if (!user) {
//     return <Navigate to="/login" replace />
//   }
  
//   return <>{children}</>
// }

// function AppContent() {
//   const [darkMode, setDarkMode] = useState(false)
//   const location = useLocation()

//   useEffect(() => {
//     const saved = localStorage.getItem('sepnoty_darkMode')
//     if (saved === 'true') {
//       setDarkMode(true)
//       document.documentElement.classList.add('dark')
//     }
//   }, [])

//   useEffect(() => {
//     if (darkMode) {
//       document.documentElement.classList.add('dark')
//     } else {
//       document.documentElement.classList.remove('dark')
//     }
//     localStorage.setItem('sepnoty_darkMode', String(darkMode))
//   }, [darkMode])

//   const hideHeader = location.pathname === '/login'

//   return (
//     <div className={`min-h-screen bg-background transition-colors ${darkMode ? 'dark' : ''}`}>
//       {!hideHeader && <Header darkMode={darkMode} setDarkMode={setDarkMode} />}
//       <AnimatePresence mode="wait">
//         <Routes location={location} key={location.pathname}>
//           <Route path="/" element={<LandingPage />} />
//           <Route path="/login" element={<AuthForm />} />
//           <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
//           <Route path="/courses" element={<ProtectedRoute><CoursesPage /></ProtectedRoute>} />
//           <Route path="/course/:id" element={<ProtectedRoute><CourseDetail /></ProtectedRoute>} />
//           <Route path="/ai" element={<ProtectedRoute><AIAssistant /></ProtectedRoute>} />
//           <Route path="/assignments" element={<ProtectedRoute><Assignments /></ProtectedRoute>} />
//           <Route path="/resume" element={<ProtectedRoute><ResumeBuilder /></ProtectedRoute>} />
//           <Route path="/interview" element={<ProtectedRoute><InterviewPrep /></ProtectedRoute>} />
//           <Route path="/certificates" element={<ProtectedRoute><CertificatesPage /></ProtectedRoute>} />
//           <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
//           <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//       </AnimatePresence>
//     </div>
//   )
// }

// export default function App() {
//   return (
//     <HashRouter>
//       <AuthProvider>
//         <AppContent />
//       </AuthProvider>
//     </HashRouter>
//   )
// }
// import { useState, useEffect, createContext, useContext } from 'react'
// import { HashRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
// import { motion, AnimatePresence } from 'framer-motion'
// import {
//   Sun, Moon, Menu, X, BookOpen, GraduationCap, Award,
//   Clock, ChevronRight, LogOut, User,
//   Bell, Search, Settings, Home, Sparkles, Zap,
//   FileText, Briefcase, CreditCard, CheckCircle, Target
// } from 'lucide-react'

// import AuthForm from './components/AuthForm'
// import Dashboard from './components/Dashboard'
// import CourseCard from './components/CourseCard'
// import CourseDetail from './components/CourseDetail'
// import AIAssistant from './components/AIAssistant'
// import Assignments from './components/Assignments'
// import ResumeBuilder from './components/ResumeBuilder'
// import InterviewPrep from './components/InterviewPrep'

// /* ================== API BASE ================== */
// const API_URL = import.meta.env.VITE_API_URL

// /* ================== TYPES ================== */
// interface UserType {
//   id: string
//   email: string
//   name: string
// }

// interface Notification {
//   id: string
//   title: string
//   message: string
//   type: 'info' | 'success' | 'warning'
//   read: boolean
//   createdAt: string
// }

// interface Enrollment {
//   id: string
//   courseId: string | number
//   progress: number
//   enrolledAt: string
// }

// interface AuthContextType {
//   user: UserType | null
//   login: (email: string, password: string) => Promise<void>
//   register: (name: string, email: string, password: string) => Promise<void>
//   logout: () => void
//   isLoading: boolean
//   notifications: Notification[]
//   markNotificationRead: (id: string) => void
//   clearNotifications: () => void
//   enrollments: Enrollment[]
//   enrollInCourse: (courseId: string | number) => Promise<boolean>
//   updateProgress: (courseId: string | number, progress: number) => void
//   isEnrolled: (courseId: string | number) => boolean
//   getProgress: (courseId: string | number) => number
//   addNotification: (n: Omit<Notification, 'id' | 'read' | 'createdAt'>) => void
// }

// /* ================== CONTEXT ================== */
// const AuthContext = createContext<AuthContextType | null>(null)

// export const useAuth = () => {
//   const ctx = useContext(AuthContext)
//   if (!ctx) throw new Error('useAuth must be used inside provider')
//   return ctx
// }

// /* ================== PROVIDER ================== */
// function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<UserType | null>(null)
//   const [isLoading, setIsLoading] = useState(true)
//   const [notifications, setNotifications] = useState<Notification[]>([])
//   const [enrollments, setEnrollments] = useState<Enrollment[]>([])

//   useEffect(() => {
//     setUser(JSON.parse(localStorage.getItem('sepnoty_user') || 'null'))
//     setNotifications(JSON.parse(localStorage.getItem('sepnoty_notifications') || '[]'))
//     setEnrollments(JSON.parse(localStorage.getItem('sepnoty_enrollments') || '[]'))
//     setIsLoading(false)
//   }, [])

//   useEffect(() => {
//     localStorage.setItem('sepnoty_notifications', JSON.stringify(notifications))
//   }, [notifications])

//   useEffect(() => {
//     localStorage.setItem('sepnoty_enrollments', JSON.stringify(enrollments))
//   }, [enrollments])

//   const addNotification = (n: Omit<Notification, 'id' | 'read' | 'createdAt'>) => {
//     setNotifications(prev => [{
//       ...n,
//       id: Date.now().toString(),
//       read: false,
//       createdAt: new Date().toISOString()
//     }, ...prev])
//   }

//   const markNotificationRead = (id: string) =>
//     setNotifications(n => n.map(x => x.id === id ? { ...x, read: true } : x))

//   const clearNotifications = () => setNotifications([])

//   /* ===== AUTH ===== */
//   const login = async (email: string, password: string) => {
//     setIsLoading(true)
//     try {
//       const res = await fetch(`${API_URL}/api/auth/login`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password })
//       })
//       const data = await res.json()
//       if (!res.ok) throw new Error(data.error)
//       setUser(data.user)
//       localStorage.setItem('sepnoty_user', JSON.stringify(data.user))
//       addNotification({ title: 'Welcome Back!', message: `Hi ${data.user.name}`, type: 'info' })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const register = async (name: string, email: string, password: string) => {
//     setIsLoading(true)
//     try {
//       const res = await fetch(`${API_URL}/api/auth/register`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ name, email, password })
//       })
//       const data = await res.json()
//       if (!res.ok) throw new Error(data.error)
//       setUser(data.user)
//       localStorage.setItem('sepnoty_user', JSON.stringify(data.user))
//       addNotification({ title: 'Account Created', message: 'Welcome to Sepnoty!', type: 'success' })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const logout = () => {
//     setUser(null)
//     localStorage.removeItem('sepnoty_user')
//   }

//   /* ===== COURSES ===== */
//   const enrollInCourse = async (courseId: string | number) => {
//     if (isEnrolled(courseId)) return true
//     setEnrollments(e => [...e, {
//       id: Date.now().toString(),
//       courseId,
//       progress: 0,
//       enrolledAt: new Date().toISOString()
//     }])
//     await fetch(`${API_URL}/api/courses/${courseId}/enroll`, { method: 'POST' })
//     addNotification({ title: 'Enrolled', message: 'Course added', type: 'success' })
//     return true
//   }

//   const updateProgress = (courseId: string | number, progress: number) =>
//     setEnrollments(e => e.map(x => x.courseId === courseId ? { ...x, progress } : x))

//   const isEnrolled = (courseId: string | number) =>
//     enrollments.some(e => String(e.courseId) === String(courseId))

//   const getProgress = (courseId: string | number) =>
//     enrollments.find(e => String(e.courseId) === String(courseId))?.progress || 0

//   return (
//     <AuthContext.Provider value={{
//       user, login, register, logout, isLoading,
//       notifications, markNotificationRead, clearNotifications,
//       enrollments, enrollInCourse, updateProgress,
//       isEnrolled, getProgress, addNotification
//     }}>
//       {children}
//     </AuthContext.Provider>
//   )
// }

// /* ================== ROUTE GUARD ================== */
// function ProtectedRoute({ children }: { children: React.ReactNode }) {
//   const { user, isLoading } = useAuth()
//   if (isLoading) return <div className="h-screen flex items-center justify-center">Loading…</div>
//   if (!user) return <Navigate to="/login" replace />
//   return <>{children}</>
// }

// /* ================== APP ================== */
// function AppContent() {
//   const location = useLocation()
//   return (
//     <AnimatePresence mode="wait">
//       <Routes location={location} key={location.pathname}>
//         <Route path="/" element={<Dashboard />} />
//         <Route path="/login" element={<AuthForm />} />
//         <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
//         <Route path="/courses" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
//         <Route path="/course/:id" element={<ProtectedRoute><CourseDetail /></ProtectedRoute>} />
//         <Route path="/ai" element={<ProtectedRoute><AIAssistant /></ProtectedRoute>} />
//         <Route path="/assignments" element={<ProtectedRoute><Assignments /></ProtectedRoute>} />
//         <Route path="/resume" element={<ProtectedRoute><ResumeBuilder /></ProtectedRoute>} />
//         <Route path="/interview" element={<ProtectedRoute><InterviewPrep /></ProtectedRoute>} />
//         <Route path="*" element={<Navigate to="/" />} />
//       </Routes>
//     </AnimatePresence>
//   )
// }

// export default function App() {
//   return (
//     <HashRouter>
//       <AuthProvider>
//         <AppContent />
//       </AuthProvider>
//     </HashRouter>
//   )
// }
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
