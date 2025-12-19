import { motion } from 'framer-motion'
import { Clock, Users, Star, Play, BookOpen, Lock, CreditCard } from 'lucide-react'
import { useAuth } from '../App'

interface Course {
  id: number
  title: string
  instructor: string
  category: string
  duration: string
  students: number
  rating: number
  image: string
  progress?: number
  price?: number
  isPaid?: boolean
}

interface CourseCardProps {
  course: Course
  index: number
  compact?: boolean
  onClick?: () => void
}

export default function CourseCard({ course, index, compact = false, onClick }: CourseCardProps) {
  const { isEnrolled, getProgress } = useAuth()
  const enrolled = isEnrolled(course.id)
  const progress = getProgress(course.id)

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ y: -5 }}
        onClick={onClick}
        className="bg-background rounded-2xl overflow-hidden shadow-lg shadow-black/5 border border-border hover:border-primary/50 transition-all cursor-pointer group"
      >
        <div className="relative h-32">
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <span className="absolute top-2 left-2 px-2 py-1 bg-white/20 backdrop-blur-lg text-white text-xs font-medium rounded-lg capitalize">
            {course.category}
          </span>
          {course.isPaid && !enrolled && (
            <span className="absolute top-2 right-2 px-2 py-1 bg-warning/90 text-white text-xs font-medium rounded-lg flex items-center gap-1">
              <CreditCard className="w-3 h-3" />
              ${course.price}
            </span>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors">
            {course.title}
          </h3>
          <p className="text-sm text-muted mb-2">{course.instructor}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-warning">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-sm font-medium">{course.rating}</span>
            </div>
            <span className="text-xs text-muted">{course.duration}</span>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      onClick={onClick}
      className="bg-surface rounded-2xl overflow-hidden shadow-lg shadow-black/5 border border-border hover:border-primary/50 transition-all cursor-pointer group"
    >
      <div className="relative h-48">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="px-3 py-1 bg-white/20 backdrop-blur-lg text-white text-xs font-medium rounded-lg capitalize">
            {course.category}
          </span>
          {course.isPaid && !enrolled && (
            <span className="px-3 py-1 bg-warning/90 text-white text-xs font-medium rounded-lg flex items-center gap-1">
              <CreditCard className="w-3 h-3" />
              ${course.price}
            </span>
          )}
          {!course.isPaid && !enrolled && (
            <span className="px-3 py-1 bg-success/90 text-white text-xs font-medium rounded-lg">
              Free
            </span>
          )}
        </div>
        {enrolled && progress > 0 && (
          <div className="absolute bottom-3 left-3 right-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="flex-1 h-1.5 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-white text-xs font-medium">{progress}%</span>
            </div>
          </div>
        )}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-3 right-3 w-10 h-10 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {enrolled ? <Play className="w-5 h-5 ml-0.5" /> : course.isPaid ? <Lock className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
        </motion.button>
      </div>

      <div className="p-5">
        <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {course.title}
        </h3>
        <p className="text-sm text-muted mb-4">{course.instructor}</p>

        <div className="flex items-center gap-4 text-sm text-muted mb-4">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {course.duration}
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {course.students.toLocaleString()}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-warning">
            <Star className="w-4 h-4 fill-current" />
            <span className="font-medium">{course.rating}</span>
            <span className="text-muted text-sm">({Math.floor(course.students / 10)} reviews)</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${enrolled
                ? 'bg-primary/10 text-primary hover:bg-primary/20'
                : course.isPaid
                  ? 'bg-warning text-white shadow-lg shadow-warning/25'
                  : 'gradient-bg text-white shadow-lg shadow-primary/25'
              }`}
          >
            {enrolled ? (
              <span className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                Continue
              </span>
            ) : course.isPaid ? (
              <span className="flex items-center gap-1">
                <CreditCard className="w-4 h-4" />
                Buy ${course.price}
              </span>
            ) : (
              'Enroll Free'
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
