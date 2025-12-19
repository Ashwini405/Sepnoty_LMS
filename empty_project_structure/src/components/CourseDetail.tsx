import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play, Clock, Users, Star, Award, ChevronDown, ChevronRight,
  CheckCircle, Lock, BookOpen, FileText, Video, CreditCard, X
} from 'lucide-react'
import { useAuth } from '../App'
import PaymentModal from './PaymentModal'

const allCourses = [
  { id: 1, title: 'Complete Web Development Bootcamp', instructor: 'Dr. Angela Yu', category: 'programming', duration: '40 hours', students: 12500, rating: 4.9, image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800', price: 0, isPaid: false, description: 'Become a full-stack web developer with just one course. HTML, CSS, JavaScript, Node, React, MongoDB, Web3 and DApps.' },
  { id: 2, title: 'UI/UX Design Masterclass', instructor: 'Sarah Johnson', category: 'design', duration: '25 hours', students: 8900, rating: 4.8, image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800', price: 49, isPaid: true, description: 'Learn UI/UX design from scratch. Master Figma, design systems, user research, and create stunning interfaces.' },
  { id: 3, title: 'Data Science with Python', instructor: 'Prof. John Smith', category: 'science', duration: '35 hours', students: 15200, rating: 4.9, image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800', price: 0, isPaid: false, description: 'Complete data science bootcamp covering Python, Pandas, NumPy, Machine Learning, and Deep Learning.' },
  { id: 4, title: 'Business Analytics Pro', instructor: 'Mike Chen', category: 'business', duration: '20 hours', students: 6700, rating: 4.7, image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800', price: 79, isPaid: true, description: 'Master business analytics with Excel, SQL, Tableau, and Power BI. Make data-driven decisions.' },
  { id: 5, title: 'Spanish for Beginners', instructor: 'Maria Garcia', category: 'languages', duration: '15 hours', students: 9400, rating: 4.8, image: 'https://images.unsplash.com/photo-1489945052260-4f21c52268b9?w=800', price: 0, isPaid: false, description: 'Learn Spanish from zero to conversational level. Interactive lessons with native speakers.' },
  { id: 6, title: 'Advanced React & Redux', instructor: 'Dan Miller', category: 'programming', duration: '30 hours', students: 11200, rating: 4.9, image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800', price: 99, isPaid: true, description: 'Advanced React patterns, Redux Toolkit, TypeScript, Testing, and performance optimization.' },
  { id: 7, title: 'Machine Learning A-Z', instructor: 'Andrew Ng', category: 'science', duration: '45 hours', students: 25000, rating: 5.0, image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800', price: 129, isPaid: true, description: 'Complete machine learning course covering regression, classification, clustering, deep learning, and NLP.' },
  { id: 8, title: 'Digital Marketing Mastery', instructor: 'Neil Patel', category: 'business', duration: '28 hours', students: 18300, rating: 4.8, image: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=800', price: 0, isPaid: false, description: 'Master SEO, social media marketing, Google Ads, Facebook Ads, and content marketing strategies.' },
]

export default function CourseDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isEnrolled, enrollInCourse, getProgress, updateProgress } = useAuth()
  const [expandedModule, setExpandedModule] = useState < number | null > (0)
  const [showPayment, setShowPayment] = useState(false)
  const [enrolling, setEnrolling] = useState(false)

  const course = allCourses.find(c => c.id === Number(id))

  if (!course) {
    return (
      <div className="min-h-screen bg-background pt-24 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Course Not Found</h2>
          <button
            onClick={() => navigate('/courses')}
            className="gradient-bg text-white px-6 py-3 rounded-xl"
          >
            Browse Courses
          </button>
        </div>
      </div>
    )
  }

  const enrolled = isEnrolled(course.id)
  const progress = getProgress(course.id)

  const modules = [
    {
      id: 1,
      title: 'Introduction & Setup',
      duration: '2h 30m',
      lessons: [
        { id: 1, title: 'Welcome to the Course', duration: '5:00', type: 'video', free: true },
        { id: 2, title: 'Course Overview', duration: '10:00', type: 'video', free: true },
        { id: 3, title: 'Setting Up Your Environment', duration: '20:00', type: 'video', free: false },
        { id: 4, title: 'First Project Setup', duration: '25:00', type: 'video', free: false },
      ]
    },
    {
      id: 2,
      title: 'Core Fundamentals',
      duration: '5h 45m',
      lessons: [
        { id: 5, title: 'Understanding the Basics', duration: '30:00', type: 'video', free: false },
        { id: 6, title: 'Deep Dive into Concepts', duration: '45:00', type: 'video', free: false },
        { id: 7, title: 'Practical Assignment', duration: '1h', type: 'assignment', free: false },
        { id: 8, title: 'Module Quiz', duration: '20:00', type: 'quiz', free: false },
      ]
    },
    {
      id: 3,
      title: 'Advanced Topics',
      duration: '8h 15m',
      lessons: [
        { id: 9, title: 'Advanced Patterns', duration: '50:00', type: 'video', free: false },
        { id: 10, title: 'Best Practices', duration: '40:00', type: 'video', free: false },
        { id: 11, title: 'Real-World Project', duration: '3h', type: 'assignment', free: false },
      ]
    },
    {
      id: 4,
      title: 'Final Project & Certificate',
      duration: '10h',
      lessons: [
        { id: 12, title: 'Capstone Project', duration: '8h', type: 'assignment', free: false },
        { id: 13, title: 'Final Assessment', duration: '1h', type: 'quiz', free: false },
        { id: 14, title: 'Get Your Certificate', duration: '5:00', type: 'video', free: false },
      ]
    },
  ]

  const handleEnroll = async () => {
    if (course.isPaid && !enrolled) {
      setShowPayment(true)
      return
    }

    setEnrolling(true)
    await enrollInCourse(course.id, false, 0)
    setEnrolling(false)
  }

  const handlePaymentSuccess = async () => {
    setShowPayment(false)
    setEnrolling(true)
    await enrollInCourse(course.id, true, course.price)
    setEnrolling(false)
  }

  const handleContinue = () => {
    updateProgress(course.id, Math.min(progress + 10, 100))
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="relative h-72 md:h-96">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-32 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-surface rounded-3xl p-6 md:p-8 mb-8"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-lg capitalize">
                  {course.category}
                </span>
                {course.isPaid ? (
                  <span className="px-3 py-1 bg-warning/10 text-warning text-sm font-medium rounded-lg">
                    Premium
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-success/10 text-success text-sm font-medium rounded-lg">
                    Free
                  </span>
                )}
              </div>

              <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
                {course.title}
              </h1>

              <p className="text-muted mb-6">{course.description}</p>

              <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-muted mb-6">
                <div className="flex items-center gap-2">
                  <img
                    src={`https://ui-avatars.com/api/?name=${course.instructor}&background=8b5cf6&color=fff`}
                    alt={course.instructor}
                    className="w-8 h-8 rounded-full"
                  />
                  <span>{course.instructor}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {course.duration}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {course.students.toLocaleString()} students
                </div>
                <div className="flex items-center gap-1 text-warning">
                  <Star className="w-4 h-4 fill-current" />
                  {course.rating} ({Math.floor(course.students / 10)} reviews)
                </div>
              </div>

              {enrolled && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">Your Progress</span>
                    <span className="text-sm font-medium text-primary">{progress}%</span>
                  </div>
                  <div className="h-3 bg-border rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      className="h-full gradient-bg rounded-full"
                    />
                  </div>
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-surface rounded-3xl p-6 md:p-8"
            >
              <h2 className="text-xl font-semibold text-foreground mb-6">Course Content</h2>
              <div className="space-y-4">
                {modules.map((module, i) => (
                  <div key={module.id} className="border border-border rounded-2xl overflow-hidden">
                    <button
                      onClick={() => setExpandedModule(expandedModule === i ? null : i)}
                      className="w-full flex items-center justify-between p-4 bg-background/50 hover:bg-background transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                          <span className="text-sm font-semibold text-primary">{module.id}</span>
                        </div>
                        <div className="text-left">
                          <h3 className="font-medium text-foreground">{module.title}</h3>
                          <p className="text-sm text-muted">{module.lessons.length} lessons • {module.duration}</p>
                        </div>
                      </div>
                      {expandedModule === i ? (
                        <ChevronDown className="w-5 h-5 text-muted" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-muted" />
                      )}
                    </button>

                    <AnimatePresence>
                      {expandedModule === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="p-4 pt-0 space-y-2">
                            {module.lessons.map((lesson) => (
                              <div
                                key={lesson.id}
                                className={`flex items-center justify-between p-3 rounded-xl ${enrolled || lesson.free ? 'hover:bg-background cursor-pointer' : 'opacity-60'
                                  } transition-colors`}
                              >
                                <div className="flex items-center gap-3">
                                  {lesson.type === 'video' ? (
                                    <Video className="w-4 h-4 text-primary" />
                                  ) : lesson.type === 'quiz' ? (
                                    <FileText className="w-4 h-4 text-warning" />
                                  ) : (
                                    <BookOpen className="w-4 h-4 text-success" />
                                  )}
                                  <span className="text-sm text-foreground">{lesson.title}</span>
                                  {lesson.free && !enrolled && (
                                    <span className="px-2 py-0.5 bg-success/10 text-success text-xs rounded-full">
                                      Free
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-muted">{lesson.duration}</span>
                                  {!enrolled && !lesson.free ? (
                                    <Lock className="w-4 h-4 text-muted" />
                                  ) : enrolled ? (
                                    <CheckCircle className="w-4 h-4 text-success" />
                                  ) : null}
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-surface rounded-3xl p-6 sticky top-24"
            >
              {course.isPaid && !enrolled && (
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-foreground mb-2">
                    ${course.price}
                  </div>
                  <p className="text-sm text-muted">One-time payment • Lifetime access</p>
                </div>
              )}

              {enrolled ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleContinue}
                  className="w-full gradient-bg text-white py-4 rounded-2xl font-semibold text-lg shadow-lg shadow-primary/25 flex items-center justify-center gap-2 mb-4"
                >
                  <Play className="w-5 h-5" />
                  Continue Learning
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className={`w-full py-4 rounded-2xl font-semibold text-lg shadow-lg flex items-center justify-center gap-2 mb-4 ${course.isPaid
                      ? 'bg-warning text-white shadow-warning/25'
                      : 'gradient-bg text-white shadow-primary/25'
                    }`}
                >
                  {enrolling ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : course.isPaid ? (
                    <>
                      <CreditCard className="w-5 h-5" />
                      Purchase Course
                    </>
                  ) : (
                    <>
                      <BookOpen className="w-5 h-5" />
                      Enroll for Free
                    </>
                  )}
                </motion.button>
              )}

              <div className="space-y-4 pt-6 border-t border-border">
                <h3 className="font-semibold text-foreground">This course includes:</h3>
                {[
                  { icon: Video, text: `${course.duration} of video content` },
                  { icon: FileText, text: '15+ assignments & projects' },
                  { icon: Award, text: 'Certificate of completion' },
                  { icon: Clock, text: 'Lifetime access' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-muted">
                    <item.icon className="w-5 h-5 text-primary" />
                    {item.text}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showPayment && (
          <PaymentModal
            course={course}
            onClose={() => setShowPayment(false)}
            onSuccess={handlePaymentSuccess}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
