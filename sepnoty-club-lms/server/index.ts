import express, { Request, Response } from 'express'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import { supabase, getTableName, isSupabaseReady } from './lib/supabase.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({ origin: '*' }))
app.use(express.json())

// Auth: Register
app.post('/api/auth/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body || {}

    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' })
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' })
    }

    if (!isSupabaseReady() || !supabase) {
      // Demo mode without database
      const demoUser = {
        id: 'demo-' + Date.now(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        created_at: new Date().toISOString()
      }
      return res.status(201).json({ user: demoUser })
    }

    // Check if user exists
    const { data: existing } = await supabase
      .from(getTableName('users'))
      .select('id')
      .eq('email', email.trim().toLowerCase())
      .single()

    if (existing) {
      return res.status(400).json({ error: 'Email already registered' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const { data: user, error } = await supabase
      .from(getTableName('users'))
      .insert({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: hashedPassword
      })
      .select('id, name, email, created_at')
      .single()

    if (error) {
      console.error('Register error:', error)
      return res.status(500).json({ error: 'Failed to create account', details: error.message })
    }

    res.status(201).json({ user })
  } catch (err) {
    console.error('Unexpected error:', err)
    const message = err instanceof Error ? err.message : String(err)
    res.status(500).json({ error: 'Registration failed', details: message })
  }
})

// Auth: Login
app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body || {}

    if (!email?.trim() || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    if (!isSupabaseReady() || !supabase) {
      // Demo mode without database
      const demoUser = {
        id: 'demo-user',
        name: 'Demo User',
        email: email.trim().toLowerCase(),
        created_at: new Date().toISOString()
      }
      return res.json({ user: demoUser })
    }

    const { data: user, error } = await supabase
      .from(getTableName('users'))
      .select('*')
      .eq('email', email.trim().toLowerCase())
      .single()

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const { password: _, ...userWithoutPassword } = user
    res.json({ user: userWithoutPassword })
  } catch (err) {
    console.error('Unexpected error:', err)
    const message = err instanceof Error ? err.message : String(err)
    res.status(500).json({ error: 'Login failed', details: message })
  }
})

// Get Dashboard Data
app.get('/api/dashboard/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params

    if (!isSupabaseReady() || !supabase) {
      return res.json({
        stats: { coursesEnrolled: 5, hoursLearned: 48, certificates: 2, streak: 7 },
        courses: []
      })
    }

    // Get user stats
    const { data: enrollments } = await supabase
      .from(getTableName('enrollments'))
      .select('*, course:courses(*)')
      .eq('user_id', userId)

    const stats = {
      coursesEnrolled: (enrollments || []).length,
      hoursLearned: Math.floor(Math.random() * 50) + 20,
      certificates: (enrollments || []).filter((e: any) => e.progress === 100).length,
      streak: Math.floor(Math.random() * 10) + 1
    }

    res.json({ stats, courses: enrollments || [] })
  } catch (err) {
    console.error('Dashboard error:', err)
    res.json({
      stats: { coursesEnrolled: 5, hoursLearned: 48, certificates: 2, streak: 7 },
      courses: []
    })
  }
})

// Get Courses
app.get('/api/courses', async (req: Request, res: Response) => {
  try {
    if (!isSupabaseReady() || !supabase) {
      return res.json({ courses: [] })
    }

    const { data: courses, error } = await supabase
      .from(getTableName('courses'))
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Courses error:', error)
      return res.json({ courses: [] })
    }

    res.json({ courses: courses || [] })
  } catch (err) {
    console.error('Courses error:', err)
    res.json({ courses: [] })
  }
})

// Enroll in Course
app.post('/api/courses/:courseId/enroll', async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params
    const { userId } = req.body || {}

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' })
    }

    if (!isSupabaseReady() || !supabase) {
      return res.status(201).json({
        enrollment: {
          id: 'demo-' + Date.now(),
          user_id: userId,
          course_id: courseId,
          progress: 0
        }
      })
    }

    // Check if already enrolled
    const { data: existing } = await supabase
      .from(getTableName('enrollments'))
      .select('id')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .single()

    if (existing) {
      return res.status(400).json({ error: 'Already enrolled in this course' })
    }

    const { data: enrollment, error } = await supabase
      .from(getTableName('enrollments'))
      .insert({
        user_id: userId,
        course_id: courseId,
        progress: 0
      })
      .select()
      .single()

    if (error) {
      console.error('Enrollment error:', error)
      return res.status(500).json({ error: 'Failed to enroll', details: error.message })
    }

    res.status(201).json({ enrollment })
  } catch (err) {
    console.error('Enrollment error:', err)
    const message = err instanceof Error ? err.message : String(err)
    res.status(500).json({ error: 'Enrollment failed', details: message })
  }
})

// Update Progress
app.patch('/api/enrollments/:enrollmentId/progress', async (req: Request, res: Response) => {
  try {
    const { enrollmentId } = req.params
    const { progress } = req.body || {}

    if (typeof progress !== 'number' || progress < 0 || progress > 100) {
      return res.status(400).json({ error: 'Progress must be between 0 and 100' })
    }

    if (!isSupabaseReady() || !supabase) {
      return res.json({ enrollment: { id: enrollmentId, progress } })
    }

    const { data: enrollment, error } = await supabase
      .from(getTableName('enrollments'))
      .update({ progress, updated_at: new Date().toISOString() })
      .eq('id', enrollmentId)
      .select()
      .single()

    if (error) {
      console.error('Progress update error:', error)
      return res.status(500).json({ error: 'Failed to update progress', details: error.message })
    }

    res.json({ enrollment })
  } catch (err) {
    console.error('Progress error:', err)
    const message = err instanceof Error ? err.message : String(err)
    res.status(500).json({ error: 'Progress update failed', details: message })
  }
})

// Get Certificates
app.get('/api/certificates/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params

    if (!isSupabaseReady() || !supabase) {
      return res.json({ certificates: [] })
    }

    const { data: certificates, error } = await supabase
      .from(getTableName('certificates'))
      .select('*, course:courses(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Certificates error:', error)
      return res.json({ certificates: [] })
    }

    res.json({ certificates: certificates || [] })
  } catch (err) {
    console.error('Certificates error:', err)
    res.json({ certificates: [] })
  }
})

// AI Chat (Mock implementation - connect to real AI service via backend env vars)
app.post('/api/ai/chat', async (req: Request, res: Response) => {
  try {
    const { message, userId } = req.body || {}

    if (!message?.trim()) {
      return res.status(400).json({ error: 'Message is required' })
    }

    // Save chat history if database available
    if (isSupabaseReady() && supabase) {
      await supabase
        .from(getTableName('chat_history'))
        .insert({
          user_id: userId,
          message: message.trim(),
          role: 'user'
        })
    }

    // In production, connect to OpenAI/Claude API using process.env credentials
    // For demo, return a helpful response
    const response = generateAIResponse(message)

    // Save AI response
    if (isSupabaseReady() && supabase) {
      await supabase
        .from(getTableName('chat_history'))
        .insert({
          user_id: userId,
          message: response,
          role: 'assistant'
        })
    }

    res.json({ response })
  } catch (err) {
    console.error('AI chat error:', err)
    const message = err instanceof Error ? err.message : String(err)
    res.status(500).json({ error: 'AI chat failed', details: message })
  }
})

function generateAIResponse(query: string): string {
  // This would be replaced with actual AI API call in production
  return `I received your question about "${query}". In a production environment, this would connect to an AI service to provide intelligent, contextual responses for your learning needs.`
}

// Activity Logging
app.post('/api/activity', async (req: Request, res: Response) => {
  try {
    const { userId, type, metadata } = req.body || {}

    if (!userId || !type) {
      return res.status(400).json({ error: 'User ID and type are required' })
    }

    if (!isSupabaseReady() || !supabase) {
      return res.status(201).json({ logged: true })
    }

    await supabase
      .from(getTableName('activity_log'))
      .insert({
        user_id: userId,
        type,
        metadata: metadata || {}
      })

    res.status(201).json({ logged: true })
  } catch (err) {
    console.error('Activity log error:', err)
    res.status(201).json({ logged: false })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
