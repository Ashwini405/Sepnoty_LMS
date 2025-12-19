import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  FileText, Clock, CheckCircle, AlertCircle, Upload,
  ChevronRight, Calendar, Award, BookOpen
} from 'lucide-react'
import { useAuth } from '../App'

interface Assignment {
  id: string
  title: string
  course: string
  dueDate: string
  status: 'pending' | 'submitted' | 'graded'
  grade?: number
  description: string
}

export default function Assignments() {
  const { addNotification } = useAuth()
  const [filter, setFilter] = useState('all')
  const [selectedAssignment, setSelectedAssignment] = useState < Assignment | null > (null)
  const [submitting, setSubmitting] = useState(false)

  const assignments: Assignment[] = [
    { id: '1', title: 'Build a Responsive Landing Page', course: 'Web Development', dueDate: '2024-03-20', status: 'pending', description: 'Create a fully responsive landing page using HTML, CSS, and JavaScript. Include a hero section, features, testimonials, and a contact form.' },
    { id: '2', title: 'Python Data Analysis Project', course: 'Data Science', dueDate: '2024-03-18', status: 'submitted', description: 'Analyze the provided dataset using Pandas and create visualizations with Matplotlib. Write a report with your findings.' },
    { id: '3', title: 'UX Case Study', course: 'UI/UX Design', dueDate: '2024-03-15', status: 'graded', grade: 95, description: 'Complete a UX case study for a mobile app redesign. Include user research, wireframes, and final mockups.' },
    { id: '4', title: 'React Component Library', course: 'Advanced React', dueDate: '2024-03-25', status: 'pending', description: 'Build a reusable component library with at least 10 components. Include proper TypeScript types and documentation.' },
    { id: '5', title: 'SQL Database Design', course: 'Business Analytics', dueDate: '2024-03-22', status: 'pending', description: 'Design a normalized database schema for an e-commerce platform. Include ER diagrams and SQL queries.' },
  ]

  const filteredAssignments = assignments.filter(a => {
    if (filter === 'all') return true
    return a.status === filter
  })

  const handleSubmit = async () => {
    if (!selectedAssignment) return
    setSubmitting(true)

    await new Promise(resolve => setTimeout(resolve, 1500))

    addNotification({
      title: 'Assignment Submitted! 📝',
      message: `Your "${selectedAssignment.title}" has been submitted successfully.`,
      type: 'success'
    })

    setSubmitting(false)
    setSelectedAssignment(null)
  }

  const getStatusBadge = (status: string, grade?: number) => {
    switch (status) {
      case 'graded':
        return (
          <span className="px-3 py-1 bg-success/10 text-success text-sm font-medium rounded-full flex items-center gap-1">
            <Award className="w-4 h-4" />
            {grade}%
          </span>
        )
      case 'submitted':
        return (
          <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full flex items-center gap-1">
            <CheckCircle className="w-4 h-4" />
            Submitted
          </span>
        )
      default:
        return (
          <span className="px-3 py-1 bg-warning/10 text-warning text-sm font-medium rounded-full flex items-center gap-1">
            <Clock className="w-4 h-4" />
            Pending
          </span>
        )
    }
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            My <span className="gradient-text">Assignments</span>
          </h1>
          <p className="text-muted">Track and submit your course assignments</p>
        </motion.div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Pending', value: assignments.filter(a => a.status === 'pending').length, color: 'warning' },
            { label: 'Submitted', value: assignments.filter(a => a.status === 'submitted').length, color: 'primary' },
            { label: 'Graded', value: assignments.filter(a => a.status === 'graded').length, color: 'success' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`bg-${stat.color}/10 rounded-2xl p-4 text-center`}
            >
              <div className={`text-3xl font-bold text-${stat.color} mb-1`}>{stat.value}</div>
              <div className="text-sm text-muted">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['all', 'pending', 'submitted', 'graded'].map((f) => (
            <motion.button
              key={f}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full font-medium capitalize whitespace-nowrap transition-all ${filter === f
                  ? 'gradient-bg text-white shadow-lg shadow-primary/25'
                  : 'bg-surface text-muted hover:text-foreground'
                }`}
            >
              {f}
            </motion.button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredAssignments.map((assignment, i) => (
            <motion.div
              key={assignment.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setSelectedAssignment(assignment)}
              className="bg-surface rounded-2xl p-5 hover:shadow-lg transition-all cursor-pointer group border border-border hover:border-primary/50"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {assignment.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      {assignment.course}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(assignment.status, assignment.grade)}
                  <ChevronRight className="w-5 h-5 text-muted group-hover:text-primary transition-colors" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredAssignments.length === 0 && (
          <div className="text-center py-20">
            <FileText className="w-16 h-16 text-muted mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Assignments</h3>
            <p className="text-muted">No assignments match your filter</p>
          </div>
        )}
      </div>

      {selectedAssignment && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setSelectedAssignment(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-surface rounded-3xl p-6 md:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">{selectedAssignment.title}</h2>
              {getStatusBadge(selectedAssignment.status, selectedAssignment.grade)}
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-2 text-sm text-muted">
                <BookOpen className="w-4 h-4" />
                <span>{selectedAssignment.course}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted">
                <Calendar className="w-4 h-4" />
                <span>Due: {new Date(selectedAssignment.dueDate).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="bg-background rounded-xl p-4 mb-6">
              <h3 className="font-medium text-foreground mb-2">Description</h3>
              <p className="text-sm text-muted">{selectedAssignment.description}</p>
            </div>

            {selectedAssignment.status === 'pending' && (
              <>
                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center mb-6 hover:border-primary/50 transition-colors cursor-pointer">
                  <Upload className="w-10 h-10 text-muted mx-auto mb-3" />
                  <p className="text-sm text-muted mb-1">Drag and drop your files here</p>
                  <p className="text-xs text-muted">or click to browse</p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full gradient-bg text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Submit Assignment
                    </>
                  )}
                </motion.button>
              </>
            )}

            {selectedAssignment.status === 'graded' && (
              <div className="bg-success/10 rounded-xl p-4 text-center">
                <Award className="w-10 h-10 text-success mx-auto mb-2" />
                <div className="text-2xl font-bold text-success mb-1">{selectedAssignment.grade}%</div>
                <p className="text-sm text-muted">Great work! You've earned this grade.</p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
