-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  avatar TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  instructor TEXT NOT NULL,
  category TEXT NOT NULL,
  duration TEXT NOT NULL,
  image TEXT,
  rating DECIMAL(2,1) DEFAULT 0,
  students INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enrollments table
CREATE TABLE IF NOT EXISTS enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  course_id UUID NOT NULL,
  progress INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Certificates table
CREATE TABLE IF NOT EXISTS certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  course_id UUID NOT NULL,
  credential_id TEXT UNIQUE NOT NULL,
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat history for AI tutor
CREATE TABLE IF NOT EXISTS chat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  message TEXT NOT NULL,
  role TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activity log for analytics
CREATE TABLE IF NOT EXISTS activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  type TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_enrollments_user ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_certificates_user ON certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_history_user ON chat_history(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_user ON activity_log(user_id);

-- Add any missing columns to existing tables
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar TEXT;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS rating DECIMAL(2,1) DEFAULT 0;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS students INTEGER DEFAULT 0;
ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;
