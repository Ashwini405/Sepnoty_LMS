import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'




import {
  BookOpen, Clock, Award, TrendingUp, Play, Star,
  ChevronRight, Zap, Target, Calendar, BarChart,
  ArrowUpRight, Sparkles, FileText, Briefcase
} from 'lucide-react'
import { useAuth } from '../App'

export default function Dashboard() {
  const { user, enrollments, getProgress } = useAuth()
  const navigate = useNavigate()

  const stats = {
    coursesEnrolled: enrollments.length || 3,
    hoursLearned: (enrollments.length || 3) * 12,
    certificates: enrollments.filter(e => e.progress === 100).length,
    streak: 7,
  }

  const allCourses = [
    { id: 1, title: 'Complete Web Development Bootcamp', instructor: 'Dr. Angela Yu', image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400', nextLesson: 'CSS Grid Layout' },
    { id: 2, title: 'UI/UX Design Masterclass', instructor: 'Sarah Johnson', image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400', nextLesson: 'Figma Basics' },
    { id: 3, title: 'Data Science with Python', instructor: 'Prof. John Smith', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400', nextLesson: 'Pandas DataFrames' },
  ]

  const continueLearning = allCourses
    .filter(c => {
      const progress = getProgress(c.id)
      return progress > 0 && progress < 100
    })
    .map(c => ({ ...c, progress: getProgress(c.id) }))

  const displayCourses = continueLearning.length > 0 ? continueLearning : allCourses.slice(0, 2).map(c => ({
    ...c,
    progress: c.id === 1 ? 45 : 72
  }))

  const upcomingEvents = [
    { id: 1, title: 'Live: React Best Practices', date: 'Today, 3:00 PM', type: 'live' },
    { id: 2, title: 'Assignment Due: Python Basics', date: 'Tomorrow, 11:59 PM', type: 'deadline' },
    { id: 3, title: 'Quiz: Web Development', date: 'Mar 15, 10:00 AM', type: 'quiz' },
  ]

  const quickActions = [
    { icon: FileText, label: 'Assignments', path: '/assignments', color: 'bg-primary/10 text-primary' },
    { icon: Briefcase, label: 'Resume', path: '/resume', color: 'bg-success/10 text-success' },
    { icon: Target, label: 'Interview Prep', path: '/interview', color: 'bg-warning/10 text-warning' },
    { icon: Award, label: 'Certificates', path: '/certificates', color: 'bg-danger/10 text-danger' },
  ]
  const menuItems = [
  { label: "Overview", icon: BookOpen, path: "/overview" },
  { label: "Courses", icon: Play, path: "/courses" },
  { label: "Assignments", icon: FileText, path: "/assignments" },
  { label: "Quizzes", icon: BarChart, path: "/quizzes" },
  { label: "Kanban Board", icon: Target, path: "/kanban" },
  { label: "Messages", icon: Calendar, path: "/messages" },
  { label: "Analytics", icon: TrendingUp, path: "/analytics" },
  { label: "Settings", icon: Award, path: "/settings" },
  { label: "Admin", icon: Zap, path: "/admin" },
]

const [seconds, setSeconds] = useState(1500)
const [running, setRunning] = useState(false)
useEffect(() => {
  if (!running) return
  if (seconds === 0) return setRunning(false)

  const timer = setInterval(() => {
    setSeconds(s => s - 1)
  }, 1000)

  return () => clearInterval(timer)
}, [running, seconds])
const aiTips = [
  "Finish the typography lesson before noon for a focus boost.",
  "Revise CSS Grid today to improve layouts.",
  "Practice 2 coding problems to earn XP."
]

const randomTip = aiTips[Math.floor(Math.random() * aiTips.length)]
const [task, setTask] = useState("")
const [todos, setTodos] = useState([
  "Complete 2 lessons",
  "Revise React hooks",
])




  return (
    
    
    <div className="min-h-screen bg-background flex">
    {/* ================= SIDEBAR ================= */}
{/* ================= SIDEBAR ================= */}
<aside className="w-64 bg-white border-r px-6 py-8 hidden lg:flex flex-col">

  {/* TOP CONTENT */}
  <div>
    
    {/* Logo */}
    <div className="flex items-center gap-3 mb-8">
      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
        S
      </div>
      <div>
        <h2 className="font-bold text-lg">Sepnoty Club</h2>
        <p className="text-xs text-muted">e-Learning Dashboard</p>
      </div>
    </div>

    {/* Campus */}
    <div className="bg-surface rounded-xl p-4 mb-6">
      <p className="text-xs text-muted mb-1">Your campus</p>
      <p className="font-medium text-sm">
        Narasaraopeta Engineering College
      </p>
    </div>

    {/* Menu */}
    <p className="text-xs text-muted mb-2">MENU</p>
    <nav className="space-y-1">
      {menuItems.map((item, i) => (
        <button
          key={i}
          onClick={() => navigate(item.path)}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm hover:bg-primary/10 text-left"
        >
          <item.icon className="w-4 h-4 text-primary" />
          {item.label}
        </button>
        
      ))}
    </nav>
  </div>

  {/* ================= BOTTOM (FIX) ================= */}
  <div className="mt-auto pt-6">
    <div className="bg-primary/10 rounded-xl p-4 text-center">
      <p className="text-sm font-semibold mb-1">
        Pro Certification!
      </p>
      <p className="text-xs text-muted mb-3">
        Get verified certifications from top universities.
      </p>
      <button className="w-full bg-primary text-white py-2 rounded-lg text-sm">
        Learn More
      </button>
    </div>
  </div>

</aside>



      <div className="max-w-7xl mx-auto px-4 md:px-8">
      
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span>!
          </h1>
          <p className="text-muted">Continue your learning journey</p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {[
            { label: 'Courses Enrolled', value: stats.coursesEnrolled, icon: BookOpen, color: 'text-primary', bg: 'bg-primary/10' },
            { label: 'Hours Learned', value: stats.hoursLearned, icon: Clock, color: 'text-success', bg: 'bg-success/10' },
            { label: 'Certificates', value: stats.certificates, icon: Award, color: 'text-warning', bg: 'bg-warning/10' },
            { label: 'Day Streak', value: stats.streak, icon: Zap, color: 'text-danger', bg: 'bg-danger/10' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-surface rounded-2xl p-4 md:p-6 hover:shadow-lg transition-all"
            >
              <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">{stat.value}</div>
              <div className="text-sm text-muted">{stat.label}</div>
            </motion.div>
          ))}
          
        </div>


        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {quickActions.map((action, i) => (
            <motion.button
              key={action.label}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(action.path)}
              className={`${action.color} p-4 rounded-2xl text-left transition-all hover:shadow-lg`}
            >
              <action.icon className="w-6 h-6 mb-2" />
              <span className="font-medium">{action.label}</span>
            </motion.button>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
          
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <Play className="w-5 h-5 text-primary" />
                  Continue Learning
                </h2>
                <button
                  onClick={() => navigate('/courses')}
                  className="text-sm text-primary hover:text-primary-hover transition-colors flex items-center gap-1"
                >
                  View All <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-4">
                {displayCourses.map((course, i) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    onClick={() => navigate(`/course/${course.id}`)}
                    className="bg-surface rounded-2xl p-4 flex gap-4 hover:shadow-lg transition-all cursor-pointer group"
                  >
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-24 h-24 md:w-32 md:h-24 object-cover rounded-xl"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground mb-1 truncate group-hover:text-primary transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-sm text-muted mb-2">{course.instructor}</p>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                          <div
                            className="h-full gradient-bg rounded-full transition-all"
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-foreground">{course.progress}%</span>
                      </div>
                      <p className="text-xs text-muted flex items-center gap-1">
                        <Target className="w-3 h-3" />
                        Next: {course.nextLesson}
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="self-center w-12 h-12 gradient-bg rounded-full flex items-center justify-center text-white shadow-lg shadow-primary/25"
                    >
                      <Play className="w-5 h-5 ml-0.5" />
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </motion.section>
            {/* ================= TIME SPENT / WEEKLY FOCUS ENERGY ================= */}
<motion.section
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.15 }}
  className="bg-surface rounded-2xl p-6 mb-8"
>
  <div className="flex items-center justify-between mb-4">
    <div>
      <h3 className="font-semibold text-lg">Time spent</h3>
      <p className="text-xs text-muted">Your weekly focus energy</p>
    </div>

    <button
      onClick={() => setRunning(true)}
      className="text-xs bg-primary/10 text-primary px-4 py-1 rounded-full"
    >
      Focus
    </button>
  </div>

  <div className="flex justify-between items-end h-40">
    {[
      { day: "2 May", value: 40 },
      { day: "3 May", value: 90, hot: true },
      { day: "4 May", value: 60 },
      { day: "5 May", value: 50 },
    ].map((d, i) => (
      <div key={i} className="flex flex-col items-center gap-2">
        <div className="w-10 h-full bg-border rounded-full flex items-end">
          <div
            className={`w-full rounded-full ${
              d.hot ? "bg-primary" : "bg-primary/30"
            }`}
            style={{ height: `${d.value}%` }}
          />
        </div>

        {d.hot && (
          <span className="text-[10px] bg-warning/20 text-warning px-2 py-0.5 rounded-full">
            Hot: 3h 40m
          </span>
        )}

        <span className="text-xs text-muted">{d.day}</span>
      </div>
    ))}
  </div>
  
</motion.section>
<div className="bg-surface rounded-2xl p-6">
  <div className="flex justify-between mb-2">
    <h3 className="font-semibold">AI study coach</h3>
    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
      New tip
    </span>
  </div>

  <p className="text-sm text-muted mb-4">{randomTip}</p>

  <div className="flex gap-3 text-xs">
    <span className="bg-primary/10 px-3 py-1 rounded-full">Level 2</span>
    <span className="bg-success/10 px-3 py-1 rounded-full">120 XP</span>
  </div>
</div>
{/* ================= TO DO LIST ================= */}
<motion.section
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.35 }}
  className="bg-surface rounded-2xl p-6"
>
  <div className="flex items-center justify-between mb-4">
    <h3 className="font-semibold text-lg">To Do List</h3>
    <span className="text-xs text-muted">
      {todos.length} tasks
    </span>
  </div>

  <div className="flex gap-2 mb-4">
    <input
      value={task}
      onChange={e => setTask(e.target.value)}
      placeholder="Add new task"
      className="flex-1 border rounded-lg px-3 py-2 text-sm"
    />
    <button
      onClick={() => {
        if (!task.trim()) return
        setTodos([...todos, task])
        setTask("")
      }}
      className="bg-primary text-white px-4 rounded-lg text-sm"
    >
      Add
    </button>
  </div>

  <ul className="space-y-3 text-sm">
    {todos.map((t, i) => (
      <li
        key={i}
        className="flex items-center justify-between bg-background px-3 py-2 rounded-lg"
      >
        <span>{t}</span>
        <button
          onClick={() =>
            setTodos(todos.filter((_, idx) => idx !== i))
          }
          className="text-success font-bold"
        >
          ✓
        </button>
      </li>
    ))}
  </ul>
</motion.section>


          </div>
          

          <div className="space-y-6">
            {/* ================= FOCUS MODE ================= */}
<motion.section
  initial={{ opacity: 0, x: 20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ delay: 0.45 }}
  className="bg-surface rounded-2xl p-6"
>
  <div className="flex justify-between mb-2">
    <h3 className="font-semibold">Focus mode</h3>
    <span className="text-xs text-muted">
      {running ? "Running" : "Paused"}
    </span>
  </div>

  <p className="text-4xl font-bold mb-1">
    {`${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`}
  </p>

  <p className="text-xs text-muted mb-4">
    25 minute deep focus timer
  </p>

  <div className="flex gap-3">
    <button
      onClick={() => setRunning(true)}
      className="bg-primary text-white px-4 py-2 rounded-xl"
    >
      Start
    </button>

    <button
      onClick={() => {
        setRunning(false)
        setSeconds(1500)
      }}
      className="border px-4 py-2 rounded-xl"
    >
      Reset
    </button>
  </div>
</motion.section>


            <motion.section
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-surface rounded-2xl p-6"
            >
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Upcoming
              </h2>
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${event.type === 'live' ? 'bg-danger/10' :
                        event.type === 'deadline' ? 'bg-warning/10' : 'bg-primary/10'
                      }`}>
                      {event.type === 'live' ? <Play className="w-5 h-5 text-danger" /> :
                        event.type === 'deadline' ? <Clock className="w-5 h-5 text-warning" /> :
                          <BarChart className="w-5 h-5 text-primary" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm truncate">{event.title}</p>
                      <p className="text-xs text-muted">{event.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
            

            <motion.section
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-surface rounded-2xl p-6"
            >
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Weekly Progress
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-end h-32">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => {
                    const heights = [60, 80, 45, 90, 70, 30, 50]
                    return (
                      <div key={i} className="flex flex-col items-center gap-2">
                        <div
                          className="w-8 gradient-bg rounded-lg transition-all hover:opacity-80"
                          style={{ height: `${heights[i]}%` }}
                        />
                        <span className="text-xs text-muted">{day}</span>
                      </div>
                    )
                  })}
                </div>
                <div className="text-center pt-4 border-t border-border">
                  <p className="text-sm text-muted">This week</p>
                  <p className="text-2xl font-bold text-foreground">12.5 hours</p>
                  <p className="text-xs text-success flex items-center justify-center gap-1">
                    <ArrowUpRight className="w-3 h-3" />
                    25% more than last week
                  </p>
                </div>
              </div>
            </motion.section>
            

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="gradient-bg rounded-2xl p-6 text-white"
            >
              <Sparkles className="w-8 h-8 mb-3" />
              <h3 className="text-lg font-semibold mb-2">AI Study Assistant</h3>
              <p className="text-white/80 text-sm mb-4">
                Get instant help with any topic. Our AI tutor is available 24/7.
              </p>
              <button
                onClick={() => navigate('/ai')}
                className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-lg py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
              >
                Start Chat
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
